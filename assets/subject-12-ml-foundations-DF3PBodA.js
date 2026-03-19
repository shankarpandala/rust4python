import{j as e}from"./vendor-Dh_dlHsl.js";import{C as a,P as s,N as r,a as t,E as n}from"./subject-01-getting-started-DoSDK0Fn.js";function i(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Linear Regression in Rust"}),e.jsx("p",{children:"Building ML algorithms from scratch is the best way to understand both the math and the language. Linear regression is the perfect starting point: simple enough to implement in 30 lines, but it covers gradient descent, loss functions, and vectorized operations — the building blocks of all modern ML."}),e.jsxs(a,{title:"Gradient Descent in a Nutshell",children:[e.jsxs("p",{children:["Linear regression fits ",e.jsx("code",{children:"y = wx + b"})," by minimizing the mean squared error. At each step, we compute the gradient (how the loss changes with respect to w and b), then nudge the parameters in the opposite direction. Repeat until convergence."]}),e.jsx("p",{children:"In Python you would use NumPy for the vector math. In Rust, we can use iterators and closures for the same effect — with zero allocation overhead."})]}),e.jsx("h2",{children:"Linear Regression: Python vs Rust"}),e.jsx(s,{title:"Gradient descent from scratch",description:"The same algorithm in both languages. Notice how Rust's iterators replace NumPy's vectorized operations.",pythonCode:`import numpy as np

# Generate data: y = 3x + 2 + noise
np.random.seed(42)
X = np.random.rand(100)
y = 3.0 * X + 2.0 + np.random.randn(100) * 0.1

# Gradient descent
w, b = 0.0, 0.0
lr = 0.1

for epoch in range(1000):
    # Forward pass
    y_pred = w * X + b

    # Loss (MSE)
    loss = np.mean((y_pred - y) ** 2)

    # Gradients
    dw = 2 * np.mean((y_pred - y) * X)
    db = 2 * np.mean(y_pred - y)

    # Update
    w -= lr * dw
    b -= lr * db

    if epoch % 200 == 0:
        print(f"Epoch {epoch}: loss={loss:.4f}")

print(f"w={w:.4f}, b={b:.4f}")
# w≈3.0, b≈2.0`,rustCode:`fn main() {
    // Generate data: y = 3x + 2 + noise
    let n = 100;
    let x: Vec<f64> = (0..n)
        .map(|i| i as f64 / n as f64)
        .collect();
    let y: Vec<f64> = x.iter()
        .enumerate()
        .map(|(i, &xi)| {
            3.0 * xi + 2.0 + (i as f64 * 0.7).sin() * 0.1
        })
        .collect();

    // Gradient descent
    let mut w = 0.0_f64;
    let mut b = 0.0_f64;
    let lr = 0.1;
    let n_f = n as f64;

    for epoch in 0..1000 {
        // Forward + gradients in one pass
        let (sum_err, sum_err_x) = x.iter()
            .zip(y.iter())
            .fold((0.0, 0.0), |(se, sex), (&xi, &yi)| {
                let err = (w * xi + b) - yi;
                (se + err, sex + err * xi)
            });

        let dw = 2.0 * sum_err_x / n_f;
        let db = 2.0 * sum_err / n_f;

        w -= lr * dw;
        b -= lr * db;

        if epoch % 200 == 0 {
            let loss: f64 = x.iter().zip(y.iter())
                .map(|(&xi, &yi)| (w*xi + b - yi).powi(2))
                .sum::<f64>() / n_f;
            println!("Epoch {}: loss={:.4}", epoch, loss);
        }
    }

    println!("w={:.4}, b={:.4}", w, b);
}`}),e.jsxs(r,{type:"pythonista",title:"Iterators are Rust's vectorization",children:["Where Python needs NumPy for fast vector operations, Rust's iterator chains compile down to tight loops with no heap allocations. The"," ",e.jsx("code",{children:".fold()"})," above processes all data in a single pass with no intermediate arrays — it is more memory-efficient than the NumPy version, which allocates temporary arrays for each operation."]}),e.jsx("h2",{children:"Structuring the Model"}),e.jsx(t,{language:"rust",title:"A reusable LinearRegression struct",code:`struct LinearRegression {
    weight: f64,
    bias: f64,
    learning_rate: f64,
}

