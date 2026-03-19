import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Adapters() {
  return (
    <div className="prose-rust">
      <h1>Adapters: map, filter, fold, zip</h1>

      <p>
        Python has <code>map()</code>, <code>filter()</code>,
        <code>zip()</code>, and <code>functools.reduce()</code> as built-in
        or standard library functions. Rust has the same operations as
        methods on the <code>Iterator</code> trait — but they compile to
        zero-overhead loops and chain beautifully.
      </p>

      <ConceptBlock title="Adapters vs Consumers">
        <p>
          <strong>Adapters</strong> transform an iterator into another
          iterator (lazy): <code>map</code>, <code>filter</code>,
          <code>take</code>, <code>skip</code>, <code>zip</code>,
          <code>enumerate</code>, <code>chain</code>, <code>flatten</code>.
        </p>
        <p>
          <strong>Consumers</strong> drive the iterator to produce a result:
          <code>collect</code>, <code>sum</code>, <code>count</code>,
          <code>fold</code>, <code>any</code>, <code>all</code>,
          <code>find</code>, <code>for_each</code>.
        </p>
        <p>
          Nothing happens until a consumer is called.
        </p>
      </ConceptBlock>

      <h2>map and filter</h2>

      <PythonRustCompare
        title="Transform and filter"
        description="Python uses list comprehensions or builtins. Rust uses method chains."
        pythonCode={`numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# List comprehension (most Pythonic)
evens_doubled = [n * 2 for n in numbers if n % 2 == 0]
print(evens_doubled)  # [4, 8, 12, 16, 20]

# map + filter (less common in Python)
result = list(map(lambda n: n * 2,
                  filter(lambda n: n % 2 == 0, numbers)))

# Chaining with generators
result = (
    n * 2
    for n in numbers
    if n % 2 == 0
)
print(list(result))  # [4, 8, 12, 16, 20]`}
        rustCode={`fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Method chain (idiomatic Rust)
    let evens_doubled: Vec<i32> = numbers.iter()
        .filter(|&&n| n % 2 == 0)
        .map(|&n| n * 2)
        .collect();
    println!("{:?}", evens_doubled);  // [4, 8, 12, 16, 20]

    // filter_map: filter + map in one step
    let parsed: Vec<i32> = vec!["1", "abc", "3", "def", "5"]
        .iter()
        .filter_map(|s| s.parse().ok())
        .collect();
    println!("{:?}", parsed);  // [1, 3, 5]

    // flat_map: map then flatten (like Python's nested comprehension)
    let nested = vec![vec![1, 2], vec![3, 4], vec![5]];
    let flat: Vec<i32> = nested.iter()
        .flat_map(|v| v.iter().copied())
        .collect();
    println!("{:?}", flat);  // [1, 2, 3, 4, 5]
}`}
      />

      <NoteBlock title="filter_map is your friend" type="tip">
        <p>
          <code>filter_map</code> combines filter and map into a single step:
          the closure returns <code>Option&lt;T&gt;</code>.
          <code>Some(value)</code> keeps the element (mapped),
          <code>None</code> filters it out. This is extremely useful for
          parsing and data cleaning where some inputs might be invalid.
        </p>
      </NoteBlock>

      <h2>fold (reduce) and scan</h2>

      <PythonRustCompare
        title="Reducing to a single value"
        description="Python uses functools.reduce or sum/min/max. Rust uses fold as the general case."
        pythonCode={`from functools import reduce

numbers = [1, 2, 3, 4, 5]

# Built-in reductions
total = sum(numbers)              # 15
largest = max(numbers)            # 5
product = reduce(lambda a, b: a * b, numbers)  # 120

# Accumulating with reduce
# Running total: [1, 3, 6, 10, 15]
from itertools import accumulate
running = list(accumulate(numbers))
print(running)  # [1, 3, 6, 10, 15]`}
        rustCode={`fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // Built-in consumers
    let total: i32 = numbers.iter().sum();           // 15
    let largest = numbers.iter().max();               // Some(&5)
    let product: i32 = numbers.iter().product();      // 120

    // fold: general reduction (like functools.reduce with init)
    let product2 = numbers.iter()
        .fold(1, |acc, &x| acc * x);                // 120

    // fold with a different accumulator type
    let csv = numbers.iter()
        .fold(String::new(), |acc, &x| {
            if acc.is_empty() {
                x.to_string()
            } else {
                format!("{},{}", acc, x)
            }
        });
    println!("{}", csv);  // "1,2,3,4,5"

    // scan: like fold but yields intermediate results
    let running: Vec<i32> = numbers.iter()
        .scan(0, |state, &x| {
            *state += x;
            Some(*state)
        })
        .collect();
    println!("{:?}", running);  // [1, 3, 6, 10, 15]
}`}
      />

      <h2>zip, enumerate, chain</h2>

      <PythonRustCompare
        title="Combining iterators"
        description="Python and Rust have nearly identical zip, enumerate, and chain operations."
        pythonCode={`names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 92]

# zip
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# enumerate
for i, name in enumerate(names):
    print(f"{i}: {name}")

# chain (itertools)
from itertools import chain
a = [1, 2, 3]
b = [4, 5, 6]
all_items = list(chain(a, b))  # [1, 2, 3, 4, 5, 6]

# zip_longest (itertools)
from itertools import zip_longest
for a, b in zip_longest([1, 2], [10, 20, 30], fillvalue=0):
    print(a, b)  # (1,10) (2,20) (0,30)`}
        rustCode={`fn main() {
    let names = vec!["Alice", "Bob", "Charlie"];
    let scores = vec![95, 87, 92];

    // zip
    for (name, score) in names.iter().zip(scores.iter()) {
        println!("{}: {}", name, score);
    }

    // enumerate
    for (i, name) in names.iter().enumerate() {
        println!("{}: {}", i, name);
    }

    // chain
    let a = vec![1, 2, 3];
    let b = vec![4, 5, 6];
    let all: Vec<i32> = a.iter().chain(b.iter()).copied().collect();
    println!("{:?}", all);  // [1, 2, 3, 4, 5, 6]

    // Unzip: split a iterator of pairs into two collections
    let pairs = vec![(1, "a"), (2, "b"), (3, "c")];
    let (nums, letters): (Vec<i32>, Vec<&str>) =
        pairs.into_iter().unzip();
    println!("{:?} {:?}", nums, letters);
    // [1, 2, 3] ["a", "b", "c"]
}`}
      />

      <h2>Short-Circuiting: any, all, find, position</h2>

      <CodeBlock
        language="rust"
        title="Stop early when you have the answer"
        code={`fn main() {
    let data = vec![2, 4, 6, 7, 8, 10];

    // any: is there at least one odd number?
    let has_odd = data.iter().any(|&x| x % 2 != 0);
    println!("Has odd: {}", has_odd);  // true (stops at 7)

    // all: are all numbers positive?
    let all_positive = data.iter().all(|&x| x > 0);
    println!("All positive: {}", all_positive);  // true

    // find: first element matching a predicate
    let first_odd = data.iter().find(|&&x| x % 2 != 0);
    println!("First odd: {:?}", first_odd);  // Some(&7)

    // position: index of first match
    let odd_idx = data.iter().position(|&x| x % 2 != 0);
    println!("Odd at index: {:?}", odd_idx);  // Some(3)

    // These short-circuit: they stop iterating as soon as
    // the answer is known, just like Python's any()/all().

    // Practical: check if a large dataset has any NaN values
    let measurements = vec![1.0, 2.0, f64::NAN, 4.0];
    let has_nan = measurements.iter().any(|x| x.is_nan());
    println!("Has NaN: {}", has_nan);  // true
}`}
      />

      <NoteBlock title="Chaining is free" type="note">
        <p>
          A chain like <code>.filter().map().take().collect()</code> does
          not create intermediate vectors. The compiler fuses the entire
          chain into a single loop. Each element flows through all adaptors
          before the next element is processed. This is called
          "internal iteration" and is one of Rust's key performance
          advantages.
        </p>
      </NoteBlock>

      <h2>Real-World Example: Data Processing Pipeline</h2>

      <CodeBlock
        language="rust"
        title="Processing CSV-like data with iterators"
        code={`fn main() {
    let csv_data = "\
name,age,score
Alice,30,95.5
Bob,25,87.3
Charlie,35,92.1
Diana,28,88.9
Eve,32,91.0";

    // Parse, filter, and aggregate in one pipeline
    let high_scorers: Vec<(&str, f64)> = csv_data
        .lines()
        .skip(1)                          // skip header
        .filter_map(|line| {
            let fields: Vec<&str> = line.split(',').collect();
            let name = *fields.first()?;
            let score: f64 = fields.get(2)?.parse().ok()?;
            Some((name, score))
        })
        .filter(|&(_, score)| score >= 90.0)   // high scorers only
        .collect();

    println!("High scorers: {:?}", high_scorers);
    // [("Alice", 95.5), ("Charlie", 92.1), ("Eve", 91.0)]

    // Average score of high scorers
    let (sum, count) = high_scorers.iter()
        .fold((0.0, 0), |(sum, count), &(_, score)| {
            (sum + score, count + 1)
        });

    if count > 0 {
        println!("Average: {:.1}", sum / count as f64);
        // Average: 92.9
    }
}`}
      />

      <ExerciseBlock
        title="Iterator chain challenge"
        difficulty="hard"
        problem={`Given a Vec<String> of sentences, write a single iterator chain that:
1. Splits each sentence into words
2. Converts all words to lowercase
3. Filters out words shorter than 4 characters
4. Removes duplicate words (hint: collect to HashSet, then back)
5. Sorts the result alphabetically
6. Returns a Vec<String>

Test with:
vec!["The Quick Brown Fox", "jumps Over The Lazy Dog", "the fox is quick"]`}
        solution={`use std::collections::HashSet;

fn unique_long_words(sentences: &[String]) -> Vec<String> {
    let mut words: Vec<String> = sentences.iter()
        .flat_map(|s| s.split_whitespace())  // flatten all words
        .map(|w| w.to_lowercase())            // lowercase
        .filter(|w| w.len() >= 4)             // min 4 chars
        .collect::<HashSet<String>>()          // deduplicate
        .into_iter()
        .collect();

    words.sort();  // alphabetical
    words
}

fn main() {
    let sentences = vec![
        "The Quick Brown Fox".to_string(),
        "jumps Over The Lazy Dog".to_string(),
        "the fox is quick".to_string(),
    ];

    let result = unique_long_words(&sentences);
    println!("{:?}", result);
    // ["brown", "jumps", "lazy", "over", "quick"]
}`}
      />
    </div>
  );
}
