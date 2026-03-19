import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function CustomErrors() {
  return (
    <div className="prose-rust">
      <h1>Custom Error Types</h1>

      <p>
        In Python, you create custom exceptions by subclassing
        <code>Exception</code>. In Rust, you define error types as enums or
        structs and implement the <code>std::error::Error</code> trait. This
        gives you precise, type-safe error hierarchies that the compiler
        checks exhaustively.
      </p>

      <ConceptBlock title="The Error Trait">
        <p>
          Rust's <code>std::error::Error</code> trait requires implementing
          <code>Display</code> (for user-facing messages) and
          <code>Debug</code> (for developer diagnostics). It also provides an
          optional <code>source()</code> method for error chaining — the
          equivalent of Python's <code>__cause__</code> from
          <code>raise ... from ...</code>.
        </p>
      </ConceptBlock>

      <h2>Python Custom Exceptions vs Rust Error Enums</h2>

      <PythonRustCompare
        title="Custom error types"
        description="Python subclasses Exception. Rust uses enums with the Error trait."
        pythonCode={`class AppError(Exception):
    """Base error for our application."""
    pass

class NotFoundError(AppError):
    def __init__(self, resource: str, id: int):
        self.resource = resource
        self.id = id
        super().__init__(
            f"{resource} with id {id} not found"
        )

class ValidationError(AppError):
    def __init__(self, field: str, message: str):
        self.field = field
        super().__init__(
            f"Validation error on '{field}': {message}"
        )

def get_user(id: int) -> dict:
    if id != 1:
        raise NotFoundError("User", id)
    return {"id": 1, "name": "Alice", "age": -5}

def validate_user(user: dict):
    if user["age"] < 0:
        raise ValidationError("age", "must be non-negative")`}
        rustCode={`use std::fmt;

#[derive(Debug)]
enum AppError {
    NotFound { resource: String, id: u64 },
    Validation { field: String, message: String },
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::NotFound { resource, id } => {
                write!(f, "{} with id {} not found", resource, id)
            }
            AppError::Validation { field, message } => {
                write!(f, "Validation error on '{}': {}", field, message)
            }
        }
    }
}

impl std::error::Error for AppError {}

fn get_user(id: u64) -> Result<(String, i32), AppError> {
    if id != 1 {
        return Err(AppError::NotFound {
            resource: "User".into(), id
        });
    }
    Ok(("Alice".into(), -5))
}

fn validate_age(age: i32) -> Result<(), AppError> {
    if age < 0 {
        return Err(AppError::Validation {
            field: "age".into(),
            message: "must be non-negative".into(),
        });
    }
    Ok(())
}`}
      />

      <NoteBlock title="Enums vs class hierarchies" type="pythonista">
        <p>
          Python's exception hierarchy uses inheritance: <code>NotFoundError</code>
          extends <code>AppError</code> extends <code>Exception</code>. Rust
          uses a flat enum where each variant is a case. This means
          <code>match</code> on an error is exhaustive — the compiler
          guarantees you handle every variant. No more "I forgot to catch
          that exception type" bugs.
        </p>
      </NoteBlock>

      <h2>Error Chaining with source()</h2>

      <CodeBlock
        language="rust"
        title="Wrapping lower-level errors"
        code={`use std::fmt;
use std::num::ParseIntError;

#[derive(Debug)]
enum DataError {
    Io(std::io::Error),
    Parse { line: usize, source: ParseIntError },
    Empty,
}

impl fmt::Display for DataError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DataError::Io(e) => write!(f, "I/O error: {}", e),
            DataError::Parse { line, source } => {
                write!(f, "Parse error on line {}: {}", line, source)
            }
            DataError::Empty => write!(f, "No data provided"),
        }
    }
}

impl std::error::Error for DataError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            DataError::Io(e) => Some(e),
            DataError::Parse { source, .. } => Some(source),
            DataError::Empty => None,
        }
    }
}

// From implementations for ? operator
impl From<std::io::Error> for DataError {
    fn from(e: std::io::Error) -> Self { DataError::Io(e) }
}

fn parse_data(input: &str) -> Result<Vec<i32>, DataError> {
    if input.is_empty() {
        return Err(DataError::Empty);
    }

    input.lines()
        .enumerate()
        .map(|(i, line)| {
            line.trim().parse::<i32>()
                .map_err(|e| DataError::Parse { line: i + 1, source: e })
        })
        .collect()
}

fn main() {
    match parse_data("42\\nabc\\n10") {
        Ok(nums) => println!("{:?}", nums),
        Err(e) => {
            println!("Error: {}", e);
            // Walk the error chain
            let mut source = e.source();
            while let Some(cause) = source {
                println!("  Caused by: {}", cause);
                source = cause.source();
            }
        }
    }
}`}
      />

      <h2>The Full Pattern: A Complete Error Type</h2>

      <CodeBlock
        language="rust"
        title="Production-ready error type"
        code={`use std::fmt;

/// All errors that can occur in our CSV processing library.
#[derive(Debug)]
pub enum CsvError {
    /// File I/O failed
    Io(std::io::Error),
    /// A field could not be parsed as the expected type
    FieldParse {
        row: usize,
        column: usize,
        expected: &'static str,
        value: String,
    },
    /// The header row is missing or malformed
    BadHeader(String),
    /// The file has no data rows
    EmptyFile,
}

impl fmt::Display for CsvError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CsvError::Io(e) => write!(f, "I/O error: {}", e),
            CsvError::FieldParse { row, column, expected, value } => {
                write!(
                    f,
                    "Row {}, column {}: expected {}, got '{}'",
                    row, column, expected, value
                )
            }
            CsvError::BadHeader(msg) => write!(f, "Bad header: {}", msg),
            CsvError::EmptyFile => write!(f, "File contains no data"),
        }
    }
}

impl std::error::Error for CsvError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            CsvError::Io(e) => Some(e),
            _ => None,
        }
    }
}

impl From<std::io::Error> for CsvError {
    fn from(e: std::io::Error) -> Self { CsvError::Io(e) }
}

// Usage with ? is now clean:
fn read_csv_ages(path: &str) -> Result<Vec<u32>, CsvError> {
    let text = std::fs::read_to_string(path)?;  // ? converts io::Error

    let mut lines = text.lines();
    let _header = lines.next().ok_or(CsvError::EmptyFile)?;

    lines.enumerate()
        .map(|(i, line)| {
            let age_str = line.split(',').nth(1)
                .ok_or(CsvError::FieldParse {
                    row: i + 2, column: 2,
                    expected: "age field", value: line.into(),
                })?;

            age_str.trim().parse::<u32>()
                .map_err(|_| CsvError::FieldParse {
                    row: i + 2, column: 2,
                    expected: "u32", value: age_str.into(),
                })
        })
        .collect()
}`}
      />

      <NoteBlock title="Boilerplate warning" type="warning">
        <p>
          Writing <code>Display</code>, <code>Error</code>, and
          <code>From</code> implementations by hand is verbose. This is why
          the <code>thiserror</code> crate exists — it generates all this
          boilerplate with a derive macro. See the next section for how
          <code>thiserror</code> and <code>anyhow</code> eliminate the
          tedium.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Build a calculator error type"
        difficulty="medium"
        problem={`Create a CalcError enum with variants:
1. DivisionByZero
2. InvalidOperator(char)
3. ParseError(String) — wraps parse failures

Implement Display, Debug, and Error for it.
Write a function eval(expr: &str) -> Result<f64, CalcError> that parses
simple expressions like "10 + 5", "8 / 0", "3 * 2".
Support +, -, *, / operators.`}
        solution={`use std::fmt;

#[derive(Debug)]
enum CalcError {
    DivisionByZero,
    InvalidOperator(char),
    ParseError(String),
}

impl fmt::Display for CalcError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CalcError::DivisionByZero => write!(f, "Division by zero"),
            CalcError::InvalidOperator(op) => {
                write!(f, "Invalid operator: '{}'", op)
            }
            CalcError::ParseError(msg) => {
                write!(f, "Parse error: {}", msg)
            }
        }
    }
}

impl std::error::Error for CalcError {}

fn eval(expr: &str) -> Result<f64, CalcError> {
    let parts: Vec<&str> = expr.split_whitespace().collect();
    if parts.len() != 3 {
        return Err(CalcError::ParseError(
            format!("Expected 'a op b', got '{}'", expr)
        ));
    }

    let a: f64 = parts[0].parse()
        .map_err(|e| CalcError::ParseError(format!("{}", e)))?;
    let b: f64 = parts[2].parse()
        .map_err(|e| CalcError::ParseError(format!("{}", e)))?;
    let op = parts[1].chars().next()
        .ok_or(CalcError::ParseError("Empty operator".into()))?;

    match op {
        '+' => Ok(a + b),
        '-' => Ok(a - b),
        '*' => Ok(a * b),
        '/' if b == 0.0 => Err(CalcError::DivisionByZero),
        '/' => Ok(a / b),
        _ => Err(CalcError::InvalidOperator(op)),
    }
}

fn main() {
    println!("{:?}", eval("10 + 5"));   // Ok(15.0)
    println!("{:?}", eval("8 / 0"));    // Err(DivisionByZero)
    println!("{:?}", eval("3 % 2"));    // Err(InvalidOperator('%'))
}`}
      />
    </div>
  );
}
