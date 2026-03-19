import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function RcArc() {
  return (
    <div className="prose-rust">
      <h1>Rc&lt;T&gt; &amp; Arc&lt;T&gt; — Reference Counting</h1>

      <p>
        Python manages memory with reference counting — every object tracks how
        many variables point to it, and gets freed when the count hits zero.
        Rust's ownership model normally requires a single owner, but sometimes
        you genuinely need shared ownership. That is where <code>Rc&lt;T&gt;</code> and{' '}
        <code>Arc&lt;T&gt;</code> come in — they bring Python-style reference
        counting to Rust, but as an explicit opt-in.
      </p>

      <ConceptBlock title="Rc vs Arc">
        <p>
          <code>Rc&lt;T&gt;</code> (Reference Counted) provides shared ownership
          for <strong>single-threaded</strong> code. It is cheap because it uses
          non-atomic reference counting.
        </p>
        <p>
          <code>Arc&lt;T&gt;</code> (Atomically Reference Counted) does the same
          for <strong>multi-threaded</strong> code, using atomic operations to
          safely update the count across threads.
        </p>
        <p>
          Both are analogous to Python's built-in refcounting, but you choose
          when to use them rather than paying the cost on every single value.
        </p>
      </ConceptBlock>

      <h2>Shared Ownership with Rc</h2>

      <PythonRustCompare
        title="Multiple owners of the same data"
        description="Python lets any number of variables reference the same object. In Rust, you use Rc to get that behavior."
        pythonCode={`import sys

data = [1, 2, 3, 4, 5]
print(sys.getrefcount(data))  # 2 (data + getrefcount arg)

# Multiple references — Python handles this
alias = data
print(sys.getrefcount(data))  # 3

another = data
print(sys.getrefcount(data))  # 4

# All three variables share the same list
# Freed when last reference goes away
del data
del alias
# 'another' still works — refcount is 1
print(another)  # [1, 2, 3, 4, 5]`}
        rustCode={`use std::rc::Rc;

fn main() {
    // Rc wraps data in a reference-counted pointer
    let data = Rc::new(vec![1, 2, 3, 4, 5]);
    println!("refcount: {}", Rc::strong_count(&data)); // 1

    // Clone the Rc — increments refcount, no data copy!
    let alias = Rc::clone(&data);
    println!("refcount: {}", Rc::strong_count(&data)); // 2

    let another = Rc::clone(&data);
    println!("refcount: {}", Rc::strong_count(&data)); // 3

    drop(data);
    drop(alias);
    // 'another' still works — refcount is 1
    println!("{:?}", another); // [1, 2, 3, 4, 5]
} // freed here when last Rc is dropped`}
      />

      <NoteBlock type="pythonista" title="Rc::clone is NOT a deep copy">
        Do not let the name fool you. <code>Rc::clone(&data)</code> only
        increments the reference count — it does NOT copy the underlying data.
        It is equivalent to Python's <code>alias = data</code> (which also
        just increments the refcount). An actual deep copy in Rust would use{' '}
        <code>.clone()</code> on the inner value directly.
      </NoteBlock>

      <h2>Rc in Graph Structures</h2>

      <CodeBlock
        language="rust"
        title="Multiple nodes sharing the same child"
        code={`use std::rc::Rc;

#[derive(Debug)]
struct Node {
    value: i32,
    children: Vec<Rc<Node>>,
}

fn main() {
    // Shared child node — referenced by two parents
    let shared_child = Rc::new(Node {
        value: 3,
        children: vec![],
    });

    let parent_a = Node {
        value: 1,
        children: vec![Rc::clone(&shared_child)],
    };

    let parent_b = Node {
        value: 2,
        children: vec![Rc::clone(&shared_child)],
    };

    println!("shared_child refcount: {}", Rc::strong_count(&shared_child));
    // 3: shared_child + parent_a's ref + parent_b's ref

    println!("parent_a child: {:?}", parent_a.children[0].value); // 3
    println!("parent_b child: {:?}", parent_b.children[0].value); // 3
}`}
      />

      <h2>Arc for Thread-Safe Sharing</h2>

      <PythonRustCompare
        title="Sharing data across threads"
        description="Python's GIL makes sharing 'safe' but slow. Rust's Arc provides true thread-safe sharing."
        pythonCode={`import threading

# Python: GIL makes this 'safe' but serialized
shared_data = [1, 2, 3, 4, 5]

def process(data):
    total = sum(data)
    print(f"Sum: {total}")

threads = []
for _ in range(4):
    # All threads share same list
    # GIL prevents true parallelism
    t = threading.Thread(target=process,
                         args=(shared_data,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()`}
        rustCode={`use std::sync::Arc;
use std::thread;

fn main() {
    // Arc = Atomic Reference Counted
    // Safe to share across threads
    let data = Arc::new(vec![1, 2, 3, 4, 5]);

    let mut handles = vec![];

    for _ in 0..4 {
        let data_clone = Arc::clone(&data);
        let handle = thread::spawn(move || {
            let total: i32 = data_clone.iter().sum();
            println!("Sum: {}", total);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
    // True parallelism — no GIL!
}`}
      />

      <NoteBlock type="warning" title="Rc is NOT thread-safe">
        If you try to send an <code>Rc</code> to another thread, the compiler
        will refuse with a clear error message. This is Rust's type system
        protecting you: non-atomic reference counting would cause data races.
        Use <code>Arc</code> whenever data crosses thread boundaries.
      </NoteBlock>

      <h2>When to Use What</h2>

      <CodeBlock
        language="rust"
        title="Choosing the right pointer type"
        code={`// Box<T> — single owner, heap allocation
// Use when: recursive types, large structs, trait objects
let unique = Box::new(42);

// Rc<T> — multiple owners, single thread
// Use when: shared graph nodes, caches, read-only shared data
use std::rc::Rc;
let shared = Rc::new(42);
let also_shared = Rc::clone(&shared);

// Arc<T> — multiple owners, multiple threads
// Use when: thread pools, parallel processing, shared config
use std::sync::Arc;
let thread_safe = Arc::new(42);
let for_thread = Arc::clone(&thread_safe);

// Key rule: start with Box or plain ownership.
// Only reach for Rc/Arc when the compiler tells you
// that you need shared ownership.`}
      />

      <ExerciseBlock
        title="Shared Configuration"
        difficulty="intermediate"
        problem={`Create a Config struct with fields app_name: String and max_retries: u32.

1. Wrap it in Arc so multiple threads can read the config.
2. Spawn 3 threads, each printing the config's app_name.
3. After all threads finish, print the Arc's strong_count (should be 1).

Why must you use Arc instead of Rc here?`}
        solution={`use std::sync::Arc;
use std::thread;

struct Config {
    app_name: String,
    max_retries: u32,
}

fn main() {
    let config = Arc::new(Config {
        app_name: "MyApp".to_string(),
        max_retries: 3,
    });

    let mut handles = vec![];
    for i in 0..3 {
        let cfg = Arc::clone(&config);
        handles.push(thread::spawn(move || {
            println!("Thread {}: app = {}", i, cfg.app_name);
        }));
    }

    for h in handles {
        h.join().unwrap();
    }

    // All thread clones dropped, only 'config' remains
    println!("Final refcount: {}", Arc::strong_count(&config)); // 1

    // Arc is required because Rc does not implement Send,
    // so the compiler won't let you move it into a thread.
    // Arc uses atomic operations to safely update the
    // reference count from multiple threads simultaneously.
}`}
      />
    </div>
  );
}
