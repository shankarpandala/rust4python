import{j as e}from"./vendor-Dh_dlHsl.js";import{C as n,P as o,N as s,a as t,E as r}from"./subject-01-getting-started-DoSDK0Fn.js";function i(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"What Is PyO3"}),e.jsx("p",{children:"PyO3 is the bridge between Python and Rust. It lets you write Rust functions and classes that can be imported directly from Python — just like any other Python module. If you have ever wanted to replace a slow Python function with a fast Rust implementation without changing your Python code, PyO3 is how you do it."}),e.jsxs(n,{title:"PyO3 in the Ecosystem",children:[e.jsx("p",{children:"PyO3 is what powers the Rust-backed Python tools you already use. Polars, Ruff, tiktoken, tokenizers, cryptography, orjson, and pydantic-core are all built with PyO3. It handles the complexity of Python's C API, reference counting, GIL management, and type conversions so you can focus on writing fast Rust code."}),e.jsxs("p",{children:["Combined with ",e.jsx("code",{children:"maturin"})," (a build tool), you can go from Rust code to an installable Python package in minutes."]})]}),e.jsx("h2",{children:"Your First PyO3 Function"}),e.jsx(o,{title:"From Python to Rust and back",description:"Write Rust, import from Python. The function signature maps directly.",pythonCode:`# Pure Python implementation (slow)
def sum_of_squares(n: int) -> int:
    """Sum of squares from 0 to n-1"""
    return sum(i * i for i in range(n))

result = sum_of_squares(10_000_000)
print(result)
# Takes ~1.5 seconds

# After creating the Rust extension:
# from my_rust_lib import sum_of_squares
# result = sum_of_squares(10_000_000)
# Takes ~0.015 seconds (100x faster!)`,rustCode:`use pyo3::prelude::*;

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
// 333333283333335000000`}),e.jsxs(s,{type:"pythonista",title:"It looks like a normal Python import",children:["The magic of PyO3 is that from Python's perspective, your Rust code is just a normal module. ",e.jsx("code",{children:"from my_rust_lib import sum_of_squares"}),"works exactly like importing from any other package. Help, docstrings, and type hints all work as expected."]}),e.jsx("h2",{children:"Project Setup with maturin"}),e.jsx(t,{language:"bash",title:"Creating a new PyO3 project",code:`# Install maturin (the build tool for PyO3)
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
python -c "from my_rust_lib import sum_of_squares; print(sum_of_squares(100))"`}),e.jsx(t,{language:"toml",title:"Cargo.toml for a PyO3 project",code:`[package]
name = "my_rust_lib"
version = "0.1.0"
edition = "2021"

[lib]
name = "my_rust_lib"
crate-type = ["cdylib"]  # Required: creates a shared library

[dependencies]
pyo3 = { version = "0.23", features = ["extension-module"] }`}),e.jsx("h2",{children:"How PyO3 Works Under the Hood"}),e.jsx(t,{language:"rust",title:"What the #[pyfunction] macro generates",code:`// When you write:
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
// In Python: divide(1.0, 0.0) raises ValueError("Division by zero")`}),e.jsxs(s,{type:"tip",title:"maturin develop for fast iteration",children:["During development, use ",e.jsx("code",{children:"maturin develop --release"})," to rebuild and reinstall your package. It takes a few seconds and you can immediately test changes from Python. Add ",e.jsx("code",{children:"--release"}),"for optimized builds (much faster code, slightly slower compilation)."]}),e.jsx("h2",{children:"Real-World Use Case: Speeding Up Data Processing"}),e.jsx(t,{language:"rust",title:"A practical PyO3 function for text processing",code:`use pyo3::prelude::*;
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
// print(counts)  # {'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1}`}),e.jsx(r,{title:"Plan Your First Extension",difficulty:"beginner",problem:`Think about your Python codebase and identify:

1. A function that processes data in a loop (e.g., parsing, transforming, computing)
2. Write out its Python signature and what it does
3. Sketch the Rust equivalent using #[pyfunction]
4. What types would you use? (Python int -> i64, str -> &str, list -> Vec, dict -> HashMap)

Example: A function that finds all prime numbers up to N.

Python: def find_primes(n: int) -> list[int]: ...
Rust:   #[pyfunction] fn find_primes(n: u64) -> Vec<u64> { ... }

Set up a project with maturin and implement your function.`,solution:`# Example: Finding primes (Sieve of Eratosthenes)

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
// 78498 primes under 1 million`})]})}const d=Object.freeze(Object.defineProperty({__proto__:null,default:i},Symbol.toStringTag,{value:"Module"}));function a(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"#[pyfunction] & #[pyclass]"}),e.jsxs("p",{children:["PyO3's two most important macros are ",e.jsx("code",{children:"#[pyfunction]"})," for exposing Rust functions to Python, and ",e.jsx("code",{children:"#[pyclass]"})," for exposing Rust structs as Python classes. Together, they let you build complete Python APIs backed by Rust — with methods, properties, magic methods, and inheritance."]}),e.jsx(n,{title:"Functions and Classes",children:e.jsxs("p",{children:[e.jsx("code",{children:"#[pyfunction]"})," converts a Rust function into something Python can call. ",e.jsx("code",{children:"#[pyclass]"})," makes a Rust struct behave like a Python class, complete with ",e.jsx("code",{children:"__init__"}),", methods, properties, and dunder methods. PyO3 handles all the type conversions automatically."]})}),e.jsx("h2",{children:"Advanced #[pyfunction] Features"}),e.jsx(t,{language:"rust",title:"Function signatures, defaults, and keyword arguments",code:`use pyo3::prelude::*;

/// Simple function with docstring
#[pyfunction]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

/// Function with default arguments
#[pyfunction]
#[pyo3(signature = (data, scale=1.0, offset=0.0))]
fn normalize(data: Vec<f64>, scale: f64, offset: f64) -> Vec<f64> {
    data.iter().map(|&x| x * scale + offset).collect()
}

/// Function with *args and **kwargs
#[pyfunction]
#[pyo3(signature = (*args, **kwargs))]
fn flexible(
    args: &Bound<'_, pyo3::types::PyTuple>,
    kwargs: Option<&Bound<'_, pyo3::types::PyDict>>,
) -> PyResult<String> {
    let mut result = format!("args: {:?}", args);
    if let Some(kw) = kwargs {
        result.push_str(&format!(", kwargs: {:?}", kw));
    }
    Ok(result)
}

/// Return None or a value (like Python's Optional)
#[pyfunction]
fn find_first_above(data: Vec<f64>, threshold: f64) -> Option<f64> {
    data.into_iter().find(|&x| x > threshold)
    // Returns None in Python if not found
}

#[pymodule]
fn my_lib(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(greet, m)?)?;
    m.add_function(wrap_pyfunction!(normalize, m)?)?;
    m.add_function(wrap_pyfunction!(flexible, m)?)?;
    m.add_function(wrap_pyfunction!(find_first_above, m)?)?;
    Ok(())
}`}),e.jsx("h2",{children:"#[pyclass] — Rust Structs as Python Classes"}),e.jsx(o,{title:"Defining a Python class in Rust",description:"The Rust struct becomes a Python class with methods, properties, and constructors.",pythonCode:`# What Python developers write and expect:

class DataProcessor:
    def __init__(self, name: str, scale: float = 1.0):
        self.name = name
        self.scale = scale
        self._data = []

    @property
    def count(self) -> int:
        return len(self._data)

    def add(self, value: float):
        self._data.append(value * self.scale)

    def mean(self) -> float | None:
        if not self._data:
            return None
        return sum(self._data) / len(self._data)

    def __repr__(self) -> str:
        return f"DataProcessor('{self.name}', n={self.count})"

    def __len__(self) -> int:
        return self.count

proc = DataProcessor("sensor", scale=2.0)
proc.add(1.0)
proc.add(2.0)
print(proc.mean())  # 3.0
print(repr(proc))   # DataProcessor('sensor', n=2)`,rustCode:`use pyo3::prelude::*;

#[pyclass]
struct DataProcessor {
    #[pyo3(get)]  // readable from Python
    name: String,
    #[pyo3(get, set)]  // readable and writable
    scale: f64,
    data: Vec<f64>,
}

#[pymethods]
impl DataProcessor {
    #[new]
    #[pyo3(signature = (name, scale=1.0))]
    fn new(name: String, scale: f64) -> Self {
        DataProcessor { name, scale, data: vec![] }
    }

    #[getter]
    fn count(&self) -> usize {
        self.data.len()
    }

    fn add(&mut self, value: f64) {
        self.data.push(value * self.scale);
    }

    fn mean(&self) -> Option<f64> {
        if self.data.is_empty() {
            None
        } else {
            Some(self.data.iter().sum::<f64>()
                 / self.data.len() as f64)
        }
    }

    fn __repr__(&self) -> String {
        format!("DataProcessor('{}', n={})",
                self.name, self.data.len())
    }

    fn __len__(&self) -> usize {
        self.data.len()
    }
}

#[pymodule]
fn my_lib(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<DataProcessor>()?;
    Ok(())
}`}),e.jsxs(s,{type:"pythonista",title:"Dunder methods just work",children:["PyO3 supports most Python dunder methods: ",e.jsx("code",{children:"__repr__"}),","," ",e.jsx("code",{children:"__str__"}),", ",e.jsx("code",{children:"__len__"}),", ",e.jsx("code",{children:"__getitem__"}),","," ",e.jsx("code",{children:"__iter__"}),", ",e.jsx("code",{children:"__add__"}),", ",e.jsx("code",{children:"__eq__"}),",",e.jsx("code",{children:"__hash__"}),", and more. Just implement them as methods in the ",e.jsx("code",{children:"#[pymethods]"})," block and they work exactly as Python expects."]}),e.jsx("h2",{children:"Error Handling"}),e.jsx(t,{language:"rust",title:"Raising Python exceptions from Rust",code:`use pyo3::prelude::*;
use pyo3::exceptions::{PyValueError, PyTypeError, PyIOError};

#[pyfunction]
fn safe_divide(a: f64, b: f64) -> PyResult<f64> {
    if b == 0.0 {
        // Raises ValueError in Python
        Err(PyValueError::new_err("Cannot divide by zero"))
    } else if a.is_nan() || b.is_nan() {
        Err(PyTypeError::new_err("NaN values not allowed"))
    } else {
        Ok(a / b)
    }
}

#[pyfunction]
fn read_data(path: &str) -> PyResult<Vec<f64>> {
    let content = std::fs::read_to_string(path)
        .map_err(|e| PyIOError::new_err(
            format!("Cannot read '{}': {}", path, e)
        ))?;

    content.lines()
        .map(|line| {
            line.trim().parse::<f64>()
                .map_err(|_| PyValueError::new_err(
                    format!("Cannot parse '{}' as float", line)
                ))
        })
        .collect()
}

// In Python:
// >>> safe_divide(1.0, 0.0)
// ValueError: Cannot divide by zero
//
// >>> read_data("missing.txt")
// OSError: Cannot read 'missing.txt': No such file or directory`}),e.jsx("h2",{children:"Static Methods and Class Methods"}),e.jsx(t,{language:"rust",title:"Factory patterns and alternative constructors",code:`use pyo3::prelude::*;

#[pyclass]
struct Matrix {
    rows: usize,
    cols: usize,
    data: Vec<f64>,
}

#[pymethods]
impl Matrix {
    #[new]
    fn new(rows: usize, cols: usize) -> Self {
        Matrix {
            rows, cols,
            data: vec![0.0; rows * cols],
        }
    }

    /// Alternative constructor (like classmethod)
    #[staticmethod]
    fn zeros(rows: usize, cols: usize) -> Self {
        Matrix::new(rows, cols)
    }

    #[staticmethod]
    fn ones(rows: usize, cols: usize) -> Self {
        Matrix {
            rows, cols,
            data: vec![1.0; rows * cols],
        }
    }

    #[staticmethod]
    fn from_list(rows: usize, cols: usize, data: Vec<f64>) -> PyResult<Self> {
        if data.len() != rows * cols {
            return Err(pyo3::exceptions::PyValueError::new_err(
                format!("Expected {} elements, got {}", rows * cols, data.len())
            ));
        }
        Ok(Matrix { rows, cols, data })
    }

    fn shape(&self) -> (usize, usize) {
        (self.rows, self.cols)
    }

    fn __repr__(&self) -> String {
        format!("Matrix({}x{})", self.rows, self.cols)
    }
}

// In Python:
// m1 = Matrix(3, 4)           # constructor
// m2 = Matrix.zeros(3, 4)     # static method
// m3 = Matrix.ones(2, 3)      # static method
// m4 = Matrix.from_list(2, 2, [1, 2, 3, 4])`}),e.jsx(r,{title:"Build a Statistics Class",difficulty:"intermediate",problem:`Create a #[pyclass] called RunningStats that:

1. Has a #[new] constructor with no arguments
2. Has an add(&mut self, value: f64) method to add values
3. Has a mean(&self) -> Option<f64> method
4. Has a variance(&self) -> Option<f64> method (population variance)
5. Has a #[getter] count(&self) -> usize property
6. Implements __repr__ showing the count and mean
7. Implements __len__ returning the count

Internal state: store sum, sum_of_squares, and count (no need to store all values — this is the streaming/online algorithm).

Test from Python:
  stats = RunningStats()
  for x in [2, 4, 4, 4, 5, 5, 7, 9]:
      stats.add(float(x))
  print(stats.mean())      # 5.0
  print(stats.variance())  # 4.0`,solution:`use pyo3::prelude::*;

#[pyclass]
struct RunningStats {
    sum: f64,
    sum_sq: f64,
    n: usize,
}

#[pymethods]
impl RunningStats {
    #[new]
    fn new() -> Self {
        RunningStats { sum: 0.0, sum_sq: 0.0, n: 0 }
    }

    fn add(&mut self, value: f64) {
        self.sum += value;
        self.sum_sq += value * value;
        self.n += 1;
    }

    fn mean(&self) -> Option<f64> {
        if self.n == 0 { None }
        else { Some(self.sum / self.n as f64) }
    }

    fn variance(&self) -> Option<f64> {
        if self.n == 0 { return None; }
        let mean = self.sum / self.n as f64;
        // Var = E[X^2] - (E[X])^2
        let mean_sq = self.sum_sq / self.n as f64;
        Some(mean_sq - mean * mean)
    }

    #[getter]
    fn count(&self) -> usize {
        self.n
    }

    fn __repr__(&self) -> String {
        match self.mean() {
            Some(m) => format!("RunningStats(n={}, mean={:.2})", self.n, m),
            None => "RunningStats(n=0)".to_string(),
        }
    }

    fn __len__(&self) -> usize {
        self.n
    }
}

#[pymodule]
fn stats_lib(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<RunningStats>()?;
    Ok(())
}`})]})}const f=Object.freeze(Object.defineProperty({__proto__:null,default:a},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Python ↔ Rust Type Mapping"}),e.jsx("p",{children:"The most important skill in PyO3 development is understanding how Python types map to Rust types. Every function argument is converted from a Python object to a Rust value, and every return value goes the other way. PyO3 handles most conversions automatically, but knowing the rules prevents surprises."}),e.jsx(n,{title:"The Conversion Rules",children:e.jsxs("p",{children:["PyO3 performs automatic type conversion at function boundaries. When Python calls your Rust function, each argument is extracted from a ",e.jsx("code",{children:"PyObject"})," and converted to the declared Rust type. When your function returns, the Rust value is converted back to a Python object. If a conversion fails, PyO3 raises a"," ",e.jsx("code",{children:"TypeError"})," automatically."]})}),e.jsx("h2",{children:"Type Mapping Reference"}),e.jsx(t,{language:"rust",title:"Python ↔ Rust type correspondence",code:`// Python type      →  Rust type         →  Python type
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
// &PyAny            →  Bound<'_, PyAny>  →  (reference to any)`}),e.jsx("h2",{children:"Primitives and Strings"}),e.jsx(o,{title:"Basic type conversions",description:"Primitives convert automatically. Strings have two options: owned String or borrowed &str.",pythonCode:`# When you call from Python:
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
result = process(None)  # if Rust expects Option<i64>`,rustCode:`use pyo3::prelude::*;

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
// Python: swap((1, 2))  → (2, 1)`}),e.jsxs(s,{type:"pythonista",title:"&str vs String in function args",children:["Use ",e.jsx("code",{children:"&str"})," for input parameters (avoids copying the string). Use ",e.jsx("code",{children:"String"})," when you need to own the data or modify it. For return types, always use ",e.jsx("code",{children:"String"})," — you cannot return a reference to data that Python does not own."]}),e.jsx("h2",{children:"Collections"}),e.jsx(t,{language:"rust",title:"Lists, dicts, and sets",code:`use pyo3::prelude::*;
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
// → {'a': ['apple', 'avocado'], 'b': ['banana']}`}),e.jsx("h2",{children:"Performance: Conversion Costs"}),e.jsx(t,{language:"rust",title:"Understanding when copies happen",code:`use pyo3::prelude::*;
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
// - Large numerical data: use numpy arrays (zero-copy)`}),e.jsxs(s,{type:"warning",title:"Large list conversion is expensive",children:["Converting a Python list of 10 million floats to ",e.jsx("code",{children:"Vec<f64>"}),"copies all 80MB of data. For large numerical data, use NumPy arrays with the ",e.jsx("code",{children:"rust-numpy"})," crate to get zero-copy access to the underlying buffer."]}),e.jsx(r,{title:"Type Conversion Practice",difficulty:"intermediate",problem:`Write these PyO3 functions with the correct Rust type signatures:

1. capitalize_words(text: str) -> str
   Capitalizes the first letter of each word

2. filter_above(values: list[float], threshold: float = 0.0) -> list[float]
   Returns values above the threshold (with default)

3. merge_dicts(a: dict[str, int], b: dict[str, int]) -> dict[str, int]
   Merges two dicts, summing values for duplicate keys

4. first_n(items: list[str], n: int = 5) -> list[str] | None
   Returns first n items, or None if list is shorter than n

What Rust types would you use for each parameter and return type?`,solution:`use pyo3::prelude::*;
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
// Option<Vec<String>> → None or list[str] in Python`})]})}const p=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));export{f as a,p as b,d as s};
