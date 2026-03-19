import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Setup() {
  return (
    <div className="prose-rust">
      <h1>Setting Up Rust</h1>

      <p>
        Getting Rust installed and ready to use is straightforward. The Rust ecosystem
        centers around two tools: <strong>rustup</strong> (the toolchain manager, similar
        to pyenv) and <strong>cargo</strong> (the build system and package manager,
        similar to pip + poetry + pytest combined). This section walks you through
        installation, project creation, and IDE setup.
      </p>

      <ConceptBlock title="The Rust Toolchain">
        <p>
          Rust's toolchain has three core pieces:
        </p>
        <ul>
          <li><strong>rustup</strong> — manages Rust versions and components (like pyenv for Python)</li>
          <li><strong>rustc</strong> — the Rust compiler (like python itself, but compiles to native code)</li>
          <li><strong>cargo</strong> — builds projects, manages dependencies, runs tests, and more (like pip + poetry + pytest + setuptools combined)</li>
        </ul>
        <p>
          Unlike Python, where you juggle pip, poetry, venv, pyproject.toml, and setup.py,
          Rust has a single official tool for everything: Cargo.
        </p>
      </ConceptBlock>

      <h2>Installing Rust with rustup</h2>

      <p>
        The recommended way to install Rust is through rustup, which manages your Rust
        installation and makes it easy to switch between stable, beta, and nightly versions.
      </p>

      <CodeBlock
        language="bash"
        title="Install Rust (macOS, Linux, WSL)"
        code={`# Install rustup (the Rust toolchain manager)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Follow the prompts — the defaults are fine
# Then restart your shell or run:
source $HOME/.cargo/env

# Verify the installation
rustc --version    # e.g., rustc 1.80.0
cargo --version    # e.g., cargo 1.80.0
rustup --version   # e.g., rustup 1.27.1`}
      />

      <NoteBlock type="pythonista" title="rustup is like pyenv + pip combined">
        Just as <code>pyenv install 3.12</code> installs a Python version,
        <code>rustup install stable</code> installs the latest stable Rust. But
        unlike Python, you rarely need to manage multiple Rust versions — the
        stable release every 6 weeks is almost always what you want.
      </NoteBlock>

      <CodeBlock
        language="bash"
        title="Useful rustup commands"
        code={`# Update to the latest Rust
rustup update

# Show installed toolchains
rustup show

# Install a specific version
rustup install 1.79.0

# Add components (like clippy for linting)
rustup component add clippy
rustup component add rustfmt`}
      />

      <h2>Cargo Basics</h2>

      <p>
        Cargo is the heart of Rust development. It handles project creation, building,
        testing, dependency management, and publishing — everything that takes multiple
        tools in Python.
      </p>

      <CodeBlock
        language="bash"
        title="Essential cargo commands"
        code={`# Create a new project
cargo new my_project        # creates a binary (executable) project
cargo new my_lib --lib      # creates a library project

# Build and run
cargo build                 # compile (debug mode, fast compile)
cargo build --release       # compile (release mode, optimized)
cargo run                   # build and run
cargo run --release         # build optimized and run

# Testing and quality
cargo test                  # run all tests
cargo clippy                # run the linter (like ruff/flake8)
cargo fmt                   # format code (like black/ruff format)

# Dependencies
cargo add serde             # add a dependency (like pip install)
cargo update                # update dependencies`}
      />

      <PythonRustCompare
        title="Project commands comparison"
        description="Cargo unifies what takes multiple tools in Python."
        pythonCode={`# Python: multiple tools for different tasks

# Create project structure
# (no standard tool — manual or cookiecutter)
mkdir my_project && cd my_project

# Install dependencies
pip install numpy
poetry add numpy
uv pip install numpy

# Run code
python main.py

# Test
pytest

# Lint and format
ruff check .
ruff format .
# or: black . && flake8 .

# Build a package
python -m build`}
        rustCode={`# Rust: cargo does everything

# Create project structure
cargo new my_project

# Install dependencies
cargo add serde

# Run code
cargo run

# Test
cargo test

# Lint and format
cargo clippy
cargo fmt

# Build
cargo build --release`}
      />

      <h2>Cargo.toml — Your Project Configuration</h2>

      <p>
        Every Rust project has a <code>Cargo.toml</code> file at its root. This is
        Rust's equivalent of <code>pyproject.toml</code> — it defines your project
        metadata, dependencies, and build settings.
      </p>

      <PythonRustCompare
        title="Project configuration files"
        description="Cargo.toml serves the same role as pyproject.toml but with a more standardized format."
        pythonCode={`# pyproject.toml
[project]
name = "my-project"
version = "0.1.0"
description = "My Python project"
requires-python = ">=3.10"

[project.dependencies]
numpy = ">=1.24"
pandas = ">=2.0"
requests = ">=2.31"

[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.ruff]
line-length = 88`}
        rustCode={`# Cargo.toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
reqwest = "0.12"

# Optional: dev dependencies (like pytest)
[dev-dependencies]
criterion = "0.5"  # benchmarking

# Optional: build profile settings
[profile.release]
opt-level = 3`}
      />

      <NoteBlock type="note" title="Cargo.lock is like requirements.txt">
        When you build, Cargo creates a <code>Cargo.lock</code> file that pins exact
        dependency versions — similar to <code>poetry.lock</code> or
        <code>pip freeze &gt; requirements.txt</code>. For applications, commit the
        lock file. For libraries, don't.
      </NoteBlock>

      <h2>IDE Setup: VS Code + rust-analyzer</h2>

      <p>
        The best development experience for Rust is VS Code with the
        <strong>rust-analyzer</strong> extension. It provides real-time type checking,
        inline type hints, go-to-definition, auto-completion, and error highlighting
        that rivals the best Python IDE experiences.
      </p>

      <CodeBlock
        language="bash"
        title="Setting up VS Code for Rust"
        code={`# Install the rust-analyzer extension
# In VS Code: Ctrl+Shift+X (Cmd+Shift+X on Mac)
# Search for "rust-analyzer" and install it

# Recommended additional extensions:
# - "Even Better TOML" — syntax highlighting for Cargo.toml
# - "Error Lens" — inline error messages
# - "CodeLLDB" — debugger for Rust

# Useful VS Code settings for Rust (settings.json):
# {
#   "rust-analyzer.check.command": "clippy",
#   "rust-analyzer.inlayHints.parameterHints.enable": true,
#   "rust-analyzer.inlayHints.typeHints.enable": true
# }`}
      />

      <NoteBlock type="tip" title="rust-analyzer is your best friend">
        Unlike Python, where IDE support is limited by dynamic typing, Rust's static
        type system means rust-analyzer can provide extremely accurate completions,
        refactoring, and error detection. It will show you types inline, catch errors
        as you type, and suggest fixes. Lean on it heavily while learning.
      </NoteBlock>

      <h2>Your First Project</h2>

      <CodeBlock
        language="bash"
        title="Creating and running your first Rust project"
        code={`# Create a new project
cargo new hello_rust
cd hello_rust

# Look at the project structure
tree .
# .
# ├── Cargo.toml
# └── src
#     └── main.rs

# The generated main.rs already has Hello World:
# fn main() {
#     println!("Hello, world!");
# }

# Build and run it
cargo run
# Compiling hello_rust v0.1.0
# Running \`target/debug/hello_rust\`
# Hello, world!`}
      />

      <CodeBlock
        language="rust"
        title="Modify src/main.rs to try something more interesting"
        code={`fn main() {
    let name = "Pythonista";
    let languages = vec!["Python", "Rust"];

    println!("Hello, {}!", name);
    println!("I'm learning: {:?}", languages);

    for (i, lang) in languages.iter().enumerate() {
        println!("  {}. {}", i + 1, lang);
    }

    let sum: i32 = (1..=100).sum();
    println!("Sum of 1 to 100: {}", sum);
}`}
      />

      <ExerciseBlock
        title="Set Up Your Rust Environment"
        difficulty="beginner"
        problem={`Complete these steps to verify your Rust environment is working:

1. Install Rust using rustup (if not already installed).
2. Run \`rustc --version\` and \`cargo --version\` to confirm installation.
3. Create a new project with \`cargo new rust_playground\`.
4. Modify \`src/main.rs\` to print your name and the current year.
5. Run it with \`cargo run\`.
6. Run \`cargo clippy\` and \`cargo fmt\` to check linting and formatting.
7. Bonus: Open the project in VS Code with rust-analyzer and observe the inline type hints.

Paste the output of \`cargo run\` to confirm everything works.`}
        solution={`After installation and project creation:

\`\`\`rust
// src/main.rs
fn main() {
    let name = "Your Name";
    let year = 2025;
    println!("Hello, I'm {} and it's {}!", name, year);
    println!("I'm learning Rust to supercharge my Python projects.");
}
\`\`\`

Expected output of \`cargo run\`:
\`\`\`
   Compiling rust_playground v0.1.0 (/path/to/rust_playground)
    Finished dev [unoptimized + debuginfo] target(s) in 0.50s
     Running \`target/debug/rust_playground\`
Hello, I'm Your Name and it's 2025!
I'm learning Rust to supercharge my Python projects.
\`\`\`

\`cargo clippy\` should report no warnings.
\`cargo fmt\` should make no changes (the default template is already formatted).

If you see these results, your Rust environment is fully set up and ready to go.`}
      />
    </div>
  );
}
