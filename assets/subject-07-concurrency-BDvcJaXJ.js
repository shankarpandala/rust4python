import{j as e}from"./vendor-Dh_dlHsl.js";import{C as s,P as r,N as a,a as t,E as n}from"./subject-01-getting-started-DoSDK0Fn.js";function i(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Why Rust Concurrency Is Different"}),e.jsxs("p",{children:["Python developers know the pain of the GIL — the Global Interpreter Lock that prevents true parallel execution of Python code. Rust has no GIL, no garbage collector, and the compiler catches data races at compile time. This is what the Rust community calls ",e.jsx("strong",{children:"fearless concurrency"}),"."]}),e.jsxs(s,{title:"The GIL Problem",children:[e.jsxs("p",{children:["Python's GIL ensures only one thread executes Python bytecode at a time. You can spawn 16 threads on a 16-core machine, but they take turns — CPU-bound work gets zero parallelism. Workarounds like ",e.jsx("code",{children:"multiprocessing"})," copy data between processes, adding overhead and complexity."]}),e.jsx("p",{children:"Rust has no GIL. Threads run truly in parallel, and the type system ensures you cannot introduce data races. If your code compiles, it is free of data races — guaranteed."})]}),e.jsx("h2",{children:"Threads: Python vs Rust"}),e.jsx(r,{title:"CPU-bound work across threads",description:"Python's threads are serialized by the GIL. Rust's threads achieve true parallelism.",pythonCode:`import threading
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
print(f"Elapsed: {elapsed:.2f}s")`,rustCode:`use std::thread;
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
}`}),e.jsxs(a,{type:"pythonista",title:"No GIL means real speedups",children:["In Python, ",e.jsx("code",{children:"threading"})," is useful for I/O-bound work (network calls, file reads) but useless for CPU-bound work due to the GIL. In Rust, every thread gets its own core. A 4-thread program on a 4-core machine runs genuinely 4x faster for CPU-bound work."]}),e.jsx("h2",{children:"The Compiler Catches Data Races"}),e.jsx(t,{language:"rust",title:"Rust prevents data races at compile time",code:`use std::thread;

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
}`}),e.jsx("h2",{children:"Send and Sync: Compile-Time Thread Safety"}),e.jsx(t,{language:"rust",title:"The Send and Sync traits",code:`use std::rc::Rc;
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
// try to use a type across threads.`}),e.jsxs(a,{type:"tip",title:"You rarely think about Send and Sync directly",children:['In practice, you just write your code and the compiler tells you if something is not thread-safe. If you see an error like "Rc does not implement Send," just switch to ',e.jsx("code",{children:"Arc"}),". The type system guides you to the correct solution."]}),e.jsx("h2",{children:"Python Workarounds vs Rust Native"}),e.jsx(r,{title:"Achieving parallelism",description:"Python requires multiprocessing (with serialization overhead). Rust threads share memory directly.",pythonCode:`from multiprocessing import Pool
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
# Parallelism works but data copying adds overhead`,rustCode:`use std::thread;

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
}`}),e.jsx(n,{title:"Parallel Sum",difficulty:"intermediate",problem:`Write a function parallel_sum that:

1. Takes a Vec<i64> of numbers
2. Splits it into 4 chunks using .chunks()
3. Uses thread::scope to sum each chunk in parallel
4. Returns the total sum

Compare the result with the sequential .iter().sum() to verify correctness.

Hint: thread::scope lets spawned threads borrow local data — no Arc needed!`,solution:`use std::thread;

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
}`})]})}const h=Object.freeze(Object.defineProperty({__proto__:null,default:i},Symbol.toStringTag,{value:"Module"}));function o(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Mutex<T> & RwLock<T>"}),e.jsxs("p",{children:["When multiple threads need to read and write shared data, you need synchronization primitives. Rust's ",e.jsx("code",{children:"Mutex<T>"})," and"," ",e.jsx("code",{children:"RwLock<T>"})," protect data at the type level — you literally cannot access the data without acquiring the lock first. This is fundamentally different from Python, where locks are advisory and easily forgotten."]}),e.jsx(s,{title:"Mutex: Mutual Exclusion",children:e.jsxs("p",{children:["A ",e.jsx("code",{children:"Mutex<T>"})," wraps data of type ",e.jsx("code",{children:"T"})," and requires you to call ",e.jsx("code",{children:".lock()"})," before accessing it. Only one thread can hold the lock at a time. In Python, you can forget to acquire a lock and get subtle bugs. In Rust, the type system makes it impossible to access the data without locking."]})}),e.jsx("h2",{children:"Mutex in Python vs Rust"}),e.jsx(r,{title:"Protecting shared state",description:"Python locks are advisory — you can forget them. Rust's Mutex guards the data itself.",pythonCode:`import threading

counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100_000):
        with lock:
            counter += 1

    # BUG: nothing stops you from doing this
    # without the lock — Python won't warn you:
    # counter += 1  # data race!

threads = [threading.Thread(target=increment)
           for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(f"Counter: {counter}")  # 400000 (if lucky)`,rustCode:`use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // The data is INSIDE the Mutex —
    // you MUST lock to access it
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..4 {
        let counter = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..100_000 {
                let mut num = counter.lock().unwrap();
                *num += 1;
                // lock released when 'num' is dropped
            }
        }));
    }

    for h in handles { h.join().unwrap(); }
    println!("Counter: {}", *counter.lock().unwrap());
    // Always exactly 400000 — guaranteed!
}`}),e.jsxs(a,{type:"pythonista",title:"The lock IS the access",children:["In Python, the lock and the data are separate — you choose to use a lock, and nothing enforces it. In Rust, ",e.jsx("code",{children:"Mutex<T>"}),"owns the data. The only way to get a reference to the inner"," ",e.jsx("code",{children:"T"})," is through ",e.jsx("code",{children:".lock()"}),". This makes it structurally impossible to access shared data without synchronization."]}),e.jsx("h2",{children:"MutexGuard and RAII"}),e.jsx(t,{language:"rust",title:"Lock guards auto-release when dropped",code:`use std::sync::Mutex;

fn main() {
    let data = Mutex::new(vec![1, 2, 3]);

    // .lock() returns a MutexGuard
    {
        let mut guard = data.lock().unwrap();
        guard.push(4);
        guard.push(5);
        println!("Inside lock: {:?}", *guard);
        // guard dropped here → lock released
    }

    // Lock is released — another thread could acquire it now

    // Common pattern: limit the lock scope
    let len = {
        let guard = data.lock().unwrap();
        guard.len()
        // guard dropped, lock released
    };
    println!("Length: {}", len);

    // Anti-pattern: holding the lock too long
    // let guard = data.lock().unwrap();
    // slow_network_call();  // blocks other threads!
    // drop(guard);  // explicit drop if needed
}`}),e.jsx("h2",{children:"RwLock: Multiple Readers, One Writer"}),e.jsx(r,{title:"Read-heavy workloads",description:"RwLock allows many simultaneous readers but exclusive writers — ideal for config, caches, and lookup tables.",pythonCode:`import threading

# Python has no built-in RwLock, but you can
# approximate with threading.Lock
config = {"model": "gpt-4", "temp": 0.7}
lock = threading.Lock()

def read_config():
    with lock:  # blocks ALL other access
        return config.copy()

def update_config(key, value):
    with lock:
        config[key] = value

# Problem: readers block other readers
# unnecessarily with a plain Lock`,rustCode:`use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
    let config = Arc::new(RwLock::new(
        vec![("model", "gpt-4"), ("temp", "0.7")]
    ));

    let mut handles = vec![];

    // Spawn 8 reader threads
    for i in 0..8 {
        let cfg = Arc::clone(&config);
        handles.push(thread::spawn(move || {
            // .read() — many threads can read at once!
            let data = cfg.read().unwrap();
            println!("Reader {}: {:?}", i, *data);
        }));
    }

    // Spawn 1 writer thread
    {
        let cfg = Arc::clone(&config);
        handles.push(thread::spawn(move || {
            // .write() — exclusive access
            let mut data = cfg.write().unwrap();
            data.push(("new_key", "value"));
        }));
    }

    for h in handles { h.join().unwrap(); }
}`}),e.jsx("h2",{children:"Mutex vs RwLock: When to Use Which"}),e.jsx(t,{language:"rust",title:"Choosing the right lock",code:`use std::sync::{Mutex, RwLock};

// Mutex: simple, lower overhead
// Use when: writes are frequent, or lock is held briefly
let counter = Mutex::new(0_u64);
{
    let mut val = counter.lock().unwrap();
    *val += 1;
}

// RwLock: allows concurrent reads
// Use when: reads greatly outnumber writes
let cache = RwLock::new(std::collections::HashMap::new());
{
    // Many threads can read simultaneously
    let reader = cache.read().unwrap();
    let _ = reader.get("key");
}
{
    // Only one thread can write (blocks readers too)
    let mut writer = cache.write().unwrap();
    writer.insert("key", "value");
}

