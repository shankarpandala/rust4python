import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Functions() {
  return (
    <div className="prose-rust">
      <h1>Function Signatures &amp; Return Types</h1>

      <p>
        Functions in Rust look similar to Python but with one critical difference:
        every parameter and return type must be explicitly annotated. This might
        feel verbose at first, but it is actually a feature — the function signature
        becomes a contract that both the compiler and other developers can rely on.
        You never have to guess what a function accepts or returns.
      </p>

      <ConceptBlock title="Function Signatures Are Contracts">
        <p>
          In Python, a function signature tells you parameter names but not their types
          (unless you add optional annotations). In Rust, the function signature is a
          complete contract: it specifies exactly what types go in and what type comes
          out. The compiler enforces this contract at every call site. This means you
          can read a function signature and know exactly how to use it — no documentation
          or source reading required.
        </p>
      </ConceptBlock>

      <h2>Basic Function Syntax</h2>

      <PythonRustCompare
        title="Function declaration"
        description="Rust uses fn instead of def, requires type annotations, and uses -> for return types."
        pythonCode={`# Python: def, optional type hints
def greet(name: str) -> str:
    return f"Hello, {name}!"

# Without type hints (still valid)
def add(a, b):
    return a + b

# Multiple parameters
def describe(name, age, active=True):
    status = "active" if active else "inactive"
    return f"{name}, age {age}, {status}"

print(greet("Alice"))
print(add(2, 3))
print(describe("Bob", 30))`}
        rustCode={`// Rust: fn, required type annotations
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// Types are ALWAYS required
fn add(a: i32, b: i32) -> i32 {
    a + b
}

// Multiple parameters (no defaults)
fn describe(name: &str, age: u32, active: bool) -> String {
    let status = if active { "active" } else { "inactive" };
    format!("{}, age {}, {}", name, age, status)
}

fn main() {
    println!("{}", greet("Alice"));
    println!("{}", add(2, 3));
    println!("{}", describe("Bob", 30, true));
}`}
      />

      <NoteBlock type="pythonista" title="No default parameters in Rust">
        Rust does not have default parameter values like Python's <code>def f(x=10)</code>.
        Instead, you use the builder pattern or <code>Option&lt;T&gt;</code> parameters.
        This is intentional — default values can make function calls ambiguous, especially
        in a statically-typed language.
      </NoteBlock>

      <h2>Return Values: The Last Expression</h2>

      <p>
        Rust has a unique feature: the last expression in a function body (without a
        semicolon) is automatically the return value. You do not need the <code>return</code>
        keyword unless you want to return early.
      </p>

      <CodeBlock
        language="rust"
        title="Expression-based returns"
        code={`// The last expression is the return value
fn square(x: i32) -> i32 {
    x * x    // no semicolon = this is the return value
}

// WRONG: semicolon turns it into a statement
// fn square_wrong(x: i32) -> i32 {
//     x * x;   // semicolon makes this return () not i32
// }             // ERROR: expected i32, found ()

// Using 'return' for early returns
fn absolute_value(x: i32) -> i32 {
    if x < 0 {
        return -x;   // early return
    }
    x   // final expression (no return needed)
}

// Complex expressions as return values
fn classify(score: i32) -> &'static str {
    if score >= 90 { "excellent" }
    else if score >= 70 { "good" }
    else if score >= 50 { "average" }
    else { "needs improvement" }
}

fn main() {
    println!("{}", square(5));          // 25
    println!("{}", absolute_value(-7)); // 7
    println!("{}", classify(85));       // good
}`}
      />

      <NoteBlock type="warning" title="The semicolon trap">
        This is a common gotcha for beginners: adding a semicolon to the last line of
        a function turns it from an expression (returns a value) into a statement
        (returns <code>()</code>, Rust's unit type). If you see an error like
        &quot;expected i32, found ()&quot;, check whether you accidentally added a
        semicolon to your return expression.
      </NoteBlock>

      <h2>Functions That Return Nothing</h2>

      <PythonRustCompare
        title="Void/None returns"
        description="Python functions return None by default. Rust functions return () (unit) by default."
        pythonCode={`# Python: returns None implicitly
def log(message: str) -> None:
    print(f"LOG: {message}")

# Or without annotation (same behavior)
def log2(message):
    print(f"LOG: {message}")

result = log("hello")
print(result)  # None
print(type(result))  # <class 'NoneType'>`}
        rustCode={`// Rust: returns () implicitly
fn log(message: &str) {
    println!("LOG: {}", message);
}

// Explicit () return type (same thing)
fn log2(message: &str) -> () {
    println!("LOG: {}", message);
}

fn main() {
    log("hello");
    let result = log("test");
    println!("{:?}", result); // ()
    // () is the "unit" type — like None
    // but it's a type, not a value
}`}
      />

      <h2>Multiple Return Values</h2>

      <CodeBlock
        language="rust"
        title="Returning multiple values with tuples"
        code={`// Return a tuple (like Python's multiple return)
fn min_max(values: &[i32]) -> (i32, i32) {
    let mut min = values[0];
    let mut max = values[0];
    for &v in &values[1..] {
        if v < min { min = v; }
        if v > max { max = v; }
    }
    (min, max)  // return a tuple
}

// Return a named struct for clarity
struct Stats {
    mean: f64,
    count: usize,
    sum: f64,
}

fn compute_stats(values: &[f64]) -> Stats {
    let count = values.len();
    let sum: f64 = values.iter().sum();
    let mean = sum / count as f64;
    Stats { mean, count, sum }
}

fn main() {
    let data = vec![3, 1, 4, 1, 5, 9, 2, 6];
    let (min, max) = min_max(&data); // destructure the tuple
    println!("Min: {}, Max: {}", min, max);

    let float_data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
    let stats = compute_stats(&float_data);
    println!("Mean: {:.1}, Count: {}, Sum: {:.1}",
        stats.mean, stats.count, stats.sum);
}`}
      />

      <h2>Functions as Documentation</h2>

      <PythonRustCompare
        title="Self-documenting function signatures"
        description="Rust signatures convey more information than Python signatures, even with type hints."
        pythonCode={`# Python: type hints help but aren't enforced
def process_data(
    data: list[float],
    threshold: float = 0.5,
    normalize: bool = True
) -> tuple[list[float], int]:
    """Process data, returning (results, count).

    Might raise ValueError if data is empty.
    Might return None if... wait, the type
    hint says tuple, but does it really?
    """
    if not data:
        raise ValueError("Empty data")
    results = [x for x in data if x > threshold]
    if normalize:
        mx = max(results) if results else 1
        results = [x / mx for x in results]
    return results, len(results)`}
        rustCode={`/// Process data, returning (results, count).
///
/// Returns an error if the input slice
/// is empty.
fn process_data(
    data: &[f64],
    threshold: f64,
    normalize: bool,
) -> Result<(Vec<f64>, usize), String> {
    if data.is_empty() {
        return Err("Empty data".to_string());
    }
    let mut results: Vec<f64> = data.iter()
        .filter(|&&x| x > threshold)
        .cloned()
        .collect();
    if normalize {
        let mx = results.iter()
            .cloned()
            .fold(f64::MIN, f64::max);
        for x in results.iter_mut() {
            *x /= mx;
        }
    }
    let count = results.len();
    Ok((results, count))
}

fn main() {
    match process_data(&[1.0, 2.0, 3.0], 1.5, true) {
        Ok((results, count)) => {
            println!("{:?} ({})", results, count);
        }
        Err(e) => println!("Error: {}", e),
    }
}`}
      />

      <NoteBlock type="tip" title="Read the signature, know the contract">
        The Rust function signature tells you everything: it takes a borrowed slice
        of f64s (won't consume your data), a threshold, a flag, and returns either
        a success tuple or an error string. There is no possibility of it returning
        None, panicking unexpectedly, or modifying your input. The type system
        encodes what Python puts in docstrings and hopes developers read.
      </NoteBlock>

      <ExerciseBlock
        title="Function Writing Practice"
        difficulty="intermediate"
        problem={`Write the following Rust functions:

1. \`fn is_palindrome(s: &str) -> bool\` — returns true if a string reads the same forwards and backwards (ignore case). Example: "Racecar" → true.

2. \`fn fizzbuzz(n: u32) -> String\` — returns "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, or the number as a string otherwise.

3. \`fn statistics(data: &[f64]) -> (f64, f64, f64)\` — returns (min, max, mean) of a slice. Use the last-expression-as-return pattern (no return keyword).

4. \`fn safe_divide(a: f64, b: f64) -> Result<f64, String>\` — returns Ok(a/b) or Err if b is zero.

Test each function in main() with at least 2 inputs.`}
        solution={`\`\`\`rust
fn is_palindrome(s: &str) -> bool {
    let lower = s.to_lowercase();
    let chars: Vec<char> = lower.chars().collect();
    let len = chars.len();
    for i in 0..len / 2 {
        if chars[i] != chars[len - 1 - i] {
            return false;
        }
    }
    true
}

fn fizzbuzz(n: u32) -> String {
    match (n % 3, n % 5) {
        (0, 0) => String::from("FizzBuzz"),
        (0, _) => String::from("Fizz"),
        (_, 0) => String::from("Buzz"),
        _ => n.to_string(),
    }
}

fn statistics(data: &[f64]) -> (f64, f64, f64) {
    let min = data.iter().cloned().fold(f64::INFINITY, f64::min);
    let max = data.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    let mean = data.iter().sum::<f64>() / data.len() as f64;
    (min, max, mean)
}

fn safe_divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Division by zero"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    println!("{}", is_palindrome("Racecar")); // true
    println!("{}", is_palindrome("hello"));   // false

    for i in 1..=15 {
        println!("{}: {}", i, fizzbuzz(i));
    }

    let data = vec![2.0, 7.0, 1.0, 8.0, 3.0];
    let (min, max, mean) = statistics(&data);
    println!("min={}, max={}, mean={:.1}", min, max, mean);

    println!("{:?}", safe_divide(10.0, 3.0));  // Ok(3.333...)
    println!("{:?}", safe_divide(10.0, 0.0));  // Err("Division by zero")
}
\`\`\`

Key points: fizzbuzz uses match on a tuple for clean pattern matching. statistics returns all three values without the return keyword. safe_divide uses Result to make the error case explicit in the type system.`}
      />
    </div>
  );
}
