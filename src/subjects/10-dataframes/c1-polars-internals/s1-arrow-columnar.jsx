import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function ArrowColumnar() {
  return (
    <div className="prose-rust">
      <h1>Arrow Columnar Format</h1>

      <p>
        Before diving into Polars, you need to understand Apache Arrow — the
        in-memory columnar format that powers it. Arrow is the reason Polars
        is so fast: it stores data column-by-column in contiguous memory,
        enabling SIMD operations, cache-friendly access, and zero-copy sharing
        between libraries.
      </p>

      <ConceptBlock title="Row-Oriented vs Column-Oriented">
        <p>
          Traditional row-oriented storage (like Python lists of dicts) stores
          each record together: <code>[name, age, score], [name, age, score], ...</code>.
          Column-oriented storage groups all values of the same field together:
          all names, then all ages, then all scores.
        </p>
        <p>
          For analytical queries ("compute the mean of the score column"),
          columnar format is dramatically faster because the CPU reads
          contiguous memory instead of jumping between scattered records.
        </p>
      </ConceptBlock>

      <h2>Row vs Column Layout</h2>

      <PythonRustCompare
        title="Data layout comparison"
        description="Pandas uses a columnar layout internally (via NumPy arrays). Arrow formalizes this with a standard specification."
        pythonCode={`# Row-oriented (Python list of dicts)
# Memory: scattered, cache-unfriendly
rows = [
    {"name": "Alice", "age": 30, "score": 95.0},
    {"name": "Bob",   "age": 25, "score": 87.5},
    {"name": "Carol", "age": 35, "score": 92.0},
]
# To compute mean(score): must visit every dict,
# look up "score" key, unbox the float... slow!
avg = sum(r["score"] for r in rows) / len(rows)

# Pandas uses columnar internally
import pandas as pd
df = pd.DataFrame(rows)
# df["score"] is a contiguous NumPy array
avg = df["score"].mean()  # much faster!

# But Pandas still copies data between operations
# and has mixed row/column access patterns`}
        rustCode={`// Arrow columnar layout — data stored by column
// in contiguous, aligned memory blocks

// Conceptually, 3 rows become:
// names:  ["Alice", "Bob", "Carol"]  → contiguous buffer
// ages:   [30, 25, 35]              → contiguous i32 buffer
// scores: [95.0, 87.5, 92.0]        → contiguous f64 buffer

// Each column is a single, aligned memory block.
// Computing mean(scores) reads 3 × 8 = 24 contiguous bytes.
// The CPU prefetcher loves this!

use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    // Polars builds on Arrow automatically
    let df = df! {
        "name"  => ["Alice", "Bob", "Carol"],
        "age"   => [30, 25, 35],
        "score" => [95.0, 87.5, 92.0],
    }?;

    // This operates on a contiguous f64 buffer
    let avg = df.column("score")?
        .mean()
        .unwrap();
    println!("Mean score: {}", avg); // 91.5

    Ok(())
}`}
      />

      <NoteBlock type="pythonista" title="Why Arrow matters for Python too">
        Arrow is not just a Rust thing. PyArrow, Polars (Python), DuckDB,
        and many other tools use Arrow as their in-memory format. This enables
        zero-copy data sharing: a Polars DataFrame can be passed to DuckDB or
        PyArrow without copying a single byte. The data is already in Arrow
        format.
      </NoteBlock>

      <h2>Arrow's Memory Layout</h2>

      <CodeBlock
        language="rust"
        title="Understanding Arrow buffers"
        code={`// Arrow arrays consist of:
// 1. A data buffer (the actual values, contiguous)
// 2. A validity bitmap (which values are null)
// 3. An offset buffer (for variable-length types like strings)

// Integer column: [1, NULL, 3, 4, NULL]
// Data buffer:    [1, ?, 3, 4, ?]  — 5 × 4 bytes = 20 bytes
// Validity bits:  [1, 0, 1, 1, 0]  — 1 byte (5 bits)
// Total: 21 bytes for 5 values (vs ~140 bytes in Python)

// String column: ["hello", "world"]
// Data buffer:    "helloworld"      — 10 bytes, no separators
// Offset buffer:  [0, 5, 10]        — tells you where each string starts
// Validity bits:  [1, 1]            — both non-null

use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    // Nulls are first-class citizens in Arrow
    let ages = Series::new("age".into(), &[Some(30), None, Some(35)]);
    println!("{}", ages);
    // shape: (3,)
    // Series: 'age' [i32]
    // [30, null, 35]

    // Null-aware operations — no NaN hacks like Pandas!
    let mean = ages.mean().unwrap();
    println!("Mean (skipping nulls): {}", mean); // 32.5

    // Check nulls
    println!("Null count: {}", ages.null_count()); // 1

    Ok(())
}`}
      />

      <h2>Why Columnar Format Is Faster</h2>

      <CodeBlock
        language="rust"
        title="Cache efficiency and SIMD"
        code={`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    // Create a large DataFrame
    let n = 1_000_000;
    let values: Vec<f64> = (0..n).map(|i| i as f64 * 0.01).collect();
    let categories: Vec<&str> = (0..n)
        .map(|i| if i % 3 == 0 { "A" } else if i % 3 == 1 { "B" } else { "C" })
        .collect();

    let df = df! {
        "value"    => &values,
        "category" => &categories,
    }?;

    // This is fast because:
    // 1. "value" column is contiguous f64s in memory
    // 2. CPU can SIMD-process 4 f64s at once (AVX2)
    // 3. Prefetcher loads ahead because access is sequential
    let stats = df.clone().lazy()
        .group_by([col("category")])
        .agg([
            col("value").mean().alias("mean"),
            col("value").std(1).alias("std"),
            col("value").count().alias("count"),
        ])
        .collect()?;

    println!("{}", stats);

    // Row-oriented equivalent would be:
    // - Visit each row, extract category, look up aggregator
    // - Random memory access pattern
    // - Cache misses on every row
    // - 10-100x slower for large datasets

    Ok(())
}`}
      />

      <NoteBlock type="tip" title="Arrow is a specification, not a library">
        Arrow defines how data should be laid out in memory. Multiple
        implementations exist: Rust's <code>arrow-rs</code> (used by Polars
        and DataFusion), C++ Arrow (used by PyArrow), and others. Because they
        share the same format, data can move between them with zero copies.
      </NoteBlock>

      <ExerciseBlock
        title="Columnar vs Row-Oriented Thinking"
        difficulty="beginner"
        problem={`Consider a dataset of 1 million rows with columns: id (u64), temperature (f64), city (String).

1. In row-oriented storage, how many bytes does each row consume? (hint: u64=8, f64=8, String~24 stack + variable heap)
2. To compute the mean temperature, how much memory does the CPU need to read in row-oriented vs columnar format?
3. Why does the columnar format benefit from SIMD (processing multiple values in a single CPU instruction)?

Think about these before looking at the answer.`}
        solution={`1. Row-oriented: each row is ~40+ bytes (8 + 8 + 24+ bytes for the String struct plus heap data for the string content). To read temperature for all rows, you must load the entire ~40MB dataset because temperatures are interleaved with ids and cities.

2. Memory reads:
   - Row-oriented: must read ~40 MB (all 1M rows × ~40 bytes each), even though you only need the temperature column
   - Columnar: reads exactly 8 MB (1M × 8 bytes for f64), because temperatures are stored contiguously

   That's a 5x reduction in memory bandwidth — and in practice even more, because the CPU cache loads entire cache lines (64 bytes), so row-oriented wastes cache space on id and city fields.

3. SIMD (Single Instruction Multiple Data) processes multiple values in one CPU instruction. AVX2 can add 4 f64s simultaneously. This only works when values are contiguous in memory — which columnar format guarantees. Row-oriented storage has gaps (the id and city fields) between temperature values, preventing SIMD vectorization.

Key insight: analytical workloads (aggregations, filters, statistics) almost always operate on columns, not rows. Columnar format aligns the data layout with the access pattern.`}
      />
    </div>
  );
}
