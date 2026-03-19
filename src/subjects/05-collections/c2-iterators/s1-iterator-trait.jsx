import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function IteratorTrait() {
  return (
    <div className="prose-rust">
      <h1>Iterator Trait &amp; next()</h1>

      <p>
        Python's iterator protocol (<code>__iter__</code> and
        <code>__next__</code>) and generators are central to the language.
        Rust's <code>Iterator</code> trait serves the same purpose, but with
        zero-cost abstractions: iterator chains compile down to tight loops
        with no heap allocation and no virtual dispatch.
      </p>

      <ConceptBlock title="The Iterator Trait">
        <p>
          Rust's <code>Iterator</code> trait requires implementing a single
          method: <code>next(&amp;mut self) -&gt; Option&lt;Self::Item&gt;</code>.
          Return <code>Some(value)</code> for each element, and <code>None</code>
          when the iterator is exhausted. That is it — from this one method,
          you get dozens of adapter methods (map, filter, fold, zip, etc.)
          for free.
        </p>
      </ConceptBlock>

      <h2>Python Iterators vs Rust Iterators</h2>

      <PythonRustCompare
        title="The iterator protocol"
        description="Both languages use the same core concept: a next() method that signals exhaustion."
        pythonCode={`class Countdown:
    def __init__(self, start: int):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self) -> int:
        if self.current <= 0:
            raise StopIteration
        val = self.current
        self.current -= 1
        return val

# Usage
for n in Countdown(5):
    print(n)  # 5, 4, 3, 2, 1

# Manual iteration
it = iter(Countdown(3))
print(next(it))  # 3
print(next(it))  # 2
print(next(it))  # 1
# next(it)       # raises StopIteration`}
        rustCode={`struct Countdown {
    current: u32,
}

impl Countdown {
    fn new(start: u32) -> Self {
        Countdown { current: start }
    }
}

impl Iterator for Countdown {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.current == 0 {
            None
        } else {
            let val = self.current;
            self.current -= 1;
            Some(val)
        }
    }
}

fn main() {
    // Usage
    for n in Countdown::new(5) {
        println!("{}", n);  // 5, 4, 3, 2, 1
    }

    // Manual iteration
    let mut it = Countdown::new(3);
    println!("{:?}", it.next());  // Some(3)
    println!("{:?}", it.next());  // Some(2)
    println!("{:?}", it.next());  // Some(1)
    println!("{:?}", it.next());  // None
}`}
      />

      <NoteBlock title="Option vs StopIteration" type="pythonista">
        <p>
          Python uses an exception (<code>StopIteration</code>) to signal
          the end of iteration — a control flow mechanism disguised as an
          error. Rust uses <code>Option</code>: <code>Some(value)</code>
          means "here is the next element," <code>None</code> means "done."
          No exception overhead, no hidden control flow.
        </p>
      </NoteBlock>

      <h2>Built-in Iterators</h2>

      <CodeBlock
        language="rust"
        title="Sources of iterators in the standard library"
        code={`fn main() {
    // Ranges
    let range_iter = 0..5;           // 0, 1, 2, 3, 4
    let inclusive = 0..=5;           // 0, 1, 2, 3, 4, 5

    // Collections
    let v = vec![10, 20, 30];
    let vec_iter = v.iter();         // borrows: &T
    // v.iter_mut()                  // mutable borrows: &mut T
    // v.into_iter()                 // owned values: T (consumes vec)

    // Strings
    let char_iter = "hello".chars(); // 'h', 'e', 'l', 'l', 'o'
    let byte_iter = "hello".bytes(); // 104, 101, 108, 108, 111

    // Splitting
    let split_iter = "a,b,c".split(',');  // "a", "b", "c"
    let lines_iter = "line1\nline2".lines();

    // Repeating
    let repeat = std::iter::repeat(42);   // infinite: 42, 42, 42, ...
    let once = std::iter::once(99);        // single element

    // Consuming into a collection
    let collected: Vec<i32> = (1..=5).collect();
    println!("{:?}", collected);  // [1, 2, 3, 4, 5]
}`}
      />

      <h2>Laziness: Iterators Don't Run Until Consumed</h2>

      <PythonRustCompare
        title="Lazy evaluation"
        description="Both Python generators and Rust iterators are lazy — they produce values on demand."
        pythonCode={`# Python generators are lazy
def expensive():
    print("Computing...")
    for i in range(1_000_000):
        yield i * 2

# Nothing happens yet
gen = expensive()

# Values computed on demand
first = next(gen)     # prints "Computing...", returns 0
second = next(gen)    # returns 2 (no print)

# Take first 3 — only computes 3 values
from itertools import islice
first_3 = list(islice(expensive(), 3))
# prints "Computing...", returns [0, 2, 4]`}
        rustCode={`fn main() {
    // Rust iterators are lazy — no work until consumed
    let iter = (0..1_000_000)
        .map(|i| {
            // This closure is NOT called yet
            i * 2
        })
        .filter(|&x| x > 100);

    // Nothing has been computed!

    // .take(3) limits to first 3 matches
    let first_3: Vec<i32> = iter.take(3).collect();
    println!("{:?}", first_3);  // [102, 104, 106]
    // Only computed 54 elements (0..53), not 1 million!

    // Consuming adaptors trigger computation:
    // .collect()  — gather into a collection
    // .sum()      — add all values
    // .count()    — count elements
    // .for_each() — run a side effect
    // .any() / .all() — boolean checks (short-circuit)

    let sum: i32 = (1..=100).sum();
    println!("Sum 1..100: {}", sum);  // 5050
}`}
      />

      <NoteBlock title="Zero-cost abstraction" type="note">
        <p>
          Rust's iterator chains compile to the same machine code as a
          hand-written loop. The compiler sees through <code>.map().filter().take()</code>
          and fuses them into a single loop with no intermediate allocations.
          This is fundamentally different from Python, where each generator
          has function-call overhead.
        </p>
      </NoteBlock>

      <h2>Collecting into Different Types</h2>

      <CodeBlock
        language="rust"
        title="collect() is polymorphic"
        code={`use std::collections::{HashMap, HashSet, BTreeSet, VecDeque};

fn main() {
    let data = vec![3, 1, 4, 1, 5, 9, 2, 6, 5, 3];

    // Into Vec
    let vec: Vec<i32> = data.iter().copied().collect();

    // Into HashSet (deduplicates)
    let set: HashSet<i32> = data.iter().copied().collect();
    println!("Unique: {:?}", set);  // {1, 2, 3, 4, 5, 6, 9}

    // Into BTreeSet (sorted + deduped)
    let sorted: BTreeSet<i32> = data.iter().copied().collect();
    println!("Sorted: {:?}", sorted);  // {1, 2, 3, 4, 5, 6, 9}

    // Into String
    let s: String = ['H', 'e', 'l', 'l', 'o'].iter().collect();
    println!("{}", s);  // Hello

    // Into HashMap from tuples
    let map: HashMap<&str, i32> = vec![("a", 1), ("b", 2)]
        .into_iter()
        .collect();

    // Into Result<Vec<_>, _> — fails on first error
    let results: Vec<Result<i32, _>> = vec![
        "1".parse::<i32>(), "2".parse(), "oops".parse()
    ];
    let collected: Result<Vec<i32>, _> = results.into_iter().collect();
    println!("{:?}", collected);  // Err(invalid digit)
}`}
      />

      <ExerciseBlock
        title="Fibonacci iterator"
        difficulty="medium"
        problem={`Implement a Fibonacci iterator that yields the Fibonacci sequence:
0, 1, 1, 2, 3, 5, 8, 13, 21, ...

Create a struct Fibonacci with two fields (current and next pair).
Implement Iterator with Item = u64.

Then use your iterator to:
1. Print the first 10 Fibonacci numbers
2. Find the first Fibonacci number greater than 1000
3. Sum the first 20 Fibonacci numbers`}
        solution={`struct Fibonacci {
    a: u64,
    b: u64,
}

impl Fibonacci {
    fn new() -> Self {
        Fibonacci { a: 0, b: 1 }
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let current = self.a;
        let new_next = self.a + self.b;
        self.a = self.b;
        self.b = new_next;
        Some(current)  // infinite iterator — always returns Some
    }
}

fn main() {
    // First 10 Fibonacci numbers
    let first_10: Vec<u64> = Fibonacci::new().take(10).collect();
    println!("First 10: {:?}", first_10);
    // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

    // First Fibonacci number > 1000
    let big = Fibonacci::new().find(|&n| n > 1000);
    println!("First > 1000: {:?}", big);
    // Some(1597)

    // Sum of first 20
    let sum: u64 = Fibonacci::new().take(20).sum();
    println!("Sum of first 20: {}", sum);
    // 10945
}`}
      />
    </div>
  );
}