impl LinearRegression {
    fn new(learning_rate: f64) -> Self {
        LinearRegression {
            weight: 0.0,
            bias: 0.0,
            learning_rate,
        }
    }

    fn predict(&self, x: &[f64]) -> Vec<f64> {
        x.iter()
            .map(|&xi| self.weight * xi + self.bias)
            .collect()
    }

    fn mse(&self, x: &[f64], y: &[f64]) -> f64 {
        let n = x.len() as f64;
        x.iter().zip(y.iter())
            .map(|(&xi, &yi)| (self.weight * xi + self.bias - yi).powi(2))
            .sum::<f64>() / n
    }

    fn train(&mut self, x: &[f64], y: &[f64], epochs: usize) {
        let n = x.len() as f64;

        for epoch in 0..epochs {
            let (sum_err, sum_err_x) = x.iter()
                .zip(y.iter())
                .fold((0.0, 0.0), |(se, sex), (&xi, &yi)| {
                    let err = (self.weight * xi + self.bias) - yi;
                    (se + err, sex + err * xi)
                });

            self.weight -= self.learning_rate * 2.0 * sum_err_x / n;
            self.bias -= self.learning_rate * 2.0 * sum_err / n;

            if epoch % 100 == 0 {
                println!("Epoch {}: MSE = {:.6}", epoch, self.mse(x, y));
            }
        }
    }
}

fn main() {
    let x: Vec<f64> = (0..200).map(|i| i as f64 / 200.0).collect();
    let y: Vec<f64> = x.iter()
        .map(|&xi| 2.5 * xi + 1.0 + (xi * 10.0).sin() * 0.05)
        .collect();

    let mut model = LinearRegression::new(0.5);
    model.train(&x, &y, 500);

    println!("Learned: y = {:.4}x + {:.4}", model.weight, model.bias);

    let predictions = model.predict(&x[..5]);
    println!("First 5 predictions: {:?}", predictions);
}`}),e.jsx("h2",{children:"Multi-Feature Linear Regression"}),e.jsx(t,{language:"rust",title:"Multiple features using ndarray",code:`// With ndarray for matrix operations
// Cargo.toml: ndarray = "0.16"

use ndarray::{Array1, Array2, Axis};

fn linear_regression_multi(
    x: &Array2<f64>,  // (n_samples, n_features)
    y: &Array1<f64>,  // (n_samples,)
    lr: f64,
    epochs: usize,
) -> (Array1<f64>, f64) {
    let n = x.nrows() as f64;
    let n_features = x.ncols();

    let mut w = Array1::<f64>::zeros(n_features);
    let mut b = 0.0_f64;

    for epoch in 0..epochs {
        // predictions = X @ w + b
        let y_pred = x.dot(&w) + b;

        // errors
        let errors = &y_pred - y;

        // gradients
        let dw = x.t().dot(&errors) * (2.0 / n);
        let db = errors.sum() * (2.0 / n);

        // update
        w = w - &dw * lr;
        b -= lr * db;

        if epoch % 200 == 0 {
            let mse = errors.mapv(|e| e * e).mean().unwrap();
            println!("Epoch {}: MSE = {:.6}", epoch, mse);
        }
    }

    (w, b)
}

fn main() {
    // Example: y = 2*x1 + 3*x2 + 1
    let x = Array2::from_shape_vec((100, 2), {
        (0..200).map(|i| (i as f64) / 100.0).collect()
    }).unwrap();

    let y: Array1<f64> = x.column(0).mapv(|v| v * 2.0)
        + x.column(1).mapv(|v| v * 3.0)
        + 1.0;

    let (w, b) = linear_regression_multi(&x, &y, 0.01, 1000);
    println!("Weights: {:.4}", w);
    println!("Bias: {:.4}", b);
}`}),e.jsx(n,{title:"Add Learning Rate Scheduling",difficulty:"intermediate",problem:`Modify the LinearRegression struct to support learning rate decay:

