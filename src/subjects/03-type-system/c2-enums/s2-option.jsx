import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function OptionType() {
  return (
    <div className="prose-rust">
      <h1>Option&lt;T&gt; — Rust's Replacement for None</h1>

      <p>
        Python uses <code>None</code> as a universal "no value" sentinel. Any
        variable can be <code>None</code> at any time, and nothing in the
        language forces you to check. This is a constant source of
        <code>AttributeError: 'NoneType' has no attribute ...</code> crashes.
        Rust eliminates this entire class of bugs with <code>Option&lt;T&gt;</code>.
      </p>

      <ConceptBlock title="There Is No Null in Rust">
        <p>
          Rust has no <code>null</code>, no <code>None</code> value that silently
          inhabits every type. Instead, the <strong>absence of a value</strong> is
          explicitly represented by the <code>Option&lt;T&gt;</code> enum:
        </p>
        <ul>
          <li><code>Some(value)</code> — a value is present</li>
          <li><code>None</code> — no value</li>
        </ul>
        <p>
          The compiler forces you to handle both cases before you can access
          the inner value. You literally cannot forget to check for None.
        </p>
      </ConceptBlock>

      <h2>Python None vs Rust Option</h2>

      <PythonRustCompare
        title="Optional values"
        description="Python lets None slip through unchecked. Rust's Option forces explicit handling."
        pythonCode={`def find_user(user_id: int) -> dict | None:
    db = {1: {"name": "Alice"}, 2: {"name": "Bob"}}
    return db.get(user_id)

user = find_user(99)
# Oops — this crashes at runtime!
# TypeError: 'NoneType' object is not subscriptable
print(user["name"])

# You SHOULD check, but nothing forces you:
if user is not None:
    print(user["name"])`}
        rustCode={`fn find_user(user_id: u32) -> Option<String> {
    match user_id {
        1 => Some("Alice".to_string()),
        2 => Some("Bob".to_string()),
        _ => None,
    }
}

fn main() {
    let user = find_user(99);

    // This won't compile — Option is not a String!
    // println!("{}", user);  // ERROR

    // You MUST handle both cases:
    match user {
        Some(name) => println!("{}", name),
        None => println!("User not found"),
    }
}`}
      />

      <NoteBlock title="The billion-dollar mistake, fixed" type="pythonista">
        <p>
          Tony Hoare called inventing null references his "billion-dollar
          mistake." Python inherited this mistake — any variable can be
          <code>None</code>. Rust's <code>Option</code> makes absence explicit
          in the type system. If a function returns <code>String</code>, it
          always returns a string. If it might not, it returns
          <code>Option&lt;String&gt;</code> — and the caller must deal with it.
        </p>
      </NoteBlock>

      <h2>Common Option Methods</h2>

      <CodeBlock
        language="rust"
        title="Working with Option values"
        code={`fn main() {
    let some_number: Option<i32> = Some(42);
    let no_number: Option<i32> = None;

    // unwrap_or: provide a default
    println!("{}", some_number.unwrap_or(0));  // 42
    println!("{}", no_number.unwrap_or(0));    // 0

    // map: transform the inner value (if present)
    let doubled = some_number.map(|n| n * 2);  // Some(84)
    let doubled_none = no_number.map(|n| n * 2);  // None

    // and_then (flatmap): chain operations that return Option
    let parsed: Option<i32> = Some("42")
        .and_then(|s| s.parse().ok());  // Some(42)

    // is_some / is_none: boolean checks
    assert!(some_number.is_some());
    assert!(no_number.is_none());

    // unwrap_or_else: default with a closure (lazy)
    let val = no_number.unwrap_or_else(|| {
        println!("Computing default...");
        99
    });
    println!("{}", val);  // 99
}`}
      />

      <PythonRustCompare
        title="Chaining optional operations"
        description="Python uses 'and' / 'or' / ternary; Rust uses map/and_then combinators."
        pythonCode={`from typing import Optional

def get_config(key: str) -> Optional[str]:
    config = {"port": "8080"}
    return config.get(key)

def parse_port(s: str) -> Optional[int]:
    try:
        return int(s)
    except ValueError:
        return None

# Manual chaining in Python
raw = get_config("port")
port = parse_port(raw) if raw is not None else None
final_port = port if port is not None else 3000
print(final_port)  # 8080`}
        rustCode={`use std::collections::HashMap;

fn get_config(key: &str) -> Option<String> {
    let config = HashMap::from([("port", "8080")]);
    config.get(key).map(|s| s.to_string())
}

fn main() {
    // Elegant chaining with combinators
    let port: u16 = get_config("port")
        .and_then(|s| s.parse().ok())
        .unwrap_or(3000);

    println!("{}", port);  // 8080
}`}
      />

      <h2>if let and while let</h2>

      <CodeBlock
        language="rust"
        title="Pattern matching shortcuts for Option"
        code={`fn main() {
    let names = vec!["Alice", "Bob", "Charlie"];

    // if let — handle only the Some case
    if let Some(first) = names.first() {
        println!("First name: {}", first);
    }

    // while let — loop while values are Some
    let mut stack = vec![1, 2, 3];
    while let Some(top) = stack.pop() {
        println!("Popped: {}", top);
    }
    // Prints: 3, 2, 1

    // let-else (Rust 1.65+) — unwrap or diverge
    let input = Some("42");
    let Some(value) = input else {
        println!("No value provided");
        return;
    };
    println!("Got: {}", value);
}`}
      />

      <NoteBlock title="When to use unwrap()" type="warning">
        <p>
          Calling <code>.unwrap()</code> on <code>None</code> panics (crashes).
          Only use it when you are <em>certain</em> the value is
          <code>Some</code> — for example, in tests or after a guard check.
          In production code, prefer <code>unwrap_or</code>,
          <code>unwrap_or_else</code>, <code>match</code>, or the
          <code>?</code> operator.
        </p>
      </NoteBlock>

      <h2>Option in Struct Fields</h2>

      <CodeBlock
        language="rust"
        title="Optional fields in structs"
        code={`struct UserProfile {
    username: String,
    email: String,
    bio: Option<String>,        // user may not have a bio
    age: Option<u32>,           // age is optional
}

impl UserProfile {
    fn display_bio(&self) -> &str {
        // as_deref() converts Option<String> to Option<&str>
        self.bio.as_deref().unwrap_or("No bio provided")
    }

    fn is_adult(&self) -> Option<bool> {
        // map preserves the Option wrapper
        self.age.map(|a| a >= 18)
    }
}

fn main() {
    let user = UserProfile {
        username: "alice".into(),
        email: "alice@example.com".into(),
        bio: None,
        age: Some(25),
    };

    println!("Bio: {}", user.display_bio());     // No bio provided
    println!("Adult? {:?}", user.is_adult());     // Some(true)
}`}
      />

      <NoteBlock title="Option vs default values" type="tip">
        <p>
          In Python, you might use a default parameter or empty string for
          optional data. In Rust, <code>Option</code> makes the semantics
          crystal clear: <code>None</code> means "not provided," while an
          empty <code>String</code> means "provided but empty." This
          distinction prevents subtle bugs in data processing.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Safe division with Option"
        difficulty="easy"
        problem={`Write a function safe_div(a: f64, b: f64) -> Option<f64> that returns
None for division by zero, and Some(result) otherwise.

Then write a function chain_div that takes a starting value and a Vec<f64>
of divisors, and returns the result of dividing by each in sequence. If any
division is by zero, the whole chain returns None. Use and_then for chaining.`}
        solution={`fn safe_div(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 {
        None
    } else {
        Some(a / b)
    }
}

fn chain_div(start: f64, divisors: &[f64]) -> Option<f64> {
    let mut result = Some(start);
    for &d in divisors {
        result = result.and_then(|val| safe_div(val, d));
    }
    result
}

fn main() {
    println!("{:?}", chain_div(100.0, &[2.0, 5.0]));    // Some(10.0)
    println!("{:?}", chain_div(100.0, &[2.0, 0.0, 5.0])); // None
}`}
      />
    </div>
  );
}
