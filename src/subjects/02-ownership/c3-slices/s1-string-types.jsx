import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const StringTypes = () => {
  return (
    <div className="prose-rust">
      <h1>String vs &str</h1>

      <p>
        One of the first things that trips up Python developers in Rust is that
        there are <em>two</em> main string types: <code>String</code> and
        <code> &str</code>. In Python, there is just <code>str</code>. Understanding
        the difference is essential because you'll use strings constantly, and choosing
        the wrong type leads to confusing compiler errors.
      </p>

      <ConceptBlock title="Two String Types, Two Purposes">
        <ul>
          <li>
            <strong>String</strong> — An owned, heap-allocated, growable string.
            You can modify it, append to it, and pass ownership around. Analogous to
            a Python <code>str</code> that you built with <code>f-strings</code> or
            concatenation.
          </li>
          <li>
            <strong>&str</strong> (string slice) — A borrowed, read-only view into
            string data. It doesn't own the data — it's a reference to bytes owned by
            something else (a <code>String</code>, a string literal, or a file).
          </li>
        </ul>
      </ConceptBlock>

      <PythonRustCompare
        title="String types comparison"
        description="Python has one string type. Rust splits the concept into owned (String) and borrowed (&str)."
        pythonCode={`# Python: just one string type
name = "Alice"        # str
greeting = f"Hi {name}"  # str
greeting += "!"       # creates a new str

# Python strings are:
# - Always heap-allocated
# - Always reference-counted
# - Immutable (concatenation creates new objects)
# - One type for everything

type(name)      # <class 'str'>
type(greeting)  # <class 'str'>`}
        rustCode={`fn main() {
    // &str: string literal (baked into binary)
    let name: &str = "Alice";

    // String: owned, heap-allocated
    let greeting: String = format!("Hi {}", name);

    // String is growable
    let mut msg = String::from("hello");
    msg.push_str(" world");

    // &str is a lightweight view
    let slice: &str = &msg[0..5]; // "hello"

    println!("{}", slice);
}`}
      />

      <h2>String: Owned and Growable</h2>

      <CodeBlock
        language="rust"
        title="Creating and modifying Strings"
        code={`fn main() {
    // Ways to create a String
    let s1 = String::from("hello");
    let s2 = "hello".to_string();
    let s3 = String::new();          // empty
    let s4 = format!("{}-{}", "hello", "world");

    // Strings are growable
    let mut s = String::from("hello");
    s.push(' ');           // push a single char
    s.push_str("world");  // push a string slice
    s += "!";              // += works too
    println!("{}", s);     // "hello world!"

    // String owns its data on the heap
    // When s goes out of scope, the heap memory is freed
    println!("Length: {}, Capacity: {}", s.len(), s.capacity());
}`}
      />

      <h2>&str: Borrowed String Slice</h2>

      <CodeBlock
        language="rust"
        title="String slices are lightweight views"
        code={`fn main() {
    let owned = String::from("hello world");

    // &str can be a slice of a String
    let hello: &str = &owned[0..5];
    let world: &str = &owned[6..11];
    println!("{} {}", hello, world);

    // String literals are &str — they point to data in the binary
    let literal: &str = "I live in the executable";

    // &str is just a pointer + length (16 bytes on 64-bit)
    // It does NOT own the data and does NOT allocate
    println!("{}", literal);

    // A &String automatically converts to &str
    let s = String::from("auto-conversion");
    let slice: &str = &s;  // Deref coercion: &String -> &str
    println!("{}", slice);
}`}
      />

      <h2>When to Use Which</h2>

      <ConceptBlock title="String vs &str: Decision Guide">
        <ul>
          <li>
            <strong>Use String when:</strong> you need to own the data, modify it,
            store it in a struct, return it from a function, or build it dynamically.
          </li>
          <li>
            <strong>Use &str when:</strong> you only need to read the data, especially
            in function parameters. This accepts both <code>String</code> (via
            <code>&my_string</code>) and string literals.
          </li>
        </ul>
      </ConceptBlock>

      <CodeBlock
        language="rust"
        title="Function parameters should usually take &str"
        code={`// GOOD: accepts both String and &str
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

// LESS FLEXIBLE: only accepts String (forces caller to allocate)
fn greet_owned(name: String) {
    println!("Hello, {}!", name);
}

fn main() {
    let owned = String::from("Alice");
    let literal = "Bob";

    // &str parameter works with everything
    greet(&owned);    // &String -> &str (automatic)
    greet(literal);   // &str -> &str (direct)

    // String parameter requires an owned String
    greet_owned(String::from("Carol")); // must create a String
    greet_owned(owned);                 // moves ownership!
    // greet_owned(literal.to_string()); // must convert
}`}
      />

      <NoteBlock type="tip" title="The golden rule: take &str, return String">
        <p>
          For function parameters, prefer <code>&str</code> (maximum flexibility for
          callers). For return types, prefer <code>String</code> (the caller gets ownership
          and can decide what to do with it). This pattern avoids lifetime complexity and
          works well in 90% of cases.
        </p>
      </NoteBlock>

      <h2>Converting Between String and &str</h2>

      <CodeBlock
        language="rust"
        title="Conversions between string types"
        code={`fn main() {
    // &str -> String
    let s1: String = "hello".to_string();
    let s2: String = String::from("hello");
    let s3: String = "hello".to_owned();
    // All three are equivalent. to_string() is most common.

    // String -> &str
    let owned = String::from("hello");
    let slice1: &str = &owned;          // Deref coercion
    let slice2: &str = owned.as_str();  // Explicit method
    let slice3: &str = &owned[..];      // Full-range slice

    // In practice, you rarely need explicit conversion.
    // Deref coercion handles &String -> &str automatically
    // when calling functions that take &str.
    fn print_it(s: &str) { println!("{}", s); }
    print_it(&owned);  // automatic conversion
}`}
      />

      <PythonRustCompare
        title="String operations comparison"
        description="Common string operations mapped between Python and Rust."
        pythonCode={`name = "alice"

# Common operations
upper = name.upper()
has_a = "a" in name
parts = "a,b,c".split(",")
joined = "-".join(parts)
trimmed = "  hello  ".strip()
starts = name.startswith("al")
length = len(name)`}
        rustCode={`fn main() {
    let name = "alice";

    // Same operations in Rust
    let upper = name.to_uppercase();
    let has_a = name.contains('a');
    let parts: Vec<&str> = "a,b,c".split(',').collect();
    let joined = parts.join("-");
    let trimmed = "  hello  ".trim();
    let starts = name.starts_with("al");
    let length = name.len(); // bytes, not chars!
    // For char count: name.chars().count()
}`}
      />

      <NoteBlock type="warning" title="len() counts bytes, not characters">
        <p>
          Rust strings are UTF-8 encoded. <code>.len()</code> returns the number of
          bytes, not characters. For ASCII strings this is the same, but for strings
          with multi-byte characters (emoji, CJK, accented letters), it differs.
          Use <code>.chars().count()</code> for the character count.
        </p>
      </NoteBlock>

      <h2>Strings in Structs</h2>

      <CodeBlock
        language="rust"
        title="Structs that hold string data"
        code={`// COMMON: struct owns its string data with String
struct User {
    name: String,    // owned — the struct controls the lifetime
    email: String,
}

// LESS COMMON: struct borrows string data with &str
// Requires a lifetime annotation (covered in lifetimes chapter)
struct UserRef<'a> {
    name: &'a str,   // borrowed — someone else owns the data
    email: &'a str,
}

fn main() {
    // Owned version: straightforward
    let user = User {
        name: String::from("Alice"),
        email: String::from("alice@example.com"),
    };

    // Borrowed version: data must outlive the struct
    let name = String::from("Bob");
    let email = String::from("bob@example.com");
    let user_ref = UserRef {
        name: &name,
        email: &email,
    };
    println!("{} <{}>", user_ref.name, user_ref.email);
}

// Guideline: Use String in structs unless you have a specific
// reason to use &str (e.g., zero-copy parsing).`}
      />

      <ExerciseBlock
        title="String Type Detective"
        difficulty="beginner"
        problem={`For each variable below, state whether its type is String or &str,
and explain why:

let a = "hello";
let b = String::from("hello");
let c = &b;
let d = &b[1..3];
let e = b.as_str();
let f = "hello".to_string();
let g = format!("hi {}", a);`}
        solution={`let a = "hello";              // &str — string literal
let b = String::from("hello"); // String — explicitly created
let c = &b;                   // &String — reference to a String
                              // (auto-converts to &str when needed)
let d = &b[1..3];            // &str — a slice of the String
let e = b.as_str();          // &str — explicit conversion
let f = "hello".to_string(); // String — converted from &str
let g = format!("hi {}", a); // String — format! always returns String

Key insight: string literals are &str (compiled into the binary),
format!/to_string/String::from create owned Strings on the heap.`}
      />

      <ExerciseBlock
        title="Fix the String Errors"
        difficulty="easy"
        problem={`Fix each function so it compiles:

// 1. This function should accept both String and &str
fn contains_hello(s: String) -> bool {
    s.contains("hello")
}

// 2. This function should build and return a greeting
fn make_greeting(name: &str) -> &str {
    let greeting = format!("Hello, {}!", name);
    &greeting
}

// 3. This struct should store a name
struct Config {
    name: &str,
}`}
        solution={`// 1. Take &str instead of String for flexibility
fn contains_hello(s: &str) -> bool {
    s.contains("hello")
}
// Now works with: contains_hello("hello world")
// And with: contains_hello(&my_string)

// 2. Return String instead of &str (you can't return a
// reference to a local variable — it would dangle)
fn make_greeting(name: &str) -> String {
    format!("Hello, {}!", name)
}

// 3. Either use String (simplest) or add a lifetime
struct Config {
    name: String,  // owns the data — no lifetime needed
}

// Or with lifetime (less common):
struct ConfigRef<'a> {
    name: &'a str,
}`}
      />
    </div>
  );
};

export default StringTypes;
