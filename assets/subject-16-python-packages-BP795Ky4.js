import{j as e}from"./vendor-Dh_dlHsl.js";import{C as r,P as s,a as t,N as a,E as n}from"./subject-01-getting-started-DoSDK0Fn.js";function o(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Cargo Workspace + Python Package"}),e.jsx("p",{children:"Real-world Rust-Python packages are not single files. They use a Cargo workspace to separate the core Rust logic from the PyO3 bindings, with a Python package layer on top. This is exactly how Polars, tokenizers, and other production tools are structured."}),e.jsxs(r,{title:"The Three-Layer Architecture",children:[e.jsx("p",{children:"Production Rust-Python packages follow a pattern:"}),e.jsxs("p",{children:[e.jsx("strong",{children:"1. Core crate"})," — Pure Rust library with no Python dependency. Testable, reusable, fast."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2. Bindings crate"})," — PyO3 wrapper that exposes the core to Python. Thin layer of type conversions."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3. Python package"})," — Python code that provides a Pythonic API, adds convenience functions, and re-exports the Rust bindings."]})]}),e.jsx("h2",{children:"Project Layout"}),e.jsx(s,{title:"Comparing project structures",description:"A pure Python package vs a Rust-backed Python package.",pythonCode:`# Pure Python package structure
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
# build-backend = "setuptools.build_meta"`,rustCode:`# Rust-backed Python package structure
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
#     └── test_python.py    # Python tests`}),e.jsx("h2",{children:"Workspace Cargo.toml"}),e.jsx(t,{language:"toml",title:"Root Cargo.toml — workspace definition",code:`# Cargo.toml (workspace root)
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
pyo3 = { version = "0.23", features = ["extension-module"] }`}),e.jsx(t,{language:"toml",title:"Core crate Cargo.toml — pure Rust",code:`# crates/core/Cargo.toml
[package]
name = "my-package-core"
version = "0.1.0"
edition = "2021"

# NO pyo3 dependency! This is pure Rust.
[dependencies]
serde = { workspace = true }
ndarray = { workspace = true }
rayon = { workspace = true }`}),e.jsx(t,{language:"toml",title:"Python bindings Cargo.toml",code:`# crates/python/Cargo.toml
[package]
name = "my-package-python"
version = "0.1.0"
edition = "2021"

[lib]
name = "_my_package"  # underscore prefix by convention
crate-type = ["cdylib"]

[dependencies]
my-package-core = { path = "../core" }  # depend on core
pyo3 = { workspace = true }`}),e.jsx("h2",{children:"The Core Crate"}),e.jsx(t,{language:"rust",title:"crates/core/src/lib.rs — pure Rust logic",code:`// No PyO3 imports! This is a normal Rust library.

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
}`}),e.jsx("h2",{children:"The Bindings Crate"}),e.jsx(t,{language:"rust",title:"crates/python/src/lib.rs — thin PyO3 wrapper",code:`use pyo3::prelude::*;
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
}`}),e.jsx(a,{type:"tip",title:"Why separate core and bindings?",children:"Keeping the core crate free of PyO3 gives you three benefits: (1) the core can be used in other Rust projects without Python, (2) Rust tests run without Python, (3) compilation is faster because the core only rebuilds when logic changes, not when the Python API changes."}),e.jsx("h2",{children:"The Python Layer"}),e.jsx(t,{language:"python",title:"python/my_package/__init__.py",code:`# Re-export Rust bindings
from ._my_package import DataPipeline

# Add Python-level convenience
def quick_transform(data, scale=1.0, offset=0.0):
    """One-shot transform without creating a pipeline."""
    pipeline = DataPipeline(scale=scale, offset=offset)
    return pipeline.transform(data)

__all__ = ["DataPipeline", "quick_transform"]
__version__ = "0.1.0"`}),e.jsx(n,{title:"Design a Package Layout",difficulty:"intermediate",problem:`You want to build a Python package called "fast_text" that provides:
- A TextCleaner class that normalizes and tokenizes text
- A batch_process function that processes many texts in parallel
- A sentiment function that returns a score for text

Design the project structure:
1. What files go in crates/core/src/?
2. What does crates/python/src/lib.rs export?
3. What Python convenience functions would you add in python/fast_text/__init__.py?

