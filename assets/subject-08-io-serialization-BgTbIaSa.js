import{j as e}from"./vendor-Dh_dlHsl.js";import{C as r,P as s,N as i,a as t,E as n}from"./subject-01-getting-started-DoSDK0Fn.js";function o(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Reading & Writing Files"}),e.jsxs("p",{children:["File I/O is something every data scientist does daily. Python's"," ",e.jsx("code",{children:"open()"})," is beautifully simple, and Rust's file operations are quite similar — but with explicit error handling and no garbage collector managing file handles. The good news: Rust files auto-close when they go out of scope, just like Python's ",e.jsx("code",{children:"with"})," blocks."]}),e.jsx(r,{title:"RAII File Handles",children:e.jsxs("p",{children:["In Python, you use ",e.jsx("code",{children:"with open(...) as f"})," to ensure files are closed. In Rust, file handles implement ",e.jsx("code",{children:"Drop"}),", which means they are automatically closed when they go out of scope. Every variable in Rust behaves like it is inside a ",e.jsx("code",{children:"with"})," block."]})}),e.jsx("h2",{children:"Reading Files: The Basics"}),e.jsx(s,{title:"Reading an entire file into a string",description:"Both languages make reading a file into a string straightforward.",pythonCode:`# Python: read entire file
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
        print(line.strip())`,rustCode:`use std::fs;
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
} // file handles auto-closed here`}),e.jsxs(i,{type:"pythonista",title:"The ? operator is your friend",children:["Where Python raises exceptions, Rust returns ",e.jsx("code",{children:"Result"}),". The ",e.jsx("code",{children:"?"})," operator propagates errors automatically — it is equivalent to ",e.jsx("code",{children:"try/except"})," that re-raises on error. Your function must return ",e.jsx("code",{children:"Result"})," to use ",e.jsx("code",{children:"?"}),"."]}),e.jsx("h2",{children:"Writing Files"}),e.jsx(s,{title:"Writing text to a file",description:"Both languages offer simple write-all and line-by-line approaches.",pythonCode:`# Write entire string
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
    print("formatted", 42, file=f)`,rustCode:`use std::fs;
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
}`}),e.jsx("h2",{children:"Processing CSV-like Data"}),e.jsx(t,{language:"rust",title:"Line-by-line processing — a common data task",code:`use std::fs;
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
}`}),e.jsxs(i,{type:"tip",title:"Always use BufReader and BufWriter",children:[e.jsx("code",{children:"BufReader"})," and ",e.jsx("code",{children:"BufWriter"})," buffer I/O operations, reducing the number of system calls. Without them, each"," ",e.jsx("code",{children:"read"})," or ",e.jsx("code",{children:"write"})," call is a syscall. Python does this buffering automatically; in Rust, you opt in for maximum control."]}),e.jsx("h2",{children:"Working with Paths"}),e.jsx(t,{language:"rust",title:"Cross-platform path handling",code:`use std::path::{Path, PathBuf};
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
}`}),e.jsx(n,{title:"Word Frequency Counter",difficulty:"intermediate",problem:`Write a program that:

1. Reads a text file into a String
2. Splits it into words (split_whitespace), converts to lowercase
3. Counts the frequency of each word using a HashMap
4. Writes the top 10 most frequent words to an output file, one per line: "word: count"

Use BufWriter for output. Handle errors with the ? operator.`,solution:`use std::collections::HashMap;
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
}`})]})}const u=Object.freeze(Object.defineProperty({__proto__:null,default:o},Symbol.toStringTag,{value:"Module"}));function a(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"serde — The Serialization Framework"}),e.jsxs("p",{children:["In Python, you use ",e.jsx("code",{children:"json.dumps()"})," and ",e.jsx("code",{children:"json.loads()"}),", or ",e.jsx("code",{children:"pickle"}),", or ",e.jsx("code",{children:"yaml"})," — each with its own API. Rust's ",e.jsx("strong",{children:"serde"})," is a universal serialization framework that works with JSON, TOML, YAML, MessagePack, CSV, and dozens more formats through a single, unified interface. Just derive two traits and your struct works with all formats automatically."]}),e.jsx(r,{title:"How serde Works",children:e.jsxs("p",{children:[e.jsx("code",{children:"serde"})," provides two traits: ",e.jsx("code",{children:"Serialize"})," and"," ",e.jsx("code",{children:"Deserialize"}),". You derive them on your structs, and serde generates all the conversion code at compile time. Then you pair serde with a format crate (",e.jsx("code",{children:"serde_json"}),", ",e.jsx("code",{children:"serde_yaml"}),",",e.jsx("code",{children:"toml"}),") to convert to/from that format. Zero runtime reflection — everything is known at compile time."]})}),e.jsx("h2",{children:"JSON: Python vs Rust"}),e.jsx(s,{title:"Serializing and deserializing JSON",description:"Python uses dicts; Rust uses typed structs. Serde bridges struct fields to JSON keys automatically.",pythonCode:`import json

# Python: dicts with string keys
data = {
    "name": "Alice",
    "age": 30,
    "scores": [95.0, 87.5, 92.0]
}

# Serialize to JSON string
json_str = json.dumps(data, indent=2)
print(json_str)

# Deserialize from JSON string
parsed = json.loads(json_str)
print(parsed["name"])   # "Alice"
print(parsed["scores"]) # [95.0, 87.5, 92.0]

# No type safety — this compiles fine:
# parsed["age"] + "hello"  # runtime crash!`,rustCode:`use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct Person {
    name: String,
    age: u32,
    scores: Vec<f64>,
}