1. Add a decay_rate: f64 field (e.g., 0.999)
2. After each epoch, multiply the learning rate by decay_rate
3. Train on the data y = 5x - 3 with 200 data points
4. Compare convergence with and without decay (try lr=0.5, decay=0.999)
5. Print the final learning rate to see how much it decayed

Does learning rate decay help convergence? Why?`,solution:`struct LinearRegression {
    weight: f64,
    bias: f64,
    learning_rate: f64,
    initial_lr: f64,
    decay_rate: f64,
}

impl LinearRegression {
    fn new(learning_rate: f64, decay_rate: f64) -> Self {
        LinearRegression {
            weight: 0.0,
            bias: 0.0,
            learning_rate,
            initial_lr: learning_rate,
            decay_rate,
        }
    }

    fn train(&mut self, x: &[f64], y: &[f64], epochs: usize) {
        let n = x.len() as f64;
        self.learning_rate = self.initial_lr;

        for epoch in 0..epochs {
            let (sum_err, sum_err_x) = x.iter()
                .zip(y.iter())
                .fold((0.0, 0.0), |(se, sex), (&xi, &yi)| {
                    let err = (self.weight * xi + self.bias) - yi;
                    (se + err, sex + err * xi)
                });

            self.weight -= self.learning_rate * 2.0 * sum_err_x / n;
            self.bias -= self.learning_rate * 2.0 * sum_err / n;

            // Decay the learning rate
            self.learning_rate *= self.decay_rate;

            if epoch % 100 == 0 {
                let mse: f64 = x.iter().zip(y.iter())
                    .map(|(&xi, &yi)| (self.weight*xi + self.bias - yi).powi(2))
                    .sum::<f64>() / n;
                println!("Epoch {}: MSE={:.6}, lr={:.6}",
                         epoch, mse, self.learning_rate);
            }
        }
    }
}

fn main() {
    let x: Vec<f64> = (0..200).map(|i| i as f64 / 100.0).collect();
    let y: Vec<f64> = x.iter().map(|&xi| 5.0 * xi - 3.0).collect();

    let mut model = LinearRegression::new(0.5, 0.999);
    model.train(&x, &y, 1000);
    println!("With decay: w={:.4}, b={:.4}, final_lr={:.6}",
             model.weight, model.bias, model.learning_rate);

    // Decay helps by: starting with large steps for fast progress,
    // then taking smaller steps for fine convergence. After 1000
    // epochs with 0.999 decay, lr = 0.5 * 0.999^1000 ≈ 0.184.
}`})]})}const p=Object.freeze(Object.defineProperty({__proto__:null,default:i},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"candle — A Minimalist ML Framework"}),e.jsxs("p",{children:["If PyTorch is your daily driver, ",e.jsx("code",{children:"candle"})," is the closest Rust equivalent. Built by Hugging Face, candle provides tensors with GPU support, automatic differentiation, and a growing collection of pre-built model architectures. It is designed to be lightweight and fast — no C++ dependency (unlike libtorch), pure Rust."]}),e.jsx(a,{title:"candle vs PyTorch",children:e.jsx("p",{children:"candle provides the same core primitives as PyTorch: tensors, GPU acceleration (CUDA and Metal), and autograd. It is not trying to replace PyTorch for research, but rather provide a fast, deployable inference engine and a way to build ML in pure Rust. Hugging Face uses candle to power server-side inference for many of their models."})}),e.jsx("h2",{children:"Tensor Basics"}),e.jsx(s,{title:"Creating and manipulating tensors",description:"candle's tensor API mirrors PyTorch's design philosophy.",pythonCode:`import torch

# Create tensors
a = torch.tensor([1.0, 2.0, 3.0, 4.0])
b = torch.zeros(3, 4)
c = torch.ones(2, 3)
r = torch.randn(5, 5)

# Tensor info
print(a.shape)   # torch.Size([4])
print(a.dtype)   # torch.float32
print(a.device)  # cpu

# Arithmetic
x = torch.tensor([1.0, 2.0, 3.0])
y = torch.tensor([4.0, 5.0, 6.0])
print(x + y)     # [5, 7, 9]
print(x * y)     # [4, 10, 18]
print(x.dot(y))  # 32

