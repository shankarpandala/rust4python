import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function GenericFunctions() {
  return (
    <div className="prose-rust">
      <h1>Generic Functions &amp; Structs</h1>

      <p>
        Python is dynamically typed, so functions naturally work with any type.
        Rust is statically typed, but <strong>generics</strong> let you write
        code that works with many types while preserving full type safety.
        The compiler generates specialized versions for each concrete type
        used — zero runtime cost.
      </p>

      <ConceptBlock title="Generics = Compile-Time Polymorphism">
        <p>
          A generic function or struct uses type parameters (like
          <code>&lt;T&gt;</code>) as placeholders. When you call
          <code>largest(&amp;vec![1, 2, 3])</code>, the compiler generates
          a version of <code>largest</code> specialized for <code>i32</code>.
          This process is called <strong>monomorphization</strong> — it
          produces the same machine code as if you wrote a separate function
          for each type.
        </p>
      </ConceptBlock>

      <h2>Python Duck Typing vs Rust Generics</h2>

      <PythonRustCompare
        title="Functions that work with many types"
        description="Python relies on duck typing at runtime. Rust uses generics with trait bounds checked at compile time."
        pythonCode={`from typing import TypeVar, Sequence

T = TypeVar("T")

def first(items: Sequence[T]) -> T | None:
    """Return the first item, or None."""
    return items[0] if items else None

# Works with any sequence — duck typing
print(first([1, 2, 3]))       # 1
print(first(("a", "b")))      # "a"
print(first("hello"))          # "h"
print(first([]))               # None

# But also "works" with nonsense — no error until runtime:
# first(42)  # TypeError: object is not subscriptable`}
        rustCode={`fn first<T>(items: &[T]) -> Option<&T> {
    items.first()
}

fn main() {
    let nums = vec![1, 2, 3];
    let words = vec!["a", "b"];

    println!("{:?}", first(&nums));   // Some(1)
    println!("{:?}", first(&words));  // Some("a")

    let empty: Vec<i32> = vec![];
    println!("{:?}", first(&empty));  // None

    // This won't compile — 42 is not a slice:
    // first(&42);  // ERROR at compile time
}`}
      />

      <NoteBlock title="Monomorphization" type="note">
        <p>
          When you call <code>first(&amp;nums)</code> and
          <code>first(&amp;words)</code>, the compiler generates two separate
          functions: <code>first_i32</code> and <code>first_str</code>.
          This is why generics have zero runtime overhead — the type
          parameter is resolved entirely at compile time. Python's equivalent
          would be writing separate functions by hand.
        </p>
      </NoteBlock>

      <h2>Generic Structs</h2>

      <PythonRustCompare
        title="Generic data containers"
        description="Python uses Generic[T] for type hints. Rust's generics define the actual memory layout."
        pythonCode={`from typing import Generic, TypeVar, Optional

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self):
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> Optional[T]:
        return self._items.pop() if self._items else None

    def peek(self) -> Optional[T]:
        return self._items[-1] if self._items else None

s: Stack[int] = Stack()
s.push(1)
s.push(2)
print(s.pop())  # 2`}
        rustCode={`struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    fn peek(&self) -> Option<&T> {
        self.items.last()
    }
}

fn main() {
    let mut s: Stack<i32> = Stack::new();
    s.push(1);
    s.push(2);
    println!("{:?}", s.pop());  // Some(2)

    // Type is often inferred:
    let mut names = Stack::new();  // Stack<&str>
    names.push("Alice");
    names.push("Bob");
}`}
      />

      <h2>Multiple Type Parameters</h2>

      <CodeBlock
        language="rust"
        title="Structs and functions with multiple generics"
        code={`// A key-value pair with different types for key and value
#[derive(Debug)]
struct Pair<K, V> {
    key: K,
    value: V,
}

impl<K, V> Pair<K, V> {
    fn new(key: K, value: V) -> Self {
        Pair { key, value }
    }

    fn into_tuple(self) -> (K, V) {
        (self.key, self.value)
    }
}

// Methods only available when K is displayable
impl<K: std::fmt::Display, V: std::fmt::Debug> Pair<K, V> {
    fn describe(&self) -> String {
        format!("{} => {:?}", self.key, self.value)
    }
}

fn main() {
    let p1 = Pair::new("name", "Alice");
    let p2 = Pair::new(1, vec![10, 20, 30]);

    println!("{}", p1.describe());  // name => "Alice"
    println!("{}", p2.describe());  // 1 => [10, 20, 30]

    let (k, v) = p2.into_tuple();
    println!("Key: {}, Values: {:?}", k, v);
}`}
      />

      <NoteBlock title="Conditional method implementations" type="tip">
        <p>
          Notice the second <code>impl</code> block adds <code>describe()</code>
          only when <code>K: Display</code> and <code>V: Debug</code>. This
          is a powerful pattern — you can add methods that are available only
          for certain type combinations. Python has no equivalent; you would
          need runtime <code>isinstance</code> checks.
        </p>
      </NoteBlock>

      <h2>Generic Enums</h2>

      <CodeBlock
        language="rust"
        title="You already use generic enums"
        code={`// Option and Result ARE generic enums!
// Here's how they're defined (simplified):

// enum Option<T> {
//     Some(T),
//     None,
// }

// enum Result<T, E> {
//     Ok(T),
//     Err(E),
// }

// Your own generic enum:
#[derive(Debug)]
enum Response<T> {
    Success(T),
    Error(String),
    Loading,
}

impl<T: std::fmt::Display> Response<T> {
    fn unwrap_or(self, default: T) -> T {
        match self {
            Response::Success(val) => val,
            _ => default,
        }
    }
}

fn fetch_data(id: u32) -> Response<String> {
    match id {
        1 => Response::Success("Alice".into()),
        2 => Response::Success("Bob".into()),
        _ => Response::Error("Not found".into()),
    }
}

fn main() {
    let name = fetch_data(1).unwrap_or("Unknown".into());
    println!("{}", name);  // Alice

    let missing = fetch_data(99).unwrap_or("Unknown".into());
    println!("{}", missing);  // Unknown
}`}
      />

      <NoteBlock title="Generics are everywhere" type="pythonista">
        <p>
          Once you recognize that <code>Option&lt;T&gt;</code>,
          <code>Result&lt;T, E&gt;</code>, <code>Vec&lt;T&gt;</code>,
          <code>HashMap&lt;K, V&gt;</code>, and <code>Iterator&lt;Item = T&gt;</code>
          are all generic types, Rust's type system clicks into place. Think
          of generics as Python's duck typing, but with the types checked
          before your code runs.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Generic min-max tracker"
        difficulty="medium"
        problem={`Create a generic struct MinMax<T> that tracks the minimum and maximum
values seen so far. It should have:
1. new(first: T) -> Self — initialize with the first value
2. update(&mut self, value: T) — update min/max if the new value is smaller/larger
3. min(&self) -> &T and max(&self) -> &T — return references to current min/max
4. spread(&self) -> T where T also implements Sub (subtraction) — return max - min

What trait bound does T need for comparison? For subtraction?`}
        solution={`use std::ops::Sub;

struct MinMax<T> {
    min_val: T,
    max_val: T,
}

impl<T: PartialOrd + Clone> MinMax<T> {
    fn new(first: T) -> Self {
        MinMax {
            min_val: first.clone(),
            max_val: first,
        }
    }

    fn update(&mut self, value: T) {
        if value < self.min_val {
            self.min_val = value.clone();
        }
        if value > self.max_val {
            self.max_val = value;
        }
    }

    fn min(&self) -> &T { &self.min_val }
    fn max(&self) -> &T { &self.max_val }
}

// spread() needs Sub in addition to the base bounds
impl<T> MinMax<T>
where
    T: PartialOrd + Clone + Sub<Output = T>,
{
    fn spread(&self) -> T {
        self.max_val.clone() - self.min_val.clone()
    }
}

fn main() {
    let mut tracker = MinMax::new(5);
    tracker.update(3);
    tracker.update(8);
    tracker.update(1);

    println!("Min: {}, Max: {}", tracker.min(), tracker.max());
    println!("Spread: {}", tracker.spread());
    // Min: 1, Max: 8, Spread: 7
}`}
      />
    </div>
  );
}
