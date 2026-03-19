import{j as e}from"./vendor-Dh_dlHsl.js";import{C as o,P as s,a as r,N as t,E as n}from"./subject-01-getting-started-DoSDK0Fn.js";function i(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Result & Option in Depth"}),e.jsxs("p",{children:["You have already met ",e.jsx("code",{children:"Option<T>"})," and",e.jsx("code",{children:"Result<T, E>"}),". This section dives deeper into the combinator methods that make them powerful — letting you chain operations, transform values, and handle errors with the same elegance as Python's list comprehensions."]}),e.jsx(o,{title:"Combinators: The Functional Toolkit",children:e.jsxs("p",{children:["Both ",e.jsx("code",{children:"Option"})," and ",e.jsx("code",{children:"Result"})," provide a rich set of combinator methods — ",e.jsx("code",{children:"map"}),", ",e.jsx("code",{children:"and_then"}),",",e.jsx("code",{children:"or_else"}),", ",e.jsx("code",{children:"filter"}),", ",e.jsx("code",{children:"zip"}),", and more. These replace the imperative if/else chains you would write in Python with concise, composable pipelines."]})}),e.jsx("h2",{children:"Option Combinators"}),e.jsx(s,{title:"Transforming optional values",description:"Python uses if/else or ternary operators. Rust uses combinator chains.",pythonCode:`from typing import Optional

def get_username(id: int) -> Optional[str]:
    users = {1: "alice", 2: "bob"}
    return users.get(id)

def format_greeting(id: int) -> str:
    name = get_username(id)
    if name is not None:
        upper = name.upper()
        greeting = f"Hello, {upper}!"
    else:
        greeting = "Hello, stranger!"
    return greeting

print(format_greeting(1))   # Hello, ALICE!
print(format_greeting(99))  # Hello, stranger!`,rustCode:`use std::collections::HashMap;

fn get_username(id: u32) -> Option<String> {
    let users = HashMap::from([(1, "alice"), (2, "bob")]);
    users.get(&id).map(|s| s.to_string())
}

fn format_greeting(id: u32) -> String {
    get_username(id)
        .map(|name| name.to_uppercase())
        .map(|upper| format!("Hello, {}!", upper))
        .unwrap_or_else(|| "Hello, stranger!".to_string())
}

fn main() {
    println!("{}", format_greeting(1));   // Hello, ALICE!
    println!("{}", format_greeting(99));  // Hello, stranger!
}`}),e.jsx(r,{language:"rust",title:"Option combinator reference",code:`fn main() {
    let some_val: Option<i32> = Some(10);
    let none_val: Option<i32> = None;

    // map: transform inner value
    assert_eq!(some_val.map(|x| x * 2), Some(20));
    assert_eq!(none_val.map(|x| x * 2), None);

    // and_then (flatmap): chain fallible operations
    assert_eq!(some_val.and_then(|x| if x > 5 { Some(x) } else { None }), Some(10));
    assert_eq!(some_val.and_then(|x| if x > 50 { Some(x) } else { None }), None);

    // filter: keep value only if predicate matches
    assert_eq!(some_val.filter(|&x| x > 5), Some(10));
    assert_eq!(some_val.filter(|&x| x > 50), None);

    // or / or_else: fallback to another Option
    assert_eq!(none_val.or(Some(42)), Some(42));
    assert_eq!(some_val.or(Some(42)), Some(10));

    // zip: combine two Options into a tuple
    let a = Some("hello");
    let b = Some(42);
    assert_eq!(a.zip(b), Some(("hello", 42)));

    // flatten: Option<Option<T>> -> Option<T>
    let nested: Option<Option<i32>> = Some(Some(42));
    assert_eq!(nested.flatten(), Some(42));
}`}),e.jsx("h2",{children:"Result Combinators"}),e.jsx(r,{language:"rust",title:"Result combinator reference",code:`fn parse_positive(s: &str) -> Result<u32, String> {
    let n: i32 = s.parse()
        .map_err(|e| format!("Parse error: {}", e))?;

    if n > 0 {
        Ok(n as u32)
    } else {
        Err(format!("Expected positive, got {}", n))
    }
}

fn main() {
    let ok: Result<i32, String> = Ok(10);
    let err: Result<i32, String> = Err("bad".into());

    // map / map_err: transform success or error value
    assert_eq!(ok.map(|x| x * 2), Ok(20));
    assert_eq!(err.map_err(|e| format!("Error: {}", e)),
               Err("Error: bad".to_string()));

    // and_then: chain operations that can fail
    let result = Ok("42".to_string())
        .and_then(|s| s.parse::<i32>().map_err(|e| e.to_string()))
        .and_then(|n| if n > 0 { Ok(n) } else { Err("negative".into()) });
    assert_eq!(result, Ok(42));

    // or_else: try a fallback on error
    let recovered = err.or_else(|_| Ok(0));
    assert_eq!(recovered, Ok(0));

    // unwrap_or / unwrap_or_else / unwrap_or_default
    assert_eq!(ok.unwrap_or(0), 10);
    assert_eq!(err.unwrap_or(0), 0);

    // Converting: ok() and err()
    let opt: Option<i32> = ok.ok();       // Some(10)
    let opt_err: Option<String> = err.err(); // Some("bad")
}`}),e.jsx(t,{title:"Think in pipelines",type:"pythonista",children:e.jsxs("p",{children:["If you are comfortable with Polars or pandas method chaining (",e.jsx("code",{children:"df.filter(...).select(...).head()"}),"), you already think in pipelines. Option and Result combinators are the same idea: transform, filter, and recover in a chain without nested if/else blocks."]})}),e.jsx("h2",{children:"Real-World Pipeline: Parsing Config"}),e.jsx(r,{language:"rust",title:"Chaining Option and Result in practice",code:`use std::collections::HashMap;

fn load_config() -> HashMap<String, String> {
    HashMap::from([
        ("port".into(), "8080".into()),
        ("host".into(), "localhost".into()),
        ("workers".into(), "not_a_number".into()),
    ])
}

fn get_port(config: &HashMap<String, String>) -> Result<u16, String> {
    config
        .get("port")                              // Option<&String>
        .ok_or("Missing 'port' key".to_string())   // Result<&String, String>
        .and_then(|s| {
            s.parse::<u16>()
                .map_err(|e| format!("Invalid port: {}", e))
        })
}

fn get_workers(config: &HashMap<String, String>) -> u32 {
    config
        .get("workers")
        .and_then(|s| s.parse::<u32>().ok())  // silently returns None on parse failure
        .unwrap_or(4)                          // default to 4 workers
}

fn main() {
    let config = load_config();

    match get_port(&config) {
        Ok(port) => println!("Port: {}", port),
        Err(e) => println!("Error: {}", e),
    }

    println!("Workers: {}", get_workers(&config));  // 4 (parse failed, used default)
}`}),e.jsx(t,{title:"ok_or: the bridge between Option and Result",type:"tip",children:e.jsxs("p",{children:[e.jsx("code",{children:".ok_or(err)"})," converts ",e.jsx("code",{children:"Option<T>"})," to",e.jsx("code",{children:"Result<T, E>"}),". Use it when a missing value is an error. Use ",e.jsx("code",{children:".ok_or_else(|| ...)"})," for lazy error construction. Going the other way, ",e.jsx("code",{children:".ok()"})," converts",e.jsx("code",{children:"Result"})," to ",e.jsx("code",{children:"Option"})," by discarding the error."]})}),e.jsx(n,{title:"Data pipeline with combinators",difficulty:"medium",problem:`Write a function process_scores(data: &str) -> Result<f64, String> that:
1. Splits the input by commas
2. Parses each value as f64 (return error if any parse fails)
3. Filters out scores below 0.0 or above 100.0
4. Returns the average of the valid scores
5. Returns an error if no valid scores remain

Use iterator combinators and Result methods — no if/else or match.
Test with: "85.5,92.0,abc,101,-5,78.3"`,solution:`fn process_scores(data: &str) -> Result<f64, String> {
    let scores: Result<Vec<f64>, String> = data
        .split(',')
        .map(|s| {
            s.trim()
                .parse::<f64>()
                .map_err(|e| format!("Cannot parse '{}': {}", s, e))
        })
        .collect();

    let valid: Vec<f64> = scores?
        .into_iter()
        .filter(|&s| (0.0..=100.0).contains(&s))
        .collect();

    let count = valid.len();
    let sum: f64 = valid.into_iter().sum();

    (count > 0)
        .then(|| sum / count as f64)
        .ok_or("No valid scores".to_string())
}

fn main() {
    // With a parse error:
    println!("{:?}", process_scores("85.5,92.0,abc,78.3"));
    // Err("Cannot parse 'abc': ...")

    // All valid:
    println!("{:?}", process_scores("85.5,92.0,78.3"));
    // Ok(85.266...)

    // With out-of-range values:
    println!("{:?}", process_scores("85.5,101,-5,78.3"));
    // Ok(81.9)
}`})]})}const f=Object.freeze(Object.defineProperty({__proto__:null,default:i},Symbol.toStringTag,{value:"Module"}));function a(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"The ? Operator"}),e.jsxs("p",{children:[`Python's error handling model is "ask forgiveness, not permission" — wrap code in `,e.jsx("code",{children:"try/except"})," and catch errors after the fact. Rust's ",e.jsx("code",{children:"?"})," operator provides a concise way to propagate errors upward, combining the best of explicit error handling with minimal boilerplate."]}),e.jsxs(o,{title:"What ? Does",children:[e.jsxs("p",{children:["The ",e.jsx("code",{children:"?"})," operator, placed after a ",e.jsx("code",{children:"Result"})," or",e.jsx("code",{children:"Option"})," expression, does two things:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["If the value is ",e.jsx("code",{children:"Ok(v)"})," or ",e.jsx("code",{children:"Some(v)"}),", it unwraps to ",e.jsx("code",{children:"v"})," and execution continues."]}),e.jsxs("li",{children:["If the value is ",e.jsx("code",{children:"Err(e)"})," or ",e.jsx("code",{children:"None"}),", it returns early from the current function, converting the error type via ",e.jsx("code",{children:"From"})," if needed."]})]})]}),e.jsx("h2",{children:"Python try/except vs Rust ?"}),e.jsx(s,{title:"Reading and parsing a file",description:"Python uses try/except. Rust uses ? to propagate errors explicitly but concisely.",pythonCode:`def read_config(path: str) -> dict:
    """Read a key=value config file."""
    try:
        with open(path) as f:
            text = f.read()
    except FileNotFoundError:
        raise ValueError(f"Config not found: {path}")
    except PermissionError:
        raise ValueError(f"Cannot read: {path}")

    config = {}
    for line in text.strip().split("\\n"):
        try:
            key, value = line.split("=", 1)
            config[key.strip()] = value.strip()
        except ValueError:
            raise ValueError(f"Bad line: {line}")

    return config

# Caller must also use try/except
try:
    cfg = read_config("app.conf")
    print(cfg)
except ValueError as e:
    print(f"Error: {e}")`,rustCode:`use std::collections::HashMap;
use std::fs;

#[derive(Debug)]
enum ConfigError {
    IoError(std::io::Error),
    ParseError(String),
}

impl From<std::io::Error> for ConfigError {
    fn from(e: std::io::Error) -> Self {
        ConfigError::IoError(e)
    }
}

fn read_config(path: &str) -> Result<HashMap<String, String>, ConfigError> {
    let text = fs::read_to_string(path)?;  // io::Error -> ConfigError

    let mut config = HashMap::new();
    for line in text.lines() {
        let (key, value) = line.split_once('=')
            .ok_or(ConfigError::ParseError(
                format!("Bad line: {}", line)
            ))?;  // None -> ConfigError
        config.insert(key.trim().into(), value.trim().into());
    }

    Ok(config)
}

fn main() {
    match read_config("app.conf") {
        Ok(cfg) => println!("{:?}", cfg),
        Err(e) => println!("Error: {:?}", e),
    }
}`}),e.jsx(t,{title:"? is not a silencer",type:"pythonista",children:e.jsxs("p",{children:["A common Python anti-pattern is a bare ",e.jsx("code",{children:"except:"})," that swallows all errors. Rust's ",e.jsx("code",{children:"?"})," does the opposite — it makes errors ",e.jsx("em",{children:"visible"})," in the return type and propagates them explicitly. You can see every ",e.jsx("code",{children:"?"}),' in the code and know: "this line can fail, and the error goes to the caller."']})}),e.jsx("h2",{children:"How ? Converts Error Types"}),e.jsx(r,{language:"rust",title:"Automatic error conversion with From",code:`use std::num::ParseIntError;
use std::io;

// An error enum that can hold different error types
#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(ParseIntError),
    Custom(String),
}

// Implement From for each error type you want to convert
impl From<io::Error> for AppError {
    fn from(e: io::Error) -> Self { AppError::Io(e) }
}

impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self { AppError::Parse(e) }
}

fn read_number_from_file(path: &str) -> Result<i64, AppError> {
    // ? on io::Error — automatically converted to AppError via From
    let contents = std::fs::read_to_string(path)?;

    // ? on ParseIntError — also automatically converted
    let number = contents.trim().parse::<i64>()?;

    if number < 0 {
        // Manual error — no conversion needed
        return Err(AppError::Custom("Negative numbers not allowed".into()));
    }

    Ok(number)
}

// Without ?, you'd need this verbose version:
fn read_number_verbose(path: &str) -> Result<i64, AppError> {
    let contents = match std::fs::read_to_string(path) {
        Ok(s) => s,
        Err(e) => return Err(AppError::Io(e)),
    };
    let number = match contents.trim().parse::<i64>() {
        Ok(n) => n,
        Err(e) => return Err(AppError::Parse(e)),
    };
    Ok(number)
}`}),e.jsx("h2",{children:"Using ? with Option"}),e.jsx(r,{language:"rust",title:"? works with Option too",code:`fn get_middle_name(full_name: &str) -> Option<&str> {
    let mut parts = full_name.split_whitespace();

    let _first = parts.next()?;    // None → return None
    let middle = parts.next()?;    // None → return None
    let _last = parts.next()?;     // None → return None

    Some(middle)
}

fn main() {
    println!("{:?}", get_middle_name("John Michael Smith"));  // Some("Michael")
    println!("{:?}", get_middle_name("Madonna"));              // None
    println!("{:?}", get_middle_name("Cher Bono"));            // None
}`}),e.jsx(t,{title:"? in main()",type:"tip",children:e.jsxs("p",{children:["You can use ",e.jsx("code",{children:"?"})," in ",e.jsx("code",{children:"main()"})," by changing its return type to ",e.jsx("code",{children:"Result<(), Box<dyn std::error::Error>>"}),". If ",e.jsx("code",{children:"main"})," returns an ",e.jsx("code",{children:"Err"}),", Rust prints the error and exits with a non-zero status code. This is great for CLI tools and scripts."]})}),e.jsx("h2",{children:"Practical Pattern: ? in main"}),e.jsx(r,{language:"rust",title:"Using ? throughout a program",code:`use std::fs;
use std::collections::HashMap;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Every ? propagates to main's return type
    let text = fs::read_to_string("data.csv")?;

    let mut totals: HashMap<String, f64> = HashMap::new();

    for (i, line) in text.lines().enumerate().skip(1) {
        let fields: Vec<&str> = line.split(',').collect();

        let category = fields.first()
            .ok_or(format!("Line {}: missing category", i + 1))?;

        let amount: f64 = fields.get(1)
            .ok_or(format!("Line {}: missing amount", i + 1))?
            .parse()?;   // ParseFloatError → Box<dyn Error>

        *totals.entry(category.to_string()).or_insert(0.0) += amount;
    }

    for (cat, total) in &totals {
        println!("{}: {:.2}", cat, total);
    }

    Ok(())
}
// If any ? triggers, program prints the error and exits with code 1`}),e.jsx(n,{title:"Multi-step data parser with ?",difficulty:"medium",problem:`Write a function parse_coordinates(input: &str) -> Result<Vec<(f64, f64)>, String>
that takes a string like "1.0,2.0;3.0,4.0;5.0,6.0" and returns a vector of
(x, y) tuples.

Requirements:
- Split by semicolons to get points
- Split each point by comma to get x and y
- Parse each coordinate as f64
- Return descriptive errors using ? and map_err
- Handle: wrong number of values per point, unparseable numbers

Test with valid input and several types of invalid input.`,solution:`fn parse_coordinates(input: &str) -> Result<Vec<(f64, f64)>, String> {
    input
        .split(';')
        .enumerate()
        .map(|(i, point_str)| {
            let parts: Vec<&str> = point_str.split(',').collect();

            if parts.len() != 2 {
                return Err(format!(
                    "Point {}: expected 2 values, got {}", i + 1, parts.len()
                ));
            }

            let x: f64 = parts[0].trim().parse()
                .map_err(|e| format!("Point {} x: {}", i + 1, e))?;

            let y: f64 = parts[1].trim().parse()
                .map_err(|e| format!("Point {} y: {}", i + 1, e))?;

            Ok((x, y))
        })
        .collect()  // collects Result<Vec<_>, String>
}

fn main() {
    // Valid
    println!("{:?}", parse_coordinates("1.0,2.0;3.0,4.0"));
    // Ok([(1.0, 2.0), (3.0, 4.0)])

    // Bad number
    println!("{:?}", parse_coordinates("1.0,abc;3.0,4.0"));
    // Err("Point 1 y: invalid float literal")

    // Wrong number of values
    println!("{:?}", parse_coordinates("1.0,2.0,3.0"));
    // Err("Point 1: expected 2 values, got 3")
}`})]})}const m=Object.freeze(Object.defineProperty({__proto__:null,default:a},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Custom Error Types"}),e.jsxs("p",{children:["In Python, you create custom exceptions by subclassing",e.jsx("code",{children:"Exception"}),". In Rust, you define error types as enums or structs and implement the ",e.jsx("code",{children:"std::error::Error"})," trait. This gives you precise, type-safe error hierarchies that the compiler checks exhaustively."]}),e.jsx(o,{title:"The Error Trait",children:e.jsxs("p",{children:["Rust's ",e.jsx("code",{children:"std::error::Error"})," trait requires implementing",e.jsx("code",{children:"Display"})," (for user-facing messages) and",e.jsx("code",{children:"Debug"})," (for developer diagnostics). It also provides an optional ",e.jsx("code",{children:"source()"})," method for error chaining — the equivalent of Python's ",e.jsx("code",{children:"__cause__"})," from",e.jsx("code",{children:"raise ... from ..."}),"."]})}),e.jsx("h2",{children:"Python Custom Exceptions vs Rust Error Enums"}),e.jsx(s,{title:"Custom error types",description:"Python subclasses Exception. Rust uses enums with the Error trait.",pythonCode:`class AppError(Exception):
    """Base error for our application."""
    pass

class NotFoundError(AppError):
    def __init__(self, resource: str, id: int):
        self.resource = resource
        self.id = id
        super().__init__(
            f"{resource} with id {id} not found"
        )

class ValidationError(AppError):
    def __init__(self, field: str, message: str):
        self.field = field
        super().__init__(
            f"Validation error on '{field}': {message}"
        )

def get_user(id: int) -> dict:
    if id != 1:
        raise NotFoundError("User", id)
    return {"id": 1, "name": "Alice", "age": -5}

def validate_user(user: dict):
    if user["age"] < 0:
        raise ValidationError("age", "must be non-negative")`,rustCode:`use std::fmt;

#[derive(Debug)]
enum AppError {
    NotFound { resource: String, id: u64 },
    Validation { field: String, message: String },
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::NotFound { resource, id } => {
                write!(f, "{} with id {} not found", resource, id)
            }
            AppError::Validation { field, message } => {
                write!(f, "Validation error on '{}': {}", field, message)
            }
        }
    }
}

