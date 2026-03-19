import{j as e}from"./vendor-Dh_dlHsl.js";import{C as t,P as n,N as a,a as r,E as i}from"./subject-01-getting-started-DoSDK0Fn.js";function s(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Array Creation & Indexing with ndarray"}),e.jsxs("p",{children:["If you use NumPy, Rust's ",e.jsx("code",{children:"ndarray"})," crate will feel like home. It provides n-dimensional arrays with broadcasting, slicing, and element-wise operations — but with Rust's compile-time type safety and zero-copy performance. The API is designed to mirror NumPy wherever possible."]}),e.jsx(t,{title:"ndarray = Rust's NumPy",children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"ndarray"})," crate provides ",e.jsx("code",{children:"Array1<T>"})," (1D),"," ",e.jsx("code",{children:"Array2<T>"})," (2D), and ",e.jsx("code",{children:"ArrayD<T>"}),"(dynamic dimensions). Unlike NumPy, the element type is known at compile time, so there is no dtype mismatch at runtime. Arrays are stored in contiguous memory, just like NumPy's C-order arrays."]})}),e.jsx("h2",{children:"Creating Arrays"}),e.jsx(n,{title:"Array creation patterns",description:"ndarray mirrors NumPy's array creation functions closely.",pythonCode:`import numpy as np

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
grid = flat.reshape(3, 4)`,rustCode:`use ndarray::{array, Array, Array1, Array2};

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
}`}),e.jsxs(a,{type:"pythonista",title:"Type safety catches dtype bugs",children:["In NumPy, ",e.jsx("code",{children:"np.array([1, 2, 3])"})," gives you int64, but"," ",e.jsx("code",{children:"np.array([1.0, 2, 3])"})," silently upcasts to float64. In Rust, the element type is explicit: ",e.jsx("code",{children:"Array1<f64>"})," vs"," ",e.jsx("code",{children:"Array1<i32>"}),". Type mismatches are compile errors, not silent coercions that cause subtle bugs downstream."]}),e.jsx("h2",{children:"Indexing and Slicing"}),e.jsx(n,{title:"Accessing array elements",description:"ndarray uses similar bracket syntax and slice notation.",pythonCode:`import numpy as np

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
print(m[1:, :2])   # submatrix`,rustCode:`use ndarray::{array, s, Array};

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
}`}),e.jsx("h2",{children:"Element-wise Operations"}),e.jsx(r,{language:"rust",title:"Arithmetic and mathematical operations",code:`use ndarray::array;

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
}`}),e.jsxs(a,{type:"tip",title:"Use & for borrowing in operations",children:["Notice the ",e.jsx("code",{children:"&a + &b"})," syntax. The ",e.jsx("code",{children:"&"})," borrows the arrays so they are not consumed. Without it, ",e.jsx("code",{children:"a + b"})," would move both arrays and you could not use them again. This is a common pattern when chaining operations."]}),e.jsx("h2",{children:"Cargo.toml Setup"}),e.jsx(r,{language:"toml",title:"Adding ndarray",code:`[dependencies]
ndarray = "0.16"

# Optional: BLAS acceleration (like NumPy's LAPACK)
# ndarray-linalg = { version = "0.16", features = ["openblas-static"] }`}),e.jsx(i,{title:"Statistics from Scratch",difficulty:"intermediate",problem:`Using ndarray, compute the following for the array [2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0]:

1. Mean (should be 5.0)
2. Variance: mean of (x - mean)^2 (should be 4.0)
3. Standard deviation: sqrt of variance (should be 2.0)
4. Normalized array: (x - mean) / std (z-scores)

