import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function AnyhowThiserror() {
  return (
    <div className="prose-rust">
      <h1>anyhow &amp; thiserror</h1>

      <p>
        Writing <code>Display</code>, <code>Error</code>, and <code>From</code>
        implementations by hand is tedious. The Rust ecosystem has two
        crates that eliminate this boilerplate:
        <code>thiserror</code> for libraries (structured errors) and
        <code>anyhow</code> for applications (quick and flexible).
      </p>

      <ConceptBlock title="Two Crates, Two Use Cases">
        <p>
          <strong>thiserror</strong>: Derive macro that auto-generates
          <code>Display</code>, <code>Error</code>, and <code>From</code>
          implementations for your error enums. Use in libraries where
          callers need to match on specific error variants.
        </p>
        <p>
          <strong>anyhow</strong>: Provides <code>anyhow::Result</code> and
          <code>anyhow::Error</code> — a type-erased error that can hold any
          error type. Use in applications where you just want to propagate
          and display errors without defining custom types.
        </p>
      </ConceptBlock>

      <h2>thiserror: Clean Error Definitions</h2>

      <PythonRustCompare
        title="Defining errors with minimal boilerplate"
        description="Python exceptions need __init__ and __str__. thiserror generates everything from attributes."
        pythonCode={`class DataError(Exception):
    pass

class IoError(DataError):
    def __init__(self, source):
        self.source = source
        super().__init__(f"I/O error: {source}")

class ParseError(DataError):
    def __init__(self, line, message):
        self.line = line
        super().__init__(
            f"Parse error on line {line}: {message}"
        )

class EmptyDataError(DataError):
    def __init__(self):
        super().__init__("No data provided")

# Python: 15+ lines of boilerplate for 3 error types`}
        rustCode={`use thiserror::Error;

#[derive(Debug, Error)]
enum DataError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Parse error on line {line}: {message}")]
    Parse { line: usize, message: String },

    #[error("No data provided")]
    Empty,
}

// That's it! thiserror generates:
// - Display (from #[error("...")])
// - Error trait (with source() from #[from])
// - From<std::io::Error> (from #[from])

fn load_data(path: &str) -> Result<Vec<i32>, DataError> {
    let text = std::fs::read_to_string(path)?;  // ? works!

    if text.is_empty() {
        return Err(DataError::Empty);
    }

    text.lines()
        .enumerate()
        .map(|(i, line)| {
            line.trim().parse::<i32>().map_err(|e| DataError::Parse {
                line: i + 1,
                message: e.to_string(),
            })
        })
        .collect()
}`}
      />

      <NoteBlock title="thiserror attributes" type="note">
        <p>
          <code>#[error("...")]</code> generates the <code>Display</code>
          implementation. Use <code>{"{0}"}</code> for tuple fields,
          <code>{"{field_name}"}</code> for named fields.
          <code>#[from]</code> generates both <code>From</code> conversion
          and <code>source()</code> method. <code>#[source]</code> marks a
          field as the error source without generating <code>From</code>.
        </p>
      </NoteBlock>

      <h2>anyhow: For Applications</h2>

      <PythonRustCompare
        title="Quick error handling in applications"
        description="anyhow is like Python's general Exception — catch anything, add context."
        pythonCode={`import json

def run_pipeline(config_path: str) -> dict:
    """Application code — we just want errors to bubble up
    with good messages, not define custom types."""
    try:
        with open(config_path) as f:
            config = json.load(f)
    except FileNotFoundError:
        raise RuntimeError(
            f"Config file not found: {config_path}"
        )
    except json.JSONDecodeError as e:
        raise RuntimeError(
            f"Invalid JSON in {config_path}"
        ) from e

    port = config.get("port")
    if port is None:
        raise RuntimeError("Missing 'port' in config")

    return {"port": int(port)}`}
        rustCode={`use anyhow::{Context, Result, bail};

fn run_pipeline(config_path: &str) -> Result<u16> {
    // .context() adds a message to any error
    let text = std::fs::read_to_string(config_path)
        .context(format!(
            "Failed to read config: {}", config_path
        ))?;

    // anyhow works with any error type
    let config: serde_json::Value = serde_json::from_str(&text)
        .context("Invalid JSON in config")?;

    // bail! is a shorthand for return Err(anyhow!("..."))
    let port = config["port"].as_u64()
        .ok_or_else(|| anyhow::anyhow!("Missing 'port' in config"))?;

    if port > 65535 {
        bail!("Port {} out of range", port);
    }

    Ok(port as u16)
}

fn main() {
    match run_pipeline("config.json") {
        Ok(port) => println!("Starting on port {}", port),
        Err(e) => {
            // anyhow prints the full error chain
            eprintln!("Error: {:#}", e);
            // Error: Failed to read config: config.json
            //   Caused by: No such file or directory
        }
    }
}`}
      />

      <NoteBlock title="anyhow vs thiserror" type="tip">
        <p>
          <strong>Rule of thumb</strong>: Use <code>thiserror</code> in
          library code where callers need to <code>match</code> on error
          variants. Use <code>anyhow</code> in application code (binaries,
          CLI tools, scripts) where you just want to propagate errors with
          context. Many projects use both: <code>thiserror</code> in their
          library crate and <code>anyhow</code> in their binary crate.
        </p>
      </NoteBlock>

      <h2>anyhow Key Features</h2>

      <CodeBlock
        language="rust"
        title="anyhow's toolkit"
        code={`use anyhow::{anyhow, bail, ensure, Context, Result};

fn process(input: &str) -> Result<Vec<f64>> {
    // ensure! — like assert but returns Err instead of panicking
    ensure!(!input.is_empty(), "Input must not be empty");

    let values: Vec<f64> = input
        .split(',')
        .enumerate()
        .map(|(i, s)| {
            s.trim()
                .parse::<f64>()
                .context(format!("Field {} is not a valid number", i + 1))
        })
        .collect::<Result<Vec<_>>>()?;

    // bail! — return an error immediately
    if values.iter().any(|v| v.is_nan()) {
        bail!("NaN values are not allowed");
    }

    // anyhow! — create an error value
    let sum: f64 = values.iter().sum();
    if sum == 0.0 {
        return Err(anyhow!("Sum must not be zero"));
    }

    Ok(values)
}

fn main() -> Result<()> {
    let data = process("1.5, 2.5, 3.0")?;
    println!("Processed: {:?}", data);
    Ok(())

    // anyhow::Result in main() prints errors nicely on failure
}`}
      />

      <h2>Adding to Your Project</h2>

      <CodeBlock
        language="bash"
        title="Installing the crates"
        code={`# Add thiserror (for library error types)
cargo add thiserror

# Add anyhow (for application error handling)
cargo add anyhow

# Both are lightweight with no transitive dependencies`}
      />

      <CodeBlock
        language="toml"
        title="Cargo.toml"
        code={`[dependencies]
thiserror = "2"
anyhow = "1"`}
      />

      <NoteBlock title="No performance cost" type="note">
        <p>
          Both <code>thiserror</code> and <code>anyhow</code> are zero-cost
          in the success path. <code>thiserror</code> generates the same
          code you would write by hand. <code>anyhow</code> allocates on
          the error path (which is fine — errors are rare). Neither adds
          measurable overhead to hot loops.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Refactor with thiserror"
        difficulty="easy"
        problem={`Take this hand-written error type and rewrite it using thiserror's derive macro:

#[derive(Debug)]
enum ApiError {
    Network(reqwest::Error),
    Json(serde_json::Error),
    NotFound { url: String },
    RateLimit { retry_after: u64 },
}

You need to:
1. Add #[derive(Error)] and #[error("...")] attributes
2. Use #[from] for automatic From conversions
3. Write format strings that produce useful messages
4. Which variants should use #[from] and which shouldn't?`}
        solution={`use thiserror::Error;

#[derive(Debug, Error)]
enum ApiError {
    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("JSON parsing error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("Resource not found: {url}")]
    NotFound { url: String },

    #[error("Rate limited, retry after {retry_after} seconds")]
    RateLimit { retry_after: u64 },
}

// Network and Json use #[from] because they wrap external
// error types and enable ? conversion.
// NotFound and RateLimit don't use #[from] because they
// are application-specific errors constructed manually.

// Usage:
// fn fetch(url: &str) -> Result<Data, ApiError> {
//     let resp = reqwest::get(url)?;  // #[from] converts
//     if resp.status() == 404 {
//         return Err(ApiError::NotFound { url: url.into() });
//     }
//     let data = resp.json()?;        // #[from] converts
//     Ok(data)
// }`}
      />
    </div>
  );
}
