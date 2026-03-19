import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Modules() {
  return (
    <div className="prose-rust">
      <h1>Modules &amp; Crates</h1>

      <p>
        Rust's module system organizes code into hierarchical namespaces, controls
        visibility (public vs private), and manages external dependencies. If you are
        coming from Python, the concepts map reasonably well: Rust modules are like
        Python modules, crates are like Python packages, and <code>use</code> is like
        <code>import</code>. The key differences are explicit visibility (everything
        is private by default) and the way modules are declared.
      </p>

      <ConceptBlock title="Crates and Modules">
        <p>
          Rust code organization has two levels:
        </p>
        <ul>
          <li><strong>Crate:</strong> The top-level compilation unit — either a binary (has <code>main.rs</code>) or a library (has <code>lib.rs</code>). A crate is like a Python package that you install with pip. Crates are published to <a href="https://crates.io">crates.io</a> (Rust's PyPI).</li>
          <li><strong>Module:</strong> A namespace within a crate that groups related code. Modules can be nested. A module is like a Python module file or a sub-package directory.</li>
        </ul>
        <p>
          Everything in Rust is <strong>private by default</strong>. You must use
          <code>pub</code> to make items visible outside their module. This is the
          opposite of Python, where everything is public unless prefixed with <code>_</code>.
        </p>
      </ConceptBlock>

      <h2>Defining Modules</h2>

      <PythonRustCompare
        title="Module structure"
        description="Python uses files and directories with __init__.py. Rust uses the mod keyword and file naming conventions."
        pythonCode={`# Python: file = module, directory = package

# my_project/
# ├── __init__.py
# ├── math_utils.py
# ├── data/
# │   ├── __init__.py
# │   ├── loader.py
# │   └── processor.py

# math_utils.py
def add(a, b):
    return a + b

def _helper():  # "private" by convention
    pass

# data/loader.py
def load_csv(path):
    ...

# main.py
from math_utils import add
from data.loader import load_csv`}
        rustCode={`// Rust: mod declares modules

// src/
// ├── main.rs
// ├── math_utils.rs
// ├── data/
// │   ├── mod.rs
// │   ├── loader.rs
// │   └── processor.rs

// math_utils.rs
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn helper() { } // private (no pub)

// data/loader.rs
pub fn load_csv(path: &str) {
    println!("Loading {}", path);
}

// main.rs
mod math_utils;   // declares module
mod data;         // declares module

use math_utils::add;
use data::loader::load_csv;

fn main() {
    println!("{}", add(2, 3));
    load_csv("data.csv");
}`}
      />

      <NoteBlock type="pythonista" title="mod declares, use imports">
        In Python, <code>import</code> both finds the module and brings names into scope.
        Rust splits this into two steps: <code>mod math_utils;</code> tells the compiler
        this module exists (and where to find its file), and <code>use math_utils::add;</code>
        brings the name into the current scope. The <code>mod</code> declaration is
        needed once (usually in <code>main.rs</code> or <code>lib.rs</code>), while
        <code>use</code> is used wherever you need the item.
      </NoteBlock>

      <h2>Visibility with pub</h2>

      <CodeBlock
        language="rust"
        title="Public vs private items"
        code={`// Everything is private by default in Rust
mod authentication {
    // Public function — accessible from outside the module
    pub fn login(username: &str, password: &str) -> bool {
        let hashed = hash_password(password); // can call private fn
        validate(username, &hashed)
    }

    // Private function — only accessible within this module
    fn hash_password(password: &str) -> String {
        format!("hashed_{}", password) // simplified
    }

    fn validate(username: &str, hashed: &str) -> bool {
        username == "admin" && hashed == "hashed_secret"
    }

    // Public struct with mixed visibility fields
    pub struct User {
        pub name: String,      // public field
        pub email: String,     // public field
        password_hash: String, // private field!
    }

    impl User {
        // Public constructor (needed because password_hash is private)
        pub fn new(name: &str, email: &str, password: &str) -> User {
            User {
                name: name.to_string(),
                email: email.to_string(),
                password_hash: hash_password(password),
            }
        }
    }
}

fn main() {
    let success = authentication::login("admin", "secret");
    println!("Login: {}", success);

    // authentication::hash_password("x"); // ERROR: private
    // authentication::validate("x", "y"); // ERROR: private

    let user = authentication::User::new("Alice", "alice@example.com", "pass123");
    println!("User: {}", user.name);      // OK: pub field
    // println!("{}", user.password_hash); // ERROR: private field
}`}
      />

      <h2>The use Keyword</h2>

      <PythonRustCompare
        title="Import syntax"
        description="Rust's use is similar to Python's from...import with some additional features."
        pythonCode={`# Python imports
import os
import os.path
from os.path import join, exists
from collections import (
    OrderedDict,
    defaultdict,
    Counter,
)

# Alias
import numpy as np
from typing import List as L

# Relative imports
from . import sibling_module
from ..parent import something`}
        rustCode={`// Rust use statements
use std::fs;
use std::path::Path;
use std::path::{PathBuf, Path};
use std::collections::{
    HashMap,
    HashSet,
    BTreeMap,
};

// Alias
use std::collections::HashMap as Map;
use std::io::Result as IoResult;

// Glob import (use sparingly)
use std::collections::*;

// Nested paths
use std::{
    fs::File,
    io::{self, Read, Write},
    path::Path,
};

// Re-export (pub use)
pub use self::internal::PublicApi;`}
      />

      <h2>File Structure for Modules</h2>

      <CodeBlock
        language="rust"
        title="Two conventions for module files"
        code={`// Convention 1: mod.rs (older style)
// src/
// ├── main.rs
// └── data/
//     ├── mod.rs         ← declares sub-modules
//     ├── loader.rs
//     └── processor.rs

// data/mod.rs:
pub mod loader;
pub mod processor;

// Convention 2: named file (modern style, Rust 2018+)
// src/
// ├── main.rs
// ├── data.rs            ← declares sub-modules
// └── data/
//     ├── loader.rs
//     └── processor.rs

// data.rs:
pub mod loader;
pub mod processor;

// Both work the same way.
// The modern style (data.rs + data/) is preferred
// for new projects.

// In main.rs (same for both):
mod data;

use data::loader::load_csv;
use data::processor::process;

fn main() {
    load_csv("input.csv");
    process();
}`}
      />

      <NoteBlock type="tip" title="Start simple, organize later">
        For small projects, you can define modules inline in <code>main.rs</code> using
        <code>mod my_module {'{ ... }'}</code>. As your project grows, extract modules
        into separate files. This is similar to starting with everything in one Python
        file and splitting into a package as it grows.
      </NoteBlock>

      <h2>External Crates (Dependencies)</h2>

      <CodeBlock
        language="toml"
        title="Adding dependencies in Cargo.toml"
        code={`# Cargo.toml — add external crates here
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
reqwest = { version = "0.12", features = ["json"] }
tokio = { version = "1", features = ["full"] }
rand = "0.8"

# Add via command line:
# cargo add serde --features derive
# cargo add rand`}
      />

      <CodeBlock
        language="rust"
        title="Using external crates"
        code={`// After adding to Cargo.toml, just 'use' them
use rand::Rng;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct DataPoint {
    x: f64,
    y: f64,
    label: String,
}

fn main() {
    // Using the rand crate
    let mut rng = rand::thread_rng();
    let random_number: f64 = rng.gen_range(0.0..1.0);
    println!("Random: {:.4}", random_number);

    // Using serde for JSON serialization
    let point = DataPoint {
        x: 1.5,
        y: 2.7,
        label: String::from("sample"),
    };
    let json = serde_json::to_string_pretty(&point).unwrap();
    println!("{}", json);

    // Deserialize back
    let parsed: DataPoint = serde_json::from_str(&json).unwrap();
    println!("Parsed: {:?}", parsed);
}`}
      />

      <h2>Crate Structure: lib.rs vs main.rs</h2>

      <PythonRustCompare
        title="Library vs executable"
        description="Rust projects can be a library, a binary, or both — controlled by which entry files exist."
        pythonCode={`# Python: any module can be both importable
# and executable

# my_package/__init__.py
def useful_function():
    return 42

# my_package/__main__.py
# (or: if __name__ == "__main__":)
from . import useful_function
print(useful_function())

# Can be:
# python -m my_package  (runs __main__)
# import my_package     (uses as library)`}
        rustCode={`// Rust: separate entry points

// src/lib.rs — library entry point
pub fn useful_function() -> i32 {
    42
}

pub mod helpers {
    pub fn format_number(n: i32) -> String {
        format!("The number is {}", n)
    }
}

// src/main.rs — binary entry point
// Imports from the library part of the
// same crate
use my_crate::useful_function;
use my_crate::helpers::format_number;

fn main() {
    let n = useful_function();
    println!("{}", format_number(n));
}

// Having both lib.rs and main.rs means
// your crate is both a library AND a binary.
// Others can depend on the library part.`}
      />

      <NoteBlock type="note" title="The prelude — what's available without use">
        Rust automatically imports a small set of very common items into every module
        (the &quot;prelude&quot;): <code>Option</code>, <code>Result</code>,
        <code>Vec</code>, <code>String</code>, <code>Box</code>, common traits like
        <code>Clone</code>, <code>Copy</code>, <code>Iterator</code>, and more. This
        is why you can use <code>Vec::new()</code> or <code>Some(42)</code> without
        any <code>use</code> statement. Everything else requires an explicit import.
      </NoteBlock>

      <ExerciseBlock
        title="Module Organization Practice"
        difficulty="intermediate"
        problem={`Design a Rust project structure for a simple data analysis tool. Sketch out (in comments or code) the following:

1. A module \`stats\` with public functions:
   - \`mean(data: &[f64]) -> f64\`
   - \`median(data: &mut Vec<f64>) -> f64\`
   - \`std_dev(data: &[f64]) -> f64\`
   And a private helper function \`variance(data: &[f64]) -> f64\`

2. A module \`io\` with a sub-module \`csv\` containing:
   - \`pub fn read_column(path: &str, col: usize) -> Vec<f64>\`

3. A \`main.rs\` that uses both modules.

Write the actual code for the \`stats\` module (with the functions implemented). For the \`io\` module, write the structure with placeholder implementations.

Include the file/directory layout as comments.`}
        solution={`\`\`\`rust
// File structure:
// src/
// ├── main.rs
// ├── stats.rs
// ├── io.rs
// └── io/
//     └── csv.rs

// === src/stats.rs ===
pub fn mean(data: &[f64]) -> f64 {
    if data.is_empty() {
        return 0.0;
    }
    data.iter().sum::<f64>() / data.len() as f64
}

pub fn median(data: &mut Vec<f64>) -> f64 {
    data.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let len = data.len();
    if len == 0 {
        return 0.0;
    }
    if len % 2 == 0 {
        (data[len / 2 - 1] + data[len / 2]) / 2.0
    } else {
        data[len / 2]
    }
}

pub fn std_dev(data: &[f64]) -> f64 {
    variance(data).sqrt()
}

fn variance(data: &[f64]) -> f64 {
    let avg = mean(data);
    data.iter()
        .map(|x| (x - avg).powi(2))
        .sum::<f64>() / data.len() as f64
}

// === src/io.rs ===
pub mod csv;

// === src/io/csv.rs ===
pub fn read_column(_path: &str, _col: usize) -> Vec<f64> {
    // Placeholder implementation
    vec![1.0, 2.0, 3.0, 4.0, 5.0]
}

// === src/main.rs ===
mod stats;
mod io;

use stats::{mean, median, std_dev};
use io::csv::read_column;

fn main() {
    let mut data = read_column("data.csv", 0);
    println!("Mean: {:.2}", mean(&data));
    println!("Median: {:.2}", median(&mut data));
    println!("Std Dev: {:.2}", std_dev(&data));
    // variance is private — can't call stats::variance()
}
\`\`\`

Key points: \`variance\` has no \`pub\` keyword so it's only callable within the \`stats\` module. The \`io\` module uses the modern file convention (io.rs + io/ directory). Sub-modules must be declared with \`pub mod\` in their parent to be accessible from outside.`}
      />
    </div>
  );
}