Hint: Use mapv to apply functions element-wise and .mean() for the mean.`,solution:`use ndarray::array;

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
}`})]})}const m=Object.freeze(Object.defineProperty({__proto__:null,default:s},Symbol.toStringTag,{value:"Module"}));function o(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"rand & rand_distr — Random Numbers & Distributions"}),e.jsxs("p",{children:["Random number generation is essential for ML: weight initialization, data shuffling, Monte Carlo sampling, and stochastic algorithms. Rust's ",e.jsx("code",{children:"rand"})," crate is fast, flexible, and reproducible. Combined with ",e.jsx("code",{children:"rand_distr"}),", it covers the same ground as Python's ",e.jsx("code",{children:"random"}),", ",e.jsx("code",{children:"numpy.random"}),", and"," ",e.jsx("code",{children:"scipy.stats"}),"."]}),e.jsx(t,{title:"Rust's Random Ecosystem",children:e.jsxs("p",{children:[e.jsx("code",{children:"rand"})," provides the core RNG traits and basic distributions."," ",e.jsx("code",{children:"rand_distr"})," adds statistical distributions (Normal, Poisson, Gamma, etc.). Unlike Python's global random state, Rust makes you pass an RNG explicitly, which makes code reproducible and thread-safe by design."]})}),e.jsx("h2",{children:"Basic Random Numbers"}),e.jsx(n,{title:"Generating random values",description:"Both languages provide simple random number generation, but Rust makes the RNG explicit.",pythonCode:`import random
import numpy as np

# Basic random numbers
x = random.random()           # float in [0, 1)
n = random.randint(1, 100)    # int in [1, 100]
f = random.uniform(-1.0, 1.0) # float in [-1, 1]

# NumPy arrays of random numbers
arr = np.random.rand(5)       # 5 uniform floats
normals = np.random.randn(1000) # 1000 standard normals

# Seeded for reproducibility
rng = np.random.default_rng(42)
data = rng.random(10)

# Shuffle
items = [1, 2, 3, 4, 5]
random.shuffle(items)

# Choice
pick = random.choice(items)`,rustCode:`use rand::prelude::*;

fn main() {
    let mut rng = rand::rng();

    // Basic random numbers
    let x: f64 = rng.random();          // [0, 1)
    let n: u32 = rng.random_range(1..=100); // [1, 100]
    let f: f64 = rng.random_range(-1.0..1.0);

    // Array of random floats
    let arr: Vec<f64> = (0..5)
        .map(|_| rng.random())
        .collect();

    // Seeded for reproducibility
    use rand::rngs::StdRng;
    use rand::SeedableRng;
    let mut seeded = StdRng::seed_from_u64(42);
    let data: Vec<f64> = (0..10)
        .map(|_| seeded.random())
        .collect();

    // Shuffle
    let mut items = vec![1, 2, 3, 4, 5];
    items.shuffle(&mut rng);

    // Choice
    let pick = items.choose(&mut rng).unwrap();
    println!("pick: {}", pick);
}`}),e.jsxs(a,{type:"pythonista",title:"Explicit RNG = reproducibility",children:["Python's ",e.jsx("code",{children:"random"})," uses a global state, making it hard to ensure reproducibility in multi-threaded code. Rust forces you to pass the RNG explicitly. This makes it impossible to accidentally share random state between threads — each thread can have its own seeded RNG."]}),e.jsx("h2",{children:"Statistical Distributions"}),e.jsx(n,{title:"Sampling from distributions",description:"rand_distr provides the same distributions as scipy.stats and numpy.random.",pythonCode:`import numpy as np
from scipy import stats

rng = np.random.default_rng(42)

# Normal / Gaussian
samples = rng.normal(loc=0, scale=1, size=1000)

# Uniform
uniform = rng.uniform(low=-5, high=5, size=100)

# Bernoulli / binomial
flips = rng.binomial(n=1, p=0.7, size=100)

# Poisson
events = rng.poisson(lam=3.0, size=100)

# Exponential
waits = rng.exponential(scale=1/2.0, size=100)

print(f"Normal mean: {samples.mean():.3f}")
print(f"Normal std:  {samples.std():.3f}")`,rustCode:`use rand::prelude::*;
use rand_distr::{Normal, Uniform, Bernoulli, Poisson, Exp};

fn main() {
    let mut rng = rand::rng();

    // Normal / Gaussian
    let normal = Normal::new(0.0, 1.0).unwrap();
    let samples: Vec<f64> = (0..1000)
        .map(|_| normal.sample(&mut rng))
        .collect();

    // Uniform
    let uniform = Uniform::new(-5.0_f64, 5.0).unwrap();
    let u_samples: Vec<f64> = (0..100)
        .map(|_| uniform.sample(&mut rng))
        .collect();

    // Bernoulli
    let coin = Bernoulli::new(0.7).unwrap();
    let flips: Vec<bool> = (0..100)
        .map(|_| coin.sample(&mut rng))
        .collect();

    // Poisson
    let pois = Poisson::new(3.0).unwrap();
    let events: Vec<u64> = (0..100)
        .map(|_| pois.sample(&mut rng))
        .collect();

    let mean: f64 = samples.iter().sum::<f64>()
        / samples.len() as f64;
    println!("Normal mean: {:.3}", mean);
}`}),e.jsx("h2",{children:"Weighted Sampling and Random Matrices"}),e.jsx(r,{language:"rust",title:"Advanced random patterns for ML",code:`use rand::prelude::*;
use rand_distr::Normal;

