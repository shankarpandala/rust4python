import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const BorrowChecker = () => {
  return (
    <div className="prose-rust">
      <h1>The Borrow Checker</h1>

      <p>
        The borrow checker is Rust's compile-time system that enforces ownership and
        borrowing rules. It's the part of the compiler that produces "cannot borrow,"
        "value used after move," and "does not live long enough" errors. Learning to
        read and fix these errors is the most important practical skill for new Rust
        developers.
      </p>

      <ConceptBlock title="What the Borrow Checker Verifies">
        <p>
          For every reference in your program, the borrow checker verifies:
        </p>
        <ol>
          <li>The referenced data is not moved or dropped while the reference exists.</li>
          <li>If a mutable reference exists, no other references (mutable or immutable) to the same data are active.</li>
          <li>References do not outlive the data they point to.</li>
          <li>You do not modify data through an immutable reference.</li>
        </ol>
        <p>
          All of this happens at compile time with zero runtime cost.
        </p>
      </ConceptBlock>

      <NoteBlock type="pythonista" title="Python has no borrow checker">
        <p>
          Python lets you create references freely and mutate anything at any time.
          The bugs that the borrow checker prevents — iterator invalidation, data races,
          use-after-free — either cause silent corruption or require defensive programming
          (deep copies, locks, careful documentation) in Python. Rust's approach trades
          compile-time friction for runtime safety.
        </p>
      </NoteBlock>

      <h2>Error 1: "Cannot borrow as mutable because also borrowed as immutable"</h2>

      <p>This is the most common borrow checker error. It means you're trying to
        modify data while a read-only reference to it still exists.</p>

      <CodeBlock
        language="rust"
        title="The classic aliasing conflict"
        code={`fn main() {
    let mut items = vec![String::from("a"), String::from("b")];

    // ERROR version:
    // let first = &items[0];     // immutable borrow
    // items.push(String::from("c")); // mutable borrow — CONFLICT
    // println!("{}", first);     // immutable borrow still in use

    // WHY this is an error:
    // push() might reallocate the Vec's buffer, which would
    // invalidate 'first' (it points into the old buffer).
    // This is exactly the bug C++ has with iterator invalidation.

    // Fix 1: Use the reference before mutating
    let first = &items[0];
    println!("{}", first);        // last use of 'first'
    items.push(String::from("c")); // now OK

    // Fix 2: Copy/clone the value out
    let first_owned = items[0].clone(); // independent copy
    items.push(String::from("d"));
    println!("{}", first_owned);  // works — it's a separate String

    // Fix 3: Restructure with index
    let first_idx = 0;            // store the index, not a reference
    items.push(String::from("e"));
    println!("{}", items[first_idx]); // re-borrow after mutation
}`}
      />

      <h2>Error 2: "Cannot move out of borrowed content"</h2>

      <CodeBlock
        language="rust"
        title="Moving out of a reference is not allowed"
        code={`fn main() {
    let names = vec![String::from("Alice"), String::from("Bob")];

    // ERROR: cannot move out of index of Vec<String>
    // let first = names[0]; // This would leave a "hole" in the Vec

    // Fix 1: Borrow instead
    let first = &names[0];
    println!("{}", first);

    // Fix 2: Clone
    let first_owned = names[0].clone();
    println!("{}", first_owned);

    // Fix 3: Remove from the collection (if you own it and it's mutable)
    let mut names2 = vec![String::from("Carol"), String::from("Dave")];
    let first = names2.remove(0); // takes it out of the Vec
    println!("{}", first); // "Carol"
    println!("{:?}", names2); // ["Dave"]

    // Fix 4: swap_remove (O(1) but changes order)
    let mut names3 = vec![String::from("Eve"), String::from("Frank")];
    let first = names3.swap_remove(0);
    println!("{}", first); // "Eve"
}`}
      />

      <h2>Error 3: "Does not live long enough"</h2>

      <CodeBlock
        language="rust"
        title="Reference outlives the data it borrows"
        code={`// ERROR: dangling reference
// fn get_greeting() -> &str {
//     let s = String::from("hello");
//     &s  // 's' is dropped when the function returns,
//         // but we're trying to return a reference to it!
// }

// Fix 1: Return the owned value
fn get_greeting() -> String {
    let s = String::from("hello");
    s  // move ownership to the caller
}

// Fix 2: Take a reference as input (borrow from caller)
fn get_first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[..i];
        }
    }
    s
}

fn main() {
    let greeting = get_greeting();
    println!("{}", greeting);

    let sentence = String::from("hello world");
    let word = get_first_word(&sentence);
    println!("{}", word); // "hello"
}`}
      />

      <h2>Error 4: "Cannot borrow as mutable more than once"</h2>

      <CodeBlock
        language="rust"
        title="Two mutable references to the same data"
        code={`fn main() {
    let mut data = vec![1, 2, 3, 4, 5];

    // ERROR: two mutable borrows at the same time
    // let left = &mut data[..2];
    // let right = &mut data[3..];
    // left[0] = 10;  // using both mutable refs
    // right[0] = 40;

    // Fix: Use split_at_mut — Rust provides safe APIs for this pattern
    let (left, right) = data.split_at_mut(3);
    left[0] = 10;
    right[0] = 40;  // right[0] is data[3]
    println!("{:?}", data); // [10, 2, 3, 40, 5]

    // Why split_at_mut works: the compiler can prove the two
    // slices don't overlap, so it allows two &mut borrows.
}`}
      />

      <NoteBlock type="tip" title="The borrow checker is your pair programmer">
        <p>
          Every borrow checker error corresponds to a real bug that could occur at
          runtime. When you get an error, don't think "how do I trick the compiler."
          Think "what bug is the compiler preventing?" Then choose the fix that makes
          your code genuinely correct.
        </p>
      </NoteBlock>

      <h2>Strategies for Working with the Borrow Checker</h2>

      <ConceptBlock title="Five Strategies When the Borrow Checker Complains">
        <ul>
          <li>
            <strong>1. Reduce scope of borrows.</strong> Use values immediately rather
            than storing references in long-lived variables. Let borrows end before
            you need to mutate.
          </li>
          <li>
            <strong>2. Clone when cheap.</strong> For small data or infrequent operations,
            <code>.clone()</code> eliminates borrow conflicts entirely. Don't optimize
            prematurely.
          </li>
          <li>
            <strong>3. Use indices instead of references.</strong> Store an index into a
            collection instead of a reference. Re-index when you need the value.
          </li>
          <li>
            <strong>4. Restructure ownership.</strong> Sometimes the cleanest fix is to
            rethink who owns what. Can you split data into separate structs?
          </li>
          <li>
            <strong>5. Use interior mutability.</strong> Types like <code>RefCell</code>,
            <code>Cell</code>, and <code>Mutex</code> move borrow checking to runtime.
            Use sparingly — they're the escape hatch, not the default.
          </li>
        </ul>
      </ConceptBlock>

      <h2>When to Restructure vs When to Clone</h2>

      <PythonRustCompare
        title="A common borrow checker scenario"
        description="In Python, you can read and write freely. In Rust, you may need to restructure the code."
        pythonCode={`class Cache:
    def __init__(self):
        self.data = {}

    def get_or_compute(self, key):
        if key not in self.data:
            # Read AND write self.data freely
            value = expensive_compute(key)
            self.data[key] = value
        return self.data[key]

# This works in Python because there's
# no borrow checking — but in concurrent
# code, this is a data race waiting to
# happen.`}
        rustCode={`use std::collections::HashMap;

struct Cache {
    data: HashMap<String, String>,
}

impl Cache {
    fn get_or_compute(&mut self, key: &str) -> &str {
        // Can't borrow self.data immutably (to check)
        // AND mutably (to insert) at the same time.

        // Solution: use entry API
        self.data.entry(key.to_string())
            .or_insert_with(|| expensive_compute(key))
    }
}

fn expensive_compute(key: &str) -> String {
    format!("computed_{}", key)
}`}
      />

      <CodeBlock
        language="rust"
        title="Real-world pattern: processing items in a struct"
        code={`struct Processor {
    items: Vec<String>,
    log: Vec<String>,
}

impl Processor {
    // BAD: tries to borrow self immutably (items) and mutably (log)
    // fn process_bad(&mut self) {
    //     for item in &self.items {       // immutable borrow of self
    //         self.log.push(item.clone()); // mutable borrow of self — ERROR
    //     }
    // }

    // GOOD: borrow individual fields, not all of self
    fn process(&mut self) {
        for item in &self.items {
            self.log.push(item.clone());
        }
        // This actually works! Rust is smart enough to see that
        // &self.items and &mut self.log borrow DIFFERENT fields.
        // This is called "split borrowing."
    }

    // If split borrowing doesn't work, collect first:
    fn process_v2(&mut self) {
        let items_copy: Vec<String> = self.items.clone();
        for item in items_copy {
            self.log.push(item);
        }
    }
}

fn main() {
    let mut p = Processor {
        items: vec![String::from("a"), String::from("b")],
        log: vec![],
    };
    p.process();
    println!("{:?}", p.log); // ["a", "b"]
}`}
      />

      <NoteBlock type="note" title="Split borrowing of struct fields">
        <p>
          Rust allows borrowing different fields of a struct independently. If you borrow
          <code>&self.items</code> immutably and <code>&mut self.log</code> mutably, the
          compiler sees these as non-overlapping borrows and allows it. This only works
          when the compiler can see the individual field access — it does not work through
          method calls that take <code>&self</code> or <code>&mut self</code>.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Diagnose and Fix"
        difficulty="medium"
        problem={`This function tries to remove duplicates from a vector in place.
It does not compile. Identify the borrow checker error and fix it.

fn remove_duplicates(items: &mut Vec<String>) {
    let mut seen = std::collections::HashSet::new();
    let mut i = 0;
    while i < items.len() {
        if seen.contains(&items[i]) {
            items.remove(i);
        } else {
            seen.insert(&items[i]);
            i += 1;
        }
    }
}

Hint: think about what 'seen' is holding references to.`}
        solution={`// The problem: 'seen' holds references to elements inside 'items'.
// When we call items.remove(i), we mutably borrow items — but
// seen still holds immutable references into it. Conflict!

// Fix: store owned values in the HashSet instead of references
fn remove_duplicates(items: &mut Vec<String>) {
    let mut seen = std::collections::HashSet::new();
    let mut i = 0;
    while i < items.len() {
        if seen.contains(&items[i]) {
            items.remove(i);
        } else {
            seen.insert(items[i].clone()); // clone into the set
            i += 1;
        }
    }
}

// Alternative: functional approach (rebuild the vec)
fn remove_duplicates_v2(items: &mut Vec<String>) {
    let mut seen = std::collections::HashSet::new();
    items.retain(|item| seen.insert(item.clone()));
}

fn main() {
    let mut data = vec![
        String::from("a"), String::from("b"),
        String::from("a"), String::from("c"),
        String::from("b"),
    ];
    remove_duplicates(&mut data);
    println!("{:?}", data); // ["a", "b", "c"]
}`}
      />

      <ExerciseBlock
        title="Borrow Checker Quiz"
        difficulty="medium"
        problem={`For each code snippet, state whether it compiles and why:

// Snippet A
let mut v = vec![1, 2, 3];
let r = &v;
println!("{:?}", r);
v.push(4);

// Snippet B
let mut v = vec![1, 2, 3];
let r = &v;
v.push(4);
println!("{:?}", r);

// Snippet C
let mut v = vec![1, 2, 3];
let r = &v[0];
let val = *r;
v.push(4);
println!("{}", val);

// Snippet D
let mut s = String::from("hello");
let r1 = &s;
let r2 = &s;
println!("{} {}", r1, r2);
let r3 = &mut s;
r3.push_str(" world");`}
        solution={`// Snippet A: COMPILES
// r's last use is println, which comes BEFORE v.push(4).
// The immutable borrow ends at println, so push is fine.

// Snippet B: DOES NOT COMPILE
// r is used in println AFTER v.push(4).
// The immutable borrow (r) and mutable borrow (push) overlap.

// Snippet C: COMPILES
// r borrows v[0] immutably. *r copies the i32 (Copy type) into val.
// After 'let val = *r', r is no longer used. v.push(4) is fine.
// val is an independent copy, not a reference.

// Snippet D: COMPILES
// r1 and r2 are immutable borrows, both last used in println.
// After println, both borrows end. r3 is a mutable borrow that
// starts after the immutable borrows are done. No conflict.`}
      />
    </div>
  );
};

export default BorrowChecker;