// Rule of thumb:
// - >90% reads → RwLock
// - Mixed read/write → Mutex (simpler, less overhead)
// - Write-heavy → Mutex`}),e.jsx(a,{type:"warning",title:"Deadlocks are still possible",children:"Rust prevents data races but not deadlocks. If thread A locks mutex 1 then tries to lock mutex 2, while thread B locks mutex 2 then tries to lock mutex 1, both threads will wait forever. Always acquire locks in a consistent order."}),e.jsx(n,{title:"Thread-Safe Word Counter",difficulty:"intermediate",problem:`Build a parallel word frequency counter:

1. Create a HashMap<String, usize> wrapped in Arc<Mutex<...>>
2. Split this text into 3 chunks: "the cat sat on the mat the cat ate the rat"
3. Spawn a thread for each chunk that counts word frequencies and merges into the shared map
4. Print the final word counts

Bonus: Could you use RwLock instead? Why or why not?`,solution:`use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counts: Arc<Mutex<HashMap<String, usize>>> =
        Arc::new(Mutex::new(HashMap::new()));

    let chunks = vec![
        "the cat sat on",
        "the mat the cat",
        "ate the rat",
    ];

    let handles: Vec<_> = chunks
        .into_iter()
        .map(|chunk| {
            let counts = Arc::clone(&counts);
            thread::spawn(move || {
                // Count locally first (no lock needed)
                let mut local: HashMap<String, usize> = HashMap::new();
                for word in chunk.split_whitespace() {
                    *local.entry(word.to_string()).or_insert(0) += 1;
                }

                // Merge into shared map (lock once)
                let mut global = counts.lock().unwrap();
                for (word, count) in local {
                    *global.entry(word).or_insert(0) += count;
                }
            })
        })
        .collect();

    for h in handles { h.join().unwrap(); }

    let final_counts = counts.lock().unwrap();
    for (word, count) in final_counts.iter() {
        println!("{}: {}", word, count);
    }
    // "the": 4, "cat": 2, etc.

    // RwLock wouldn't help here because every thread writes.
    // RwLock shines when most threads only read.
    // Mutex is simpler and more efficient for write-heavy workloads.
}`})]})}const p=Object.freeze(Object.defineProperty({__proto__:null,default:o},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"par_iter() Magic — Easy Parallelism with Rayon"}),e.jsxs("p",{children:["What if making your code parallel was as simple as changing"," ",e.jsx("code",{children:".iter()"})," to ",e.jsx("code",{children:".par_iter()"}),"? That is exactly what the Rayon crate offers. It automatically splits work across all CPU cores using work-stealing, with zero data races guaranteed by the compiler."]}),e.jsx(s,{title:"What Is Rayon?",children:e.jsxs("p",{children:["Rayon is a data parallelism library for Rust. It provides parallel iterators that look and feel like regular iterators but distribute work across a thread pool automatically. The key insight: if your operation is safe to run sequentially with ",e.jsx("code",{children:".iter()"}),", it is safe to run in parallel with ",e.jsx("code",{children:".par_iter()"})," — the type system guarantees it."]})}),e.jsx("h2",{children:"From Sequential to Parallel: One Word Change"}),e.jsx(r,{title:"Parallelizing a computation",description:"Python needs multiprocessing with serialization overhead. Rust with Rayon just swaps .iter() for .par_iter().",pythonCode:`from multiprocessing import Pool
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
              if p]`,rustCode:`use rayon::prelude::*;

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
}`}),e.jsxs(a,{type:"pythonista",title:"No serialization overhead",children:["Python's ",e.jsx("code",{children:"multiprocessing"})," must pickle data to send it between processes, then unpickle the results. Rayon threads share the same memory space — the data stays in place and threads read it directly. This alone can make Rayon 10x faster than Python's multiprocessing for data-heavy workloads."]}),e.jsx("h2",{children:"Common Parallel Operations"}),e.jsx(t,{language:"rust",title:"Rayon's parallel iterator toolkit",code:`use rayon::prelude::*;

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
}`}),e.jsx("h2",{children:"par_chunks for Batch Processing"}),e.jsx(t,{language:"rust",title:"Processing data in parallel batches",code:`use rayon::prelude::*;

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
}`}),e.jsxs(a,{type:"tip",title:"When NOT to use par_iter()",children:["Rayon has thread pool overhead. For very small collections (under ~1000 elements) or very cheap operations (addition, comparison), the sequential ",e.jsx("code",{children:".iter()"})," is faster. Use ",e.jsx("code",{children:"par_iter()"}),"when each element requires meaningful computation or when the collection is large."]}),e.jsx("h2",{children:"Adding Rayon to Your Project"}),e.jsx(t,{language:"toml",title:"Cargo.toml — one dependency",code:`[dependencies]
rayon = "1.10"`}),e.jsx(n,{title:"Parallel Statistics",difficulty:"intermediate",problem:`Given a Vec<f64> of 10 million random-ish values (use (0..10_000_000).map(|i| (i as f64 * 0.001).sin())):

