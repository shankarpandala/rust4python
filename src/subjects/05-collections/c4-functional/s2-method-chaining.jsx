import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function MethodChaining() {
  return (
    <div className="prose-rust">
      <h1>Method Chaining (Polars-style)</h1>

      <p>
        If you have used Polars, pandas, or PySpark, you already think in
        method chains: <code>df.filter(...).select(...).group_by(...).agg(...)</code>.
        Rust's iterator system and builder pattern make method chaining
        a first-class programming style — and unlike Python, the chains
        compile to maximally efficient code.
      </p>

      <ConceptBlock title="Method Chaining in Rust">
        <p>
          Method chaining works when each method returns something that has
          more methods. In Rust, this happens in two main contexts:
        </p>
        <ul>
          <li><strong>Iterator chains</strong>: each adapter returns a new iterator.</li>
          <li><strong>Builder pattern</strong>: each method returns <code>self</code> (or a new modified value).</li>
        </ul>
        <p>
          Both patterns produce clean, readable code that describes
          <em>what</em> to compute rather than <em>how</em>.
        </p>
      </ConceptBlock>

      <h2>Polars-Style Data Processing</h2>

      <PythonRustCompare
        title="Data pipeline comparison"
        description="Polars in Python vs pure Rust iterators — same chaining style, same mental model."
        pythonCode={`import polars as pl

df = pl.DataFrame({
    "name": ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "dept": ["Eng", "Sales", "Eng", "Sales", "Eng"],
    "salary": [95000, 72000, 88000, 68000, 105000],
})

result = (
    df
    .filter(pl.col("salary") > 70000)
    .with_columns(
        (pl.col("salary") * 1.1).alias("new_salary")
    )
    .group_by("dept")
    .agg(
        pl.col("new_salary").mean().alias("avg_salary"),
        pl.col("name").count().alias("headcount"),
    )
    .sort("avg_salary", descending=True)
)
print(result)`}
        rustCode={`use std::collections::HashMap;

#[derive(Debug, Clone)]
struct Employee {
    name: String,
    dept: String,
    salary: f64,
}

fn main() {
    let employees = vec![
        Employee { name: "Alice".into(), dept: "Eng".into(), salary: 95000.0 },
        Employee { name: "Bob".into(), dept: "Sales".into(), salary: 72000.0 },
        Employee { name: "Charlie".into(), dept: "Eng".into(), salary: 88000.0 },
        Employee { name: "Diana".into(), dept: "Sales".into(), salary: 68000.0 },
        Employee { name: "Eve".into(), dept: "Eng".into(), salary: 105000.0 },
    ];

    // Same pipeline, Rust iterator style
    let by_dept: HashMap<&str, (f64, usize)> = employees.iter()
        .filter(|e| e.salary > 70000.0)                    // filter
        .map(|e| (e.dept.as_str(), e.salary * 1.1))         // transform
        .fold(HashMap::new(), |mut acc, (dept, salary)| {   // group + agg
            let entry = acc.entry(dept).or_insert((0.0, 0));
            entry.0 += salary;
            entry.1 += 1;
            acc
        });

    let mut results: Vec<_> = by_dept.iter()
        .map(|(&dept, &(total, count))| {
            (dept, total / count as f64, count)
        })
        .collect();

    results.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());  // sort desc

    for (dept, avg, count) in &results {
        println!("{}: avg={:.0}, headcount={}", dept, avg, count);
    }
}`}
      />

      <NoteBlock title="When to use Polars from Rust" type="tip">
        <p>
          For simple data transformations, Rust iterators are perfect. For
          complex analytical queries on large datasets, use the Polars Rust
          crate directly — it is a Rust library first, with a Python binding.
          You get the same Polars API with native Rust performance and no
          Python overhead.
        </p>
      </NoteBlock>

      <h2>Building Fluent APIs</h2>

      <CodeBlock
        language="rust"
        title="The builder pattern for configuration"
        code={`#[derive(Debug)]
struct Query {
    table: String,
    columns: Vec<String>,
    filter: Option<String>,
    limit: Option<usize>,
    order_by: Option<String>,
}

impl Query {
    fn from_table(table: &str) -> Self {
        Query {
            table: table.to_string(),
            columns: vec![],
            filter: None,
            limit: None,
            order_by: None,
        }
    }

    fn select(mut self, cols: &[&str]) -> Self {
        self.columns = cols.iter().map(|s| s.to_string()).collect();
        self
    }

    fn where_clause(mut self, condition: &str) -> Self {
        self.filter = Some(condition.to_string());
        self
    }

    fn limit(mut self, n: usize) -> Self {
        self.limit = Some(n);
        self
    }

    fn order_by(mut self, col: &str) -> Self {
        self.order_by = Some(col.to_string());
        self
    }

    fn to_sql(&self) -> String {
        let cols = if self.columns.is_empty() {
            "*".to_string()
        } else {
            self.columns.join(", ")
        };

        let mut sql = format!("SELECT {} FROM {}", cols, self.table);

        if let Some(ref f) = self.filter {
            sql.push_str(&format!(" WHERE {}", f));
        }
        if let Some(ref o) = self.order_by {
            sql.push_str(&format!(" ORDER BY {}", o));
        }
        if let Some(n) = self.limit {
            sql.push_str(&format!(" LIMIT {}", n));
        }

        sql
    }
}

fn main() {
    let query = Query::from_table("users")
        .select(&["name", "email", "age"])
        .where_clause("age > 18")
        .order_by("name")
        .limit(100)
        .to_sql();

    println!("{}", query);
    // SELECT name, email, age FROM users WHERE age > 18 ORDER BY name LIMIT 100
}`}
      />

      <h2>Chaining with Itertools</h2>

      <CodeBlock
        language="rust"
        title="itertools crate — Python itertools for Rust"
        code={`// cargo add itertools
use itertools::Itertools;

fn main() {
    let data = vec![3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];

    // sorted + dedup (like Python's sorted(set(...)))
    let unique_sorted: Vec<_> = data.iter()
        .copied()
        .sorted()
        .dedup()
        .collect();
    println!("{:?}", unique_sorted);  // [1, 2, 3, 4, 5, 6, 9]

    // group_by (like Python's itertools.groupby)
    let words = vec!["apple", "avocado", "banana", "blueberry", "cherry"];
    for (key, group) in &words.iter().sorted().chunk_by(|w| w.chars().next().unwrap()) {
        let items: Vec<_> = group.collect();
        println!("{}: {:?}", key, items);
    }
    // a: ["apple", "avocado"]
    // b: ["banana", "blueberry"]
    // c: ["cherry"]

    // join (like Python's ", ".join(...))
    let csv = data.iter().join(", ");
    println!("{}", csv);  // "3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5"

    // combinations and permutations
    let items = vec!['a', 'b', 'c'];
    let combos: Vec<Vec<_>> = items.iter().combinations(2).collect();
    println!("{:?}", combos);
    // [['a', 'b'], ['a', 'c'], ['b', 'c']]

    // tuple_windows (sliding window)
    let pairs: Vec<_> = (1..=5).tuple_windows().collect::<Vec<(i32, i32)>>();
    println!("{:?}", pairs);
    // [(1, 2), (2, 3), (3, 4), (4, 5)]
}`}
      />

      <NoteBlock title="itertools is the Rust itertools" type="pythonista">
        <p>
          Python's <code>itertools</code> module provides <code>chain</code>,
          <code>groupby</code>, <code>combinations</code>, <code>permutations</code>,
          <code>product</code>, and more. Rust's <code>itertools</code> crate
          provides all of these plus extras like <code>sorted()</code>,
          <code>unique()</code>, <code>join()</code>, and
          <code>tuple_windows()</code>. Add it to almost every Rust project.
        </p>
      </NoteBlock>

      <h2>Composing Complex Pipelines</h2>

      <CodeBlock
        language="rust"
        title="Multi-stage data processing"
        code={`use std::collections::HashMap;

fn main() {
    let log_lines = vec![
        "2024-01-15 INFO  User login: alice",
        "2024-01-15 ERROR Database timeout",
        "2024-01-15 INFO  User login: bob",
        "2024-01-16 WARN  High memory usage",
        "2024-01-16 ERROR Connection refused",
        "2024-01-16 INFO  User login: alice",
        "2024-01-16 ERROR Database timeout",
    ];

    // Pipeline: parse → filter → group → summarize
    let error_summary: Vec<(String, usize)> = log_lines.iter()
        // Parse each line into (date, level, message)
        .filter_map(|line| {
            let parts: Vec<&str> = line.splitn(3, ' ').collect();
            if parts.len() == 3 {
                Some((parts[0], parts[1], parts[2]))
            } else {
                None
            }
        })
        // Keep only errors
        .filter(|&(_, level, _)| level == "ERROR")
        // Group by message
        .fold(HashMap::new(), |mut acc, (_, _, msg)| {
            *acc.entry(msg.to_string()).or_insert(0_usize) += 1;
            acc
        })
        // Convert to sorted vec
        .into_iter()
        .collect::<Vec<_>>()
        .into_iter()
        .sorted_by(|a, b| b.1.cmp(&a.1))
        .collect();

    for (msg, count) in &error_summary {
        println!("{:>3}x {}", count, msg);
    }
    // 2x Database timeout
    // 1x Connection refused
}

// Required at top: use itertools::Itertools;`}
      />

      <ExerciseBlock
        title="Build a text analysis pipeline"
        difficulty="hard"
        problem={`Write a function analyze_text(text: &str) that uses method chaining to produce
a report with:
1. Total word count
2. Unique word count
3. Top 5 most frequent words (with counts)
4. Average word length

Process: lowercase all words, strip punctuation (keep only alphanumeric chars),
filter out empty strings.

Return a struct TextReport with these fields. Implement Display for it.

Test with a paragraph of text.`}
        solution={`use std::collections::HashMap;
use std::fmt;

struct TextReport {
    total_words: usize,
    unique_words: usize,
    top_words: Vec<(String, usize)>,
    avg_word_length: f64,
}

impl fmt::Display for TextReport {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        writeln!(f, "=== Text Analysis ===")?;
        writeln!(f, "Total words:  {}", self.total_words)?;
        writeln!(f, "Unique words: {}", self.unique_words)?;
        writeln!(f, "Avg length:   {:.1}", self.avg_word_length)?;
        writeln!(f, "Top words:")?;
        for (word, count) in &self.top_words {
            writeln!(f, "  {:>3}x {}", count, word)?;
        }
        Ok(())
    }
}

fn analyze_text(text: &str) -> TextReport {
    let words: Vec<String> = text
        .split_whitespace()
        .map(|w| w.to_lowercase())
        .map(|w| w.chars().filter(|c| c.is_alphanumeric()).collect::<String>())
        .filter(|w| !w.is_empty())
        .collect();

    let total_words = words.len();

    let avg_word_length = if total_words > 0 {
        words.iter().map(|w| w.len()).sum::<usize>() as f64
            / total_words as f64
    } else {
        0.0
    };

    let mut counts: HashMap<&str, usize> = HashMap::new();
    for word in &words {
        *counts.entry(word.as_str()).or_insert(0) += 1;
    }

    let unique_words = counts.len();

    let mut top_words: Vec<(String, usize)> = counts
        .into_iter()
        .map(|(w, c)| (w.to_string(), c))
        .collect();
    top_words.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(&b.0)));
    top_words.truncate(5);

    TextReport { total_words, unique_words, top_words, avg_word_length }
}

fn main() {
    let text = "The quick brown fox jumps over the lazy dog. \
                The dog barked at the fox, and the fox ran away.";
    println!("{}", analyze_text(text));
}`}
      />
    </div>
  );
}
