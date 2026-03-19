import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function DefiningStructs() {
  return (
    <div className="prose-rust">
      <h1>Defining Structs</h1>
      <p>
        If you come from Python, you have likely used <code>dataclasses</code>,
        <code>NamedTuple</code>, or plain classes to group related data. Rust's
        <strong> structs</strong> fill that role, but with compile-time type
        guarantees and zero runtime overhead.
      </p>

      <ConceptBlock title="What is a Struct?">
        <p>
          A struct is a custom data type that groups named fields together. Unlike
          Python classes, structs carry <em>no</em> inheritance hierarchy, no
          <code>__dict__</code>, and no method-resolution order. They are simple,
          predictable containers whose layout is known at compile time.
        </p>
      </ConceptBlock>

      <h2>Basic Struct Definition</h2>
      <PythonRustCompare
        title="Data Container: Python dataclass vs Rust struct"
        description="Both define a named record with typed fields, but Rust enforces types at compile time."
        pythonCode={`from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p = Point(1.0, 2.0)
print(p.x)  # 1.0`}
        rustCode={`struct Point {
    x: f64,
    y: f64,
}

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    println!("{}", p.x); // 1.0
}`}
      />

      <NoteBlock title="All fields required" type="warning">
        <p>
          Rust structs have no default values out of the box. Every field must be
          provided when constructing. To get defaults, implement or derive the
          <code>Default</code> trait (covered in the traits chapter).
        </p>
      </NoteBlock>

      <h2>Tuple Structs and Unit Structs</h2>
      <p>
        Rust has two additional struct forms that Python developers should know
        about.
      </p>
      <CodeBlock
        language="rust"
        title="Tuple struct and unit struct"
        code={`// Tuple struct: fields accessed by index, not name
struct Color(u8, u8, u8);

// Unit struct: zero-sized, useful as marker types
struct Marker;

fn main() {
    let red = Color(255, 0, 0);
    println!("R = {}", red.0);

    let _m = Marker; // occupies 0 bytes
}`}
      />

      <NoteBlock title="Newtype pattern" type="pythonista">
        <p>
          A tuple struct with one field is called the <strong>newtype pattern</strong>.
          It wraps an existing type to give it a distinct identity:
          <code>struct Meters(f64);</code>. In Python you might subclass
          <code>float</code>, but the newtype pattern has zero cost and prevents
          accidental mixing of <code>Meters</code> and <code>Seconds</code>.
        </p>
      </NoteBlock>

      <h2>Struct Update Syntax</h2>
      <PythonRustCompare
        title="Copying with modifications"
        description="Python dataclasses offer replace(); Rust has struct update syntax."
        pythonCode={`from dataclasses import dataclass, replace

@dataclass
class Config:
    width: int
    height: int
    fullscreen: bool

base = Config(1920, 1080, False)
wide = replace(base, width=2560)`}
        rustCode={`#[derive(Clone)]
struct Config {
    width: u32,
    height: u32,
    fullscreen: bool,
}

fn main() {
    let base = Config {
        width: 1920,
        height: 1080,
        fullscreen: false,
    };
    let wide = Config { width: 2560, ..base };
    // remaining fields are moved (or copied) from base
}`}
      />

      <NoteBlock title="Move semantics matter" type="tip">
        <p>
          The <code>..base</code> syntax <em>moves</em> fields out of
          <code>base</code> unless the struct implements <code>Copy</code>.
          After the update, <code>base</code> may no longer be usable if any
          non-Copy field was moved. Derive <code>Clone</code> and call
          <code>.clone()</code> explicitly when you need both values.
        </p>
      </NoteBlock>

      <h2>Visibility: pub Fields</h2>
      <CodeBlock
        language="rust"
        title="Controlling field visibility"
        code={`mod shapes {
    pub struct Rectangle {
        pub width: f64,
        pub height: f64,
        // private field: callers outside this module cannot set it
        area_cache: Option<f64>,
    }

    impl Rectangle {
        pub fn new(w: f64, h: f64) -> Self {
            Rectangle { width: w, height: h, area_cache: None }
        }
    }
}

fn main() {
    // Must use constructor because area_cache is private
    let r = shapes::Rectangle::new(10.0, 5.0);
    println!("w = {}", r.width); // OK, width is pub
}`}
      />

      <NoteBlock title="Python comparison" type="pythonista">
        <p>
          Python uses a <code>_</code> prefix convention for private attributes,
          but nothing stops external code from accessing them. In Rust, a
          non-<code>pub</code> field is <em>truly</em> inaccessible outside the
          module. This means if any field is private, external code must use a
          constructor function instead of literal syntax.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Define a User struct"
        difficulty="easy"
        problem={`Create a struct called User with fields: username (String), email (String),
and active (bool). Write a function new_user that takes a username and email
and returns a User with active set to true. Then use struct update syntax to
create an inactive copy.`}
        solution={`struct User {
    username: String,
    email: String,
    active: bool,
}

fn new_user(username: String, email: String) -> User {
    // field init shorthand: username instead of username: username
    User { username, email, active: true }
}

fn main() {
    let alice = new_user(
        String::from("alice"),
        String::from("alice@example.com"),
    );
    let inactive = User { active: false, ..alice };
    println!("{} active={}", inactive.username, inactive.active);
}`}
      />
    </div>
  );
}
