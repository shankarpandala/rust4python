import{j as e}from"./vendor-Dh_dlHsl.js";import{C as s,P as r,N as n,a as t,E as o}from"./subject-01-getting-started-DoSDK0Fn.js";function i(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"HuggingFace Tokenizers — The Rust Core"}),e.jsxs("p",{children:["Every time you call ",e.jsx("code",{children:"tokenizer.encode()"})," in Python's"," ",e.jsx("code",{children:"transformers"})," library, you are running Rust code. The HuggingFace ",e.jsx("code",{children:"tokenizers"})," library is written in Rust and exposed to Python via PyO3. Understanding the Rust side gives you direct access to the fastest tokenization available, and the ability to customize or extend it."]}),e.jsx(s,{title:"Why Tokenizers Are Written in Rust",children:e.jsx("p",{children:"Tokenization is the bottleneck in many NLP pipelines. Processing billions of tokens for pre-training data, encoding prompts at inference time, or batch-encoding datasets all benefit from Rust's speed. The HuggingFace tokenizers library achieves 10-100x speedups over pure Python implementations by leveraging Rust's zero-cost abstractions and parallelism."})}),e.jsx("h2",{children:"Tokenization: Python vs Rust"}),e.jsx(r,{title:"Using the tokenizers library",description:"The same tokenizers library, used from both Python and Rust.",pythonCode:`from tokenizers import Tokenizer
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
print(f"Encoded {len(encoded)} texts")`,rustCode:`use tokenizers::Tokenizer;

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
}`}),e.jsxs(n,{type:"pythonista",title:"Same library, same speed",children:["When you use ",e.jsx("code",{children:"tokenizer.encode()"})," in Python, you are calling into the exact same Rust code shown on the right. The Python wrapper adds negligible overhead. Learning the Rust API gives you direct access when you need to embed tokenization in a Rust service or process data without Python."]}),e.jsx("h2",{children:"Building a Custom Tokenizer"}),e.jsx(t,{language:"rust",title:"Training a BPE tokenizer from scratch",code:`use tokenizers::models::bpe::BPE;
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
}`}),e.jsx("h2",{children:"Performance: Batch Processing"}),e.jsx(t,{language:"rust",title:"High-throughput tokenization for data pipelines",code:`use tokenizers::Tokenizer;
use std::time::Instant;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let tokenizer = Tokenizer::from_pretrained(
        "bert-base-uncased", None
    )?;

    // Simulate a large dataset
    let texts: Vec<String> = (0..10_000)
        .map(|i| format!(
            "This is sample document number {} with some text content              that needs to be tokenized for the ML pipeline.", i
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
}`}),e.jsxs(n,{type:"tip",title:"Cargo.toml",children:["Add ",e.jsx("code",{children:'tokenizers = "0.21"'})," to your dependencies. The crate includes BPE, WordPiece, Unigram, and SentencePiece models. For downloading pre-trained tokenizers, it uses HTTP requests — ensure network access is available."]}),e.jsx(o,{title:"Token Statistics",difficulty:"intermediate",problem:`Using the tokenizers crate:

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

This is a common task when estimating API costs (token count = cost).`,solution:`use tokenizers::Tokenizer;

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
    println!("Most tokens: "{}" ({} tokens)", max_sentence, max_tokens);

    Ok(())
}`})]})}const c=Object.freeze(Object.defineProperty({__proto__:null,default:i},Symbol.toStringTag,{value:"Module"}));function a(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Building API Servers with axum"}),e.jsxs("p",{children:["FastAPI revolutionized Python API development with type hints and async support. Rust's ",e.jsx("code",{children:"axum"})," offers a similar developer experience — typed request/response handling, async by default, and middleware support — but with the performance of a compiled language. An axum server can handle 10-100x more requests per second than FastAPI on the same hardware."]}),e.jsx(s,{title:"axum vs FastAPI",children:e.jsx("p",{children:"Both frameworks share key ideas: route handlers receive typed parameters extracted from the request, return typed responses, and run on an async runtime. FastAPI uses Pydantic for validation; axum uses serde. FastAPI runs on uvicorn; axum runs on Tokio. The mental model transfers directly."})}),e.jsx("h2",{children:"Hello World: FastAPI vs axum"}),e.jsx(r,{title:"A minimal API server",description:"The structure is remarkably similar: define routes, add handlers, run the server.",pythonCode:`from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictRequest(BaseModel):
    text: str
    model: str = "default"

class PredictResponse(BaseModel):
    label: str
    confidence: float

@app.get("/")
async def root():
    return {"message": "ML API is running"}

@app.post("/predict")
async def predict(req: PredictRequest):
    # Simulate inference
    return PredictResponse(
        label="positive",
        confidence=0.95,
    )

@app.get("/health")
async def health():
    return {"status": "ok"}

# Run: uvicorn main:app --port 3000`,rustCode:`use axum::{Router, Json, routing::{get, post}};
use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
struct PredictRequest {
    text: String,
    #[serde(default = "default_model")]
    model: String,
}
fn default_model() -> String { "default".into() }

#[derive(Serialize)]
struct PredictResponse {
    label: String,
    confidence: f64,
}

async fn root() -> Json<serde_json::Value> {
    Json(serde_json::json!({"message": "ML API is running"}))
}

async fn predict(Json(req): Json<PredictRequest>)
    -> Json<PredictResponse>
{
    // Simulate inference
    Json(PredictResponse {
        label: "positive".into(),
        confidence: 0.95,
    })
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({"status": "ok"}))
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(root))
        .route("/predict", post(predict))
        .route("/health", get(health));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await.unwrap();
    axum::serve(listener, app).await.unwrap();
}`}),e.jsxs(n,{type:"pythonista",title:"Typed extraction instead of decorators",children:["FastAPI uses decorators and Pydantic models for request validation. axum uses Rust's type system: ",e.jsx("code",{children:"Json(req): Json<PredictRequest>"}),"tells axum to parse the request body as JSON into your struct. If parsing fails, axum returns a 400 error automatically — no validation code needed."]}),e.jsx("h2",{children:"Shared State (Model Loading)"}),e.jsx(t,{language:"rust",title:"Sharing a loaded model across request handlers",code:`use axum::{Router, Json, Extension, routing::post};
use serde::{Serialize, Deserialize};
use std::sync::Arc;