impl std::error::Error for AppError {}

fn get_user(id: u64) -> Result<(String, i32), AppError> {
    if id != 1 {
        return Err(AppError::NotFound {
            resource: "User".into(), id
        });
    }
    Ok(("Alice".into(), -5))
}

fn validate_age(age: i32) -> Result<(), AppError> {
    if age < 0 {
        return Err(AppError::Validation {
            field: "age".into(),
            message: "must be non-negative".into(),
        });
    }
    Ok(())
}`}),e.jsx(t,{title:"Enums vs class hierarchies",type:"pythonista",children:e.jsxs("p",{children:["Python's exception hierarchy uses inheritance: ",e.jsx("code",{children:"NotFoundError"}),"extends ",e.jsx("code",{children:"AppError"})," extends ",e.jsx("code",{children:"Exception"}),". Rust uses a flat enum where each variant is a case. This means",e.jsx("code",{children:"match"}),' on an error is exhaustive — the compiler guarantees you handle every variant. No more "I forgot to catch that exception type" bugs.']})}),e.jsx("h2",{children:"Error Chaining with source()"}),e.jsx(r,{language:"rust",title:"Wrapping lower-level errors",code:`use std::fmt;
use std::num::ParseIntError;

#[derive(Debug)]
enum DataError {
    Io(std::io::Error),
    Parse { line: usize, source: ParseIntError },
    Empty,
}

