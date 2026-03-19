import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function WorkspaceStructure() {
  return (
    <div className="prose-rust">
      <h1>Cargo Workspace + Python Package</h1>

      <p>
        Real-world Rust-Python packages are not single files. They use a
        Cargo workspace to separate the core Rust logic from the PyO3
        bindings, with a Python package layer on top. This is exactly how
        Polars, tokenizers, and other production tools are structured.
      </p>

      <ConceptBlock title="The Three-Layer Architecture">
        <p>
          Production Rust-Python packages follow a pattern:
        </p>
        <p>
          <strong>1. Core crate</strong> — Pure Rust library with no Python
          dependency. Testable, reusable, fast.
        </p>
        <p>
          <strong>2. Bindings crate</strong> — PyO3 wrapper that exposes
          the core to Python. Thin layer of type conversions.
        </p>
        <p>
          <strong>3. Python package</strong> — Python code that provides a
          Pythonic API, adds convenience functions, and re-exports the Rust
          bindings.
        </p>
      </ConceptBlock>

      <h2>Project Layout</h2>

      <PythonRustCompare
        title="Comparing project structures"
        description="A pure Python package vs a Rust-backed Python package."
        pythonCode={`# Pure Python package structure
# my_package/
# ├── pyproject.toml
# ├── my_package/
# │   ├── __init__.py
# │   ├── core.py          # main logic
# │   ├── utils.py         # helpers
# │   └── types.py         # type definitions
# └── tests/
#     └── test_core.py

# pyproject.toml
# [project]
# name = "my-package"
# version = "0.1.0"
# [build-system]
# requires = ["setuptools"]
# build-backend = "setuptools.build_meta"`}
        rustCode={`# Rust-backed Python package structure
# my_package/
# ├── Cargo.toml           # workspace root
# ├── pyproject.toml        # Python package config
# ├── crates/
# │   ├── core/            # Pure Rust library
# │   │   ├── Cargo.toml
# │   │   └── src/
# │   │       └── lib.rs
# │   └── python/          # PyO3 bindings
# │       ├── Cargo.toml
# │       └── src/
# │           └── lib.rs
# ├── python/
# │   └── my_package/      # Python package
# │       ├── __init__.py
# │       └── utils.py     # Python-level helpers
# └── tests/
#     ├── test_rust.rs      # Rust tests
#     └── test_python.py    # Python tests`}
      />

      <h2>Workspace Cargo.toml</h2>

      <CodeBlock
        language="toml"
        title="Root Cargo.toml — workspace definition"
        code={`# Cargo.toml (workspace root)
[workspace]
members = [
    "crates/core",
    "crates/python",
]
resolver = "2"

# Shared dependencies — all crates use the same versions
[workspace.dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
ndarray = "0.16"
rayon = "1.10"
pyo3 = { version = "0.23", features = ["extension-module"] }`}
      />

      <CodeBlock
        language="toml"
        title="Core crate Cargo.toml — pure Rust"
        code={`# crates/core/Cargo.toml
[package]
name = "my-package-core"
version = "0.1.0"
edition = "2021"

# NO pyo3 dependency! This is pure Rust.
[dependencies]
serde = { workspace = true }
ndarray = { workspace = true }
rayon = { workspace = true }`}
      />

      <CodeBlock
        language="toml"
        title="Python bindings Cargo.toml"
        code={`# crates/python/Cargo.toml
[package]
name = "my-package-python"
version = "0.1.0"
edition = "2021"

[lib]
name = "_my_package"  # underscore prefix by convention
crate-type = ["cdylib"]

[dependencies]
my-package-core = { path = "../core" }  # depend on core
pyo3 = { workspace = true }`}
      />

      <h2>The Core Crate</h2>

      <CodeBlock
        language="rust"
        title="crates/core/src/lib.rs — pure Rust logic"
        code={`// No PyO3 imports! This is a normal Rust library.

pub struct DataPipeline {
    scale: f64,
    offset: f64,
}

impl DataPipeline {
    pub fn new(scale: f64, offset: f64) -> Self {
        DataPipeline { scale, offset }
    }

    pub fn transform(&self, data: &[f64]) -> Vec<f64> {
        data.iter()
            .map(|&x| x * self.scale + self.offset)
            .collect()
    }

    pub fn batch_transform(&self, batches: &[Vec<f64>]) -> Vec<Vec<f64>> {
        use rayon::prelude::*;
        batches.par_iter()
            .map(|batch| self.transform(batch))
            .collect()
    }

    pub fn stats(data: &[f64]) -> (f64, f64) {
        let n = data.len() as f64;
        let mean = data.iter().sum::<f64>() / n;
        let variance = data.iter()
            .map(|&x| (x - mean).powi(2))
            .sum::<f64>() / n;
        (mean, variance)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_transform() {
        let pipeline = DataPipeline::new(2.0, 1.0);
        let result = pipeline.transform(&[1.0, 2.0, 3.0]);
        assert_eq!(result, vec![3.0, 5.0, 7.0]);
    }
}`}
      />

      <h2>The Bindings Crate</h2>

      <CodeBlock
        language="rust"
        title="crates/python/src/lib.rs — thin PyO3 wrapper"
        code={`use pyo3::prelude::*;
use my_package_core::DataPipeline as CorePipeline;

#[pyclass]
struct DataPipeline {
    inner: CorePipeline,
}

#[pymethods]
impl DataPipeline {
    #[new]
    #[pyo3(signature = (scale=1.0, offset=0.0))]
    fn new(scale: f64, offset: f64) -> Self {
        DataPipeline {
            inner: CorePipeline::new(scale, offset),
        }
    }

    fn transform(&self, data: Vec<f64>) -> Vec<f64> {
        self.inner.transform(&data)
    }

    fn batch_transform(&self, batches: Vec<Vec<f64>>) -> Vec<Vec<f64>> {
        self.inner.batch_transform(&batches)
    }

    #[staticmethod]
    fn stats(data: Vec<f64>) -> (f64, f64) {
        CorePipeline::stats(&data)
    }
}

#[pymodule]
fn _my_package(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<DataPipeline>()?;
    Ok(())
}`}
      />

      <NoteBlock type="tip" title="Why separate core and bindings?">
        Keeping the core crate free of PyO3 gives you three benefits:
        (1) the core can be used in other Rust projects without Python,
        (2) Rust tests run without Python,
        (3) compilation is faster because the core only rebuilds when logic
        changes, not when the Python API changes.
      </NoteBlock>

      <h2>The Python Layer</h2>

      <CodeBlock
        language="python"
        title="python/my_package/__init__.py"
        code={`# Re-export Rust bindings
from ._my_package import DataPipeline

# Add Python-level convenience
def quick_transform(data, scale=1.0, offset=0.0):
    """One-shot transform without creating a pipeline."""
    pipeline = DataPipeline(scale=scale, offset=offset)
    return pipeline.transform(data)

__all__ = ["DataPipeline", "quick_transform"]
__version__ = "0.1.0"`}
      />

      <ExerciseBlock
        title="Design a Package Layout"
        difficulty="intermediate"
        problem={`You want to build a Python package called "fast_text" that provides:
- A TextCleaner class that normalizes and tokenizes text
- A batch_process function that processes many texts in parallel
- A sentiment function that returns a score for text

Design the project structure:
1. What files go in crates/core/src/?
2. What does crates/python/src/lib.rs export?
3. What Python convenience functions would you add in python/fast_text/__init__.py?

Draw out the directory tree and describe each file's role.`}
        solution={`Directory structure:

fast_text/
├── Cargo.toml                 # Workspace: members = ["crates/core", "crates/python"]
├── pyproject.toml             # [tool.maturin] module-name = "fast_text._fast_text"
├── crates/
│   ├── core/
│   │   ├── Cargo.toml         # deps: rayon, unicode-segmentation
│   │   └── src/
│   │       ├── lib.rs         # pub mod cleaner; pub mod sentiment;
│   │       ├── cleaner.rs     # pub struct TextCleaner { rules }
│   │       │                  #   pub fn clean(&self, text: &str) -> String
│   │       │                  #   pub fn tokenize(&self, text: &str) -> Vec<String>
│   │       └── sentiment.rs   # pub fn score(text: &str) -> f64
│   │                          #   (keyword-based or simple model)
│   └── python/
│       ├── Cargo.toml         # deps: fast-text-core, pyo3
│       └── src/
│           └── lib.rs         # #[pyclass] TextCleaner wrapping core::TextCleaner
│                              # #[pyfunction] batch_process (uses rayon)
│                              # #[pyfunction] sentiment
│                              # #[pymodule] _fast_text
├── python/
│   └── fast_text/
│       ├── __init__.py        # from ._fast_text import TextCleaner, batch_process, sentiment
│       │                      # def clean_texts(texts): return batch_process(texts)
│       └── utils.py           # Python-only helpers (pandas integration, etc.)
└── tests/
    ├── test_core.rs           # Rust unit tests for cleaner and sentiment
    └── test_python.py         # pytest tests calling the Python API

Key principle: crates/core has ZERO Python dependency.
It can be tested with "cargo test" alone.
The Python bindings are a thin wrapper that handles type conversion.`}
      />
    </div>
  );
}