# Reshape
m = torch.arange(12).reshape(3, 4)
print(m.shape)   # [3, 4]`,rustCode:`use candle_core::{Tensor, Device, DType};

fn main() -> candle_core::Result<()> {
    let device = Device::Cpu;

    // Create tensors
    let a = Tensor::new(
        &[1.0_f32, 2.0, 3.0, 4.0], &device
    )?;
    let b = Tensor::zeros((3, 4), DType::F32, &device)?;
    let c = Tensor::ones((2, 3), DType::F32, &device)?;
    let r = Tensor::randn(0.0_f32, 1.0, (5, 5), &device)?;

    // Tensor info
    println!("Shape: {:?}", a.shape());   // [4]
    println!("Dtype: {:?}", a.dtype());   // F32
    println!("Device: {:?}", a.device()); // Cpu

    // Arithmetic
    let x = Tensor::new(&[1.0_f32, 2.0, 3.0], &device)?;
    let y = Tensor::new(&[4.0_f32, 5.0, 6.0], &device)?;
    let sum = (&x + &y)?;     // [5, 7, 9]
    let prod = (&x * &y)?;    // [4, 10, 18]
    println!("Sum: {}", sum);
    println!("Prod: {}", prod);

    // Reshape
    let flat = Tensor::arange(0u32, 12, &device)?
        .to_dtype(DType::F32)?;
    let m = flat.reshape((3, 4))?;
    println!("Shape: {:?}", m.shape()); // [3, 4]

    Ok(())
}`}),e.jsxs(r,{type:"pythonista",title:"Familiar but different error handling",children:["In PyTorch, bad operations raise Python exceptions. In candle, tensor operations return ",e.jsx("code",{children:"Result"})," — the ",e.jsx("code",{children:"?"})," operator propagates errors cleanly. Shape mismatches and dtype errors are caught at runtime (just like PyTorch), but they cannot crash your program unexpectedly."]}),e.jsx("h2",{children:"Tensor Operations for ML"}),e.jsx(t,{language:"rust",title:"Common ML operations",code:`use candle_core::{Tensor, Device, DType};

fn main() -> candle_core::Result<()> {
    let dev = Device::Cpu;

    // Matrix multiplication (like torch.matmul)
    let a = Tensor::randn(0.0_f32, 1.0, (3, 4), &dev)?;
    let b = Tensor::randn(0.0_f32, 1.0, (4, 5), &dev)?;
    let c = a.matmul(&b)?;  // (3, 5)
    println!("matmul shape: {:?}", c.shape());

    // Softmax (for classification)
    let logits = Tensor::new(&[2.0_f32, 1.0, 0.1], &dev)?;
    let probs = candle_nn::ops::softmax(&logits, 0)?;
    println!("Softmax: {}", probs);

    // Activations
    let x = Tensor::new(&[-1.0_f32, 0.0, 1.0, 2.0], &dev)?;
    let relu = x.relu()?;
    println!("ReLU: {}", relu);   // [0, 0, 1, 2]

    // Reduction operations
    let data = Tensor::new(
        &[[1.0_f32, 2.0], [3.0, 4.0]], &dev
    )?;
    let row_sum = data.sum(1)?;     // sum along columns
    let col_mean = data.mean(0)?;   // mean along rows
    println!("Row sums: {}", row_sum);
    println!("Col means: {}", col_mean);

    // Indexing and slicing
    let t = Tensor::arange(0u32, 20, &dev)?
        .to_dtype(DType::F32)?
        .reshape((4, 5))?;
    let row = t.get(0)?;              // first row
    let slice = t.narrow(1, 1, 3)?;   // columns 1..4
    println!("First row: {}", row);
    println!("Slice: {}", slice);

    Ok(())
}`}),e.jsx("h2",{children:"GPU Support"}),e.jsx(t,{language:"rust",title:"Running on GPU with candle",code:`use candle_core::{Device, Tensor, DType};