// Simulated ML model
struct Model {
    name: String,
    // In reality: candle model, ONNX session, etc.
}

impl Model {
    fn predict(&self, text: &str) -> (String, f64) {
        // Simulate inference
        let label = if text.len() > 10 { "positive" } else { "negative" };
        (label.to_string(), 0.85 + (text.len() as f64 * 0.01).min(0.14))
    }
}

#[derive(Deserialize)]
struct InferRequest { text: String }

#[derive(Serialize)]
struct InferResponse { label: String, score: f64 }

async fn infer(
    Extension(model): Extension<Arc<Model>>,
    Json(req): Json<InferRequest>,
) -> Json<InferResponse> {
    let (label, score) = model.predict(&req.text);
    Json(InferResponse { label, score })
}

#[tokio::main]
async fn main() {
    // Load model ONCE at startup
    println!("Loading model...");
    let model = Arc::new(Model {
        name: "sentiment-v1".into(),
    });
    println!("Model loaded!");

    let app = Router::new()
        .route("/infer", post(infer))
        .layer(Extension(model));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await.unwrap();
    println!("Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}`}),e.jsx("h2",{children:"Path Parameters and Query Strings"}),e.jsx(t,{language:"rust",title:"Extracting data from URLs",code:`use axum::{Router, Json, extract::{Path, Query}, routing::get};
use serde::{Deserialize, Serialize};

// Path parameter: /models/{model_id}
async fn get_model(
    Path(model_id): Path<String>,
) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "model_id": model_id,
        "status": "loaded",
    }))
}

