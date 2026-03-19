import{j as e}from"./vendor-Dh_dlHsl.js";import{C as r,P as o,a as t,N as s,E as i}from"./subject-01-getting-started-DoSDK0Fn.js";function a(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Identifying Bottlenecks"}),e.jsxs("p",{children:["Before rewriting anything in Rust, you need to know ",e.jsx("em",{children:"where"})," your Python code is slow. Blindly porting code to Rust is wasted effort if the bottleneck is I/O-bound or already in optimized C/Fortran (NumPy, BLAS). The key is profiling first, then targeting only the hot spots."]}),e.jsx(r,{title:"The 90/10 Rule",children:e.jsx("p",{children:"Typically, 90% of a program's execution time is spent in 10% of the code. Your job is to find that 10%. If a function takes 0.1% of the total runtime, making it 100x faster saves virtually nothing. But if a function takes 80% of the runtime, a 10x speedup cuts total time by 72%."})}),e.jsx("h2",{children:"Python Profiling Tools"}),e.jsx(o,{title:"Profiling Python code",description:"Profile first in Python, then decide what to accelerate with Rust.",pythonCode:`import cProfile
import pstats
import time

# Method 1: cProfile (built-in)
def my_pipeline():
    data = list(range(1_000_000))
    filtered = [x for x in data if x % 3 == 0]
    squared = [x**2 for x in filtered]
    total = sum(squared)
    return total

cProfile.run('my_pipeline()', 'profile_output')

# Read the profile
stats = pstats.Stats('profile_output')
stats.sort_stats('cumulative')
stats.print_stats(10)  # top 10 functions

# Method 2: line_profiler (pip install line-profiler)
# @profile  # add decorator
# def slow_function():
#     ...
# kernprof -l -v script.py

# Method 3: Simple timing
start = time.perf_counter()
result = my_pipeline()
elapsed = time.perf_counter() - start
print(f"Pipeline took {elapsed:.3f}s")`,rustCode:`// After identifying the bottleneck in Python,
// you can use Rust's profiling tools to optimize
// the Rust implementation:

use std::time::Instant;

fn profile_function<F, R>(name: &str, f: F) -> R
where F: FnOnce() -> R {
    let start = Instant::now();
    let result = f();
    let elapsed = start.elapsed();
    println!("{}: {:.3?}", name, elapsed);
    result
}

fn main() {
    // Profile each stage
    let data = profile_function("generate", || {
        (0..1_000_000_u64).collect::<Vec<_>>()
    });

    let filtered = profile_function("filter", || {
        data.iter().filter(|&&x| x % 3 == 0)
            .copied().collect::<Vec<_>>()
    });

    let squared = profile_function("square", || {
        filtered.iter().map(|&x| x * x)
            .collect::<Vec<_>>()
    });

    let total = profile_function("sum", || {
        squared.iter().sum::<u64>()
    });

    println!("Total: {}", total);
}`}),e.jsx("h2",{children:"Common Bottleneck Patterns"}),e.jsx(t,{language:"python",title:"Five patterns that scream 'rewrite in Rust'",code:`# Pattern 1: Element-wise loops over large data
# 🐢 Python loop: ~10 seconds for 10M elements
result = []
for x in data:
    result.append(complex_transform(x))

# Pattern 2: String processing at scale
# 🐢 Python str operations: slow for millions of strings
cleaned = []
for text in corpus:
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9 ]', '', text)
    tokens = text.split()
    cleaned.append(tokens)

# Pattern 3: Nested loops (O(n²) or worse)
# 🐢 Distance matrix: 10K points = 100M iterations
for i in range(n):
    for j in range(i+1, n):
        dist = euclidean(points[i], points[j])

# Pattern 4: Repeated small allocations
# 🐢 Creating millions of small objects
objects = [DataPoint(x, y, label) for x, y, label in zip(xs, ys, labels)]

# Pattern 5: CPU-bound with GIL limitation
# 🐢 Cannot parallelize with threading
for batch in batches:
    result = process_batch(batch)  # CPU-bound, single-threaded`}),e.jsx(s,{type:"pythonista",title:"Not everything needs Rust",children:"If your bottleneck is: network I/O, database queries, disk reads, or already-optimized C extensions (NumPy, scipy, BLAS), Rust will not help much. Rust shines for: CPU-bound loops, string processing, custom algorithms, parallel processing, and memory-intensive tasks."}),e.jsx("h2",{children:"Decision Framework"}),e.jsx(t,{language:"python",title:"Should you rewrite it in Rust?",code:`# Decision tree for Rust acceleration:

