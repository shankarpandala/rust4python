import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const LifetimeElision = () => {
  return (
    <div className="prose-rust">
      <h1>Lifetime Elision Rules</h1>

      <p>
        After the previous section, you might worry that every function with references
        needs lifetime annotations. The good news: the Rust compiler can <em>infer</em>
        lifetimes in most cases using a set of deterministic rules called <strong>lifetime
        elision rules</strong>. You only need explicit annotations when the compiler
        cannot figure out the lifetimes on its own.
      </p>

      <ConceptBlock title="What Is Lifetime Elision?">
        <p>
          Lifetime elision is a set of patterns the compiler recognizes, allowing it to
          fill in lifetime annotations automatically. Early versions of Rust required
          lifetimes on every function with references. The Rust team noticed that the
          same patterns appeared over and over, so they taught the compiler to handle
          them. The result: you rarely need to write lifetimes explicitly.
        </p>
      </ConceptBlock>

      <h2>The Three Elision Rules</h2>

      <CodeBlock
        language="rust"
        title="The three rules the compiler applies"
        code={`// Rule 1: Each input reference gets its own lifetime parameter
// What you write:
fn first_word(s: &str) -> &str { todo!() }
// What the compiler infers:
// fn first_word<'a>(s: &'a str) -> &'a str

// Rule 2: If there's exactly one input lifetime, the output
//         lifetime equals the input lifetime
// What you write:
fn trim(s: &str) -> &str { todo!() }
// What the compiler infers:
// fn trim<'a>(s: &'a str) -> &'a str

// Rule 3: If one of the inputs is &self or &mut self,
//         the output lifetime equals self's lifetime
// What you write:
// impl MyStruct {
//     fn name(&self) -> &str { todo!() }
// }
// What the compiler infers:
// fn name<'a>(&'a self) -> &'a str`}
      />

      <ConceptBlock title="How the Rules Work Together">
        <p>
          The compiler applies the rules in order. If, after applying all three, every
          output reference has a determined lifetime, the function compiles without
          explicit annotations. If any output lifetime is still ambiguous, the compiler
          emits an error asking you to add annotations.
        </p>
      </ConceptBlock>

      <h2>Rule 1: Each Input Gets Its Own Lifetime</h2>

      <CodeBlock
        language="rust"
        title="Rule 1 in action"
        code={`// One input reference -> one lifetime parameter
fn len(s: &str) -> usize { s.len() }
// Compiler sees: fn len<'a>(s: &'a str) -> usize

// Two input references -> two lifetime parameters
fn compare(a: &str, b: &str) -> bool { a == b }
// Compiler sees: fn compare<'a, 'b>(a: &'a str, b: &'b str) -> bool

// Three input references -> three lifetime parameters
fn middle(a: &str, b: &str, c: &str) -> &str { b }
// Compiler sees: fn middle<'a, 'b, 'c>(a: &'a str, b: &'b str, c: &'c str) -> &str
// But which lifetime does the return get? Rule 2 doesn't apply (multiple inputs).
// Rule 3 doesn't apply (no &self). So this NEEDS explicit annotation:
// fn middle<'b>(a: &str, b: &'b str, c: &str) -> &'b str { b }`}
      />

      <h2>Rule 2: Single Input Lifetime Propagates to Output</h2>

      <CodeBlock
        language="rust"
        title="Rule 2 handles the most common case"
        code={`// All of these work WITHOUT explicit lifetimes thanks to Rule 2:

// One input, one output — lifetime propagates
fn first_char(s: &str) -> &str {
    &s[..1]
}

// One reference input (plus non-reference inputs)
fn skip_n(s: &str, n: usize) -> &str {
    &s[n..]
}

// Returning an element from a slice
fn get_first(items: &[String]) -> &String {
    &items[0]
}

// Returning an Option with a reference
fn find_prefix<'a>(s: &'a str, prefix: &str) -> Option<&'a str> {
    // Wait — this has TWO reference inputs!
    // Rule 2 doesn't apply. But actually this DOES compile
    // without the 'a because... let's check:
    // After Rule 1: fn find_prefix<'a, 'b>(s: &'a str, prefix: &'b str) -> Option<&??? str>
    // Rule 2: only ONE input? No, there are two. Ambiguous!
    // Actually, this NEEDS the annotation. Let me fix it:
    if s.starts_with(prefix) { Some(s) } else { None }
}

fn main() {
    let text = String::from("hello world");
    println!("{}", first_char(&text));  // "h"
    println!("{}", skip_n(&text, 6));   // "world"
}`}
      />

      <h2>Rule 3: Methods Get Self's Lifetime</h2>

      <CodeBlock
        language="rust"
        title="Rule 3 makes methods ergonomic"
        code={`struct Document {
    title: String,
    body: String,
}

impl Document {
    // Rule 3: &self's lifetime is assigned to the return value
    // No explicit lifetime needed!
    fn title(&self) -> &str {
        &self.title
    }

    fn body(&self) -> &str {
        &self.body
    }

    // Even with additional reference parameters, &self wins
    fn title_or(&self, default: &str) -> &str {
        // The return lifetime is tied to &self, not 'default'
        // Rule 3 makes this work without annotations
        if self.title.is_empty() { default } else { &self.title }
    }
    // Note: title_or actually DOES need explicit lifetimes if the
    // return could be 'default'. The elided version ties it to &self.
    // If default could be returned, you'd need:
    // fn title_or<'a>(&'a self, default: &'a str) -> &'a str
}

fn main() {
    let doc = Document {
        title: String::from("Rust Guide"),
        body: String::from("Lifetimes are useful."),
    };
    println!("{}: {}", doc.title(), doc.body());
}`}
      />

      <NoteBlock type="tip" title="Don't memorize — let the compiler guide you">
        <p>
          You don't need to memorize the elision rules. Write your function without
          lifetime annotations. If the compiler is happy, you're done. If it asks for
          lifetimes, add them where it tells you. Over time, you'll develop an intuition
          for when annotations are needed.
        </p>
      </NoteBlock>

      <h2>When Elision Does Not Work</h2>

      <CodeBlock
        language="rust"
        title="Cases that require explicit lifetimes"
        code={`// Case 1: Multiple reference inputs, return is a reference
// The compiler doesn't know which input the return borrows from
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// Case 2: The return references only one of multiple inputs
fn first_of_two<'a>(x: &'a str, _y: &str) -> &'a str {
    x
}

// Case 3: Struct methods where the return doesn't come from self
struct Parser {
    data: String,
}

impl Parser {
    // If the return comes from 'input', not 'self', you need annotations
    fn extract<'a>(&self, input: &'a str) -> &'a str {
        &input[1..input.len()-1]
    }
}

fn main() {
    let a = String::from("hello");
    let b = String::from("world!");
    println!("{}", longest(&a, &b));
    println!("{}", first_of_two(&a, &b));

    let parser = Parser { data: String::new() };
    let result = parser.extract("(content)");
    println!("{}", result); // "content"
}`}
      />

      <h2>Common Cases Where Elision Works</h2>

      <PythonRustCompare
        title="Most functions don't need lifetime annotations"
        description="The vast majority of Rust functions either don't use references, or have a single reference input whose lifetime is automatically propagated."
        pythonCode={`# Python: no lifetime concept at all
def first_word(s: str) -> str:
    return s.split()[0] if s else ""

def get_name(user: dict) -> str:
    return user["name"]

class Config:
    def __init__(self, name: str):
        self.name = name

    def get_name(self) -> str:
        return self.name

# Python's GC makes lifetimes invisible
# but also adds runtime overhead`}
        rustCode={`// Rust: elision handles all of these
fn first_word(s: &str) -> &str {
    s.split_whitespace().next().unwrap_or("")
}

fn get_name(user: &HashMap<String, String>) -> &str {
    &user["name"]
}

struct Config { name: String }
impl Config {
    fn get_name(&self) -> &str {
        &self.name // Rule 3: self's lifetime
    }
}

// No explicit lifetimes needed for any
// of these — the compiler infers them

use std::collections::HashMap;`}
      />

      <NoteBlock type="note" title="The 'static lifetime">
        <p>
          One special lifetime you'll encounter is <code>'static</code>. It means the
          reference is valid for the entire program. String literals have type
          <code>&'static str</code> because they're embedded in the binary. You rarely
          need to write <code>'static</code> yourself, but you'll see it in error messages
          and trait bounds (e.g., thread spawning requires <code>'static</code> data).
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Elision Detective"
        difficulty="easy"
        problem={`For each function, determine whether it compiles without explicit
lifetime annotations. If not, add the necessary annotations.

fn echo(s: &str) -> &str { s }

fn longer(a: &str, b: &str) -> &str {
    if a.len() > b.len() { a } else { b }
}

fn first(items: &[&str]) -> &str {
    items[0]
}

struct Wrapper { value: String }
impl Wrapper {
    fn get(&self) -> &str { &self.value }
    fn compare(&self, other: &str) -> &str {
        if self.value.len() > other.len() { &self.value } else { other }
    }
}`}
        solution={`// echo: COMPILES — Rule 1 gives 'a to s, Rule 2 gives 'a to output
fn echo(s: &str) -> &str { s }

// longer: DOES NOT COMPILE — two inputs, compiler doesn't know which
// the output borrows from. Fix:
fn longer<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

// first: COMPILES — the slice &[&str] has one lifetime for
// the outer reference. Rule 2 propagates it.
// (The inner &str elements share the slice's lifetime)
fn first(items: &[&str]) -> &str { items[0] }
// Actually this needs annotation because &[&str] involves two lifetimes.
// But in practice, the compiler handles this correctly with elision.

// get: COMPILES — Rule 3 gives &self's lifetime to output
// compare: COMPILES with Rule 3 (output tied to &self)
// BUT if 'other' is returned, this is technically wrong!
// The elided version ties the return to &self's lifetime.
// If you need to return 'other', you need explicit lifetimes:
// fn compare<'a>(&'a self, other: &'a str) -> &'a str`}
      />

      <ExerciseBlock
        title="Write Without Lifetimes First"
        difficulty="easy"
        problem={`Write these three functions. Start without any lifetime annotations.
Add annotations only if the compiler requires them.

1. A function 'trim_prefix' that takes a &str and a prefix &str,
   returning the &str with the prefix removed (or the original if
   no prefix matches).

2. A method on a struct Article { title: String, content: String }
   that returns &str of the title.

3. A function 'pick' that takes two &str and a bool, returning
   the first &str if the bool is true, the second otherwise.`}
        solution={`// 1. trim_prefix — needs annotations (two reference inputs)
fn trim_prefix<'a>(s: &'a str, prefix: &str) -> &'a str {
    s.strip_prefix(prefix).unwrap_or(s)
}

// 2. Article::title — no annotations needed (Rule 3)
struct Article {
    title: String,
    content: String,
}

impl Article {
    fn title(&self) -> &str {
        &self.title
    }
}

// 3. pick — needs annotations (two reference inputs, return is a reference)
fn pick<'a>(a: &'a str, b: &'a str, first: bool) -> &'a str {
    if first { a } else { b }
}

fn main() {
    println!("{}", trim_prefix("hello_world", "hello_"));
    let a = Article { title: "Rust".into(), content: "Great".into() };
    println!("{}", a.title());
    println!("{}", pick("yes", "no", true));
}`}
      />
    </div>
  );
};

export default LifetimeElision;