fn main() -> serde_json::Result<()> {
    let data = Person {
        name: "Alice".into(),
        age: 30,
        scores: vec![95.0, 87.5, 92.0],
    };

    // Serialize to JSON string
    let json_str = serde_json::to_string_pretty(&data)?;
    println!("{}", json_str);

    // Deserialize — fully type-checked!
    let parsed: Person = serde_json::from_str(&json_str)?;
    println!("{}", parsed.name);     // "Alice"
    println!("{:?}", parsed.scores); // [95.0, 87.5, 92.0]
    // parsed.age + "hello"  // compile error!

    Ok(())
}`}),e.jsxs(i,{type:"pythonista",title:"Type-safe deserialization is a superpower",children:["In Python, ",e.jsx("code",{children:"json.loads()"})," returns a dict and you hope the keys exist with the right types. In Rust, ",e.jsx("code",{children:"serde_json::from_str"}),"either gives you a correctly-typed struct or returns an error. Malformed data is caught immediately, not three function calls later."]}),e.jsx("h2",{children:"Serde Attributes for Customization"}),e.jsx(t,{language:"rust",title:"Controlling serialization with attributes",code:`use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct ApiResponse {
    // Rename fields for JSON conventions
    #[serde(rename = "userId")]
    user_id: u64,

    #[serde(rename = "firstName")]
    first_name: String,

    // Optional fields (default to None)
    #[serde(skip_serializing_if = "Option::is_none")]
    email: Option<String>,

    // Default value if missing in JSON
    #[serde(default)]
    verified: bool,

    // Skip this field entirely
    #[serde(skip)]
    internal_cache: Vec<u8>,
}

// Rename all fields at once
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ModelConfig {
    learning_rate: f64,    // -> "learningRate" in JSON
    batch_size: usize,     // -> "batchSize" in JSON
    num_epochs: u32,       // -> "numEpochs" in JSON
    model_name: String,    // -> "modelName" in JSON
}

fn main() -> serde_json::Result<()> {
    let json = r#"{
        "learningRate": 0.001,
        "batchSize": 32,
        "numEpochs": 10,
        "modelName": "bert-base"
    }"#;

    let config: ModelConfig = serde_json::from_str(json)?;
    println!("{:#?}", config);
    Ok(())
}`}),e.jsx("h2",{children:"Working with Multiple Formats"}),e.jsx(t,{language:"rust",title:"One struct, many formats",code:`use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct Config {
    name: String,
    version: u32,
    features: Vec<String>,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Config {
        name: "my-app".into(),
        version: 1,
        features: vec!["gpu".into(), "distributed".into()],
    };

    // JSON
    let json = serde_json::to_string_pretty(&config)?;
    println!("JSON:\\n{}", json);

    // TOML (with the 'toml' crate)
    // let toml_str = toml::to_string_pretty(&config)?;
    // println!("TOML:\\n{}", toml_str);

    // Deserialize from JSON
    let from_json: Config = serde_json::from_str(&json)?;
    println!("\\nParsed: {:?}", from_json);

    // Read from file
    // let config: Config = serde_json::from_reader(
    //     std::fs::File::open("config.json")?
    // )?;

    Ok(())
}`}),e.jsx("h2",{children:"Cargo.toml Setup"}),e.jsx(t,{language:"toml",title:"Adding serde to your project",code:`[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"        # JSON format

# Optional: other formats
# toml = "0.8"          # TOML format
# serde_yaml = "0.9"    # YAML format
# csv = "1"             # CSV format
# rmp-serde = "1"       # MessagePack (binary, fast)`}),e.jsxs(i,{type:"tip",title:"serde_json is fast",children:[e.jsx("code",{children:"serde_json"})," is significantly faster than Python's built-in"," ",e.jsx("code",{children:"json"})," module. For even more speed, try ",e.jsx("code",{children:"simd-json"}),"which uses SIMD instructions to parse JSON. In Python, you may have used ",e.jsx("code",{children:"orjson"})," — which is itself written in Rust using serde!"]}),e.jsx(n,{title:"Config File Parser",difficulty:"intermediate",problem:`Create a program that:

1. Defines a DatabaseConfig struct with fields: host (String), port (u16), database (String), max_connections (u32, default 10), ssl (bool, default false)
2. Deserializes this JSON into your struct:
   {"host": "localhost", "port": 5432, "database": "ml_data"}
   (note: max_connections and ssl are missing — use #[serde(default)])
3. Serializes it back to pretty JSON and prints the result (should include the default values)

Bonus: Add a #[serde(rename = "max_connections")] to use "maxConnections" in JSON while keeping snake_case in Rust.`,solution:`use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct DatabaseConfig {
    host: String,
    port: u16,
    database: String,

    #[serde(default = "default_max_connections")]
    max_connections: u32,

    #[serde(default)]  // defaults to false for bool
    ssl: bool,
}

fn default_max_connections() -> u32 {
    10
}

fn main() -> serde_json::Result<()> {
    let json = r#"{
        "host": "localhost",
        "port": 5432,
        "database": "ml_data"
    }"#;

    // Deserialize — missing fields get defaults
    let config: DatabaseConfig = serde_json::from_str(json)?;
    println!("{:#?}", config);
    // max_connections = 10, ssl = false

    // Serialize back — includes defaults now
    let output = serde_json::to_string_pretty(&config)?;
    println!("{}", output);

    Ok(())
}

// Output JSON:
// {
//   "host": "localhost",
//   "port": 5432,
//   "database": "ml_data",
//   "max_connections": 10,
//   "ssl": false
// }`})]})}const c=Object.freeze(Object.defineProperty({__proto__:null,default:a},Symbol.toStringTag,{value:"Module"}));export{c as a,u as s};
