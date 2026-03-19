import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function CandleOverview() {
  return (
    <div className="prose-rust">
      <h1>candle — A Minimalist ML Framework</h1>

      <p>
        If PyTorch is your daily driver, <code>candle</code> is the closest
        Rust equivalent. Built by Hugging Face, candle provides tensors with
        GPU support, automatic differentiation, and a growing collection of
        pre-built model architectures. It is designed to be lightweight and
        fast — no C++ dependency (unlike libtorch), pure Rust.
      </p>

      <ConceptBlock title="candle vs PyTorch">
        <p>
          candle provides the same core primitives as PyTorch: tensors, GPU
          acceleration (CUDA and Metal), and autograd. It is not trying to
          replace PyTorch for research, but rather provide a fast, deployable
          inference engine and a way to build ML in pure Rust. Hugging Face
          uses candle to power server-side inference for many of their models.
        </p>
      </ConceptBlock>

      <h2>Tensor Basics</h2>

      <PythonRustCompare
        title="Creating and manipulating tensors"
        description="candle's tensor API mirrors PyTorch's design philosophy."
        pythonCode={`import torch

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
print(m.shape)   # [3, 4]`}
        rustCode={`use candle_core::{Tensor, Device, DType};

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
}`}
      />

      <NoteBlock type="pythonista" title="Familiar but different error handling">
        In PyTorch, bad operations raise Python exceptions. In candle, tensor
        operations return <code>Result</code> — the <code>?</code> operator
        propagates errors cleanly. Shape mismatches and dtype errors are caught
        at runtime (just like PyTorch), but they cannot crash your program
        unexpectedly.
      </NoteBlock>

      <h2>Tensor Operations for ML</h2>

      <CodeBlock
        language="rust"
        title="Common ML operations"
        code={`use candle_core::{Tensor, Device, DType};

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
}`}
      />

      <h2>GPU Support</h2>

      <CodeBlock
        language="rust"
        title="Running on GPU with candle"
        code={`use candle_core::{Device, Tensor, DType};

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
}`}
      />

      <NoteBlock type="tip" title="Cargo.toml for candle">
        Use <code>candle-core</code> for tensors and{' '}
        <code>candle-nn</code> for neural network layers. For CUDA support,
        enable the <code>cuda</code> feature. For Apple Silicon,
        use the <code>metal</code> feature.
      </NoteBlock>

      <CodeBlock
        language="toml"
        title="Cargo.toml"
        code={`[dependencies]
candle-core = "0.8"
candle-nn = "0.8"

# For GPU support:
# candle-core = { version = "0.8", features = ["cuda"] }
# candle-core = { version = "0.8", features = ["metal"] }`}
      />

      <ExerciseBlock
        title="Implement Softmax from Scratch"
        difficulty="intermediate"
        problem={`Implement softmax using only candle tensor operations:

softmax(x_i) = exp(x_i) / sum(exp(x_j))

1. Create a tensor of logits: [2.0, 1.0, 0.1]
2. Subtract the max for numerical stability: x = x - max(x)
3. Compute exp(x) using .exp()?
4. Divide by the sum to get probabilities
5. Verify the result sums to 1.0

Compare your result with candle_nn::ops::softmax.`}
        solution={`use candle_core::{Tensor, Device};

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
// Sum: 1.000000`}
      />
    </div>
  );
}
