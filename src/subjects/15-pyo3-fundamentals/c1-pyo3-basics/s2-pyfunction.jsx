import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function PyFunctionPyClass() {
  return (
    <div className="prose-rust">
      <h1>#[pyfunction] &amp; #[pyclass]</h1>

      <p>
        PyO3's two most important macros are <code>#[pyfunction]</code> for
        exposing Rust functions to Python, and <code>#[pyclass]</code> for
        exposing Rust structs as Python classes. Together, they let you
        build complete Python APIs backed by Rust — with methods, properties,
        magic methods, and inheritance.
      </p>

      <ConceptBlock title="Functions and Classes">
        <p>
          <code>#[pyfunction]</code> converts a Rust function into something
          Python can call. <code>#[pyclass]</code> makes a Rust struct
          behave like a Python class, complete with <code>__init__</code>,
          methods, properties, and dunder methods. PyO3 handles all the
          type conversions automatically.
        </p>
      </ConceptBlock>

      <h2>Advanced #[pyfunction] Features</h2>

      <CodeBlock
        language="rust"
        title="Function signatures, defaults, and keyword arguments"
        code={`use pyo3::prelude::*;

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
}`}
      />

      <h2>#[pyclass] — Rust Structs as Python Classes</h2>

      <PythonRustCompare
        title="Defining a Python class in Rust"
        description="The Rust struct becomes a Python class with methods, properties, and constructors."
        pythonCode={`# What Python developers write and expect:

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
print(repr(proc))   # DataProcessor('sensor', n=2)`}
        rustCode={`use pyo3::prelude::*;

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
}`}
      />

      <NoteBlock type="pythonista" title="Dunder methods just work">
        PyO3 supports most Python dunder methods: <code>__repr__</code>,{' '}
        <code>__str__</code>, <code>__len__</code>, <code>__getitem__</code>,{' '}
        <code>__iter__</code>, <code>__add__</code>, <code>__eq__</code>,
        <code>__hash__</code>, and more. Just implement them as methods in
        the <code>#[pymethods]</code> block and they work exactly as Python
        expects.
      </NoteBlock>

      <h2>Error Handling</h2>

      <CodeBlock
        language="rust"
        title="Raising Python exceptions from Rust"
        code={`use pyo3::prelude::*;
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
// OSError: Cannot read 'missing.txt': No such file or directory`}
      />

      <h2>Static Methods and Class Methods</h2>

      <CodeBlock
        language="rust"
        title="Factory patterns and alternative constructors"
        code={`use pyo3::prelude::*;

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
// m4 = Matrix.from_list(2, 2, [1, 2, 3, 4])`}
      />

      <ExerciseBlock
        title="Build a Statistics Class"
        difficulty="intermediate"
        problem={`Create a #[pyclass] called RunningStats that:

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
  print(stats.variance())  # 4.0`}
        solution={`use pyo3::prelude::*;

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
}`}
      />
    </div>
  );
}
