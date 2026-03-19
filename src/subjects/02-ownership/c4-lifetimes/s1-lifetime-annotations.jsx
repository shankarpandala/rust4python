import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const LifetimeAnnotations = () => {
  return (
    <div className="prose-rust">
      <h1>Lifetime Annotations</h1>

      <p>
        Lifetimes are the part of Rust's ownership system that ensures references are
        always valid. They are Rust's answer to a problem Python developers never face
        because Python's garbage collector keeps objects alive as long as any reference
        exists. In Rust, there is no GC, so the compiler needs help understanding
        <em> how long</em> references are valid.
      </p>

      <ConceptBlock title="Why Lifetimes Exist">
        <p>
          Consider a function that returns a reference. The compiler needs to know: does
          the returned reference point to data from the first argument or the second? How
          long must the caller keep those arguments alive? Lifetime annotations answer these
          questions. They don't change how long data lives — they describe relationships
          between reference lifetimes so the compiler can verify safety.
        </p>
      </ConceptBlock>

      <h2>The Dangling Reference Problem</h2>

      <CodeBlock
        language="rust"
        title="What lifetimes prevent"
        code={`// This code will NOT compile — and that's a good thing.
// fn dangling() -> &str {
//     let s = String::from("hello");
//     &s  // ERROR: 's' is dropped when this function returns,
//         // creating a dangling reference
// }

// In C, this compiles and returns a pointer to freed memory.
// In Python, the GC would keep 's' alive. In Rust, the compiler
// catches it at compile time.

// Fix: return the owned value
fn not_dangling() -> String {
    let s = String::from("hello");
    s  // transfer ownership to the caller
}

fn main() {
    let s = not_dangling();
    println!("{}", s);
}`}
      />

      <NoteBlock type="pythonista" title="Why Python doesn't have lifetimes">
        <p>
          In Python, the garbage collector tracks every reference and keeps objects alive
          as long as any reference exists. This means you never encounter dangling references
          — but it costs runtime performance (reference counting, GC pauses). Rust's
          lifetimes achieve the same safety guarantee at compile time with zero runtime cost.
        </p>
      </NoteBlock>

      <h2>Lifetime Syntax: 'a</h2>

      <p>
        Lifetime annotations use an apostrophe followed by a short name, conventionally
        starting with <code>'a</code>. They appear in function signatures, struct definitions,
        and impl blocks.
      </p>

      <CodeBlock
        language="rust"
        title="Basic lifetime annotation syntax"
        code={`// This function takes two string references and returns one.
// The lifetime 'a tells the compiler: "the returned reference
// will be valid as long as BOTH inputs are valid."

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let string1 = String::from("long string");

    {
        let string2 = String::from("xyz");
        let result = longest(&string1, &string2);
        println!("Longest: {}", result); // OK: both strings are alive
    }
    // string2 is dropped here

    // This would NOT compile:
    // let result;
    // {
    //     let string2 = String::from("xyz");
    //     result = longest(&string1, &string2);
    // }
    // println!("{}", result); // ERROR: string2 already dropped
    //                         // but result might reference it
}`}
      />

      <h2>What Lifetimes Tell the Compiler</h2>

      <ConceptBlock title="Lifetimes Are Constraints, Not Commands">
        <p>
          Lifetime annotations do not change how long values live. They are
          <strong> constraints</strong> that the compiler checks:
        </p>
        <ul>
          <li>
            <code>fn longest&lt;'a&gt;(x: &'a str, y: &'a str) -&gt; &'a str</code> says:
            "the returned reference lives at most as long as the shorter of x and y."
          </li>
          <li>
            The compiler uses this to verify that callers don't use the return value after
            either input has been dropped.
          </li>
          <li>
            You're not telling Rust how long to keep data alive — you're telling it what
            guarantees to check.
          </li>
        </ul>
      </ConceptBlock>

      <CodeBlock
        language="rust"
        title="Understanding what lifetimes mean"
        code={`// The lifetime 'a means: "these references all share the same lifetime constraint"
// In practice: the return value's lifetime is the MINIMUM of all 'a references

// Only x's lifetime affects the output
fn first_of<'a>(x: &'a str, _y: &str) -> &'a str {
    x  // returned reference has the same lifetime as x
    // _y has no lifetime connection to the return value
}

// Different lifetimes for different relationships
fn pick_first<'a, 'b>(x: &'a str, _y: &'b str) -> &'a str {
    x  // returned reference tied to x's lifetime only
}

fn main() {
    let x = String::from("hello");
    let result;
    {
        let y = String::from("world");
        result = first_of(&x, &y);
        // Even though y is about to be dropped, this is fine
        // because the return value is tied to x's lifetime, not y's
    }
    println!("{}", result); // OK: x is still alive
}`}
      />

      <h2>Simple Examples</h2>

      <CodeBlock
        language="rust"
        title="Common patterns with lifetime annotations"
        code={`// Return a reference to part of the input
fn first_word<'a>(s: &'a str) -> &'a str {
    match s.find(' ') {
        Some(pos) => &s[..pos],
        None => s,
    }
}

// Return a reference to whichever condition matches
fn get_label<'a>(value: i32, positive: &'a str, negative: &'a str) -> &'a str {
    if value >= 0 { positive } else { negative }
}

// Return a reference to an element in a slice
fn find_item<'a>(items: &'a [String], target: &str) -> Option<&'a String> {
    items.iter().find(|item| item.as_str() == target)
}

fn main() {
    let sentence = String::from("hello world");
    let word = first_word(&sentence);
    println!("First word: {}", word);

    let label = get_label(-5, "positive", "negative");
    println!("Label: {}", label);

    let names = vec![String::from("Alice"), String::from("Bob")];
    if let Some(found) = find_item(&names, "Alice") {
        println!("Found: {}", found);
    }
}`}
      />

      <PythonRustCompare
        title="Returning references: Python vs Rust"
        description="Python never worries about reference validity. Rust requires lifetime annotations to guarantee it."
        pythonCode={`def longest(x, y):
    return x if len(x) > len(y) else y

# Python keeps everything alive via refcount
a = "long string"
b = "xyz"
result = longest(a, b)

# Even if we delete the originals,
# result stays valid
del a, b
print(result)  # "long string"
# The GC ensures the string lives on`}
        rustCode={`fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let a = String::from("long string");
    let b = String::from("xyz");
    let result = longest(&a, &b);

    // result is valid because both a and b
    // are still in scope
    println!("{}", result); // "long string"

    // The compiler ensures we don't use
    // result after a or b are dropped
}`}
      />

      <NoteBlock type="tip" title="You rarely need to write lifetimes">
        <p>
          Thanks to lifetime elision rules (covered in the next section), the compiler
          can infer lifetimes in most cases. You only need explicit annotations when a
          function takes multiple references and returns a reference — the compiler needs
          to know which input lifetime the output is tied to.
        </p>
      </NoteBlock>

      <h2>When Lifetimes Don't Help: Return Owned Data</h2>

      <CodeBlock
        language="rust"
        title="Sometimes the answer is to not use references"
        code={`// You CANNOT return a reference to data created inside the function
// fn make_greeting(name: &str) -> &str {
//     let greeting = format!("Hello, {}!", name);
//     &greeting  // ERROR: greeting is dropped when function returns
// }

// Solution: return an owned String
fn make_greeting(name: &str) -> String {
    format!("Hello, {}!", name)  // String is moved to the caller
}

// Rule of thumb:
// - If you're returning data that existed before your function was called,
//   you can return a reference (with a lifetime annotation).
// - If you're creating new data inside the function, return an owned value.

fn main() {
    let greeting = make_greeting("Alice");
    println!("{}", greeting);
}`}
      />

      <ExerciseBlock
        title="Add Lifetime Annotations"
        difficulty="easy"
        problem={`The following functions need lifetime annotations to compile. Add them:

fn get_shorter(a: &str, b: &str) -> &str {
    if a.len() <= b.len() { a } else { b }
}

fn first_element(items: &[String]) -> &String {
    &items[0]
}

fn identity(s: &str) -> &str {
    s
}`}
        solution={`// get_shorter: return could be either input, so both need 'a
fn get_shorter<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() <= b.len() { a } else { b }
}

// first_element: return borrows from the input slice
fn first_element<'a>(items: &'a [String]) -> &'a String {
    &items[0]
}

// identity: actually compiles WITHOUT annotations!
// Lifetime elision rule 1 handles this case:
// one input reference -> output gets the same lifetime
fn identity(s: &str) -> &str {
    s
}

// But you could write it explicitly:
// fn identity<'a>(s: &'a str) -> &'a str { s }`}
      />

      <ExerciseBlock
        title="Spot the Lifetime Error"
        difficulty="medium"
        problem={`Why does this code fail to compile? Fix it without removing the
inner scope.

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let result;
    let s1 = String::from("hello world");
    {
        let s2 = String::from("hi");
        result = longest(&s1, &s2);
    }
    println!("{}", result);
}`}
        solution={`// The problem: result might reference s2, which is dropped
// at the end of the inner scope. But result is used after
// the inner scope (in println!). The compiler rejects this.

// Fix 1: Use result inside the inner scope
fn main() {
    let s1 = String::from("hello world");
    {
        let s2 = String::from("hi");
        let result = longest(&s1, &s2);
        println!("{}", result); // used while both are alive
    }
}

// Fix 2: Move s2 to the outer scope
fn main() {
    let s1 = String::from("hello world");
    let s2 = String::from("hi");
    let result = longest(&s1, &s2);
    println!("{}", result);
}

// Fix 3: Clone to get an owned value (no lifetime issue)
fn main() {
    let s1 = String::from("hello world");
    let result;
    {
        let s2 = String::from("hi");
        result = longest(&s1, &s2).to_string(); // owned copy
    }
    println!("{}", result);
}`}
      />
    </div>
  );
};

export default LifetimeAnnotations;
