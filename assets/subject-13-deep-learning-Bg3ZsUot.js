import{j as e}from"./vendor-Dh_dlHsl.js";import{C as t,P as i,a,N as r,E as n}from"./subject-01-getting-started-DoSDK0Fn.js";function s(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Forward Pass & Backpropagation in Rust"}),e.jsx("p",{children:"Understanding forward and backward passes at a low level makes you a better ML engineer — and Rust makes the mechanics crystal clear because there is no magic. No autograd hiding behind the scenes, no dynamic computation graphs. Just math, data, and explicit gradients."}),e.jsx(t,{title:"The Two Passes",children:e.jsxs("p",{children:["The ",e.jsx("strong",{children:"forward pass"})," pushes input through the network to produce a prediction. The ",e.jsx("strong",{children:"backward pass"}),"(backpropagation) computes how much each weight contributed to the error, using the chain rule of calculus. These gradients tell us how to update each weight to reduce the loss."]})}),e.jsx("h2",{children:"A Single Neuron"}),e.jsx(i,{title:"Forward and backward pass for one neuron",description:"The same math in both languages. Rust makes memory layout and operations explicit.",pythonCode:`import numpy as np

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
print(f"Loss: {loss:.4f}, Updated w: {w}")`,rustCode:`fn sigmoid(z: f64) -> f64 {
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
}`}),e.jsx("h2",{children:"Two-Layer Neural Network"}),e.jsx(a,{language:"rust",title:"A complete 2-layer network from scratch",code:`fn sigmoid(z: f64) -> f64 {
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
}`}),e.jsxs(r,{type:"pythonista",title:"No autograd here — and that is the point",children:["In PyTorch, ",e.jsx("code",{children:"loss.backward()"})," does all the gradient computation for you. Here, we compute every gradient manually with the chain rule. This is intentional — understanding backprop deeply makes you better at debugging training issues, understanding gradient flow problems, and designing custom layers."]}),e.jsxs(r,{type:"tip",title:"For production use, use candle",children:["This from-scratch implementation is for learning. For real projects, use ",e.jsx("code",{children:"candle"})," which provides automatic differentiation, GPU support, and optimized tensor operations — much like PyTorch."]}),e.jsx(n,{title:"Add ReLU Activation",difficulty:"advanced",problem:`Modify the TwoLayerNet to use ReLU instead of sigmoid for the hidden layer:

1. Implement relu(z) = max(0, z) and relu_deriv(z) = if z > 0 { 1.0 } else { 0.0 }
2. Change layer 1's activation from sigmoid to ReLU
3. Keep sigmoid for the output layer (needed for values in [0,1])
4. Train on the XOR problem — does it converge faster or slower?
5. Try different learning rates (1.0, 0.5, 0.1)

Why might ReLU converge faster than sigmoid for the hidden layer?`,solution:`fn relu(z: f64) -> f64 {
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
// Try lr=0.5 with ReLU for best results.`})]})}const c=Object.freeze(Object.defineProperty({__proto__:null,default:s},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Model Building with candle"}),e.jsx("p",{children:"candle provides the same model-building patterns you know from PyTorch: define layers, implement a forward method, run training loops with autograd. The key difference is that Rust's type system catches dimension mismatches and shape errors that PyTorch only catches at runtime."}),e.jsx(t,{title:"candle-nn Module System",children:e.jsxs("p",{children:[e.jsx("code",{children:"candle-nn"})," provides standard layers: ",e.jsx("code",{children:"Linear"}),",",e.jsx("code",{children:"Conv2d"}),", ",e.jsx("code",{children:"BatchNorm"}),", ",e.jsx("code",{children:"Embedding"}),", and more. You compose them into models using a ",e.jsx("code",{children:"VarBuilder"}),"to manage parameter loading and initialization. The pattern mirrors PyTorch's ",e.jsx("code",{children:"nn.Module"}),", but uses Rust structs and traits."]})}),e.jsx("h2",{children:"Defining a Model"}),e.jsx(i,{title:"A simple feedforward network",description:"Both use the same pattern: define layers in init, chain them in forward.",pythonCode:`import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.layer1 = nn.Linear(input_dim, hidden_dim)
        self.layer2 = nn.Linear(hidden_dim, hidden_dim)
        self.layer3 = nn.Linear(hidden_dim, output_dim)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.layer1(x))
        x = self.relu(self.layer2(x))
        x = self.layer3(x)
        return x

model = MLP(784, 256, 10)
x = torch.randn(32, 784)  # batch of 32
logits = model(x)
print(logits.shape)  # [32, 10]`,rustCode:`use candle_core::{Tensor, Device, DType};
use candle_nn::{Linear, Module, VarBuilder, VarMap};

struct MLP {
    layer1: Linear,
    layer2: Linear,
    layer3: Linear,
}

impl MLP {
    fn new(
        input_dim: usize,
        hidden_dim: usize,
        output_dim: usize,
        vb: VarBuilder,
    ) -> candle_core::Result<Self> {
        let layer1 = candle_nn::linear(
            input_dim, hidden_dim, vb.pp("layer1")
        )?;
        let layer2 = candle_nn::linear(
            hidden_dim, hidden_dim, vb.pp("layer2")
        )?;
        let layer3 = candle_nn::linear(
            hidden_dim, output_dim, vb.pp("layer3")
        )?;
        Ok(MLP { layer1, layer2, layer3 })
    }

    fn forward(&self, x: &Tensor) -> candle_core::Result<Tensor> {
        let x = self.layer1.forward(x)?.relu()?;
        let x = self.layer2.forward(&x)?.relu()?;
        self.layer3.forward(&x)
    }
}

fn main() -> candle_core::Result<()> {
    let dev = Device::Cpu;
    let varmap = VarMap::new();
    let vb = VarBuilder::from_varmap(&varmap, DType::F32, &dev);

    let model = MLP::new(784, 256, 10, vb)?;

    let x = Tensor::randn(0.0_f32, 1.0, (32, 784), &dev)?;
    let logits = model.forward(&x)?;
    println!("Shape: {:?}", logits.shape()); // [32, 10]

    Ok(())
}`}),e.jsxs(r,{type:"pythonista",title:"VarBuilder manages parameters",children:["PyTorch tracks parameters automatically via ",e.jsx("code",{children:"nn.Module"}),". candle uses ",e.jsx("code",{children:"VarMap"})," and ",e.jsx("code",{children:"VarBuilder"})," for the same purpose. ",e.jsx("code",{children:"VarBuilder"})," creates named parameter tensors, and ",e.jsx("code",{children:"VarMap"})," stores them all for the optimizer to update. The ",e.jsx("code",{children:'.pp("name")'})," call provides a namespace prefix."]}),e.jsx("h2",{children:"Training Loop"}),e.jsx(a,{language:"rust",title:"Complete training loop with loss and optimizer",code:`use candle_core::{Tensor, Device, DType};
use candle_nn::{VarBuilder, VarMap, Optimizer, Module, linear};

struct SimpleNet {
    fc1: candle_nn::Linear,
    fc2: candle_nn::Linear,
}

impl SimpleNet {
    fn new(vb: VarBuilder) -> candle_core::Result<Self> {
        Ok(SimpleNet {
            fc1: linear(2, 16, vb.pp("fc1"))?,
            fc2: linear(16, 1, vb.pp("fc2"))?,
        })
    }

    fn forward(&self, x: &Tensor) -> candle_core::Result<Tensor> {
        let x = self.fc1.forward(x)?.relu()?;
        self.fc2.forward(&x)
    }
}

fn main() -> candle_core::Result<()> {
    let dev = Device::Cpu;
    let varmap = VarMap::new();
    let vb = VarBuilder::from_varmap(&varmap, DType::F32, &dev);

    let model = SimpleNet::new(vb)?;

    // Create an optimizer (SGD)
    let mut opt = candle_nn::SGD::new(
        varmap.all_vars(),
        0.01,  // learning rate
    )?;

    // Generate training data: y = x1^2 + x2^2
    let n_samples = 100;
    let x_train = Tensor::randn(0.0_f32, 1.0, (n_samples, 2), &dev)?;
    let y_train = (x_train.sqr()?.sum(1)?.unsqueeze(1))?;

    // Training loop
    for epoch in 0..200 {
        // Forward pass
        let predictions = model.forward(&x_train)?;

        // MSE Loss
        let diff = (&predictions - &y_train)?;
        let loss = diff.sqr()?.mean_all()?;

        // Backward pass + update
        opt.backward_step(&loss)?;

        if epoch % 50 == 0 {
            let loss_val = loss.to_scalar::<f32>()?;
            println!("Epoch {}: loss = {:.4}", epoch, loss_val);
        }
    }

    // Test
    let x_test = Tensor::new(&[[1.0_f32, 1.0]], &dev)?;
    let pred = model.forward(&x_test)?;
    println!("f(1,1) = {:.4} (expected 2.0)",
             pred.to_scalar::<f32>()?);

    Ok(())
}`}),e.jsx("h2",{children:"Loading Pre-trained Models"}),e.jsx(a,{language:"rust",title:"Loading weights from safetensors",code:`use candle_core::{Device, DType};
use candle_nn::VarBuilder;

// candle can load safetensors format (HuggingFace standard)
fn load_pretrained() -> candle_core::Result<()> {
    let dev = Device::Cpu;

    // Load from a safetensors file
    // (used by HuggingFace for model distribution)
    let vb = unsafe {
        VarBuilder::from_mmaped_safetensors(
            &["model.safetensors"],
            DType::F32,
            &dev,
        )?
    };

    // Build model architecture, weights loaded automatically
    // because VarBuilder matches parameter names
    // let model = MLP::new(784, 256, 10, vb)?;

    println!("Model loaded successfully!");
    Ok(())
}

// Many HuggingFace models have candle implementations:
// - BERT, GPT-2, LLaMA, Mistral, Phi, Whisper
// - See: https://github.com/huggingface/candle/tree/main/candle-transformers`}),e.jsxs(r,{type:"tip",title:"candle-transformers for ready-made models",children:["The ",e.jsx("code",{children:"candle-transformers"})," crate provides implementations of popular model architectures (BERT, GPT-2, LLaMA, Mistral, Whisper). You can load HuggingFace weights directly and run inference without re-implementing the architecture yourself."]}),e.jsx(n,{title:"Build a Binary Classifier",difficulty:"intermediate",problem:`Build a neural network that classifies 2D points into two classes:

1. Generate 200 training points:
   - Class 0: points with x^2 + y^2 < 1 (inside unit circle)
   - Class 1: points with x^2 + y^2 >= 1 (outside)
2. Define a 3-layer network: Linear(2,32) -> ReLU -> Linear(32,16) -> ReLU -> Linear(16,1) -> Sigmoid
3. Use binary cross-entropy loss (or MSE for simplicity)
4. Train for 500 epochs and print loss every 100 epochs
5. Test on a few points and print predictions

Hint: For sigmoid output, use .sigmoid()? on the final layer's output.`,solution:`use candle_core::{Tensor, Device, DType};
use candle_nn::{VarBuilder, VarMap, Module, linear, Optimizer};

struct BinaryClassifier {
    fc1: candle_nn::Linear,
    fc2: candle_nn::Linear,
    fc3: candle_nn::Linear,
}

impl BinaryClassifier {
    fn new(vb: VarBuilder) -> candle_core::Result<Self> {
        Ok(Self {
            fc1: linear(2, 32, vb.pp("fc1"))?,
            fc2: linear(32, 16, vb.pp("fc2"))?,
            fc3: linear(16, 1, vb.pp("fc3"))?,
        })
    }

    fn forward(&self, x: &Tensor) -> candle_core::Result<Tensor> {
        let x = self.fc1.forward(x)?.relu()?;
        let x = self.fc2.forward(&x)?.relu()?;
        // Sigmoid for binary output in [0, 1]
        candle_nn::ops::sigmoid(&self.fc3.forward(&x)?)
    }
}

fn main() -> candle_core::Result<()> {
    let dev = Device::Cpu;
    let varmap = VarMap::new();
    let vb = VarBuilder::from_varmap(&varmap, DType::F32, &dev);

    let model = BinaryClassifier::new(vb)?;
    let mut opt = candle_nn::SGD::new(varmap.all_vars(), 0.1)?;

    // Generate training data
    let x = Tensor::randn(0.0_f32, 1.5, (200, 2), &dev)?;
    let dist = x.sqr()?.sum(1)?; // x^2 + y^2
    // Labels: 1.0 if inside unit circle, 0.0 if outside
    let y = dist.lt(1.0)?.to_dtype(DType::F32)?.unsqueeze(1)?;

    for epoch in 0..500 {
        let pred = model.forward(&x)?;
        let loss = (&pred - &y)?.sqr()?.mean_all()?;
        opt.backward_step(&loss)?;

        if epoch % 100 == 0 {
            println!("Epoch {}: loss = {:.4}", epoch,
                     loss.to_scalar::<f32>()?);
        }
    }

    // Test
    let test = Tensor::new(&[[0.0_f32, 0.0],
                              [0.5, 0.5],
                              [2.0, 2.0]], &dev)?;
    let preds = model.forward(&test)?;
    println!("Predictions (0=outside, 1=inside):");
    println!("(0,0) -> {:.3}", preds.get(0)?.to_scalar::<f32>()?);
    println!("(0.5,0.5) -> {:.3}", preds.get(1)?.to_scalar::<f32>()?);
    println!("(2,2) -> {:.3}", preds.get(2)?.to_scalar::<f32>()?);

    Ok(())
}`})]})}const p=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));export{p as a,c as s};
