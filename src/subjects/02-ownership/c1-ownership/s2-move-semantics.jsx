import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const MoveSemantics = () => {
  return (
    <div className="prose-rust">
      <h1>Move Semantics</h1>

      <p>
        In Python, when you write <code>b = a</code>, both variables point to the same
        object in memory. In Rust, <code>b = a</code> <strong>moves</strong> the value
        from <code>a</code> to <code>b</code>, and <code>a</code> becomes invalid. This
        is the single most important conceptual shift for Python developers learning Rust.
      </p>

      <ConceptBlock title="What Is a Move?">
        <p>
          A move transfers ownership of a value from one variable to another. After a move,
          the source variable can no longer be used. The compiler enforces this at compile
          time — there is no runtime check and no runtime cost. The bits in memory are not
          copied or relocated; the compiler simply updates its internal tracking of which
          variable owns the data.
        </p>
      </ConceptBlock>

      <h2>Python Assignment vs Rust Assignment</h2>

      <PythonRustCompare
        title="Assignment: alias vs move"
        description="Python creates an alias (two names for the same object). Rust transfers ownership (only one name remains valid)."
        pythonCode={`# Python: assignment creates an ALIAS
name = "Alice"
greeting = name
# Both 'name' and 'greeting' point
# to the same string object in memory
print(name)      # Alice — still valid
print(greeting)  # Alice

# This works because Python tracks
# reference counts at runtime`}
        rustCode={`fn main() {
    // Rust: assignment MOVES ownership
    let name = String::from("Alice");
    let greeting = name;
    // 'name' is now INVALID
    // println!("{}", name);  // ERROR!
    println!("{}", greeting); // Alice

    // No reference counting needed —
    // only one owner exists at a time
}`}
      />

      <h2>Why Strings Move but Integers Don't</h2>

      <p>
        Not everything in Rust moves on assignment. Simple types like integers, floats,
        and booleans are <strong>copied</strong> instead. The key distinction is where
        the data lives:
      </p>

      <CodeBlock
        language="rust"
        title="Stack types copy, heap types move"
        code={`fn main() {
    // Integers live entirely on the stack — they implement Copy
    let x = 42;
    let y = x;
    println!("x = {}, y = {}", x, y); // Both valid!

    // Strings have data on the heap — they MOVE
    let s1 = String::from("hello");
    let s2 = s1;
    // println!("{}", s1); // ERROR: value used after move
    println!("{}", s2);    // OK

    // Why? A String is three values on the stack:
    // - a pointer to heap data
    // - a length
    // - a capacity
    // If both s1 and s2 held the same pointer, who frees the heap data?
    // Rust avoids this ambiguity by invalidating s1.
}`}
      />

      <NoteBlock type="pythonista" title="Python has no equivalent to moves">
        <p>
          In Python, every value is reference-counted and heap-allocated. There is no
          concept of "invalidating" a variable after assignment. When you write
          <code> b = a</code> in Python, both names share the same object, and the
          runtime ensures it stays alive until both names are gone. Rust's move system
          eliminates the need for this runtime tracking entirely.
        </p>
      </NoteBlock>

      <h2>When Does a Move Happen?</h2>

      <p>
        Moves happen in three situations: assignment, passing arguments to functions,
        and returning values from functions.
      </p>

      <CodeBlock
        language="rust"
        title="Three contexts where moves occur"
        code={`fn take_ownership(s: String) {
    println!("Got: {}", s);
} // s is dropped here

fn give_ownership() -> String {
    let s = String::from("yours now");
    s // ownership moves to the caller
}

fn main() {
    // 1. Assignment
    let a = String::from("hello");
    let b = a;           // move: a -> b
    // a is invalid

    // 2. Function arguments
    let c = String::from("world");
    take_ownership(c);   // move: c -> s (the parameter)
    // c is invalid — the function now owns it

    // 3. Return values
    let d = give_ownership(); // move: return value -> d
    println!("{}", d);        // "yours now"
}`}
      />

      <h2>Why Moves Are Zero-Cost</h2>

      <ConceptBlock title="Moves at the Machine Level">
        <p>
          A move does not copy heap data. For a <code>String</code>, a move copies only
          the three stack values (pointer, length, capacity) — 24 bytes total regardless
          of how large the string is. The heap data stays exactly where it is. The compiler
          then marks the source variable as unusable so that no double-free can occur.
        </p>
        <p>
          Compare this to Python, where <code>b = a</code> must atomically increment a
          reference count (an expensive operation in tight loops), and later atomically
          decrement it when <code>a</code> goes away. Rust's approach has literally zero
          runtime cost.
        </p>
      </ConceptBlock>

      <h2>Common Compiler Errors and How to Fix Them</h2>

      <CodeBlock
        language="rust"
        title="Error: use of moved value"
        code={`fn main() {
    let data = vec![1, 2, 3];
    let backup = data;

    // ERROR: borrow of moved value: \`data\`
    // println!("{:?}", data);

    // Fix 1: Use the new owner
    println!("{:?}", backup);

    // Fix 2: Clone before moving
    let data2 = vec![4, 5, 6];
    let backup2 = data2.clone(); // explicit deep copy
    println!("original: {:?}", data2);   // still valid
    println!("backup: {:?}", backup2);   // independent copy

    // Fix 3: Borrow instead of moving (covered in borrowing chapter)
    let data3 = vec![7, 8, 9];
    print_data(&data3);  // pass a reference, not ownership
    println!("{:?}", data3); // still valid!
}

fn print_data(d: &Vec<i32>) {
    println!("{:?}", d);
}`}
      />

      <CodeBlock
        language="rust"
        title="Error: use of moved value in a loop"
        code={`fn process(s: String) {
    println!("Processing: {}", s);
}

fn main() {
    let name = String::from("Alice");

    // ERROR: this moves 'name' on the first iteration,
    // then tries to use it again on the second iteration
    // for _ in 0..3 {
    //     process(name);  // moved on first iteration!
    // }

    // Fix 1: Clone inside the loop
    for _ in 0..3 {
        process(name.clone()); // each iteration gets its own copy
    }

    // Fix 2: Borrow instead
    let name2 = String::from("Bob");
    for _ in 0..3 {
        println!("Hello, {}", &name2); // borrow — no move
    }
}`}
      />

      <NoteBlock type="tip" title="Three strategies when the compiler says 'value used after move'">
        <p>
          <strong>1. Clone:</strong> Call <code>.clone()</code> to create an independent
          copy. Easy but may be expensive for large data.
        </p>
        <p>
          <strong>2. Borrow:</strong> Pass a reference (<code>&value</code>) instead of
          the value itself. This is the most common solution.
        </p>
        <p>
          <strong>3. Restructure:</strong> Rearrange your code so the value is only used
          once. Often the cleanest solution.
        </p>
      </NoteBlock>

      <h2>Move Semantics with Structs</h2>

      <PythonRustCompare
        title="Passing structs to functions"
        description="In Python, passing an object to a function shares it. In Rust, it moves unless you borrow."
        pythonCode={`class User:
    def __init__(self, name):
        self.name = name

def greet(user):
    print(f"Hello, {user.name}")

u = User("Alice")
greet(u)
greet(u)  # works fine — u is still valid
print(u.name)  # still valid`}
        rustCode={`struct User {
    name: String,
}

fn greet(user: User) {
    println!("Hello, {}", user.name);
} // user is dropped here!

fn main() {
    let u = User { name: String::from("Alice") };
    greet(u);
    // greet(u); // ERROR: u was moved!
    // Fix: fn greet(user: &User) to borrow
}`}
      />

      <ExerciseBlock
        title="Track the Moves"
        difficulty="beginner"
        problem={`Read the following Rust code and determine which lines would cause
a compiler error. Explain why each error occurs and suggest a fix.

let a = String::from("hello");
let b = a;
let c = a;

let mut names = vec![String::from("Alice"), String::from("Bob")];
let first = names[0];
println!("{:?}", names);`}
        solution={`Line 3 (let c = a) is an error:
  "use of moved value: a" — ownership moved to b on line 2.
  Fix: let c = b.clone(); or let c = a.clone(); on line 2.

Line 5 (let first = names[0]) is an error:
  "cannot move out of index of Vec<String>" — moving out of a
  Vec element would leave a "hole" in the vector.
  Fix: let first = &names[0]; (borrow instead of move)
  Or: let first = names[0].clone(); (clone the element)
  Or: let first = names.remove(0); (take it out of the vec)`}
      />

      <ExerciseBlock
        title="Fix the Function"
        difficulty="easy"
        problem={`This code does not compile. Fix it so that the message can be used
after calling send_message:

fn send_message(msg: String) {
    println!("Sending: {}", msg);
}

fn main() {
    let msg = String::from("Hello, world!");
    send_message(msg);
    println!("Sent: {}", msg); // ERROR: value used after move
}`}
        solution={`// Solution 1: Borrow (preferred)
fn send_message(msg: &str) {
    println!("Sending: {}", msg);
}

fn main() {
    let msg = String::from("Hello, world!");
    send_message(&msg);        // pass a reference
    println!("Sent: {}", msg); // msg is still valid
}

// Solution 2: Clone
fn send_message_v2(msg: String) {
    println!("Sending: {}", msg);
}

fn main() {
    let msg = String::from("Hello, world!");
    send_message_v2(msg.clone()); // pass a clone
    println!("Sent: {}", msg);    // original still valid
}

// Solution 3: Return ownership back
fn send_message_v3(msg: String) -> String {
    println!("Sending: {}", msg);
    msg // return ownership to the caller
}

fn main() {
    let msg = String::from("Hello, world!");
    let msg = send_message_v3(msg); // get ownership back
    println!("Sent: {}", msg);
}`}
      />
    </div>
  );
};

export default MoveSemantics;