Draw out the directory tree and describe each file's role.`,solution:`Directory structure:

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
The Python bindings are a thin wrapper that handles type conversion.`})]})}const u=Object.freeze(Object.defineProperty({__proto__:null,default:o},Symbol.toStringTag,{value:"Module"}));function i(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"NumPy Integration with rust-numpy"}),e.jsxs("p",{children:["The biggest performance bottleneck in PyO3 is converting Python lists to Rust vectors — it copies every element. For numerical data, the"," ",e.jsx("code",{children:"rust-numpy"})," crate eliminates this entirely by giving Rust direct, zero-copy access to NumPy array buffers. Your Rust code reads and writes the same memory that NumPy allocated."]}),e.jsx(r,{title:"Zero-Copy NumPy Access",children:e.jsxs("p",{children:["NumPy arrays store data in contiguous C-style buffers. The"," ",e.jsx("code",{children:"rust-numpy"})," crate provides ",e.jsx("code",{children:"PyReadonlyArray"}),"for read access and ",e.jsx("code",{children:"PyReadwriteArray"})," for write access to these buffers. No data is copied — Rust operates directly on NumPy's memory. This is the same technique used by Polars, tiktoken, and other high-performance Python extensions."]})}),e.jsx("h2",{children:"Reading NumPy Arrays"}),e.jsx(s,{title:"Processing NumPy data in Rust",description:"Zero-copy access means no conversion overhead, even for million-element arrays.",pythonCode:`import numpy as np
from my_lib import fast_sum, fast_normalize

# Create a large NumPy array
data = np.random.rand(10_000_000)

# Call Rust function — no copy!
# The Rust code reads NumPy's memory directly
total = fast_sum(data)
print(f"Sum: {total:.4f}")

# In-place modification — Rust writes to NumPy's buffer
fast_normalize(data)  # modifies data in place
print(f"Mean after normalize: {data.mean():.6f}")
# Should be approximately 0.0`,rustCode:`use pyo3::prelude::*;
use numpy::{PyReadonlyArray1, PyReadwriteArray1, PyArray1};

/// Sum a NumPy array — zero-copy read access
#[pyfunction]
fn fast_sum(array: PyReadonlyArray1<'_, f64>) -> f64 {
    let slice = array.as_slice().unwrap();
    // 'slice' points directly to NumPy's memory
    // No copy occurred!
    slice.iter().sum()
}

/// Normalize in place — zero-copy write access
#[pyfunction]
fn fast_normalize(mut array: PyReadwriteArray1<'_, f64>) {
    let slice = array.as_slice_mut().unwrap();

    // Compute mean
    let n = slice.len() as f64;
    let mean = slice.iter().sum::<f64>() / n;
    let std = (slice.iter()
        .map(|&x| (x - mean).powi(2))
        .sum::<f64>() / n).sqrt();

    // Modify in place — writes to NumPy's buffer!
    for x in slice.iter_mut() {
        *x = (*x - mean) / std;
    }
}

#[pymodule]
fn my_lib(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(fast_sum, m)?)?;
    m.add_function(wrap_pyfunction!(fast_normalize, m)?)?;
    Ok(())
}`}),e.jsx(a,{type:"pythonista",title:"This is how Polars works",children:"When you pass a NumPy array or Pandas column to Polars, it often accesses the underlying buffer directly using the same zero-copy mechanism. This is why Polars can process DataFrames without doubling memory usage — it reads the data where it already is."}),e.jsx("h2",{children:"Returning NumPy Arrays"}),e.jsx(t,{language:"rust",title:"Creating new NumPy arrays from Rust",code:`use pyo3::prelude::*;
use numpy::{PyArray1, PyArray2, IntoPyArray};
use ndarray::{Array1, Array2};

/// Return a new 1D NumPy array
#[pyfunction]
fn linspace<'py>(
    py: Python<'py>,
    start: f64,
    end: f64,
    n: usize,
) -> Bound<'py, PyArray1<f64>> {
    let step = (end - start) / (n - 1) as f64;
    let data: Vec<f64> = (0..n)
        .map(|i| start + i as f64 * step)
        .collect();
    // Converts Vec to NumPy array (one copy, then NumPy owns it)
    PyArray1::from_vec(py, data)
}

