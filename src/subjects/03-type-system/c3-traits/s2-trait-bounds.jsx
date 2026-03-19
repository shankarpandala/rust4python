import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function TraitBounds() {
  return (
    <div className="prose-rust">
      <h1>Trait Bounds &amp; Generics</h1>

      <p>
        Python's type hints let you say "this function takes a
        <code>Sequence[int]</code>," but the runtime ignores them. Rust's
        trait bounds are the real deal — they constrain generic types at
        compile time, guaranteeing that only types with the right capabilities
        can be used.
      </p>

      <ConceptBlock title="What Are Trait Bounds?">
        <p>
          A trait bound says: "this generic type <code>T</code> must implement
          these traits." It is a contract between the caller and the function.
          The compiler verifies it at every call site — not at runtime, not
          in tests, but before the program can even be compiled.
        </p>
      </ConceptBlock>

      <h2>Python Type Hints vs Rust Trait Bounds</h2>

      <PythonRustCompare
        title="Constraining function arguments"
        description="Python type hints are suggestions; Rust trait bounds are enforced."
        pythonCode={`from typing import TypeVar, Protocol

class HasLen(Protocol):
    def __len__(self) -> int: ...

T = TypeVar("T", bound=HasLen)

def print_length(item: T) -> None:
    print(f"Length: {len(item)}")

# Works with any object that has __len__
print_length([1, 2, 3])     # Length: 3
print_length("hello")       # Length: 5
print_length(42)             # No error at call time!
# TypeError happens inside the function at runtime`}
        rustCode={`// Trait bound syntax: T must implement Display
fn print_item<T: std::fmt::Display>(item: T) {
    println!("Item: {}", item);
}

// Multiple bounds: T must be Display AND Clone
fn print_and_keep<T: std::fmt::Display + Clone>(item: T) {
    println!("Item: {}", item);
    let _copy = item.clone();  // guaranteed to work
}

fn main() {
    print_item(42);        // OK: i32 implements Display
    print_item("hello");   // OK: &str implements Display

    // This won't compile — Vec<i32> doesn't implement Display:
    // print_item(vec![1, 2, 3]);  // ERROR at compile time
}`}
      />

      <NoteBlock title="Compile-time vs runtime checking" type="pythonista">
        <p>
          In Python, <code>print_length(42)</code> only fails when
          <code>len()</code> is actually called inside the function. In Rust,
          passing a type that does not satisfy the bound fails immediately at
          the call site — you get a clear compiler error saying exactly which
          trait is missing.
        </p>
      </NoteBlock>

      <h2>Syntax Variations</h2>

      <CodeBlock
        language="rust"
        title="Three ways to write trait bounds"
        code={`use std::fmt::{Display, Debug};

// 1. impl Trait syntax (simplest, for function args)
fn log_value(val: &impl Display) {
    println!("LOG: {}", val);
}

// 2. Generic with bound (more flexible)
fn log_pair<T: Display, U: Display>(a: T, b: U) {
    println!("({}, {})", a, b);
}

// 3. where clause (cleanest for complex bounds)
fn process<T, U>(a: T, b: U) -> String
where
    T: Display + Clone,
    U: Debug + Default,
{
    let a_copy = a.clone();
    format!("{} with {:?}", a_copy, b)
}

fn main() {
    log_value(&42);
    log_pair("hello", 3.14);
    println!("{}", process("data", 0_i32));
}`}
      />

      <NoteBlock title="When to use which syntax" type="tip">
        <p>
          Use <code>impl Trait</code> for simple cases with one or two
          parameters. Use the <code>where</code> clause when bounds get
          complex — it keeps the function signature readable. Both generate
          identical machine code.
        </p>
      </NoteBlock>

      <h2>Returning Trait Types</h2>

      <PythonRustCompare
        title="Returning abstract types"
        description="Python returns a Protocol type (or Any). Rust uses impl Trait in return position."
        pythonCode={`from typing import Iterator

def count_up(start: int) -> Iterator[int]:
    """Return type says Iterator, but Python
    doesn't enforce what the iterator yields."""
    n = start
    while True:
        yield n
        n += 1

gen = count_up(10)
print(next(gen))  # 10
print(next(gen))  # 11`}
        rustCode={`// impl Trait in return position: the function
// returns "some type that implements Iterator"
fn count_up(start: i32) -> impl Iterator<Item = i32> {
    // The actual type (RangeFrom<i32>) is hidden
    start..  // infinite range
}

fn main() {
    let mut counter = count_up(10);
    println!("{}", counter.next().unwrap());  // 10
    println!("{}", counter.next().unwrap());  // 11
}`}
      />

      <h2>Multiple Trait Bounds in Practice</h2>

      <CodeBlock
        language="rust"
        title="Real-world trait bounds"
        code={`use std::fmt::Display;
use std::collections::HashMap;
use std::hash::Hash;

// A function that counts occurrences — the key must be
// hashable (Hash), comparable (Eq), and printable (Display)
fn count_and_report<T>(items: Vec<T>) -> HashMap<T, usize>
where
    T: Hash + Eq + Display,
{
    let mut counts = HashMap::new();
    for item in items {
        println!("Counting: {}", item);
        *counts.entry(item).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let words = vec!["hello", "world", "hello", "rust"];
    let counts = count_and_report(words);
    println!("{:?}", counts);
    // {"hello": 2, "world": 1, "rust": 1}
}

// Compare with Python:
// def count_and_report(items: list[Hashable]) -> dict
// Python's Hashable protocol exists but is rarely enforced`}
      />

      <NoteBlock title="Trait bounds document requirements" type="note">
        <p>
          Reading <code>T: Hash + Eq + Display</code> tells you exactly what
          capabilities the function requires. In Python, you would need to
          read the function body to discover it calls <code>hash()</code>,
          uses <code>==</code>, and calls <code>str()</code>. Trait bounds
          are self-documenting contracts.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Generic max function"
        difficulty="medium"
        problem={`Write a generic function largest<T>(list: &[T]) -> Option<&T> that returns
a reference to the largest item in a slice. Think about which trait bound T
needs (hint: you need to compare items). Then call it with:
1. A slice of integers
2. A slice of strings (lexicographic comparison)
3. A slice of chars
Handle the empty-slice case by returning None.`}
        solution={`fn largest<T: PartialOrd>(list: &[T]) -> Option<&T> {
    if list.is_empty() {
        return None;
    }

    let mut max = &list[0];
    for item in &list[1..] {
        if item > max {
            max = item;
        }
    }
    Some(max)
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("Largest number: {:?}", largest(&numbers));
    // Some(100)

    let words = vec!["cherry", "apple", "banana"];
    println!("Largest word: {:?}", largest(&words));
    // Some("cherry")

    let chars = vec!['z', 'a', 'm'];
    println!("Largest char: {:?}", largest(&chars));
    // Some('z')

    let empty: Vec<i32> = vec![];
    println!("Largest of empty: {:?}", largest(&empty));
    // None
}`}
      />
    </div>
  );
}
