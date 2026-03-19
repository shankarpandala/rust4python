import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ParIterMagic() {
  return (
    <div className="prose-rust">
      <h1>par_iter() Magic — Easy Parallelism with Rayon</h1>

      <p>
        What if making your code parallel was as simple as changing{' '}
        <code>.iter()</code> to <code>.par_iter()</code>? That is exactly what
        the Rayon crate offers. It automatically splits work across all CPU
        cores using work-stealing, with zero data races guaranteed by the
        compiler.
      </p>

      <ConceptBlock title="What Is Rayon?">
        <p>
          Rayon is a data parallelism library for Rust. It provides parallel
          iterators that look and feel like regular iterators but distribute
          work across a thread pool automatically. The key insight: if your
          operation is safe to run sequentially with <code>.iter()</code>,
          it is safe to run in parallel with <code>.par_iter()</code> — the
          type system guarantees it.
        </p>
      </ConceptBlock>

      <h2>From Sequential to Parallel: One Word Change</h2>

      <PythonRustCompare
        title="Parallelizing a computation"
        description="Python needs multiprocessing with serialization overhead. Rust with Rayon just swaps .iter() for .par_iter()."
        pythonCode={`from multiprocessing import Pool
import math

def is_prime(n):
    if n < 2: return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0: return False
    return True

numbers = list(range(2, 1_000_000))

# Sequential
primes = [n for n in numbers if is_prime(n)]
print(f"Found {len(primes)} primes")

# Parallel — requires multiprocessing
# Data must be serialized/deserialized!
with Pool(4) as pool:
    results = pool.map(is_prime, numbers)
    primes = [n for n, p in zip(numbers, results)
              if p]`}
        rustCode={`use rayon::prelude::*;

fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    let limit = (n as f64).sqrt() as u64;
    (2..=limit).all(|i| n % i != 0)
}

fn main() {
    let numbers: Vec<u64> = (2..1_000_000).collect();

    // Sequential — standard iterator
    let primes: Vec<&u64> = numbers.iter()
        .filter(|&&n| is_prime(n))
        .collect();
    println!("Found {} primes", primes.len());

    // Parallel — just change iter() to par_iter()!
    let primes: Vec<&u64> = numbers.par_iter()
        .filter(|&&n| is_prime(n))
        .collect();
    println!("Found {} primes (parallel)", primes.len());
    // Uses all CPU cores, zero-copy, no serialization
}`}
      />

      <NoteBlock type="pythonista" title="No serialization overhead">
        Python's <code>multiprocessing</code> must pickle data to send it
        between processes, then unpickle the results. Rayon threads share the
        same memory space — the data stays in place and threads read it
        directly. This alone can make Rayon 10x faster than Python's
        multiprocessing for data-heavy workloads.
      </NoteBlock>

      <h2>Common Parallel Operations</h2>

      <CodeBlock
        language="rust"
        title="Rayon's parallel iterator toolkit"
        code={`use rayon::prelude::*;

fn main() {
    let data: Vec<f64> = (0..10_000_000)
        .map(|i| i as f64)
        .collect();

    // par_iter() + map — transform in parallel
    let squares: Vec<f64> = data.par_iter()
        .map(|x| x * x)
        .collect();

    // par_iter() + filter + map — chain operations
    let result: Vec<f64> = data.par_iter()
        .filter(|&&x| x > 1000.0)
        .map(|x| x.sqrt())
        .collect();

    // par_iter() + sum — parallel reduction
    let total: f64 = data.par_iter().sum();

    // par_iter() + for_each — side effects
    data.par_iter()
        .for_each(|x| {
            if *x > 9_999_990.0 {
                println!("Large value: {}", x);
            }
        });

    // par_sort — parallel sorting
    let mut to_sort: Vec<i32> = (0..1_000_000)
        .rev()
        .collect();
    to_sort.par_sort();

    println!("Total: {}", total);
}`}
      />

      <h2>par_chunks for Batch Processing</h2>

      <CodeBlock
        language="rust"
        title="Processing data in parallel batches"
        code={`use rayon::prelude::*;

#[derive(Debug)]
struct Prediction {
    input: f64,
    output: f64,
}

fn expensive_inference(input: f64) -> f64 {
    // Simulate model inference
    (input * 0.5 + 1.0).sin() * 100.0
}

fn main() {
    let inputs: Vec<f64> = (0..100_000)
        .map(|i| i as f64 * 0.01)
        .collect();

    // Process in batches of 1000, in parallel
    let predictions: Vec<Prediction> = inputs
        .par_chunks(1000)
        .flat_map(|batch| {
            // Each batch processed by one thread
            batch.iter().map(|&input| Prediction {
                input,
                output: expensive_inference(input),
            }).collect::<Vec<_>>()
        })
        .collect();

    println!("Processed {} predictions", predictions.len());
    println!("First: {:?}", predictions[0]);
    println!("Last:  {:?}", predictions.last().unwrap());
}`}
      />

      <NoteBlock type="tip" title="When NOT to use par_iter()">
        Rayon has thread pool overhead. For very small collections (under ~1000
        elements) or very cheap operations (addition, comparison), the
        sequential <code>.iter()</code> is faster. Use <code>par_iter()</code>
        when each element requires meaningful computation or when the
        collection is large.
      </NoteBlock>

      <h2>Adding Rayon to Your Project</h2>

      <CodeBlock
        language="toml"
        title="Cargo.toml — one dependency"
        code={`[dependencies]
rayon = "1.10"`}
      />

      <ExerciseBlock
        title="Parallel Statistics"
        difficulty="intermediate"
        problem={`Given a Vec<f64> of 10 million random-ish values (use (0..10_000_000).map(|i| (i as f64 * 0.001).sin())):

1. Use par_iter() to compute the sum
2. Use par_iter() to find the min and max (hint: .reduce())
3. Compute the mean from the parallel sum
4. Compare timing of .iter().sum() vs .par_iter().sum()

Hint: For min/max, try .reduce(|| f64::INFINITY, |a, b| a.min(b))`}
        solution={`use rayon::prelude::*;
use std::time::Instant;

fn main() {
    let data: Vec<f64> = (0..10_000_000)
        .map(|i| (i as f64 * 0.001).sin())
        .collect();

    // Sequential sum
    let start = Instant::now();
    let seq_sum: f64 = data.iter().sum();
    let seq_time = start.elapsed();

    // Parallel sum
    let start = Instant::now();
    let par_sum: f64 = data.par_iter().sum();
    let par_time = start.elapsed();

    println!("Sequential: {:.4} in {:?}", seq_sum, seq_time);
    println!("Parallel:   {:.4} in {:?}", par_sum, par_time);

    // Parallel min and max
    let min = data.par_iter()
        .copied()
        .reduce(|| f64::INFINITY, f64::min);

    let max = data.par_iter()
        .copied()
        .reduce(|| f64::NEG_INFINITY, f64::max);

    let mean = par_sum / data.len() as f64;

    println!("Min: {:.4}, Max: {:.4}, Mean: {:.6}", min, max, mean);
    println!("Speedup: {:.1}x", seq_time.as_secs_f64() / par_time.as_secs_f64());
}`}
      />
    </div>
  );
}
