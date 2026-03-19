import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function UnwrapConsidered() {
  return (
    <div className="prose-rust">
      <h1>When panic Is OK</h1>

      <p>
        Rust newcomers often hear "never use <code>unwrap()</code>" and feel
        paralyzed. The truth is more nuanced: panicking is appropriate in
        specific situations. Understanding when to panic and when to return
        <code>Result</code> is a key Rust skill.
      </p>

      <ConceptBlock title="Panic vs Result">
        <p>
          A <strong>panic</strong> crashes the current thread (and by default,
          the program). It means "something went so wrong that continuing is
          impossible or unsafe." A <strong>Result</strong> means "this can
          fail in expected ways, and the caller should decide what to do."
        </p>
        <p>
          Rule of thumb: use <code>Result</code> for expected failures
          (user input, file not found, network errors). Use panic for
          bugs and invariant violations (index out of bounds, impossible
          states).
        </p>
      </ConceptBlock>

      <h2>Python's Approach vs Rust's Philosophy</h2>

      <PythonRustCompare
        title="When crashing is appropriate"
        description="Python raises exceptions for everything. Rust distinguishes recoverable errors (Result) from bugs (panic)."
        pythonCode={`# Python: everything is an exception
def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Division by zero")  # recoverable
    return a / b

# Python: assertions for "should never happen"
def process(items: list) -> list:
    assert len(items) > 0, "Bug: empty list"  # programmer error
    # In production, assertions can be disabled with -O flag!
    return [x * 2 for x in items]

# Problem: both use the same mechanism (exceptions)
# Nothing in the type system distinguishes them`}
        rustCode={`// Rust: Result for recoverable errors
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".into())
    } else {
        Ok(a / b)
    }
}

// Rust: panic for "should never happen" (bugs)
fn process(items: &[i32]) -> Vec<i32> {
    assert!(!items.is_empty(), "Bug: empty list");
    // Unlike Python, assert! cannot be disabled
    items.iter().map(|x| x * 2).collect()
}

// The type system makes the distinction clear:
// - fn foo() -> Result<T, E>  means "this can fail"
// - fn foo() -> T             means "this always succeeds
//                               (or panics on a bug)"`}
      />

      <h2>When Panic Is Appropriate</h2>

      <CodeBlock
        language="rust"
        title="Legitimate uses of unwrap and panic"
        code={`fn main() {
    // 1. TESTS — unwrap is fine, panics produce test failures
    #[cfg(test)]
    fn test_parsing() {
        let n: i32 = "42".parse().unwrap();
        assert_eq!(n, 42);
    }

    // 2. KNOWN VALUES — the programmer can prove it won't fail
    let home = std::env::var("HOME")
        .expect("HOME environment variable must be set");
    // On Unix systems, HOME is always set

    // 3. AFTER VALIDATION — you've already checked the condition
    let numbers = vec![1, 2, 3, 4, 5];
    if !numbers.is_empty() {
        let first = numbers.first().unwrap();  // safe: we checked
        println!("First: {}", first);
    }

    // 4. PROTOTYPING — use unwrap to sketch out logic quickly
    let data = std::fs::read_to_string("config.toml").unwrap();
    // Replace with proper error handling before shipping

    // 5. EXAMPLES AND DOCUMENTATION — keeps examples focused
    let port: u16 = "8080".parse().unwrap();
    println!("Port: {}", port);
}`}
      />

      <NoteBlock title="expect() over unwrap()" type="tip">
        <p>
          Always prefer <code>.expect("message")</code> over
          <code>.unwrap()</code>. When a panic occurs, <code>expect</code>
          includes your message in the panic output, making debugging much
          easier. Compare:
        </p>
        <ul>
          <li><code>unwrap()</code>: "called Option::unwrap() on a None value"</li>
          <li><code>expect("user ID")</code>: "user ID: called Option::unwrap() on a None value"</li>
        </ul>
      </NoteBlock>

      <h2>The Unwrap Family</h2>

      <CodeBlock
        language="rust"
        title="Choosing the right unwrap variant"
        code={`fn main() {
    let value: Option<i32> = Some(42);
    let empty: Option<i32> = None;

    // unwrap() — panics on None/Err. Use in tests only.
    let _ = value.unwrap();          // 42

    // expect() — panics with a message. Better than unwrap.
    let _ = value.expect("value must exist");  // 42

    // unwrap_or() — provide a default. Never panics.
    let _ = empty.unwrap_or(0);      // 0

    // unwrap_or_else() — compute default lazily. Never panics.
    let _ = empty.unwrap_or_else(|| {
        eprintln!("Warning: using default");
        99
    });

    // unwrap_or_default() — uses Default trait. Never panics.
    let _ = empty.unwrap_or_default();  // 0 (i32::default())

    // For Result:
    let ok: Result<i32, String> = Ok(42);
    let err: Result<i32, String> = Err("oops".into());

    let _ = ok.unwrap_or(0);         // 42
    let _ = err.unwrap_or(0);        // 0

    // unwrap_err() — panics if Ok, returns the error.
    // Useful in tests to assert errors.
    let e = err.unwrap_err();        // "oops"
}`}
      />

      <h2>Replacing unwrap with Better Alternatives</h2>

      <PythonRustCompare
        title="Progressive error handling"
        description="Start with unwrap during prototyping, then replace with proper handling."
        pythonCode={`# Python: start with no error handling
def process_v1(path):
    data = open(path).read()        # crashes on error
    return int(data)                 # crashes on error

# Then add try/except
def process_v2(path):
    try:
        data = open(path).read()
        return int(data)
    except (FileNotFoundError, ValueError) as e:
        return None

# Python makes it easy to skip error handling entirely`}
        rustCode={`// Rust v1: prototype with unwrap
fn process_v1(path: &str) -> i32 {
    let data = std::fs::read_to_string(path).unwrap();
    data.trim().parse().unwrap()
}

// Rust v2: replace with ? (compiler guided)
fn process_v2(path: &str) -> Result<i32, Box<dyn std::error::Error>> {
    let data = std::fs::read_to_string(path)?;
    let num = data.trim().parse()?;
    Ok(num)
}

// Rust v3: use anyhow for better messages
fn process_v3(path: &str) -> anyhow::Result<i32> {
    let data = std::fs::read_to_string(path)
        .with_context(|| format!("reading {}", path))?;
    let num = data.trim().parse()
        .context("parsing number")?;
    Ok(num)
}

// Rust makes it hard to FORGET error handling —
// the compiler warns about unused Results`}
      />

      <NoteBlock title="#[must_use] — Rust won't let you ignore errors" type="pythonista">
        <p>
          In Python, you can call a function and ignore its return value —
          including error information. Rust's <code>Result</code> is marked
          <code>#[must_use]</code>, so the compiler warns if you discard a
          Result without handling it. This is like having a linter that
          catches every unhandled exception — built into the language.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Unwrap audit"
        difficulty="easy"
        problem={`Review this function and replace each unwrap() with the most appropriate
alternative. Explain your choice for each:

fn analyze(data: &str) -> f64 {
    let lines: Vec<&str> = data.lines().collect();
    let header = lines.first().unwrap();
    let values: Vec<f64> = lines[1..]
        .iter()
        .map(|line| line.parse::<f64>().unwrap())
        .collect();
    let count = values.len();
    let sum: f64 = values.iter().sum();
    sum / count as f64
}`}
        solution={`fn analyze(data: &str) -> Result<f64, String> {
    let lines: Vec<&str> = data.lines().collect();

    // .first() might be None → use ok_or for a descriptive error
    let _header = lines.first()
        .ok_or("No header line found")?;

    // Parse might fail → collect into Result, use map_err
    let values: Vec<f64> = lines[1..]
        .iter()
        .enumerate()
        .map(|(i, line)| {
            line.parse::<f64>()
                .map_err(|e| format!("Line {}: {}", i + 2, e))
        })
        .collect::<Result<Vec<_>, _>>()?;

    // Division by zero if no data rows
    if values.is_empty() {
        return Err("No data rows".to_string());
    }

    let sum: f64 = values.iter().sum();
    Ok(sum / values.len() as f64)
}

// Changes made:
// 1. unwrap() on first() → ok_or(): the slice might be empty
// 2. unwrap() on parse() → map_err() + ?: input might not be numeric
// 3. Added empty check: division by zero is a runtime error
// 4. Return type changed to Result: callers must handle errors`}
      />
    </div>
  );
}
