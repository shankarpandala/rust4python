import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ResultOptionInDepth() {
  return (
    <div className="prose-rust">
      <h1>Result &amp; Option in Depth</h1>

      <p>
        You have already met <code>Option&lt;T&gt;</code> and
        <code>Result&lt;T, E&gt;</code>. This section dives deeper into the
        combinator methods that make them powerful — letting you chain
        operations, transform values, and handle errors with the same
        elegance as Python's list comprehensions.
      </p>

      <ConceptBlock title="Combinators: The Functional Toolkit">
        <p>
          Both <code>Option</code> and <code>Result</code> provide a rich set
          of combinator methods — <code>map</code>, <code>and_then</code>,
          <code>or_else</code>, <code>filter</code>, <code>zip</code>, and
          more. These replace the imperative if/else chains you would write
          in Python with concise, composable pipelines.
        </p>
      </ConceptBlock>

      <h2>Option Combinators</h2>

      <PythonRustCompare
        title="Transforming optional values"
        description="Python uses if/else or ternary operators. Rust uses combinator chains."
        pythonCode={`from typing import Optional

def get_username(id: int) -> Optional[str]:
    users = {1: "alice", 2: "bob"}
    return users.get(id)

def format_greeting(id: int) -> str:
    name = get_username(id)
    if name is not None:
        upper = name.upper()
        greeting = f"Hello, {upper}!"
    else:
        greeting = "Hello, stranger!"
    return greeting

print(format_greeting(1))   # Hello, ALICE!
print(format_greeting(99))  # Hello, stranger!`}
        rustCode={`use std::collections::HashMap;

fn get_username(id: u32) -> Option<String> {
    let users = HashMap::from([(1, "alice"), (2, "bob")]);
    users.get(&id).map(|s| s.to_string())
}

fn format_greeting(id: u32) -> String {
    get_username(id)
        .map(|name| name.to_uppercase())
        .map(|upper| format!("Hello, {}!", upper))
        .unwrap_or_else(|| "Hello, stranger!".to_string())
}

fn main() {
    println!("{}", format_greeting(1));   // Hello, ALICE!
    println!("{}", format_greeting(99));  // Hello, stranger!
}`}
      />

      <CodeBlock
        language="rust"
        title="Option combinator reference"
        code={`fn main() {
    let some_val: Option<i32> = Some(10);
    let none_val: Option<i32> = None;

    // map: transform inner value
    assert_eq!(some_val.map(|x| x * 2), Some(20));
    assert_eq!(none_val.map(|x| x * 2), None);

    // and_then (flatmap): chain fallible operations
    assert_eq!(some_val.and_then(|x| if x > 5 { Some(x) } else { None }), Some(10));
    assert_eq!(some_val.and_then(|x| if x > 50 { Some(x) } else { None }), None);

    // filter: keep value only if predicate matches
    assert_eq!(some_val.filter(|&x| x > 5), Some(10));
    assert_eq!(some_val.filter(|&x| x > 50), None);

    // or / or_else: fallback to another Option
    assert_eq!(none_val.or(Some(42)), Some(42));
    assert_eq!(some_val.or(Some(42)), Some(10));

    // zip: combine two Options into a tuple
    let a = Some("hello");
    let b = Some(42);
    assert_eq!(a.zip(b), Some(("hello", 42)));

    // flatten: Option<Option<T>> -> Option<T>
    let nested: Option<Option<i32>> = Some(Some(42));
    assert_eq!(nested.flatten(), Some(42));
}`}
      />

      <h2>Result Combinators</h2>

      <CodeBlock
        language="rust"
        title="Result combinator reference"
        code={`fn parse_positive(s: &str) -> Result<u32, String> {
    let n: i32 = s.parse()
        .map_err(|e| format!("Parse error: {}", e))?;

    if n > 0 {
        Ok(n as u32)
    } else {
        Err(format!("Expected positive, got {}", n))
    }
}

fn main() {
    let ok: Result<i32, String> = Ok(10);
    let err: Result<i32, String> = Err("bad".into());

    // map / map_err: transform success or error value
    assert_eq!(ok.map(|x| x * 2), Ok(20));
    assert_eq!(err.map_err(|e| format!("Error: {}", e)),
               Err("Error: bad".to_string()));

    // and_then: chain operations that can fail
    let result = Ok("42".to_string())
        .and_then(|s| s.parse::<i32>().map_err(|e| e.to_string()))
        .and_then(|n| if n > 0 { Ok(n) } else { Err("negative".into()) });
    assert_eq!(result, Ok(42));

    // or_else: try a fallback on error
    let recovered = err.or_else(|_| Ok(0));
    assert_eq!(recovered, Ok(0));

    // unwrap_or / unwrap_or_else / unwrap_or_default
    assert_eq!(ok.unwrap_or(0), 10);
    assert_eq!(err.unwrap_or(0), 0);

    // Converting: ok() and err()
    let opt: Option<i32> = ok.ok();       // Some(10)
    let opt_err: Option<String> = err.err(); // Some("bad")
}`}
      />

      <NoteBlock title="Think in pipelines" type="pythonista">
        <p>
          If you are comfortable with Polars or pandas method chaining
          (<code>df.filter(...).select(...).head()</code>), you already think
          in pipelines. Option and Result combinators are the same idea:
          transform, filter, and recover in a chain without nested if/else
          blocks.
        </p>
      </NoteBlock>

      <h2>Real-World Pipeline: Parsing Config</h2>

      <CodeBlock
        language="rust"
        title="Chaining Option and Result in practice"
        code={`use std::collections::HashMap;

fn load_config() -> HashMap<String, String> {
    HashMap::from([
        ("port".into(), "8080".into()),
        ("host".into(), "localhost".into()),
        ("workers".into(), "not_a_number".into()),
    ])
}

fn get_port(config: &HashMap<String, String>) -> Result<u16, String> {
    config
        .get("port")                              // Option<&String>
        .ok_or("Missing 'port' key".to_string())   // Result<&String, String>
        .and_then(|s| {
            s.parse::<u16>()
                .map_err(|e| format!("Invalid port: {}", e))
        })
}

fn get_workers(config: &HashMap<String, String>) -> u32 {
    config
        .get("workers")
        .and_then(|s| s.parse::<u32>().ok())  // silently returns None on parse failure
        .unwrap_or(4)                          // default to 4 workers
}

fn main() {
    let config = load_config();

    match get_port(&config) {
        Ok(port) => println!("Port: {}", port),
        Err(e) => println!("Error: {}", e),
    }

    println!("Workers: {}", get_workers(&config));  // 4 (parse failed, used default)
}`}
      />

      <NoteBlock title="ok_or: the bridge between Option and Result" type="tip">
        <p>
          <code>.ok_or(err)</code> converts <code>Option&lt;T&gt;</code> to
          <code>Result&lt;T, E&gt;</code>. Use it when a missing value is an
          error. Use <code>.ok_or_else(|| ...)</code> for lazy error
          construction. Going the other way, <code>.ok()</code> converts
          <code>Result</code> to <code>Option</code> by discarding the error.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Data pipeline with combinators"
        difficulty="medium"
        problem={`Write a function process_scores(data: &str) -> Result<f64, String> that:
1. Splits the input by commas
2. Parses each value as f64 (return error if any parse fails)
3. Filters out scores below 0.0 or above 100.0
4. Returns the average of the valid scores
5. Returns an error if no valid scores remain

Use iterator combinators and Result methods — no if/else or match.
Test with: "85.5,92.0,abc,101,-5,78.3"`}
        solution={`fn process_scores(data: &str) -> Result<f64, String> {
    let scores: Result<Vec<f64>, String> = data
        .split(',')
        .map(|s| {
            s.trim()
                .parse::<f64>()
                .map_err(|e| format!("Cannot parse '{}': {}", s, e))
        })
        .collect();

    let valid: Vec<f64> = scores?
        .into_iter()
        .filter(|&s| (0.0..=100.0).contains(&s))
        .collect();

    let count = valid.len();
    let sum: f64 = valid.into_iter().sum();

    (count > 0)
        .then(|| sum / count as f64)
        .ok_or("No valid scores".to_string())
}

fn main() {
    // With a parse error:
    println!("{:?}", process_scores("85.5,92.0,abc,78.3"));
    // Err("Cannot parse 'abc': ...")

    // All valid:
    println!("{:?}", process_scores("85.5,92.0,78.3"));
    // Ok(85.266...)

    // With out-of-range values:
    println!("{:?}", process_scores("85.5,101,-5,78.3"));
    // Ok(81.9)
}`}
      />
    </div>
  );
}
