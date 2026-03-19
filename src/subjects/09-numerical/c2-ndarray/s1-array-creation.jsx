import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ArrayCreationIndexing() {
  return (
    <div className="prose-rust">
      <h1>Array Creation &amp; Indexing with ndarray</h1>

      <p>
        If you use NumPy, Rust's <code>ndarray</code> crate will feel like
        home. It provides n-dimensional arrays with broadcasting, slicing,
        and element-wise operations — but with Rust's compile-time type
        safety and zero-copy performance. The API is designed to mirror
        NumPy wherever possible.
      </p>

      <ConceptBlock title="ndarray = Rust's NumPy">
        <p>
          The <code>ndarray</code> crate provides <code>Array1&lt;T&gt;</code> (1D),{' '}
          <code>Array2&lt;T&gt;</code> (2D), and <code>ArrayD&lt;T&gt;</code>
          (dynamic dimensions). Unlike NumPy, the element type is known at
          compile time, so there is no dtype mismatch at runtime. Arrays are
          stored in contiguous memory, just like NumPy's C-order arrays.
        </p>
      </ConceptBlock>

      <h2>Creating Arrays</h2>

      <PythonRustCompare
        title="Array creation patterns"
        description="ndarray mirrors NumPy's array creation functions closely."
        pythonCode={`import numpy as np

# From a list
a = np.array([1.0, 2.0, 3.0, 4.0])

# Zeros and ones
zeros = np.zeros(5)
ones = np.ones((3, 4))

# Range and linspace
r = np.arange(0, 10, 2)       # [0, 2, 4, 6, 8]
l = np.linspace(0, 1, 5)      # [0, 0.25, 0.5, 0.75, 1]

# 2D array
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
print(matrix.shape)  # (2, 3)

# Identity matrix
eye = np.eye(3)

# Reshape
flat = np.arange(12)
grid = flat.reshape(3, 4)`}
        rustCode={`use ndarray::{array, Array, Array1, Array2};

fn main() {
    // From a slice (macro)
    let a = array![1.0, 2.0, 3.0, 4.0];

    // Zeros and ones
    let zeros = Array1::<f64>::zeros(5);
    let ones = Array2::<f64>::ones((3, 4));

    // Range
    let r = Array::range(0., 10., 2.);  // [0, 2, 4, 6, 8]
    let l = Array::linspace(0., 1., 5); // [0, 0.25, 0.5, 0.75, 1]

    // 2D array
    let matrix = array![[1, 2, 3],
                        [4, 5, 6]];
    println!("shape: {:?}", matrix.shape()); // [2, 3]

    // Identity matrix
    let eye = Array2::<f64>::eye(3);

    // Reshape
    let flat = Array::range(0., 12., 1.);
    let grid = flat.into_shape_with_order((3, 4)).unwrap();
    println!("{:?}", grid);
}`}
      />

      <NoteBlock type="pythonista" title="Type safety catches dtype bugs">
        In NumPy, <code>np.array([1, 2, 3])</code> gives you int64, but{' '}
        <code>np.array([1.0, 2, 3])</code> silently upcasts to float64. In
        Rust, the element type is explicit: <code>Array1&lt;f64&gt;</code> vs{' '}
        <code>Array1&lt;i32&gt;</code>. Type mismatches are compile errors,
        not silent coercions that cause subtle bugs downstream.
      </NoteBlock>

      <h2>Indexing and Slicing</h2>

      <PythonRustCompare
        title="Accessing array elements"
        description="ndarray uses similar bracket syntax and slice notation."
        pythonCode={`import numpy as np

a = np.array([10, 20, 30, 40, 50])

# Single element
print(a[0])      # 10
print(a[-1])     # 50

# Slicing
print(a[1:4])    # [20, 30, 40]
print(a[::2])    # [10, 30, 50]

# 2D indexing
m = np.arange(12).reshape(3, 4)
print(m[1, 2])     # 6
print(m[0, :])     # [0, 1, 2, 3] — first row
print(m[:, 1])     # [1, 5, 9] — second column
print(m[1:, :2])   # submatrix`}
        rustCode={`use ndarray::{array, s, Array};

fn main() {
    let a = array![10, 20, 30, 40, 50];

    // Single element
    println!("{}", a[0]);       // 10
    println!("{}", a[4]);       // 50

    // Slicing with s![] macro
    println!("{}", a.slice(s![1..4]));   // [20, 30, 40]
    println!("{}", a.slice(s![..;2]));   // [10, 30, 50]

    // 2D indexing
    let m = Array::range(0., 12., 1.)
        .into_shape_with_order((3, 4)).unwrap();
    println!("{}", m[[1, 2]]);           // 6
    println!("{}", m.slice(s![0, ..]));  // [0, 1, 2, 3]
    println!("{}", m.slice(s![.., 1]));  // [1, 5, 9]
    println!("{}", m.slice(s![1.., ..2])); // submatrix
}`}
      />

      <h2>Element-wise Operations</h2>

      <CodeBlock
        language="rust"
        title="Arithmetic and mathematical operations"
        code={`use ndarray::array;

fn main() {
    let a = array![1.0, 2.0, 3.0, 4.0];
    let b = array![10.0, 20.0, 30.0, 40.0];

    // Element-wise arithmetic (like NumPy)
    let sum = &a + &b;          // [11, 22, 33, 44]
    let product = &a * &b;      // [10, 40, 90, 160]
    let scaled = &a * 2.0;      // [2, 4, 6, 8]

    // Mathematical functions with mapv
    let squared = a.mapv(|x| x * x);     // [1, 4, 9, 16]
    let roots = a.mapv(|x| x.sqrt());    // [1, 1.41, 1.73, 2]
    let logs = a.mapv(|x| x.ln());       // [0, 0.69, 1.1, 1.39]

    // Reductions
    let total: f64 = a.sum();             // 10.0
    let mean: f64 = a.mean().unwrap();    // 2.5
    let max: f64 = *a.iter().max_by(
        |x, y| x.partial_cmp(y).unwrap()
    ).unwrap();                            // 4.0

    // Dot product
    let dot: f64 = a.dot(&b);            // 300.0

    println!("sum:     {:?}", sum);
    println!("product: {:?}", product);
    println!("dot:     {}", dot);
    println!("mean:    {}", mean);
}`}
      />

      <NoteBlock type="tip" title="Use & for borrowing in operations">
        Notice the <code>&a + &b</code> syntax. The <code>&</code> borrows the
        arrays so they are not consumed. Without it, <code>a + b</code> would
        move both arrays and you could not use them again. This is a common
        pattern when chaining operations.
      </NoteBlock>

      <h2>Cargo.toml Setup</h2>

      <CodeBlock
        language="toml"
        title="Adding ndarray"
        code={`[dependencies]
ndarray = "0.16"

# Optional: BLAS acceleration (like NumPy's LAPACK)
# ndarray-linalg = { version = "0.16", features = ["openblas-static"] }`}
      />

      <ExerciseBlock
        title="Statistics from Scratch"
        difficulty="intermediate"
        problem={`Using ndarray, compute the following for the array [2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0]:

1. Mean (should be 5.0)
2. Variance: mean of (x - mean)^2 (should be 4.0)
3. Standard deviation: sqrt of variance (should be 2.0)
4. Normalized array: (x - mean) / std (z-scores)

Hint: Use mapv to apply functions element-wise and .mean() for the mean.`}
        solution={`use ndarray::array;

fn main() {
    let data = array![2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0];

    // 1. Mean
    let mean = data.mean().unwrap();
    println!("Mean: {}", mean); // 5.0

    // 2. Variance: mean of squared deviations
    let deviations = data.mapv(|x| (x - mean).powi(2));
    let variance = deviations.mean().unwrap();
    println!("Variance: {}", variance); // 4.0

    // 3. Standard deviation
    let std_dev = variance.sqrt();
    println!("Std dev: {}", std_dev); // 2.0

    // 4. Z-scores: (x - mean) / std
    let z_scores = data.mapv(|x| (x - mean) / std_dev);
    println!("Z-scores: {:.2?}", z_scores);
    // [-1.50, -0.50, -0.50, -0.50, 0.00, 0.00, 1.00, 2.00]

    // Verify: z-scores should have mean≈0, std≈1
    let z_mean = z_scores.mean().unwrap();
    let z_var = z_scores.mapv(|x| (x - z_mean).powi(2))
        .mean().unwrap();
    println!("Z mean: {:.6}, Z std: {:.6}", z_mean, z_var.sqrt());
}`}
      />
    </div>
  );
}
