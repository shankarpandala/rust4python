import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ModelBuilding() {
  return (
    <div className="prose-rust">
      <h1>Model Building with candle</h1>

      <p>
        candle provides the same model-building patterns you know from PyTorch:
        define layers, implement a forward method, run training loops with
        autograd. The key difference is that Rust's type system catches
        dimension mismatches and shape errors that PyTorch only catches at
        runtime.
      </p>

      <ConceptBlock title="candle-nn Module System">
        <p>
          <code>candle-nn</code> provides standard layers: <code>Linear</code>,
          <code>Conv2d</code>, <code>BatchNorm</code>, <code>Embedding</code>,
          and more. You compose them into models using a <code>VarBuilder</code>
          to manage parameter loading and initialization. The pattern mirrors
          PyTorch's <code>nn.Module</code>, but uses Rust structs and traits.
        </p>
      </ConceptBlock>

      <h2>Defining a Model</h2>

      <PythonRustCompare
        title="A simple feedforward network"
        description="Both use the same pattern: define layers in init, chain them in forward."
        pythonCode={`import torch
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
print(logits.shape)  # [32, 10]`}
        rustCode={`use candle_core::{Tensor, Device, DType};
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
}`}
      />

      <NoteBlock type="pythonista" title="VarBuilder manages parameters">
        PyTorch tracks parameters automatically via <code>nn.Module</code>.
        candle uses <code>VarMap</code> and <code>VarBuilder</code> for the
        same purpose. <code>VarBuilder</code> creates named parameter tensors,
        and <code>VarMap</code> stores them all for the optimizer to update.
        The <code>.pp("name")</code> call provides a namespace prefix.
      </NoteBlock>

      <h2>Training Loop</h2>

      <CodeBlock
        language="rust"
        title="Complete training loop with loss and optimizer"
        code={`use candle_core::{Tensor, Device, DType};
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
}`}
      />

      <h2>Loading Pre-trained Models</h2>

      <CodeBlock
        language="rust"
        title="Loading weights from safetensors"
        code={`use candle_core::{Device, DType};
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
// - See: https://github.com/huggingface/candle/tree/main/candle-transformers`}
      />

      <NoteBlock type="tip" title="candle-transformers for ready-made models">
        The <code>candle-transformers</code> crate provides implementations
        of popular model architectures (BERT, GPT-2, LLaMA, Mistral, Whisper).
        You can load HuggingFace weights directly and run inference without
        re-implementing the architecture yourself.
      </NoteBlock>

      <ExerciseBlock
        title="Build a Binary Classifier"
        difficulty="intermediate"
        problem={`Build a neural network that classifies 2D points into two classes:

1. Generate 200 training points:
   - Class 0: points with x^2 + y^2 < 1 (inside unit circle)
   - Class 1: points with x^2 + y^2 >= 1 (outside)
2. Define a 3-layer network: Linear(2,32) -> ReLU -> Linear(32,16) -> ReLU -> Linear(16,1) -> Sigmoid
3. Use binary cross-entropy loss (or MSE for simplicity)
4. Train for 500 epochs and print loss every 100 epochs
5. Test on a few points and print predictions

Hint: For sigmoid output, use .sigmoid()? on the final layer's output.`}
        solution={`use candle_core::{Tensor, Device, DType};
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
}`}
      />
    </div>
  );
}