/// Return a 2D NumPy array using ndarray
#[pyfunction]
fn random_matrix<'py>(
    py: Python<'py>,
    rows: usize,
    cols: usize,
) -> Bound<'py, PyArray2<f64>> {
    // Use ndarray for 2D operations
    let array = Array2::from_shape_fn((rows, cols), |(i, j)| {
        ((i * cols + j) as f64 * 0.618).sin()
    });
    // Convert ndarray to NumPy array
    array.into_pyarray(py)
}

/// Element-wise operation returning a new array
#[pyfunction]
fn softmax<'py>(
    py: Python<'py>,
    logits: numpy::PyReadonlyArray1<'_, f64>,
) -> Bound<'py, PyArray1<f64>> {
    let slice = logits.as_slice().unwrap();
    let max = slice.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    let exp_sum: f64 = slice.iter().map(|&x| (x - max).exp()).sum();
    let result: Vec<f64> = slice.iter()
        .map(|&x| (x - max).exp() / exp_sum)
        .collect();
    PyArray1::from_vec(py, result)
}

#[pymodule]
fn my_lib(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(linspace, m)?)?;
    m.add_function(wrap_pyfunction!(random_matrix, m)?)?;
    m.add_function(wrap_pyfunction!(softmax, m)?)?;
    Ok(())
}`}),e.jsx("h2",{children:"2D Array Operations"}),e.jsx(t,{language:"rust",title:"Working with 2D NumPy arrays",code:`use pyo3::prelude::*;
use numpy::{PyReadonlyArray2, PyArray1, PyArray2};

/// Row-wise sum of a 2D array
#[pyfunction]
fn row_sums<'py>(
    py: Python<'py>,
    matrix: PyReadonlyArray2<'_, f64>,
) -> Bound<'py, PyArray1<f64>> {
    let array = matrix.as_array();
    let sums: Vec<f64> = array.rows().into_iter()
        .map(|row| row.sum())
        .collect();
    PyArray1::from_vec(py, sums)
}

/// Matrix-vector multiply
#[pyfunction]
fn matvec<'py>(
    py: Python<'py>,
    matrix: PyReadonlyArray2<'_, f64>,
    vector: numpy::PyReadonlyArray1<'_, f64>,
) -> Bound<'py, PyArray1<f64>> {
    let mat = matrix.as_array();
    let vec = vector.as_array();
    let result: Vec<f64> = mat.rows().into_iter()
        .map(|row| row.dot(&vec))
        .collect();
    PyArray1::from_vec(py, result)
}

// Python usage:
// import numpy as np
// m = np.array([[1, 2], [3, 4]], dtype=np.float64)
// v = np.array([1, 1], dtype=np.float64)
// result = matvec(m, v)  # [3.0, 7.0]`}),e.jsxs(a,{type:"warning",title:"Dtype must match",children:["If your Rust function expects ",e.jsx("code",{children:"PyReadonlyArray1<f64>"}),", the NumPy array must have dtype ",e.jsx("code",{children:"float64"}),". Passing a",e.jsx("code",{children:"float32"})," or ",e.jsx("code",{children:"int64"})," array will raise a"," ",e.jsx("code",{children:"TypeError"}),". Use ",e.jsx("code",{children:".astype(np.float64)"})," on the Python side, or accept multiple types with generics."]}),e.jsx(t,{language:"toml",title:"Cargo.toml",code:`[dependencies]
pyo3 = { version = "0.23", features = ["extension-module"] }
numpy = "0.23"       # rust-numpy crate
ndarray = "0.16"     # for 2D array operations`}),e.jsx(n,{title:"Build a Fast Distance Matrix",difficulty:"advanced",problem:`Write a PyO3 function that computes the Euclidean distance matrix between N points:

1. Input: 2D NumPy array of shape (n, d) — n points in d dimensions
2. Output: 2D NumPy array of shape (n, n) — distance[i][j] = euclidean distance between point i and j

Use PyReadonlyArray2 for input and return a new PyArray2.

