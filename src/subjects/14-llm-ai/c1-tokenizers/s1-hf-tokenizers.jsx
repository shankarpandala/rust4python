import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function HfTokenizers() {
  return (
    <div className="prose-rust">
      <h1>HuggingFace Tokenizers — The Rust Core</h1>

      <p>
        Every time you call <code>tokenizer.encode()</code> in Python's{' '}
        <code>transformers</code> library, you are running Rust code. The
        HuggingFace <code>tokenizers</code> library is written in Rust and
        exposed to Python via PyO3. Understanding the Rust side gives you
        direct access to the fastest tokenization available, and the ability
        to customize or extend it.
      </p>

      <ConceptBlock title="Why Tokenizers Are Written in Rust">
        <p>
          Tokenization is the bottleneck in many NLP pipelines. Processing
          billions of tokens for pre-training data, encoding prompts at
          inference time, or batch-encoding datasets all benefit from Rust's
          speed. The HuggingFace tokenizers library achieves 10-100x speedups
          over pure Python implementations by leveraging Rust's zero-cost
          abstractions and parallelism.
        </p>
      </ConceptBlock>

      <h2>Tokenization: Python vs Rust</h2>

      <PythonRustCompare
        title="Using the tokenizers library"
        description="The same tokenizers library, used from both Python and Rust."
        pythonCode={`from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.pre_tokenizers import Whitespace

# Load a pre-trained tokenizer
tokenizer = Tokenizer.from_pretrained(
    "bert-base-uncased"
)

# Encode text
text = "Rust powers the Python ML ecosystem!"
output = tokenizer.encode(text)

print(f"Tokens: {output.tokens}")
# ['rust', 'powers', 'the', 'python', 'ml', 'ecosystem', '!']

print(f"IDs: {output.ids}")
# [14523, 4204, 1996, 18750, 19875, 16927, 999]

# Decode back
decoded = tokenizer.decode(output.ids)
print(f"Decoded: {decoded}")

# Batch encoding (parallel!)
texts = ["Hello world", "Rust is fast"] * 1000
encoded = tokenizer.encode_batch(texts)
print(f"Encoded {len(encoded)} texts")`}
        rustCode={`use tokenizers::Tokenizer;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load pre-trained tokenizer
    let tokenizer = Tokenizer::from_pretrained(
        "bert-base-uncased", None
    )?;

    // Encode text
    let text = "Rust powers the Python ML ecosystem!";
    let output = tokenizer.encode(text, false)?;

    println!("Tokens: {:?}", output.get_tokens());
    println!("IDs: {:?}", output.get_ids());

    // Decode back
    let decoded = tokenizer.decode(
        output.get_ids(), true
    )?;
    println!("Decoded: {}", decoded);

    // Batch encoding (parallel by default!)
    let texts: Vec<&str> = vec!["Hello world", "Rust is fast"];
    let encodings = tokenizer.encode_batch(
        texts.into_iter().map(|t|
            tokenizers::EncodeInput::Single(t.into())
        ).collect(),
        false,
    )?;

    for enc in &encodings {
        println!("IDs: {:?}", enc.get_ids());
    }

    Ok(())
}`}
      />

      <NoteBlock type="pythonista" title="Same library, same speed">
        When you use <code>tokenizer.encode()</code> in Python, you are
        calling into the exact same Rust code shown on the right. The Python
        wrapper adds negligible overhead. Learning the Rust API gives you
        direct access when you need to embed tokenization in a Rust service
        or process data without Python.
      </NoteBlock>

      <h2>Building a Custom Tokenizer</h2>

      <CodeBlock
        language="rust"
        title="Training a BPE tokenizer from scratch"
        code={`use tokenizers::models::bpe::BPE;
use tokenizers::pre_tokenizers::whitespace::Whitespace;
use tokenizers::trainers::BpeTrainer;
use tokenizers::Tokenizer;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a BPE tokenizer
    let mut tokenizer = Tokenizer::new(BPE::default());

    // Add pre-tokenizer (split on whitespace first)
    tokenizer.with_pre_tokenizer(Whitespace {});

    // Configure trainer
    let trainer = BpeTrainer::builder()
        .vocab_size(1000)
        .min_frequency(2)
        .special_tokens(vec![
            tokenizers::AddedToken::from("[UNK]", true),
            tokenizers::AddedToken::from("[CLS]", true),
            tokenizers::AddedToken::from("[SEP]", true),
            tokenizers::AddedToken::from("[PAD]", true),
        ])
        .build();

    // Train on text files
    // tokenizer.train_from_files(&trainer, vec!["corpus.txt"])?;

    // Or train on in-memory data
    let training_data = vec![
        "the quick brown fox jumps over the lazy dog",
        "rust powers the python ml ecosystem",
        "tokenizers are written in rust for speed",
        "the fox and the dog are friends",
    ];

    // Train from iterator
    tokenizer.train_from_files(
        &trainer,
        vec!["training_data.txt"], // provide text files
    ).unwrap_or_default();

    // Save the trained tokenizer
    // tokenizer.save("my-tokenizer.json", true)?;

    println!("Tokenizer ready!");
    Ok(())
}`}
      />

      <h2>Performance: Batch Processing</h2>

      <CodeBlock
        language="rust"
        title="High-throughput tokenization for data pipelines"
        code={`use tokenizers::Tokenizer;
use std::time::Instant;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let tokenizer = Tokenizer::from_pretrained(
        "bert-base-uncased", None
    )?;

    // Simulate a large dataset
    let texts: Vec<String> = (0..10_000)
        .map(|i| format!(
            "This is sample document number {} with some text content \
             that needs to be tokenized for the ML pipeline.", i
        ))
        .collect();

    // Sequential encoding
    let start = Instant::now();
    let text_refs: Vec<&str> = texts.iter().map(|s| s.as_str()).collect();
    for text in &text_refs {
        let _ = tokenizer.encode(*text, false)?;
    }
    let seq_time = start.elapsed();

    // Batch encoding (parallel internally!)
    let start = Instant::now();
    let inputs: Vec<tokenizers::EncodeInput> = text_refs
        .iter()
        .map(|&t| tokenizers::EncodeInput::Single(t.into()))
        .collect();
    let batch_results = tokenizer.encode_batch(inputs, false)?;
    let batch_time = start.elapsed();

    println!("Sequential: {:?}", seq_time);
    println!("Batch:      {:?}", batch_time);
    println!("Speedup:    {:.1}x",
        seq_time.as_secs_f64() / batch_time.as_secs_f64());
    println!("Encoded {} documents, avg {} tokens",
        batch_results.len(),
        batch_results.iter().map(|e| e.get_ids().len()).sum::<usize>()
            / batch_results.len()
    );

    Ok(())
}`}
      />

      <NoteBlock type="tip" title="Cargo.toml">
        Add <code>tokenizers = "0.21"</code> to your dependencies. The crate
        includes BPE, WordPiece, Unigram, and SentencePiece models. For
        downloading pre-trained tokenizers, it uses HTTP requests — ensure
        network access is available.
      </NoteBlock>

      <ExerciseBlock
        title="Token Statistics"
        difficulty="intermediate"
        problem={`Using the tokenizers crate:

1. Load the "bert-base-uncased" tokenizer
2. Encode these 5 sentences and collect statistics:
   - "The quick brown fox"
   - "Machine learning is transforming industries"
   - "Rust and Python work great together"
   - "Attention is all you need"
   - "Large language models are everywhere"
3. For each sentence, print: the number of tokens, the tokens themselves
4. Compute the average tokens per sentence
5. Find which sentence has the most tokens

This is a common task when estimating API costs (token count = cost).`}
        solution={`use tokenizers::Tokenizer;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let tokenizer = Tokenizer::from_pretrained(
        "bert-base-uncased", None
    )?;

    let sentences = vec![
        "The quick brown fox",
        "Machine learning is transforming industries",
        "Rust and Python work great together",
        "Attention is all you need",
        "Large language models are everywhere",
    ];

    let mut total_tokens = 0;
    let mut max_tokens = 0;
    let mut max_sentence = "";

    for sentence in &sentences {
        let encoding = tokenizer.encode(*sentence, false)?;
        let n_tokens = encoding.get_ids().len();
        total_tokens += n_tokens;

        println!("{}", sentence);
        println!("  Tokens ({}): {:?}", n_tokens, encoding.get_tokens());
        println!();

        if n_tokens > max_tokens {
            max_tokens = n_tokens;
            max_sentence = sentence;
        }
    }

    let avg = total_tokens as f64 / sentences.len() as f64;
    println!("Average tokens per sentence: {:.1}", avg);
    println!("Most tokens: \"{}\" ({} tokens)", max_sentence, max_tokens);

    Ok(())
}`}
      />
    </div>
  );
}
