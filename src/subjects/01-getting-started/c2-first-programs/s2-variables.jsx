import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Variables() {
  return (
    <div className="prose-rust">
      <h1>Variables &amp; Mutability</h1>

      <p>
        In Python, every variable is mutable by default — you can reassign any variable
        at any time to any type. Rust takes the opposite approach: variables are
        <strong> immutable by default</strong>. You must explicitly opt in to mutability
        with <code>let mut</code>. This is one of Rust's most important design decisions
        and takes some getting used to.
      </p>

      <ConceptBlock title="Immutability by Default">
        <p>
          Why would a language make variables immutable by default? Because most variables
          in well-written programs are assigned once and never changed. Immutability makes
          code easier to reason about — you can see <code>let x = 5;</code> and know that
          <code>x</code> will be 5 everywhere in its scope. The compiler also uses
          immutability information to generate better machine code and catch bugs where
          you accidentally modify something you shouldn't.
        </p>
      </ConceptBlock>

      <h2>let vs Python Assignment</h2>

      <PythonRustCompare
        title="Variable declaration"
        description="Python variables are always mutable. Rust variables are immutable unless declared with mut."
        pythonCode={`# Python: all variables are mutable
x = 5
print(x)  # 5

x = 10    # reassign — totally fine
print(x)  # 10

x = "now a string"  # even change type
print(x)  # now a string

# No way to make a variable truly
# immutable in Python
# (CONSTANTS are just a convention)`}
        rustCode={`fn main() {
    // Rust: immutable by default
    let x = 5;
    println!("{}", x); // 5

    // x = 10;  // ERROR: cannot assign
    //          // twice to immutable
    //          // variable \`x\`

    // Must explicitly opt in to mutability
    let mut y = 5;
    println!("{}", y); // 5
    y = 10;            // OK — y is mut
    println!("{}", y); // 10

    // But still can't change the type:
    // y = "string"; // ERROR: expected
    //               // integer, found &str
}`}
      />

      <NoteBlock type="pythonista" title="This feels backwards at first">
        Coming from Python, you might think &quot;why would I want immutable variables?&quot;
        But consider: how often do you actually need to reassign a variable after
        its initial assignment? In most functions, variables are set once and read
        many times. Rust makes the common case (immutable) the default, and the
        less common case (mutable) explicit. After a while, <code>let mut</code> starts
        to feel like a helpful signal: &quot;pay attention, this value will change.&quot;
      </NoteBlock>

      <h2>let mut for Mutable Variables</h2>

      <CodeBlock
        language="rust"
        title="Using mutable variables"
        code={`fn main() {
    // Building up a result
    let mut total = 0;
    for i in 1..=10 {
        total += i;
    }
    println!("Sum: {}", total); // Sum: 55

    // Modifying a string
    let mut greeting = String::from("Hello");
    greeting.push_str(", world!");
    println!("{}", greeting); // Hello, world!

    // Modifying a vector
    let mut numbers = vec![1, 2, 3];
    numbers.push(4);
    numbers.push(5);
    println!("{:?}", numbers); // [1, 2, 3, 4, 5]

    // Counting in a loop
    let mut count = 0;
    let names = vec!["Alice", "Bob", "Charlie"];
    for _name in &names {
        count += 1;
    }
    println!("Count: {}", count); // Count: 3
}`}
      />

      <h2>Shadowing: Redeclaring with let</h2>

      <p>
        Rust has a powerful feature called <strong>shadowing</strong>: you can declare
        a new variable with the same name using <code>let</code>, which creates an
        entirely new variable that shadows the previous one. Unlike mutation, shadowing
        can change the type.
      </p>

      <PythonRustCompare
        title="Shadowing vs reassignment"
        description="Rust's shadowing creates a new variable with the same name, which can even have a different type."
        pythonCode={`# Python: reassignment (same variable)
x = "   hello   "
x = x.strip()     # still a str
x = len(x)        # now an int
print(x)           # 5

# The variable x was mutated in place
# (well, rebound to new objects)
# Python doesn't distinguish between
# "new variable" and "changed variable"`}
        rustCode={`fn main() {
    // Rust: shadowing (new variable)
    let x = "   hello   ";
    let x = x.trim();     // new x: &str
    let x = x.len();      // new x: usize
    println!("{}", x);     // 5

    // Each \`let x\` creates a NEW variable
    // The old one is gone (shadowed)

    // This is different from mut:
    let mut y = 5;
    y = 10;    // same variable, new value
    // y = "hi"; // ERROR: can't change type

    let y = "hi"; // NEW variable shadows old y
    println!("{}", y); // OK: y is now a &str
}`}
      />

      <CodeBlock
        language="rust"
        title="Common shadowing patterns"
        code={`fn main() {
    // Parse a string to a number (same name, different type)
    let input = "42";
    let input: i32 = input.parse().expect("not a number");
    println!("Parsed: {}", input);

    // Transform data through a pipeline
    let data = "  Hello, World!  ";
    let data = data.trim();
    let data = data.to_uppercase();
    println!("{}", data); // "HELLO, WORLD!"

    // Narrow a type after validation
    let config_value = Some(42);
    if let Some(config_value) = config_value {
        // config_value is now i32, not Option<i32>
        println!("Config: {}", config_value);
    }
}`}
      />

      <NoteBlock type="tip" title="Shadowing vs mut: when to use which">
        Use <code>let mut</code> when you need to update a value repeatedly
        (counters, accumulators, buffers). Use shadowing when you are transforming
        a value through stages and the old value is no longer needed — especially
        when the type changes. Shadowing keeps variables immutable at each stage,
        which helps the compiler and makes the code easier to read.
      </NoteBlock>

      <h2>Constants</h2>

      <p>
        Rust also has <code>const</code> for truly constant values. Unlike <code>let</code>,
        constants must have explicit type annotations, must be set to a compile-time
        constant expression, and are valid for the entire duration of the program.
      </p>

      <CodeBlock
        language="rust"
        title="Constants vs let bindings"
        code={`// Constants: must be compile-time known, always annotated
const MAX_RETRIES: u32 = 3;
const PI: f64 = 3.141592653589793;
const APP_NAME: &str = "my-data-tool";

// Convention: SCREAMING_SNAKE_CASE (like Python)

fn main() {
    // 'let' bindings are set at runtime
    let user_input = "42";
    let parsed: i32 = user_input.parse().unwrap();

    // Constants can be used anywhere in scope
    println!("{} will retry up to {} times", APP_NAME, MAX_RETRIES);

    // Static variables: like const but with a fixed memory address
    // (rarely needed — prefer const)
    static VERSION: &str = "1.0.0";
    println!("Version: {}", VERSION);
}`}
      />

      <NoteBlock type="pythonista" title="Python's 'constants' are just conventions">
        Python has no real constants — <code>MAX_RETRIES = 3</code> is just a variable
        that everyone agrees not to change. Rust's <code>const</code> is enforced by
        the compiler. You literally cannot modify it, and the compiler can inline
        it everywhere for better performance.
      </NoteBlock>

      <h2>Type Inference</h2>

      <p>
        Rust has powerful type inference. In most cases, the compiler figures out the
        type from context, so you don't need to annotate every variable. But you always
        <em>can</em> annotate — and sometimes you must.
      </p>

      <CodeBlock
        language="rust"
        title="Type inference in action"
        code={`fn main() {
    // Compiler infers the type
    let x = 42;           // i32 (default integer type)
    let y = 3.14;         // f64 (default float type)
    let active = true;    // bool
    let name = "Alice";   // &str

    // Explicit annotation (same result)
    let x: i32 = 42;
    let y: f64 = 3.14;
    let active: bool = true;
    let name: &str = "Alice";

    // Sometimes the compiler needs help
    let numbers: Vec<i32> = Vec::new(); // empty vec — type needed
    // Or use the turbofish syntax:
    let numbers = Vec::<i32>::new();
    // Or let inference figure it out from usage:
    let mut numbers = Vec::new();
    numbers.push(42); // now compiler knows it's Vec<i32>

    // Parsing requires a type hint
    let n: i32 = "42".parse().unwrap();
    // Or with turbofish:
    let n = "42".parse::<i32>().unwrap();
}`}
      />

      <ExerciseBlock
        title="Variables and Mutability Practice"
        difficulty="beginner"
        problem={`Write a Rust program that:

1. Declares an immutable variable \`name\` with your name.
2. Declares a mutable variable \`score\` starting at 0.
3. In a loop from 1 to 5, add each number to \`score\`.
4. Use shadowing to convert \`score\` from i32 to a String that says "Final score: X".
5. Declare a constant \`MAX_SCORE\` of 100.
6. Print whether the score exceeds MAX_SCORE.

Try to predict what the compiler will say if you:
- Remove \`mut\` from score and try to add to it.
- Try to change \`name\` to a number without using \`let\`.`}
        solution={`\`\`\`rust
const MAX_SCORE: i32 = 100;

fn main() {
    let name = "Alice";

    let mut score: i32 = 0;
    for i in 1..=5 {
        score += i;
    }
    println!("{}'s score: {}", name, score); // Alice's score: 15

    // Shadow score as a String
    let score = format!("Final score: {}", score);
    println!("{}", score); // Final score: 15

    // We'd need the original i32 to compare, so let's parse it back
    // or just keep a copy before shadowing:
    let numeric_score: i32 = 15;
    if numeric_score > MAX_SCORE {
        println!("Exceeded max score!");
    } else {
        println!("Within limits (max: {})", MAX_SCORE);
    }
}
\`\`\`

Without \`mut\` on score: the compiler says "cannot assign twice to immutable variable \`score\`" and points to the exact line.

Changing name to a number without \`let\`: the compiler says "expected \`&str\`, found integer" because you can't change a variable's type through assignment — only through shadowing with a new \`let\`.`}
      />
    </div>
  );
}
