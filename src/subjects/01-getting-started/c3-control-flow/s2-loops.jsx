import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Loops() {
  return (
    <div className="prose-rust">
      <h1>Loops</h1>

      <p>
        Rust has three kinds of loops: <code>loop</code> (infinite), <code>while</code>
        (conditional), and <code>for</code> (iterator-based). If you come from Python,
        the <code>for</code> loop will feel familiar, but Rust adds powerful features
        like loop labels, breaking with values, and explicit iterator methods that give
        you fine-grained control over how you traverse data.
      </p>

      <ConceptBlock title="Three Loop Types">
        <p>
          Python has two loop constructs: <code>for</code> and <code>while</code>.
          Rust adds a third: <code>loop</code>, which is an explicit infinite loop.
          This might seem unnecessary, but it is important because Rust can infer
          that <code>loop</code> always runs at least once, enabling the loop to return
          a value via <code>break</code>. Each loop type has a clear purpose:
        </p>
        <ul>
          <li><strong>loop</strong> — run forever until explicitly broken out of; can return a value</li>
          <li><strong>while</strong> — run while a condition is true</li>
          <li><strong>for</strong> — iterate over a collection or range</li>
        </ul>
      </ConceptBlock>

      <h2>The for Loop</h2>

      <PythonRustCompare
        title="For loop basics"
        description="Rust's for loop is very similar to Python's, iterating over anything that implements the Iterator trait."
        pythonCode={`# Python: for item in iterable
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Range-based
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Range with start, stop, step
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# Enumerate for index + value
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")`}
        rustCode={`fn main() {
    let fruits = vec!["apple", "banana", "cherry"];
    for fruit in &fruits {
        println!("{}", fruit);
    }

    // Range-based (.. is exclusive end)
    for i in 0..5 {
        println!("{}", i); // 0, 1, 2, 3, 4
    }

    // Inclusive range (..= includes end)
    for i in 1..=5 {
        println!("{}", i); // 1, 2, 3, 4, 5
    }

    // Step with .step_by()
    for i in (0..10).step_by(2) {
        println!("{}", i); // 0, 2, 4, 6, 8
    }

    // Enumerate for index + value
    for (i, fruit) in fruits.iter().enumerate() {
        println!("{}: {}", i, fruit);
    }
}`}
      />

      <NoteBlock type="pythonista" title="The & in 'for fruit in &fruits'">
        The <code>&amp;</code> borrows the vector instead of consuming it. Without it,
        <code>for fruit in fruits</code> would <em>move</em> the vector into the loop
        and you could not use <code>fruits</code> afterward. This is Rust's ownership
        system in action. When iterating, you almost always want <code>&amp;collection</code>
        (borrow) rather than <code>collection</code> (consume).
      </NoteBlock>

      <h2>while Loops</h2>

      <PythonRustCompare
        title="While loops"
        description="while loops are nearly identical in both languages."
        pythonCode={`# Python while loop
count = 0
while count < 5:
    print(count)
    count += 1

# While with break
total = 0
while True:
    total += 1
    if total >= 100:
        break

# While with continue
for i in range(10):
    if i % 3 == 0:
        continue
    print(i)  # 1, 2, 4, 5, 7, 8`}
        rustCode={`fn main() {
    // Rust while loop
    let mut count = 0;
    while count < 5 {
        println!("{}", count);
        count += 1;
    }

    // break and continue work the same
    let mut total = 0;
    while total < 100 {
        total += 1;
    }

    // continue to skip iterations
    for i in 0..10 {
        if i % 3 == 0 {
            continue;
        }
        println!("{}", i); // 1, 2, 4, 5, 7, 8
    }
}`}
      />

      <h2>loop — Infinite Loops with Superpowers</h2>

      <p>
        Rust's <code>loop</code> keyword creates an infinite loop, similar to Python's
        <code>while True</code>. But <code>loop</code> has a unique superpower: you
        can <code>break</code> with a value, turning the loop into an expression.
      </p>

      <CodeBlock
        language="rust"
        title="loop with break values"
        code={`fn main() {
    // Basic infinite loop
    let mut counter = 0;
    loop {
        counter += 1;
        if counter >= 5 {
            break;
        }
    }
    println!("Counter: {}", counter);

    // loop as an expression — break returns a value
    let mut attempts = 0;
    let result = loop {
        attempts += 1;
        if attempts * attempts >= 50 {
            break attempts; // this value is assigned to 'result'
        }
    };
    println!("Took {} attempts", result); // 8

    // Practical example: retry logic
    let mut retries = 0;
    let data = loop {
        retries += 1;
        let success = retries >= 3; // simulate flaky operation
        if success {
            break format!("Got data after {} tries", retries);
        }
        if retries >= 10 {
            break String::from("Failed after max retries");
        }
    };
    println!("{}", data);
}`}
      />

      <NoteBlock type="tip" title="When to use each loop type">
        Use <code>for</code> when iterating over a collection or range (most common).
        Use <code>while</code> when looping based on a condition. Use <code>loop</code>
        when you need an infinite loop or want to break with a value. In practice,
        <code>for</code> handles 90% of cases, just like in Python.
      </NoteBlock>

      <h2>Loop Labels</h2>

      <p>
        Rust lets you label loops and <code>break</code> or <code>continue</code>
        specific outer loops from inside nested loops. Python has no equivalent — you
        would need flags or functions to break out of nested loops.
      </p>

      <CodeBlock
        language="rust"
        title="Loop labels for nested loop control"
        code={`fn main() {
    // Label a loop with 'name:
    'outer: for i in 0..5 {
        for j in 0..5 {
            if i + j > 4 {
                println!("Breaking outer at i={}, j={}", i, j);
                break 'outer; // breaks the OUTER loop
            }
            println!("  i={}, j={}", i, j);
        }
    }

    // Continue an outer loop
    'rows: for row in 0..3 {
        for col in 0..3 {
            if col == 1 {
                continue 'rows; // skip to next row
            }
            println!("({}, {})", row, col);
        }
    }
    // Output: (0,0), (1,0), (2,0)

    // Break outer loop with a value
    let result = 'search: loop {
        for i in 0..100 {
            if i * i > 200 {
                break 'search i;
            }
        }
        break 'search -1; // fallback
    };
    println!("First i where i^2 > 200: {}", result); // 15
}`}
      />

      <h2>Iterators: iter(), iter_mut(), into_iter()</h2>

      <p>
        Rust gives you three ways to iterate over a collection, each with different
        ownership semantics. This is unique to Rust and directly tied to the ownership system.
      </p>

      <CodeBlock
        language="rust"
        title="Three iteration methods"
        code={`fn main() {
    let mut numbers = vec![1, 2, 3, 4, 5];

    // .iter() — borrows each element (&T)
    // Collection is NOT consumed; elements are read-only
    for n in numbers.iter() {
        println!("Borrowed: {}", n);
    }
    println!("Vec still usable: {:?}", numbers);

    // .iter_mut() — mutably borrows each element (&mut T)
    // Collection is NOT consumed; elements can be modified
    for n in numbers.iter_mut() {
        *n *= 2; // double each element in place
    }
    println!("Doubled: {:?}", numbers); // [2, 4, 6, 8, 10]

    // .into_iter() — takes ownership of each element (T)
    // Collection IS consumed; cannot use it afterward
    let names = vec!["Alice", "Bob", "Charlie"];
    for name in names.into_iter() {
        println!("Owned: {}", name);
    }
    // println!("{:?}", names); // ERROR: names was consumed

    // Shorthand equivalents:
    let v = vec![1, 2, 3];
    for x in &v { }        // same as v.iter()
    // for x in &mut v { } // same as v.iter_mut()
    for x in v { }         // same as v.into_iter()
    // v is consumed here
}`}
      />

      <NoteBlock type="pythonista" title="Python iteration is always by reference">
        In Python, <code>for item in my_list</code> gives you references to objects,
        and the list remains intact. Rust's <code>for item in vec</code> (without
        <code>&amp;</code>) <em>consumes</em> the vector. This is the ownership system:
        Rust needs to know who owns the data. Use <code>&amp;vec</code> for Python-like
        behavior, <code>&amp;mut vec</code> to modify in place, and plain <code>vec</code>
        to take ownership (rare in loops).
      </NoteBlock>

      <h2>Iterator Adaptors</h2>

      <CodeBlock
        language="rust"
        title="Chaining iterator methods (like Python's map/filter)"
        code={`fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Filter and collect — like Python's list comprehension
    let evens: Vec<i32> = numbers.iter()
        .filter(|&&n| n % 2 == 0)
        .cloned()
        .collect();
    println!("Evens: {:?}", evens); // [2, 4, 6, 8, 10]

    // Map — transform each element
    let squared: Vec<i32> = numbers.iter()
        .map(|&n| n * n)
        .collect();
    println!("Squared: {:?}", squared);

    // Chain multiple operations
    let result: i32 = numbers.iter()
        .filter(|&&n| n % 2 == 0)   // keep even numbers
        .map(|&n| n * n)            // square them
        .sum();                     // sum the results
    println!("Sum of even squares: {}", result); // 220

    // Equivalent Python:
    // result = sum(n**2 for n in numbers if n % 2 == 0)
}`}
      />

      <ExerciseBlock
        title="Loop Practice"
        difficulty="intermediate"
        problem={`Write a Rust program that:

1. Uses a \`for\` loop to find all prime numbers between 2 and 50.
   (Hint: for each candidate n, check if any number from 2 to sqrt(n) divides it evenly)

2. Uses a \`loop\` with break-value to find the first Fibonacci number greater than 1000.

3. Uses iterator methods (.filter(), .map(), .sum()) to compute the sum of squares of all odd numbers from 1 to 20.

4. Uses a labeled loop to find the first pair (i, j) where i*i + j*j == 100, searching i from 0..=10 and j from 0..=10.

Print the results of each.`}
        solution={`\`\`\`rust
fn main() {
    // 1. Prime numbers from 2 to 50
    print!("Primes: ");
    for n in 2..=50 {
        let mut is_prime = true;
        for d in 2..=((n as f64).sqrt() as i32) {
            if n % d == 0 {
                is_prime = false;
                break;
            }
        }
        if is_prime {
            print!("{} ", n);
        }
    }
    println!();
    // Primes: 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47

    // 2. First Fibonacci > 1000
    let fib = {
        let mut a: u64 = 0;
        let mut b: u64 = 1;
        loop {
            let next = a + b;
            a = b;
            b = next;
            if b > 1000 {
                break b;
            }
        }
    };
    println!("First Fibonacci > 1000: {}", fib); // 1597

    // 3. Sum of squares of odd numbers 1..=20
    let sum: i32 = (1..=20)
        .filter(|n| n % 2 != 0)
        .map(|n| n * n)
        .sum();
    println!("Sum of odd squares: {}", sum); // 1330

    // 4. Find i,j where i^2 + j^2 == 100
    let (ri, rj) = 'outer: {
        for i in 0..=10 {
            for j in 0..=10 {
                if i * i + j * j == 100 {
                    break 'outer (i, j);
                }
            }
        }
        (-1, -1) // not found
    };
    println!("i^2 + j^2 = 100: i={}, j={}", ri, rj); // i=6, j=8
}
\`\`\`

Key takeaways: loop-as-expression with break values is unique to Rust and very useful for search patterns. Iterator methods like .filter().map().sum() are Rust's equivalent of Python's generator expressions and list comprehensions.`}
      />
    </div>
  );
}
