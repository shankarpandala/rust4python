import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Conditionals() {
  return (
    <div className="prose-rust">
      <h1>If/Else Expressions</h1>

      <p>
        Rust's <code>if/else</code> looks familiar, but there is a crucial difference:
        in Rust, <code>if/else</code> is an <strong>expression</strong>, not a statement.
        This means it returns a value, and you can use it on the right side of a
        <code>let</code> binding. This concept — that most things are expressions — is
        a core part of Rust's design and will feel natural once you get used to it.
      </p>

      <ConceptBlock title="Expressions vs Statements">
        <p>
          In Python, <code>if/else</code> is a statement — it performs an action but
          does not produce a value (except for the ternary <code>x if cond else y</code>).
          In Rust, almost everything is an expression that produces a value:
          <code>if/else</code>, blocks <code>{'{}'}</code>, and even <code>match</code>.
          The last expression in a block (without a semicolon) becomes the block's value.
        </p>
      </ConceptBlock>

      <h2>Basic If/Else</h2>

      <PythonRustCompare
        title="If/else syntax"
        description="Rust uses curly braces instead of indentation, and no parentheses around the condition."
        pythonCode={`temperature = 35

if temperature > 30:
    print("It's hot!")
elif temperature > 20:
    print("It's nice.")
elif temperature > 10:
    print("It's cool.")
else:
    print("It's cold!")

# Indentation defines the blocks
# Colon after the condition`}
        rustCode={`fn main() {
    let temperature = 35;

    if temperature > 30 {
        println!("It's hot!");
    } else if temperature > 20 {
        println!("It's nice.");
    } else if temperature > 10 {
        println!("It's cool.");
    } else {
        println!("It's cold!");
    }

    // No parentheses needed (but allowed)
    // Curly braces required (always)
    // "else if" instead of "elif"
}`}
      />

      <h2>If as an Expression</h2>

      <p>
        This is where Rust's <code>if</code> really differs from Python. Because
        <code>if/else</code> is an expression, it produces a value that you can
        assign to a variable.
      </p>

      <PythonRustCompare
        title="Conditional expressions"
        description="Python uses the ternary operator for inline conditionals. Rust uses the regular if/else as an expression."
        pythonCode={`age = 20

# Python ternary (inline conditional)
status = "adult" if age >= 18 else "minor"
print(status)

# For anything complex, you need a
# regular if/else statement
if age >= 65:
    category = "senior"
elif age >= 18:
    category = "adult"
else:
    category = "minor"

# The variable might be unset if you
# forget a branch (no compiler help)`}
        rustCode={`fn main() {
    let age = 20;

    // if/else IS the expression
    let status = if age >= 18 {
        "adult"
    } else {
        "minor"
    };
    println!("{}", status);

    // Works with multiple branches too
    let category = if age >= 65 {
        "senior"
    } else if age >= 18 {
        "adult"
    } else {
        "minor"
    };

    // Compiler ensures:
    // 1. All branches return same type
    // 2. All cases are covered
    println!("{}", category);
}`}
      />

      <NoteBlock type="pythonista" title="The semicolons matter!">
        Notice the semicolon after the closing brace: <code>{'};'}</code>. The
        <code>if/else</code> block is an expression that produces a value, and
        <code>let status = ...;</code> is a statement that binds that value. Also
        notice the values inside the branches have <strong>no semicolons</strong> —
        that makes them expressions (return values). Adding a semicolon would turn
        them into statements that return <code>()</code> (the unit type, like
        Python's <code>None</code>).
      </NoteBlock>

      <CodeBlock
        language="rust"
        title="More expression examples"
        code={`fn main() {
    let x = 5;

    // Use if-expression inline
    println!("x is {}", if x > 0 { "positive" } else { "non-positive" });

    // Blocks are expressions too
    let result = {
        let a = 10;
        let b = 20;
        a + b   // no semicolon = this is the value
    };
    println!("result: {}", result); // 30

    // Combine with functions
    let score = 85;
    let grade = calculate_grade(score);
    println!("Grade: {}", grade);
}

fn calculate_grade(score: i32) -> &'static str {
    if score >= 90 {
        "A"
    } else if score >= 80 {
        "B"
    } else if score >= 70 {
        "C"
    } else if score >= 60 {
        "D"
    } else {
        "F"
    }
    // No return keyword needed — the last expression
    // is the return value
}`}
      />

      <h2>No Truthy/Falsy Values</h2>

      <p>
        Python has extensive truthy/falsy rules: empty collections are falsy, zero is
        falsy, <code>None</code> is falsy, empty strings are falsy. Rust has none of
        this. The condition in an <code>if</code> must be exactly <code>bool</code>.
      </p>

      <PythonRustCompare
        title="Boolean conditions"
        description="Python auto-converts values to bool. Rust requires explicit bool expressions."
        pythonCode={`# Python: truthy/falsy everywhere
items = [1, 2, 3]
if items:          # truthy: non-empty list
    print("has items")

name = ""
if not name:       # falsy: empty string
    print("no name")

count = 0
if count:          # falsy: zero
    print("has count")

value = None
if value:          # falsy: None
    print("has value")`}
        rustCode={`fn main() {
    let items = vec![1, 2, 3];
    // if items { }  // ERROR: expected bool
    if !items.is_empty() {
        println!("has items");
    }

    let name = "";
    // if !name { }  // ERROR: expected bool
    if name.is_empty() {
        println!("no name");
    }

    let count = 0;
    // if count { }  // ERROR: expected bool
    if count != 0 {
        println!("has count");
    }

    let value: Option<i32> = None;
    // if value { }  // ERROR: expected bool
    if value.is_some() {
        println!("has value");
    }
}`}
      />

      <NoteBlock type="tip" title="This prevents a common bug class">
        Python's truthy/falsy rules are a frequent source of bugs. For example,
        <code>if result:</code> does different things for <code>None</code>,
        <code>0</code>, <code>[]</code>, and <code>""</code> — all are falsy.
        Rust forces you to say exactly what you mean: <code>result.is_some()</code>,
        <code>result != 0</code>, <code>!result.is_empty()</code>. This explicitness
        eliminates an entire class of subtle logic bugs.
      </NoteBlock>

      <h2>if let — Pattern Matching in Conditionals</h2>

      <CodeBlock
        language="rust"
        title="if let for concise pattern matching"
        code={`fn main() {
    // Option handling with if let
    let config_value: Option<i32> = Some(42);

    // Verbose way with match
    match config_value {
        Some(val) => println!("Got: {}", val),
        None => println!("No value"),
    }

    // Concise way with if let
    if let Some(val) = config_value {
        println!("Got: {}", val);
    } else {
        println!("No value");
    }

    // Great for checking one specific pattern
    let result: Result<i32, String> = Ok(100);
    if let Ok(value) = result {
        println!("Success: {}", value);
    }

    // Combine with other conditions
    let age: Option<u32> = Some(25);
    if let Some(a) = age {
        if a >= 18 {
            println!("Adult, age {}", a);
        }
    }
}`}
      />

      <ExerciseBlock
        title="Expression-Based Conditionals"
        difficulty="beginner"
        problem={`Write a Rust function called \`classify_bmi\` that takes a \`f64\` BMI value and returns a &str classification:

- Below 18.5: "underweight"
- 18.5 to 24.9: "normal"
- 25.0 to 29.9: "overweight"
- 30.0 and above: "obese"

Requirements:
1. Use if/else as an EXPRESSION to return the value (no return keyword).
2. In main(), use the function with at least 3 different values.
3. Use a let binding with an if expression to create a message like "Your BMI of 22.5 is normal."
4. Bonus: Handle the edge case where BMI is negative by returning "invalid".`}
        solution={`\`\`\`rust
fn classify_bmi(bmi: f64) -> &'static str {
    if bmi < 0.0 {
        "invalid"
    } else if bmi < 18.5 {
        "underweight"
    } else if bmi < 25.0 {
        "normal"
    } else if bmi < 30.0 {
        "overweight"
    } else {
        "obese"
    }
}

fn main() {
    let test_values = [16.0, 22.5, 27.0, 35.0, -1.0];

    for &bmi in &test_values {
        let category = classify_bmi(bmi);
        let message = if category == "invalid" {
            format!("BMI of {} is not valid", bmi)
        } else {
            format!("Your BMI of {} is classified as {}", bmi, category)
        };
        println!("{}", message);
    }
}
\`\`\`

Output:
\`\`\`
Your BMI of 16 is classified as underweight
Your BMI of 22.5 is classified as normal
Your BMI of 27 is classified as overweight
Your BMI of 35 is classified as obese
BMI of -1 is not valid
\`\`\`

Key points: the function body is a single if/else expression with no \`return\` keyword. The last expression in each branch (the string literal) is the return value because it has no semicolon.`}
      />
    </div>
  );
}