1. Use par_iter() to compute the sum
2. Use par_iter() to find the min and max (hint: .reduce())
3. Compute the mean from the parallel sum
4. Compare timing of .iter().sum() vs .par_iter().sum()

Hint: For min/max, try .reduce(|| f64::INFINITY, |a, b| a.min(b))`,solution:`use rayon::prelude::*;
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
}`})]})}const m=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));function c(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"async/await Fundamentals"}),e.jsxs("p",{children:["If you have used Python's ",e.jsx("code",{children:"asyncio"}),", Rust's async/await will feel familiar — but with some key differences. Both languages use the same keywords and the same core idea: write asynchronous code that looks like synchronous code. But Rust's async is zero-cost, has no built-in runtime, and produces state machines at compile time instead of coroutine objects at runtime."]}),e.jsxs(s,{title:"Async in Rust vs Python",children:[e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"asyncio"})," comes with a built-in event loop and runtime. Rust's ",e.jsx("code",{children:"async"})," is a language feature with no built-in runtime — you choose one (Tokio, async-std, smol). This separation means Rust async can be used in embedded systems, WebAssembly, or custom environments."]}),e.jsxs("p",{children:["The biggest conceptual difference: Rust futures are ",e.jsx("strong",{children:"lazy"}),". Calling an async function returns a future that does nothing until you",e.jsx("code",{children:".await"})," it. Python coroutines are also lazy, but the event loop drives them automatically once scheduled."]})]}),e.jsx("h2",{children:"Basic async/await Syntax"}),e.jsx(r,{title:"Defining and calling async functions",description:"The syntax is nearly identical. The key difference is Rust needs an explicit runtime.",pythonCode:`import asyncio

async def fetch_data(url: str) -> str:
    # Simulate network request
    await asyncio.sleep(1)
    return f"Data from {url}"

async def main():
    # Await a single future
    result = await fetch_data("https://api.example.com")
    print(result)

    # Run multiple futures concurrently
    results = await asyncio.gather(
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com"),
    )
    for r in results:
        print(r)

# Python provides the runtime
asyncio.run(main())`,rustCode:`use tokio::time::{sleep, Duration};

async fn fetch_data(url: &str) -> String {
    // Simulate network request
    sleep(Duration::from_secs(1)).await;
    format!("Data from {}", url)
}

#[tokio::main]  // provides the runtime
async fn main() {
    // Await a single future
    let result = fetch_data("https://api.example.com").await;
    println!("{}", result);

    // Run multiple futures concurrently
    let (r1, r2, r3) = tokio::join!(
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com"),
    );
    println!("{}", r1);
    println!("{}", r2);
    println!("{}", r3);
}`}),e.jsxs(a,{type:"pythonista",title:"You must choose a runtime",children:["Python ships ",e.jsx("code",{children:"asyncio"})," in the standard library. Rust has no built-in async runtime. The most popular choice is ",e.jsx("strong",{children:"Tokio"}),", which provides the event loop, task spawning, timers, and I/O. Add it to ",e.jsx("code",{children:"Cargo.toml"})," with"," ",e.jsx("code",{children:'tokio = { version = "1", features = ["full"] }'}),"."]}),e.jsx("h2",{children:"Spawning Tasks"}),e.jsx(r,{title:"Concurrent tasks",description:"Both languages let you spawn tasks that run concurrently on the event loop.",pythonCode:`import asyncio

async def process(id: int):
    print(f"Task {id} started")
    await asyncio.sleep(1)
    print(f"Task {id} done")
    return id * 10

async def main():
    # Create tasks that run concurrently
    tasks = [asyncio.create_task(process(i))
             for i in range(5)]

    # Wait for all to complete
    results = await asyncio.gather(*tasks)
    print(f"Results: {results}")

asyncio.run(main())`,rustCode:`use tokio::time::{sleep, Duration};

async fn process(id: u32) -> u32 {
    println!("Task {} started", id);
    sleep(Duration::from_secs(1)).await;
    println!("Task {} done", id);
    id * 10
}

