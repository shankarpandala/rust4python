import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Enums() {
  return (
    <div className="prose-rust">
      <h1>Enums with Data</h1>
      <p>
        Python's <code>enum.Enum</code> gives you named constants. Rust's enums
        are <em>algebraic data types</em> — each variant can carry different data.
        This is one of Rust's most powerful features and has no direct Python
        equivalent.
      </p>

      <ConceptBlock title="Algebraic Data Types">
        <p>
          A Rust enum says: "this value is <strong>one of</strong> these variants."
          Each variant can hold different types and amounts of data. The compiler
          guarantees you handle every variant, eliminating an entire class of bugs
          that Python developers fight with <code>isinstance</code> checks.
        </p>
      </ConceptBlock>

      <h2>Simple Enums</h2>
      <PythonRustCompare
        title="Basic enum comparison"
        description="Simple named-constant enums look similar in both languages."
        pythonCode={`from enum import Enum

class Direction(Enum):
    North = "north"
    South = "south"
    East  = "east"
    West  = "west"

def describe(d: Direction) -> str:
    if d == Direction.North:
        return "Going up"
    elif d == Direction.South:
        return "Going down"
    else:
        return "Going sideways"`}
        rustCode={`enum Direction {
    North,
    South,
    East,
    West,
}

fn describe(d: Direction) -> &'static str {
    match d {
        Direction::North => "Going up",
        Direction::South => "Going down",
        Direction::East | Direction::West => "Going sideways",
    }
}

fn main() {
    println!("{}", describe(Direction::North));
}`}
      />

      <NoteBlock title="Exhaustive matching" type="warning">
        <p>
          The <code>match</code> expression must cover every variant. If you add a
          new variant to the enum later, the compiler will show errors everywhere
          you forgot to handle it. This is a massive safety net compared to Python,
          where an <code>if/elif</code> chain silently ignores new cases.
        </p>
      </NoteBlock>

      <h2>Enums with Data — The Superpower</h2>
      <PythonRustCompare
        title="Enums carrying data"
        description="In Python you'd use unions or different classes. Rust enums bundle variant + data in one type."
        pythonCode={`from dataclasses import dataclass
from typing import Union

@dataclass
class Quit:
    pass

@dataclass
class Echo:
    message: str

@dataclass
class Move:
    x: int
    y: int

@dataclass
class ChangeColor:
    r: int
    g: int
    b: int

Command = Union[Quit, Echo, Move, ChangeColor]

def run(cmd: Command):
    if isinstance(cmd, Quit):
        print("Quitting")
    elif isinstance(cmd, Echo):
        print(cmd.message)
    elif isinstance(cmd, Move):
        print(f"Move to ({cmd.x}, {cmd.y})")
    elif isinstance(cmd, ChangeColor):
        print(f"Color: ({cmd.r},{cmd.g},{cmd.b})")`}
        rustCode={`enum Command {
    Quit,
    Echo(String),
    Move { x: i32, y: i32 },
    ChangeColor(u8, u8, u8),
}

fn run(cmd: Command) {
    match cmd {
        Command::Quit => println!("Quitting"),
        Command::Echo(msg) => println!("{}", msg),
        Command::Move { x, y } => {
            println!("Move to ({}, {})", x, y);
        }
        Command::ChangeColor(r, g, b) => {
            println!("Color: ({},{},{})", r, g, b);
        }
    }
}

fn main() {
    run(Command::Echo("hello".into()));
    run(Command::Move { x: 10, y: 20 });
}`}
      />

      <NoteBlock title="Why this matters" type="pythonista">
        <p>
          In Python, representing "one of several shapes of data" requires a
          Union of classes plus <code>isinstance</code> checks that are easy to
          forget. Rust enums pack the tag and data together, and the compiler
          verifies every match. You will use this pattern constantly — it
          replaces unions, sentinel values, and exception-based control flow.
        </p>
      </NoteBlock>

      <h2>Pattern Matching with match</h2>
      <CodeBlock
        language="rust"
        title="Nested and guarded patterns"
        code={`enum Shape {
    Circle(f64),             // radius
    Rect { w: f64, h: f64 }, // named fields
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rect { w, h } => w * h,
    }
}

fn classify(s: &Shape) -> &str {
    match s {
        Shape::Circle(r) if *r > 100.0 => "large circle",
        Shape::Circle(_) => "small circle",
        Shape::Rect { w, h } if w == h => "square",
        Shape::Rect { .. } => "rectangle",
    }
}

fn main() {
    let shapes = vec![
        Shape::Circle(5.0),
        Shape::Circle(200.0),
        Shape::Rect { w: 10.0, h: 10.0 },
        Shape::Rect { w: 3.0, h: 7.0 },
    ];
    for s in &shapes {
        println!("{}: area={:.1}", classify(s), area(s));
    }
}`}
      />

      <h2>if let — Quick Single-Variant Check</h2>
      <CodeBlock
        language="rust"
        title="if let for single-variant matching"
        code={`enum Message {
    Text(String),
    Image { url: String, width: u32 },
    Deleted,
}

fn print_text(msg: &Message) {
    // Only care about one variant? Use if let
    if let Message::Text(content) = msg {
        println!("Text: {}", content);
    }
    // Equivalent to:
    // match msg {
    //     Message::Text(content) => println!("Text: {}", content),
    //     _ => {}
    // }
}`}
      />

      <NoteBlock title="if let vs match" type="tip">
        <p>
          Use <code>if let</code> when you care about exactly one variant and want
          to ignore the rest. Use <code>match</code> when you need to handle
          multiple variants — the compiler will ensure completeness.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="JSON-like Value enum"
        difficulty="medium"
        problem={`Define an enum called JsonValue with variants:
- Null
- Bool(bool)
- Number(f64)
- Str(String)
Write a function to_string that takes a &JsonValue and returns a String
representation (e.g., "null", "true", "3.14", or the quoted string).
Use match to handle all variants.`}
        solution={`enum JsonValue {
    Null,
    Bool(bool),
    Number(f64),
    Str(String),
}

fn to_string(val: &JsonValue) -> String {
    match val {
        JsonValue::Null => "null".to_string(),
        JsonValue::Bool(b) => b.to_string(),
        JsonValue::Number(n) => n.to_string(),
        JsonValue::Str(s) => format!("\"{}\"", s),
    }
}

fn main() {
    let values = vec![
        JsonValue::Null,
        JsonValue::Bool(true),
        JsonValue::Number(3.14),
        JsonValue::Str("hello".into()),
    ];
    for v in &values {
        println!("{}", to_string(v));
    }
}`}
      />
    </div>
  );
}
