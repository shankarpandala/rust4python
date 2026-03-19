import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function IdentifyingBottlenecks() {
  return (
    <div className="prose-rust">
      <h1>Identifying Bottlenecks</h1>

      <p>
        Before rewriting anything in Rust, you need to know <em>where</em> your
        Python code is slow. Blindly porting code to Rust is wasted effort
        if the bottleneck is I/O-bound or already in optimized C/Fortran
        (NumPy, BLAS). The key is profiling first, then targeting only the
        hot spots.
      </p>

      <ConceptBlock title="The 90/10 Rule">
        <p>
          Typically, 90% of a program's execution time is spent in 10% of the
          code. Your job is to find that 10%. If a function takes 0.1% of the
          total runtime, making it 100x faster saves virtually nothing. But if
          a function takes 80% of the runtime, a 10x speedup cuts total time
          by 72%.
        </p>
      </ConceptBlock>

      <h2>Python Profiling Tools</h2>

      <PythonRustCompare
        title="Profiling Python code"
        description="Profile first in Python, then decide what to accelerate with Rust."
        pythonCode={`import cProfile
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
print(f"Pipeline took {elapsed:.3f}s")`}
        rustCode={`// After identifying the bottleneck in Python,
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
}`}
      />

      <h2>Common Bottleneck Patterns</h2>

      <CodeBlock
        language="python"
        title="Five patterns that scream 'rewrite in Rust'"
        code={`# Pattern 1: Element-wise loops over large data
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
    result = process_batch(batch)  # CPU-bound, single-threaded`}
      />

      <NoteBlock type="pythonista" title="Not everything needs Rust">
        If your bottleneck is: network I/O, database queries, disk reads,
        or already-optimized C extensions (NumPy, scipy, BLAS), Rust will
        not help much. Rust shines for: CPU-bound loops, string processing,
        custom algorithms, parallel processing, and memory-intensive tasks.
      </NoteBlock>

      <h2>Decision Framework</h2>

      <CodeBlock
        language="python"
        title="Should you rewrite it in Rust?"
        code={`# Decision tree for Rust acceleration:

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
# ✅ Data validation/cleaning pipelines`}
      />

      <h2>Profiling Strategy</h2>

      <CodeBlock
        language="python"
        title="A systematic profiling workflow"
        code={`import time
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
# rewriting in Rust. aggregate is already fast enough.`}
      />

      <ExerciseBlock
        title="Profile and Prioritize"
        difficulty="beginner"
        problem={`Consider this Python ML pipeline with timing data:

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
4. What is the theoretical minimum total time if you achieve 10x speedup on the best candidate?`}
        solution={`1. Best candidates for Rust:
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

Key insight: Always profile first. The 5s tokenize function is worth 50x more optimization effort than the 0.1s evaluate function.`}
      />
    </div>
  );
}
