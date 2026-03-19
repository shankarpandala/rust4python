import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ResultType() {
  return (
    <div className="prose-rust">
      <h1>Result&lt;T, E&gt; — Errors as Values</h1>

      <p>
        Python uses exceptions for error handling: you <code>raise</code> an
        error and hope someone catches it. Rust takes a fundamentally different
        approach — errors are <strong>values</strong> returned from functions
        via the <code>Result&lt;T, E&gt;</code> type. The compiler ensures you
        handle them.
      </p>

      <ConceptBlock title="Result: Ok or Err">
        <p>
          <code>Result&lt;T, E&gt;</code> is an enum with two variants:
        </p>
        <ul>
          <li><code>Ok(value)</code> — the operation succeeded, here is the result</li>
          <li><code>Err(error)</code> — the operation failed, here is why</li>
        </ul>
        <p>
          Unlike exceptions, errors cannot silently propagate up the call
          stack. Every function that can fail declares it in its return type,
          and every caller must explicitly handle the error or propagate it.
        </p>
      </ConceptBlock>

      <h2>Python Exceptions vs Rust Result</h2>

      <PythonRustCompare
        title="Error handling philosophy"
        description="Python throws exceptions; Rust returns Result values. Both handle errors, but Rust's approach is explicit and checked at compile time."
        pythonCode={`import json

def parse_config(text: str) -> dict:
    # Can raise json.JSONDecodeError
    data = json.loads(text)
    # Can raise KeyError
    port = data["port"]
    # Can raise TypeError/ValueError
    return {"port": int(port)}

# Caller must remember to catch — nothing enforces it
try:
    config = parse_config('{"port": "8080"}')
    print(config)
except (json.JSONDecodeError, KeyError, ValueError) as e:
    print(f"Error: {e}")

# Easy to forget — this crashes on bad input:
# config = parse_config("not json")`}
        rustCode={`use std::num::ParseIntError;

#[derive(Debug)]
enum ConfigError {
    InvalidJson(String),
    MissingField(String),
    BadPort(ParseIntError),
}

fn parse_port(text: &str) -> Result<u16, ConfigError> {
    // Each step returns Result — errors are explicit
    let port_str = text.strip_prefix("port=")
        .ok_or(ConfigError::MissingField("port".into()))?;

    let port: u16 = port_str.parse()
        .map_err(ConfigError::BadPort)?;

    Ok(port)
}

fn main() {
    match parse_port("port=8080") {
        Ok(port) => println!("Port: {}", port),
        Err(e) => println!("Error: {:?}", e),
    }
}`}
      />

      <NoteBlock title="No hidden control flow" type="pythonista">
        <p>
          In Python, any function call might raise any exception — you need
          to read the docs (or source) to know. In Rust, a function returning
          <code>String</code> cannot fail. If it can fail, it returns
          <code>Result&lt;String, SomeError&gt;</code>. The type signature
          is the documentation.
        </p>
      </NoteBlock>

      <h2>Common Result Methods</h2>

      <CodeBlock
        language="rust"
        title="Working with Result values"
        code={`fn main() {
    let good: Result<i32, String> = Ok(42);
    let bad: Result<i32, String> = Err("oops".into());

    // unwrap_or: provide a default on error
    println!("{}", good.unwrap_or(0));  // 42
    println!("{}", bad.unwrap_or(0));   // 0

    // map: transform the success value
    let doubled = good.map(|n| n * 2);  // Ok(84)

    // map_err: transform the error value
    let new_err = bad.map_err(|e| format!("Failed: {}", e));

    // and_then: chain fallible operations
    let parsed: Result<i32, String> = Ok("42".to_string())
        .and_then(|s| s.parse::<i32>().map_err(|e| e.to_string()));

    // is_ok / is_err
    assert!(good.is_ok());
    assert!(bad.is_err());

    // unwrap_or_else: lazy default
    let val = bad.unwrap_or_else(|e| {
        eprintln!("Warning: {}", e);
        -1
    });
    println!("{}", val);  // -1
}`}
      />

      <h2>The ? Operator — Propagating Errors</h2>

      <PythonRustCompare
        title="Error propagation"
        description="Python exceptions auto-propagate. Rust uses the ? operator to explicitly propagate Result errors up the call stack."
        pythonCode={`def read_number(path: str) -> int:
    # Exceptions auto-propagate — if open() fails,
    # the exception bubbles up automatically
    with open(path) as f:
        text = f.read().strip()
    return int(text)

def double_from_file(path: str) -> int:
    # No explicit error handling needed —
    # exceptions just fly upward
    return read_number(path) * 2`}
        rustCode={`use std::fs;
use std::num::ParseIntError;
use std::io;

#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(ParseIntError),
}

impl From<io::Error> for AppError {
    fn from(e: io::Error) -> Self { AppError::Io(e) }
}

impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self { AppError::Parse(e) }
}

fn read_number(path: &str) -> Result<i64, AppError> {
    let text = fs::read_to_string(path)?;  // ? propagates
    let num = text.trim().parse::<i64>()?;  // ? converts & propagates
    Ok(num)
}

fn double_from_file(path: &str) -> Result<i64, AppError> {
    let n = read_number(path)?;  // ? propagates errors
    Ok(n * 2)
}`}
      />

      <NoteBlock title="What ? actually does" type="note">
        <p>
          The <code>?</code> operator on a <code>Result</code>: if the value is
          <code>Ok(v)</code>, it unwraps to <code>v</code> and continues. If it
          is <code>Err(e)</code>, it converts the error (via <code>From</code>)
          and returns early from the function. It is syntactic sugar for a
          match statement, not magic — you can always see where errors are
          propagated.
        </p>
      </NoteBlock>

      <h2>Converting Between Option and Result</h2>

      <CodeBlock
        language="rust"
        title="Option ↔ Result conversions"
        code={`fn find_and_parse(data: &[(&str, &str)], key: &str) -> Result<i32, String> {
    // ok_or: convert Option to Result
    let (_, value) = data.iter()
        .find(|(k, _)| *k == key)
        .ok_or(format!("Key '{}' not found", key))?;

    // map_err: convert one error type to another
    let parsed: i32 = value.parse()
        .map_err(|e| format!("Parse error for '{}': {}", key, e))?;

    Ok(parsed)
}

fn main() {
    let data = vec![("port", "8080"), ("workers", "4")];

    println!("{:?}", find_and_parse(&data, "port"));     // Ok(8080)
    println!("{:?}", find_and_parse(&data, "missing"));  // Err("Key 'missing' not found")
}

// Going the other way:
// result.ok()  -> Option<T>  (discards the error)
// result.err() -> Option<E>  (discards the success)`}
      />

      <NoteBlock title="Result in the standard library" type="tip">
        <p>
          Many standard library functions return <code>Result</code>: file I/O,
          parsing, networking, thread spawning. When you see
          <code>Result</code> in a function signature, that is the author
          telling you "this can fail, and here is how." Learn to read and
          follow the Result chain — it is one of the most important Rust
          skills.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Parse a CSV-like row"
        difficulty="medium"
        problem={`Write a function parse_row(line: &str) -> Result<(String, u32, f64), String>
that parses a comma-separated line like "Alice,30,95.5" into a tuple of
(name, age, score). Return descriptive error messages for:
- Wrong number of fields
- Age not parseable as u32
- Score not parseable as f64
Use the ? operator with map_err for clean error propagation.`}
        solution={`fn parse_row(line: &str) -> Result<(String, u32, f64), String> {
    let fields: Vec<&str> = line.split(',').collect();

    if fields.len() != 3 {
        return Err(format!(
            "Expected 3 fields, got {}", fields.len()
        ));
    }

    let name = fields[0].to_string();

    let age: u32 = fields[1].parse()
        .map_err(|e| format!("Invalid age '{}': {}", fields[1], e))?;

    let score: f64 = fields[2].parse()
        .map_err(|e| format!("Invalid score '{}': {}", fields[2], e))?;

    Ok((name, age, score))
}

fn main() {
    println!("{:?}", parse_row("Alice,30,95.5"));
    // Ok(("Alice", 30, 95.5))

    println!("{:?}", parse_row("Bob,xyz,80.0"));
    // Err("Invalid age 'xyz': ...")

    println!("{:?}", parse_row("too,few"));
    // Err("Expected 3 fields, got 2")
}`}
      />
    </div>
  );
}