fn main() {
    let mut rng = rand::rng();

    // Xavier/Glorot initialization (common in neural nets)
    let fan_in = 784;
    let fan_out = 256;
    let std_dev = (2.0 / (fan_in + fan_out) as f64).sqrt();
    let xavier = Normal::new(0.0, std_dev).unwrap();

    // Random weight matrix
    let weights: Vec<Vec<f64>> = (0..fan_out)
        .map(|_| {
            (0..fan_in)
                .map(|_| xavier.sample(&mut rng))
                .collect()
        })
        .collect();

    println!("Weight matrix: {} x {}", weights.len(), weights[0].len());
    println!("Sample weight: {:.6}", weights[0][0]);

    // Weighted random choice
    use rand::distr::weighted::WeightedIndex;
    let choices = ["cat", "dog", "bird"];
    let probs = [0.5, 0.3, 0.2];
    let dist = WeightedIndex::new(&probs).unwrap();

    let picks: Vec<&str> = (0..10)
        .map(|_| choices[dist.sample(&mut rng)])
        .collect();
    println!("Picks: {:?}", picks);

    // Train/test split indices
    let n = 1000;
    let mut indices: Vec<usize> = (0..n).collect();
    indices.shuffle(&mut rng);
    let (train_idx, test_idx) = indices.split_at(800);
    println!("Train: {} samples, Test: {} samples",
             train_idx.len(), test_idx.len());
}`}),e.jsxs(a,{type:"tip",title:"Cargo.toml setup",children:["Add both crates: ",e.jsx("code",{children:'rand = "0.9"'})," and"," ",e.jsx("code",{children:'rand_distr = "0.5"'}),". The ",e.jsx("code",{children:"rand"})," crate alone gives you uniform distributions and shuffling; ",e.jsx("code",{children:"rand_distr"}),"adds Normal, Poisson, Exponential, Gamma, and many more."]}),e.jsx(i,{title:"Monte Carlo Pi Estimation",difficulty:"intermediate",problem:`Estimate Pi using the Monte Carlo method:

1. Generate 1,000,000 random (x, y) points where x, y are in [-1, 1]
2. Count how many fall inside the unit circle (x² + y² <= 1)
3. Pi ≈ 4 × (points inside circle / total points)

Use a seeded RNG (seed 42) for reproducibility. Print your estimate.

Bonus: Use Rayon's par_iter to parallelize the generation.`,solution:`use rand::prelude::*;
use rand::rngs::StdRng;
use rand::SeedableRng;
use rand_distr::Uniform;

fn main() {
    let n = 1_000_000;
    let mut rng = StdRng::seed_from_u64(42);
    let dist = Uniform::new(-1.0_f64, 1.0).unwrap();

    let inside = (0..n)
        .filter(|_| {
            let x: f64 = dist.sample(&mut rng);
            let y: f64 = dist.sample(&mut rng);
            x * x + y * y <= 1.0
        })
        .count();

    let pi_estimate = 4.0 * inside as f64 / n as f64;
    println!("Pi estimate: {:.6}", pi_estimate);
    println!("Actual Pi:   {:.6}", std::f64::consts::PI);
    println!("Error:       {:.6}",
             (pi_estimate - std::f64::consts::PI).abs());

    // With Rayon (bonus):
    // use rayon::prelude::*;
    // let inside: usize = (0..n)
    //     .into_par_iter()
    //     .map_init(
    //         || StdRng::seed_from_u64(42),
    //         |rng, _| {
    //             let x: f64 = dist.sample(rng);
    //             let y: f64 = dist.sample(rng);
    //             if x*x + y*y <= 1.0 { 1 } else { 0 }
    //         }
    //     )
    //     .sum();
}`})]})}const c=Object.freeze(Object.defineProperty({__proto__:null,default:o},Symbol.toStringTag,{value:"Module"}));export{c as a,m as s};
