import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function WhyDifferent() {
  return (
    <div className="prose-rust">
      <h1>Why Rust Concurrency Is Different</h1>

      <p>
        Python developers know the pain of the GIL — the Global Interpreter Lock
        that prevents true parallel execution of Python code. Rust has no GIL,
        no garbage collector, and the compiler catches data races at compile
        time. This is what the Rust community calls <strong>fearless
        concurrency</strong>.
      </p>

      <ConceptBlock title="The GIL Problem">
        <p>
          Python's GIL ensures only one thread executes Python bytecode at a
          time. You can spawn 16 threads on a 16-core machine, but they take
          turns — CPU-bound work gets zero parallelism. Workarounds
          like <code>multiprocessing</code> copy data between processes,
          adding overhead and complexity.
        </p>
        <p>
          Rust has no GIL. Threads run truly in parallel, and the type system
          ensures you cannot introduce data races. If your code compiles, it
          is free of data races — guaranteed.
        </p>
      </ConceptBlock>

      <h2>Threads: Python vs Rust</h2>

      <PythonRustCompare
        title="CPU-bound work across threads"
        description="Python's threads are serialized by the GIL. Rust's threads achieve true parallelism."
        pythonCode={`import threading
import time

def cpu_work(n):
    """Sum of squares — pure CPU work"""
    total = sum(i * i for i in range(n))
    return total

start = time.time()

threads = []
for _ in range(4):
    t = threading.Thread(target=cpu_work,
                         args=(10_000_000,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

elapsed = time.time() - start
# ~8 seconds — GIL serializes all 4 threads!
# Same speed as running sequentially
print(f"Elapsed: {elapsed:.2f}s")`}
        rustCode={`use std::thread;
use std::time::Instant;

fn cpu_work(n: u64) -> u64 {
    (0..n).map(|i| i * i).sum()
}

fn main() {
    let start = Instant::now();

    let handles: Vec<_> = (0..4)
        .map(|_| {
            thread::spawn(|| cpu_work(10_000_000))
        })
        .collect();

    let results: Vec<u64> = handles
        .into_iter()
        .map(|h| h.join().unwrap())
        .collect();

    let elapsed = start.elapsed();
    // ~0.5 seconds — true 4x parallelism!
    // 4 threads on 4 cores simultaneously
    println!("Elapsed: {:.2?}", elapsed);
    println!("Results: {:?}", results);
}`}
      />

      <NoteBlock type="pythonista" title="No GIL means real speedups">
        In Python, <code>threading</code> is useful for I/O-bound work (network
        calls, file reads) but useless for CPU-bound work due to the GIL. In
        Rust, every thread gets its own core. A 4-thread program on a 4-core
        machine runs genuinely 4x faster for CPU-bound work.
      </NoteBlock>

      <h2>The Compiler Catches Data Races</h2>

      <CodeBlock
        language="rust"
        title="Rust prevents data races at compile time"
        code={`use std::thread;

fn main() {
    let mut counter = 0;

    // This will NOT compile!
    // thread::spawn(|| {
    //     counter += 1;  // ERROR: cannot borrow as mutable
    // });                // because it's captured by another closure

    // The compiler prevents you from sharing mutable state
    // across threads without synchronization.

    // Python equivalent would silently produce wrong results:
    //   counter = 0
    //   def inc():
    //       global counter
    //       for _ in range(1_000_000):
    //           counter += 1  # race condition!

    // Rust forces you to use proper synchronization:
    use std::sync::{Arc, Mutex};

    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..4 {
        let counter = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        }));
    }

    for h in handles {
        h.join().unwrap();
    }

    println!("Counter: {}", *counter.lock().unwrap()); // Always 4
}`}
      />

      <h2>Send and Sync: Compile-Time Thread Safety</h2>

      <CodeBlock
        language="rust"
        title="The Send and Sync traits"
        code={`use std::rc::Rc;
use std::sync::Arc;

// Send: safe to TRANSFER ownership to another thread
// Sync: safe to SHARE references between threads

// Most types are Send + Sync automatically.
// The compiler derives it from their fields.

fn must_be_send<T: Send>(_val: T) {}
fn must_be_sync<T: Sync>(_val: T) {}

fn main() {
    // i32 is Send + Sync ✓
    must_be_send(42_i32);
    must_be_sync(&42_i32);

    // String is Send + Sync ✓
    must_be_send(String::from("hello"));

    // Vec<i32> is Send + Sync ✓
    must_be_send(vec![1, 2, 3]);

    // Rc is NOT Send — compile error if uncommented:
    // let rc = Rc::new(42);
    // must_be_send(rc);  // ERROR: Rc<i32> cannot be sent

    // Arc IS Send + Sync ✓
    let arc = Arc::new(42);
    must_be_send(Arc::clone(&arc));
    must_be_sync(&arc);
}

// You never implement Send/Sync manually (usually).
// The compiler checks them automatically when you
// try to use a type across threads.`}
      />

      <NoteBlock type="tip" title="You rarely think about Send and Sync directly">
        In practice, you just write your code and the compiler tells you if
        something is not thread-safe. If you see an error like "Rc does not
        implement Send," just switch to <code>Arc</code>. The type system
        guides you to the correct solution.
      </NoteBlock>

      <h2>Python Workarounds vs Rust Native</h2>

      <PythonRustCompare
        title="Achieving parallelism"
        description="Python requires multiprocessing (with serialization overhead). Rust threads share memory directly."
        pythonCode={`from multiprocessing import Pool
import time

def process_chunk(chunk):
    return sum(x ** 2 for x in chunk)

data = list(range(10_000_000))
chunks = [data[i::4] for i in range(4)]

start = time.time()

# multiprocessing: copies data to each process!
# Serialization overhead is significant
with Pool(4) as pool:
    results = pool.map(process_chunk, chunks)

total = sum(results)
elapsed = time.time() - start
print(f"Result: {total}, Time: {elapsed:.2f}s")
# Parallelism works but data copying adds overhead`}
        rustCode={`use std::thread;

fn process_chunk(chunk: &[u64]) -> u64 {
    chunk.iter().map(|x| x * x).sum()
}

fn main() {
    let data: Vec<u64> = (0..10_000_000).collect();

    let start = std::time::Instant::now();

    // Split into chunks and process in parallel
    // No copying — threads borrow slices of the data
    let chunk_size = data.len() / 4;
    let results: Vec<u64> = thread::scope(|s| {
        data.chunks(chunk_size)
            .map(|chunk| s.spawn(|| process_chunk(chunk)))
            .collect::<Vec<_>>()
            .into_iter()
            .map(|h| h.join().unwrap())
            .collect()
    });

    let total: u64 = results.iter().sum();
    println!("Result: {}, Time: {:.2?}", total,
             start.elapsed());
    // True parallelism, zero-copy shared data
}`}
      />

      <ExerciseBlock
        title="Parallel Sum"
        difficulty="intermediate"
        problem={`Write a function parallel_sum that:

1. Takes a Vec<i64> of numbers
2. Splits it into 4 chunks using .chunks()
3. Uses thread::scope to sum each chunk in parallel
4. Returns the total sum

Compare the result with the sequential .iter().sum() to verify correctness.

Hint: thread::scope lets spawned threads borrow local data — no Arc needed!`}
        solution={`use std::thread;

fn parallel_sum(data: &[i64]) -> i64 {
    let chunk_size = (data.len() + 3) / 4; // round up

    thread::scope(|s| {
        let handles: Vec<_> = data
            .chunks(chunk_size)
            .map(|chunk| {
                s.spawn(|| -> i64 { chunk.iter().sum() })
            })
            .collect();

        handles
            .into_iter()
            .map(|h| h.join().unwrap())
            .sum()
    })
}

fn main() {
    let data: Vec<i64> = (1..=1_000_000).collect();

    let sequential: i64 = data.iter().sum();
    let parallel = parallel_sum(&data);

    assert_eq!(sequential, parallel);
    println!("Both produce: {}", sequential);

    // thread::scope is special: it guarantees all spawned
    // threads finish before the scope ends, so threads can
    // safely borrow local variables like &data.
    // This is much more ergonomic than Arc for read-only
    // shared data.
}`}
      />
    </div>
  );
}
