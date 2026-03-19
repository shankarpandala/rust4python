import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function SerdeFramework() {
  return (
    <div className="prose-rust">
      <h1>serde — The Serialization Framework</h1>

      <p>
        In Python, you use <code>json.dumps()</code> and <code>json.loads()</code>,
        or <code>pickle</code>, or <code>yaml</code> — each with its own API.
        Rust's <strong>serde</strong> is a universal serialization framework
        that works with JSON, TOML, YAML, MessagePack, CSV, and dozens more
        formats through a single, unified interface. Just derive two traits and
        your struct works with all formats automatically.
      </p>

      <ConceptBlock title="How serde Works">
        <p>
          <code>serde</code> provides two traits: <code>Serialize</code> and{' '}
          <code>Deserialize</code>. You derive them on your structs, and serde
          generates all the conversion code at compile time. Then you pair serde
          with a format crate (<code>serde_json</code>, <code>serde_yaml</code>,
          <code>toml</code>) to convert to/from that format. Zero runtime
          reflection — everything is known at compile time.
        </p>
      </ConceptBlock>

      <h2>JSON: Python vs Rust</h2>

      <PythonRustCompare
        title="Serializing and deserializing JSON"
        description="Python uses dicts; Rust uses typed structs. Serde bridges struct fields to JSON keys automatically."
        pythonCode={`import json

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
# parsed["age"] + "hello"  # runtime crash!`}
        rustCode={`use serde::{Serialize, Deserialize};

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
}`}
      />

      <NoteBlock type="pythonista" title="Type-safe deserialization is a superpower">
        In Python, <code>json.loads()</code> returns a dict and you hope the
        keys exist with the right types. In Rust, <code>serde_json::from_str</code>
        either gives you a correctly-typed struct or returns an error. Malformed
        data is caught immediately, not three function calls later.
      </NoteBlock>

      <h2>Serde Attributes for Customization</h2>

      <CodeBlock
        language="rust"
        title="Controlling serialization with attributes"
        code={`use serde::{Serialize, Deserialize};

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
}`}
      />

      <h2>Working with Multiple Formats</h2>

      <CodeBlock
        language="rust"
        title="One struct, many formats"
        code={`use serde::{Serialize, Deserialize};

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
}`}
      />

      <h2>Cargo.toml Setup</h2>

      <CodeBlock
        language="toml"
        title="Adding serde to your project"
        code={`[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"        # JSON format

# Optional: other formats
# toml = "0.8"          # TOML format
# serde_yaml = "0.9"    # YAML format
# csv = "1"             # CSV format
# rmp-serde = "1"       # MessagePack (binary, fast)`}
      />

      <NoteBlock type="tip" title="serde_json is fast">
        <code>serde_json</code> is significantly faster than Python's built-in{' '}
        <code>json</code> module. For even more speed, try <code>simd-json</code>
        which uses SIMD instructions to parse JSON. In Python, you may have
        used <code>orjson</code> — which is itself written in Rust using serde!
      </NoteBlock>

      <ExerciseBlock
        title="Config File Parser"
        difficulty="intermediate"
        problem={`Create a program that:

1. Defines a DatabaseConfig struct with fields: host (String), port (u16), database (String), max_connections (u32, default 10), ssl (bool, default false)
2. Deserializes this JSON into your struct:
   {"host": "localhost", "port": 5432, "database": "ml_data"}
   (note: max_connections and ssl are missing — use #[serde(default)])
3. Serializes it back to pretty JSON and prints the result (should include the default values)

Bonus: Add a #[serde(rename = "max_connections")] to use "maxConnections" in JSON while keeping snake_case in Rust.`}
        solution={`use serde::{Serialize, Deserialize};

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
// }`}
      />
    </div>
  );
}
