import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function PatternMatching() {
  return (
    <div className="prose-rust">
      <h1>Pattern Matching with match</h1>

      <p>
        Rust's <code>match</code> is one of the language's most powerful features.
        It looks like a switch statement, but it is far more capable: it can destructure
        enums, tuples, and structs; bind variables; add guard conditions; and the compiler
        guarantees you have covered every possible case. If you have used Python 3.10's
        <code>match</code> statement, Rust's version is the inspiration — but more
        rigorous.
      </p>

      <ConceptBlock title="Exhaustive Pattern Matching">
        <p>
          The key property of Rust's <code>match</code> is <strong>exhaustiveness</strong>:
          the compiler requires that every possible value is handled. If you match on
          an enum with four variants, you must have arms for all four (or use a wildcard).
          This means you cannot forget to handle a case — the compiler will refuse to
          compile until you do. This eliminates an entire class of bugs where a new
          variant is added but not all code paths are updated.
        </p>
      </ConceptBlock>

      <h2>Basic match</h2>

      <PythonRustCompare
        title="Switch/match comparison"
        description="Python's match (3.10+) is structurally similar but Rust's is more powerful and exhaustive."
        pythonCode={`# Python match (3.10+)
status = 404

match status:
    case 200:
        print("OK")
    case 404:
        print("Not Found")
    case 500:
        print("Server Error")
    case _:
        print(f"Unknown: {status}")

# Older Python: if/elif chains
if status == 200:
    print("OK")
elif status == 404:
    print("Not Found")
else:
    print(f"Unknown: {status}")`}
        rustCode={`fn main() {
    let status = 404;

    // Rust match — MUST be exhaustive
    match status {
        200 => println!("OK"),
        404 => println!("Not Found"),
        500 => println!("Server Error"),
        _ => println!("Unknown: {}", status),
    }

    // match is an expression — returns a value
    let message = match status {
        200 => "OK",
        404 => "Not Found",
        500 => "Server Error",
        _ => "Unknown",
    };
    println!("{}", message);

    // Without the _ wildcard, the compiler
    // would error: "non-exhaustive patterns"
}`}
      />

      <h2>Matching Multiple Values and Ranges</h2>

      <CodeBlock
        language="rust"
        title="Pattern syntax: multiple values, ranges, and bindings"
        code={`fn main() {
    let code = 403;

    // Multiple values with |
    let category = match code {
        200 | 201 | 202 => "Success",
        301 | 302 => "Redirect",
        400 | 401 | 403 | 404 => "Client Error",
        500 | 502 | 503 => "Server Error",
        _ => "Other",
    };
    println!("{}: {}", code, category);

    // Ranges with ..=
    let score = 85;
    let grade = match score {
        90..=100 => "A",
        80..=89 => "B",
        70..=79 => "C",
        60..=69 => "D",
        0..=59 => "F",
        _ => "Invalid",
    };
    println!("Score {}: {}", score, grade);

    // Binding the matched value with @
    let age = 25;
    match age {
        0..=12 => println!("Child"),
        teen @ 13..=19 => println!("Teenager, age {}", teen),
        adult @ 20..=64 => println!("Adult, age {}", adult),
        senior @ 65.. => println!("Senior, age {}", senior),
        // Note: no _ needed — all u8/i32 values covered
        // by the open-ended range 65..
    }
}`}
      />

      <h2>Destructuring in Patterns</h2>

      <p>
        This is where <code>match</code> truly outshines simple switch statements.
        You can destructure tuples, enums, and structs directly in match arms,
        extracting values and binding them to variables.
      </p>

      <CodeBlock
        language="rust"
        title="Destructuring tuples and enums"
        code={`fn main() {
    // Destructure tuples
    let point = (3, -5);
    match point {
        (0, 0) => println!("At origin"),
        (x, 0) => println!("On x-axis at x={}", x),
        (0, y) => println!("On y-axis at y={}", y),
        (x, y) => println!("At ({}, {})", x, y),
    }

    // Destructure Option
    let maybe_name: Option<&str> = Some("Alice");
    match maybe_name {
        Some(name) => println!("Hello, {}!", name),
        None => println!("Hello, stranger!"),
    }

    // Destructure Result
    let parsed: Result<i32, _> = "42".parse();
    match parsed {
        Ok(n) => println!("Parsed: {}", n),
        Err(e) => println!("Error: {}", e),
    }

    // Nested destructuring
    let data: Option<(i32, &str)> = Some((42, "answer"));
    match data {
        Some((n, label)) => println!("{}: {}", label, n),
        None => println!("No data"),
    }
}`}
      />

      <NoteBlock type="pythonista" title="Python destructuring is more limited">
        Python 3.10's match can destructure sequences and objects, but it is not
        exhaustive — the compiler does not verify you covered all cases. Rust's
        match arms are checked at compile time, which is especially powerful with
        enums: if you add a new variant later, every <code>match</code> on that
        enum will fail to compile until you handle the new case.
      </NoteBlock>

      <h2>Match Guards</h2>

      <p>
        You can add <code>if</code> conditions (called guards) to match arms for
        more precise matching.
      </p>

      <PythonRustCompare
        title="Match with conditions"
        description="Rust match guards add if conditions to pattern arms for precise control."
        pythonCode={`# Python 3.10 match with guards
value = 42

match value:
    case x if x < 0:
        print(f"{x} is negative")
    case x if x == 0:
        print("zero")
    case x if x < 100:
        print(f"{x} is small positive")
    case x:
        print(f"{x} is large")

# More commonly in Python, you'd
# just use if/elif
if value < 0:
    print("negative")
elif value == 0:
    print("zero")
elif value < 100:
    print("small positive")
else:
    print("large")`}
        rustCode={`fn main() {
    let value = 42;

    match value {
        x if x < 0 => {
            println!("{} is negative", x);
        }
        0 => println!("zero"),
        x if x < 100 => {
            println!("{} is small positive", x);
        }
        x => println!("{} is large", x),
    }

    // Guards with destructured values
    let pair = (2, -3);
    match pair {
        (x, y) if x > 0 && y > 0 => {
            println!("Both positive");
        }
        (x, y) if x + y == 0 => {
            println!("Sum is zero");
        }
        _ => println!("Something else"),
    }
}`}
      />

      <h2>The _ Wildcard and Ignoring Values</h2>

      <CodeBlock
        language="rust"
        title="Wildcards and ignoring patterns"
        code={`fn main() {
    let value = 42;

    // _ matches anything and ignores it
    match value {
        1 => println!("one"),
        2 => println!("two"),
        _ => println!("something else"),
    }

    // Ignore parts of a structure
    let point = (3, 5, 7);
    match point {
        (x, _, z) => println!("x={}, z={}", x, z),
    }

    // Ignore with _prefix (suppresses unused warning)
    let _unused_variable = 42;

    // .. to ignore remaining fields
    let numbers = (1, 2, 3, 4, 5);
    match numbers {
        (first, .., last) => {
            println!("first={}, last={}", first, last);
        }
    }
}`}
      />

      <h2>Matching with Custom Enums</h2>

      <CodeBlock
        language="rust"
        title="Enums and exhaustive matching"
        code={`// Define a custom enum
enum Shape {
    Circle(f64),              // radius
    Rectangle(f64, f64),      // width, height
    Triangle(f64, f64, f64),  // three sides
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r) => {
            std::f64::consts::PI * r * r
        }
        Shape::Rectangle(w, h) => w * h,
        Shape::Triangle(a, b, c) => {
            // Heron's formula
            let s = (a + b + c) / 2.0;
            (s * (s - a) * (s - b) * (s - c)).sqrt()
        }
        // No _ needed — all variants are covered!
        // If you add a new Shape variant later,
        // this match will fail to compile.
    }
}

fn main() {
    let shapes = vec![
        Shape::Circle(5.0),
        Shape::Rectangle(4.0, 6.0),
        Shape::Triangle(3.0, 4.0, 5.0),
    ];

    for shape in &shapes {
        println!("Area: {:.2}", area(shape));
    }
}`}
      />

      <NoteBlock type="warning" title="Exhaustiveness catches bugs at compile time">
        If you add a new variant to an enum (say, <code>Shape::Pentagon</code>), every
        <code>match</code> expression on <code>Shape</code> will immediately produce
        a compiler error until you handle the new case. This is one of Rust's strongest
        safety guarantees and is why experienced Rust developers prefer <code>match</code>
        over chains of <code>if/else</code> when working with enums.
      </NoteBlock>

      <ExerciseBlock
        title="Pattern Matching Practice"
        difficulty="intermediate"
        problem={`Create an enum called \`Command\` with these variants:

- \`Quit\` (no data)
- \`Echo(String)\` (a message to print)
- \`Move { x: i32, y: i32 }\` (a struct variant with coordinates)
- \`Color(u8, u8, u8)\` (RGB values)

Write a function \`process_command\` that uses match to handle each variant:
- Quit: print "Shutting down"
- Echo: print the message
- Move: print "Moving to (x, y)" — add a guard that prints "Out of bounds!" if x or y is greater than 100
- Color: print the color as hex format "#RRGGBB"

In main, create a Vec of commands and process each one.`}
        solution={`\`\`\`rust
enum Command {
    Quit,
    Echo(String),
    Move { x: i32, y: i32 },
    Color(u8, u8, u8),
}

fn process_command(cmd: &Command) {
    match cmd {
        Command::Quit => println!("Shutting down"),
        Command::Echo(msg) => println!("{}", msg),
        Command::Move { x, y } if *x > 100 || *y > 100 => {
            println!("Out of bounds! ({}, {})", x, y);
        }
        Command::Move { x, y } => {
            println!("Moving to ({}, {})", x, y);
        }
        Command::Color(r, g, b) => {
            println!("#{:02x}{:02x}{:02x}", r, g, b);
        }
    }
}

fn main() {
    let commands = vec![
        Command::Echo(String::from("Hello, Rust!")),
        Command::Move { x: 10, y: 20 },
        Command::Move { x: 150, y: 50 },
        Command::Color(255, 128, 0),
        Command::Quit,
    ];

    for cmd in &commands {
        process_command(cmd);
    }
}
\`\`\`

Output:
\`\`\`
Hello, Rust!
Moving to (10, 20)
Out of bounds! (150, 50)
#ff8000
Shutting down
\`\`\`

Note how the guard arm for Move must come BEFORE the general Move arm — Rust checks arms in order. The compiler verifies all four variants are handled.`}
      />
    </div>
  );
}