Test with:
  points = np.array([[0, 0], [1, 0], [0, 1]], dtype=np.float64)
  dists = distance_matrix(points)
  # Expected: [[0, 1, 1], [1, 0, 1.414], [1, 1.414, 0]]

Bonus: parallelize the outer loop with rayon.`,solution:`use pyo3::prelude::*;
use numpy::{PyReadonlyArray2, PyArray2};

#[pyfunction]
fn distance_matrix<'py>(
    py: Python<'py>,
    points: PyReadonlyArray2<'_, f64>,
) -> Bound<'py, PyArray2<f64>> {
    let arr = points.as_array();
    let n = arr.nrows();
    let d = arr.ncols();

    let mut distances = vec![0.0_f64; n * n];

    for i in 0..n {
        for j in i+1..n {
            let dist: f64 = (0..d)
                .map(|k| (arr[[i, k]] - arr[[j, k]]).powi(2))
                .sum::<f64>()
                .sqrt();
            distances[i * n + j] = dist;
            distances[j * n + i] = dist; // symmetric
        }
    }

    let array = ndarray::Array2::from_shape_vec((n, n), distances)
        .unwrap();
    numpy::IntoPyArray::into_pyarray(array, py)
}

// With rayon parallelism:
// use rayon::prelude::*;
// let distances: Vec<f64> = (0..n)
//     .into_par_iter()
//     .flat_map(|i| {
//         (0..n).map(move |j| {
//             if i == j { return 0.0; }
//             (0..d).map(|k| (arr[[i,k]] - arr[[j,k]]).powi(2))
//                   .sum::<f64>().sqrt()
//         }).collect::<Vec<_>>()
//     })
//     .collect();`})]})}const f=Object.freeze(Object.defineProperty({__proto__:null,default:i},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Designing a Fluent API"}),e.jsxs("p",{children:["The best Python libraries have APIs that feel natural to chain: Polars' ",e.jsx("code",{children:"df.filter().select().group_by()"}),", Pandas' method chaining, or SQLAlchemy's query builder. When building Rust-backed Python packages, designing a fluent API makes your library feel Pythonic despite being powered by Rust underneath."]}),e.jsx(r,{title:"What Makes an API Fluent",children:e.jsxs("p",{children:["A fluent API returns ",e.jsx("code",{children:"self"})," from methods, enabling method chaining. In Python, this means returning ",e.jsx("code",{children:"self"}),"from each method. In Rust, the builder pattern achieves the same effect. The key is that each operation returns the modified object, not a bare value."]})}),e.jsx("h2",{children:"The Builder Pattern in Rust"}),e.jsx(s,{title:"Fluent builder in Python and Rust",description:"Both languages support method chaining, but Rust's ownership makes it more explicit.",pythonCode:`# Fluent API in Python
class Pipeline:
    def __init__(self):
        self._steps = []
        self._data = None

    def load(self, data):
        self._data = list(data)
        return self  # enables chaining

    def filter(self, predicate):
        self._data = [x for x in self._data
                      if predicate(x)]
        return self

    def map(self, func):
        self._data = [func(x) for x in self._data]
        return self

    def collect(self):
        return self._data

