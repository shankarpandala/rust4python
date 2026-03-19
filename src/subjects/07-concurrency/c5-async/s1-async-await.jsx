import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function AsyncAwaitFundamentals() {
  return (
    <div className="prose-rust">
      <h1>async/await Fundamentals</h1>

      <p>
        If you have used Python's <code>asyncio</code>, Rust's async/await will
        feel familiar — but with some key differences. Both languages use the
        same keywords and the same core idea: write asynchronous code that looks
        like synchronous code. But Rust's async is zero-cost, has no built-in
        runtime, and produces state machines at compile time instead of
        coroutine objects at runtime.
      </p>

      <ConceptBlock title="Async in Rust vs Python">
        <p>
          Python's <code>asyncio</code> comes with a built-in event loop and
          runtime. Rust's <code>async</code> is a language feature with no
          built-in runtime — you choose one (Tokio, async-std, smol). This
          separation means Rust async can be used in embedded systems, WebAssembly,
          or custom environments.
        </p>
        <p>
          The biggest conceptual difference: Rust futures are <strong>lazy</strong>.
          Calling an async function returns a future that does nothing until you
          <code>.await</code> it. Python coroutines are also lazy, but the event
          loop drives them automatically once scheduled.
        </p>
      </ConceptBlock>

      <h2>Basic async/await Syntax</h2>

      <PythonRustCompare
        title="Defining and calling async functions"
        description="The syntax is nearly identical. The key difference is Rust needs an explicit runtime."
        pythonCode={`import asyncio

async def fetch_data(url: str) -> str:
    # Simulate network request
    await asyncio.sleep(1)
    return f"Data from {url}"

async def main():
    # Await a single future
    result = await fetch_data("https://api.example.com")
    print(result)

    # Run multiple futures concurrently
    results = await asyncio.gather(
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com"),
    )
    for r in results:
        print(r)

# Python provides the runtime
asyncio.run(main())`}
        rustCode={`use tokio::time::{sleep, Duration};

async fn fetch_data(url: &str) -> String {
    // Simulate network request
    sleep(Duration::from_secs(1)).await;
    format!("Data from {}", url)
}

#[tokio::main]  // provides the runtime
async fn main() {
    // Await a single future
    let result = fetch_data("https://api.example.com").await;
    println!("{}", result);

    // Run multiple futures concurrently
    let (r1, r2, r3) = tokio::join!(
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com"),
    );
    println!("{}", r1);
    println!("{}", r2);
    println!("{}", r3);
}`}
      />

      <NoteBlock type="pythonista" title="You must choose a runtime">
        Python ships <code>asyncio</code> in the standard library. Rust has no
        built-in async runtime. The most popular choice is <strong>Tokio</strong>,
        which provides the event loop, task spawning, timers, and I/O. Add it
        to <code>Cargo.toml</code> with{' '}
        <code>tokio = &#123; version = "1", features = ["full"] &#125;</code>.
      </NoteBlock>

      <h2>Spawning Tasks</h2>

      <PythonRustCompare
        title="Concurrent tasks"
        description="Both languages let you spawn tasks that run concurrently on the event loop."
        pythonCode={`import asyncio

async def process(id: int):
    print(f"Task {id} started")
    await asyncio.sleep(1)
    print(f"Task {id} done")
    return id * 10

async def main():
    # Create tasks that run concurrently
    tasks = [asyncio.create_task(process(i))
             for i in range(5)]

    # Wait for all to complete
    results = await asyncio.gather(*tasks)
    print(f"Results: {results}")

asyncio.run(main())`}
        rustCode={`use tokio::time::{sleep, Duration};

async fn process(id: u32) -> u32 {
    println!("Task {} started", id);
    sleep(Duration::from_secs(1)).await;
    println!("Task {} done", id);
    id * 10
}

#[tokio::main]
async fn main() {
    // Spawn tasks that run concurrently
    let mut handles = vec![];
    for i in 0..5 {
        handles.push(tokio::spawn(process(i)));
    }

    // Wait for all to complete
    let mut results = vec![];
    for handle in handles {
        results.push(handle.await.unwrap());
    }
    println!("Results: {:?}", results);
}`}
      />

      <h2>Error Handling in Async</h2>

      <CodeBlock
        language="rust"
        title="Async functions with Result"
        code={`use tokio::time::{sleep, Duration};
use std::fmt;

#[derive(Debug)]
enum ApiError {
    Timeout,
    NotFound(String),
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ApiError::Timeout => write!(f, "Request timed out"),
            ApiError::NotFound(url) => write!(f, "Not found: {}", url),
        }
    }
}

async fn fetch_with_retry(
    url: &str,
    retries: u32,
) -> Result<String, ApiError> {
    for attempt in 0..retries {
        match try_fetch(url).await {
            Ok(data) => return Ok(data),
            Err(e) => {
                println!("Attempt {} failed: {}", attempt + 1, e);
                sleep(Duration::from_millis(100)).await;
            }
        }
    }
    Err(ApiError::Timeout)
}

async fn try_fetch(url: &str) -> Result<String, ApiError> {
    sleep(Duration::from_millis(50)).await;
    if url.contains("missing") {
        Err(ApiError::NotFound(url.to_string()))
    } else {
        Ok(format!("Response from {}", url))
    }
}

#[tokio::main]
async fn main() {
    match fetch_with_retry("https://api.example.com", 3).await {
        Ok(data) => println!("Success: {}", data),
        Err(e) => println!("Failed: {}", e),
    }
}`}
      />

      <NoteBlock type="tip" title="Async is for I/O, not CPU">
        Just like in Python, async/await is designed for I/O-bound work:
        network requests, file reads, database queries. For CPU-bound work,
        use threads (or Rayon). Mixing them is common: use Tokio for I/O
        and <code>tokio::task::spawn_blocking</code> to offload CPU work to
        a thread pool.
      </NoteBlock>

      <h2>Setting Up Tokio</h2>

      <CodeBlock
        language="toml"
        title="Cargo.toml for async projects"
        code={`[dependencies]
tokio = { version = "1", features = ["full"] }
# "full" includes: rt-multi-thread, macros, time, io, net, sync, fs

# For HTTP requests:
reqwest = { version = "0.12", features = ["json"] }

# For async traits:
async-trait = "0.1"`}
      />

      <ExerciseBlock
        title="Async Temperature Fetcher"
        difficulty="intermediate"
        problem={`Write an async program that:

1. Defines an async function get_temperature(city: &str) -> f64 that simulates fetching a temperature (use sleep + return a made-up value based on the city name length)
2. Fetches temperatures for ["London", "Tokyo", "New York", "Sydney"] concurrently using tokio::join! or spawned tasks
3. Computes and prints the average temperature

Compare: how would you do this with asyncio.gather in Python?`}
        solution={`use tokio::time::{sleep, Duration};

async fn get_temperature(city: &str) -> f64 {
    // Simulate API call
    sleep(Duration::from_millis(500)).await;
    // Fake temperature based on city name length
    20.0 + city.len() as f64 * 1.5
}

#[tokio::main]
async fn main() {
    let cities = ["London", "Tokyo", "New York", "Sydney"];

    // Approach 1: tokio::join! (fixed number of futures)
    let (t1, t2, t3, t4) = tokio::join!(
        get_temperature(cities[0]),
        get_temperature(cities[1]),
        get_temperature(cities[2]),
        get_temperature(cities[3]),
    );

    let temps = [t1, t2, t3, t4];
    for (city, temp) in cities.iter().zip(&temps) {
        println!("{}: {:.1}°C", city, temp);
    }

    let avg: f64 = temps.iter().sum::<f64>() / temps.len() as f64;
    println!("Average: {:.1}°C", avg);

    // Approach 2: spawn tasks (dynamic number of futures)
    let mut handles = vec![];
    for city in &cities {
        let city = city.to_string();
        handles.push(tokio::spawn(async move {
            get_temperature(&city).await
        }));
    }

    let mut temps2 = vec![];
    for h in handles {
        temps2.push(h.await.unwrap());
    }

    // Both approaches run all fetches concurrently —
    // total time is ~500ms, not 4 × 500ms = 2000ms.
    // Python equivalent: asyncio.gather(*coros)
}`}
      />
    </div>
  );
}
