import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const MutableRefs = () => {
  return (
    <div className="prose-rust">
      <h1>Mutable References (&mut T)</h1>

      <p>
        Immutable references let you read data without taking ownership. But what if
        a function needs to <em>modify</em> data it doesn't own? That's what mutable
        references (<code>&mut T</code>) are for. They come with a strict rule that
        prevents an entire class of bugs: you can have <strong>only one</strong> mutable
        reference to a value at a time.
      </p>

      <ConceptBlock title="The Mutable Borrowing Rule">
        <p>
          At any given time, you can have <strong>either</strong>:
        </p>
        <ul>
          <li>Any number of immutable references (<code>&T</code>), OR</li>
          <li>Exactly one mutable reference (<code>&mut T</code>)</li>
        </ul>
        <p>
          Never both. This rule is checked at compile time and prevents data races,
          iterator invalidation, and aliasing bugs — all without any runtime cost.
        </p>
      </ConceptBlock>

      <h2>Creating Mutable References</h2>

      <CodeBlock
        language="rust"
        title="Using &mut to modify borrowed data"
        code={`fn add_greeting(s: &mut String) {
    s.push_str(", world!");
    // We can modify s because we have a mutable reference
}

fn main() {
    let mut greeting = String::from("hello");
    //  ^^^ the variable must be declared 'mut'

    add_greeting(&mut greeting);
    //           ^^^^ explicitly pass as mutable reference

    println!("{}", greeting); // "hello, world!"
}`}
      />

      <NoteBlock type="tip" title="Two 'mut' markers required">
        <p>
          Both the variable declaration (<code>let mut</code>) and the reference
          creation (<code>&mut</code>) must use <code>mut</code>. This is intentional:
          Rust wants you to be explicit about mutability at every step. If you see
          <code>&mut</code> in a function signature, you know immediately that the
          function will modify your data.
        </p>
      </NoteBlock>

      <PythonRustCompare
        title="Modifying data through a reference"
        description="Python lets any function mutate any mutable object passed to it. Rust requires explicit &mut to grant write access."
        pythonCode={`def process(items):
    # Python: no way to know from the
    # signature if this mutates 'items'
    items.append("new")
    items.sort()

data = ["c", "a", "b"]
process(data)
print(data)  # ['a', 'b', 'c', 'new']
# Was mutation intentional? Who knows!

# Defensive pattern: copy before calling
process(data.copy())
# But this is easy to forget.`}
        rustCode={`fn process(items: &mut Vec<String>) {
    // The &mut in the signature TELLS you
    // this function will modify items
    items.push(String::from("new"));
    items.sort();
}

fn main() {
    let mut data = vec![
        String::from("c"),
        String::from("a"),
        String::from("b"),
    ];
    process(&mut data);
    println!("{:?}", data);
    // ["a", "b", "c", "new"]
    // Mutation was explicit and intentional
}`}
      />

      <h2>Only One Mutable Reference at a Time</h2>

      <CodeBlock
        language="rust"
        title="The exclusive mutable borrow rule"
        code={`fn main() {
    let mut s = String::from("hello");

    let r1 = &mut s;
    // let r2 = &mut s; // ERROR: cannot borrow 's' as mutable
    //                   // more than once at a time

    r1.push_str(" world");
    println!("{}", r1);

    // After r1 is no longer used, we can create a new mutable reference
    let r2 = &mut s;  // OK: r1's borrow has ended
    r2.push_str("!");
    println!("{}", r2);
}`}
      />

      <ConceptBlock title="Why Only One &mut?">
        <p>
          If two mutable references existed simultaneously, two parts of your code could
          modify the same data at the same time. This causes:
        </p>
        <ul>
          <li>
            <strong>Data races</strong> in concurrent code (two threads writing
            simultaneously)
          </li>
          <li>
            <strong>Iterator invalidation</strong> (modifying a collection while iterating)
          </li>
          <li>
            <strong>Aliasing bugs</strong> (reading stale data while another reference
            is writing)
          </li>
        </ul>
        <p>
          Rust prevents all of these at compile time by enforcing exclusive access.
        </p>
      </ConceptBlock>

      <h2>Cannot Mix Immutable and Mutable References</h2>

      <CodeBlock
        language="rust"
        title="Immutable and mutable references cannot coexist"
        code={`fn main() {
    let mut data = vec![1, 2, 3];

    let first = &data[0];      // immutable borrow of data
    // data.push(4);           // ERROR: cannot borrow 'data' as mutable
    //                         // because it is also borrowed as immutable

    println!("first element: {}", first);
    // first's borrow ends here (last use)

    // NOW we can mutate — no more immutable borrows active
    data.push(4);              // OK
    println!("{:?}", data);    // [1, 2, 3, 4]
}`}
      />

      <NoteBlock type="pythonista" title="This prevents a real Python bug">
        <p>
          In Python, this is valid but dangerous:
        </p>
        <pre>
{`items = [1, 2, 3]
first = items[0]  # reads from items
items.clear()     # mutates items
print(first)      # 1 — OK for integers (they're copied)

# But with mutable objects it's a real problem:
matrix = [[1], [2], [3]]
row = matrix[0]   # reference to inner list
matrix.clear()    # destroy the matrix
row.append(99)    # row still works... or does it?`}
        </pre>
        <p>
          Rust prevents this at compile time. You cannot modify a collection while
          anyone is holding a reference into it.
        </p>
      </NoteBlock>

      <h2>Non-Lexical Lifetimes (NLL)</h2>

      <p>
        Modern Rust uses <strong>non-lexical lifetimes</strong>: a borrow ends at
        its last use, not at the end of its scope. This makes the borrow checker
        more flexible:
      </p>

      <CodeBlock
        language="rust"
        title="Borrows end at their last use"
        code={`fn main() {
    let mut s = String::from("hello");

    let r1 = &s;        // immutable borrow starts
    let r2 = &s;        // another immutable borrow — fine
    println!("{} {}", r1, r2);
    // r1 and r2 are never used again — their borrows end here

    let r3 = &mut s;    // mutable borrow starts — OK because
                        // r1 and r2 are no longer in use
    r3.push_str(" world");
    println!("{}", r3);
}`}
      />

      <h2>Common Patterns for Mutable Access</h2>

      <CodeBlock
        language="rust"
        title="Practical mutable reference patterns"
        code={`// Pattern 1: Modify and return
fn add_and_get_length(v: &mut Vec<i32>, item: i32) -> usize {
    v.push(item);
    v.len()
}

// Pattern 2: Conditional mutation
fn ensure_non_empty(v: &mut Vec<String>) {
    if v.is_empty() {
        v.push(String::from("default"));
    }
}

// Pattern 3: In-place transformation
fn normalize(values: &mut Vec<f64>) {
    let max = values.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    if max > 0.0 {
        for v in values.iter_mut() {
            *v /= max;
        }
    }
}

fn main() {
    let mut numbers = vec![1, 2, 3];
    let len = add_and_get_length(&mut numbers, 4);
    println!("{:?} (len={})", numbers, len);

    let mut names: Vec<String> = vec![];
    ensure_non_empty(&mut names);
    println!("{:?}", names); // ["default"]

    let mut data = vec![2.0, 4.0, 8.0];
    normalize(&mut data);
    println!("{:?}", data); // [0.25, 0.5, 1.0]
}`}
      />

      <NoteBlock type="warning" title="Mutable references and the self parameter">
        <p>
          In methods, <code>&mut self</code> borrows the struct mutably. While a method
          is running with <code>&mut self</code>, no other code can access the struct.
          This is the same rule as standalone mutable references, applied to method calls.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Fix the Mutable Borrow Error"
        difficulty="beginner"
        problem={`This code fails to compile. Fix it without cloning.

fn main() {
    let mut scores = vec![85, 92, 78, 95, 88];
    let highest = &scores[3];  // borrow the 4th element
    scores.push(100);          // try to add a new score
    println!("Highest was: {}", highest);
}`}
        solution={`// The problem: 'highest' borrows 'scores', but 'push' needs
// a mutable borrow. They can't coexist.

// Fix 1: Read the value (copy it) before mutating
fn main() {
    let mut scores = vec![85, 92, 78, 95, 88];
    let highest = scores[3]; // i32 is Copy — this copies the value
    scores.push(100);
    println!("Highest was: {}", highest);
}

// Fix 2: Finish using the reference before mutating
fn main() {
    let mut scores = vec![85, 92, 78, 95, 88];
    let highest = &scores[3];
    println!("Highest was: {}", highest); // last use of 'highest'
    scores.push(100); // OK — the immutable borrow ended
}

// Fix 3: Use a separate scope
fn main() {
    let mut scores = vec![85, 92, 78, 95, 88];
    {
        let highest = &scores[3];
        println!("Highest was: {}", highest);
    } // borrow ends
    scores.push(100);
}`}
      />

      <ExerciseBlock
        title="Build a Counter"
        difficulty="easy"
        problem={`Create a struct Counter with a count field (u32). Implement:
1. A new() method that starts at 0
2. An increment(&mut self) method
3. A value(&self) method that returns the count

Then show that you cannot call increment while holding a reference
from value() — and fix it.`}
        solution={`struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Self {
        Counter { count: 0 }
    }

    fn increment(&mut self) {
        self.count += 1;
    }

    fn value(&self) -> u32 {
        self.count  // returns a copy (u32 is Copy)
    }
}

fn main() {
    let mut c = Counter::new();

    // This would fail:
    // let val = &c;  // immutable borrow
    // c.increment(); // ERROR: can't mutate while borrowed
    // println!("{}", val.value());

    // Fix: use value() (which returns a Copy) before mutating
    let val = c.value();    // returns u32 (Copy) — no active borrow
    c.increment();          // mutable borrow — OK
    println!("was: {}, now: {}", val, c.value());
    // "was: 0, now: 1"
}`}
      />
    </div>
  );
};

export default MutableRefs;
