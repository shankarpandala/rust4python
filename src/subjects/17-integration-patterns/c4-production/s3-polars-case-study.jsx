import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function PolarsCaseStudy() {
  return (
    <div className="prose-rust">
      <h1>Case Study: How Polars Does It</h1>

      <p>
        Polars is the gold standard for a Rust-backed Python library. It
        achieves 10-100x speedups over Pandas while providing a clean Python
        API. Understanding how Polars is architected teaches you the
        production patterns for building your own high-performance Python
        packages with Rust.
      </p>

      <ConceptBlock title="Polars Architecture">
        <p>
          Polars follows the three-layer architecture: a pure Rust core engine
          (polars-core), multiple crate layers for features (polars-lazy,
          polars-io, polars-sql), and a thin PyO3 binding layer (py-polars)
          that exposes everything to Python. The Python package adds Pythonic
          sugar on top. This separation is key to its success.
        </p>
      </ConceptBlock>

      <h2>Why Polars Is Fast</h2>

      <PythonRustCompare
        title="The same operation, different architectures"
        description="Polars applies multiple optimizations that Pandas cannot."
        pythonCode={`import pandas as pd
import polars as pl
import time

# Generate test data
n = 10_000_000

# Pandas approach
df_pd = pd.DataFrame({
    "group": [f"g{i % 100}" for i in range(n)],
    "value": list(range(n)),
})

start = time.time()
result_pd = (df_pd
    .query("value > 5000000")
    .groupby("group")["value"]
    .agg(["mean", "std", "count"])
)
pd_time = time.time() - start

# Polars approach (same logic!)
df_pl = pl.DataFrame({
    "group": [f"g{i % 100}" for i in range(n)],
    "value": list(range(n)),
})

start = time.time()
result_pl = (df_pl.lazy()
    .filter(pl.col("value") > 5_000_000)
    .group_by("group")
    .agg([
        pl.col("value").mean().alias("mean"),
        pl.col("value").std().alias("std"),
        pl.col("value").count().alias("count"),
    ])
    .collect()
)
pl_time = time.time() - start

print(f"Pandas: {pd_time:.2f}s")
print(f"Polars: {pl_time:.2f}s")
print(f"Speedup: {pd_time/pl_time:.1f}x")`}
        rustCode={`// Why Polars is faster — the technical reasons:

// 1. QUERY OPTIMIZATION
// Polars' lazy engine optimizes the query plan:
// - Predicate pushdown: filter BEFORE groupby
// - Projection pushdown: only read needed columns
// - Common subexpression elimination
// Pandas executes operations eagerly, in order.

// 2. PARALLEL EXECUTION
// Polars uses rayon to parallelize:
// - Column operations run on separate threads
// - GroupBy splits groups across cores
// - Aggregations use parallel reduction
// Pandas is single-threaded (GIL).

// 3. APACHE ARROW MEMORY
// Polars stores data in Arrow columnar format:
// - Contiguous memory → cache-friendly
// - SIMD-optimized operations
// - Zero-copy slicing and filtering
// Pandas uses NumPy arrays (good) but with
// Python object columns (bad for strings).

// 4. NO PYTHON OVERHEAD
// The entire pipeline runs in Rust:
// - No interpreter dispatch per element
// - No Python object creation for intermediates
// - No garbage collector pauses
// Data only crosses the Python/Rust boundary
// at the start (input) and end (output).

// 5. EFFICIENT STRING HANDLING
// Polars uses Arrow's string representation:
// - Offsets + contiguous data buffer
// - No individual string allocations
// Pandas stores each string as a Python object
// on the heap — millions of separate allocations.`}
      />

      <NoteBlock type="pythonista" title="The lazy API is where the magic happens">
        When you call <code>df.lazy()</code>, Polars starts building a query
        plan instead of executing immediately. When you call{' '}
        <code>.collect()</code>, the optimizer rewrites the plan for maximum
        performance. This is exactly like how SQL databases optimize queries
        — and it is the single biggest reason Polars beats Pandas.
      </NoteBlock>

      <h2>Polars Source Code Structure</h2>

      <CodeBlock
        language="bash"
        title="Polars repository layout (simplified)"
        code={`# github.com/pola-rs/polars
polars/
├── crates/                    # Pure Rust crates
│   ├── polars-core/           # Series, DataFrame, ChunkedArray
│   │   └── src/
│   │       ├── frame/         # DataFrame implementation
│   │       ├── series/        # Series implementation
│   │       └── chunked_array/ # Arrow-backed arrays
│   ├── polars-lazy/           # Lazy query engine
│   │   └── src/
│   │       ├── logical_plan/  # Query plan representation
│   │       ├── physical_plan/ # Execution engine
│   │       └── optimizer/     # Query optimizer
│   ├── polars-io/             # CSV, Parquet, JSON readers
│   ├── polars-ops/            # Column operations
│   ├── polars-sql/            # SQL interface
│   └── polars-arrow/          # Arrow utilities
│
├── py-polars/                 # Python bindings
│   ├── src/                   # PyO3 wrapper code
│   │   ├── dataframe.rs       # PyDataFrame class
│   │   ├── series.rs          # PySeries class
│   │   ├── lazy/              # PyLazyFrame
│   │   └── expr/              # PyExpr
│   └── polars/                # Python package
│       ├── __init__.py
│       ├── dataframe.py       # Pythonic DataFrame API
│       ├── series.py          # Pythonic Series API
│       └── expr.py            # Expression API
│
└── Cargo.toml                 # Workspace definition`}
      />

      <h2>Key Design Patterns from Polars</h2>

      <CodeBlock
        language="rust"
        title="Patterns you can adopt in your own projects"
        code={`// PATTERN 1: Thin PyO3 wrapper
// The Python-facing struct wraps the Rust core struct
use pyo3::prelude::*;

#[pyclass]
struct PyDataFrame {
    inner: polars_core::DataFrame,  // the real implementation
}

#[pymethods]
impl PyDataFrame {
    // Each Python method delegates to the Rust core
    fn select(&self, columns: Vec<String>) -> PyResult<Self> {
        let result = self.inner.select(&columns)
            .map_err(|e| pyo3::exceptions::PyRuntimeError::new_err(
                e.to_string()
            ))?;
        Ok(PyDataFrame { inner: result })
    }
}

// PATTERN 2: Expression system
// Build computation graphs, don't compute immediately
enum Expr {
    Column(String),
    Literal(f64),
    BinaryOp { left: Box<Expr>, op: Op, right: Box<Expr> },
    Agg { expr: Box<Expr>, agg_type: AggType },
}

enum Op { Add, Mul, Gt, Eq }
enum AggType { Sum, Mean, Min, Max, Count }

// col("price") * lit(1.1)  builds an Expr tree
// It's only evaluated when collect() is called

// PATTERN 3: Parallel column operations
// Use rayon to process columns independently
fn apply_expressions(
    df: &DataFrame,
    exprs: &[Expr],
) -> Vec<Series> {
    use rayon::prelude::*;
    exprs.par_iter()
        .map(|expr| evaluate_expr(df, expr))
        .collect()
}

fn evaluate_expr(df: &DataFrame, expr: &Expr) -> Series {
    todo!() // recursive expression evaluation
}`}
      />

      <h2>Lessons for Your Projects</h2>

      <CodeBlock
        language="python"
        title="Production patterns from Polars"
        code={`# 1. SEPARATE CORE FROM BINDINGS
#    Keep your Rust logic in a crate with NO PyO3 dependency.
#    Test it independently with 'cargo test'.
#    The PyO3 layer should be a thin wrapper.

# 2. MINIMIZE BOUNDARY CROSSINGS
#    Bad:  for row in data: rust_process(row)  # 1M crossings
#    Good: rust_batch_process(data)            # 1 crossing

# 3. USE LAZY EVALUATION
#    Build a plan in Python, execute in Rust.
#    This lets Rust optimize the entire pipeline.

# 4. PARALLEL EVERYTHING IN RUST
#    rayon::par_iter() on the Rust side.
#    The GIL is released inside Rust code.

# 5. ZERO-COPY WHERE POSSIBLE
#    Use numpy arrays (rust-numpy) instead of Python lists.
#    Use Arrow format for DataFrames.

# 6. PYTHONIC ERROR MESSAGES
#    Convert Rust errors to clear Python exceptions.
#    Users shouldn't need to understand Rust.

# 7. COMPREHENSIVE PYTHON LAYER
#    Add docstrings, type hints, and convenience methods
#    in the Python layer (not in Rust).`}
      />

      <NoteBlock type="tip" title="Start small, then scale">
        Polars started as a single crate. You do not need to build the full
        architecture on day one. Start with a single <code>lib.rs</code> file,
        one <code>#[pyfunction]</code>, and grow from there. The workspace
        structure emerges naturally as your project grows.
      </NoteBlock>

      <ExerciseBlock
        title="Architecture a Rust-Python Package"
        difficulty="advanced"
        problem={`You want to build a Python package called "fast-embeddings" that:
- Loads pre-trained word embeddings from a file
- Provides a lookup(word) -> vector function
- Computes cosine similarity between words
- Finds the N most similar words to a given word
- Handles 2 million word vectors (each 300-dimensional)

Design the architecture:
1. What goes in the Rust core crate?
2. What goes in the PyO3 bindings crate?
3. What goes in the Python package?
4. How would you handle the 2M × 300 float matrix efficiently?
5. Where would you use parallelism?`}
        solution={`Architecture for fast-embeddings:

## 1. Rust Core Crate (crates/core/)
- EmbeddingStore struct:
  - words: Vec<String> (vocabulary)
  - word_to_idx: HashMap<String, usize> (fast lookup)
  - vectors: ndarray::Array2<f32> (2M × 300 matrix)
- Methods:
  - load_from_file(path) -> Result<EmbeddingStore>
  - lookup(&self, word: &str) -> Option<&[f32]>
  - cosine_similarity(&self, w1: &str, w2: &str) -> Option<f32>
  - most_similar(&self, word: &str, n: usize) -> Vec<(String, f32)>

## 2. PyO3 Bindings (crates/python/)
- #[pyclass] PyEmbeddings wrapping EmbeddingStore
- #[new] loads from file path
- Methods delegate to core with type conversion
- Use numpy for returning vectors (zero-copy)

## 3. Python Package (python/fast_embeddings/)
- __init__.py: re-export PyEmbeddings
- Add convenience: analogy(king, man, woman) -> queen
- Type hints and docstrings
- Integration with pandas/numpy

## 4. Memory efficiency:
- Store vectors as Array2<f32> (not f64) → 2M × 300 × 4 = 2.4GB
- Memory-map the file with mmap for fast loading
- Return numpy views (zero-copy) instead of Python lists
- Use f32 not f64 (embeddings don't need double precision)

## 5. Parallelism:
- most_similar: use rayon::par_iter over all 2M vectors
  to compute cosine similarity in parallel (this is the bottleneck)
- Batch operations: cosine_sim_batch for multiple queries
- Loading: parallel file parsing if format supports it

This design puts ALL computation in Rust (no Python overhead)
and crosses the Python/Rust boundary only at the API level.`}
      />
    </div>
  );
}
