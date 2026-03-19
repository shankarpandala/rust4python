import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const StructLifetimes = () => {
  return (
    <div className="prose-rust">
      <h1>Struct Lifetimes</h1>

      <p>
        Sometimes you want a struct to hold a reference to data it doesn't own — for
        example, a parser that borrows the input text, or a view into a larger dataset.
        When a struct contains references, it needs lifetime annotations so the compiler
        can ensure the referenced data outlives the struct.
      </p>

      <ConceptBlock title="Why Structs Need Lifetime Annotations">
        <p>
          If a struct holds a reference, the data it points to must live at least as long
          as the struct itself. Otherwise, the struct would contain a dangling pointer. The
          lifetime annotation <code>&lt;'a&gt;</code> on a struct tells the compiler:
          "any instance of this struct cannot outlive the data it references."
        </p>
      </ConceptBlock>

      <h2>Basic Struct with a Reference</h2>

      <CodeBlock
        language="rust"
        title="A struct that borrows data"
        code={`// This struct borrows a string slice — it does NOT own the string
struct Excerpt<'a> {
    text: &'a str,
}

fn main() {
    let novel = String::from(
        "Call me Ishmael. Some years ago..."
    );

    // The excerpt borrows from novel
    let first_sentence;
    {
        let excerpt = Excerpt {
            text: &novel[..15], // "Call me Ishmael"
        };
        first_sentence = excerpt.text;
    }
    // excerpt is dropped, but first_sentence still borrows from novel
    println!("{}", first_sentence); // OK: novel is still alive

    // This would NOT compile:
    // let dangling;
    // {
    //     let temp = String::from("temporary");
    //     dangling = Excerpt { text: &temp };
    // } // temp dropped — dangling would have an invalid reference
    // println!("{}", dangling.text); // ERROR
}`}
      />

      <PythonRustCompare
        title="Structs with references vs Python objects"
        description="Python objects freely reference other objects — the GC keeps everything alive. Rust requires explicit lifetime management."
        pythonCode={`class Excerpt:
    def __init__(self, text):
        self.text = text

novel = "Call me Ishmael. Some years ago..."
excerpt = Excerpt(novel[:15])

# In Python, you never worry about
# whether 'novel' outlives 'excerpt'.
# The GC keeps the string alive as long
# as ANY reference exists.

del novel
# excerpt.text is still valid because
# Python strings are reference-counted
print(excerpt.text)  # "Call me Ishmael"`}
        rustCode={`struct Excerpt<'a> {
    text: &'a str,
}

fn main() {
    let novel = String::from(
        "Call me Ishmael. Some years ago..."
    );
    let excerpt = Excerpt {
        text: &novel[..15],
    };

    // Cannot drop novel while excerpt exists:
    // drop(novel); // ERROR: still borrowed
    println!("{}", excerpt.text);

    // This is the tradeoff: no GC overhead,
    // but you must ensure data outlives
    // the structs that reference it.
}`}
      />

      <h2>Multiple References in a Struct</h2>

      <CodeBlock
        language="rust"
        title="Struct with multiple lifetime parameters"
        code={`// Same lifetime: both references must live at least as long
struct Pair<'a> {
    first: &'a str,
    second: &'a str,
}

// Different lifetimes: references can have different scopes
struct PairDiff<'a, 'b> {
    first: &'a str,
    second: &'b str,
}

fn main() {
    let x = String::from("hello");
    let y = String::from("world");

    // Same lifetime — both must be alive when pair is used
    let pair = Pair {
        first: &x,
        second: &y,
    };
    println!("{} {}", pair.first, pair.second);

    // Different lifetimes — more flexible
    let outer = String::from("outer");
    let pair2;
    {
        let inner = String::from("inner");
        let p = PairDiff {
            first: &outer,
            second: &inner,
        };
        println!("{} {}", p.first, p.second);
        // p is dropped here — inner can be freed
    }
    // pair2 with different lifetimes could keep borrowing outer
}`}
      />

      <h2>Methods on Structs with Lifetimes</h2>

      <CodeBlock
        language="rust"
        title="impl blocks with lifetime parameters"
        code={`struct Config<'a> {
    name: &'a str,
    values: &'a [i32],
}

impl<'a> Config<'a> {
    // Constructor-like function
    fn new(name: &'a str, values: &'a [i32]) -> Self {
        Config { name, values }
    }

    // Method returning a reference — lifetime tied to self (Rule 3)
    fn name(&self) -> &str {
        self.name
    }

    // Method using the borrowed data
    fn sum(&self) -> i32 {
        self.values.iter().sum()
    }

    fn describe(&self) -> String {
        format!("{}: {:?} (sum={})", self.name, self.values, self.sum())
    }
}

fn main() {
    let name = "production";
    let values = vec![10, 20, 30];

    let config = Config::new(name, &values);
    println!("{}", config.describe());
    // "production: [10, 20, 30] (sum=60)"
}`}
      />

      <h2>The Alternative: Own the Data</h2>

      <ConceptBlock title="References in Structs vs Owned Data">
        <p>
          You often have a choice: should your struct <em>borrow</em> data with
          references, or <em>own</em> the data with types like <code>String</code>
          and <code>Vec</code>? Here's the tradeoff:
        </p>
        <ul>
          <li>
            <strong>References (&'a T):</strong> No allocation, zero-copy, but the struct
            can't outlive the source data. Good for temporary views and parsing.
          </li>
          <li>
            <strong>Owned data (String, Vec):</strong> The struct is self-contained and
            can be moved anywhere. Simpler to use but involves allocation. Good for
            long-lived data and when you're unsure about lifetimes.
          </li>
        </ul>
      </ConceptBlock>

      <CodeBlock
        language="rust"
        title="Borrowed vs owned struct comparison"
        code={`// BORROWED: zero-copy, but lifetime-constrained
struct LogEntryRef<'a> {
    timestamp: &'a str,
    message: &'a str,
    level: &'a str,
}

// OWNED: self-contained, but allocates
struct LogEntry {
    timestamp: String,
    message: String,
    level: String,
}

// Borrowed is great for parsing (no allocation needed)
fn parse_log_line(line: &str) -> Option<LogEntryRef> {
    let parts: Vec<&str> = line.splitn(3, ' ').collect();
    if parts.len() == 3 {
        Some(LogEntryRef {
            timestamp: parts[0],
            level: parts[1],
            message: parts[2],
        })
    } else {
        None
    }
}

// Owned is great for storing (no lifetime constraints)
fn parse_and_store(line: &str) -> Option<LogEntry> {
    let parts: Vec<&str> = line.splitn(3, ' ').collect();
    if parts.len() == 3 {
        Some(LogEntry {
            timestamp: parts[0].to_string(),
            level: parts[1].to_string(),
            message: parts[2].to_string(),
        })
    } else {
        None
    }
}

fn main() {
    let line = "2024-01-15 INFO Server started";

    // Borrowed: efficient but tied to 'line'
    let entry_ref = parse_log_line(line).unwrap();
    println!("{}: {}", entry_ref.level, entry_ref.message);

    // Owned: independent, can be stored in a Vec, sent to another thread
    let entry_owned = parse_and_store(line).unwrap();
    // entry_owned can be stored anywhere — it owns all its data
    let logs: Vec<LogEntry> = vec![entry_owned];
    println!("{}: {}", logs[0].level, logs[0].message);
}`}
      />

      <NoteBlock type="tip" title="When in doubt, own the data">
        <p>
          For beginners, start with owned data (<code>String</code> instead of
          <code>&str</code>, <code>Vec&lt;T&gt;</code> instead of <code>&[T]</code>).
          Owned structs are simpler — no lifetime annotations, no constraints on how
          long they live. Optimize to references later if performance profiling shows
          allocation is a bottleneck. Many production Rust programs use owned data
          throughout and are plenty fast.
        </p>
      </NoteBlock>

      <h2>Real-World Example: Zero-Copy Parser</h2>

      <CodeBlock
        language="rust"
        title="A CSV row parser that borrows from the input"
        code={`struct CsvRow<'a> {
    fields: Vec<&'a str>,
}

impl<'a> CsvRow<'a> {
    fn parse(line: &'a str) -> Self {
        CsvRow {
            fields: line.split(',').map(|f| f.trim()).collect(),
        }
    }

    fn get(&self, index: usize) -> Option<&str> {
        self.fields.get(index).copied()
    }

    fn len(&self) -> usize {
        self.fields.len()
    }
}

fn main() {
    let data = "Alice, 30, Engineer\nBob, 25, Designer";

    // Parse without any allocation for field strings
    for line in data.lines() {
        let row = CsvRow::parse(line);
        if let (Some(name), Some(age)) = (row.get(0), row.get(1)) {
            println!("{} is {} years old", name, age);
        }
    }
    // Each CsvRow borrows slices of the original string.
    // Zero allocations for the field data itself!
    // (The Vec<&str> allocates, but the strings don't.)
}`}
      />

      <NoteBlock type="pythonista" title="Python's csv module allocates for every field">
        <p>
          Python's <code>csv.reader</code> creates a new string object for every field
          in every row. For a CSV with 1 million rows and 10 columns, that's 10 million
          string allocations. Rust's borrowing approach can parse the same CSV with zero
          string allocations — each field is just a pointer into the original input buffer.
          This is why Rust-based CSV parsers are dramatically faster.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Build a Borrowing Struct"
        difficulty="easy"
        problem={`Create a struct WordStats<'a> that borrows a &str and provides
methods to compute:
1. word_count() -> usize
2. longest_word() -> &str (returns the longest word)
3. contains_word(&self, target: &str) -> bool

The struct should NOT own the string data.`}
        solution={`struct WordStats<'a> {
    text: &'a str,
}

impl<'a> WordStats<'a> {
    fn new(text: &'a str) -> Self {
        WordStats { text }
    }

    fn word_count(&self) -> usize {
        self.text.split_whitespace().count()
    }

    fn longest_word(&self) -> &str {
        self.text
            .split_whitespace()
            .max_by_key(|w| w.len())
            .unwrap_or("")
    }

    fn contains_word(&self, target: &str) -> bool {
        self.text.split_whitespace().any(|w| w == target)
    }
}

fn main() {
    let text = String::from("the quick brown fox jumps over the lazy dog");
    let stats = WordStats::new(&text);

    println!("Words: {}", stats.word_count());       // 9
    println!("Longest: {}", stats.longest_word());    // "jumps"
    println!("Has 'fox': {}", stats.contains_word("fox")); // true
    println!("Has 'cat': {}", stats.contains_word("cat")); // false

    // text is still usable
    println!("Original: {}", text);
}`}
      />

      <ExerciseBlock
        title="Refactor to Owned"
        difficulty="medium"
        problem={`Take this borrowed struct and refactor it to use owned data.
Explain the tradeoffs.

struct SearchResult<'a> {
    query: &'a str,
    matches: Vec<&'a str>,
    source: &'a str,
}

impl<'a> SearchResult<'a> {
    fn summary(&self) -> String {
        format!(
            "Found {} matches for '{}' in '{}'",
            self.matches.len(), self.query, self.source
        )
    }
}`}
        solution={`// Owned version — no lifetime annotations needed
struct SearchResult {
    query: String,
    matches: Vec<String>,
    source: String,
}

impl SearchResult {
    fn new(query: &str, matches: Vec<&str>, source: &str) -> Self {
        SearchResult {
            query: query.to_string(),
            matches: matches.into_iter().map(|s| s.to_string()).collect(),
            source: source.to_string(),
        }
    }

    fn summary(&self) -> String {
        format!(
            "Found {} matches for '{}' in '{}'",
            self.matches.len(), self.query, self.source
        )
    }
}

// Tradeoffs:
// BORROWED version:
//   + No allocation for query, matches, or source strings
//   + Faster construction (just copies pointers)
//   - Cannot outlive the source data
//   - Cannot be stored in a Vec, HashMap, or sent to another thread
//     without lifetime gymnastics
//   - Requires lifetime annotations on every function that uses it
//
// OWNED version:
//   + Self-contained — can be stored, returned, sent anywhere
//   + Simpler API — no lifetime annotations
//   + Can be put in collections: Vec<SearchResult>
//   - Allocates memory for each string (to_string() calls)
//   - More memory usage

// Guideline: Use borrowed for short-lived, performance-critical
// parsing. Use owned for data that needs to be stored or moved.`}
      />
    </div>
  );
};

export default StructLifetimes;