fn main() -> candle_core::Result<()> {
    // Select device — CUDA if available, else CPU
    let device = Device::cuda_if_available(0)?;
    println!("Using device: {:?}", device);

    // Create tensors directly on GPU
    let a = Tensor::randn(0.0_f32, 1.0, (1000, 1000), &device)?;
    let b = Tensor::randn(0.0_f32, 1.0, (1000, 1000), &device)?;

    // GPU-accelerated matmul
    let c = a.matmul(&b)?;
    println!("Result shape: {:?}", c.shape());

    // Move between devices
    let cpu_tensor = c.to_device(&Device::Cpu)?;
    let values = cpu_tensor.flatten_all()?.to_vec1::<f32>()?;
    println!("First value: {:.4}", values[0]);

    Ok(())
}`}),e.jsxs(r,{type:"tip",title:"Cargo.toml for candle",children:["Use ",e.jsx("code",{children:"candle-core"})," for tensors and"," ",e.jsx("code",{children:"candle-nn"})," for neural network layers. For CUDA support, enable the ",e.jsx("code",{children:"cuda"})," feature. For Apple Silicon, use the ",e.jsx("code",{children:"metal"})," feature."]}),e.jsx(t,{language:"toml",title:"Cargo.toml",code:`[dependencies]
candle-core = "0.8"
candle-nn = "0.8"

# For GPU support:
# candle-core = { version = "0.8", features = ["cuda"] }
# candle-core = { version = "0.8", features = ["metal"] }`}),e.jsx(n,{title:"Implement Softmax from Scratch",difficulty:"intermediate",problem:`Implement softmax using only candle tensor operations:

softmax(x_i) = exp(x_i) / sum(exp(x_j))

1. Create a tensor of logits: [2.0, 1.0, 0.1]
2. Subtract the max for numerical stability: x = x - max(x)
3. Compute exp(x) using .exp()?
4. Divide by the sum to get probabilities
5. Verify the result sums to 1.0

Compare your result with candle_nn::ops::softmax.`,solution:`use candle_core::{Tensor, Device};

fn my_softmax(logits: &Tensor) -> candle_core::Result<Tensor> {
    // Subtract max for numerical stability
    let max_val = logits.max(0)?;
    let shifted = logits.broadcast_sub(&max_val)?;

    // exp(x - max)
    let exp_vals = shifted.exp()?;

    // sum of exponentials
    let sum_exp = exp_vals.sum_all()?;

    // normalize
    let probs = exp_vals.broadcast_div(&sum_exp)?;
    Ok(probs)
}

fn main() -> candle_core::Result<()> {
    let dev = Device::Cpu;
    let logits = Tensor::new(&[2.0_f32, 1.0, 0.1], &dev)?;

    // Our implementation
    let probs = my_softmax(&logits)?;
    println!("My softmax:    {}", probs);

    // Built-in
    let expected = candle_nn::ops::softmax(&logits, 0)?;
    println!("candle softmax: {}", expected);

    // Verify sums to 1
    let total = probs.sum_all()?.to_scalar::<f32>()?;
    println!("Sum: {:.6}", total); // ~1.0

    Ok(())
}

// Expected output:
// My softmax:     [0.6590, 0.2424, 0.0986]
// candle softmax: [0.6590, 0.2424, 0.0986]
// Sum: 1.000000`})]})}const u=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));function o(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"linfa — Rust's scikit-learn"}),e.jsxs("p",{children:["If scikit-learn is your go-to for classical ML in Python,"," ",e.jsx("code",{children:"linfa"})," is the Rust equivalent. It provides a familiar fit/predict API for algorithms like k-means, linear regression, PCA, decision trees, and more. Built on ",e.jsx("code",{children:"ndarray"}),", it integrates naturally with Rust's numerical ecosystem."]}),e.jsx(a,{title:"linfa's Design",children:e.jsxs("p",{children:["linfa follows scikit-learn's design philosophy: datasets, estimators, and transformers. You create a ",e.jsx("code",{children:"Dataset"})," from features and targets, fit a model, then predict. Each algorithm lives in its own sub-crate (e.g., ",e.jsx("code",{children:"linfa-clustering"}),","," ",e.jsx("code",{children:"linfa-linear"}),"), so you only include what you need."]})}),e.jsx("h2",{children:"K-Means Clustering"}),e.jsx(s,{title:"K-Means clustering",description:"The workflow is the same: create data, fit model, predict clusters.",pythonCode:`from sklearn.cluster import KMeans
import numpy as np

