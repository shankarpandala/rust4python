import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ForwardBackprop() {
  return (
    <div className="prose-rust">
      <h1>Forward Pass &amp; Backpropagation in Rust</h1>

      <p>
        Understanding forward and backward passes at a low level makes you a
        better ML engineer — and Rust makes the mechanics crystal clear because
        there is no magic. No autograd hiding behind the scenes, no dynamic
        computation graphs. Just math, data, and explicit gradients.
      </p>

      <ConceptBlock title="The Two Passes">
        <p>
          The <strong>forward pass</strong> pushes input through the network
          to produce a prediction. The <strong>backward pass</strong>
          (backpropagation) computes how much each weight contributed to the
          error, using the chain rule of calculus. These gradients tell us how
          to update each weight to reduce the loss.
        </p>
      </ConceptBlock>

      <h2>A Single Neuron</h2>

      <PythonRustCompare
        title="Forward and backward pass for one neuron"
        description="The same math in both languages. Rust makes memory layout and operations explicit."
        pythonCode={`import numpy as np

# Single neuron: y = sigmoid(w·x + b)
def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

def sigmoid_deriv(z):
    s = sigmoid(z)
    return s * (1 - s)

# Data
x = np.array([0.5, 0.8, 0.2])
y_true = 1.0

# Weights
w = np.array([0.1, 0.3, -0.2])
b = 0.1

# Forward pass
z = np.dot(w, x) + b      # linear
a = sigmoid(z)             # activation
loss = (a - y_true) ** 2   # MSE loss

# Backward pass (chain rule)
dloss_da = 2 * (a - y_true)
da_dz = sigmoid_deriv(z)
dz_dw = x
dz_db = 1.0

# Gradients
dw = dloss_da * da_dz * dz_dw
db = dloss_da * da_dz * dz_db

# Update
lr = 0.1
w -= lr * dw
b -= lr * db
print(f"Loss: {loss:.4f}, Updated w: {w}")`}
        rustCode={`fn sigmoid(z: f64) -> f64 {
    1.0 / (1.0 + (-z).exp())
}

fn sigmoid_deriv(z: f64) -> f64 {
    let s = sigmoid(z);
    s * (1.0 - s)
}

fn main() {
    // Data
    let x = [0.5, 0.8, 0.2];
    let y_true = 1.0;

    // Weights
    let mut w = [0.1, 0.3, -0.2];
    let mut b = 0.1;

    // Forward pass
    let z: f64 = w.iter().zip(x.iter())
        .map(|(wi, xi)| wi * xi)
        .sum::<f64>() + b;
    let a = sigmoid(z);
    let loss = (a - y_true).powi(2);

    // Backward pass (chain rule)
    let dloss_da = 2.0 * (a - y_true);
    let da_dz = sigmoid_deriv(z);

    // Gradients
    let dw: Vec<f64> = x.iter()
        .map(|&xi| dloss_da * da_dz * xi)
        .collect();
    let db = dloss_da * da_dz;

    // Update
    let lr = 0.1;
    for (wi, dwi) in w.iter_mut().zip(dw.iter()) {
        *wi -= lr * dwi;
    }
    b -= lr * db;

    println!("Loss: {:.4}, Updated w: {:?}", loss, w);
}`}
      />

      <h2>Two-Layer Neural Network</h2>

      <CodeBlock
        language="rust"
        title="A complete 2-layer network from scratch"
        code={`fn sigmoid(z: f64) -> f64 {
    1.0 / (1.0 + (-z).exp())
}

struct TwoLayerNet {
    // Layer 1: input_dim -> hidden_dim
    w1: Vec<Vec<f64>>,  // [hidden_dim][input_dim]
    b1: Vec<f64>,       // [hidden_dim]
    // Layer 2: hidden_dim -> output_dim
    w2: Vec<Vec<f64>>,  // [output_dim][hidden_dim]
    b2: Vec<f64>,       // [output_dim]
}

impl TwoLayerNet {
    fn new(input: usize, hidden: usize, output: usize) -> Self {
        // Initialize with small random values
        let w1 = (0..hidden).map(|i| {
            (0..input).map(|j| ((i * input + j) as f64 * 0.37).sin() * 0.5).collect()
        }).collect();
        let b1 = vec![0.0; hidden];
        let w2 = (0..output).map(|i| {
            (0..hidden).map(|j| ((i * hidden + j) as f64 * 0.53).sin() * 0.5).collect()
        }).collect();
        let b2 = vec![0.0; output];
        TwoLayerNet { w1, b1, w2, b2 }
    }

    fn forward(&self, x: &[f64]) -> (Vec<f64>, Vec<f64>, Vec<f64>, Vec<f64>) {
        // Layer 1: z1 = W1 @ x + b1, a1 = sigmoid(z1)
        let z1: Vec<f64> = self.w1.iter().zip(self.b1.iter())
            .map(|(row, &bi)| {
                row.iter().zip(x.iter()).map(|(w, xi)| w * xi).sum::<f64>() + bi
            }).collect();
        let a1: Vec<f64> = z1.iter().map(|&z| sigmoid(z)).collect();

        // Layer 2: z2 = W2 @ a1 + b2, a2 = sigmoid(z2)
        let z2: Vec<f64> = self.w2.iter().zip(self.b2.iter())
            .map(|(row, &bi)| {
                row.iter().zip(a1.iter()).map(|(w, ai)| w * ai).sum::<f64>() + bi
            }).collect();
        let a2: Vec<f64> = z2.iter().map(|&z| sigmoid(z)).collect();

        (z1, a1, z2, a2) // cache for backprop
    }

    fn train_step(&mut self, x: &[f64], target: &[f64], lr: f64) -> f64 {
        let (z1, a1, _z2, a2) = self.forward(x);

        // Loss
        let loss: f64 = a2.iter().zip(target.iter())
            .map(|(a, t)| (a - t).powi(2))
            .sum::<f64>();

        // Backprop through layer 2
        let delta2: Vec<f64> = a2.iter().zip(target.iter())
            .map(|(a, t)| 2.0 * (a - t) * a * (1.0 - a))
            .collect();

        // Update w2, b2
        for (i, row) in self.w2.iter_mut().enumerate() {
            for (j, w) in row.iter_mut().enumerate() {
                *w -= lr * delta2[i] * a1[j];
            }
            self.b2[i] -= lr * delta2[i];
        }

        // Backprop through layer 1
        let delta1: Vec<f64> = (0..a1.len()).map(|j| {
            let upstream: f64 = self.w2.iter().enumerate()
                .map(|(i, row)| delta2[i] * row[j])
                .sum();
            let s = sigmoid(z1[j]);
            upstream * s * (1.0 - s)
        }).collect();

        // Update w1, b1
        for (i, row) in self.w1.iter_mut().enumerate() {
            for (j, w) in row.iter_mut().enumerate() {
                *w -= lr * delta1[i] * x[j];
            }
            self.b1[i] -= lr * delta1[i];
        }

        loss
    }
}

fn main() {
    // XOR problem: 2 inputs -> 1 output
    let data = [(vec![0.,0.], vec![0.]), (vec![0.,1.], vec![1.]),
                (vec![1.,0.], vec![1.]), (vec![1.,1.], vec![0.])];

    let mut net = TwoLayerNet::new(2, 4, 1);

    for epoch in 0..5000 {
        let mut total_loss = 0.0;
        for (x, y) in &data {
            total_loss += net.train_step(x, y, 1.0);
        }
        if epoch % 1000 == 0 {
            println!("Epoch {}: loss = {:.4}", epoch, total_loss);
        }
    }

    // Test
    for (x, y) in &data {
        let (_, _, _, pred) = net.forward(x);
        println!("{:?} -> {:.3} (expected {:?})", x, pred[0], y[0]);
    }
}`}
      />

      <NoteBlock type="pythonista" title="No autograd here — and that is the point">
        In PyTorch, <code>loss.backward()</code> does all the gradient
        computation for you. Here, we compute every gradient manually with
        the chain rule. This is intentional — understanding backprop deeply
        makes you better at debugging training issues, understanding
        gradient flow problems, and designing custom layers.
      </NoteBlock>

      <NoteBlock type="tip" title="For production use, use candle">
        This from-scratch implementation is for learning. For real projects,
        use <code>candle</code> which provides automatic differentiation,
        GPU support, and optimized tensor operations — much like PyTorch.
      </NoteBlock>

      <ExerciseBlock
        title="Add ReLU Activation"
        difficulty="advanced"
        problem={`Modify the TwoLayerNet to use ReLU instead of sigmoid for the hidden layer:

1. Implement relu(z) = max(0, z) and relu_deriv(z) = if z > 0 { 1.0 } else { 0.0 }
2. Change layer 1's activation from sigmoid to ReLU
3. Keep sigmoid for the output layer (needed for values in [0,1])
4. Train on the XOR problem — does it converge faster or slower?
5. Try different learning rates (1.0, 0.5, 0.1)

Why might ReLU converge faster than sigmoid for the hidden layer?`}
        solution={`fn relu(z: f64) -> f64 {
    z.max(0.0)
}

fn relu_deriv(z: f64) -> f64 {
    if z > 0.0 { 1.0 } else { 0.0 }
}

// In forward(): change a1 computation
// let a1: Vec<f64> = z1.iter().map(|&z| relu(z)).collect();
// (keep a2 as sigmoid for output)

// In backprop: change delta1 computation
// Replace: s * (1.0 - s) with relu_deriv(z1[j])
// let delta1: Vec<f64> = (0..a1.len()).map(|j| {
//     let upstream: f64 = ...same...
//     upstream * relu_deriv(z1[j])
// }).collect();

// ReLU often converges faster because:
// 1. No vanishing gradient — derivative is 1 for positive values
// 2. Sigmoid saturates for large |z|, giving near-zero gradients
// 3. ReLU is computationally cheaper (max vs exp)
//
// However, for XOR specifically, results may vary because
// the problem is small and initial weights matter a lot.
// Try lr=0.5 with ReLU for best results.`}
      />
    </div>
  );
}
