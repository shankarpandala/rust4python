import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const ScopeDrop = () => {
  return (
    <div className="prose-rust">
      <h1>Scope & Drop</h1>

      <p>
        In Python, you rarely think about when objects are destroyed. The garbage
        collector handles it "eventually." In Rust, destruction is <strong>deterministic</strong>:
        a value is dropped the instant its owner goes out of scope. This gives you
        precise control over resource cleanup without any manual effort.
      </p>

      <ConceptBlock title="Scope Defines Lifetime">
        <p>
          A scope is the region of code where a variable is valid — typically delimited by
          curly braces <code>{'{}'}</code>. When execution reaches the closing brace, all
          variables owned by that scope are dropped in reverse order of creation. This
          is guaranteed by the compiler — there is no ambiguity about <em>when</em> cleanup
          happens.
        </p>
      </ConceptBlock>

      <CodeBlock
        language="rust"
        title="Scope and automatic drop"
        code={`fn main() {
    let outer = String::from("I live longer");

    {
        let inner = String::from("I'm temporary");
        println!("{}", inner);  // valid here
        println!("{}", outer);  // outer is still in scope
    } // 'inner' is DROPPED here — memory freed instantly

    println!("{}", outer);      // outer still valid
    // println!("{}", inner);   // ERROR: inner doesn't exist
} // 'outer' is DROPPED here`}
      />

      <h2>The Drop Trait: Rust's Destructor</h2>

      <PythonRustCompare
        title="Deterministic cleanup"
        description="Python's __del__ is called 'eventually' by the GC. Rust's Drop::drop is called at a precise, predictable point."
        pythonCode={`class Resource:
    def __init__(self, name):
        self.name = name
        print(f"Acquired: {self.name}")

    def __del__(self):
        # Called "sometime" by the GC
        # NOT guaranteed to run!
        print(f"Released: {self.name}")

r = Resource("database")
del r  # Hints to GC, but __del__ timing
       # is implementation-dependent
# In CPython it runs immediately,
# in PyPy it may run much later`}
        rustCode={`struct Resource {
    name: String,
}

impl Drop for Resource {
    fn drop(&mut self) {
        // GUARANTEED to run at scope exit
        println!("Released: {}", self.name);
    }
}

fn main() {
    let r = Resource {
        name: String::from("database"),
    };
    println!("Using: {}", r.name);
} // drop() called HERE — always,
  // deterministically, no exceptions`}
      />

      <NoteBlock type="warning" title="Python's __del__ is unreliable">
        <p>
          Python's <code>__del__</code> is not guaranteed to run. If objects are in a
          reference cycle, <code>__del__</code> may never be called. Even in CPython,
          <code>__del__</code> during interpreter shutdown is unreliable. This is why
          Python uses context managers (<code>with</code> statements) for resource cleanup.
          In Rust, <code>Drop</code> always runs — no special syntax needed.
        </p>
      </NoteBlock>

      <h2>RAII: Resource Acquisition Is Initialization</h2>

      <ConceptBlock title="The RAII Pattern">
        <p>
          RAII ties the lifetime of a resource (file handle, network connection, mutex lock)
          to the lifetime of an object. When the object is created, the resource is acquired.
          When the object is dropped, the resource is released. Because Rust drops values
          deterministically at scope exit, RAII provides automatic, reliable resource management
          without explicit cleanup code.
        </p>
      </ConceptBlock>

      <PythonRustCompare
        title="File handling: context manager vs RAII"
        description="Python needs a 'with' block to ensure files are closed. Rust closes them automatically when the owner goes out of scope."
        pythonCode={`# Python: MUST use 'with' for reliable cleanup
with open("data.txt", "w") as f:
    f.write("hello")
# File is closed here by __exit__

# Without 'with', the file might stay open:
f = open("data.txt", "w")
f.write("hello")
# f.close()  # Easy to forget!
# If an exception occurs before close(),
# the file handle leaks`}
        rustCode={`use std::fs::File;
use std::io::Write;

fn main() {
    let mut f = File::create("data.txt")
        .unwrap();
    f.write_all(b"hello").unwrap();

    // No close() needed!
    // No 'with' block needed!
} // File is closed HERE automatically
  // when 'f' is dropped.
  // Even if a panic occurs, Drop runs.`}
      />

      <h2>Drop Order: Reverse of Creation</h2>

      <CodeBlock
        language="rust"
        title="Values are dropped in reverse order"
        code={`struct Named {
    name: String,
}

impl Drop for Named {
    fn drop(&mut self) {
        println!("Dropping: {}", self.name);
    }
}

fn main() {
    let first = Named { name: String::from("first") };
    let second = Named { name: String::from("second") };
    let third = Named { name: String::from("third") };
    println!("All created");
}
// Output:
// All created
// Dropping: third    <-- last created, first dropped
// Dropping: second
// Dropping: first    <-- first created, last dropped`}
      />

      <NoteBlock type="tip" title="Why reverse order matters">
        <p>
          Reverse drop order ensures that if <code>second</code> depends on
          <code> first</code> (e.g., a connection pool and a connection from that pool),
          the dependent value (<code>second</code>) is cleaned up before the thing it
          depends on (<code>first</code>). This prevents use-after-free in destructors.
        </p>
      </NoteBlock>

      <h2>Nested Scopes for Early Cleanup</h2>

      <CodeBlock
        language="rust"
        title="Using inner scopes to free resources early"
        code={`use std::fs;

fn process_file() {
    // We need a large buffer only temporarily
    {
        let huge_buffer: Vec<u8> = vec![0u8; 100_000_000]; // 100MB
        // ... process the buffer ...
        println!("Buffer size: {} bytes", huge_buffer.len());
    } // huge_buffer is freed HERE — 100MB returned to the system

    // Now we can do other work without holding 100MB in memory
    println!("Buffer is gone, memory is free");

    // Another common pattern: lock scoping
    // {
    //     let lock = mutex.lock().unwrap();
    //     // ... critical section ...
    // } // lock is released here, as early as possible
}`}
      />

      <h2>You Cannot Call drop() Explicitly on Values</h2>

      <CodeBlock
        language="rust"
        title="Using std::mem::drop for early cleanup"
        code={`fn main() {
    let s = String::from("hello");

    // You CANNOT call s.drop() — the compiler prevents it
    // s.drop(); // ERROR: explicit use of destructor method

    // Use std::mem::drop() instead — it takes ownership and drops
    drop(s); // s is moved into drop() and immediately freed
    // println!("{}", s); // ERROR: value used after move

    // This is useful when you need to free something before
    // the scope ends but can't use a nested scope
    let data = vec![1, 2, 3];
    println!("{:?}", data);
    drop(data); // free the Vec now
    // ... lots more code that doesn't need data ...
}`}
      />

      <NoteBlock type="pythonista" title="drop() vs del">
        <p>
          Rust's <code>std::mem::drop()</code> works by taking ownership of the value,
          which forces the compiler to run <code>Drop::drop()</code> immediately.
          Python's <code>del x</code> merely decrements the reference count — the object
          may or may not be freed depending on whether other references exist. Rust's
          version is guaranteed: after <code>drop(x)</code>, the memory is freed and
          <code>x</code> cannot be used.
        </p>
      </NoteBlock>

      <h2>Drop and Ownership Together</h2>

      <CodeBlock
        language="rust"
        title="Ownership transfer prevents double-drop"
        code={`struct Connection {
    id: u32,
}

impl Drop for Connection {
    fn drop(&mut self) {
        println!("Closing connection {}", self.id);
    }
}

fn use_connection(conn: Connection) {
    println!("Using connection {}", conn.id);
} // conn is dropped here

fn main() {
    let c = Connection { id: 1 };
    use_connection(c);
    // c was moved into the function, so drop() runs inside use_connection.
    // c is NOT dropped again here — no double-free!

    let c2 = Connection { id: 2 };
    println!("Created connection {}", c2.id);
} // Only c2 is dropped here (once). c was already moved and dropped.

// Output:
// Using connection 1
// Closing connection 1    <-- dropped inside use_connection
// Created connection 2
// Closing connection 2    <-- dropped at end of main`}
      />

      <ExerciseBlock
        title="Predict the Output"
        difficulty="beginner"
        problem={`What does this program print? Write the exact output, line by line.

struct Guard {
    name: String,
}

impl Drop for Guard {
    fn drop(&mut self) {
        println!("Dropping {}", self.name);
    }
}

fn main() {
    let a = Guard { name: String::from("A") };
    let b = Guard { name: String::from("B") };
    {
        let c = Guard { name: String::from("C") };
        println!("Inside inner scope");
    }
    println!("After inner scope");
    drop(a);
    println!("After explicit drop");
}`}
        solution={`Inside inner scope
Dropping C
After inner scope
Dropping A
After explicit drop
Dropping B

Explanation:
- "Inside inner scope" prints first.
- C is dropped when the inner scope ends (immediately after).
- "After inner scope" prints next.
- drop(a) explicitly drops A, printing "Dropping A".
- "After explicit drop" prints next.
- At the end of main, only B remains. It is dropped last.
- Note: a was moved into drop() so it's not dropped again at scope end.`}
      />

      <ExerciseBlock
        title="RAII File Writer"
        difficulty="medium"
        problem={`Design a struct LogFile that:
1. Opens a file in its constructor (new function)
2. Has a write_line method that writes a line to the file
3. Automatically flushes and prints "Log closed" when dropped

Hint: use std::fs::File and std::io::Write.
Show how this is safer than Python's manual file handling.`}
        solution={`use std::fs::File;
use std::io::{Write, BufWriter};

struct LogFile {
    writer: BufWriter<File>,
    path: String,
}

impl LogFile {
    fn new(path: &str) -> std::io::Result<Self> {
        let file = File::create(path)?;
        Ok(LogFile {
            writer: BufWriter::new(file),
            path: path.to_string(),
        })
    }

    fn write_line(&mut self, msg: &str) -> std::io::Result<()> {
        writeln!(self.writer, "{}", msg)
    }
}

impl Drop for LogFile {
    fn drop(&mut self) {
        let _ = self.writer.flush();
        println!("Log closed: {}", self.path);
    }
}

fn main() -> std::io::Result<()> {
    let mut log = LogFile::new("app.log")?;
    log.write_line("Starting up")?;
    log.write_line("Processing data")?;
    // No close() needed — Drop handles it!
    Ok(())
} // "Log closed: app.log" printed here`}
      />
    </div>
  );
};

export default ScopeDrop;