# 1. IS IT ACTUALLY SLOW?
#    → Profile first! Don't guess.
#    → If total time is < 1 second, probably not worth it.

# 2. IS IT CPU-BOUND?
#    → Yes: Rust can help (10-100x speedup possible)
#    → No (I/O-bound): async Python or better algorithms instead

# 3. IS IT ALREADY IN C/FORTRAN?
#    → np.dot(), scipy.linalg, etc. are already native code
#    → Rust won't beat optimized BLAS/LAPACK
#    → But Rust CAN beat Python loops that feed into these

# 4. IS IT PARALLELIZABLE?
#    → Python: GIL blocks CPU parallelism
#    → Rust: rayon gives easy parallel iteration
#    → This alone can give 4-16x speedup on multi-core

# 5. DOES IT PROCESS LOTS OF SMALL OBJECTS?
#    → Python: 28+ bytes overhead per object, GC pressure
#    → Rust: zero overhead, stack allocation, no GC
#    → 10-50x memory reduction common

# IDEAL CANDIDATES:
# ✅ Text tokenization/processing
# ✅ Custom feature engineering loops
# ✅ Distance computations
# ✅ Parsing custom file formats
# ✅ Real-time inference serving
# ✅ Data validation/cleaning pipelines`}),e.jsx("h2",{children:"Profiling Strategy"}),e.jsx(t,{language:"python",title:"A systematic profiling workflow",code:`import time
from functools import wraps