impl fmt::Display for DataError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DataError::Io(e) => write!(f, "I/O error: {}", e),
            DataError::Parse { line, source } => {
                write!(f, "Parse error on line {}: {}", line, source)
            }
            DataError::Empty => write!(f, "No data provided"),
        }
    }
}

impl std::error::Error for DataError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            DataError::Io(e) => Some(e),
            DataError::Parse { source, .. } => Some(source),
            DataError::Empty => None,
        }
    }
}

// From implementations for ? operator
impl From<std::io::Error> for DataError {
    fn from(e: std::io::Error) -> Self { DataError::Io(e) }
}

fn parse_data(input: &str) -> Result<Vec<i32>, DataError> {
    if input.is_empty() {
        return Err(DataError::Empty);
    }

    input.lines()
        .enumerate()
        .map(|(i, line)| {
            line.trim().parse::<i32>()
                .map_err(|e| DataError::Parse { line: i + 1, source: e })
        })
        .collect()
}

fn main() {
    match parse_data("42\\nabc\\n10") {
        Ok(nums) => println!("{:?}", nums),
        Err(e) => {
            println!("Error: {}", e);
            // Walk the error chain
            let mut source = e.source();
            while let Some(cause) = source {
                println!("  Caused by: {}", cause);
                source = cause.source();
            }
        }
    }
}`}),e.jsx("h2",{children:"The Full Pattern: A Complete Error Type"}),e.jsx(r,{language:"rust",title:"Production-ready error type",code:`use std::fmt;

