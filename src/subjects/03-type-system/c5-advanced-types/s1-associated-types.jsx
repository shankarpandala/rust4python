import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function AssociatedTypes() {
  return (
    <div className="prose-rust">
      <h1>Associated Types</h1>

      <p>
        When a trait has a type that "belongs" to it — like the item type of
        an iterator — Rust uses <strong>associated types</strong> instead of
        additional generic parameters. This keeps trait usage clean and avoids
        type parameter explosion.
      </p>

      <ConceptBlock title="Associated Types vs Generic Parameters">
        <p>
          An associated type says: "each implementation of this trait chooses
          one specific type for this slot." A generic parameter says: "a type
          can implement this trait for many different type parameters."
          Associated types are the right choice when there should be exactly
          one implementation per type.
        </p>
      </ConceptBlock>

      <h2>The Problem Associated Types Solve</h2>

      <PythonRustCompare
        title="Iterator item types"
        description="Python iterators yield 'object'. Rust iterators have a concrete associated Item type."
        pythonCode={`from typing import Iterator

class Counter:
    """Yields ints, but Python doesn't enforce this."""
    def __init__(self, max: int):
        self.current = 0
        self.max = max

    def __iter__(self) -> "Counter":
        return self

    def __next__(self) -> int:  # type hint only
        if self.current >= self.max:
            raise StopIteration
        val = self.current
        self.current += 1
        return val

# Nothing stops you from yielding mixed types:
# def __next__(self) -> int:
#     return "surprise!"  # No error until someone uses it`}
        rustCode={`struct Counter {
    current: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Self {
        Counter { current: 0, max }
    }
}

impl Iterator for Counter {
    type Item = u32;  // Associated type: this iterator yields u32

    fn next(&mut self) -> Option<Self::Item> {
        if self.current >= self.max {
            None
        } else {
            let val = self.current;
            self.current += 1;
            Some(val)
        }
    }
}

fn main() {
    let sum: u32 = Counter::new(5).sum();
    println!("{}", sum);  // 10
}`}
      />

      <NoteBlock title="Why not Iterator<T>?" type="note">
        <p>
          If <code>Iterator</code> used a generic parameter
          <code>Iterator&lt;T&gt;</code>, a single type could implement
          <code>Iterator&lt;i32&gt;</code> AND <code>Iterator&lt;String&gt;</code>,
          making it ambiguous which <code>next()</code> to call. With an
          associated type, each type implements <code>Iterator</code> exactly
          once, with exactly one <code>Item</code> type. Clarity over
          flexibility.
        </p>
      </NoteBlock>

      <h2>Defining Your Own Traits with Associated Types</h2>

      <CodeBlock
        language="rust"
        title="A trait with an associated type"
        code={`trait Transformer {
    type Input;
    type Output;

    fn transform(&self, input: Self::Input) -> Self::Output;
}

struct Doubler;

impl Transformer for Doubler {
    type Input = i32;
    type Output = i32;

    fn transform(&self, input: i32) -> i32 {
        input * 2
    }
}

struct Stringifier;

impl Transformer for Stringifier {
    type Input = i32;
    type Output = String;

    fn transform(&self, input: i32) -> String {
        format!("Value: {}", input)
    }
}

// Using the trait in a generic function
fn apply<T: Transformer>(t: &T, input: T::Input) -> T::Output {
    t.transform(input)
}

fn main() {
    println!("{}", apply(&Doubler, 21));          // 42
    println!("{}", apply(&Stringifier, 42));       // Value: 42
}`}
      />

      <h2>Associated Types in the Standard Library</h2>

      <CodeBlock
        language="rust"
        title="Common traits with associated types"
        code={`use std::ops::Add;

// std::ops::Add has an associated type Output:
// trait Add<Rhs = Self> {
//     type Output;
//     fn add(self, rhs: Rhs) -> Self::Output;
// }

#[derive(Debug, Clone, Copy)]
struct Vector2D { x: f64, y: f64 }

impl Add for Vector2D {
    type Output = Vector2D;  // Adding two Vector2Ds gives a Vector2D

    fn add(self, other: Vector2D) -> Vector2D {
        Vector2D {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

// You can even add different types:
impl Add<f64> for Vector2D {
    type Output = Vector2D;  // Adding a scalar to a Vector2D

    fn add(self, scalar: f64) -> Vector2D {
        Vector2D {
            x: self.x + scalar,
            y: self.y + scalar,
        }
    }
}

fn main() {
    let a = Vector2D { x: 1.0, y: 2.0 };
    let b = Vector2D { x: 3.0, y: 4.0 };

    let c = a + b;           // Vector2D + Vector2D
    println!("{:?}", c);     // Vector2D { x: 4.0, y: 6.0 }

    let d = a + 10.0;        // Vector2D + f64
    println!("{:?}", d);     // Vector2D { x: 11.0, y: 12.0 }
}`}
      />

      <NoteBlock title="Operator overloading in Rust" type="pythonista">
        <p>
          Python uses <code>__add__</code>, <code>__mul__</code>, etc. for
          operator overloading. Rust uses traits from <code>std::ops</code>:
          <code>Add</code>, <code>Mul</code>, <code>Index</code>, etc. The
          associated <code>Output</code> type lets the result type differ
          from the input types — something Python's dunder methods do
          implicitly but Rust makes explicit.
        </p>
      </NoteBlock>

      <h2>When to Use Associated Types vs Generics</h2>

      <CodeBlock
        language="rust"
        title="Decision guide"
        code={`// USE ASSOCIATED TYPES when:
// There should be ONE implementation per type

trait Parser {
    type Output;                     // Each parser has one output type
    fn parse(&self, input: &str) -> Option<Self::Output>;
}

struct IntParser;
impl Parser for IntParser {
    type Output = i32;               // IntParser always produces i32
    fn parse(&self, input: &str) -> Option<i32> {
        input.parse().ok()
    }
}

// USE GENERIC PARAMETERS when:
// A type should implement the trait for MULTIPLE type parameters

trait Convertible<T> {
    fn convert(&self) -> T;
}

struct MyNumber(f64);

impl Convertible<i32> for MyNumber {
    fn convert(&self) -> i32 { self.0 as i32 }
}

impl Convertible<String> for MyNumber {
    fn convert(&self) -> String { self.0.to_string() }
}

fn main() {
    let n = MyNumber(3.14);
    let i: i32 = n.convert();      // uses Convertible<i32>
    let s: String = n.convert();    // uses Convertible<String>
    println!("{}, {}", i, s);       // 3, 3.14
}`}
      />

      <ExerciseBlock
        title="A DataSource trait"
        difficulty="medium"
        problem={`Define a trait DataSource with:
- An associated type Record
- A method fetch(&self) -> Vec<Self::Record>
- A method count(&self) -> usize with a default implementation that calls fetch().len()

Implement DataSource for two structs:
1. CsvSource (returns Vec<Vec<String>> — rows of string fields)
2. JsonSource (returns Vec<HashMap<String, String>> — list of objects)

Write a function summarize<D: DataSource>(source: &D) that prints the count.`}
        solution={`use std::collections::HashMap;

trait DataSource {
    type Record;

    fn fetch(&self) -> Vec<Self::Record>;

    fn count(&self) -> usize {
        self.fetch().len()
    }
}

struct CsvSource {
    data: Vec<Vec<String>>,
}

impl DataSource for CsvSource {
    type Record = Vec<String>;

    fn fetch(&self) -> Vec<Vec<String>> {
        self.data.clone()
    }
}

struct JsonSource {
    data: Vec<HashMap<String, String>>,
}

impl DataSource for JsonSource {
    type Record = HashMap<String, String>;

    fn fetch(&self) -> Vec<HashMap<String, String>> {
        self.data.clone()
    }
}

fn summarize<D: DataSource>(source: &D) {
    println!("Records: {}", source.count());
}

fn main() {
    let csv = CsvSource {
        data: vec![
            vec!["Alice".into(), "30".into()],
            vec!["Bob".into(), "25".into()],
        ],
    };
    summarize(&csv);  // Records: 2

    let json = JsonSource {
        data: vec![
            HashMap::from([("name".into(), "Alice".into())]),
        ],
    };
    summarize(&json);  // Records: 1
}`}
      />
    </div>
  );
}
