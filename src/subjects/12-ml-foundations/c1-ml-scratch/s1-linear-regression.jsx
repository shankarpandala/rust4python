import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function LinearRegression() {
  return (
    <div className="prose-rust">
      <h1>Linear Regression in Rust</h1>

      <p>
        Building ML algorithms from scratch is the best way to understand
        both the math and the language. Linear regression is the perfect
        starting point: simple enough to implement in 30 lines, but it covers
        gradient descent, loss functions, and vectorized operations — the
        building blocks of all modern ML.
      </p>

      <ConceptBlock title="Gradient Descent in a Nutshell">
        <p>
          Linear regression fits <code>y = wx + b</code> by minimizing the
          mean squared error. At each step, we compute the gradient (how the
          loss changes with respect to w and b), then nudge the parameters in
          the opposite direction. Repeat until convergence.
        </p>
        <p>
          In Python you would use NumPy for the vector math. In Rust, we can
          use iterators and closures for the same effect — with zero allocation
          overhead.
        </p>
      </ConceptBlock>

      <h2>Linear Regression: Python vs Rust</h2>

      <PythonRustCompare
        title="Gradient descent from scratch"
        description="The same algorithm in both languages. Notice how Rust's iterators replace NumPy's vectorized operations."
        pythonCode={`import numpy as np

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
# w≈3.0, b≈2.0`}
        rustCode={`fn main() {
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
}`}
      />

      <NoteBlock type="pythonista" title="Iterators are Rust's vectorization">
        Where Python needs NumPy for fast vector operations, Rust's iterator
        chains compile down to tight loops with no heap allocations. The{' '}
        <code>.fold()</code> above processes all data in a single pass with
        no intermediate arrays — it is more memory-efficient than the NumPy
        version, which allocates temporary arrays for each operation.
      </NoteBlock>

      <h2>Structuring the Model</h2>

      <CodeBlock
        language="rust"
        title="A reusable LinearRegression struct"
        code={`struct LinearRegression {
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
}`}
      />

      <h2>Multi-Feature Linear Regression</h2>

      <CodeBlock
        language="rust"
        title="Multiple features using ndarray"
        code={`// With ndarray for matrix operations
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
}`}
      />

      <ExerciseBlock
        title="Add Learning Rate Scheduling"
        difficulty="intermediate"
        problem={`Modify the LinearRegression struct to support learning rate decay:

1. Add a decay_rate: f64 field (e.g., 0.999)
2. After each epoch, multiply the learning rate by decay_rate
3. Train on the data y = 5x - 3 with 200 data points
4. Compare convergence with and without decay (try lr=0.5, decay=0.999)
5. Print the final learning rate to see how much it decayed

Does learning rate decay help convergence? Why?`}
        solution={`struct LinearRegression {
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
}`}
      />
    </div>
  );
}