#[tokio::main]
async fn main() {
    // Spawn tasks that run concurrently
    let mut handles = vec![];
    for i in 0..5 {
        handles.push(tokio::spawn(process(i)));
    }

    // Wait for all to complete
    let mut results = vec![];
    for handle in handles {
        results.push(handle.await.unwrap());
    }
    println!("Results: {:?}", results);
}`}),e.jsx("h2",{children:"Error Handling in Async"}),e.jsx(t,{language:"rust",title:"Async functions with Result",code:`use tokio::time::{sleep, Duration};
use std::fmt;

#[derive(Debug)]
enum ApiError {
    Timeout,
    NotFound(String),
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ApiError::Timeout => write!(f, "Request timed out"),
            ApiError::NotFound(url) => write!(f, "Not found: {}", url),
        }
    }
}

async fn fetch_with_retry(
    url: &str,
    retries: u32,
) -> Result<String, ApiError> {
    for attempt in 0..retries {
        match try_fetch(url).await {
            Ok(data) => return Ok(data),
            Err(e) => {
                println!("Attempt {} failed: {}", attempt + 1, e);
                sleep(Duration::from_millis(100)).await;
            }
        }
    }
    Err(ApiError::Timeout)
}

async fn try_fetch(url: &str) -> Result<String, ApiError> {
    sleep(Duration::from_millis(50)).await;
    if url.contains("missing") {
        Err(ApiError::NotFound(url.to_string()))
    } else {
        Ok(format!("Response from {}", url))
    }
}

#[tokio::main]
async fn main() {
    match fetch_with_retry("https://api.example.com", 3).await {
        Ok(data) => println!("Success: {}", data),
        Err(e) => println!("Failed: {}", e),
    }
}`}),e.jsxs(a,{type:"tip",title:"Async is for I/O, not CPU",children:["Just like in Python, async/await is designed for I/O-bound work: network requests, file reads, database queries. For CPU-bound work, use threads (or Rayon). Mixing them is common: use Tokio for I/O and ",e.jsx("code",{children:"tokio::task::spawn_blocking"})," to offload CPU work to a thread pool."]}),e.jsx("h2",{children:"Setting Up Tokio"}),e.jsx(t,{language:"toml",title:"Cargo.toml for async projects",code:`[dependencies]
tokio = { version = "1", features = ["full"] }
# "full" includes: rt-multi-thread, macros, time, io, net, sync, fs

# For HTTP requests:
reqwest = { version = "0.12", features = ["json"] }

# For async traits:
async-trait = "0.1"`}),e.jsx(n,{title:"Async Temperature Fetcher",difficulty:"intermediate",problem:`Write an async program that:

1. Defines an async function get_temperature(city: &str) -> f64 that simulates fetching a temperature (use sleep + return a made-up value based on the city name length)
2. Fetches temperatures for ["London", "Tokyo", "New York", "Sydney"] concurrently using tokio::join! or spawned tasks
3. Computes and prints the average temperature

Compare: how would you do this with asyncio.gather in Python?`,solution:`use tokio::time::{sleep, Duration};

async fn get_temperature(city: &str) -> f64 {
    // Simulate API call
    sleep(Duration::from_millis(500)).await;
    // Fake temperature based on city name length
    20.0 + city.len() as f64 * 1.5
}

#[tokio::main]
async fn main() {
    let cities = ["London", "Tokyo", "New York", "Sydney"];

    // Approach 1: tokio::join! (fixed number of futures)
    let (t1, t2, t3, t4) = tokio::join!(
        get_temperature(cities[0]),
        get_temperature(cities[1]),
        get_temperature(cities[2]),
        get_temperature(cities[3]),
    );

    let temps = [t1, t2, t3, t4];
    for (city, temp) in cities.iter().zip(&temps) {
        println!("{}: {:.1}°C", city, temp);
    }

    let avg: f64 = temps.iter().sum::<f64>() / temps.len() as f64;
    println!("Average: {:.1}°C", avg);

    // Approach 2: spawn tasks (dynamic number of futures)
    let mut handles = vec![];
    for city in &cities {
        let city = city.to_string();
        handles.push(tokio::spawn(async move {
            get_temperature(&city).await
        }));
    }

    let mut temps2 = vec![];
    for h in handles {
        temps2.push(h.await.unwrap());
    }

    // Both approaches run all fetches concurrently —
    // total time is ~500ms, not 4 × 500ms = 2000ms.
    // Python equivalent: asyncio.gather(*coros)
}`})]})}const f=Object.freeze(Object.defineProperty({__proto__:null,default:c},Symbol.toStringTag,{value:"Module"}));export{p as a,m as b,f as c,h as s};
