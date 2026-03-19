import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const ImmutableRefs = () => {
  return (
    <div className="prose-rust">
      <h1>Immutable References (&T)</h1>

      <p>
        Moving ownership every time you want to read a value would be impractical.
        Rust's solution is <strong>borrowing</strong>: you can create a reference to
        a value without taking ownership. The original owner keeps the value, and the
        borrower gets temporary read access.
      </p>

      <ConceptBlock title="Borrowing vs Owning">
        <p>
          Think of it like lending a book. When you lend a book to a friend, you still
          own it — they can read it, but they cannot sell it or throw it away. In Rust,
          a reference (<code>&T</code>) lets you "lend" a value: the borrower can read it
          but cannot drop it or move it. The owner retains responsibility for cleanup.
        </p>
      </ConceptBlock>

      <h2>Creating References with &</h2>

      <CodeBlock
        language="rust"
        title="The & operator creates a reference"
        code={`fn calculate_length(s: &String) -> usize {
    s.len()
    // s goes out of scope here, but since it doesn't own the String,
    // nothing is dropped. The caller still has the original.
}

fn main() {
    let greeting = String::from("hello");

    // Pass a REFERENCE, not the value itself
    let len = calculate_length(&greeting);

    // greeting is still valid — we only lent it
    println!("'{}' has {} characters", greeting, len);
}`}
      />

      <PythonRustCompare
        title="Passing data to functions"
        description="Python always passes references (to shared, mutable objects). Rust makes you choose: pass ownership or pass a reference."
        pythonCode={`def calculate_length(s):
    return len(s)
    # In Python, s is ALWAYS a reference
    # to the same object. No special syntax.

greeting = "hello"
length = calculate_length(greeting)
print(f"'{greeting}' has {length} chars")
# greeting is still valid — it was never
# "moved" because Python doesn't have moves

# But this means functions can secretly
# mutate your data:
def sneaky(lst):
    lst.append(999)  # modifies caller's list!

data = [1, 2, 3]
sneaky(data)
print(data)  # [1, 2, 3, 999] — surprise!`}
        rustCode={`fn calculate_length(s: &String) -> usize {
    s.len()
    // s is an immutable reference — it
    // CANNOT modify the String.
}

fn main() {
    let greeting = String::from("hello");
    let len = calculate_length(&greeting);
    println!("'{}' has {} chars", greeting, len);

    // Rust's references are explicit:
    // &greeting  = immutable borrow
    // &mut greeting = mutable borrow
    // greeting   = move (transfer ownership)
    // The type system enforces what each
    // function can do with your data.
}`}
      />

      <NoteBlock type="pythonista" title="In Python, everything is a reference">
        <p>
          Python developers already work with references all the time — every variable
          in Python <em>is</em> a reference to a heap object. The difference is that Python
          references are always mutable (you can call any method on them) and always shared
          (multiple variables can reference the same object). Rust's <code>&T</code> is
          more restrictive: it grants read-only access and the compiler tracks exactly who
          is borrowing what. This strictness prevents the "sneaky mutation" bugs shown above.
        </p>
      </NoteBlock>

      <h2>Multiple Immutable References Are Allowed</h2>

      <CodeBlock
        language="rust"
        title="You can have many &T references at once"
        code={`fn main() {
    let data = String::from("shared data");

    // Multiple immutable borrows — perfectly fine
    let r1 = &data;
    let r2 = &data;
    let r3 = &data;

    println!("{}", r1);
    println!("{}", r2);
    println!("{}", r3);
    println!("{}", data); // original still accessible too

    // Why is this safe? Because none of these references can
    // modify the data. Multiple readers, no writers = no conflicts.
}`}
      />

      <h2>References Don't Own the Data</h2>

      <ConceptBlock title="References Are Non-Owning">
        <p>
          A critical rule: references never own the data they point to. This means:
        </p>
        <ul>
          <li>When a reference goes out of scope, nothing is freed.</li>
          <li>The referenced data must live at least as long as the reference.</li>
          <li>You cannot return a reference to a local variable (it would dangle).</li>
        </ul>
      </ConceptBlock>

      <CodeBlock
        language="rust"
        title="A reference cannot outlive what it points to"
        code={`// This will NOT compile:
// fn dangling() -> &String {
//     let s = String::from("hello");
//     &s  // ERROR: s is dropped at the end of this function,
//         // but we're trying to return a reference to it!
// }

// Fix: return the owned value instead
fn not_dangling() -> String {
    let s = String::from("hello");
    s  // move the String out — caller takes ownership
}

fn main() {
    let s = not_dangling();
    println!("{}", s);
}`}
      />

      <NoteBlock type="tip" title="The compiler prevents dangling references">
        <p>
          In C/C++, returning a pointer to a local variable is a common bug that causes
          crashes. In Python, the garbage collector keeps the object alive as long as any
          reference exists. Rust takes a third approach: the compiler refuses to compile
          code that would create a dangling reference. You cannot have this bug.
        </p>
      </NoteBlock>

      <h2>&str vs String: References in Practice</h2>

      <CodeBlock
        language="rust"
        title="String ownership vs &str borrowing"
        code={`// Takes a reference to a string slice — most flexible
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    // String literals are &str (they live in the binary)
    let literal = "world";
    greet(literal);  // &str passed directly

    // String::from creates an owned String on the heap
    let owned = String::from("Alice");
    greet(&owned);   // &String auto-converts to &str

    // After the calls, both literal and owned are still valid
    println!("literal: {}", literal);
    println!("owned: {}", owned);

    // Rule of thumb: functions that only READ a string
    // should take &str, not String or &String
}`}
      />

      <h2>Immutable References Prevent Mutation</h2>

      <CodeBlock
        language="rust"
        title="You cannot modify through an immutable reference"
        code={`fn try_to_modify(s: &String) {
    // s.push_str(" world"); // ERROR: cannot borrow as mutable
    // An immutable reference grants read-only access.
    // This is enforced at compile time, not runtime.
    println!("I can read: {}", s);
}

fn main() {
    let greeting = String::from("hello");
    try_to_modify(&greeting);
    println!("{}", greeting); // still "hello"

    // Compare to Python where any function can mutate:
    // def try_to_modify(lst):
    //     lst.append("surprise!")  # Python allows this!
}`}
      />

      <NoteBlock type="pythonista" title="Rust's references solve a real Python problem">
        <p>
          A common Python bug: you pass a list or dict to a function, and the function
          modifies it unexpectedly. Defensive copying (<code>data.copy()</code>) is the
          usual workaround, but it's easy to forget. In Rust, if a function takes
          <code>&T</code>, the compiler <em>guarantees</em> it cannot modify your data.
          You get the safety of immutable data without the cost of copying.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Borrow, Don't Move"
        difficulty="beginner"
        problem={`Fix this code so it compiles. The function should read the vector
but not take ownership of it:

fn sum_values(numbers: Vec<i32>) -> i32 {
    let mut total = 0;
    for n in &numbers {
        total += n;
    }
    total
}

fn main() {
    let data = vec![10, 20, 30, 40];
    let total = sum_values(data);
    println!("Sum: {}", total);
    println!("Data: {:?}", data); // ERROR: data was moved
}`}
        solution={`// Change the function to take a reference:
fn sum_values(numbers: &Vec<i32>) -> i32 {
    let mut total = 0;
    for n in numbers {  // iterating &Vec<i32> yields &i32
        total += n;
    }
    total
}

fn main() {
    let data = vec![10, 20, 30, 40];
    let total = sum_values(&data);  // pass a reference
    println!("Sum: {}", total);
    println!("Data: {:?}", data);   // still valid!
}

// Even better: take a slice &[i32] instead of &Vec<i32>
// fn sum_values(numbers: &[i32]) -> i32 { ... }
// This works with Vec, arrays, and slices alike.`}
      />

      <ExerciseBlock
        title="Multiple Borrows"
        difficulty="easy"
        problem={`Write a function longest_word that takes two &str references and
returns the one that is longer (return &str). Then call it twice
with different combinations from three string variables, showing
that borrowing lets you use the same variables multiple times.`}
        solution={`fn longest_word<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

fn main() {
    let x = String::from("hello");
    let y = String::from("rust");
    let z = String::from("programming");

    // Borrow x and y — both remain valid
    let result1 = longest_word(&x, &y);
    println!("Longest of x,y: {}", result1);

    // Borrow x and z — x was already borrowed above, still valid
    let result2 = longest_word(&x, &z);
    println!("Longest of x,z: {}", result2);

    // All three originals still usable
    println!("{} {} {}", x, y, z);
}

// Note: the 'a lifetime annotation tells the compiler that
// the returned reference lives as long as both inputs.
// We'll cover lifetimes in detail in a later section.`}
      />
    </div>
  );
};

export default ImmutableRefs;
