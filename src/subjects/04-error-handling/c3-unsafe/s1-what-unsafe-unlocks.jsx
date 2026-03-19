import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function WhatUnsafeUnlocks() {
  return (
    <div className="prose-rust">
      <h1>What Unsafe Unlocks</h1>

      <p>
        Rust's safety guarantees come from the borrow checker and type
        system. But some operations — like calling C code, implementing
        data structures with raw pointers, or doing hardware-level
        operations — cannot be verified by the compiler. The
        <code>unsafe</code> keyword lets you opt out of specific checks
        while keeping the rest of your code safe.
      </p>

      <ConceptBlock title="Unsafe Is Not 'Dangerous Code'">
        <p>
          <code>unsafe</code> does not mean "this code is wrong." It means
          "I, the programmer, am asserting safety invariants that the
          compiler cannot verify." It unlocks exactly five additional
          capabilities — nothing more. The rest of Rust's rules still apply
          inside an <code>unsafe</code> block.
        </p>
      </ConceptBlock>

      <h2>What Python Developers Should Know</h2>

      <PythonRustCompare
        title="Safety boundaries"
        description="Python's C extensions are entirely unchecked. Rust's unsafe is a controlled, visible escape hatch."
        pythonCode={`# Python: ALL C extensions are "unsafe"
# When you import numpy, you trust that its C code
# doesn't have memory bugs. No language-level safety.

import ctypes

# This is inherently unsafe — wrong pointer = crash
lib = ctypes.CDLL("libm.so.6")
lib.sqrt.restype = ctypes.c_double
result = lib.sqrt(ctypes.c_double(16.0))
print(result)  # 4.0

# Nothing stops you from passing garbage:
# lib.sqrt(ctypes.c_int(42))  # undefined behavior!

# Python's approach: trust the C programmer entirely
# No way to mark "this part needs extra scrutiny"`}
        rustCode={`// Rust: unsafe is explicit and minimal
fn main() {
    // Safe Rust — compiler guarantees memory safety
    let v = vec![1, 2, 3];
    let first = v.first(); // returns Option, can't crash

    // Unsafe Rust — programmer asserts safety
    unsafe {
        // Raw pointer dereference — compiler can't verify
        let ptr = v.as_ptr();
        let val = *ptr; // safe because we know v is not empty
        println!("Raw access: {}", val);
    }

    // Back to safe Rust — all guarantees restored
    println!("Vec: {:?}", v);
}

// The unsafe block is VISIBLE — code reviewers know
// to scrutinize these sections carefully.`}
      />

      <NoteBlock title="The unsafe contract" type="note">
        <p>
          When you write <code>unsafe</code>, you are telling the compiler:
          "I promise this code upholds Rust's safety invariants even though
          you cannot verify it." If you break that promise, you get undefined
          behavior — just like C. The key difference from C: only a tiny,
          auditable portion of your code can do this.
        </p>
      </NoteBlock>

      <h2>The Five Unsafe Superpowers</h2>

      <CodeBlock
        language="rust"
        title="Everything unsafe unlocks — and nothing more"
        code={`fn main() {
    // 1. DEREFERENCE RAW POINTERS
    let x = 42;
    let raw = &x as *const i32;
    unsafe {
        println!("Dereferenced: {}", *raw);
    }

    // 2. CALL UNSAFE FUNCTIONS
    unsafe {
        // Some functions require the caller to uphold invariants
        let v = vec![1, 2, 3, 4, 5];
        let val = v.get_unchecked(2);  // no bounds check
        println!("Unchecked: {}", val);
    }

    // 3. ACCESS MUTABLE STATIC VARIABLES
    static mut COUNTER: u32 = 0;
    unsafe {
        COUNTER += 1;  // data race risk — caller must ensure safety
        println!("Counter: {}", COUNTER);
    }

    // 4. IMPLEMENT UNSAFE TRAITS
    // unsafe trait UnsafeTrait { ... }
    // unsafe impl UnsafeTrait for MyType { ... }

    // 5. ACCESS FIELDS OF UNIONS
    union MyUnion {
        int_val: i32,
        float_val: f32,
    }
    let u = MyUnion { int_val: 42 };
    unsafe {
        println!("As int: {}", u.int_val);
    }
}

// That's ALL unsafe unlocks. It does NOT:
// - Disable the borrow checker
// - Allow data races (those are still UB)
// - Turn off type checking
// - Skip lifetime rules`}
      />

      <h2>FFI: Calling C from Rust</h2>

      <CodeBlock
        language="rust"
        title="The most common use of unsafe: C interop"
        code={`// Calling C's standard library math functions
extern "C" {
    fn sqrt(x: f64) -> f64;
    fn abs(x: i32) -> i32;
}

fn safe_sqrt(x: f64) -> Option<f64> {
    if x < 0.0 {
        None  // prevent domain error
    } else {
        // Wrap the unsafe call in a safe API
        Some(unsafe { sqrt(x) })
    }
}

fn main() {
    // Unsafe: we must ensure correct types and calling convention
    let result = unsafe { sqrt(16.0) };
    println!("sqrt(16) = {}", result);  // 4.0

    // Better: use the safe wrapper
    match safe_sqrt(16.0) {
        Some(r) => println!("Safe sqrt: {}", r),
        None => println!("Cannot sqrt negative number"),
    }

    println!("{:?}", safe_sqrt(-1.0));  // None
}

// This is exactly how PyO3 works under the hood:
// unsafe Rust code calls the CPython C API, wrapped in
// safe Rust abstractions that Python developers use.`}
      />

      <NoteBlock title="Safe wrappers: the key pattern" type="tip">
        <p>
          The idiomatic pattern is: write a small <code>unsafe</code> block
          that does the raw operation, then wrap it in a safe function that
          enforces the invariants. Users of your API never see
          <code>unsafe</code>. This is how the standard library works —
          <code>Vec</code>, <code>String</code>, <code>HashMap</code> all use
          <code>unsafe</code> internally but expose safe interfaces.
        </p>
      </NoteBlock>

      <h2>How Much Unsafe Is Normal?</h2>

      <CodeBlock
        language="rust"
        title="Unsafe in the wild"
        code={`// Real-world unsafe usage is MINIMAL:
//
// tokio (async runtime):     ~1% unsafe
// serde (serialization):     ~2% unsafe
// reqwest (HTTP client):     ~0% unsafe (delegates to hyper)
// polars (DataFrames):       ~1% unsafe (performance-critical paths)
//
// Your typical application code: 0% unsafe
//
// The standard library:      ~15% unsafe (because it builds
//                             the safe abstractions everyone uses)

// You will almost never need unsafe in application code.
// If you find yourself reaching for it, there's usually
// a safe alternative:

fn main() {
    // Instead of unsafe pointer arithmetic:
    let v = vec![10, 20, 30, 40, 50];

    // BAD: unsafe raw pointer access
    // unsafe { *v.as_ptr().add(2) }

    // GOOD: safe indexing with bounds check
    let val = v[2];

    // GOOD: safe indexing that returns Option
    let val = v.get(2);

    println!("{:?}", val);
}`}
      />

      <NoteBlock title="Python developers rarely need unsafe" type="pythonista">
        <p>
          If you are writing application code — data pipelines, web servers,
          CLI tools — you will likely never write <code>unsafe</code>. It
          becomes relevant when you use PyO3 (which handles the unsafe FFI
          for you), build custom data structures, or interface with C
          libraries directly. For now, knowing that unsafe exists and what
          it means is enough.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Identify unsafe needs"
        difficulty="easy"
        problem={`For each scenario, decide whether unsafe is needed or if safe Rust can handle it:

1. Sorting a Vec<f64> of one million elements
2. Calling Python's C API through PyO3
3. Implementing a linked list with Box pointers
4. Reading a file and parsing JSON
5. Accessing a specific index in a slice without bounds checking
6. Sharing data between threads using Arc<Mutex<T>>
7. Reinterpreting the bytes of an i32 as a f32
8. Using HashMap to count word frequencies`}
        solution={`1. SAFE — Vec::sort() and iterators handle this entirely in safe Rust.

2. UNSAFE needed — calling C functions requires unsafe. But PyO3 wraps
   this for you, so YOUR code stays safe.

3. SAFE — a linked list using Box<Node> and Option is fully safe.
   (An unsafe version with raw pointers is faster but unnecessary
   for most use cases.)

4. SAFE — std::fs and serde_json are entirely safe APIs.

5. UNSAFE needed — get_unchecked() skips bounds checking and requires
   unsafe. But ask yourself: is the 2ns savings worth the risk?
   Use .get() or [] instead.

6. SAFE — Arc and Mutex are safe abstractions. The unsafe is inside
   the standard library implementations.

7. UNSAFE needed — transmute or union access requires unsafe because
   the compiler can't verify the reinterpretation is valid.

8. SAFE — HashMap's API is entirely safe.

Summary: 6 out of 8 scenarios need NO unsafe. This reflects real-world
Rust: the vast majority of code is safe.`}
      />
    </div>
  );
}
