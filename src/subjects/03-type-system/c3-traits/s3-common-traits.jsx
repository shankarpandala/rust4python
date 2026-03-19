import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function CommonTraits() {
  return (
    <div className="prose-rust">
      <h1>Common Standard Library Traits</h1>

      <p>
        Python has dunder methods (<code>__str__</code>, <code>__repr__</code>,
        <code>__eq__</code>, etc.) that customize how objects behave. Rust uses
        standard library traits for the same purpose. Knowing these traits is
        essential — they are the building blocks of idiomatic Rust.
      </p>

      <ConceptBlock title="The Trait Ecosystem">
        <p>
          Rust's standard library defines a rich set of traits that let your
          types integrate with the language and ecosystem. Most can be
          auto-generated with <code>#[derive(...)]</code>. Understanding
          these traits is like learning Python's data model — once you know
          them, everything clicks.
        </p>
      </ConceptBlock>

      <h2>Display and Debug — Printing Your Types</h2>

      <PythonRustCompare
        title="String representation"
        description="Python's __str__ and __repr__ map to Rust's Display and Debug traits."
        pythonCode={`class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __str__(self) -> str:
        return f"({self.x}, {self.y})"

    def __repr__(self) -> str:
        return f"Point(x={self.x}, y={self.y})"

p = Point(1.0, 2.0)
print(str(p))   # (1.0, 2.0)    — __str__
print(repr(p))  # Point(x=1.0, y=2.0) — __repr__`}
        rustCode={`use std::fmt;

#[derive(Debug)]  // Auto-generates Debug
struct Point {
    x: f64,
    y: f64,
}

// Display must be implemented manually
impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    println!("{}", p);    // (1.0, 2.0)     — Display
    println!("{:?}", p);  // Point { x: 1.0, y: 2.0 } — Debug
    println!("{p:#?}");   // Pretty-printed Debug
}`}
      />

      <NoteBlock title="Display enables .to_string()" type="tip">
        <p>
          Implementing <code>Display</code> automatically gives your type a
          <code>.to_string()</code> method and lets it work with
          <code>format!()</code>, <code>println!()</code>, and string
          interpolation. Always derive <code>Debug</code>; implement
          <code>Display</code> when you want user-friendly output.
        </p>
      </NoteBlock>

      <h2>From and Into — Type Conversions</h2>

      <PythonRustCompare
        title="Type conversions"
        description="Python uses __init__ or class methods for conversions. Rust uses From/Into traits."
        pythonCode={`class Celsius:
    def __init__(self, temp: float):
        self.temp = temp

    @classmethod
    def from_fahrenheit(cls, f: float) -> "Celsius":
        return cls((f - 32.0) * 5.0 / 9.0)

    def __str__(self):
        return f"{self.temp:.1f}°C"

c = Celsius.from_fahrenheit(212.0)
print(c)  # 100.0°C`}
        rustCode={`use std::fmt;

struct Celsius(f64);
struct Fahrenheit(f64);

// Implement From<Fahrenheit> for Celsius
impl From<Fahrenheit> for Celsius {
    fn from(f: Fahrenheit) -> Self {
        Celsius((f.0 - 32.0) * 5.0 / 9.0)
    }
}

impl fmt::Display for Celsius {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:.1}°C", self.0)
    }
}

fn main() {
    // From: explicit conversion
    let c = Celsius::from(Fahrenheit(212.0));
    println!("{}", c);  // 100.0°C

    // Into: the reverse (free when From is implemented)
    let c2: Celsius = Fahrenheit(32.0).into();
    println!("{}", c2); // 0.0°C
}`}
      />

      <NoteBlock title="From gives you Into for free" type="note">
        <p>
          When you implement <code>From&lt;A&gt; for B</code>, Rust
          automatically provides <code>Into&lt;B&gt; for A</code>. Always
          implement <code>From</code> — you get both directions. The
          <code>?</code> operator uses <code>From</code> to convert error
          types, making this trait essential for error handling.
        </p>
      </NoteBlock>

      <h2>Default — Sensible Starting Values</h2>

      <CodeBlock
        language="rust"
        title="The Default trait"
        code={`#[derive(Debug, Default)]
struct Config {
    host: String,       // Default: ""
    port: u16,          // Default: 0
    verbose: bool,      // Default: false
    workers: usize,     // Default: 0
}

// Custom Default when derive isn't enough
#[derive(Debug)]
struct ServerConfig {
    host: String,
    port: u16,
    max_connections: usize,
}

impl Default for ServerConfig {
    fn default() -> Self {
        ServerConfig {
            host: "localhost".to_string(),
            port: 8080,
            max_connections: 100,
        }
    }
}

fn main() {
    // Use all defaults
    let cfg1 = Config::default();
    println!("{:?}", cfg1);

    // Override some fields (struct update with Default)
    let cfg2 = ServerConfig {
        port: 3000,
        ..ServerConfig::default()
    };
    println!("{:?}", cfg2);
    // ServerConfig { host: "localhost", port: 3000, max_connections: 100 }
}`}
      />

      <h2>Clone and Copy — Duplication Semantics</h2>

      <CodeBlock
        language="rust"
        title="Clone vs Copy"
        code={`// Copy: implicit, bitwise duplication (cheap, stack-only types)
#[derive(Debug, Clone, Copy)]
struct Point { x: f64, y: f64 }

// Clone only: explicit duplication (heap data, expensive)
#[derive(Debug, Clone)]
struct Dataset {
    name: String,
    values: Vec<f64>,
}

fn main() {
    // Copy types are implicitly duplicated on assignment
    let p1 = Point { x: 1.0, y: 2.0 };
    let p2 = p1;       // p1 is copied, both usable
    println!("{:?} {:?}", p1, p2);  // both work

    // Clone types must be explicitly cloned
    let d1 = Dataset {
        name: "train".into(),
        values: vec![1.0, 2.0, 3.0],
    };
    let d2 = d1.clone();  // explicit — you see the cost
    // let d3 = d1;        // This MOVES d1, making it unusable
    println!("{:?}", d2);
}

// Rule of thumb:
// - Small, stack-only types (numbers, Point): derive Copy + Clone
// - Types with heap data (String, Vec): derive Clone only
// - Types that own unique resources (File): neither`}
      />

      <NoteBlock title="Python comparison" type="pythonista">
        <p>
          In Python, assignment always creates a new reference to the same
          object (<code>b = a</code> does not copy). You use
          <code>copy.copy()</code> for shallow copies and
          <code>copy.deepcopy()</code> for deep copies. Rust's
          <code>Copy</code> is like automatic shallow copy for simple types,
          and <code>Clone</code> is like an explicit deep copy.
        </p>
      </NoteBlock>

      <h2>PartialEq, Eq, PartialOrd, Ord — Comparison</h2>

      <CodeBlock
        language="rust"
        title="Comparison traits"
        code={`// Derive all comparison traits
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Score {
    points: u32,
    name: String,  // compared second (field order matters!)
}

fn main() {
    let scores = vec![
        Score { points: 100, name: "Alice".into() },
        Score { points: 85, name: "Bob".into() },
        Score { points: 100, name: "Charlie".into() },
    ];

    // PartialEq: enables ==
    assert!(scores[0] != scores[1]);

    // Ord: enables sorting
    let mut sorted = scores.clone();
    sorted.sort();
    for s in &sorted {
        println!("{}: {}", s.name, s.points);
    }
    // Bob: 85, Alice: 100, Charlie: 100

    // PartialOrd: enables <, >, min, max
    println!("Best: {:?}", sorted.last());
}

// Why Partial vs Total?
// f64 has NaN (NaN != NaN), so it's only PartialEq/PartialOrd.
// Integers are always comparable, so they implement Eq/Ord too.`}
      />

      <ExerciseBlock
        title="Implement a Temperature type"
        difficulty="medium"
        problem={`Create a Temperature struct that wraps an f64 (in Celsius). Implement:
1. Display — format as "23.5°C"
2. From<f64> — create from raw number
3. Default — default to 20.0 (room temperature)
4. A method to_fahrenheit(&self) -> f64

Then create a function warmest(temps: &[Temperature]) -> Option<&Temperature>
that finds the highest temperature using PartialOrd (you'll need to derive it).`}
        solution={`use std::fmt;

#[derive(Debug, Clone, PartialEq, PartialOrd)]
struct Temperature(f64);

impl fmt::Display for Temperature {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:.1}°C", self.0)
    }
}

impl From<f64> for Temperature {
    fn from(celsius: f64) -> Self {
        Temperature(celsius)
    }
}

impl Default for Temperature {
    fn default() -> Self {
        Temperature(20.0)
    }
}

impl Temperature {
    fn to_fahrenheit(&self) -> f64 {
        self.0 * 9.0 / 5.0 + 32.0
    }
}

fn warmest(temps: &[Temperature]) -> Option<&Temperature> {
    temps.iter().max_by(|a, b| {
        a.partial_cmp(b).unwrap()
    })
}

fn main() {
    let temps: Vec<Temperature> = vec![
        18.5.into(), 22.0.into(), 19.3.into(),
    ];

    for t in &temps {
        println!("{} = {:.1}°F", t, t.to_fahrenheit());
    }

    if let Some(max) = warmest(&temps) {
        println!("Warmest: {}", max);
    }
}`}
      />
    </div>
  );
}