/// All errors that can occur in our CSV processing library.
#[derive(Debug)]
pub enum CsvError {
    /// File I/O failed
    Io(std::io::Error),
    /// A field could not be parsed as the expected type
    FieldParse {
        row: usize,
        column: usize,
        expected: &'static str,
        value: String,
    },
    /// The header row is missing or malformed
    BadHeader(String),
    /// The file has no data rows
    EmptyFile,
}

impl fmt::Display for CsvError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CsvError::Io(e) => write!(f, "I/O error: {}", e),
            CsvError::FieldParse { row, column, expected, value } => {
                write!(
                    f,
                    "Row {}, column {}: expected {}, got '{}'",
                    row, column, expected, value
                )
            }
            CsvError::BadHeader(msg) => write!(f, "Bad header: {}", msg),
            CsvError::EmptyFile => write!(f, "File contains no data"),
        }
    }
}

impl std::error::Error for CsvError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            CsvError::Io(e) => Some(e),
            _ => None,
        }
    }
}

impl From<std::io::Error> for CsvError {
    fn from(e: std::io::Error) -> Self { CsvError::Io(e) }
}

// Usage with ? is now clean:
fn read_csv_ages(path: &str) -> Result<Vec<u32>, CsvError> {
    let text = std::fs::read_to_string(path)?;  // ? converts io::Error

    let mut lines = text.lines();
    let _header = lines.next().ok_or(CsvError::EmptyFile)?;

    lines.enumerate()
        .map(|(i, line)| {
            let age_str = line.split(',').nth(1)
                .ok_or(CsvError::FieldParse {
                    row: i + 2, column: 2,
                    expected: "age field", value: line.into(),
                })?;

            age_str.trim().parse::<u32>()
                .map_err(|_| CsvError::FieldParse {
                    row: i + 2, column: 2,
                    expected: "u32", value: age_str.into(),
                })
        })
        .collect()
}`}),e.jsx(t,{title:"Boilerplate warning",type:"warning",children:e.jsxs("p",{children:["Writing ",e.jsx("code",{children:"Display"}),", ",e.jsx("code",{children:"Error"}),", and",e.jsx("code",{children:"From"})," implementations by hand is verbose. This is why the ",e.jsx("code",{children:"thiserror"})," crate exists — it generates all this boilerplate with a derive macro. See the next section for how",e.jsx("code",{children:"thiserror"})," and ",e.jsx("code",{children:"anyhow"})," eliminate the tedium."]})}),e.jsx(n,{title:"Build a calculator error type",difficulty:"medium",problem:`Create a CalcError enum with variants:
1. DivisionByZero
2. InvalidOperator(char)
3. ParseError(String) — wraps parse failures

Implement Display, Debug, and Error for it.
Write a function eval(expr: &str) -> Result<f64, CalcError> that parses
simple expressions like "10 + 5", "8 / 0", "3 * 2".
Support +, -, *, / operators.`,solution:`use std::fmt;

#[derive(Debug)]
enum CalcError {
    DivisionByZero,
    InvalidOperator(char),
    ParseError(String),
}

impl fmt::Display for CalcError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CalcError::DivisionByZero => write!(f, "Division by zero"),
            CalcError::InvalidOperator(op) => {
                write!(f, "Invalid operator: '{}'", op)
            }
            CalcError::ParseError(msg) => {
                write!(f, "Parse error: {}", msg)
            }
        }
    }
}

impl std::error::Error for CalcError {}

fn eval(expr: &str) -> Result<f64, CalcError> {
    let parts: Vec<&str> = expr.split_whitespace().collect();
    if parts.len() != 3 {
        return Err(CalcError::ParseError(
            format!("Expected 'a op b', got '{}'", expr)
        ));
    }

    let a: f64 = parts[0].parse()
        .map_err(|e| CalcError::ParseError(format!("{}", e)))?;
    let b: f64 = parts[2].parse()
        .map_err(|e| CalcError::ParseError(format!("{}", e)))?;
    let op = parts[1].chars().next()
        .ok_or(CalcError::ParseError("Empty operator".into()))?;

    match op {
        '+' => Ok(a + b),
        '-' => Ok(a - b),
        '*' => Ok(a * b),
        '/' if b == 0.0 => Err(CalcError::DivisionByZero),
        '/' => Ok(a / b),
        _ => Err(CalcError::InvalidOperator(op)),
    }
}

