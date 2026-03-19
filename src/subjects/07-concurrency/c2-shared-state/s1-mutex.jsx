import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function MutexRwLock() {
  return (
    <div className="prose-rust">
      <h1>Mutex&lt;T&gt; &amp; RwLock&lt;T&gt;</h1>

      <p>
        When multiple threads need to read and write shared data, you need
        synchronization primitives. Rust's <code>Mutex&lt;T&gt;</code> and{' '}
        <code>RwLock&lt;T&gt;</code> protect data at the type level — you
        literally cannot access the data without acquiring the lock first.
        This is fundamentally different from Python, where locks are advisory
        and easily forgotten.
      </p>

      <ConceptBlock title="Mutex: Mutual Exclusion">
        <p>
          A <code>Mutex&lt;T&gt;</code> wraps data of type <code>T</code> and
          requires you to call <code>.lock()</code> before accessing it. Only
          one thread can hold the lock at a time. In Python, you can forget to
          acquire a lock and get subtle bugs. In Rust, the type system makes it
          impossible to access the data without locking.
        </p>
      </ConceptBlock>

      <h2>Mutex in Python vs Rust</h2>

      <PythonRustCompare
        title="Protecting shared state"
        description="Python locks are advisory — you can forget them. Rust's Mutex guards the data itself."
        pythonCode={`import threading

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
print(f"Counter: {counter}")  # 400000 (if lucky)`}
        rustCode={`use std::sync::{Arc, Mutex};
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
}`}
      />

      <NoteBlock type="pythonista" title="The lock IS the access">
        In Python, the lock and the data are separate — you choose to use a
        lock, and nothing enforces it. In Rust, <code>Mutex&lt;T&gt;</code>
        owns the data. The only way to get a reference to the inner{' '}
        <code>T</code> is through <code>.lock()</code>. This makes it
        structurally impossible to access shared data without synchronization.
      </NoteBlock>

      <h2>MutexGuard and RAII</h2>

      <CodeBlock
        language="rust"
        title="Lock guards auto-release when dropped"
        code={`use std::sync::Mutex;

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
}`}
      />

      <h2>RwLock: Multiple Readers, One Writer</h2>

      <PythonRustCompare
        title="Read-heavy workloads"
        description="RwLock allows many simultaneous readers but exclusive writers — ideal for config, caches, and lookup tables."
        pythonCode={`import threading

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
# unnecessarily with a plain Lock`}
        rustCode={`use std::sync::{Arc, RwLock};
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
}`}
      />

      <h2>Mutex vs RwLock: When to Use Which</h2>

      <CodeBlock
        language="rust"
        title="Choosing the right lock"
        code={`use std::sync::{Mutex, RwLock};

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
// - Write-heavy → Mutex`}
      />

      <NoteBlock type="warning" title="Deadlocks are still possible">
        Rust prevents data races but not deadlocks. If thread A locks mutex 1
        then tries to lock mutex 2, while thread B locks mutex 2 then tries to
        lock mutex 1, both threads will wait forever. Always acquire locks in
        a consistent order.
      </NoteBlock>

      <ExerciseBlock
        title="Thread-Safe Word Counter"
        difficulty="intermediate"
        problem={`Build a parallel word frequency counter:

1. Create a HashMap<String, usize> wrapped in Arc<Mutex<...>>
2. Split this text into 3 chunks: "the cat sat on the mat the cat ate the rat"
3. Spawn a thread for each chunk that counts word frequencies and merges into the shared map
4. Print the final word counts

Bonus: Could you use RwLock instead? Why or why not?`}
        solution={`use std::collections::HashMap;
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
}`}
      />
    </div>
  );
}