# Usage: method chaining
result = (Pipeline()
    .load([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(lambda x: x > 3)
    .map(lambda x: x * 2)
    .collect())
print(result)  # [8, 10, 12, 14, 16, 18, 20]`,rustCode:`struct Pipeline {
    data: Vec<f64>,
}

impl Pipeline {
    fn new() -> Self {
        Pipeline { data: vec![] }
    }

    // Each method consumes self and returns it
    fn load(mut self, data: Vec<f64>) -> Self {
        self.data = data;
        self
    }

    fn filter(mut self, predicate: impl Fn(&f64) -> bool) -> Self {
        self.data.retain(|x| predicate(x));
        self
    }

    fn map(mut self, func: impl Fn(f64) -> f64) -> Self {
        self.data = self.data.into_iter().map(func).collect();
        self
    }

    fn collect(self) -> Vec<f64> {
        self.data
    }
}

fn main() {
    let result = Pipeline::new()
        .load(vec![1.,2.,3.,4.,5.,6.,7.,8.,9.,10.])
        .filter(|&x| x > 3.0)
        .map(|x| x * 2.0)
        .collect();
    println!("{:?}", result);
    // [8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0]
}`}),e.jsx("h2",{children:"Exposing a Fluent API to Python via PyO3"}),e.jsx(t,{language:"rust",title:"PyO3 fluent builder that returns self",code:`use pyo3::prelude::*;

#[pyclass]
#[derive(Clone)]
struct DataPipeline {
    data: Vec<f64>,
    name: String,
}

#[pymethods]
impl DataPipeline {
    #[new]
    #[pyo3(signature = (name="pipeline"))]
    fn new(name: &str) -> Self {
        DataPipeline {
            data: vec![],
            name: name.to_string(),
        }
    }

    /// Load data — returns self for chaining
    fn load(mut slf: PyRefMut<'_, Self>, data: Vec<f64>) -> PyRefMut<'_, Self> {
        slf.data = data;
        slf
    }

    /// Filter values above threshold
    fn filter_above(mut slf: PyRefMut<'_, Self>, threshold: f64) -> PyRefMut<'_, Self> {
        slf.data.retain(|&x| x > threshold);
        slf
    }

    /// Scale all values
    fn scale(mut slf: PyRefMut<'_, Self>, factor: f64) -> PyRefMut<'_, Self> {
        for x in slf.data.iter_mut() {
            *x *= factor;
        }
        slf
    }

    /// Normalize to [0, 1] range
    fn normalize(mut slf: PyRefMut<'_, Self>) -> PyRefMut<'_, Self> {
        if let (Some(&min), Some(&max)) = (
            slf.data.iter().min_by(|a, b| a.partial_cmp(b).unwrap()),
            slf.data.iter().max_by(|a, b| a.partial_cmp(b).unwrap()),
        ) {
            let range = max - min;
            if range > 0.0 {
                for x in slf.data.iter_mut() {
                    *x = (*x - min) / range;
                }
            }
        }
        slf
    }

    /// Terminal operation — returns the data
    fn collect(&self) -> Vec<f64> {
        self.data.clone()
    }

    fn mean(&self) -> Option<f64> {
        if self.data.is_empty() { return None; }
        Some(self.data.iter().sum::<f64>() / self.data.len() as f64)
    }

    fn __repr__(&self) -> String {
        format!("DataPipeline('{}', n={})", self.name, self.data.len())
    }

    fn __len__(&self) -> usize {
        self.data.len()
    }
}

// Python usage:
// from my_lib import DataPipeline
// result = (DataPipeline("test")
//     .load([1, 5, 3, 8, 2, 9, 4, 7])
//     .filter_above(3.0)
//     .scale(2.0)
//     .normalize()
//     .collect())
// print(result)  # [0.333, 0.0, 0.833, 0.167, 1.0, 0.5]`}),e.jsxs(a,{type:"pythonista",title:"PyRefMut enables return-self pattern",children:["In Python, returning ",e.jsx("code",{children:"self"})," is trivial. In PyO3, returning ",e.jsx("code",{children:"self"})," requires ",e.jsx("code",{children:"PyRefMut"})," (or alternatively, cloning the object). ",e.jsx("code",{children:"PyRefMut"})," borrows the Python object mutably and can be returned directly, enabling method chaining without any copies."]}),e.jsx("h2",{children:"Lazy Evaluation Pattern"}),e.jsx(t,{language:"rust",title:"Polars-style lazy API: build plan, then execute",code:`use pyo3::prelude::*;

/// Operations stored as a plan, executed on collect()
#[derive(Clone)]
enum Op {
    FilterAbove(f64),
    Scale(f64),
    Normalize,
    Sort,
}

#[pyclass]
#[derive(Clone)]
struct LazyPipeline {
    data: Vec<f64>,
    ops: Vec<Op>,
}

#[pymethods]
impl LazyPipeline {
    #[new]
    fn new(data: Vec<f64>) -> Self {
        LazyPipeline { data, ops: vec![] }
    }

    /// Queue a filter operation (not executed yet!)
    fn filter_above(&self, threshold: f64) -> Self {
        let mut new = self.clone();
        new.ops.push(Op::FilterAbove(threshold));
        new
    }

    fn scale(&self, factor: f64) -> Self {
        let mut new = self.clone();
        new.ops.push(Op::Scale(factor));
        new
    }

    fn normalize(&self) -> Self {
        let mut new = self.clone();
        new.ops.push(Op::Normalize);
        new
    }

    fn sort(&self) -> Self {
        let mut new = self.clone();
        new.ops.push(Op::Sort);
        new
    }

    /// Execute all queued operations
    fn collect(&self) -> Vec<f64> {
        let mut data = self.data.clone();
        for op in &self.ops {
            match op {
                Op::FilterAbove(t) => data.retain(|&x| x > *t),
                Op::Scale(f) => data.iter_mut().for_each(|x| *x *= f),
                Op::Normalize => {
                    if let (Some(&min), Some(&max)) = (
                        data.iter().min_by(|a,b| a.partial_cmp(b).unwrap()),
                        data.iter().max_by(|a,b| a.partial_cmp(b).unwrap()),
                    ) {
                        let r = max - min;
                        if r > 0.0 { data.iter_mut().for_each(|x| *x = (*x-min)/r); }
                    }
                },
                Op::Sort => data.sort_by(|a,b| a.partial_cmp(b).unwrap()),
            }
        }
        data
    }

    fn __repr__(&self) -> String {
        format!("LazyPipeline({} items, {} pending ops)",
                self.data.len(), self.ops.len())
    }
}

// Python:
// result = (LazyPipeline([5,3,8,1,9])
//     .filter_above(2)   # queued
//     .scale(10)          # queued
//     .sort()             # queued
//     .collect())         # NOW everything executes
// print(result)  # [30, 50, 80, 90]`}),e.jsx(n,{title:"Design a Query Builder",difficulty:"intermediate",problem:`Design a fluent query builder for a simple data store:

1. Create a QueryBuilder #[pyclass] that holds query parameters
2. Implement these chainable methods:
   - .select(columns: list[str]) — which columns to return
   - .where_gt(column: str, value: f64) — filter: column > value
   - .order_by(column: str) — sort by column
   - .limit(n: usize) — max rows to return
3. Implement .describe() -> str that prints the query plan as a string
4. Each method should return self for chaining

Example:
  query = (QueryBuilder()
      .select(["name", "score"])
      .where_gt("score", 90.0)
      .order_by("score")
      .limit(10))
  print(query.describe())
  # SELECT name, score WHERE score > 90.0 ORDER BY score LIMIT 10`,solution:`use pyo3::prelude::*;

#[pyclass]
#[derive(Clone)]
struct QueryBuilder {
    columns: Option<Vec<String>>,
    filters: Vec<(String, f64)>,
    order: Option<String>,
    max_rows: Option<usize>,
}

#[pymethods]
impl QueryBuilder {
    #[new]
    fn new() -> Self {
        QueryBuilder {
            columns: None,
            filters: vec![],
            order: None,
            max_rows: None,
        }
    }

    fn select(mut slf: PyRefMut<'_, Self>, columns: Vec<String>) -> PyRefMut<'_, Self> {
        slf.columns = Some(columns);
        slf
    }

    fn where_gt(mut slf: PyRefMut<'_, Self>, column: String, value: f64) -> PyRefMut<'_, Self> {
        slf.filters.push((column, value));
        slf
    }

    fn order_by(mut slf: PyRefMut<'_, Self>, column: String) -> PyRefMut<'_, Self> {
        slf.order = Some(column);
        slf
    }

    fn limit(mut slf: PyRefMut<'_, Self>, n: usize) -> PyRefMut<'_, Self> {
        slf.max_rows = Some(n);
        slf
    }

    fn describe(&self) -> String {
        let mut parts = vec!["SELECT".to_string()];

        match &self.columns {
            Some(cols) => parts.push(cols.join(", ")),
            None => parts.push("*".into()),
        }

        for (col, val) in &self.filters {
            parts.push(format!("WHERE {} > {}", col, val));
        }

        if let Some(col) = &self.order {
            parts.push(format!("ORDER BY {}", col));
        }

        if let Some(n) = self.max_rows {
            parts.push(format!("LIMIT {}", n));
        }

        parts.join(" ")
    }

    fn __repr__(&self) -> String {
        self.describe()
    }
}`})]})}const y=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));export{f as a,y as b,u as s};