# Generate sample data
np.random.seed(42)
cluster1 = np.random.randn(50, 2) + [2, 2]
cluster2 = np.random.randn(50, 2) + [-2, -2]
cluster3 = np.random.randn(50, 2) + [2, -2]
X = np.vstack([cluster1, cluster2, cluster3])

# Fit K-Means
model = KMeans(n_clusters=3, random_state=42)
model.fit(X)

# Predict
labels = model.labels_
centers = model.cluster_centers_

print(f"Labels: {labels[:10]}")
print(f"Centers:\\n{centers}")
print(f"Inertia: {model.inertia_:.2f}")`,rustCode:`use linfa::prelude::*;
use linfa_clustering::KMeans;
use ndarray::{array, Array2, Axis};

fn main() {
    // Generate sample data (3 clusters)
    let mut data = Vec::new();
    for i in 0..50 {
        let t = i as f64 * 0.1;
        data.push([2.0 + t.sin()*0.5, 2.0 + t.cos()*0.5]);
        data.push([-2.0 + t.cos()*0.5, -2.0 + t.sin()*0.5]);
        data.push([2.0 + t.sin()*0.5, -2.0 + t.cos()*0.5]);
    }
    let features = Array2::from_shape_vec(
        (150, 2),
        data.into_iter().flatten().collect()
    ).unwrap();

    let dataset = DatasetBase::from(features);

    // Fit K-Means
    let model = KMeans::params(3)
        .max_n_iterations(100)
        .fit(&dataset)
        .unwrap();

    // Predict cluster labels
    let predictions = model.predict(&dataset);
    let labels = predictions.targets();

    println!("First 10 labels: {:?}", &labels[..10]);
    println!("Centroids:\\n{:.2}", model.centroids());
}`}),e.jsx(r,{type:"pythonista",title:"Sub-crate per algorithm",children:"Unlike scikit-learn which ships everything in one package, linfa splits algorithms into sub-crates. This is the Rust way — you only compile and include the algorithms you actually use, keeping binary size small and build times short."}),e.jsx("h2",{children:"Linear Regression with linfa"}),e.jsx(t,{language:"rust",title:"Ordinary Least Squares regression",code:`use linfa::prelude::*;
use linfa_linear::LinearRegression;
use ndarray::{array, Array1, Array2};

fn main() {
    // Features: 2D (e.g., size and rooms)
    let features = array![
        [1.0, 1.0],
        [2.0, 1.5],
        [3.0, 2.0],
        [4.0, 2.5],
        [5.0, 3.0],
        [6.0, 3.5],
        [7.0, 4.0],
        [8.0, 4.5],
    ];

    // Target: price
    let targets = array![150.0, 200.0, 250.0, 300.0,
                         350.0, 400.0, 450.0, 500.0];

    let dataset = Dataset::new(features, targets);

    // Fit linear regression
    let model = LinearRegression::default()
        .fit(&dataset)
        .unwrap();

    // Predict
    let new_data = array![[9.0, 5.0], [10.0, 5.5]];
    let predictions = model.predict(&new_data);

    println!("Predictions: {:.1}", predictions);
    // Should predict values around 550 and 600

    // Model parameters
    println!("Coefficients: {:.4}", model.params());
    println!("Intercept: {:.4}", model.intercept());
}`}),e.jsx("h2",{children:"PCA Dimensionality Reduction"}),e.jsx(t,{language:"rust",title:"PCA for feature reduction",code:`use linfa::prelude::*;
use linfa_reduction::Pca;
use ndarray::Array2;

