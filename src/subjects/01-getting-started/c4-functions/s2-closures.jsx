import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Closures() {
  return (
    <div className="prose-rust">
      <h1>Closures</h1>

      <p>
        Closures are anonymous functions that can capture variables from their surrounding
        scope. If you have used Python's <code>lambda</code> or passed functions to
        <code>map()</code>, <code>filter()</code>, and <code>sorted()</code>, you already
        understand the concept. Rust closures are more powerful than Python's lambdas:
        they can have multiple statements, capture variables by reference or by value,
        and the compiler infers their types.
      </p>

      <ConceptBlock title="Closures vs Functions">
        <p>
          A closure is a function-like value that can capture variables from the scope
          where it is defined. In Rust, closures use <code>|params| expression</code>
          syntax (pipes instead of parentheses). Unlike regular <code>fn</code> functions,
          closures can access local variables from their enclosing scope without passing
          them as parameters. The compiler infers parameter and return types from usage,
          so you rarely need type annotations.
        </p>
      </ConceptBlock>

      <h2>Basic Closure Syntax</h2>

      <PythonRustCompare
        title="Closure syntax"
        description="Rust closures use |args| body syntax. They are more capable than Python's single-expression lambdas."
        pythonCode={`# Python lambda: single expression only
square = lambda x: x * x
print(square(5))  # 25

# For multi-line, you need a def
def process(x):
    result = x * 2
    result += 1
    return result

print(process(5))  # 11

# Lambdas used with higher-order functions
numbers = [3, 1, 4, 1, 5, 9]
sorted_nums = sorted(numbers, key=lambda x: -x)
print(sorted_nums)  # [9, 5, 4, 3, 1, 1]

evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [4]`}
        rustCode={`fn main() {
    // Rust closure: can be multi-line
    let square = |x: i32| x * x;
    println!("{}", square(5)); // 25

    // Multi-statement closure with braces
    let process = |x: i32| {
        let result = x * 2;
        result + 1  // last expression = return
    };
    println!("{}", process(5)); // 11

    // Type inference — often no annotations
    let add = |a, b| a + b;
    println!("{}", add(3, 4)); // 7

    // With higher-order methods
    let mut numbers = vec![3, 1, 4, 1, 5, 9];
    numbers.sort_by_key(|&x| std::cmp::Reverse(x));
    println!("{:?}", numbers); // [9, 5, 4, 3, 1, 1]

    let evens: Vec<&i32> = numbers.iter()
        .filter(|&&x| x % 2 == 0)
        .collect();
    println!("{:?}", evens); // [4]
}`}
      />

      <NoteBlock type="pythonista" title="Closures are not limited to one expression">
        Python's <code>lambda</code> can only contain a single expression, which is why
        you often need to use <code>def</code> for anything complex. Rust closures have
        no such limitation — they can contain any number of statements, loops, match
        expressions, and more. They are full anonymous functions.
      </NoteBlock>

      <h2>Capturing Variables from the Environment</h2>

      <p>
        The defining feature of closures is their ability to capture variables from the
        enclosing scope. Rust gives you fine-grained control over how variables are
        captured, tied to the ownership system.
      </p>

      <CodeBlock
        language="rust"
        title="Closures capture variables from their environment"
        code={`fn main() {
    // Capture by immutable reference (most common)
    let name = String::from("Alice");
    let greet = || println!("Hello, {}!", name);
    greet();          // Hello, Alice!
    println!("{}", name); // name still usable

    // Capture by mutable reference
    let mut count = 0;
    let mut increment = || {
        count += 1;  // borrows count mutably
        println!("Count: {}", count);
    };
    increment(); // Count: 1
    increment(); // Count: 2
    // Can't use 'count' while 'increment' exists
    // and has a mutable borrow
    drop(increment); // explicitly drop the closure
    println!("Final count: {}", count); // 3... wait, 2

    // Capture by value with 'move'
    let data = vec![1, 2, 3];
    let print_data = move || {
        println!("{:?}", data); // data moved INTO closure
    };
    print_data(); // [1, 2, 3]
    // println!("{:?}", data); // ERROR: data was moved
}`}
      />

      <NoteBlock type="note" title="The three capture modes">
        Rust closures capture variables in three ways, and the compiler automatically
        picks the least restrictive mode:
        <ul>
          <li><strong>&amp;T (immutable borrow):</strong> closure reads but doesn't modify the variable</li>
          <li><strong>&amp;mut T (mutable borrow):</strong> closure modifies the variable</li>
          <li><strong>T (move/take ownership):</strong> closure takes ownership of the variable — use <code>move</code> keyword to force this</li>
        </ul>
      </NoteBlock>

      <h2>Closures as Function Arguments</h2>

      <p>
        Closures shine when passed to higher-order functions — functions that accept
        other functions as arguments. This is the Rust equivalent of Python's
        <code>map()</code>, <code>filter()</code>, <code>sorted(key=...)</code> pattern.
      </p>

      <PythonRustCompare
        title="Higher-order functions"
        description="Both languages pass functions/closures as arguments, but Rust's iterator methods are zero-cost."
        pythonCode={`# Python: pass functions to built-ins
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map
doubled = list(map(lambda x: x * 2, numbers))

# filter
evens = list(filter(lambda x: x % 2 == 0, numbers))

# sorted with key function
words = ["banana", "apple", "cherry"]
by_length = sorted(words, key=lambda w: len(w))

# Custom higher-order function
def apply_twice(f, x):
    return f(f(x))

result = apply_twice(lambda x: x + 1, 5)
print(result)  # 7`}
        rustCode={`fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // map
    let doubled: Vec<i32> = numbers.iter()
        .map(|&x| x * 2).collect();

    // filter
    let evens: Vec<&i32> = numbers.iter()
        .filter(|&&x| x % 2 == 0).collect();

    // sort with closure
    let mut words = vec!["banana", "apple", "cherry"];
    words.sort_by_key(|w| w.len());

    // Custom higher-order function
    fn apply_twice(f: impl Fn(i32) -> i32, x: i32) -> i32 {
        f(f(x))
    }

    let result = apply_twice(|x| x + 1, 5);
    println!("{}", result); // 7

    println!("{:?}", doubled);
    println!("{:?}", evens);
    println!("{:?}", words);
}`}
      />

      <h2>Closure Traits: Fn, FnMut, FnOnce</h2>

      <CodeBlock
        language="rust"
        title="The three closure traits"
        code={`// Fn — borrows captured values immutably
// Can be called multiple times, doesn't modify captures
fn apply_fn(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(x)
}

// FnMut — borrows captured values mutably
// Can be called multiple times, may modify captures
fn apply_n_times(mut f: impl FnMut(), n: usize) {
    for _ in 0..n {
        f();
    }
}

// FnOnce — takes ownership of captured values
// Can only be called once (consumes the closure)
fn consume(f: impl FnOnce() -> String) -> String {
    f()
}

fn main() {
    // Fn example
    let multiplier = 3;
    let triple = |x| x * multiplier; // borrows multiplier
    println!("{}", apply_fn(triple, 5)); // 15
    println!("{}", apply_fn(triple, 10)); // 30

    // FnMut example
    let mut total = 0;
    let mut accumulate = || { total += 1; };
    apply_n_times(&mut accumulate, 5);
    drop(accumulate);
    println!("Total: {}", total); // 5

    // FnOnce example
    let name = String::from("Alice");
    let make_greeting = move || {
        format!("Hello, {}!", name) // takes ownership of name
    };
    println!("{}", consume(make_greeting));
    // make_greeting can't be called again — it was consumed
}`}
      />

      <NoteBlock type="tip" title="Choosing Fn vs FnMut vs FnOnce">
        When writing functions that accept closures, prefer the least restrictive trait:
        use <code>Fn</code> when possible (most flexible for callers), <code>FnMut</code>
        if the closure needs to mutate state, and <code>FnOnce</code> only if it must
        consume captured values. In practice, most iterator methods use <code>FnMut</code>
        because it covers both Fn and mutating closures.
      </NoteBlock>

      <h2>Closures with Iterators — Practical Patterns</h2>

      <CodeBlock
        language="rust"
        title="Common closure + iterator patterns for data work"
        code={`fn main() {
    let data = vec![
        ("Alice", 92.0),
        ("Bob", 87.5),
        ("Charlie", 95.0),
        ("Diana", 78.0),
        ("Eve", 91.0),
    ];

    // Filter and transform
    let honor_roll: Vec<&str> = data.iter()
        .filter(|(_, score)| *score >= 90.0)
        .map(|(name, _)| *name)
        .collect();
    println!("Honor roll: {:?}", honor_roll);

    // Find first match
    let first_a = data.iter()
        .find(|(_, score)| *score >= 90.0);
    println!("First A student: {:?}", first_a);

    // Check conditions
    let all_passing = data.iter().all(|(_, s)| *s >= 60.0);
    let any_perfect = data.iter().any(|(_, s)| *s == 100.0);
    println!("All passing: {}, Any perfect: {}", all_passing, any_perfect);

    // Fold (reduce) — like Python's functools.reduce
    let total: f64 = data.iter()
        .map(|(_, score)| score)
        .fold(0.0, |acc, &s| acc + s);
    let average = total / data.len() as f64;
    println!("Average score: {:.1}", average);

    // Count with predicate
    let a_count = data.iter()
        .filter(|(_, s)| *s >= 90.0)
        .count();
    println!("Number of A grades: {}", a_count);
}`}
      />

      <ExerciseBlock
        title="Closure Practice"
        difficulty="intermediate"
        problem={`Write a Rust program that demonstrates closures:

1. Create a closure \`make_adder\` that takes an i32 and returns a closure that adds that number to its argument. Usage: \`let add5 = make_adder(5); println!("{}", add5(3));\` should print 8.

2. Given a Vec<String> of words, use iterator methods with closures to:
   a. Filter words longer than 4 characters
   b. Convert them to uppercase
   c. Collect into a new Vec<String>

3. Create a closure that captures a mutable Vec and provides a \`push\` operation. Use it to add 5 numbers, then print the vector.

4. Use .fold() with a closure to compute the product of all numbers in a vector [1, 2, 3, 4, 5].`}
        solution={`\`\`\`rust
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn main() {
    // 1. Closure factory
    let add5 = make_adder(5);
    let add10 = make_adder(10);
    println!("add5(3) = {}", add5(3));   // 8
    println!("add10(3) = {}", add10(3)); // 13

    // 2. Filter, transform, collect
    let words = vec![
        String::from("hi"),
        String::from("hello"),
        String::from("hey"),
        String::from("greetings"),
        String::from("yo"),
        String::from("welcome"),
    ];

    let long_upper: Vec<String> = words.iter()
        .filter(|w| w.len() > 4)
        .map(|w| w.to_uppercase())
        .collect();
    println!("Long words: {:?}", long_upper);
    // ["HELLO", "GREETINGS", "WELCOME"]

    // 3. Mutable capture
    let mut collected = Vec::new();
    {
        let mut push = |x: i32| collected.push(x);
        for i in 1..=5 {
            push(i * 10);
        }
    } // mutable borrow ends here
    println!("Collected: {:?}", collected);
    // [10, 20, 30, 40, 50]

    // 4. Fold to compute product
    let numbers = vec![1, 2, 3, 4, 5];
    let product = numbers.iter().fold(1, |acc, &x| acc * x);
    println!("Product: {}", product); // 120
}
\`\`\`

Key points: \`make_adder\` returns \`impl Fn(i32) -> i32\` and uses \`move\` to take ownership of \`n\`. The mutable capture in #3 requires a limited scope so the borrow ends before we print the vector. \`.fold()\` is Rust's equivalent of Python's \`functools.reduce()\`.`}
      />
    </div>
  );
}
