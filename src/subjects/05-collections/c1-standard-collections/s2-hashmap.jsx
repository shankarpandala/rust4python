import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function HashMapType() {
  return (
    <div className="prose-rust">
      <h1>HashMap &amp; HashSet</h1>

      <p>
        Python's <code>dict</code> and <code>set</code> are among its most
        powerful and most-used data structures. Rust's
        <code>HashMap&lt;K, V&gt;</code> and <code>HashSet&lt;T&gt;</code>
        serve the same roles with similar performance characteristics, but
        with ownership-aware APIs that prevent common bugs.
      </p>

      <ConceptBlock title="HashMap Basics">
        <p>
          <code>HashMap&lt;K, V&gt;</code> maps keys of type <code>K</code>
          to values of type <code>V</code>. Keys must implement
          <code>Hash</code> and <code>Eq</code>. Unlike Python dicts, which
          have been insertion-ordered since Python 3.7, Rust's HashMap has
          no guaranteed order. Use <code>BTreeMap</code> if you need sorted
          keys.
        </p>
      </ConceptBlock>

      <h2>Dict vs HashMap</h2>

      <PythonRustCompare
        title="Creating and using dictionaries"
        description="Python dicts and Rust HashMaps share similar APIs with different syntax."
        pythonCode={`# Creating
scores = {"Alice": 95, "Bob": 87, "Charlie": 92}
empty = {}

# Access
alice = scores["Alice"]           # 95 (KeyError if missing)
bob = scores.get("Bob")           # 87 (None if missing)
unknown = scores.get("Dave", 0)   # 0 (default)

# Insert / Update
scores["Dave"] = 88
scores["Alice"] = 97  # overwrite

# Delete
del scores["Charlie"]
removed = scores.pop("Bob", None)

# Iteration
for name, score in scores.items():
    print(f"{name}: {score}")

# Length and membership
print(len(scores))
print("Alice" in scores)  # True`}
        rustCode={`use std::collections::HashMap;

fn main() {
    // Creating
    let mut scores = HashMap::from([
        ("Alice", 95),
        ("Bob", 87),
        ("Charlie", 92),
    ]);
    let empty: HashMap<String, i32> = HashMap::new();

    // Access
    let alice = scores["Alice"];            // 95 (panics if missing!)
    let bob = scores.get("Bob");            // Some(&87)
    let unknown = scores.get("Dave").copied().unwrap_or(0);  // 0

    // Insert / Update
    scores.insert("Dave", 88);
    scores.insert("Alice", 97);  // overwrite

    // Delete
    scores.remove("Charlie");
    let removed = scores.remove("Bob");     // Some(87)

    // Iteration
    for (name, score) in &scores {
        println!("{}: {}", name, score);
    }

    // Length and membership
    println!("{}", scores.len());
    println!("{}", scores.contains_key("Alice"));  // true
}`}
      />

      <NoteBlock title="get() returns a reference" type="pythonista">
        <p>
          Python's <code>dict.get()</code> returns the value directly.
          Rust's <code>HashMap::get()</code> returns
          <code>Option&lt;&amp;V&gt;</code> — a reference to the value. This
          avoids copying large values. Use <code>.copied()</code> for small
          Copy types or <code>.cloned()</code> for Clone types when you need
          an owned value.
        </p>
      </NoteBlock>

      <h2>The Entry API — Rust's Superpower</h2>

      <PythonRustCompare
        title="Counting and default values"
        description="Python uses defaultdict or setdefault. Rust's entry API is more explicit and more powerful."
        pythonCode={`from collections import defaultdict, Counter

words = ["hello", "world", "hello", "rust", "world", "hello"]

# Counter (most Pythonic)
counts = Counter(words)
print(counts)  # Counter({'hello': 3, 'world': 2, 'rust': 1})

# defaultdict approach
counts = defaultdict(int)
for word in words:
    counts[word] += 1

# setdefault for nested structures
groups = {}
data = [("fruit", "apple"), ("fruit", "banana"), ("veg", "carrot")]
for category, item in data:
    groups.setdefault(category, []).append(item)`}
        rustCode={`use std::collections::HashMap;

fn main() {
    let words = vec!["hello", "world", "hello", "rust", "world", "hello"];

    // Entry API for counting
    let mut counts = HashMap::new();
    for word in &words {
        *counts.entry(word).or_insert(0) += 1;
    }
    println!("{:?}", counts);
    // {"hello": 3, "world": 2, "rust": 1}

    // Entry API for grouped collections
    let data = vec![("fruit", "apple"), ("fruit", "banana"), ("veg", "carrot")];
    let mut groups: HashMap<&str, Vec<&str>> = HashMap::new();
    for (category, item) in &data {
        groups.entry(category).or_insert_with(Vec::new).push(item);
    }
    println!("{:?}", groups);
    // {"fruit": ["apple", "banana"], "veg": ["carrot"]}

    // or_default() — uses Default trait
    let mut word_lengths: HashMap<&str, Vec<usize>> = HashMap::new();
    for word in &words {
        word_lengths.entry(word).or_default().push(word.len());
    }
}`}
      />

      <NoteBlock title="Entry prevents double lookups" type="tip">
        <p>
          In Python, <code>if key in d: d[key] += 1 else: d[key] = 1</code>
          does two hash lookups. Rust's <code>entry()</code> does one lookup
          and returns a handle that lets you read or insert. This is both
          faster and more ergonomic. The entry API is one of Rust's most
          elegant standard library designs.
        </p>
      </NoteBlock>

      <h2>HashSet</h2>

      <PythonRustCompare
        title="Set operations"
        description="Python sets and Rust HashSets share the same mathematical operations."
        pythonCode={`a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

# Set operations
union = a | b            # {1,2,3,4,5,6,7,8}
inter = a & b            # {4, 5}
diff = a - b             # {1, 2, 3}
sym_diff = a ^ b         # {1, 2, 3, 6, 7, 8}

# Membership
print(3 in a)            # True

# Subset / superset
print({1, 2} <= a)       # True (subset)
print(a >= {1, 2})       # True (superset)`}
        rustCode={`use std::collections::HashSet;

fn main() {
    let a: HashSet<i32> = [1, 2, 3, 4, 5].into();
    let b: HashSet<i32> = [4, 5, 6, 7, 8].into();

    // Set operations (return iterators)
    let union: HashSet<_> = a.union(&b).copied().collect();
    let inter: HashSet<_> = a.intersection(&b).copied().collect();
    let diff: HashSet<_> = a.difference(&b).copied().collect();
    let sym: HashSet<_> = a.symmetric_difference(&b).copied().collect();

    // Or use operator syntax (consumes/borrows):
    let union2: HashSet<_> = &a | &b;
    let inter2: HashSet<_> = &a & &b;

    // Membership
    println!("{}", a.contains(&3));  // true

    // Subset / superset
    let small: HashSet<i32> = [1, 2].into();
    println!("{}", small.is_subset(&a));   // true
    println!("{}", a.is_superset(&small)); // true
}`}
      />

      <h2>Building HashMaps from Iterators</h2>

      <CodeBlock
        language="rust"
        title="Functional HashMap construction"
        code={`use std::collections::HashMap;

fn main() {
    // From iterator of tuples (like Python's dict())
    let scores: HashMap<&str, i32> = vec![
        ("Alice", 95), ("Bob", 87), ("Charlie", 92)
    ].into_iter().collect();

    // Zip two iterators (like Python's dict(zip(keys, values)))
    let keys = vec!["a", "b", "c"];
    let values = vec![1, 2, 3];
    let map: HashMap<_, _> = keys.into_iter().zip(values).collect();
    println!("{:?}", map);  // {"a": 1, "b": 2, "c": 3}

    // Group by with fold
    let words = vec!["hello", "world", "hi", "hay", "woo"];
    let by_first_char: HashMap<char, Vec<&str>> = words
        .iter()
        .fold(HashMap::new(), |mut acc, &word| {
            let first = word.chars().next().unwrap();
            acc.entry(first).or_default().push(word);
            acc
        });
    println!("{:?}", by_first_char);
    // {'h': ["hello", "hi", "hay"], 'w': ["world", "woo"]}
}`}
      />

      <NoteBlock title="Ownership and keys" type="warning">
        <p>
          HashMap keys must be owned (or references with appropriate
          lifetimes). You cannot use <code>&amp;str</code> as a key if the
          underlying string might be dropped. When in doubt, use
          <code>String</code> keys. For performance, consider
          <code>&amp;str</code> keys with explicit lifetime annotations when
          the data lives long enough.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Word frequency analyzer"
        difficulty="medium"
        problem={`Write a function word_freq(text: &str) -> Vec<(String, usize)> that:
1. Splits text into words (split_whitespace)
2. Converts to lowercase
3. Counts occurrences using HashMap
4. Returns a Vec of (word, count) pairs sorted by count (descending)
5. For equal counts, sort alphabetically

Test with: "the cat sat on the mat the cat"`}
        solution={`use std::collections::HashMap;

fn word_freq(text: &str) -> Vec<(String, usize)> {
    let mut counts: HashMap<String, usize> = HashMap::new();

    for word in text.split_whitespace() {
        let lower = word.to_lowercase();
        *counts.entry(lower).or_insert(0) += 1;
    }

    let mut result: Vec<(String, usize)> = counts.into_iter().collect();

    // Sort by count descending, then alphabetically
    result.sort_by(|a, b| {
        b.1.cmp(&a.1)               // count descending
            .then(a.0.cmp(&b.0))     // then alphabetical
    });

    result
}

fn main() {
    let freq = word_freq("the cat sat on the mat the cat");
    for (word, count) in &freq {
        println!("{}: {}", word, count);
    }
    // the: 3
    // cat: 2
    // mat: 1
    // on: 1
    // sat: 1
}`}
      />
    </div>
  );
}
