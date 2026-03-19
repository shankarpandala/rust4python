import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ClosuresDepth() {
  return (
    <div className="prose-rust">
      <h1>Closures: Fn, FnMut, FnOnce</h1>

      <p>
        Python's <code>lambda</code> and nested functions capture variables
        from their enclosing scope freely. Rust closures do the same, but
        the compiler tracks <em>how</em> they capture variables — by
        reference, by mutable reference, or by value — and encodes this in
        the type system with three traits: <code>Fn</code>,
        <code>FnMut</code>, and <code>FnOnce</code>.
      </p>

      <ConceptBlock title="The Three Closure Traits">
        <p>
          Every Rust closure implements one or more of these traits, determined
          automatically by how it uses captured variables:
        </p>
        <ul>
          <li><code>Fn</code> — captures by shared reference (<code>&amp;T</code>). Can be called multiple times. Read-only access.</li>
          <li><code>FnMut</code> — captures by mutable reference (<code>&amp;mut T</code>). Can be called multiple times. Can modify captured state.</li>
          <li><code>FnOnce</code> — captures by value (moves). Can be called only once. Consumes captured values.</li>
        </ul>
        <p>
          <code>Fn</code> is a subtrait of <code>FnMut</code>, which is a
          subtrait of <code>FnOnce</code>. So an <code>Fn</code> closure
          can be used anywhere a <code>FnMut</code> or <code>FnOnce</code>
          is expected.
        </p>
      </ConceptBlock>

      <h2>Python Closures vs Rust Closures</h2>

      <PythonRustCompare
        title="Capturing variables"
        description="Python closures capture by reference (with caveats). Rust makes the capture mode explicit."
        pythonCode={`# Python: closures capture the variable binding
def make_counter():
    count = 0
    def increment():
        nonlocal count  # required to mutate!
        count += 1
        return count
    return increment

counter = make_counter()
print(counter())  # 1
print(counter())  # 2

# Lambda (limited to expressions)
double = lambda x: x * 2
print(double(5))  # 10

# Common gotcha: late binding
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])  # [2, 2, 2] — NOT [0, 1, 2]!`}
        rustCode={`fn main() {
    // Fn: captures by shared reference (read-only)
    let name = String::from("Alice");
    let greet = || println!("Hello, {}", name);
    greet();  // can call multiple times
    greet();
    println!("{}", name);  // name still usable

    // FnMut: captures by mutable reference
    let mut count = 0;
    let mut increment = || {
        count += 1;  // mutates captured variable
        count
    };
    println!("{}", increment());  // 1
    println!("{}", increment());  // 2

    // FnOnce: captures by value (moves)
    let data = vec![1, 2, 3];
    let consume = move || {
        println!("Data: {:?}", data);
        drop(data);  // consumes data
    };
    consume();
    // consume();  // ERROR: can't call again, data was moved
    // println!("{:?}", data);  // ERROR: data was moved
}`}
      />

      <NoteBlock title="No late binding gotcha" type="pythonista">
        <p>
          Python's infamous "closures capture variables, not values" bug
          (the loop variable gotcha) cannot happen in Rust. Each closure
          captures a snapshot of the value (with <code>move</code>) or a
          reference to a specific memory location. The compiler enforces
          that references remain valid.
        </p>
      </NoteBlock>

      <h2>Closures as Function Parameters</h2>

      <CodeBlock
        language="rust"
        title="Accepting closures with trait bounds"
        code={`// Fn: closure only reads captured state
fn apply_twice<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(f(x))
}

// FnMut: closure may modify captured state
fn call_n_times<F: FnMut()>(mut f: F, n: usize) {
    for _ in 0..n {
        f();
    }
}

// FnOnce: closure may consume captured state (called at most once)
fn consume_and_report<F: FnOnce() -> String>(f: F) {
    let result = f();
    println!("Result: {}", result);
}

fn main() {
    // Fn
    let double = |x| x * 2;
    println!("{}", apply_twice(double, 3));  // 12

    // FnMut
    let mut total = 0;
    call_n_times(|| { total += 1; }, 5);
    println!("Total: {}", total);  // 5

    // FnOnce
    let name = String::from("Alice");
    consume_and_report(move || {
        format!("Hello, {}!", name)  // moves name into the closure
    });
}`}
      />

      <NoteBlock title="Which trait to accept?" type="tip">
        <p>
          When writing a function that accepts a closure, choose the least
          restrictive trait that works:
        </p>
        <ul>
          <li>Accept <code>Fn</code> when you call the closure multiple times and it should not have side effects.</li>
          <li>Accept <code>FnMut</code> when the closure needs to modify state (most common).</li>
          <li>Accept <code>FnOnce</code> when you call it at most once (most permissive — accepts any closure).</li>
        </ul>
      </NoteBlock>

      <h2>move Closures</h2>

      <CodeBlock
        language="rust"
        title="Forcing ownership transfer with move"
        code={`use std::thread;

fn main() {
    // Without move: closure borrows the variable
    let x = 42;
    let print_x = || println!("{}", x);  // borrows x
    print_x();
    println!("x is still here: {}", x);

    // With move: closure takes ownership
    let data = vec![1, 2, 3];
    let handle = thread::spawn(move || {
        // data is MOVED into the thread's closure
        // This is required because the thread might outlive
        // the current scope
        println!("Thread got: {:?}", data);
    });
    // println!("{:?}", data);  // ERROR: data was moved
    handle.join().unwrap();

    // move with Copy types: the value is copied, not moved
    let count = 42;  // i32 is Copy
    let closure = move || println!("{}", count);
    closure();
    println!("count still here: {}", count);  // OK! i32 was copied
}`}
      />

      <h2>Returning Closures</h2>

      <PythonRustCompare
        title="Factory functions"
        description="Both languages can return closures, but Rust requires explicit syntax."
        pythonCode={`def make_adder(n: int):
    def adder(x: int) -> int:
        return x + n
    return adder

add5 = make_adder(5)
add10 = make_adder(10)
print(add5(3))   # 8
print(add10(3))  # 13

def make_multiplier(factor: float):
    return lambda x: x * factor

double = make_multiplier(2.0)
print(double(7))  # 14.0`}
        rustCode={`// Return closures with impl Fn
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn make_multiplier(factor: f64) -> impl Fn(f64) -> f64 {
    move |x| x * factor
}

fn main() {
    let add5 = make_adder(5);
    let add10 = make_adder(10);
    println!("{}", add5(3));   // 8
    println!("{}", add10(3));  // 13

    let double = make_multiplier(2.0);
    println!("{}", double(7.0));  // 14.0
}

// Note: impl Fn works when returning a single closure type.
// For multiple possible closure types, use Box<dyn Fn(...)>:
fn choose_op(add: bool) -> Box<dyn Fn(i32) -> i32> {
    if add {
        Box::new(|x| x + 1)
    } else {
        Box::new(|x| x * 2)
    }
}`}
      />

      <ExerciseBlock
        title="Build a pipeline combinator"
        difficulty="hard"
        problem={`Write a function pipeline that takes a Vec of closures (each taking f64 and
returning f64) and returns a single closure that applies them all in sequence.

Example:
let ops: Vec<Box<dyn Fn(f64) -> f64>> = vec![
    Box::new(|x| x + 1.0),     // add 1
    Box::new(|x| x * 2.0),     // multiply by 2
    Box::new(|x| x - 3.0),     // subtract 3
];
let combined = pipeline(ops);
println!("{}", combined(10.0));  // ((10 + 1) * 2) - 3 = 19.0

Hint: use fold to chain the closures.`}
        solution={`fn pipeline(ops: Vec<Box<dyn Fn(f64) -> f64>>) -> Box<dyn Fn(f64) -> f64> {
    Box::new(move |x| {
        ops.iter().fold(x, |acc, f| f(acc))
    })
}

fn main() {
    let ops: Vec<Box<dyn Fn(f64) -> f64>> = vec![
        Box::new(|x| x + 1.0),     // add 1
        Box::new(|x| x * 2.0),     // multiply by 2
        Box::new(|x| x - 3.0),     // subtract 3
    ];

    let combined = pipeline(ops);
    println!("{}", combined(10.0));  // 19.0
    println!("{}", combined(0.0));   // -1.0
    println!("{}", combined(5.0));   // 9.0

    // Data processing pipeline
    let normalize: Vec<Box<dyn Fn(f64) -> f64>> = vec![
        Box::new(|x| x - 50.0),     // center around 0
        Box::new(|x| x / 25.0),     // scale to [-1, 1] range
        Box::new(|x| x.max(-1.0).min(1.0)),  // clamp
    ];

    let norm = pipeline(normalize);
    println!("{}", norm(75.0));   // 1.0
    println!("{}", norm(50.0));   // 0.0
    println!("{}", norm(25.0));   // -1.0
}`}
      />
    </div>
  );
}
