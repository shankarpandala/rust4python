import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function WhyRust() {
  return (
    <div className="prose-rust">
      <h1>Why Rust Matters for DS/ML/AI</h1>

      <p>
        If you work in data science, machine learning, or AI, you already rely on Rust
        every day — you just might not know it. The tools rewriting Python's infrastructure
        are overwhelmingly choosing Rust: Polars, Ruff, tokenizers, tiktoken, uv, and
        many more. Understanding Rust unlocks the ability to contribute to these projects,
        build your own high-performance extensions, and reason about why your Python code
        is fast (or slow).
      </p>

      <ConceptBlock title="The Performance Gap">
        <p>
          Python is an interpreted language with a Global Interpreter Lock (GIL) and
          garbage collector. Rust compiles to native machine code with zero-cost
          abstractions and no runtime overhead. In practice, this means Rust code
          typically runs <strong>10-100x faster</strong> than equivalent Python for
          CPU-bound tasks — and uses a fraction of the memory.
        </p>
        <p>
          This isn't just a benchmark curiosity. When you're tokenizing a 100GB text
          corpus, training a model on millions of records, or serving inference at
          scale, that performance gap is the difference between minutes and hours,
          between one server and fifty.
        </p>
      </ConceptBlock>

      <h2>Real-World Rust in the Python Ecosystem</h2>

      <p>
        These are not hypothetical projects — they are tools you likely already use:
      </p>

      <CodeBlock
        language="python"
        title="Tools you use that are written in Rust"
        code={`# Polars — DataFrame library, 10-100x faster than pandas
import polars as pl
df = pl.read_csv("huge_dataset.csv")
result = df.group_by("category").agg(pl.col("value").mean())

# Ruff — Python linter/formatter, 100x faster than flake8
# $ ruff check . --fix

# tiktoken — OpenAI's tokenizer for GPT models
import tiktoken
enc = tiktoken.encoding_for_model("gpt-4")
tokens = enc.encode("Hello, world!")

# tokenizers — Hugging Face fast tokenizers
from tokenizers import Tokenizer
tokenizer = Tokenizer.from_pretrained("bert-base-uncased")

# uv — Python package installer, 10-100x faster than pip
# $ uv pip install numpy pandas scikit-learn`}
      />

      <NoteBlock type="pythonista" title="You're already benefiting from Rust">
        Every time you use Polars instead of pandas, run Ruff instead of flake8,
        or tokenize text with tiktoken, you're running Rust under the hood.
        Learning Rust lets you understand <em>why</em> these tools are fast and
        how to build your own.
      </NoteBlock>

      <h2>Performance: Not Just Faster — Fundamentally Different</h2>

      <PythonRustCompare
        title="Summing 10 million numbers"
        description="A simple benchmark showing the raw performance difference. Rust's compiled, zero-overhead approach eliminates interpreter overhead entirely."
        pythonCode={`# Python: ~0.5 seconds
total = sum(range(10_000_000))
print(total)

# Even with NumPy (~0.02s), you're
# calling into C, not Python
import numpy as np
total = np.sum(np.arange(10_000_000))`}
        rustCode={`// Rust: ~0.01 seconds (release mode)
fn main() {
    let total: i64 = (0..10_000_000).sum();
    println!("{}", total);
}

// No external library needed —
// the standard iterator is already
// compiled to optimal machine code.`}
      />

      <h2>Memory Safety Without a Garbage Collector</h2>

      <p>
        Python uses reference counting plus a cycle-detecting garbage collector to
        manage memory. This works well for most code, but introduces unpredictable
        pauses and makes memory usage hard to control. Rust takes a radically
        different approach: the compiler tracks ownership of every value and
        inserts deallocation at compile time. There is no garbage collector at runtime.
      </p>

      <CodeBlock
        language="rust"
        title="Rust's ownership system manages memory at compile time"
        code={`fn process_data() {
    // 'data' is allocated here
    let data = vec![1, 2, 3, 4, 5];

    // 'data' is moved into the function — no copy
    let result = analyze(data);

    // Can't use 'data' here — the compiler prevents it!
    // println!("{:?}", data); // ERROR: value used after move

    println!("Result: {}", result);
} // 'result' is dropped (freed) here — deterministic, no GC

fn analyze(numbers: Vec<i32>) -> f64 {
    let sum: i32 = numbers.iter().sum();
    sum as f64 / numbers.len() as f64
} // 'numbers' is freed here — automatically, predictably`}
      />

      <NoteBlock type="note" title="No GC pauses in production">
        In ML serving and real-time systems, garbage collector pauses can cause
        latency spikes. Rust eliminates this entire class of problems. Memory is
        freed deterministically when values go out of scope — no pause, no
        unpredictability.
      </NoteBlock>

      <h2>When Is Rust Worth the Learning Curve?</h2>

      <p>Rust has a steeper learning curve than Python. It is worth investing in when:</p>

      <ul>
        <li>
          <strong>Performance-critical code:</strong> Data preprocessing pipelines,
          tokenizers, custom model layers, serving infrastructure.
        </li>
        <li>
          <strong>Python extensions:</strong> Writing native modules with PyO3 to
          replace slow inner loops.
        </li>
        <li>
          <strong>Systems you deploy:</strong> CLI tools, microservices, WebAssembly
          modules where Python's startup time or memory usage is a problem.
        </li>
        <li>
          <strong>Correctness matters:</strong> The compiler catches entire classes
          of bugs — null pointer dereferences, data races, use-after-free — at
          compile time.
        </li>
        <li>
          <strong>Contributing to the ecosystem:</strong> Polars, tokenizers, Ruff,
          and similar projects accept contributions from Rust developers.
        </li>
      </ul>

      <h2>ML/AI Infrastructure Is Moving to Rust</h2>

      <CodeBlock
        language="python"
        title="The Rust-powered AI/ML stack"
        code={`# The modern Python AI stack increasingly depends on Rust:

# Data loading & processing
import polars as pl          # Rust-powered DataFrames
from tokenizers import *     # Rust-powered tokenization
import tiktoken              # Rust-powered BPE tokenizer

# Development tools
# ruff                       # Rust-powered linting
# uv                         # Rust-powered package management
# maturin                    # Build Rust-Python packages

# Inference & serving
# candle                     # Rust ML framework (Hugging Face)
# burn                       # Rust deep learning framework
# ort (ONNX Runtime)         # Rust bindings for inference`}
      />

      <NoteBlock type="tip" title="You don't have to replace Python">
        The goal is not to rewrite all your Python in Rust. The most effective
        pattern is to keep Python for high-level orchestration, prototyping, and
        glue code, while using Rust for the performance-critical inner loops. This
        is exactly what Polars, tiktoken, and tokenizers do — Rust core, Python API.
      </NoteBlock>

      <h2>What You'll Learn in This Course</h2>

      <p>
        This course teaches Rust through the lens of what you already know from Python.
        Every concept is introduced with a Python comparison so you can map new ideas
        onto familiar ones. By the end, you will be able to:
      </p>

      <ul>
        <li>Read and write Rust confidently</li>
        <li>Build Python extensions with PyO3</li>
        <li>Understand ownership, borrowing, and lifetimes</li>
        <li>Work with Rust's type system, error handling, and concurrency</li>
        <li>Build high-performance data processing tools</li>
      </ul>

      <ExerciseBlock
        title="Reflection: Your Rust Use Cases"
        difficulty="beginner"
        problem={`Think about your current Python projects. Identify:

1. Which Python tools you use that are built on Rust (check the list above).
2. One bottleneck in your workflow where a 10-100x speedup would matter.
3. A task where you've hit Python's performance ceiling (e.g., slow loops, high memory usage, GIL limitations).

Write down your answers — they'll motivate your learning throughout this course.

Bonus: Run this in your terminal to see if you already have any Rust tools installed:
  which ruff && ruff --version
  which uv && uv --version`}
        solution={`Common answers from Python DS/ML developers:

1. Rust-backed tools: Polars, Ruff, tiktoken, tokenizers, uv, cryptography, orjson
2. Common bottlenecks: data preprocessing, text tokenization, feature engineering on large datasets, serving model inference at low latency
3. Python ceilings: CPU-bound loops over millions of rows, real-time inference serving, processing large text corpora, memory-intensive operations on big datasets

These are exactly the scenarios where Rust shines — and where learning Rust will pay off most.`}
      />
    </div>
  );
}
