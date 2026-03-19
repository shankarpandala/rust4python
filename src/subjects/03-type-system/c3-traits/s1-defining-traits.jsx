import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function DefiningTraits() {
  return (
    <div className="prose-rust">
      <h1>Defining &amp; Implementing Traits</h1>

      <p>
        Python uses duck typing, ABCs, and Protocols to define shared behavior.
        Rust uses <strong>traits</strong> — the cornerstone of its type system.
        Traits define what a type <em>can do</em>, similar to interfaces in
        other languages, but with the power of default implementations and
        compile-time enforcement.
      </p>

      <ConceptBlock title="What Is a Trait?">
        <p>
          A trait is a collection of method signatures (and optionally default
          implementations) that types can implement. When a type implements a
          trait, it promises to provide all the required methods. The compiler
          checks this at compile time — no runtime surprises.
        </p>
        <p>
          Traits serve the same role as Python's <code>Protocol</code> (structural
          typing) and <code>ABC</code> (nominal typing), but are checked
          statically and have zero runtime cost.
        </p>
      </ConceptBlock>

      <h2>Python Protocol/ABC vs Rust Trait</h2>

      <PythonRustCompare
        title="Defining shared behavior"
        description="Python uses Protocol or ABC for interface contracts. Rust uses traits with compile-time enforcement."
        pythonCode={`from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> str: ...
    def area(self) -> float: ...

class Circle:
    def __init__(self, radius: float):
        self.radius = radius

    def draw(self) -> str:
        return f"Circle(r={self.radius})"

    def area(self) -> float:
        return 3.14159 * self.radius ** 2

# Structural typing: Circle satisfies Drawable
# But errors only appear at runtime if a method
# is missing or has the wrong signature
def render(shape: Drawable):
    print(f"{shape.draw()} area={shape.area():.2f}")`}
        rustCode={`trait Drawable {
    fn draw(&self) -> String;
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

impl Drawable for Circle {
    fn draw(&self) -> String {
        format!("Circle(r={})", self.radius)
    }

    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}

// Compile-time checked: item must implement Drawable
fn render(shape: &impl Drawable) {
    println!("{} area={:.2}", shape.draw(), shape.area());
}

fn main() {
    let c = Circle { radius: 5.0 };
    render(&c);
}`}
      />

      <NoteBlock title="No forgetting methods" type="pythonista">
        <p>
          In Python, if you forget to implement a Protocol method, you only
          find out when that method is called at runtime. With ABCs, you get
          an error at instantiation — better, but still runtime. Rust catches
          missing trait methods at compile time. If you forget
          <code>area()</code>, the code will not compile.
        </p>
      </NoteBlock>

      <h2>Default Implementations</h2>

      <CodeBlock
        language="rust"
        title="Traits with default methods"
        code={`trait Summary {
    // Required: implementors must provide this
    fn title(&self) -> &str;

    // Default: implementors can override or use as-is
    fn summarize(&self) -> String {
        format!("{} (read more...)", self.title())
    }
}

struct Article {
    title: String,
    content: String,
}

impl Summary for Article {
    fn title(&self) -> &str {
        &self.title
    }
    // summarize() uses the default implementation
}

struct Tweet {
    user: String,
    body: String,
}

impl Summary for Tweet {
    fn title(&self) -> &str {
        &self.user
    }

    // Override the default
    fn summarize(&self) -> String {
        format!("@{}: {}", self.user, self.body)
    }
}

fn main() {
    let article = Article {
        title: "Rust for Pythonistas".into(),
        content: "Long content...".into(),
    };
    let tweet = Tweet {
        user: "rustlang".into(),
        body: "Rust 2024 edition!".into(),
    };

    println!("{}", article.summarize());
    // "Rust for Pythonistas (read more...)"

    println!("{}", tweet.summarize());
    // "@rustlang: Rust 2024 edition!"
}`}
      />

      <h2>Implementing Traits for Existing Types</h2>

      <PythonRustCompare
        title="Extending existing types"
        description="Python monkey-patches classes. Rust implements traits for any type (with the orphan rule)."
        pythonCode={`# Python: monkey-patching
def word_count(self: str) -> int:
    return len(self.split())

# Technically works, but frowned upon:
str.word_count = word_count
# "hello world".word_count()  # 2

# More idiomatic: standalone function
def word_count(text: str) -> int:
    return len(text.split())

print(word_count("hello world"))  # 2`}
        rustCode={`// Rust: implement a trait for an existing type
trait WordCount {
    fn word_count(&self) -> usize;
}

impl WordCount for str {
    fn word_count(&self) -> usize {
        self.split_whitespace().count()
    }
}

fn main() {
    let text = "hello world";
    println!("{}", text.word_count());  // 2

    // This is safe and idiomatic — the trait must
    // be in scope to use the method.
}`}
      />

      <NoteBlock title="The orphan rule" type="warning">
        <p>
          You can implement a trait for a type only if either the trait or
          the type is defined in your crate. You cannot implement someone
          else's trait for someone else's type. This prevents conflicting
          implementations and keeps the ecosystem coherent.
        </p>
      </NoteBlock>

      <h2>Deriving Traits Automatically</h2>

      <CodeBlock
        language="rust"
        title="The derive macro"
        code={`// derive generates implementations automatically
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: f64,
    y: f64,
}

fn main() {
    let p1 = Point { x: 1.0, y: 2.0 };

    // Debug: enables {:?} formatting
    println!("{:?}", p1);  // Point { x: 1.0, y: 2.0 }

    // Clone: explicit duplication
    let p2 = p1.clone();

    // PartialEq: enables == comparison
    assert_eq!(p1, p2);
}

// Common derivable traits:
// Debug    — {:?} formatting (like Python __repr__)
// Clone    — .clone() method (like Python copy.copy)
// Copy     — implicit copy on assignment (small, stack-only types)
// PartialEq / Eq — == and != (like Python __eq__)
// PartialOrd / Ord — <, >, <=, >= (like Python __lt__ etc.)
// Hash     — usable as HashMap key (like Python __hash__)
// Default  — Type::default() (like Python default values)`}
      />

      <NoteBlock title="derive = Python's @dataclass on steroids" type="tip">
        <p>
          Python's <code>@dataclass</code> auto-generates <code>__init__</code>,
          <code>__repr__</code>, <code>__eq__</code>, and more. Rust's
          <code>#[derive(...)]</code> does the same for traits like
          <code>Debug</code>, <code>Clone</code>, and <code>PartialEq</code>.
          The difference: Rust's derives work for enums too, and the generated
          code is zero-cost.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Shape trait with area and perimeter"
        difficulty="medium"
        problem={`Define a trait Shape with two required methods: area(&self) -> f64 and
perimeter(&self) -> f64, plus a default method describe(&self) -> String
that returns "Area: {area:.2}, Perimeter: {perimeter:.2}".

Implement Shape for Circle (radius: f64) and Rectangle (width: f64, height: f64).
Override describe() for Circle to also include the radius.

Write a function print_shapes that takes a slice of &dyn Shape references
and prints each shape's description.`}
        solution={`trait Shape {
    fn area(&self) -> f64;
    fn perimeter(&self) -> f64;

    fn describe(&self) -> String {
        format!(
            "Area: {:.2}, Perimeter: {:.2}",
            self.area(),
            self.perimeter()
        )
    }
}

struct Circle { radius: f64 }
struct Rectangle { width: f64, height: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
    fn perimeter(&self) -> f64 {
        2.0 * std::f64::consts::PI * self.radius
    }
    fn describe(&self) -> String {
        format!(
            "Circle(r={:.1}): Area: {:.2}, Perimeter: {:.2}",
            self.radius, self.area(), self.perimeter()
        )
    }
}

impl Shape for Rectangle {
    fn area(&self) -> f64 { self.width * self.height }
    fn perimeter(&self) -> f64 { 2.0 * (self.width + self.height) }
}

fn print_shapes(shapes: &[&dyn Shape]) {
    for s in shapes {
        println!("{}", s.describe());
    }
}

fn main() {
    let c = Circle { radius: 5.0 };
    let r = Rectangle { width: 4.0, height: 6.0 };
    print_shapes(&[&c, &r]);
}`}
      />
    </div>
  );
}
