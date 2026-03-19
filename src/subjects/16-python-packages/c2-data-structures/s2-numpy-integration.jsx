import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function NumpyIntegration() {
  return (
    <div className="prose-rust">
      <h1>NumPy Integration with rust-numpy</h1>

      <p>
        The biggest performance bottleneck in PyO3 is converting Python lists
        to Rust vectors — it copies every element. For numerical data, the{' '}
        <code>rust-numpy</code> crate eliminates this entirely by giving Rust
        direct, zero-copy access to NumPy array buffers. Your Rust code reads
        and writes the same memory that NumPy allocated.
      </p>

      <ConceptBlock title="Zero-Copy NumPy Access">
        <p>
          NumPy arrays store data in contiguous C-style buffers. The{' '}
          <code>rust-numpy</code> crate provides <code>PyReadonlyArray</code>
          for read access and <code>PyReadwriteArray</code> for write access
          to these buffers. No data is copied — Rust operates directly on
          NumPy's memory. This is the same technique used by Polars, tiktoken,
          and other high-performance Python extensions.
        </p>
      </ConceptBlock>

      <h2>Reading NumPy Arrays</h2>

      <PythonRustCompare
        title="Processing NumPy data in Rust"
        description="Zero-copy access means no conversion overhead, even for million-element arrays."
        pythonCode={`import numpy as np
from my_lib import fast_sum, fast_normalize

# Create a large NumPy array
data = np.random.rand(10_000_000)

# Call Rust function — no copy!
# The Rust code reads NumPy's memory directly
total = fast_sum(data)
print(f"Sum: {total:.4f}")

# In-place modification — Rust writes to NumPy's buffer
fast_normalize(data)  # modifies data in place
print(f"Mean after normalize: {data.mean():.6f}")
# Should be approximately 0.0`}
        rustCode={`use pyo3::prelude::*;
use numpy::{PyReadonlyArray1, PyReadwriteArray1, PyArray1};

/// Sum a NumPy array — zero-copy read access
#[pyfunction]
fn fast_sum(array: PyReadonlyArray1<'_, f64>) -> f64 {
    let slice = array.as_slice().unwrap();
    // 'slice' points directly to NumPy's memory
    // No copy occurred!
    slice.iter().sum()
}

/// Normalize in place — zero-copy write access
#[pyfunction]
fn fast_normalize(mut array: PyReadwriteArray1<'_, f64>) {
    let slice = array.as_slice_mut().unwrap();

    // Compute mean
    let n = slice.len() as f64;
    let mean = slice.iter().sum::<f64>() / n;
    let std = (slice.iter()
        .map(|&x| (x - mean).powi(2))
        .sum::<f64>() / n).sqrt();

    // Modify in place — writes to NumPy's buffer!
    for x in slice.iter_mut() {
        *x = (*x - mean) / std;
    }
}

#[pymodule]
fn my_lib(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(fast_sum, m)?)?;
    m.add_function(wrap_pyfunction!(fast_normalize, m)?)?;
    Ok(())
}`}
      />

      <NoteBlock type="pythonista" title="This is how Polars works">
        When you pass a NumPy array or Pandas column to Polars, it often
        accesses the underlying buffer directly using the same zero-copy
        mechanism. This is why Polars can process DataFrames without doubling
        memory usage — it reads the data where it already is.
      </NoteBlock>

      <h2>Returning NumPy Arrays</h2>

      <CodeBlock
        language="rust"
        title="Creating new NumPy arrays from Rust"
        code={`use pyo3::prelude::*;
use numpy::{PyArray1, PyArray2, IntoPyArray};
use ndarray::{Array1, Array2};

/// Return a new 1D NumPy array
#[pyfunction]
fn linspace<'py>(
    py: Python<'py>,
    start: f64,
    end: f64,
    n: usize,
) -> Bound<'py, PyArray1<f64>> {
    let step = (end - start) / (n - 1) as f64;
    let data: Vec<f64> = (0..n)
        .map(|i| start + i as f64 * step)
        .collect();
    // Converts Vec to NumPy array (one copy, then NumPy owns it)
    PyArray1::from_vec(py, data)
}

/// Return a 2D NumPy array using ndarray
#[pyfunction]
fn random_matrix<'py>(
    py: Python<'py>,
    rows: usize,
    cols: usize,
) -> Bound<'py, PyArray2<f64>> {
    // Use ndarray for 2D operations
    let array = Array2::from_shape_fn((rows, cols), |(i, j)| {
        ((i * cols + j) as f64 * 0.618).sin()
    });
    // Convert ndarray to NumPy array
    array.into_pyarray(py)
}

/// Element-wise operation returning a new array
#[pyfunction]
fn softmax<'py>(
    py: Python<'py>,
    logits: numpy::PyReadonlyArray1<'_, f64>,
) -> Bound<'py, PyArray1<f64>> {
    let slice = logits.as_slice().unwrap();
    let max = slice.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    let exp_sum: f64 = slice.iter().map(|&x| (x - max).exp()).sum();
    let result: Vec<f64> = slice.iter()
        .map(|&x| (x - max).exp() / exp_sum)
        .collect();
    PyArray1::from_vec(py, result)
}

#[pymodule]
fn my_lib(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(linspace, m)?)?;
    m.add_function(wrap_pyfunction!(random_matrix, m)?)?;
    m.add_function(wrap_pyfunction!(softmax, m)?)?;
    Ok(())
}`}
      />

      <h2>2D Array Operations</h2>

      <CodeBlock
        language="rust"
        title="Working with 2D NumPy arrays"
        code={`use pyo3::prelude::*;
use numpy::{PyReadonlyArray2, PyArray1, PyArray2};

/// Row-wise sum of a 2D array
#[pyfunction]
fn row_sums<'py>(
    py: Python<'py>,
    matrix: PyReadonlyArray2<'_, f64>,
) -> Bound<'py, PyArray1<f64>> {
    let array = matrix.as_array();
    let sums: Vec<f64> = array.rows().into_iter()
        .map(|row| row.sum())
        .collect();
    PyArray1::from_vec(py, sums)
}

/// Matrix-vector multiply
#[pyfunction]
fn matvec<'py>(
    py: Python<'py>,
    matrix: PyReadonlyArray2<'_, f64>,
    vector: numpy::PyReadonlyArray1<'_, f64>,
) -> Bound<'py, PyArray1<f64>> {
    let mat = matrix.as_array();
    let vec = vector.as_array();
    let result: Vec<f64> = mat.rows().into_iter()
        .map(|row| row.dot(&vec))
        .collect();
    PyArray1::from_vec(py, result)
}

// Python usage:
// import numpy as np
// m = np.array([[1, 2], [3, 4]], dtype=np.float64)
// v = np.array([1, 1], dtype=np.float64)
// result = matvec(m, v)  # [3.0, 7.0]`}
      />

      <NoteBlock type="warning" title="Dtype must match">
        If your Rust function expects <code>PyReadonlyArray1&lt;f64&gt;</code>,
        the NumPy array must have dtype <code>float64</code>. Passing a
        <code>float32</code> or <code>int64</code> array will raise a{' '}
        <code>TypeError</code>. Use <code>.astype(np.float64)</code> on the
        Python side, or accept multiple types with generics.
      </NoteBlock>

      <CodeBlock
        language="toml"
        title="Cargo.toml"
        code={`[dependencies]
pyo3 = { version = "0.23", features = ["extension-module"] }
numpy = "0.23"       # rust-numpy crate
ndarray = "0.16"     # for 2D array operations`}
      />

      <ExerciseBlock
        title="Build a Fast Distance Matrix"
        difficulty="advanced"
        problem={`Write a PyO3 function that computes the Euclidean distance matrix between N points:

1. Input: 2D NumPy array of shape (n, d) — n points in d dimensions
2. Output: 2D NumPy array of shape (n, n) — distance[i][j] = euclidean distance between point i and j

Use PyReadonlyArray2 for input and return a new PyArray2.

Test with:
  points = np.array([[0, 0], [1, 0], [0, 1]], dtype=np.float64)
  dists = distance_matrix(points)
  # Expected: [[0, 1, 1], [1, 0, 1.414], [1, 1.414, 0]]

Bonus: parallelize the outer loop with rayon.`}
        solution={`use pyo3::prelude::*;
use numpy::{PyReadonlyArray2, PyArray2};

#[pyfunction]
fn distance_matrix<'py>(
    py: Python<'py>,
    points: PyReadonlyArray2<'_, f64>,
) -> Bound<'py, PyArray2<f64>> {
    let arr = points.as_array();
    let n = arr.nrows();
    let d = arr.ncols();

    let mut distances = vec![0.0_f64; n * n];

    for i in 0..n {
        for j in i+1..n {
            let dist: f64 = (0..d)
                .map(|k| (arr[[i, k]] - arr[[j, k]]).powi(2))
                .sum::<f64>()
                .sqrt();
            distances[i * n + j] = dist;
            distances[j * n + i] = dist; // symmetric
        }
    }

    let array = ndarray::Array2::from_shape_vec((n, n), distances)
        .unwrap();
    numpy::IntoPyArray::into_pyarray(array, py)
}

// With rayon parallelism:
// use rayon::prelude::*;
// let distances: Vec<f64> = (0..n)
//     .into_par_iter()
//     .flat_map(|i| {
//         (0..n).map(move |j| {
//             if i == j { return 0.0; }
//             (0..d).map(|k| (arr[[i,k]] - arr[[j,k]]).powi(2))
//                   .sum::<f64>().sqrt()
//         }).collect::<Vec<_>>()
//     })
//     .collect();`}
      />
    </div>
  );
}
