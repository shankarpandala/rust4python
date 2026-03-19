import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ReadingWritingFiles() {
  return (
    <div className="prose-rust">
      <h1>Reading &amp; Writing Files</h1>

      <p>
        File I/O is something every data scientist does daily. Python's{' '}
        <code>open()</code> is beautifully simple, and Rust's file operations
        are quite similar — but with explicit error handling and no garbage
        collector managing file handles. The good news: Rust files auto-close
        when they go out of scope, just like Python's <code>with</code> blocks.
      </p>

      <ConceptBlock title="RAII File Handles">
        <p>
          In Python, you use <code>with open(...) as f</code> to ensure files
          are closed. In Rust, file handles implement <code>Drop</code>, which
          means they are automatically closed when they go out of scope. Every
          variable in Rust behaves like it is inside a <code>with</code> block.
        </p>
      </ConceptBlock>

      <h2>Reading Files: The Basics</h2>

      <PythonRustCompare
        title="Reading an entire file into a string"
        description="Both languages make reading a file into a string straightforward."
        pythonCode={`# Python: read entire file
with open("data.txt", "r") as f:
    content = f.read()
print(content)

# One-liner (less common)
content = open("data.txt").read()

# Read lines into a list
with open("data.txt") as f:
    lines = f.readlines()

# Iterate lines (memory-efficient)
with open("data.txt") as f:
    for line in f:
        print(line.strip())`}
        rustCode={`use std::fs;
use std::io::{self, BufRead};

fn main() -> io::Result<()> {
    // Read entire file into String
    let content = fs::read_to_string("data.txt")?;
    println!("{}", content);

    // Read into bytes (for binary files)
    let bytes = fs::read("image.png")?;
    println!("{} bytes", bytes.len());

    // Read lines (memory-efficient)
    let file = fs::File::open("data.txt")?;
    let reader = io::BufReader::new(file);
    for line in reader.lines() {
        let line = line?;
        println!("{}", line);
    }

    Ok(())
} // file handles auto-closed here`}
      />

      <NoteBlock type="pythonista" title="The ? operator is your friend">
        Where Python raises exceptions, Rust returns <code>Result</code>.
        The <code>?</code> operator propagates errors automatically — it is
        equivalent to <code>try/except</code> that re-raises on error. Your
        function must return <code>Result</code> to use <code>?</code>.
      </NoteBlock>

      <h2>Writing Files</h2>

      <PythonRustCompare
        title="Writing text to a file"
        description="Both languages offer simple write-all and line-by-line approaches."
        pythonCode={`# Write entire string
with open("output.txt", "w") as f:
    f.write("Hello, World!\\n")

# Write multiple lines
lines = ["line 1", "line 2", "line 3"]
with open("output.txt", "w") as f:
    for line in lines:
        f.write(line + "\\n")

# Append to file
with open("log.txt", "a") as f:
    f.write("New log entry\\n")

# Write with print
with open("output.txt", "w") as f:
    print("formatted", 42, file=f)`}
        rustCode={`use std::fs;
use std::io::{self, Write, BufWriter};

fn main() -> io::Result<()> {
    // Write entire string (creates or overwrites)
    fs::write("output.txt", "Hello, World!\\n")?;

    // Write multiple lines with BufWriter (efficient)
    let lines = ["line 1", "line 2", "line 3"];
    let file = fs::File::create("output.txt")?;
    let mut writer = BufWriter::new(file);
    for line in &lines {
        writeln!(writer, "{}", line)?;
    }

    // Append to file
    let file = fs::OpenOptions::new()
        .append(true)
        .create(true)
        .open("log.txt")?;
    let mut writer = BufWriter::new(file);
    writeln!(writer, "New log entry")?;

    Ok(())
}`}
      />

      <h2>Processing CSV-like Data</h2>

      <CodeBlock
        language="rust"
        title="Line-by-line processing — a common data task"
        code={`use std::fs;
use std::io::{self, BufRead, Write, BufWriter};

fn process_csv(input: &str, output: &str) -> io::Result<()> {
    let file = fs::File::open(input)?;
    let reader = io::BufReader::new(file);

    let out_file = fs::File::create(output)?;
    let mut writer = BufWriter::new(out_file);

    for (i, line) in reader.lines().enumerate() {
        let line = line?;

        if i == 0 {
            // Write header with new column
            writeln!(writer, "{},processed", line)?;
            continue;
        }

        // Parse and transform each row
        let fields: Vec<&str> = line.split(',').collect();
        if let Some(value) = fields.get(1) {
            if let Ok(num) = value.trim().parse::<f64>() {
                writeln!(writer, "{},{:.2}", line, num * 2.0)?;
            }
        }
    }

    writer.flush()?;
    println!("Processed {} -> {}", input, output);
    Ok(())
}

fn main() -> io::Result<()> {
    process_csv("data.csv", "processed.csv")
}`}
      />

      <NoteBlock type="tip" title="Always use BufReader and BufWriter">
        <code>BufReader</code> and <code>BufWriter</code> buffer I/O
        operations, reducing the number of system calls. Without them, each{' '}
        <code>read</code> or <code>write</code> call is a syscall. Python does
        this buffering automatically; in Rust, you opt in for maximum control.
      </NoteBlock>

      <h2>Working with Paths</h2>

      <CodeBlock
        language="rust"
        title="Cross-platform path handling"
        code={`use std::path::{Path, PathBuf};
use std::fs;

fn main() -> std::io::Result<()> {
    // Path (borrowed) and PathBuf (owned) — like &str vs String
    let path = Path::new("data/raw/input.csv");

    println!("File name: {:?}", path.file_name());     // "input.csv"
    println!("Extension: {:?}", path.extension());       // "csv"
    println!("Parent:    {:?}", path.parent());          // "data/raw"
    println!("Exists:    {}", path.exists());

    // Build paths safely (handles OS separators)
    let mut output = PathBuf::from("data");
    output.push("processed");
    output.push("output.csv");
    // output = "data/processed/output.csv"

    // Create directories recursively (like os.makedirs)
    fs::create_dir_all("data/processed")?;

    // List directory contents (like os.listdir)
    for entry in fs::read_dir(".")? {
        let entry = entry?;
        println!("{:?} (is_file: {})",
            entry.file_name(),
            entry.file_type()?.is_file());
    }

    Ok(())
}`}
      />

      <ExerciseBlock
        title="Word Frequency Counter"
        difficulty="intermediate"
        problem={`Write a program that:

1. Reads a text file into a String
2. Splits it into words (split_whitespace), converts to lowercase
3. Counts the frequency of each word using a HashMap
4. Writes the top 10 most frequent words to an output file, one per line: "word: count"

Use BufWriter for output. Handle errors with the ? operator.`}
        solution={`use std::collections::HashMap;
use std::fs;
use std::io::{self, Write, BufWriter};

fn word_frequency(input: &str, output: &str) -> io::Result<()> {
    // Read input
    let text = fs::read_to_string(input)?;

    // Count words
    let mut counts: HashMap<String, usize> = HashMap::new();
    for word in text.split_whitespace() {
        let word = word.to_lowercase();
        // Remove punctuation
        let word: String = word.chars()
            .filter(|c| c.is_alphanumeric())
            .collect();
        if !word.is_empty() {
            *counts.entry(word).or_insert(0) += 1;
        }
    }

    // Sort by frequency (descending)
    let mut sorted: Vec<_> = counts.into_iter().collect();
    sorted.sort_by(|a, b| b.1.cmp(&a.1));

    // Write top 10
    let file = fs::File::create(output)?;
    let mut writer = BufWriter::new(file);
    for (word, count) in sorted.iter().take(10) {
        writeln!(writer, "{}: {}", word, count)?;
    }

    println!("Wrote top 10 words to {}", output);
    Ok(())
}

fn main() -> io::Result<()> {
    word_frequency("input.txt", "frequencies.txt")
}`}
      />
    </div>
  );
}
