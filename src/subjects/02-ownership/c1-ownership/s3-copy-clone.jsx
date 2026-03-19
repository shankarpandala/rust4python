import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const CopyClone = () => {
  return (
    <div className="prose-rust">
      <h1>Copy vs Clone</h1>

      <p>
        In the previous section you learned that assignment in Rust moves ownership.
        But you also saw that integers don't move — they copy. This section explains
        <em> when</em> Rust copies, <em>when</em> it moves, and how to explicitly
        duplicate values with <code>Clone</code>.
      </p>

      <ConceptBlock title="Two Ways to Duplicate Values">
        <p>
          Rust has two traits for duplicating values:
        </p>
        <ul>
          <li>
            <strong>Copy</strong> — implicit, bitwise copy. Happens automatically on
            assignment. Only for types whose data lives entirely on the stack.
          </li>
          <li>
            <strong>Clone</strong> — explicit, potentially expensive deep copy. You must
            call <code>.clone()</code> manually. Works for any type that implements the trait.
          </li>
        </ul>
        <p>
          If a type implements <code>Copy</code>, assignment duplicates the value instead of
          moving it. If it does not, assignment moves.
        </p>
      </ConceptBlock>

      <h2>Copy Types: Stack-Only Data</h2>

      <CodeBlock
        language="rust"
        title="Types that implement Copy"
        code={`fn main() {
    // All of these types implement Copy
    let a: i32 = 42;
    let b = a;         // COPY, not move — both valid
    println!("{} {}", a, b);

    let x: f64 = 3.14;
    let y = x;         // copy
    println!("{} {}", x, y);

    let flag: bool = true;
    let flag2 = flag;  // copy
    println!("{} {}", flag, flag2);

    let ch: char = 'A';
    let ch2 = ch;      // copy
    println!("{} {}", ch, ch2);

    // Tuples of Copy types are also Copy
    let point = (1.0, 2.0);
    let point2 = point; // copy
    println!("{:?} {:?}", point, point2);

    // Fixed-size arrays of Copy types are Copy
    let arr = [1, 2, 3];
    let arr2 = arr;     // copy
    println!("{:?} {:?}", arr, arr2);
}`}
      />

      <NoteBlock type="pythonista" title="Python has no Copy vs Move distinction">
        <p>
          In Python, every value is a heap-allocated, reference-counted object — even
          integers. When you write <code>b = a</code>, you always get a shared reference,
          never a copy and never a move. Python's uniformity is simpler but costs
          performance: even <code>x = 42</code> involves a heap object and reference counting.
          Rust's distinction lets integers live cheaply on the stack.
        </p>
      </NoteBlock>

      <h2>Why String Doesn't Implement Copy</h2>

      <ConceptBlock title="The Copy Rule">
        <p>
          A type can implement <code>Copy</code> only if all of its data lives on the stack
          and duplicating it is just a bitwise copy. <code>String</code> contains a pointer
          to heap-allocated data. A bitwise copy would create two variables pointing to the
          same heap memory, and when both go out of scope, the memory would be freed
          twice — a double-free bug. So <code>String</code> cannot be <code>Copy</code>.
        </p>
      </ConceptBlock>

      <CodeBlock
        language="rust"
        title="String must move or be cloned"
        code={`fn main() {
    let s1 = String::from("hello");

    // This MOVES — s1 is invalidated
    let s2 = s1;
    // println!("{}", s1); // ERROR

    // To duplicate, use .clone()
    let s3 = String::from("world");
    let s4 = s3.clone();  // explicit deep copy
    println!("{} {}", s3, s4); // Both valid

    // What clone does for String:
    // 1. Allocates new heap memory
    // 2. Copies all bytes from s3's buffer to the new buffer
    // 3. Returns a new String pointing to the new buffer
    // This is O(n) where n is the string length
}`}
      />

      <h2>Clone: Explicit Deep Copy</h2>

      <PythonRustCompare
        title="Deep copying data"
        description="Python uses copy.deepcopy() for deep copies. Rust uses .clone() for types that implement Clone."
        pythonCode={`import copy

original = {
    "name": "Alice",
    "scores": [95, 87, 92]
}
# Shallow copy — nested lists are shared
shallow = original.copy()

# Deep copy — everything is independent
deep = copy.deepcopy(original)
deep["scores"].append(100)
print(original["scores"])  # [95, 87, 92]
print(deep["scores"])      # [95, 87, 92, 100]`}
        rustCode={`#[derive(Clone, Debug)]
struct Student {
    name: String,
    scores: Vec<i32>,
}

fn main() {
    let original = Student {
        name: String::from("Alice"),
        scores: vec![95, 87, 92],
    };

    // .clone() always does a deep copy in Rust
    let mut deep = original.clone();
    deep.scores.push(100);
    println!("{:?}", original.scores); // [95, 87, 92]
    println!("{:?}", deep.scores);     // [95, 87, 92, 100]
}`}
      />

      <NoteBlock type="tip" title="Rust has no shallow copy footgun">
        <p>
          In Python, <code>dict.copy()</code> and <code>list[:]</code> create shallow
          copies where nested mutable objects are shared. This is a common source of bugs.
          In Rust, <code>.clone()</code> always produces a fully independent copy. There is
          no shallow-copy trap.
        </p>
      </NoteBlock>

      <h2>Making Your Structs Copy or Clone</h2>

      <CodeBlock
        language="rust"
        title="Deriving Copy and Clone for your types"
        code={`// Clone only: the struct contains a String (heap data)
#[derive(Clone, Debug)]
struct User {
    name: String,
    age: u32,
}

// Both Copy and Clone: all fields are Copy types
#[derive(Copy, Clone, Debug)]
struct Point {
    x: f64,
    y: f64,
}

// Copy requires Clone — you always derive both together
// #[derive(Copy)] alone won't compile

fn main() {
    // Point copies implicitly
    let p1 = Point { x: 1.0, y: 2.0 };
    let p2 = p1;
    println!("{:?} {:?}", p1, p2); // both valid

    // User must be cloned explicitly
    let u1 = User { name: String::from("Alice"), age: 30 };
    let u2 = u1.clone();
    println!("{:?} {:?}", u1, u2); // both valid

    // Without clone, User moves
    let u3 = u1; // move
    // println!("{:?}", u1); // ERROR: u1 moved
    println!("{:?}", u3);
}`}
      />

      <NoteBlock type="warning" title="You cannot derive Copy if any field is non-Copy">
        <p>
          If your struct has even one <code>String</code>, <code>Vec</code>, or other
          heap-allocated field, you cannot derive <code>Copy</code>. The compiler will
          reject it with a clear error message. In those cases, derive <code>Clone</code>
          and use <code>.clone()</code> when you need a duplicate.
        </p>
      </NoteBlock>

      <h2>When to Use Clone</h2>

      <CodeBlock
        language="rust"
        title="Practical patterns with Clone"
        code={`fn main() {
    // Pattern 1: Need a value in two places
    let config_name = String::from("production");
    let logger_name = config_name.clone();
    start_server(config_name);
    start_logger(logger_name);

    // Pattern 2: Building a collection from repeated data
    let template = String::from("item");
    let items: Vec<String> = (0..5)
        .map(|i| format!("{}_{}", template, i))
        .collect();
    println!("{:?}", items);

    // Pattern 3: Keeping a backup
    let mut data = vec![3, 1, 4, 1, 5];
    let original = data.clone();
    data.sort();
    println!("sorted: {:?}", data);
    println!("original: {:?}", original);
}

fn start_server(name: String) { println!("Server: {}", name); }
fn start_logger(name: String) { println!("Logger: {}", name); }
`}
      />

      <NoteBlock type="tip" title="Clone is not free — but it's not evil either">
        <p>
          New Rust programmers sometimes avoid <code>.clone()</code> obsessively because
          they think it's "bad". It does have a cost (heap allocation + memcpy), but
          for most applications it's perfectly fine. Use <code>.clone()</code> to get your
          code working, then optimize with borrowing later if profiling shows it matters.
          Premature optimization of clones is a common time sink for beginners.
        </p>
      </NoteBlock>

      <h2>Copy, Clone, and Function Arguments</h2>

      <CodeBlock
        language="rust"
        title="How Copy and Clone interact with functions"
        code={`fn print_number(n: i32) {
    println!("{}", n);
}

fn print_string(s: String) {
    println!("{}", s);
}

fn main() {
    let num = 42;
    print_number(num);  // i32 is Copy — num is copied
    print_number(num);  // still valid, no problem
    println!("{}", num); // still valid

    let text = String::from("hello");
    print_string(text); // String moves — text is invalidated
    // print_string(text); // ERROR: value used after move

    // Solutions:
    let text2 = String::from("world");
    print_string(text2.clone()); // clone: text2 stays valid
    print_string(text2);         // now text2 moves — last use is fine
}`}
      />

      <ExerciseBlock
        title="Copy or Move?"
        difficulty="beginner"
        problem={`For each of the following types, determine whether assignment copies or moves.
Explain why.

1. i64
2. String
3. (f32, f32)
4. Vec<i32>
5. [u8; 4]
6. &str
7. bool`}
        solution={`1. i64 — COPY. Primitive integer, lives on the stack.
2. String — MOVE. Contains a heap pointer. Cannot be Copy.
3. (f32, f32) — COPY. Tuple of Copy types is Copy.
4. Vec<i32> — MOVE. Contains a heap pointer. Cannot be Copy.
5. [u8; 4] — COPY. Fixed-size array of Copy types is Copy.
6. &str — COPY. References implement Copy (they're just a pointer + length on the stack).
7. bool — COPY. Primitive type, lives on the stack.

The rule: if a type's data lives entirely on the stack and a bitwise
copy produces a valid independent value, it can be Copy. If it owns
heap data (String, Vec, Box, HashMap, etc.), it must move.`}
      />

      <ExerciseBlock
        title="Make It Compile"
        difficulty="easy"
        problem={`Fix this code so it compiles and prints all three lines:

struct Config {
    name: String,
    max_retries: u32,
}

fn apply_config(config: Config) {
    println!("Applying: {} (retries: {})", config.name, config.max_retries);
}

fn main() {
    let cfg = Config { name: String::from("prod"), max_retries: 3 };
    apply_config(cfg);
    apply_config(cfg);
    println!("Done with: {}", cfg.name);
}`}
        solution={`// Solution: Derive Clone and use .clone()
#[derive(Clone)]
struct Config {
    name: String,
    max_retries: u32,
}

fn apply_config(config: Config) {
    println!("Applying: {} (retries: {})", config.name, config.max_retries);
}

fn main() {
    let cfg = Config { name: String::from("prod"), max_retries: 3 };
    apply_config(cfg.clone());  // clone for first call
    apply_config(cfg.clone());  // clone for second call
    println!("Done with: {}", cfg.name);
}

// Even better: change apply_config to take &Config (borrowing)
// fn apply_config(config: &Config) { ... }
// Then no cloning is needed at all.`}
      />
    </div>
  );
};

export default CopyClone;
