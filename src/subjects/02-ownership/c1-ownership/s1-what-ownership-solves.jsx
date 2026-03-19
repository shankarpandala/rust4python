import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const WhatOwnershipSolves = () => {
  return (
    <div className="prose-rust">
      <h1>What Ownership Solves</h1>

      <p>
        If you only learn one concept from this entire course, make it ownership.
        Ownership is the foundation of everything that makes Rust different from Python,
        and it is the single biggest reason Rust programs are both fast and safe.
      </p>

      <ConceptBlock title="The Problem: Memory Bugs">
        <p>
          In languages like C and C++, programmers manually manage memory. This leads
          to an entire class of devastating bugs:
        </p>
        <ul>
          <li><strong>Use-after-free</strong> — accessing memory that has already been freed</li>
          <li><strong>Double-free</strong> — freeing the same memory twice, corrupting the allocator</li>
          <li><strong>Dangling pointers</strong> — holding a reference to freed memory</li>
          <li><strong>Data races</strong> — two threads accessing the same memory without synchronization</li>
          <li><strong>Memory leaks</strong> — allocating memory that is never freed</li>
        </ul>
        <p>
          These bugs cause roughly 70% of all security vulnerabilities in large C/C++ codebases
          (confirmed by Microsoft, Google, and Mozilla).
        </p>
      </ConceptBlock>

      <h2>Python's Approach: Reference Counting + GC</h2>

      <p>
        Python solves this problem by managing memory for you. Every Python object has a
        reference count, and when that count drops to zero, the object is freed. A cyclic
        garbage collector handles reference cycles.
      </p>

      <CodeBlock
        language="python"
        title="Python's reference counting in action"
        code={`import sys

a = [1, 2, 3]
print(sys.getrefcount(a))  # 2 (a + the getrefcount arg)

b = a                      # refcount goes to 3
print(sys.getrefcount(a))  # 3

del b                      # refcount drops to 2
# No explicit free needed — Python handles it

# But this comes at a cost:
# - Every assignment updates a reference count (atomic operation)
# - The GC periodically scans for cycles (stop-the-world pauses)
# - Objects are scattered across the heap (poor cache locality)`}
      />

      <NoteBlock type="pythonista" title="Why Python is slow in tight loops">
        <p>
          Every time you assign a variable in Python, the runtime increments and
          decrements reference counts. In a hot inner loop processing millions of items,
          this overhead is significant. This is one reason NumPy operations (which drop
          into C) are orders of magnitude faster than pure Python loops.
        </p>
      </NoteBlock>

      <h2>Rust's Approach: Compile-Time Ownership</h2>

      <p>
        Rust takes a radically different approach. Instead of tracking memory at runtime,
        the compiler enforces a set of ownership rules at compile time. If your code
        compiles, it is guaranteed to be free of the memory bugs listed above — with
        zero runtime cost.
      </p>

      <ConceptBlock title="The Three Rules of Ownership">
        <ol>
          <li>
            <strong>Each value has exactly one owner.</strong> A variable "owns" the data
            it holds. There is always exactly one binding responsible for any piece of data.
          </li>
          <li>
            <strong>There can only be one owner at a time.</strong> When you assign a value
            to a new variable, the original variable gives up ownership (a "move").
          </li>
          <li>
            <strong>When the owner goes out of scope, the value is dropped.</strong> Rust
            automatically frees memory when the owning variable leaves its scope. No GC needed.
          </li>
        </ol>
      </ConceptBlock>

      <CodeBlock
        language="rust"
        title="Ownership in action"
        code={`fn main() {
    let s1 = String::from("hello");  // s1 owns the String
    let s2 = s1;                     // Ownership MOVES to s2
    // println!("{}", s1);           // ERROR: s1 no longer valid!
    println!("{}", s2);              // OK: s2 is the owner now

    // When s2 goes out of scope here, the String is freed.
    // No reference counting. No garbage collector. Just a simple rule.
}`}
      />

      <PythonRustCompare
        title="Assignment: Reference vs Move"
        description="In Python, assignment creates a new reference to the same object. In Rust, assignment moves ownership — the original variable becomes invalid."
        pythonCode={`a = [1, 2, 3]
b = a
# Both a and b point to the SAME list
a.append(4)
print(b)  # [1, 2, 3, 4] — surprise!
# Python uses reference counting to track
# when to free the list`}
        rustCode={`let a = vec![1, 2, 3];
let b = a;
// Ownership has MOVED from a to b
// a.push(4);  // ERROR: a is no longer valid
println!("{:?}", b);  // [1, 2, 3]
// When b goes out of scope, the Vec is freed
// No reference counting needed`}
      />

      <h2>Why This Matters for Performance</h2>

      <p>
        Ownership eliminates an entire category of runtime overhead:
      </p>

      <CodeBlock
        language="rust"
        title="Zero-cost memory management"
        code={`// This loop processes a million items with NO GC pauses,
// NO reference count updates, and NO runtime memory tracking.
fn process_data(data: Vec<f64>) -> f64 {
    let mut sum = 0.0;
    for value in &data {  // borrow the data, no copy
        sum += value;
    }
    sum
    // data is freed here — deterministically, instantly
}

fn main() {
    let readings = vec![1.0; 1_000_000];
    let result = process_data(readings);
    // readings is no longer valid here (it was moved into the function)
    println!("Sum: {}", result);
}`}
      />

      <NoteBlock type="tip" title="Real-world impact: Polars vs Pandas">
        <p>
          Polars, a DataFrame library written in Rust, is often 10-100x faster than
          Pandas for the same operations. One key reason is memory management: Polars
          uses Rust's ownership system to manage DataFrame memory with zero GC overhead,
          while Pandas relies on Python's reference counting and garbage collector.
          In data pipelines processing millions of rows, this difference is enormous.
        </p>
      </NoteBlock>

      <h2>Ownership vs Garbage Collection: A Summary</h2>

      <CodeBlock
        language="python"
        title="Python: runtime memory management"
        code={`# Python tracks memory at RUNTIME
import gc

# Reference counting on every assignment
x = SomeLargeObject()   # refcount = 1
y = x                    # refcount = 2
del x                    # refcount = 1
del y                    # refcount = 0 -> freed

# Cyclic GC runs periodically (you can trigger it)
gc.collect()  # stop-the-world pause

# You cannot predict WHEN an object will be freed
# This makes Python unsuitable for real-time systems`}
      />

      <CodeBlock
        language="rust"
        title="Rust: compile-time memory management"
        code={`// Rust tracks memory at COMPILE TIME
fn main() {
    let x = String::from("hello");  // x owns the String
    {
        let y = x;                  // ownership moves to y
        println!("{}", y);
        // y goes out of scope -> String is freed RIGHT HERE
    }
    // No GC. No refcounting. The compiler inserted the
    // deallocation at exactly the right place.
}`}
      />

      <NoteBlock type="warning" title="The learning curve is real">
        <p>
          Ownership will feel restrictive at first. You will fight the borrow checker.
          You will wonder why Rust cannot just "figure it out" the way Python does.
          This is normal. The rules exist because they prevent real bugs — bugs that
          cause crashes, security vulnerabilities, and subtle data corruption in
          production systems. Once the ownership model clicks, you will find yourself
          writing cleaner code in every language.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Think About It"
        difficulty="beginner"
        problem={`Consider this Python code:

data = [1, 2, 3]
backup = data
data.append(4)
print(backup)  # What prints?

Now consider the equivalent Rust code:

let data = vec![1, 2, 3];
let backup = data;
// data.push(4);  // What happens here?

Explain why the Rust version behaves differently from the Python version.
What problem does this difference prevent?`}
        solution={`In Python, backup = data creates a second reference to the SAME list.
So data.append(4) modifies the list that both variables point to,
and print(backup) outputs [1, 2, 3, 4]. This is called aliasing.

In Rust, let backup = data MOVES ownership. After the move, data is
no longer valid. Trying to call data.push(4) is a compile-time error.

This prevents aliasing bugs where one part of the code modifies data
that another part is still reading. In concurrent programs, aliasing
combined with mutation causes data races — one of the most dangerous
categories of bugs. Rust eliminates this entire class of bugs.`}
      />
    </div>
  );
};

export default WhatOwnershipSolves;