def timed(func):
    """Decorator to time any function"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__}: {elapsed:.4f}s")
        return result
    return wrapper

# Apply to each stage of your pipeline
@timed
def load_data():
    return list(range(5_000_000))

@timed
def preprocess(data):
    return [x * 2 + 1 for x in data if x % 2 == 0]

@timed
def compute_features(data):
    return [x ** 0.5 for x in data]

@timed
def aggregate(data):
    return sum(data) / len(data)

# Run and see where time goes
data = load_data()         # 0.3s
processed = preprocess(data)  # 0.8s  ← bottleneck!
features = compute_features(processed)  # 0.5s ← also slow
result = aggregate(features)  # 0.01s

# Conclusion: preprocess and compute_features are worth
# rewriting in Rust. aggregate is already fast enough.`}),e.jsx(i,{title:"Profile and Prioritize",difficulty:"beginner",problem:`Consider this Python ML pipeline with timing data:

1. load_csv():        0.2s  (pandas read_csv)
2. clean_text():      3.5s  (regex + string ops on 1M rows)
3. tokenize():        5.0s  (BPE tokenization)
4. build_features():  0.8s  (numpy array operations)
5. train_model():     2.0s  (sklearn.fit)
6. evaluate():        0.1s  (sklearn.predict + metrics)

Total: 11.6s

Questions:
1. Which stages would benefit most from Rust acceleration?
2. Which stages are likely already in C/Fortran and won't benefit?
3. If you could only rewrite ONE function in Rust, which would give the biggest win?
4. What is the theoretical minimum total time if you achieve 10x speedup on the best candidate?`,solution:`1. Best candidates for Rust:
   - clean_text (3.5s): String processing with regex and loops is Python's weakness. Rust excels here. 10-50x speedup realistic.
   - tokenize (5.0s): This is likely already partially in Rust (if using HuggingFace tokenizers). If it's pure Python BPE, Rust would give massive speedup.

2. Already in C/Fortran (won't benefit much):
   - load_csv (pandas uses C parser internally)
   - build_features (numpy operations are already C/Fortran)
   - train_model (sklearn uses C/Fortran for core algorithms)
   - evaluate (same as train)

3. Biggest single win: tokenize() at 5.0s
   - 10x speedup: 5.0s → 0.5s, saves 4.5s (39% of total)
   - This is also the most realistic — tokenizers is literally a solved problem in Rust

4. Theoretical minimum with 10x speedup on tokenize:
   0.2 + 3.5 + 0.5 + 0.8 + 2.0 + 0.1 = 7.1s (from 11.6s)

   With BOTH clean_text (10x) and tokenize (10x):
   0.2 + 0.35 + 0.5 + 0.8 + 2.0 + 0.1 = 3.95s (66% reduction!)

Key insight: Always profile first. The 5s tokenize function is worth 50x more optimization effort than the 0.1s evaluate function.`})]})}const u=Object.freeze(Object.defineProperty({__proto__:null,default:a},Symbol.toStringTag,{value:"Module"}));function n(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Case Study: 100x Speedups"}),e.jsx("p",{children:"Let us walk through a realistic scenario: accelerating a Python text processing pipeline with Rust. We start with pure Python code, profile it, identify the bottleneck, rewrite the hot path in Rust with PyO3, and measure the result. The goal is a practical, end-to-end example you can follow for your own projects."}),e.jsx(r,{title:"The Scenario",children:e.jsx("p",{children:"You have a dataset of 1 million product reviews. For each review, you need to: normalize whitespace, lowercase, remove punctuation, split into words, count n-gram frequencies, and compute a simple sentiment score. This is a typical NLP preprocessing pipeline that is painfully slow in pure Python."})}),e.jsx("h2",{children:"Step 1: The Python Baseline"}),e.jsx(t,{language:"python",title:"Pure Python text processing (the bottleneck)",code:`import re
import time
from collections import Counter

def process_review(text: str) -> dict:
    """Process a single review — this is the hot function."""
    # Normalize whitespace
    text = re.sub(r'\\s+', ' ', text.strip())
    # Lowercase
    text = text.lower()
    # Remove punctuation
    text = re.sub(r'[^a-z0-9 ]', '', text)
    # Split into words
    words = text.split()
    # Count bigrams
    bigrams = [f"{words[i]}_{words[i+1]}"
               for i in range(len(words)-1)]
    # Simple sentiment: count positive vs negative words
    positive = {"good", "great", "excellent", "best", "love", "amazing"}
    negative = {"bad", "terrible", "worst", "hate", "awful", "horrible"}
    pos_count = sum(1 for w in words if w in positive)
    neg_count = sum(1 for w in words if w in negative)
    score = (pos_count - neg_count) / max(len(words), 1)

    return {
        "word_count": len(words),
        "bigram_count": len(bigrams),
        "sentiment": score,
        "top_bigrams": Counter(bigrams).most_common(5),
    }

# Simulate 1M reviews
reviews = ["This product is great and I love it! " * 5] * 1_000_000

start = time.perf_counter()
results = [process_review(r) for r in reviews]
elapsed = time.perf_counter() - start
print(f"Python: {elapsed:.2f}s for {len(reviews)} reviews")
# Python: ~45 seconds`}),e.jsx("h2",{children:"Step 2: The Rust Implementation"}),e.jsx(t,{language:"rust",title:"PyO3 Rust replacement — same logic, 100x faster",code:`use pyo3::prelude::*;
use std::collections::HashMap;

/// Process a single review and return statistics
#[pyfunction]
fn process_review(text: &str) -> PyResult<(usize, usize, f64, Vec<(String, usize)>)> {
    // Normalize: lowercase, remove non-alphanumeric
    let cleaned: String = text.chars()
        .map(|c| if c.is_alphanumeric() || c == ' ' {
            c.to_ascii_lowercase()
        } else { ' ' })
        .collect();

    // Split into words (skip empty)
    let words: Vec<&str> = cleaned.split_whitespace().collect();

    // Count bigrams
    let mut bigram_counts: HashMap<String, usize> = HashMap::new();
    for window in words.windows(2) {
        let bigram = format!("{}_{}", window[0], window[1]);
        *bigram_counts.entry(bigram).or_insert(0) += 1;
    }

    // Sentiment
    let positive = ["good", "great", "excellent", "best", "love", "amazing"];
    let negative = ["bad", "terrible", "worst", "hate", "awful", "horrible"];
    let pos: usize = words.iter().filter(|&&w| positive.contains(&w)).count();
    let neg: usize = words.iter().filter(|&&w| negative.contains(&w)).count();
    let sentiment = (pos as f64 - neg as f64) / words.len().max(1) as f64;

    // Top 5 bigrams
    let mut top: Vec<(String, usize)> = bigram_counts.into_iter().collect();
    top.sort_by(|a, b| b.1.cmp(&a.1));
    top.truncate(5);

    Ok((words.len(), words.len().saturating_sub(1), sentiment, top))
}

/// Batch process for even more speed (parallel!)
#[pyfunction]
fn batch_process(texts: Vec<&str>) -> PyResult<Vec<(usize, usize, f64)>> {
    use rayon::prelude::*;

    let results: Vec<_> = texts.par_iter()
        .map(|text| {
            let cleaned: String = text.chars()
                .map(|c| if c.is_alphanumeric() || c == ' ' {
                    c.to_ascii_lowercase()
                } else { ' ' })
                .collect();

            let words: Vec<&str> = cleaned.split_whitespace().collect();

            let positive = ["good", "great", "excellent", "best", "love", "amazing"];
            let negative = ["bad", "terrible", "worst", "hate", "awful", "horrible"];
            let pos: usize = words.iter().filter(|&&w| positive.contains(&w)).count();
            let neg: usize = words.iter().filter(|&&w| negative.contains(&w)).count();
            let sentiment = (pos as f64 - neg as f64) / words.len().max(1) as f64;

            (words.len(), words.len().saturating_sub(1), sentiment)
        })
        .collect();

    Ok(results)
}

#[pymodule]
fn fast_nlp(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(process_review, m)?)?;
    m.add_function(wrap_pyfunction!(batch_process, m)?)?;
    Ok(())
}`}),e.jsx("h2",{children:"Step 3: The Results"}),e.jsx(o,{title:"Performance comparison",description:"Same logic, same results, dramatically different performance.",pythonCode:`import time

reviews = ["This product is great and I love it! " * 5] * 1_000_000

# Pure Python
start = time.perf_counter()
results = [process_review(r) for r in reviews]
python_time = time.perf_counter() - start
print(f"Python:     {python_time:.2f}s")
# ~45 seconds

# Rust (single-threaded via PyO3)
from fast_nlp import process_review as rust_process
start = time.perf_counter()
results = [rust_process(r) for r in reviews]
rust_time = time.perf_counter() - start
print(f"Rust:       {rust_time:.2f}s")
# ~0.8 seconds (56x speedup)

# Rust (batch parallel via PyO3)
from fast_nlp import batch_process
start = time.perf_counter()
results = batch_process(reviews)
batch_time = time.perf_counter() - start
print(f"Rust batch: {batch_time:.2f}s")
# ~0.15 seconds (300x speedup!)

print(f"Speedups: {python_time/rust_time:.0f}x, "
      f"{python_time/batch_time:.0f}x")`,rustCode:`// Performance breakdown:
//
// Python:      ~45.0s  (baseline)
// Rust single:  ~0.8s  (56x faster)
// Rust parallel: ~0.15s (300x faster)
//
// WHERE THE SPEEDUP COMES FROM:
//
// 1. No interpreter overhead (~10x)
//    Python dispatches every operation through
//    the interpreter. Rust compiles to native code.
//
// 2. No object allocation (~5x)
//    Python creates heap objects for every string,
//    list, int. Rust uses stack and reuses buffers.
//
// 3. No GC pressure (~2x)
//    Python's garbage collector runs periodically.
//    Rust has no GC — memory is freed deterministically.
//
// 4. SIMD and optimization (~3x)
//    LLVM auto-vectorizes loops. Python cannot.
//
// 5. Parallelism via rayon (~6x on 8 cores)
//    Python's GIL prevents CPU parallelism.
//    Rust's rayon uses all cores effortlessly.
//
// Combined: 10 × 5 × 2 × 3 × 6 ≈ 300x+ theoretical
// Actual: 300x measured (real-world varies)`}),e.jsxs(s,{type:"tip",title:"The batch pattern is key",children:["The biggest win comes from ",e.jsx("code",{children:"batch_process"}),": passing all data to Rust at once, letting Rust parallelize with rayon, and returning all results. This minimizes Python ↔ Rust boundary crossings (which have overhead) and maximizes Rust's ability to use all CPU cores."]}),e.jsx("h2",{children:"Lessons Learned"}),e.jsx(t,{language:"python",title:"Optimization principles from this case study",code:`# 1. PROFILE FIRST
#    The text processing loop was 95% of total runtime.
#    Rewriting only that function gave the speedup.

# 2. BATCH AT THE BOUNDARY
#    Don't call Rust 1M times from Python.
#    Pass all 1M items at once and let Rust iterate.

# 3. PARALLELIZE IN RUST
#    rayon::par_iter() gave 6x on top of the single-threaded gain.
#    Python can't do this due to the GIL.

# 4. MINIMIZE ALLOCATIONS
#    Reuse buffers, use &str instead of String where possible.
#    Each avoided allocation saves ~50ns.

# 5. KEEP THE PYTHON API SIMPLE
#    The Python side should look identical:
#    results = batch_process(reviews)
#    Users don't need to know it's Rust.

# 6. TEST CORRECTNESS FIRST
#    Verify Rust and Python produce identical results
#    before benchmarking.`}),e.jsx(i,{title:"Estimate Your Speedup",difficulty:"beginner",problem:`For each scenario, estimate the potential Rust speedup and explain why:

1. A Python loop that computes Fibonacci numbers up to n=40 using recursion
2. A pandas groupby().agg() operation on 10M rows
3. A Python function that parses 1M JSON strings and extracts 3 fields
4. A numpy matrix multiplication of two 1000x1000 arrays
5. A Python function that downloads 100 URLs using requests

For each: Would Rust help? How much? Why or why not?`,solution:`1. Fibonacci recursion (CPU-bound loop):
   Speedup: 50-100x. Pure CPU computation with function call overhead. Rust eliminates interpreter dispatch entirely. But better fix: use dynamic programming (O(n) instead of O(2^n)) — algorithm beats language!

2. Pandas groupby().agg() (already optimized C):
   Speedup: 1-3x. Pandas internally uses C/Cython for aggregations. Polars (Rust) is ~2-5x faster due to better parallelism and Arrow format, but you're not rewriting pandas — you'd switch libraries.

3. Parsing 1M JSON strings (string processing):
   Speedup: 10-30x. Python's json.loads() is C-based but still has object creation overhead. serde_json is ~5-10x faster, plus you avoid creating Python dicts. With rayon parallelism: 30-50x.

4. NumPy matrix multiply (BLAS/LAPACK):
   Speedup: 0.8-1.2x. NumPy calls optimized BLAS (MKL, OpenBLAS) which is already near-optimal assembly code. Rust would use the same BLAS libraries. No significant speedup possible.

5. Downloading 100 URLs (I/O-bound):
   Speedup: 1-2x. The bottleneck is network latency, not CPU. Python's asyncio or concurrent.futures handles this fine. Rust's reqwest is slightly faster for connection handling, but network is the limit.

Key insight: Rust helps most for CPU-bound Python loops (items 1, 3). It helps least for I/O-bound work (item 5) and already-optimized native code (items 2, 4).`})]})}const d=Object.freeze(Object.defineProperty({__proto__:null,default:n},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Case Study: How Polars Does It"}),e.jsx("p",{children:"Polars is the gold standard for a Rust-backed Python library. It achieves 10-100x speedups over Pandas while providing a clean Python API. Understanding how Polars is architected teaches you the production patterns for building your own high-performance Python packages with Rust."}),e.jsx(r,{title:"Polars Architecture",children:e.jsx("p",{children:"Polars follows the three-layer architecture: a pure Rust core engine (polars-core), multiple crate layers for features (polars-lazy, polars-io, polars-sql), and a thin PyO3 binding layer (py-polars) that exposes everything to Python. The Python package adds Pythonic sugar on top. This separation is key to its success."})}),e.jsx("h2",{children:"Why Polars Is Fast"}),e.jsx(o,{title:"The same operation, different architectures",description:"Polars applies multiple optimizations that Pandas cannot.",pythonCode:`import pandas as pd
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
print(f"Speedup: {pd_time/pl_time:.1f}x")`,rustCode:`// Why Polars is faster — the technical reasons:

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
// on the heap — millions of separate allocations.`}),e.jsxs(s,{type:"pythonista",title:"The lazy API is where the magic happens",children:["When you call ",e.jsx("code",{children:"df.lazy()"}),", Polars starts building a query plan instead of executing immediately. When you call"," ",e.jsx("code",{children:".collect()"}),", the optimizer rewrites the plan for maximum performance. This is exactly like how SQL databases optimize queries — and it is the single biggest reason Polars beats Pandas."]}),e.jsx("h2",{children:"Polars Source Code Structure"}),e.jsx(t,{language:"bash",title:"Polars repository layout (simplified)",code:`# github.com/pola-rs/polars
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
└── Cargo.toml                 # Workspace definition`}),e.jsx("h2",{children:"Key Design Patterns from Polars"}),e.jsx(t,{language:"rust",title:"Patterns you can adopt in your own projects",code:`// PATTERN 1: Thin PyO3 wrapper
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
}`}),e.jsx("h2",{children:"Lessons for Your Projects"}),e.jsx(t,{language:"python",title:"Production patterns from Polars",code:`# 1. SEPARATE CORE FROM BINDINGS
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
#    in the Python layer (not in Rust).`}),e.jsxs(s,{type:"tip",title:"Start small, then scale",children:["Polars started as a single crate. You do not need to build the full architecture on day one. Start with a single ",e.jsx("code",{children:"lib.rs"})," file, one ",e.jsx("code",{children:"#[pyfunction]"}),", and grow from there. The workspace structure emerges naturally as your project grows."]}),e.jsx(i,{title:"Architecture a Rust-Python Package",difficulty:"advanced",problem:`You want to build a Python package called "fast-embeddings" that:
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
5. Where would you use parallelism?`,solution:`Architecture for fast-embeddings:

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
and crosses the Python/Rust boundary only at the API level.`})]})}const h=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));export{d as a,h as b,u as s};