fn main() {
    println!("{:?}", eval("10 + 5"));   // Ok(15.0)
    println!("{:?}", eval("8 / 0"));    // Err(DivisionByZero)
    println!("{:?}", eval("3 % 2"));    // Err(InvalidOperator('%'))
}`})]})}const g=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));function c(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"anyhow & thiserror"}),e.jsxs("p",{children:["Writing ",e.jsx("code",{children:"Display"}),", ",e.jsx("code",{children:"Error"}),", and ",e.jsx("code",{children:"From"}),"implementations by hand is tedious. The Rust ecosystem has two crates that eliminate this boilerplate:",e.jsx("code",{children:"thiserror"})," for libraries (structured errors) and",e.jsx("code",{children:"anyhow"})," for applications (quick and flexible)."]}),e.jsxs(o,{title:"Two Crates, Two Use Cases",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"thiserror"}),": Derive macro that auto-generates",e.jsx("code",{children:"Display"}),", ",e.jsx("code",{children:"Error"}),", and ",e.jsx("code",{children:"From"}),"implementations for your error enums. Use in libraries where callers need to match on specific error variants."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"anyhow"}),": Provides ",e.jsx("code",{children:"anyhow::Result"})," and",e.jsx("code",{children:"anyhow::Error"})," — a type-erased error that can hold any error type. Use in applications where you just want to propagate and display errors without defining custom types."]})]}),e.jsx("h2",{children:"thiserror: Clean Error Definitions"}),e.jsx(s,{title:"Defining errors with minimal boilerplate",description:"Python exceptions need __init__ and __str__. thiserror generates everything from attributes.",pythonCode:`class DataError(Exception):
    pass

class IoError(DataError):
    def __init__(self, source):
        self.source = source
        super().__init__(f"I/O error: {source}")

class ParseError(DataError):
    def __init__(self, line, message):
        self.line = line
        super().__init__(
            f"Parse error on line {line}: {message}"
        )

class EmptyDataError(DataError):
    def __init__(self):
        super().__init__("No data provided")

# Python: 15+ lines of boilerplate for 3 error types`,rustCode:`use thiserror::Error;

#[derive(Debug, Error)]
enum DataError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Parse error on line {line}: {message}")]
    Parse { line: usize, message: String },

    #[error("No data provided")]
    Empty,
}

// That's it! thiserror generates:
// - Display (from #[error("...")])
// - Error trait (with source() from #[from])
// - From<std::io::Error> (from #[from])

fn load_data(path: &str) -> Result<Vec<i32>, DataError> {
    let text = std::fs::read_to_string(path)?;  // ? works!

    if text.is_empty() {
        return Err(DataError::Empty);
    }

    text.lines()
        .enumerate()
        .map(|(i, line)| {
            line.trim().parse::<i32>().map_err(|e| DataError::Parse {
                line: i + 1,
                message: e.to_string(),
            })
        })
        .collect()
}`}),e.jsx(t,{title:"thiserror attributes",type:"note",children:e.jsxs("p",{children:[e.jsx("code",{children:'#[error("...")]'})," generates the ",e.jsx("code",{children:"Display"}),"implementation. Use ",e.jsx("code",{children:"{0}"})," for tuple fields,",e.jsx("code",{children:"{field_name}"})," for named fields.",e.jsx("code",{children:"#[from]"})," generates both ",e.jsx("code",{children:"From"})," conversion and ",e.jsx("code",{children:"source()"})," method. ",e.jsx("code",{children:"#[source]"})," marks a field as the error source without generating ",e.jsx("code",{children:"From"}),"."]})}),e.jsx("h2",{children:"anyhow: For Applications"}),e.jsx(s,{title:"Quick error handling in applications",description:"anyhow is like Python's general Exception — catch anything, add context.",pythonCode:`import json

def run_pipeline(config_path: str) -> dict:
    """Application code — we just want errors to bubble up
    with good messages, not define custom types."""
    try:
        with open(config_path) as f:
            config = json.load(f)
    except FileNotFoundError:
        raise RuntimeError(
            f"Config file not found: {config_path}"
        )
    except json.JSONDecodeError as e:
        raise RuntimeError(
            f"Invalid JSON in {config_path}"
        ) from e

    port = config.get("port")
    if port is None:
        raise RuntimeError("Missing 'port' in config")

    return {"port": int(port)}`,rustCode:`use anyhow::{Context, Result, bail};

fn run_pipeline(config_path: &str) -> Result<u16> {
    // .context() adds a message to any error
    let text = std::fs::read_to_string(config_path)
        .context(format!(
            "Failed to read config: {}", config_path
        ))?;

    // anyhow works with any error type
    let config: serde_json::Value = serde_json::from_str(&text)
        .context("Invalid JSON in config")?;

    // bail! is a shorthand for return Err(anyhow!("..."))
    let port = config["port"].as_u64()
        .ok_or_else(|| anyhow::anyhow!("Missing 'port' in config"))?;

    if port > 65535 {
        bail!("Port {} out of range", port);
    }

    Ok(port as u16)
}

fn main() {
    match run_pipeline("config.json") {
        Ok(port) => println!("Starting on port {}", port),
        Err(e) => {
            // anyhow prints the full error chain
            eprintln!("Error: {:#}", e);
            // Error: Failed to read config: config.json
            //   Caused by: No such file or directory
        }
    }
}`}),e.jsx(t,{title:"anyhow vs thiserror",type:"tip",children:e.jsxs("p",{children:[e.jsx("strong",{children:"Rule of thumb"}),": Use ",e.jsx("code",{children:"thiserror"})," in library code where callers need to ",e.jsx("code",{children:"match"})," on error variants. Use ",e.jsx("code",{children:"anyhow"})," in application code (binaries, CLI tools, scripts) where you just want to propagate errors with context. Many projects use both: ",e.jsx("code",{children:"thiserror"})," in their library crate and ",e.jsx("code",{children:"anyhow"})," in their binary crate."]})}),e.jsx("h2",{children:"anyhow Key Features"}),e.jsx(r,{language:"rust",title:"anyhow's toolkit",code:`use anyhow::{anyhow, bail, ensure, Context, Result};

fn process(input: &str) -> Result<Vec<f64>> {
    // ensure! — like assert but returns Err instead of panicking
    ensure!(!input.is_empty(), "Input must not be empty");

    let values: Vec<f64> = input
        .split(',')
        .enumerate()
        .map(|(i, s)| {
            s.trim()
                .parse::<f64>()
                .context(format!("Field {} is not a valid number", i + 1))
        })
        .collect::<Result<Vec<_>>>()?;

    // bail! — return an error immediately
    if values.iter().any(|v| v.is_nan()) {
        bail!("NaN values are not allowed");
    }

    // anyhow! — create an error value
    let sum: f64 = values.iter().sum();
    if sum == 0.0 {
        return Err(anyhow!("Sum must not be zero"));
    }

    Ok(values)
}