// Query parameters: /search?q=rust&limit=10
#[derive(Deserialize)]
struct SearchParams {
    q: String,
    #[serde(default = "default_limit")]
    limit: usize,
}
fn default_limit() -> usize { 10 }

#[derive(Serialize)]
struct SearchResult {
    query: String,
    results: Vec<String>,
}

async fn search(
    Query(params): Query<SearchParams>,
) -> Json<SearchResult> {
    // Simulate search
    let results = (0..params.limit.min(5))
        .map(|i| format!("Result {} for '{}'", i, params.q))
        .collect();

    Json(SearchResult {
        query: params.q,
        results,
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/models/{model_id}", get(get_model))
        .route("/search", get(search));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await.unwrap();
    axum::serve(listener, app).await.unwrap();
}`}),e.jsxs(n,{type:"tip",title:"Cargo.toml for axum",children:["You need ",e.jsx("code",{children:"axum"}),", ",e.jsx("code",{children:"tokio"}),", and ",e.jsx("code",{children:"serde"}),". Add ",e.jsx("code",{children:"serde_json"})," for JSON helpers and ",e.jsx("code",{children:"tower-http"}),"for middleware like CORS and logging."]}),e.jsx(t,{language:"toml",title:"Cargo.toml",code:`[dependencies]
axum = "0.8"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tower-http = { version = "0.6", features = ["cors", "trace"] }`}),e.jsx(o,{title:"Build a Prediction API",difficulty:"intermediate",problem:`Build an axum API server with these endpoints:

1. GET /health — returns {"status": "ok"}
2. POST /predict — accepts {"features": [f64, f64, f64]} and returns {"prediction": f64}
   - Compute prediction as: features[0] * 0.5 + features[1] * 0.3 + features[2] * 0.2
3. GET /models/{name} — returns model info as JSON
4. POST /batch — accepts {"inputs": [[f64; 3]]} and returns predictions for all inputs

Test with: curl -X POST http://localhost:3000/predict -H "Content-Type: application/json" -d '{"features": [1.0, 2.0, 3.0]}'`,solution:`use axum::{Router, Json, extract::Path, routing::{get, post}};
use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
struct PredictInput { features: Vec<f64> }

#[derive(Serialize)]
struct PredictOutput { prediction: f64 }

#[derive(Deserialize)]
struct BatchInput { inputs: Vec<Vec<f64>> }

#[derive(Serialize)]
struct BatchOutput { predictions: Vec<f64> }

fn compute(features: &[f64]) -> f64 {
    let weights = [0.5, 0.3, 0.2];
    features.iter().zip(weights.iter())
        .map(|(f, w)| f * w)
        .sum()
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({"status": "ok"}))
}

async fn predict(Json(input): Json<PredictInput>) -> Json<PredictOutput> {
    Json(PredictOutput { prediction: compute(&input.features) })
}

async fn get_model(Path(name): Path<String>) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "name": name,
        "version": "1.0",
        "features": 3,
    }))
}

async fn batch(Json(input): Json<BatchInput>) -> Json<BatchOutput> {
    let predictions = input.inputs.iter()
        .map(|features| compute(features))
        .collect();
    Json(BatchOutput { predictions })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health))
        .route("/predict", post(predict))
        .route("/models/{name}", get(get_model))
        .route("/batch", post(batch));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await.unwrap();
    println!("Server on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();

    // Test: curl -X POST localhost:3000/predict \\
    //   -H "Content-Type: application/json" \\
    //   -d '{"features":[1.0,2.0,3.0]}'
    // Expected: {"prediction":1.7}
    // (1.0*0.5 + 2.0*0.3 + 3.0*0.2 = 0.5+0.6+0.6 = 1.7)
}`})]})}const u=Object.freeze(Object.defineProperty({__proto__:null,default:a},Symbol.toStringTag,{value:"Module"}));export{u as a,c as s};
