import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ApiServers() {
  return (
    <div className="prose-rust">
      <h1>Building API Servers with axum</h1>

      <p>
        FastAPI revolutionized Python API development with type hints and
        async support. Rust's <code>axum</code> offers a similar developer
        experience — typed request/response handling, async by default,
        and middleware support — but with the performance of a compiled
        language. An axum server can handle 10-100x more requests per second
        than FastAPI on the same hardware.
      </p>

      <ConceptBlock title="axum vs FastAPI">
        <p>
          Both frameworks share key ideas: route handlers receive typed
          parameters extracted from the request, return typed responses,
          and run on an async runtime. FastAPI uses Pydantic for validation;
          axum uses serde. FastAPI runs on uvicorn; axum runs on Tokio.
          The mental model transfers directly.
        </p>
      </ConceptBlock>

      <h2>Hello World: FastAPI vs axum</h2>

      <PythonRustCompare
        title="A minimal API server"
        description="The structure is remarkably similar: define routes, add handlers, run the server."
        pythonCode={`from fastapi import FastAPI
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

# Run: uvicorn main:app --port 3000`}
        rustCode={`use axum::{Router, Json, routing::{get, post}};
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
}`}
      />

      <NoteBlock type="pythonista" title="Typed extraction instead of decorators">
        FastAPI uses decorators and Pydantic models for request validation.
        axum uses Rust's type system: <code>Json(req): Json&lt;PredictRequest&gt;</code>
        tells axum to parse the request body as JSON into your struct. If
        parsing fails, axum returns a 400 error automatically — no validation
        code needed.
      </NoteBlock>

      <h2>Shared State (Model Loading)</h2>

      <CodeBlock
        language="rust"
        title="Sharing a loaded model across request handlers"
        code={`use axum::{Router, Json, Extension, routing::post};
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
}`}
      />

      <h2>Path Parameters and Query Strings</h2>

      <CodeBlock
        language="rust"
        title="Extracting data from URLs"
        code={`use axum::{Router, Json, extract::{Path, Query}, routing::get};
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
}`}
      />

      <NoteBlock type="tip" title="Cargo.toml for axum">
        You need <code>axum</code>, <code>tokio</code>, and <code>serde</code>.
        Add <code>serde_json</code> for JSON helpers and <code>tower-http</code>
        for middleware like CORS and logging.
      </NoteBlock>

      <CodeBlock
        language="toml"
        title="Cargo.toml"
        code={`[dependencies]
axum = "0.8"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tower-http = { version = "0.6", features = ["cors", "trace"] }`}
      />

      <ExerciseBlock
        title="Build a Prediction API"
        difficulty="intermediate"
        problem={`Build an axum API server with these endpoints:

1. GET /health — returns {"status": "ok"}
2. POST /predict — accepts {"features": [f64, f64, f64]} and returns {"prediction": f64}
   - Compute prediction as: features[0] * 0.5 + features[1] * 0.3 + features[2] * 0.2
3. GET /models/{name} — returns model info as JSON
4. POST /batch — accepts {"inputs": [[f64; 3]]} and returns predictions for all inputs

Test with: curl -X POST http://localhost:3000/predict -H "Content-Type: application/json" -d '{"features": [1.0, 2.0, 3.0]}'`}
        solution={`use axum::{Router, Json, extract::Path, routing::{get, post}};
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
}`}
      />
    </div>
  );
}
