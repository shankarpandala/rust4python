import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function QuestionMarkOperator() {
  return (
    <div className="prose-rust">
      <h1>The ? Operator</h1>

      <p>
        Python's error handling model is "ask forgiveness, not permission" —
        wrap code in <code>try/except</code> and catch errors after the fact.
        Rust's <code>?</code> operator provides a concise way to propagate
        errors upward, combining the best of explicit error handling with
        minimal boilerplate.
      </p>

      <ConceptBlock title="What ? Does">
        <p>
          The <code>?</code> operator, placed after a <code>Result</code> or
          <code>Option</code> expression, does two things:
        </p>
        <ul>
          <li>If the value is <code>Ok(v)</code> or <code>Some(v)</code>, it
            unwraps to <code>v</code> and execution continues.</li>
          <li>If the value is <code>Err(e)</code> or <code>None</code>, it
            returns early from the current function, converting the error
            type via <code>From</code> if needed.</li>
        </ul>
      </ConceptBlock>

      <h2>Python try/except vs Rust ?</h2>

      <PythonRustCompare
        title="Reading and parsing a file"
        description="Python uses try/except. Rust uses ? to propagate errors explicitly but concisely."
        pythonCode={`def read_config(path: str) -> dict:
    """Read a key=value config file."""
    try:
        with open(path) as f:
            text = f.read()
    except FileNotFoundError:
        raise ValueError(f"Config not found: {path}")
    except PermissionError:
        raise ValueError(f"Cannot read: {path}")

    config = {}
    for line in text.strip().split("\\n"):
        try:
            key, value = line.split("=", 1)
            config[key.strip()] = value.strip()
        except ValueError:
            raise ValueError(f"Bad line: {line}")

    return config

# Caller must also use try/except
try:
    cfg = read_config("app.conf")
    print(cfg)
except ValueError as e:
    print(f"Error: {e}")`}
        rustCode={`use std::collections::HashMap;
use std::fs;

#[derive(Debug)]
enum ConfigError {
    IoError(std::io::Error),
    ParseError(String),
}

impl From<std::io::Error> for ConfigError {
    fn from(e: std::io::Error) -> Self {
        ConfigError::IoError(e)
    }
}

fn read_config(path: &str) -> Result<HashMap<String, String>, ConfigError> {
    let text = fs::read_to_string(path)?;  // io::Error -> ConfigError

    let mut config = HashMap::new();
    for line in text.lines() {
        let (key, value) = line.split_once('=')
            .ok_or(ConfigError::ParseError(
                format!("Bad line: {}", line)
            ))?;  // None -> ConfigError
        config.insert(key.trim().into(), value.trim().into());
    }

    Ok(config)
}

fn main() {
    match read_config("app.conf") {
        Ok(cfg) => println!("{:?}", cfg),
        Err(e) => println!("Error: {:?}", e),
    }
}`}
      />

      <NoteBlock title="? is not a silencer" type="pythonista">
        <p>
          A common Python anti-pattern is a bare <code>except:</code> that
          swallows all errors. Rust's <code>?</code> does the opposite — it
          makes errors <em>visible</em> in the return type and propagates
          them explicitly. You can see every <code>?</code> in the code and
          know: "this line can fail, and the error goes to the caller."
        </p>
      </NoteBlock>

      <h2>How ? Converts Error Types</h2>

      <CodeBlock
        language="rust"
        title="Automatic error conversion with From"
        code={`use std::num::ParseIntError;
use std::io;

// An error enum that can hold different error types
#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(ParseIntError),
    Custom(String),
}

// Implement From for each error type you want to convert
impl From<io::Error> for AppError {
    fn from(e: io::Error) -> Self { AppError::Io(e) }
}

impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self { AppError::Parse(e) }
}

fn read_number_from_file(path: &str) -> Result<i64, AppError> {
    // ? on io::Error — automatically converted to AppError via From
    let contents = std::fs::read_to_string(path)?;

    // ? on ParseIntError — also automatically converted
    let number = contents.trim().parse::<i64>()?;

    if number < 0 {
        // Manual error — no conversion needed
        return Err(AppError::Custom("Negative numbers not allowed".into()));
    }

    Ok(number)
}

// Without ?, you'd need this verbose version:
fn read_number_verbose(path: &str) -> Result<i64, AppError> {
    let contents = match std::fs::read_to_string(path) {
        Ok(s) => s,
        Err(e) => return Err(AppError::Io(e)),
    };
    let number = match contents.trim().parse::<i64>() {
        Ok(n) => n,
        Err(e) => return Err(AppError::Parse(e)),
    };
    Ok(number)
}`}
      />

      <h2>Using ? with Option</h2>

      <CodeBlock
        language="rust"
        title="? works with Option too"
        code={`fn get_middle_name(full_name: &str) -> Option<&str> {
    let mut parts = full_name.split_whitespace();

    let _first = parts.next()?;    // None → return None
    let middle = parts.next()?;    // None → return None
    let _last = parts.next()?;     // None → return None

    Some(middle)
}

fn main() {
    println!("{:?}", get_middle_name("John Michael Smith"));  // Some("Michael")
    println!("{:?}", get_middle_name("Madonna"));              // None
    println!("{:?}", get_middle_name("Cher Bono"));            // None
}`}
      />

      <NoteBlock title="? in main()" type="tip">
        <p>
          You can use <code>?</code> in <code>main()</code> by changing its
          return type to <code>Result&lt;(), Box&lt;dyn std::error::Error&gt;&gt;</code>.
          If <code>main</code> returns an <code>Err</code>, Rust prints the
          error and exits with a non-zero status code. This is great for CLI
          tools and scripts.
        </p>
      </NoteBlock>

      <h2>Practical Pattern: ? in main</h2>

      <CodeBlock
        language="rust"
        title="Using ? throughout a program"
        code={`use std::fs;
use std::collections::HashMap;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Every ? propagates to main's return type
    let text = fs::read_to_string("data.csv")?;

    let mut totals: HashMap<String, f64> = HashMap::new();

    for (i, line) in text.lines().enumerate().skip(1) {
        let fields: Vec<&str> = line.split(',').collect();

        let category = fields.first()
            .ok_or(format!("Line {}: missing category", i + 1))?;

        let amount: f64 = fields.get(1)
            .ok_or(format!("Line {}: missing amount", i + 1))?
            .parse()?;   // ParseFloatError → Box<dyn Error>

        *totals.entry(category.to_string()).or_insert(0.0) += amount;
    }

    for (cat, total) in &totals {
        println!("{}: {:.2}", cat, total);
    }

    Ok(())
}
// If any ? triggers, program prints the error and exits with code 1`}
      />

      <ExerciseBlock
        title="Multi-step data parser with ?"
        difficulty="medium"
        problem={`Write a function parse_coordinates(input: &str) -> Result<Vec<(f64, f64)>, String>
that takes a string like "1.0,2.0;3.0,4.0;5.0,6.0" and returns a vector of
(x, y) tuples.

Requirements:
- Split by semicolons to get points
- Split each point by comma to get x and y
- Parse each coordinate as f64
- Return descriptive errors using ? and map_err
- Handle: wrong number of values per point, unparseable numbers

Test with valid input and several types of invalid input.`}
        solution={`fn parse_coordinates(input: &str) -> Result<Vec<(f64, f64)>, String> {
    input
        .split(';')
        .enumerate()
        .map(|(i, point_str)| {
            let parts: Vec<&str> = point_str.split(',').collect();

            if parts.len() != 2 {
                return Err(format!(
                    "Point {}: expected 2 values, got {}", i + 1, parts.len()
                ));
            }

            let x: f64 = parts[0].trim().parse()
                .map_err(|e| format!("Point {} x: {}", i + 1, e))?;

            let y: f64 = parts[1].trim().parse()
                .map_err(|e| format!("Point {} y: {}", i + 1, e))?;

            Ok((x, y))
        })
        .collect()  // collects Result<Vec<_>, String>
}

fn main() {
    // Valid
    println!("{:?}", parse_coordinates("1.0,2.0;3.0,4.0"));
    // Ok([(1.0, 2.0), (3.0, 4.0)])

    // Bad number
    println!("{:?}", parse_coordinates("1.0,abc;3.0,4.0"));
    // Err("Point 1 y: invalid float literal")

    // Wrong number of values
    println!("{:?}", parse_coordinates("1.0,2.0,3.0"));
    // Err("Point 1: expected 2 values, got 3")
}`}
      />
    </div>
  );
}
