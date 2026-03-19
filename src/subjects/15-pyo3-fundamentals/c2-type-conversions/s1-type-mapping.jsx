import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function TypeMapping() {
  return (
    <div className="prose-rust">
      <h1>Python ↔ Rust Type Mapping</h1>

      <p>
        The most important skill in PyO3 development is understanding how
        Python types map to Rust types. Every function argument is converted
        from a Python object to a Rust value, and every return value goes the
        other way. PyO3 handles most conversions automatically, but knowing
        the rules prevents surprises.
      </p>

      <ConceptBlock title="The Conversion Rules">
        <p>
          PyO3 performs automatic type conversion at function boundaries.
          When Python calls your Rust function, each argument is extracted
          from a <code>PyObject</code> and converted to the declared Rust type.
          When your function returns, the Rust value is converted back to a
          Python object. If a conversion fails, PyO3 raises a{' '}
          <code>TypeError</code> automatically.
        </p>
      </ConceptBlock>

      <h2>Type Mapping Reference</h2>

      <CodeBlock
        language="rust"
        title="Python ↔ Rust type correspondence"
        code={`// Python type      →  Rust type         →  Python type
// ─────────────────────────────────────────────────────
// int               →  i32, i64, u64...  →  int
// float             →  f32, f64          →  float
// bool              →  bool              →  bool
// str               →  String, &str      →  str
// bytes             →  Vec<u8>, &[u8]    →  bytes
// None              →  ()                →  None
// Optional (None|T) →  Option<T>         →  None or T
//
// list              →  Vec<T>            →  list
// tuple             →  (T1, T2, ...)     →  tuple
// dict              →  HashMap<K, V>     →  dict
// set               →  HashSet<T>        →  set
//
// complex           →  (f64, f64)        →  (use num-complex)
//
// Any Python object →  PyObject          →  object
// &PyAny            →  Bound<'_, PyAny>  →  (reference to any)`}
      />

      <h2>Primitives and Strings</h2>

      <PythonRustCompare
        title="Basic type conversions"
        description="Primitives convert automatically. Strings have two options: owned String or borrowed &str."
        pythonCode={`# When you call from Python:
from my_lib import process

# int → i64
result = process(42)

# float → f64
result = process(3.14)

# str → String (owned copy)
result = process("hello")

# str → &str (borrowed, zero-copy)
result = process("hello")  # same call, different Rust type

# bool → bool
result = process(True)

# None → Option<T>
result = process(None)  # if Rust expects Option<i64>`}
        rustCode={`use pyo3::prelude::*;

// String: Python str → owned Rust String
// PyO3 copies the string data
#[pyfunction]
fn with_string(s: String) -> String {
    format!("Got: {}", s)
}

// &str: Python str → borrowed reference
// More efficient — avoids allocation when possible
#[pyfunction]
fn with_str(s: &str) -> usize {
    s.len()
}

// Option<T>: Python None → Rust None
#[pyfunction]
fn maybe_double(x: Option<f64>) -> Option<f64> {
    x.map(|v| v * 2.0)
}
// Python: maybe_double(5.0)   → 10.0
// Python: maybe_double(None)  → None

// Tuple: Python tuple → Rust tuple
#[pyfunction]
fn swap(pair: (i64, i64)) -> (i64, i64) {
    (pair.1, pair.0)
}
// Python: swap((1, 2))  → (2, 1)`}
      />

      <NoteBlock type="pythonista" title="&str vs String in function args">
        Use <code>&str</code> for input parameters (avoids copying the string).
        Use <code>String</code> when you need to own the data or modify it.
        For return types, always use <code>String</code> — you cannot return
        a reference to data that Python does not own.
      </NoteBlock>

      <h2>Collections</h2>

      <CodeBlock
        language="rust"
        title="Lists, dicts, and sets"
        code={`use pyo3::prelude::*;
use std::collections::{HashMap, HashSet};

// Vec<T> ↔ Python list
#[pyfunction]
fn double_list(values: Vec<f64>) -> Vec<f64> {
    values.iter().map(|x| x * 2.0).collect()
}
// Python: double_list([1.0, 2.0, 3.0]) → [2.0, 4.0, 6.0]

// HashMap<K, V> ↔ Python dict
#[pyfunction]
fn word_count(text: &str) -> HashMap<String, usize> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    counts
}
// Python: word_count("a b a") → {'a': 2, 'b': 1}

// HashSet<T> ↔ Python set
#[pyfunction]
fn unique_words(text: &str) -> HashSet<String> {
    text.split_whitespace()
        .map(|w| w.to_lowercase())
        .collect()
}
// Python: unique_words("the cat the") → {'the', 'cat'}

// Nested collections work too!
#[pyfunction]
fn group_by_first_letter(words: Vec<String>) -> HashMap<char, Vec<String>> {
    let mut groups: HashMap<char, Vec<String>> = HashMap::new();
    for word in words {
        if let Some(first) = word.chars().next() {
            groups.entry(first).or_default().push(word);
        }
    }
    groups
}
// Python: group_by_first_letter(["apple", "banana", "avocado"])
// → {'a': ['apple', 'avocado'], 'b': ['banana']}`}
      />

      <h2>Performance: Conversion Costs</h2>

      <CodeBlock
        language="rust"
        title="Understanding when copies happen"
        code={`use pyo3::prelude::*;
use pyo3::types::PyList;

// SLOW: Converts entire Python list to Vec<f64>
// Copies every element from Python heap to Rust Vec
#[pyfunction]
fn sum_slow(values: Vec<f64>) -> f64 {
    values.iter().sum()
}

// FASTER: Access PyList directly without full conversion
// Iterates Python objects, converts one at a time
#[pyfunction]
fn sum_fast(values: &Bound<'_, PyList>) -> PyResult<f64> {
    let mut total = 0.0;
    for item in values.iter() {
        total += item.extract::<f64>()?;
    }
    Ok(total)
}

// FASTEST for large data: Use numpy via rust-numpy
// Zero-copy access to the underlying array buffer
// (covered in the NumPy Integration section)

// Rule of thumb:
// - Small data (<1000 elements): Vec<T> is fine
// - Medium data: use &Bound<'_, PyList> for read-only
// - Large numerical data: use numpy arrays (zero-copy)`}
      />

      <NoteBlock type="warning" title="Large list conversion is expensive">
        Converting a Python list of 10 million floats to <code>Vec&lt;f64&gt;</code>
        copies all 80MB of data. For large numerical data, use NumPy arrays
        with the <code>rust-numpy</code> crate to get zero-copy access to
        the underlying buffer.
      </NoteBlock>

      <ExerciseBlock
        title="Type Conversion Practice"
        difficulty="intermediate"
        problem={`Write these PyO3 functions with the correct Rust type signatures:

1. capitalize_words(text: str) -> str
   Capitalizes the first letter of each word

2. filter_above(values: list[float], threshold: float = 0.0) -> list[float]
   Returns values above the threshold (with default)

3. merge_dicts(a: dict[str, int], b: dict[str, int]) -> dict[str, int]
   Merges two dicts, summing values for duplicate keys

4. first_n(items: list[str], n: int = 5) -> list[str] | None
   Returns first n items, or None if list is shorter than n

What Rust types would you use for each parameter and return type?`}
        solution={`use pyo3::prelude::*;
use std::collections::HashMap;

// 1. capitalize_words
#[pyfunction]
fn capitalize_words(text: &str) -> String {
    text.split_whitespace()
        .map(|word| {
            let mut chars = word.chars();
            match chars.next() {
                None => String::new(),
                Some(first) => {
                    first.to_uppercase().to_string() + chars.as_str()
                }
            }
        })
        .collect::<Vec<_>>()
        .join(" ")
}
// &str for input (borrow), String for output (owned)

// 2. filter_above with default
#[pyfunction]
#[pyo3(signature = (values, threshold=0.0))]
fn filter_above(values: Vec<f64>, threshold: f64) -> Vec<f64> {
    values.into_iter().filter(|&v| v > threshold).collect()
}
// Vec<f64> for both input and output

// 3. merge_dicts
#[pyfunction]
fn merge_dicts(
    a: HashMap<String, i64>,
    b: HashMap<String, i64>,
) -> HashMap<String, i64> {
    let mut result = a;
    for (key, value) in b {
        *result.entry(key).or_insert(0) += value;
    }
    result
}
// HashMap<String, i64> ↔ dict[str, int]

// 4. first_n with Option return
#[pyfunction]
#[pyo3(signature = (items, n=5))]
fn first_n(items: Vec<String>, n: usize) -> Option<Vec<String>> {
    if items.len() < n {
        None
    } else {
        Some(items.into_iter().take(n).collect())
    }
}
// Option<Vec<String>> → None or list[str] in Python`}
      />
    </div>
  );
}