fn main() -> Result<()> {
    let data = process("1.5, 2.5, 3.0")?;
    println!("Processed: {:?}", data);
    Ok(())

    // anyhow::Result in main() prints errors nicely on failure
}`}),e.jsx("h2",{children:"Adding to Your Project"}),e.jsx(r,{language:"bash",title:"Installing the crates",code:`# Add thiserror (for library error types)
cargo add thiserror

# Add anyhow (for application error handling)
cargo add anyhow

# Both are lightweight with no transitive dependencies`}),e.jsx(r,{language:"toml",title:"Cargo.toml",code:`[dependencies]
thiserror = "2"
anyhow = "1"`}),e.jsx(t,{title:"No performance cost",type:"note",children:e.jsxs("p",{children:["Both ",e.jsx("code",{children:"thiserror"})," and ",e.jsx("code",{children:"anyhow"})," are zero-cost in the success path. ",e.jsx("code",{children:"thiserror"})," generates the same code you would write by hand. ",e.jsx("code",{children:"anyhow"})," allocates on the error path (which is fine — errors are rare). Neither adds measurable overhead to hot loops."]})}),e.jsx(n,{title:"Refactor with thiserror",difficulty:"easy",problem:`Take this hand-written error type and rewrite it using thiserror's derive macro:

#[derive(Debug)]
enum ApiError {
    Network(reqwest::Error),
    Json(serde_json::Error),
    NotFound { url: String },
    RateLimit { retry_after: u64 },
}

You need to:
1. Add #[derive(Error)] and #[error("...")] attributes
2. Use #[from] for automatic From conversions
3. Write format strings that produce useful messages
4. Which variants should use #[from] and which shouldn't?`,solution:`use thiserror::Error;

#[derive(Debug, Error)]
enum ApiError {
    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("JSON parsing error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("Resource not found: {url}")]
    NotFound { url: String },

    #[error("Rate limited, retry after {retry_after} seconds")]
    RateLimit { retry_after: u64 },
}

// Network and Json use #[from] because they wrap external
// error types and enable ? conversion.
// NotFound and RateLimit don't use #[from] because they
// are application-specific errors constructed manually.

// Usage:
// fn fetch(url: &str) -> Result<Data, ApiError> {
//     let resp = reqwest::get(url)?;  // #[from] converts
//     if resp.status() == 404 {
//         return Err(ApiError::NotFound { url: url.into() });
//     }
//     let data = resp.json()?;        // #[from] converts
//     Ok(data)
// }`})]})}const y=Object.freeze(Object.defineProperty({__proto__:null,default:c},Symbol.toStringTag,{value:"Module"}));function d(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"When panic Is OK"}),e.jsxs("p",{children:['Rust newcomers often hear "never use ',e.jsx("code",{children:"unwrap()"}),'" and feel paralyzed. The truth is more nuanced: panicking is appropriate in specific situations. Understanding when to panic and when to return',e.jsx("code",{children:"Result"})," is a key Rust skill."]}),e.jsxs(o,{title:"Panic vs Result",children:[e.jsxs("p",{children:["A ",e.jsx("strong",{children:"panic"}),' crashes the current thread (and by default, the program). It means "something went so wrong that continuing is impossible or unsafe." A ',e.jsx("strong",{children:"Result"}),' means "this can fail in expected ways, and the caller should decide what to do."']}),e.jsxs("p",{children:["Rule of thumb: use ",e.jsx("code",{children:"Result"})," for expected failures (user input, file not found, network errors). Use panic for bugs and invariant violations (index out of bounds, impossible states)."]})]}),e.jsx("h2",{children:"Python's Approach vs Rust's Philosophy"}),e.jsx(s,{title:"When crashing is appropriate",description:"Python raises exceptions for everything. Rust distinguishes recoverable errors (Result) from bugs (panic).",pythonCode:`# Python: everything is an exception
def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Division by zero")  # recoverable
    return a / b

# Python: assertions for "should never happen"
def process(items: list) -> list:
    assert len(items) > 0, "Bug: empty list"  # programmer error
    # In production, assertions can be disabled with -O flag!
    return [x * 2 for x in items]

# Problem: both use the same mechanism (exceptions)
# Nothing in the type system distinguishes them`,rustCode:`// Rust: Result for recoverable errors
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".into())
    } else {
        Ok(a / b)
    }
}

// Rust: panic for "should never happen" (bugs)
fn process(items: &[i32]) -> Vec<i32> {
    assert!(!items.is_empty(), "Bug: empty list");
    // Unlike Python, assert! cannot be disabled
    items.iter().map(|x| x * 2).collect()
}

// The type system makes the distinction clear:
// - fn foo() -> Result<T, E>  means "this can fail"
// - fn foo() -> T             means "this always succeeds
//                               (or panics on a bug)"`}),e.jsx("h2",{children:"When Panic Is Appropriate"}),e.jsx(r,{language:"rust",title:"Legitimate uses of unwrap and panic",code:`fn main() {
    // 1. TESTS — unwrap is fine, panics produce test failures
    #[cfg(test)]
    fn test_parsing() {
        let n: i32 = "42".parse().unwrap();
        assert_eq!(n, 42);
    }

    // 2. KNOWN VALUES — the programmer can prove it won't fail
    let home = std::env::var("HOME")
        .expect("HOME environment variable must be set");
    // On Unix systems, HOME is always set

    // 3. AFTER VALIDATION — you've already checked the condition
    let numbers = vec![1, 2, 3, 4, 5];
    if !numbers.is_empty() {
        let first = numbers.first().unwrap();  // safe: we checked
        println!("First: {}", first);
    }

    // 4. PROTOTYPING — use unwrap to sketch out logic quickly
    let data = std::fs::read_to_string("config.toml").unwrap();
    // Replace with proper error handling before shipping

    // 5. EXAMPLES AND DOCUMENTATION — keeps examples focused
    let port: u16 = "8080".parse().unwrap();
    println!("Port: {}", port);
}`}),e.jsxs(t,{title:"expect() over unwrap()",type:"tip",children:[e.jsxs("p",{children:["Always prefer ",e.jsx("code",{children:'.expect("message")'})," over",e.jsx("code",{children:".unwrap()"}),". When a panic occurs, ",e.jsx("code",{children:"expect"}),"includes your message in the panic output, making debugging much easier. Compare:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"unwrap()"}),': "called Option::unwrap() on a None value"']}),e.jsxs("li",{children:[e.jsx("code",{children:'expect("user ID")'}),': "user ID: called Option::unwrap() on a None value"']})]})]}),e.jsx("h2",{children:"The Unwrap Family"}),e.jsx(r,{language:"rust",title:"Choosing the right unwrap variant",code:`fn main() {
    let value: Option<i32> = Some(42);
    let empty: Option<i32> = None;

    // unwrap() — panics on None/Err. Use in tests only.
    let _ = value.unwrap();          // 42

    // expect() — panics with a message. Better than unwrap.
    let _ = value.expect("value must exist");  // 42

    // unwrap_or() — provide a default. Never panics.
    let _ = empty.unwrap_or(0);      // 0

    // unwrap_or_else() — compute default lazily. Never panics.
    let _ = empty.unwrap_or_else(|| {
        eprintln!("Warning: using default");
        99
    });

    // unwrap_or_default() — uses Default trait. Never panics.
    let _ = empty.unwrap_or_default();  // 0 (i32::default())

    // For Result:
    let ok: Result<i32, String> = Ok(42);
    let err: Result<i32, String> = Err("oops".into());

    let _ = ok.unwrap_or(0);         // 42
    let _ = err.unwrap_or(0);        // 0

    // unwrap_err() — panics if Ok, returns the error.
    // Useful in tests to assert errors.
    let e = err.unwrap_err();        // "oops"
}`}),e.jsx("h2",{children:"Replacing unwrap with Better Alternatives"}),e.jsx(s,{title:"Progressive error handling",description:"Start with unwrap during prototyping, then replace with proper handling.",pythonCode:`# Python: start with no error handling
def process_v1(path):
    data = open(path).read()        # crashes on error
    return int(data)                 # crashes on error

