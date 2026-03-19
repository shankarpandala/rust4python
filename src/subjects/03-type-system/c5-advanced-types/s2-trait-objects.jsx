import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function TraitObjects() {
  return (
    <div className="prose-rust">
      <h1>Trait Objects (dyn Trait)</h1>

      <p>
        Generics give you compile-time polymorphism — the compiler generates
        specialized code for each type. But sometimes you need runtime
        polymorphism: a collection of different types that share a trait.
        This is where <strong>trait objects</strong> come in, using
        <code>dyn Trait</code>.
      </p>

      <ConceptBlock title="Static vs Dynamic Dispatch">
        <p>
          <strong>Static dispatch</strong> (generics): The compiler knows the
          exact type at compile time and generates specialized code. Fast,
          but each type combination creates a new copy of the function.
        </p>
        <p>
          <strong>Dynamic dispatch</strong> (trait objects): The exact type is
          determined at runtime via a vtable (a table of function pointers).
          Slightly slower, but allows heterogeneous collections and runtime
          flexibility.
        </p>
      </ConceptBlock>

      <h2>Python's Default vs Rust's Explicit Choice</h2>

      <PythonRustCompare
        title="Runtime polymorphism"
        description="Python always uses dynamic dispatch. Rust lets you choose between static and dynamic."
        pythonCode={`class Dog:
    def speak(self) -> str:
        return "Woof!"

class Cat:
    def speak(self) -> str:
        return "Meow!"

class Fish:
    def speak(self) -> str:
        return "..."

# Python: any list can hold mixed types
# Dispatch is always dynamic (via __dict__ lookup)
animals = [Dog(), Cat(), Fish()]
for animal in animals:
    print(animal.speak())  # resolved at runtime`}
        rustCode={`trait Animal {
    fn speak(&self) -> &str;
}

struct Dog;
struct Cat;
struct Fish;

impl Animal for Dog  { fn speak(&self) -> &str { "Woof!" } }
impl Animal for Cat  { fn speak(&self) -> &str { "Meow!" } }
impl Animal for Fish { fn speak(&self) -> &str { "..." } }

fn main() {
    // dyn Animal: a trait object — type resolved at runtime
    let animals: Vec<Box<dyn Animal>> = vec![
        Box::new(Dog),
        Box::new(Cat),
        Box::new(Fish),
    ];

    for animal in &animals {
        println!("{}", animal.speak()); // dynamic dispatch
    }
}`}
      />

      <NoteBlock title="Box&lt;dyn Trait&gt;" type="note">
        <p>
          Trait objects must be behind a pointer (<code>Box</code>,
          <code>&amp;dyn</code>, or <code>Arc</code>) because different types
          have different sizes. The pointer has a fixed size and includes a
          vtable pointer for method lookup. <code>Box&lt;dyn Animal&gt;</code>
          owns the value on the heap; <code>&amp;dyn Animal</code> borrows it.
        </p>
      </NoteBlock>

      <h2>Static vs Dynamic: When to Choose Which</h2>

      <CodeBlock
        language="rust"
        title="The same trait, two dispatch strategies"
        code={`trait Processor {
    fn process(&self, data: &str) -> String;
}

struct Upper;
struct Lower;

impl Processor for Upper {
    fn process(&self, data: &str) -> String { data.to_uppercase() }
}

impl Processor for Lower {
    fn process(&self, data: &str) -> String { data.to_lowercase() }
}

// STATIC dispatch: compiler generates one version per type
// Pro: fastest, enables inlining.  Con: no mixed collections.
fn apply_static(proc: &impl Processor, data: &str) -> String {
    proc.process(data)
}

// DYNAMIC dispatch: one version, dispatched via vtable
// Pro: mixed collections, smaller binary.  Con: slight overhead.
fn apply_dynamic(proc: &dyn Processor, data: &str) -> String {
    proc.process(data)
}

fn main() {
    // Static — type known at compile time
    println!("{}", apply_static(&Upper, "hello"));  // HELLO
    println!("{}", apply_static(&Lower, "HELLO"));  // hello

    // Dynamic — type resolved at runtime
    let processors: Vec<Box<dyn Processor>> = vec![
        Box::new(Upper),
        Box::new(Lower),
    ];
    for p in &processors {
        println!("{}", apply_dynamic(p.as_ref(), "Rust"));
    }
}`}
      />

      <h2>Trait Object Limitations</h2>

      <CodeBlock
        language="rust"
        title="Object safety rules"
        code={`// This trait IS object-safe (can be used as dyn)
trait Drawable {
    fn draw(&self) -> String;
    fn area(&self) -> f64;
}

// This trait is NOT object-safe
trait Clonable {
    fn clone_box(&self) -> Self;  // Returns Self — size unknown!
}

// This trait is NOT object-safe
trait Typed {
    fn convert<T>(&self) -> T;   // Generic method — can't dispatch
}

// Workaround: make non-object-safe traits object-safe
trait CloneBox {
    fn clone_box(&self) -> Box<dyn CloneBox>;
}

impl<T: Clone + 'static> CloneBox for T {
    fn clone_box(&self) -> Box<dyn CloneBox> {
        Box::new(self.clone())
    }
}

// Object safety rules:
// 1. Methods cannot return Self (use Box<dyn Trait> instead)
// 2. Methods cannot have generic type parameters
// 3. The trait cannot require Self: Sized`}
      />

      <NoteBlock title="When to use trait objects" type="tip">
        <p>
          Use <strong>generics</strong> (static dispatch) by default — they
          are faster and let the compiler optimize more aggressively. Use
          <strong>trait objects</strong> (dynamic dispatch) when you need
          heterogeneous collections, plugin architectures, or when reducing
          binary size matters. In data-intensive code, generics are almost
          always the right choice.
        </p>
      </NoteBlock>

      <h2>Real-World Pattern: Strategy with Trait Objects</h2>

      <PythonRustCompare
        title="Strategy pattern"
        description="A common pattern in both languages: swap behavior at runtime."
        pythonCode={`from typing import Protocol

class Tokenizer(Protocol):
    def tokenize(self, text: str) -> list[str]: ...

class WhitespaceTokenizer:
    def tokenize(self, text: str) -> list[str]:
        return text.split()

class CharTokenizer:
    def tokenize(self, text: str) -> list[str]:
        return list(text)

class Pipeline:
    def __init__(self, tokenizer: Tokenizer):
        self.tokenizer = tokenizer

    def run(self, text: str) -> list[str]:
        return self.tokenizer.tokenize(text)

pipe = Pipeline(WhitespaceTokenizer())
print(pipe.run("hello world"))  # ['hello', 'world']`}
        rustCode={`trait Tokenizer {
    fn tokenize(&self, text: &str) -> Vec<String>;
}

struct WhitespaceTokenizer;
struct CharTokenizer;

impl Tokenizer for WhitespaceTokenizer {
    fn tokenize(&self, text: &str) -> Vec<String> {
        text.split_whitespace().map(String::from).collect()
    }
}

impl Tokenizer for CharTokenizer {
    fn tokenize(&self, text: &str) -> Vec<String> {
        text.chars().map(|c| c.to_string()).collect()
    }
}

struct Pipeline {
    tokenizer: Box<dyn Tokenizer>,  // swappable at runtime
}

impl Pipeline {
    fn new(tokenizer: Box<dyn Tokenizer>) -> Self {
        Pipeline { tokenizer }
    }

    fn run(&self, text: &str) -> Vec<String> {
        self.tokenizer.tokenize(text)
    }
}

fn main() {
    let pipe = Pipeline::new(Box::new(WhitespaceTokenizer));
    println!("{:?}", pipe.run("hello world"));
    // ["hello", "world"]
}`}
      />

      <ExerciseBlock
        title="Plugin system with trait objects"
        difficulty="medium"
        problem={`Create a trait Plugin with a method name(&self) -> &str and
execute(&self, input: &str) -> String.

Implement three plugins:
1. UpperPlugin — converts to uppercase
2. ReversePlugin — reverses the string
3. CountPlugin — returns the character count as a string

Create a PluginRunner struct that holds a Vec<Box<dyn Plugin>>.
Add a method run_all(&self, input: &str) that runs each plugin
and prints "PluginName: result" for each.`}
        solution={`trait Plugin {
    fn name(&self) -> &str;
    fn execute(&self, input: &str) -> String;
}

struct UpperPlugin;
impl Plugin for UpperPlugin {
    fn name(&self) -> &str { "Upper" }
    fn execute(&self, input: &str) -> String { input.to_uppercase() }
}

struct ReversePlugin;
impl Plugin for ReversePlugin {
    fn name(&self) -> &str { "Reverse" }
    fn execute(&self, input: &str) -> String {
        input.chars().rev().collect()
    }
}

struct CountPlugin;
impl Plugin for CountPlugin {
    fn name(&self) -> &str { "Count" }
    fn execute(&self, input: &str) -> String {
        format!("{} chars", input.len())
    }
}

struct PluginRunner {
    plugins: Vec<Box<dyn Plugin>>,
}

impl PluginRunner {
    fn new() -> Self {
        PluginRunner { plugins: Vec::new() }
    }

    fn add(&mut self, plugin: Box<dyn Plugin>) {
        self.plugins.push(plugin);
    }

    fn run_all(&self, input: &str) {
        for p in &self.plugins {
            println!("{}: {}", p.name(), p.execute(input));
        }
    }
}

fn main() {
    let mut runner = PluginRunner::new();
    runner.add(Box::new(UpperPlugin));
    runner.add(Box::new(ReversePlugin));
    runner.add(Box::new(CountPlugin));
    runner.run_all("Hello Rust");
    // Upper: HELLO RUST
    // Reverse: tsuR olleH
    // Count: 10 chars
}`}
      />
    </div>
  );
}