fn main() {
    // 100 samples, 5 features
    let n = 100;
    let features: Vec<f64> = (0..n * 5)
        .map(|i| {
            let row = i / 5;
            let col = i % 5;
            // Features are correlated — PCA will find structure
            (row as f64 * 0.1) + (col as f64 * 0.5)
                + ((i as f64) * 0.3).sin() * 0.1
        })
        .collect();

    let data = Array2::from_shape_vec((n, 5), features).unwrap();
    let dataset = DatasetBase::from(data);

    // Reduce to 2 dimensions
    let pca = Pca::params(2)
        .fit(&dataset)
        .unwrap();

    let reduced = pca.predict(&dataset);
    println!("Original shape: ({}, 5)", n);
    println!("Reduced shape:  {:?}", reduced.targets().shape());
    println!("Explained variance ratio: {:.4}",
             pca.explained_variance_ratio());
}`}),e.jsx("h2",{children:"Cargo.toml Setup"}),e.jsx(t,{language:"toml",title:"Adding linfa to your project",code:`[dependencies]
linfa = "0.7"
ndarray = "0.16"

# Pick the algorithms you need:
linfa-clustering = "0.7"   # K-Means, DBSCAN, Gaussian Mixture
linfa-linear = "0.7"       # Linear & Ridge Regression
linfa-reduction = "0.7"    # PCA, SVD
linfa-trees = "0.7"        # Decision Trees, Random Forest
linfa-logistic = "0.7"     # Logistic Regression
linfa-svm = "0.7"          # Support Vector Machines
linfa-preprocessing = "0.7" # StandardScaler, MinMaxScaler`}),e.jsxs(r,{type:"tip",title:"When to use linfa vs other options",children:["Use linfa for classical ML when you want a pure Rust solution with no Python or C++ dependency. For deep learning, use candle or burn. For production serving of scikit-learn models, consider exporting to ONNX and using the ",e.jsx("code",{children:"ort"})," crate for inference."]}),e.jsx(n,{title:"Complete ML Pipeline",difficulty:"advanced",problem:`Build a mini ML pipeline in Rust:

1. Generate a synthetic classification dataset (2 features, 2 classes)
   - Class 0: points centered around (1, 1)
   - Class 1: points centered around (3, 3)
   - 50 points per class
2. Split into training (80%) and test (20%) sets
3. Fit a model using linfa (K-Means with k=2 works as a simple classifier here)
4. Evaluate accuracy on the test set

This mimics the scikit-learn workflow:
  X_train, X_test, y_train, y_test = train_test_split(X, y)`,solution:`use linfa::prelude::*;
use linfa_clustering::KMeans;
use ndarray::{Array2, Array1, s};

fn main() {
    // Generate synthetic 2-class data
    let n_per_class = 50;
    let mut features = Vec::new();
    let mut labels = Vec::new();

    for i in 0..n_per_class {
        let t = i as f64 * 0.1;
        // Class 0: centered at (1, 1)
        features.push(1.0 + t.sin() * 0.3);
        features.push(1.0 + t.cos() * 0.3);
        labels.push(0_usize);

        // Class 1: centered at (3, 3)
        features.push(3.0 + t.cos() * 0.3);
        features.push(3.0 + t.sin() * 0.3);
        labels.push(1_usize);
    }

    let n_total = n_per_class * 2;
    let x = Array2::from_shape_vec((n_total, 2), features).unwrap();
    let y = Array1::from_vec(labels);

    // Split 80/20
    let split = (n_total as f64 * 0.8) as usize;
    let x_train = x.slice(s![..split, ..]).to_owned();
    let x_test = x.slice(s![split.., ..]).to_owned();
    let y_test = y.slice(s![split..]).to_owned();

    // Fit K-Means (k=2)
    let dataset = DatasetBase::from(x_train);
    let model = KMeans::params(2)
        .max_n_iterations(100)
        .fit(&dataset)
        .unwrap();

    // Predict on test set
    let test_dataset = DatasetBase::from(x_test);
    let predictions = model.predict(&test_dataset);
    let pred_labels = predictions.targets();

    // Compute accuracy (labels may be swapped)
    let correct: usize = pred_labels.iter()
        .zip(y_test.iter())
        .filter(|(&p, &y)| p == y)
        .count();
    let accuracy = correct as f64 / y_test.len() as f64;

    // K-Means may swap label assignments, check both ways
    let accuracy = accuracy.max(1.0 - accuracy);
    println!("Test accuracy: {:.1}%", accuracy * 100.0);
}`})]})}const f=Object.freeze(Object.defineProperty({__proto__:null,default:o},Symbol.toStringTag,{value:"Module"}));export{u as a,f as b,p as s};