# Then add try/except
def process_v2(path):
    try:
        data = open(path).read()
        return int(data)
    except (FileNotFoundError, ValueError) as e:
        return None

# Python makes it easy to skip error handling entirely`,rustCode:`// Rust v1: prototype with unwrap
fn process_v1(path: &str) -> i32 {
    let data = std::fs::read_to_string(path).unwrap();
    data.trim().parse().unwrap()
}

// Rust v2: replace with ? (compiler guided)
fn process_v2(path: &str) -> Result<i32, Box<dyn std::error::Error>> {
    let data = std::fs::read_to_string(path)?;
    let num = data.trim().parse()?;
    Ok(num)
}

// Rust v3: use anyhow for better messages
fn process_v3(path: &str) -> anyhow::Result<i32> {
    let data = std::fs::read_to_string(path)
        .with_context(|| format!("reading {}", path))?;
    let num = data.trim().parse()
        .context("parsing number")?;
    Ok(num)
}

// Rust makes it hard to FORGET error handling —
// the compiler warns about unused Results`}),e.jsx(t,{title:"#[must_use] — Rust won't let you ignore errors",type:"pythonista",children:e.jsxs("p",{children:["In Python, you can call a function and ignore its return value — including error information. Rust's ",e.jsx("code",{children:"Result"})," is marked",e.jsx("code",{children:"#[must_use]"}),", so the compiler warns if you discard a Result without handling it. This is like having a linter that catches every unhandled exception — built into the language."]})}),e.jsx(n,{title:"Unwrap audit",difficulty:"easy",problem:`Review this function and replace each unwrap() with the most appropriate
alternative. Explain your choice for each:

fn analyze(data: &str) -> f64 {
    let lines: Vec<&str> = data.lines().collect();
    let header = lines.first().unwrap();
    let values: Vec<f64> = lines[1..]
        .iter()
        .map(|line| line.parse::<f64>().unwrap())
        .collect();
    let count = values.len();
    let sum: f64 = values.iter().sum();
    sum / count as f64
}`,solution:`fn analyze(data: &str) -> Result<f64, String> {
    let lines: Vec<&str> = data.lines().collect();

    // .first() might be None → use ok_or for a descriptive error
    let _header = lines.first()
        .ok_or("No header line found")?;

    // Parse might fail → collect into Result, use map_err
    let values: Vec<f64> = lines[1..]
        .iter()
        .enumerate()
        .map(|(i, line)| {
            line.parse::<f64>()
                .map_err(|e| format!("Line {}: {}", i + 2, e))
        })
        .collect::<Result<Vec<_>, _>>()?;

    // Division by zero if no data rows
    if values.is_empty() {
        return Err("No data rows".to_string());
    }

    let sum: f64 = values.iter().sum();
    Ok(sum / values.len() as f64)
}

// Changes made:
// 1. unwrap() on first() → ok_or(): the slice might be empty
// 2. unwrap() on parse() → map_err() + ?: input might not be numeric
// 3. Added empty check: division by zero is a runtime error
// 4. Return type changed to Result: callers must handle errors`})]})}const x=Object.freeze(Object.defineProperty({__proto__:null,default:d},Symbol.toStringTag,{value:"Module"}));function u(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"What Unsafe Unlocks"}),e.jsxs("p",{children:["Rust's safety guarantees come from the borrow checker and type system. But some operations — like calling C code, implementing data structures with raw pointers, or doing hardware-level operations — cannot be verified by the compiler. The",e.jsx("code",{children:"unsafe"})," keyword lets you opt out of specific checks while keeping the rest of your code safe."]}),e.jsx(o,{title:"Unsafe Is Not 'Dangerous Code'",children:e.jsxs("p",{children:[e.jsx("code",{children:"unsafe"}),` does not mean "this code is wrong." It means "I, the programmer, am asserting safety invariants that the compiler cannot verify." It unlocks exactly five additional capabilities — nothing more. The rest of Rust's rules still apply inside an `,e.jsx("code",{children:"unsafe"})," block."]})}),e.jsx("h2",{children:"What Python Developers Should Know"}),e.jsx(s,{title:"Safety boundaries",description:"Python's C extensions are entirely unchecked. Rust's unsafe is a controlled, visible escape hatch.",pythonCode:`# Python: ALL C extensions are "unsafe"
# When you import numpy, you trust that its C code
# doesn't have memory bugs. No language-level safety.

import ctypes

# This is inherently unsafe — wrong pointer = crash
lib = ctypes.CDLL("libm.so.6")
lib.sqrt.restype = ctypes.c_double
result = lib.sqrt(ctypes.c_double(16.0))
print(result)  # 4.0

# Nothing stops you from passing garbage:
# lib.sqrt(ctypes.c_int(42))  # undefined behavior!

# Python's approach: trust the C programmer entirely
# No way to mark "this part needs extra scrutiny"`,rustCode:`// Rust: unsafe is explicit and minimal
fn main() {
    // Safe Rust — compiler guarantees memory safety
    let v = vec![1, 2, 3];
    let first = v.first(); // returns Option, can't crash

    // Unsafe Rust — programmer asserts safety
    unsafe {
        // Raw pointer dereference — compiler can't verify
        let ptr = v.as_ptr();
        let val = *ptr; // safe because we know v is not empty
        println!("Raw access: {}", val);
    }

    // Back to safe Rust — all guarantees restored
    println!("Vec: {:?}", v);
}

