import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function RefCellInteriorMutability() {
  return (
    <div className="prose-rust">
      <h1>RefCell &amp; Interior Mutability</h1>

      <p>
        Rust's borrowing rules normally enforce at compile time that you either
        have one mutable reference or any number of immutable references. But
        some patterns — caches, observer lists, mock objects — need to mutate
        data behind a shared reference. <code>RefCell&lt;T&gt;</code> moves the
        borrow check to runtime, giving you <strong>interior mutability</strong>.
      </p>

      <ConceptBlock title="Interior Mutability">
        <p>
          <strong>Interior mutability</strong> lets you mutate data even when
          you only have an immutable reference to the container. In Python, this
          is the default — you can always modify a list attribute on an object
          regardless of how you got that reference. In Rust, you must opt in
          with types like <code>RefCell&lt;T&gt;</code>, <code>Cell&lt;T&gt;</code>,
          or <code>Mutex&lt;T&gt;</code>.
        </p>
        <p>
          <code>RefCell</code> enforces the same borrowing rules (one writer XOR
          many readers), but checks them at runtime instead of compile time.
          Violations cause a panic rather than a compile error.
        </p>
      </ConceptBlock>

      <h2>The Problem RefCell Solves</h2>

      <PythonRustCompare
        title="Mutating through a shared reference"
        description="Python allows mutation anywhere. Rust requires RefCell for interior mutability."
        pythonCode={`class Logger:
    def __init__(self):
        self.messages = []  # mutable list

    def log(self, msg):
        # Mutating self.messages is always allowed,
        # even if Logger is shared by many objects
        self.messages.append(msg)

# Multiple objects share the same logger
logger = Logger()

# Both can call log() — Python doesn't care
# about how many references exist
logger.log("started")
logger.log("finished")
print(logger.messages)`}
        rustCode={`use std::cell::RefCell;

struct Logger {
    // RefCell allows mutation behind &self
    messages: RefCell<Vec<String>>,
}

impl Logger {
    fn new() -> Self {
        Logger { messages: RefCell::new(vec![]) }
    }

    fn log(&self, msg: &str) {
        // borrow_mut() checks at runtime that no
        // other borrow is active
        self.messages
            .borrow_mut()
            .push(msg.to_string());
    }

    fn dump(&self) {
        // borrow() for immutable access
        let msgs = self.messages.borrow();
        for m in msgs.iter() {
            println!("{}", m);
        }
    }
}

fn main() {
    let logger = Logger::new();
    logger.log("started");  // &self, but mutates!
    logger.log("finished");
    logger.dump();
}`}
      />

      <h2>borrow() and borrow_mut()</h2>

      <CodeBlock
        language="rust"
        title="Runtime borrow checking in action"
        code={`use std::cell::RefCell;

fn main() {
    let data = RefCell::new(vec![1, 2, 3]);

    // Immutable borrow — like &Vec<i32>
    {
        let reader = data.borrow();
        println!("length: {}", reader.len());
        // reader is dropped here
    }

    // Mutable borrow — like &mut Vec<i32>
    {
        let mut writer = data.borrow_mut();
        writer.push(4);
        // writer is dropped here
    }

    // Multiple immutable borrows are OK
    {
        let r1 = data.borrow();
        let r2 = data.borrow();
        println!("r1: {:?}, r2: {:?}", *r1, *r2);
    }

    // THIS WOULD PANIC at runtime:
    // let reader = data.borrow();
    // let writer = data.borrow_mut(); // PANIC!
    // Can't have reader and writer at the same time

    println!("final: {:?}", data.borrow());
}`}
      />

      <NoteBlock type="warning" title="Runtime panics replace compile errors">
        With <code>RefCell</code>, violating the borrowing rules panics at
        runtime instead of failing at compile time. Use{' '}
        <code>try_borrow()</code> and <code>try_borrow_mut()</code> if you
        want to handle conflicts gracefully with <code>Result</code> instead
        of crashing.
      </NoteBlock>

      <h2>Rc + RefCell: Shared Mutable Data</h2>

      <p>
        The most common pattern combines <code>Rc</code> (shared ownership) with{' '}
        <code>RefCell</code> (interior mutability) to achieve what Python gives
        you by default: multiple variables that can all read and write the same
        data.
      </p>

      <CodeBlock
        language="rust"
        title="Rc<RefCell<T>> — Python-like shared mutable state"
        code={`use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
struct Sensor {
    name: String,
    readings: Rc<RefCell<Vec<f64>>>,
}

impl Sensor {
    fn record(&self, value: f64) {
        self.readings.borrow_mut().push(value);
    }
}

fn main() {
    // Shared mutable buffer — like a Python list
    // referenced by multiple objects
    let buffer = Rc::new(RefCell::new(Vec::new()));

    let temp = Sensor {
        name: "temperature".into(),
        readings: Rc::clone(&buffer),
    };

    let humidity = Sensor {
        name: "humidity".into(),
        readings: Rc::clone(&buffer),
    };

    // Both sensors write to the same buffer
    temp.record(22.5);
    humidity.record(65.0);
    temp.record(23.1);

    println!("All readings: {:?}", buffer.borrow());
    // [22.5, 65.0, 23.1]
}`}
      />

      <NoteBlock type="pythonista" title="Rc<RefCell<T>> is Rust's Python mode">
        <code>Rc&lt;RefCell&lt;T&gt;&gt;</code> gives you the same semantics as
        Python: shared ownership with mutable access. But in Rust, this is the
        exception, not the rule. Prefer unique ownership and compile-time
        borrowing. Reach for <code>RefCell</code> only when the borrow checker
        cannot express your legitimate pattern.
      </NoteBlock>

      <ExerciseBlock
        title="Build a Shared Cache"
        difficulty="intermediate"
        problem={`Create a Cache struct that:

1. Stores key-value pairs in a RefCell<HashMap<String, String>>
2. Has a get_or_compute(&self, key: &str) -> String method that:
   - Returns the cached value if it exists
   - Otherwise computes it (use format!("computed_{}", key)), caches it, and returns it
3. Uses &self (not &mut self) — this is the whole point of RefCell!

Verify that calling get_or_compute twice with the same key returns the cached value.`}
        solution={`use std::cell::RefCell;
use std::collections::HashMap;

struct Cache {
    store: RefCell<HashMap<String, String>>,
}

impl Cache {
    fn new() -> Self {
        Cache {
            store: RefCell::new(HashMap::new()),
        }
    }

    fn get_or_compute(&self, key: &str) -> String {
        // Check if cached (immutable borrow)
        if let Some(val) = self.store.borrow().get(key) {
            return val.clone();
        }

        // Compute and cache (mutable borrow)
        let value = format!("computed_{}", key);
        self.store
            .borrow_mut()
            .insert(key.to_string(), value.clone());
        value
    }
}

fn main() {
    let cache = Cache::new();

    let v1 = cache.get_or_compute("foo");
    println!("{}", v1); // "computed_foo"

    let v2 = cache.get_or_compute("foo");
    println!("{}", v2); // "computed_foo" (from cache)

    assert_eq!(v1, v2);
    println!("Cache works!");
}

// Note: the immutable borrow in the if-let must be dropped
// before we take the mutable borrow to insert. Rust's RefCell
// tracks this at runtime.`}
      />
    </div>
  );
}
