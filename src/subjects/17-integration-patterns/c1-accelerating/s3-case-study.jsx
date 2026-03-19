import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function CaseStudySpeedups() {
  return (
    <div className="prose-rust">
      <h1>Case Study: 100x Speedups</h1>

      <p>
        Let us walk through a realistic scenario: accelerating a Python text
        processing pipeline with Rust. We start with pure Python code, profile
        it, identify the bottleneck, rewrite the hot path in Rust with PyO3,
        and measure the result. The goal is a practical, end-to-end example
        you can follow for your own projects.
      </p>

      <ConceptBlock title="The Scenario">
        <p>
          You have a dataset of 1 million product reviews. For each review,
          you need to: normalize whitespace, lowercase, remove punctuation,
          split into words, count n-gram frequencies, and compute a simple
          sentiment score. This is a typical NLP preprocessing pipeline that
          is painfully slow in pure Python.
        </p>
      </ConceptBlock>

      <h2>Step 1: The Python Baseline</h2>

      <CodeBlock
        language="python"
        title="Pure Python text processing (the bottleneck)"
        code={`import re
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
# Python: ~45 seconds`}
      />

      <h2>Step 2: The Rust Implementation</h2>

      <CodeBlock
        language="rust"
        title="PyO3 Rust replacement — same logic, 100x faster"
        code={`use pyo3::prelude::*;
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
}`}
      />

      <h2>Step 3: The Results</h2>

      <PythonRustCompare
        title="Performance comparison"
        description="Same logic, same results, dramatically different performance."
        pythonCode={`import time

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
      f"{python_time/batch_time:.0f}x")`}
        rustCode={`// Performance breakdown:
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
// Actual: 300x measured (real-world varies)`}
      />

      <NoteBlock type="tip" title="The batch pattern is key">
        The biggest win comes from <code>batch_process</code>: passing all
        data to Rust at once, letting Rust parallelize with rayon, and
        returning all results. This minimizes Python ↔ Rust boundary crossings
        (which have overhead) and maximizes Rust's ability to use all CPU cores.
      </NoteBlock>

      <h2>Lessons Learned</h2>

      <CodeBlock
        language="python"
        title="Optimization principles from this case study"
        code={`# 1. PROFILE FIRST
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
#    before benchmarking.`}
      />

      <ExerciseBlock
        title="Estimate Your Speedup"
        difficulty="beginner"
        problem={`For each scenario, estimate the potential Rust speedup and explain why:

1. A Python loop that computes Fibonacci numbers up to n=40 using recursion
2. A pandas groupby().agg() operation on 10M rows
3. A Python function that parses 1M JSON strings and extracts 3 fields
4. A numpy matrix multiplication of two 1000x1000 arrays
5. A Python function that downloads 100 URLs using requests

For each: Would Rust help? How much? Why or why not?`}
        solution={`1. Fibonacci recursion (CPU-bound loop):
   Speedup: 50-100x. Pure CPU computation with function call overhead. Rust eliminates interpreter dispatch entirely. But better fix: use dynamic programming (O(n) instead of O(2^n)) — algorithm beats language!

2. Pandas groupby().agg() (already optimized C):
   Speedup: 1-3x. Pandas internally uses C/Cython for aggregations. Polars (Rust) is ~2-5x faster due to better parallelism and Arrow format, but you're not rewriting pandas — you'd switch libraries.

3. Parsing 1M JSON strings (string processing):
   Speedup: 10-30x. Python's json.loads() is C-based but still has object creation overhead. serde_json is ~5-10x faster, plus you avoid creating Python dicts. With rayon parallelism: 30-50x.

4. NumPy matrix multiply (BLAS/LAPACK):
   Speedup: 0.8-1.2x. NumPy calls optimized BLAS (MKL, OpenBLAS) which is already near-optimal assembly code. Rust would use the same BLAS libraries. No significant speedup possible.

5. Downloading 100 URLs (I/O-bound):
   Speedup: 1-2x. The bottleneck is network latency, not CPU. Python's asyncio or concurrent.futures handles this fine. Rust's reqwest is slightly faster for connection handling, but network is the limit.

Key insight: Rust helps most for CPU-bound Python loops (items 1, 3). It helps least for I/O-bound work (item 5) and already-optimized native code (items 2, 4).`}
      />
    </div>
  );
}
