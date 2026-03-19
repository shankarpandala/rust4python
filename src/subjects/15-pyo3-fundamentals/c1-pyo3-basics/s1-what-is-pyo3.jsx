import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function WhatIsPyO3() {
  return (
    <div className="prose-rust">
      <h1>What Is PyO3</h1>

      <p>
        PyO3 is the bridge between Python and Rust. It lets you write Rust
        functions and classes that can be imported directly from Python — just
        like any other Python module. If you have ever wanted to replace a
        slow Python function with a fast Rust implementation without changing
        your Python code, PyO3 is how you do it.
      </p>

      <ConceptBlock title="PyO3 in the Ecosystem">
        <p>
          PyO3 is what powers the Rust-backed Python tools you already use.
          Polars, Ruff, tiktoken, tokenizers, cryptography, orjson, and pydantic-core
          are all built with PyO3. It handles the complexity of Python's C API,
          reference counting, GIL management, and type conversions so you can
          focus on writing fast Rust code.
        </p>
        <p>
          Combined with <code>maturin</code> (a build tool), you can go from
          Rust code to an installable Python package in minutes.
        </p>
      </ConceptBlock>

      <h2>Your First PyO3 Function</h2>

      <PythonRustCompare
        title="From Python to Rust and back"
        description="Write Rust, import from Python. The function signature maps directly."
        pythonCode={`# Pure Python implementation (slow)
def sum_of_squares(n: int) -> int:
    """Sum of squares from 0 to n-1"""
    return sum(i * i for i in range(n))

result = sum_of_squares(10_000_000)
print(result)
# Takes ~1.5 seconds

# After creating the Rust extension:
# from my_rust_lib import sum_of_squares
# result = sum_of_squares(10_000_000)
# Takes ~0.015 seconds (100x faster!)`}
        rustCode={`use pyo3::prelude::*;

/// Sum of squares from 0 to n-1.
/// This becomes a Python function!
#[pyfunction]
fn sum_of_squares(n: u64) -> u64 {
    (0..n).map(|i| i * i).sum()
}

/// The Python module definition
#[pymodule]
fn my_rust_lib(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(sum_of_squares, m)?)?;
    Ok(())
}

// After building with maturin:
// $ pip install .
//
// Then in Python:
// >>> from my_rust_lib import sum_of_squares
// >>> sum_of_squares(10_000_000)
// 333333283333335000000`}
      />

      <NoteBlock type="pythonista" title="It looks like a normal Python import">
        The magic of PyO3 is that from Python's perspective, your Rust code
        is just a normal module. <code>from my_rust_lib import sum_of_squares</code>
        works exactly like importing from any other package. Help, docstrings,
        and type hints all work as expected.
      </NoteBlock>

      <h2>Project Setup with maturin</h2>

      <CodeBlock
        language="bash"
        title="Creating a new PyO3 project"
        code={`# Install maturin (the build tool for PyO3)
pip install maturin

# Create a new project
maturin new my_rust_lib --bindings pyo3
cd my_rust_lib

# Project structure:
# my_rust_lib/
# ├── Cargo.toml        # Rust dependencies
# ├── pyproject.toml     # Python package metadata
# └── src/
#     └── lib.rs         # Your Rust code

# Build and install in development mode
maturin develop

# Now you can import it!
python -c "from my_rust_lib import sum_of_squares; print(sum_of_squares(100))"`}
      />

      <CodeBlock
        language="toml"
        title="Cargo.toml for a PyO3 project"
        code={`[package]
name = "my_rust_lib"
version = "0.1.0"
edition = "2021"

[lib]
name = "my_rust_lib"
crate-type = ["cdylib"]  # Required: creates a shared library

[dependencies]
pyo3 = { version = "0.23", features = ["extension-module"] }`}
      />

      <h2>How PyO3 Works Under the Hood</h2>

      <CodeBlock
        language="rust"
        title="What the #[pyfunction] macro generates"
        code={`// When you write:
#[pyfunction]
fn add(a: i64, b: i64) -> i64 {
    a + b
}

// PyO3 generates code that:
// 1. Extracts 'a' and 'b' from Python objects
//    (converts PyObject -> i64, raises TypeError if wrong type)
// 2. Calls your Rust function
// 3. Converts the i64 result back to a Python int
// 4. Handles the GIL (Global Interpreter Lock) correctly
// 5. Propagates Rust panics as Python exceptions

// All of this happens at zero cost — the conversion code
// is generated at compile time, not runtime reflection.

// You can also handle errors properly:
use pyo3::exceptions::PyValueError;

#[pyfunction]
fn divide(a: f64, b: f64) -> PyResult<f64> {
    if b == 0.0 {
        Err(PyValueError::new_err("Division by zero"))
    } else {
        Ok(a / b)
    }
}
// In Python: divide(1.0, 0.0) raises ValueError("Division by zero")`}
      />

      <NoteBlock type="tip" title="maturin develop for fast iteration">
        During development, use <code>maturin develop --release</code> to
        rebuild and reinstall your package. It takes a few seconds and you
        can immediately test changes from Python. Add <code>--release</code>
        for optimized builds (much faster code, slightly slower compilation).
      </NoteBlock>

      <h2>Real-World Use Case: Speeding Up Data Processing</h2>

      <CodeBlock
        language="rust"
        title="A practical PyO3 function for text processing"
        code={`use pyo3::prelude::*;
use std::collections::HashMap;

/// Count word frequencies in text (much faster than Python)
#[pyfunction]
fn word_count(text: &str) -> HashMap<String, usize> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        let word = word.to_lowercase();
        *counts.entry(word).or_insert(0) += 1;
    }
    counts
}

/// Process a list of texts and return word counts for each
#[pyfunction]
fn batch_word_count(texts: Vec<&str>) -> Vec<HashMap<String, usize>> {
    texts.iter()
        .map(|text| {
            let mut counts = HashMap::new();
            for word in text.split_whitespace() {
                let word = word.to_lowercase();
                *counts.entry(word).or_insert(0) += 1;
            }
            counts
        })
        .collect()
}

#[pymodule]
fn text_tools(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(word_count, m)?)?;
    m.add_function(wrap_pyfunction!(batch_word_count, m)?)?;
    Ok(())
}

// In Python:
// from text_tools import word_count
// counts = word_count("the cat sat on the mat")
// print(counts)  # {'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1}`}
      />

      <ExerciseBlock
        title="Plan Your First Extension"
        difficulty="beginner"
        problem={`Think about your Python codebase and identify:

1. A function that processes data in a loop (e.g., parsing, transforming, computing)
2. Write out its Python signature and what it does
3. Sketch the Rust equivalent using #[pyfunction]
4. What types would you use? (Python int -> i64, str -> &str, list -> Vec, dict -> HashMap)

Example: A function that finds all prime numbers up to N.

Python: def find_primes(n: int) -> list[int]: ...
Rust:   #[pyfunction] fn find_primes(n: u64) -> Vec<u64> { ... }

Set up a project with maturin and implement your function.`}
        solution={`# Example: Finding primes (Sieve of Eratosthenes)

# Python version:
def find_primes(n: int) -> list[int]:
    sieve = [True] * (n + 1)
    sieve[0] = sieve[1] = False
    for i in range(2, int(n**0.5) + 1):
        if sieve[i]:
            for j in range(i*i, n + 1, i):
                sieve[j] = False
    return [i for i, is_prime in enumerate(sieve) if is_prime]

# Rust version:
use pyo3::prelude::*;

#[pyfunction]
fn find_primes(n: usize) -> Vec<usize> {
    let mut sieve = vec![true; n + 1];
    sieve[0] = false;
    if n > 0 { sieve[1] = false; }

    let limit = (n as f64).sqrt() as usize;
    for i in 2..=limit {
        if sieve[i] {
            let mut j = i * i;
            while j <= n {
                sieve[j] = false;
                j += i;
            }
        }
    }

    sieve.iter().enumerate()
        .filter(|(_, &is_prime)| is_prime)
        .map(|(i, _)| i)
        .collect()
}

#[pymodule]
fn prime_finder(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(find_primes, m)?)?;
    Ok(())
}

// Setup:
// $ maturin new prime_finder --bindings pyo3
// $ cd prime_finder
// # Replace src/lib.rs with the code above
// $ maturin develop --release
// $ python -c "from prime_finder import find_primes; print(len(find_primes(1_000_000)))"
// 78498 primes under 1 million`}
      />
    </div>
  );
}
