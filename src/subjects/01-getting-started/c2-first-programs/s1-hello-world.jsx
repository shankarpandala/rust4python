import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function HelloWorld() {
  return (
    <div className="prose-rust">
      <h1>Hello World &amp; Cargo</h1>

      <p>
        Every language journey starts with Hello World, but in Rust this simple program
        reveals several important concepts: the <code>fn main()</code> entry point,
        the <code>println!</code> macro, and the Cargo build system. Let's compare
        each with its Python equivalent so you can start building mental bridges.
      </p>

      <ConceptBlock title="The Entry Point">
        <p>
          In Python, any <code>.py</code> file can be run directly — there is no required
          entry point. The <code>if __name__ == "__main__"</code> pattern is a convention,
          not a requirement. In Rust, every executable must have a <code>fn main()</code>
          function. This is the only entry point — the compiler looks for it and
          refuses to build without it.
        </p>
      </ConceptBlock>

      <PythonRustCompare
        title="Hello World"
        description="The simplest possible program in both languages."
        pythonCode={`# Python: just write code at the top level
print("Hello, world!")

# Or with the conventional entry point:
def main():
    print("Hello, world!")

if __name__ == "__main__":
    main()`}
        rustCode={`// Rust: must have fn main()
fn main() {
    println!("Hello, world!");
}

// fn — declares a function
// main — the required entry point
// println! — a macro (note the !)
// that prints to stdout`}
      />

      <NoteBlock type="pythonista" title="Why the exclamation mark in println!?">
        The <code>!</code> means <code>println!</code> is a <strong>macro</strong>, not
        a regular function. Macros can do things functions cannot — like accepting a
        variable number of arguments with format placeholders. Think of it like Python's
        f-strings built into the print call: <code>println!("x = {'{'}{'}'}", x)</code> is
        similar to <code>print(f"x = {'{'}x{'}'}")</code>.
      </NoteBlock>

      <h2>Printing and Formatting</h2>

      <PythonRustCompare
        title="String formatting"
        description="Rust's format strings are similar to Python's str.format() method, using {} as placeholders."
        pythonCode={`name = "Alice"
age = 30
pi = 3.14159

# f-strings (most common)
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Pi: {pi:.2f}")

# .format() method
print("Hello, {}!".format(name))

# Debug representation
data = [1, 2, 3]
print(f"Debug: {data!r}")
print(f"Data: {data}")`}
        rustCode={`fn main() {
    let name = "Alice";
    let age = 30;
    let pi = 3.14159_f64;

    // {} placeholders (like .format())
    println!("Name: {}", name);
    println!("Age: {}", age);
    println!("Pi: {:.2}", pi);

    // Named parameters
    println!("Hello, {name}!");

    // Debug printing with {:?}
    let data = vec![1, 2, 3];
    println!("Debug: {:?}", data);
    // Pretty-print with {:#?}
    println!("Pretty: {:#?}", data);
}`}
      />

      <CodeBlock
        language="rust"
        title="Common formatting options in Rust"
        code={`fn main() {
    // Basic formatting
    println!("String: {}", "hello");
    println!("Integer: {}", 42);
    println!("Float: {}", 3.14);

    // Precision for floats
    println!("Two decimals: {:.2}", 3.14159);

    // Padding and alignment
    println!("Right-aligned: {:>10}", "hello");
    println!("Left-aligned: {:>10}", "hello");
    println!("Zero-padded: {:05}", 42);

    // Debug format (works for most types)
    println!("Debug vec: {:?}", vec![1, 2, 3]);
    println!("Debug tuple: {:?}", (1, "hello", true));

    // Multiple values
    let (x, y) = (10, 20);
    println!("x={}, y={}, sum={}", x, y, x + y);

    // Print without newline
    print!("no newline");
    print!(" here\\n");

    // Print to stderr
    eprintln!("This goes to stderr");
}`}
      />

      <h2>Project Structure</h2>

      <p>
        Python and Rust organize projects differently. Python has evolved through several
        configuration formats (setup.py, setup.cfg, pyproject.toml). Rust has one
        standard from the start: Cargo.
      </p>

      <PythonRustCompare
        title="Project structure comparison"
        description="Rust's project structure is standardized by Cargo, while Python's varies by tooling choice."
        pythonCode={`# Python project structure (varies!)
# my_project/
# ├── pyproject.toml    # or setup.py
# ├── src/
# │   └── my_project/
# │       ├── __init__.py
# │       └── main.py
# ├── tests/
# │   └── test_main.py
# ├── requirements.txt  # or in pyproject
# └── README.md

# pyproject.toml
# [project]
# name = "my-project"
# version = "0.1.0"
# dependencies = ["numpy>=1.24"]

# Running:
# python -m my_project
# or: python src/my_project/main.py`}
        rustCode={`// Rust project structure (standardized)
// my_project/
// ├── Cargo.toml       # THE config file
// ├── Cargo.lock       # pinned deps
// ├── src/
// │   └── main.rs      # entry point
// ├── tests/
// │   └── integration_test.rs
// └── target/          # build artifacts
//     ├── debug/
//     └── release/

// Cargo.toml
// [package]
// name = "my-project"
// version = "0.1.0"
// edition = "2021"
// [dependencies]
// serde = "1.0"

// Running:
// cargo run`}
      />

      <h2>cargo new and cargo run</h2>

      <CodeBlock
        language="bash"
        title="Creating and running a Rust project"
        code={`# Create a new binary project
cargo new greeting
cd greeting

# Project is ready to run immediately
cargo run
# Output: Hello, world!

# Build without running (debug mode)
cargo build
# Binary is at: target/debug/greeting

# Build optimized (release mode)
cargo build --release
# Binary is at: target/release/greeting

# Run the release binary directly
./target/release/greeting

# Check for errors without building fully (faster)
cargo check`}
      />

      <NoteBlock type="tip" title="Use cargo check for fast feedback">
        During development, <code>cargo check</code> is much faster than <code>cargo build</code>
        because it skips code generation. It still runs the full type checker and borrow
        checker, so you get all the error messages without waiting for compilation.
        Use <code>cargo check</code> as you write, <code>cargo run</code> when you want
        to execute.
      </NoteBlock>

      <h2>Cargo.toml in Detail</h2>

      <CodeBlock
        language="toml"
        title="A typical Cargo.toml for a Rust project"
        code={`[package]
name = "my-data-tool"
version = "0.1.0"
edition = "2021"          # Rust edition (like Python version)
authors = ["Your Name <you@example.com>"]
description = "A fast data processing tool"

[dependencies]
# Simple version requirement
serde = "1.0"             # like numpy>=1.0,<2.0

# With features enabled
serde = { version = "1.0", features = ["derive"] }

# From git
# my_crate = { git = "https://github.com/user/repo" }

[dev-dependencies]
# Only used in tests (like pytest)
tempfile = "3"

[[bin]]
name = "my-tool"          # binary name
path = "src/main.rs"      # entry point`}
      />

      <NoteBlock type="note" title="Editions are not breaking changes">
        The <code>edition = "2021"</code> field specifies which Rust edition to use.
        Editions (2015, 2018, 2021, 2024) introduce new syntax and features but are
        fully backwards compatible — different edition crates can interoperate freely.
        Always use the latest edition for new projects.
      </NoteBlock>

      <ExerciseBlock
        title="Build a Greeting Program"
        difficulty="beginner"
        problem={`Create a new Rust project called "greeting" and modify main.rs to:

1. Declare a variable \`name\` with your name
2. Declare a variable \`language\` set to "Rust"
3. Declare a variable \`experience_years\` set to 0
4. Print a formatted message like: "Hi, I'm Alice! I have 0 years of Rust experience, but I'm ready to learn!"
5. Print the debug representation of a vector containing your favorite programming languages

Use \`cargo run\` to execute it, then try \`cargo build --release\` and compare the binary sizes in target/debug/ vs target/release/.`}
        solution={`\`\`\`rust
fn main() {
    let name = "Alice";
    let language = "Rust";
    let experience_years = 0;

    println!(
        "Hi, I'm {}! I have {} years of {} experience, but I'm ready to learn!",
        name, experience_years, language
    );

    let favorites = vec!["Python", "Rust", "SQL"];
    println!("My favorite languages: {:?}", favorites);
}
\`\`\`

Output:
\`\`\`
Hi, I'm Alice! I have 0 years of Rust experience, but I'm ready to learn!
My favorite languages: ["Python", "Rust", "SQL"]
\`\`\`

The debug binary (target/debug/) will be several MB larger than the release binary (target/release/) because it includes debug symbols and is not optimized. In release mode, the compiler applies aggressive optimizations including inlining, dead code elimination, and loop unrolling.`}
      />
    </div>
  );
}