// The unsafe block is VISIBLE — code reviewers know
// to scrutinize these sections carefully.`}),e.jsx(t,{title:"The unsafe contract",type:"note",children:e.jsxs("p",{children:["When you write ",e.jsx("code",{children:"unsafe"}),`, you are telling the compiler: "I promise this code upholds Rust's safety invariants even though you cannot verify it." If you break that promise, you get undefined behavior — just like C. The key difference from C: only a tiny, auditable portion of your code can do this.`]})}),e.jsx("h2",{children:"The Five Unsafe Superpowers"}),e.jsx(r,{language:"rust",title:"Everything unsafe unlocks — and nothing more",code:`fn main() {
    // 1. DEREFERENCE RAW POINTERS
    let x = 42;
    let raw = &x as *const i32;
    unsafe {
        println!("Dereferenced: {}", *raw);
    }

    // 2. CALL UNSAFE FUNCTIONS
    unsafe {
        // Some functions require the caller to uphold invariants
        let v = vec![1, 2, 3, 4, 5];
        let val = v.get_unchecked(2);  // no bounds check
        println!("Unchecked: {}", val);
    }

    // 3. ACCESS MUTABLE STATIC VARIABLES
    static mut COUNTER: u32 = 0;
    unsafe {
        COUNTER += 1;  // data race risk — caller must ensure safety
        println!("Counter: {}", COUNTER);
    }

    // 4. IMPLEMENT UNSAFE TRAITS
    // unsafe trait UnsafeTrait { ... }
    // unsafe impl UnsafeTrait for MyType { ... }

    // 5. ACCESS FIELDS OF UNIONS
    union MyUnion {
        int_val: i32,
        float_val: f32,
    }
    let u = MyUnion { int_val: 42 };
    unsafe {
        println!("As int: {}", u.int_val);
    }
}

// That's ALL unsafe unlocks. It does NOT:
// - Disable the borrow checker
// - Allow data races (those are still UB)
// - Turn off type checking
// - Skip lifetime rules`}),e.jsx("h2",{children:"FFI: Calling C from Rust"}),e.jsx(r,{language:"rust",title:"The most common use of unsafe: C interop",code:`// Calling C's standard library math functions
extern "C" {
    fn sqrt(x: f64) -> f64;
    fn abs(x: i32) -> i32;
}

fn safe_sqrt(x: f64) -> Option<f64> {
    if x < 0.0 {
        None  // prevent domain error
    } else {
        // Wrap the unsafe call in a safe API
        Some(unsafe { sqrt(x) })
    }
}

fn main() {
    // Unsafe: we must ensure correct types and calling convention
    let result = unsafe { sqrt(16.0) };
    println!("sqrt(16) = {}", result);  // 4.0

    // Better: use the safe wrapper
    match safe_sqrt(16.0) {
        Some(r) => println!("Safe sqrt: {}", r),
        None => println!("Cannot sqrt negative number"),
    }

    println!("{:?}", safe_sqrt(-1.0));  // None
}

// This is exactly how PyO3 works under the hood:
// unsafe Rust code calls the CPython C API, wrapped in
// safe Rust abstractions that Python developers use.`}),e.jsx(t,{title:"Safe wrappers: the key pattern",type:"tip",children:e.jsxs("p",{children:["The idiomatic pattern is: write a small ",e.jsx("code",{children:"unsafe"})," block that does the raw operation, then wrap it in a safe function that enforces the invariants. Users of your API never see",e.jsx("code",{children:"unsafe"}),". This is how the standard library works —",e.jsx("code",{children:"Vec"}),", ",e.jsx("code",{children:"String"}),", ",e.jsx("code",{children:"HashMap"})," all use",e.jsx("code",{children:"unsafe"})," internally but expose safe interfaces."]})}),e.jsx("h2",{children:"How Much Unsafe Is Normal?"}),e.jsx(r,{language:"rust",title:"Unsafe in the wild",code:`// Real-world unsafe usage is MINIMAL:
//
// tokio (async runtime):     ~1% unsafe
// serde (serialization):     ~2% unsafe
// reqwest (HTTP client):     ~0% unsafe (delegates to hyper)
// polars (DataFrames):       ~1% unsafe (performance-critical paths)
//
// Your typical application code: 0% unsafe
//
// The standard library:      ~15% unsafe (because it builds
//                             the safe abstractions everyone uses)

// You will almost never need unsafe in application code.
// If you find yourself reaching for it, there's usually
// a safe alternative:

fn main() {
    // Instead of unsafe pointer arithmetic:
    let v = vec![10, 20, 30, 40, 50];

    // BAD: unsafe raw pointer access
    // unsafe { *v.as_ptr().add(2) }

    // GOOD: safe indexing with bounds check
    let val = v[2];

    // GOOD: safe indexing that returns Option
    let val = v.get(2);

    println!("{:?}", val);
}`}),e.jsx(t,{title:"Python developers rarely need unsafe",type:"pythonista",children:e.jsxs("p",{children:["If you are writing application code — data pipelines, web servers, CLI tools — you will likely never write ",e.jsx("code",{children:"unsafe"}),". It becomes relevant when you use PyO3 (which handles the unsafe FFI for you), build custom data structures, or interface with C libraries directly. For now, knowing that unsafe exists and what it means is enough."]})}),e.jsx(n,{title:"Identify unsafe needs",difficulty:"easy",problem:`For each scenario, decide whether unsafe is needed or if safe Rust can handle it:

1. Sorting a Vec<f64> of one million elements
2. Calling Python's C API through PyO3
3. Implementing a linked list with Box pointers
4. Reading a file and parsing JSON
5. Accessing a specific index in a slice without bounds checking
6. Sharing data between threads using Arc<Mutex<T>>
7. Reinterpreting the bytes of an i32 as a f32
8. Using HashMap to count word frequencies`,solution:`1. SAFE — Vec::sort() and iterators handle this entirely in safe Rust.

2. UNSAFE needed — calling C functions requires unsafe. But PyO3 wraps
   this for you, so YOUR code stays safe.

3. SAFE — a linked list using Box<Node> and Option is fully safe.
   (An unsafe version with raw pointers is faster but unnecessary
   for most use cases.)

4. SAFE — std::fs and serde_json are entirely safe APIs.

5. UNSAFE needed — get_unchecked() skips bounds checking and requires
   unsafe. But ask yourself: is the 2ns savings worth the risk?
   Use .get() or [] instead.

6. SAFE — Arc and Mutex are safe abstractions. The unsafe is inside
   the standard library implementations.

7. UNSAFE needed — transmute or union access requires unsafe because
   the compiler can't verify the reinterpretation is valid.

8. SAFE — HashMap's API is entirely safe.

Summary: 6 out of 8 scenarios need NO unsafe. This reflects real-world
Rust: the vast majority of code is safe.`})]})}const _=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"}));export{m as a,g as b,y as c,x as d,_ as e,f as s};
