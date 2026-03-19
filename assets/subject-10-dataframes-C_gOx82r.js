import{j as e}from"./vendor-Dh_dlHsl.js";import{C as l,P as a,N as r,a as t,E as s}from"./subject-01-getting-started-DoSDK0Fn.js";function o(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Arrow Columnar Format"}),e.jsx("p",{children:"Before diving into Polars, you need to understand Apache Arrow — the in-memory columnar format that powers it. Arrow is the reason Polars is so fast: it stores data column-by-column in contiguous memory, enabling SIMD operations, cache-friendly access, and zero-copy sharing between libraries."}),e.jsxs(l,{title:"Row-Oriented vs Column-Oriented",children:[e.jsxs("p",{children:["Traditional row-oriented storage (like Python lists of dicts) stores each record together: ",e.jsx("code",{children:"[name, age, score], [name, age, score], ..."}),". Column-oriented storage groups all values of the same field together: all names, then all ages, then all scores."]}),e.jsx("p",{children:'For analytical queries ("compute the mean of the score column"), columnar format is dramatically faster because the CPU reads contiguous memory instead of jumping between scattered records.'})]}),e.jsx("h2",{children:"Row vs Column Layout"}),e.jsx(a,{title:"Data layout comparison",description:"Pandas uses a columnar layout internally (via NumPy arrays). Arrow formalizes this with a standard specification.",pythonCode:`# Row-oriented (Python list of dicts)
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
# and has mixed row/column access patterns`,rustCode:`// Arrow columnar layout — data stored by column
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
}`}),e.jsx(r,{type:"pythonista",title:"Why Arrow matters for Python too",children:"Arrow is not just a Rust thing. PyArrow, Polars (Python), DuckDB, and many other tools use Arrow as their in-memory format. This enables zero-copy data sharing: a Polars DataFrame can be passed to DuckDB or PyArrow without copying a single byte. The data is already in Arrow format."}),e.jsx("h2",{children:"Arrow's Memory Layout"}),e.jsx(t,{language:"rust",title:"Understanding Arrow buffers",code:`// Arrow arrays consist of:
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
}`}),e.jsx("h2",{children:"Why Columnar Format Is Faster"}),e.jsx(t,{language:"rust",title:"Cache efficiency and SIMD",code:`use polars::prelude::*;

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
}`}),e.jsxs(r,{type:"tip",title:"Arrow is a specification, not a library",children:["Arrow defines how data should be laid out in memory. Multiple implementations exist: Rust's ",e.jsx("code",{children:"arrow-rs"})," (used by Polars and DataFusion), C++ Arrow (used by PyArrow), and others. Because they share the same format, data can move between them with zero copies."]}),e.jsx(s,{title:"Columnar vs Row-Oriented Thinking",difficulty:"beginner",problem:`Consider a dataset of 1 million rows with columns: id (u64), temperature (f64), city (String).

1. In row-oriented storage, how many bytes does each row consume? (hint: u64=8, f64=8, String~24 stack + variable heap)
2. To compute the mean temperature, how much memory does the CPU need to read in row-oriented vs columnar format?
3. Why does the columnar format benefit from SIMD (processing multiple values in a single CPU instruction)?

Think about these before looking at the answer.`,solution:`1. Row-oriented: each row is ~40+ bytes (8 + 8 + 24+ bytes for the String struct plus heap data for the string content). To read temperature for all rows, you must load the entire ~40MB dataset because temperatures are interleaved with ids and cities.

2. Memory reads:
   - Row-oriented: must read ~40 MB (all 1M rows × ~40 bytes each), even though you only need the temperature column
   - Columnar: reads exactly 8 MB (1M × 8 bytes for f64), because temperatures are stored contiguously

   That's a 5x reduction in memory bandwidth — and in practice even more, because the CPU cache loads entire cache lines (64 bytes), so row-oriented wastes cache space on id and city fields.

3. SIMD (Single Instruction Multiple Data) processes multiple values in one CPU instruction. AVX2 can add 4 f64s simultaneously. This only works when values are contiguous in memory — which columnar format guarantees. Row-oriented storage has gaps (the id and city fields) between temperature values, preventing SIMD vectorization.

Key insight: analytical workloads (aggregations, filters, statistics) almost always operate on columns, not rows. Columnar format aligns the data layout with the access pattern.`})]})}const d=Object.freeze(Object.defineProperty({__proto__:null,default:o},Symbol.toStringTag,{value:"Module"}));function n(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Series & DataFrame in Polars"}),e.jsxs("p",{children:["If you know Pandas, Polars will feel familiar but faster — much faster. Polars is a Rust-native DataFrame library that provides the same high-level API (Series, DataFrame, group_by, join) but runs 10-100x faster than Pandas on typical workloads. The Rust API is the same engine that powers ",e.jsx("code",{children:"import polars as pl"})," in Python."]}),e.jsx(l,{title:"Series and DataFrame",children:e.jsxs("p",{children:["A ",e.jsx("strong",{children:"Series"})," is a single typed column — like a Pandas Series or a NumPy array with a name. A ",e.jsx("strong",{children:"DataFrame"})," is a collection of Series (columns) with the same length. Unlike Pandas, Polars Series are always strongly typed and null-aware through Arrow's validity bitmaps."]})}),e.jsx("h2",{children:"Creating Series and DataFrames"}),e.jsx(a,{title:"Building DataFrames",description:"The Polars API in Rust closely mirrors the Python API you already know.",pythonCode:`import polars as pl

# Create a Series
ages = pl.Series("age", [25, 30, 35, 28])
print(ages.mean())  # 29.5

# Create a DataFrame
df = pl.DataFrame({
    "name": ["Alice", "Bob", "Carol", "Dave"],
    "age": [25, 30, 35, 28],
    "score": [95.0, 87.5, 92.0, 88.0],
    "dept": ["ML", "Data", "ML", "Data"],
})

print(df)
print(df.shape)     # (4, 4)
print(df.columns)   # ['name', 'age', 'score', 'dept']
print(df.dtypes)    # [Utf8, Int64, Float64, Utf8]`,rustCode:`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    // Create a Series
    let ages = Series::new("age".into(), &[25, 30, 35, 28]);
    println!("Mean: {}", ages.mean().unwrap()); // 29.5

    // Create a DataFrame with the df! macro
    let df = df! {
        "name"  => ["Alice", "Bob", "Carol", "Dave"],
        "age"   => [25, 30, 35, 28],
        "score" => [95.0, 87.5, 92.0, 88.0],
        "dept"  => ["ML", "Data", "ML", "Data"],
    }?;

    println!("{}", df);
    println!("Shape: {:?}", df.shape());      // (4, 4)
    println!("Columns: {:?}", df.get_column_names());
    println!("Dtypes: {:?}", df.dtypes());

    Ok(())
}`}),e.jsx("h2",{children:"Accessing Data"}),e.jsx(a,{title:"Selecting and accessing columns",description:"Column access works similarly, but Rust returns Results instead of raising exceptions.",pythonCode:`import polars as pl

df = pl.DataFrame({
    "name": ["Alice", "Bob", "Carol"],
    "age": [25, 30, 35],
    "score": [95.0, 87.5, 92.0],
})

# Select columns
names = df["name"]           # Series
subset = df.select("name", "score")

# Single value
first_name = df["name"][0]   # "Alice"

# Column statistics
print(df["score"].mean())    # 91.5
print(df["age"].max())       # 35
print(df["score"].describe())

# Head and tail
print(df.head(2))
print(df.tail(1))`,rustCode:`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    let df = df! {
        "name"  => ["Alice", "Bob", "Carol"],
        "age"   => [25, 30, 35],
        "score" => [95.0, 87.5, 92.0],
    }?;

    // Select column
    let names = df.column("name")?;
    let subset = df.select(["name", "score"])?;

    // Single value
    let first = df.column("name")?.get(0)?;
    println!("First: {}", first); // "Alice"

    // Column statistics
    let mean = df.column("score")?.mean().unwrap();
    let max = df.column("age")?.max::<i32>()?.unwrap();
    println!("Mean score: {}", mean);  // 91.5
    println!("Max age: {}", max);      // 35

    // Head and tail
    println!("{}", df.head(Some(2)));
    println!("{}", df.tail(Some(1)));

    Ok(())
}`}),e.jsxs(r,{type:"pythonista",title:"Polars encourages lazy evaluation",children:["While the eager API shown above works, Polars really shines with its lazy API. Use ",e.jsx("code",{children:".lazy()"})," to build a query plan, then"," ",e.jsx("code",{children:".collect()"})," to execute it. The query optimizer can then reorder operations, push down filters, and eliminate unused columns automatically."]}),e.jsx("h2",{children:"Reading and Writing Data"}),e.jsx(t,{language:"rust",title:"I/O operations with Polars",code:`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    // Read CSV
    let df = CsvReadOptions::default()
        .with_has_header(true)
        .try_into_reader_with_file_path(Some("data.csv".into()))?
        .finish()?;

    // Read with options
    let df = CsvReadOptions::default()
        .with_has_header(true)
        .with_n_rows(Some(1000))  // read only first 1000 rows
        .try_into_reader_with_file_path(Some("big_data.csv".into()))?
        .finish()?;

    // Write CSV
    let mut df = df! {
        "x" => [1, 2, 3],
        "y" => [4.0, 5.0, 6.0],
    }?;

    let mut file = std::fs::File::create("output.csv")?;
    CsvWriter::new(&mut file)
        .finish(&mut df)?;

    // Parquet (much faster for large datasets)
    // Read:  LazyFrame::scan_parquet("data.parquet", Default::default())?.collect()?;
    // Write: ParquetWriter::new(&mut file).finish(&mut df)?;

    println!("Done!");
    Ok(())
}`}),e.jsx("h2",{children:"Adding and Transforming Columns"}),e.jsx(t,{language:"rust",title:"Column operations",code:`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    let mut df = df! {
        "name"  => ["Alice", "Bob", "Carol"],
        "score" => [95.0, 87.5, 92.0],
        "bonus" => [5.0, 10.0, 3.0],
    }?;

    // Add a computed column (lazy API)
    let result = df.clone().lazy()
        .with_column(
            (col("score") + col("bonus")).alias("total")
        )
        .with_column(
            col("score").gt(lit(90.0)).alias("passed")
        )
        .collect()?;

    println!("{}", result);
    // ┌───────┬───────┬───────┬───────┬────────┐
    // │ name  │ score │ bonus │ total │ passed │
    // │ str   │ f64   │ f64   │ f64   │ bool   │
    // ╞═══════╪═══════╪═══════╪═══════╪════════╡
    // │ Alice │ 95.0  │ 5.0   │ 100.0 │ true   │
    // │ Bob   │ 87.5  │ 10.0  │ 97.5  │ false  │
    // │ Carol │ 92.0  │ 3.0   │ 95.0  │ true   │
    // └───────┴───────┴───────┴───────┴────────┘

    Ok(())
}`}),e.jsx(s,{title:"Build a Student Report",difficulty:"intermediate",problem:`Create a DataFrame with columns: student (str), math (f64), science (f64), english (f64).

Add 5 students with scores. Then:
1. Add a "total" column (sum of all three scores)
2. Add an "average" column (mean of all three scores)
3. Add a "grade" column: "A" if average >= 90, "B" if >= 80, else "C"
4. Sort by average descending

Use the lazy API (df.lazy()...collect()).`,solution:`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    let df = df! {
        "student" => ["Alice", "Bob", "Carol", "Dave", "Eve"],
        "math"    => [95.0, 78.0, 88.0, 92.0, 85.0],
        "science" => [90.0, 85.0, 92.0, 88.0, 79.0],
        "english" => [88.0, 90.0, 85.0, 95.0, 92.0],
    }?;

    let report = df.lazy()
        .with_column(
            (col("math") + col("science") + col("english"))
                .alias("total")
        )
        .with_column(
            (col("total") / lit(3.0)).alias("average")
        )
        .with_column(
            when(col("average").gt_eq(lit(90.0)))
                .then(lit("A"))
                .when(col("average").gt_eq(lit(80.0)))
                .then(lit("B"))
                .otherwise(lit("C"))
                .alias("grade")
        )
        .sort(
            ["average"],
            SortMultipleOptions::default()
                .with_order_descending(true),
        )
        .collect()?;

    println!("{}", report);

    Ok(())
}

// Expected output:
// ┌─────────┬──────┬─────────┬─────────┬───────┬─────────┬───────┐
// │ student │ math │ science │ english │ total │ average │ grade │
// │ str     │ f64  │ f64     │ f64     │ f64   │ f64     │ str   │
// ╞═════════╪══════╪═════════╪═════════╪═══════╪═════════╪═══════╡
// │ Dave    │ 92.0 │ 88.0    │ 95.0    │ 275.0 │ 91.67   │ A     │
// │ Alice   │ 95.0 │ 90.0    │ 88.0    │ 273.0 │ 91.0    │ A     │
// │ Carol   │ 88.0 │ 92.0    │ 85.0    │ 265.0 │ 88.33   │ B     │
// │ Eve     │ 85.0 │ 79.0    │ 92.0    │ 256.0 │ 85.33   │ B     │
// │ Bob     │ 78.0 │ 85.0    │ 90.0    │ 253.0 │ 84.33   │ B     │
// └─────────┴──────┴─────────┴─────────┴───────┴─────────┴───────┘`})]})}const m=Object.freeze(Object.defineProperty({__proto__:null,default:n},Symbol.toStringTag,{value:"Module"}));function i(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Select, Filter, Group By"}),e.jsxs("p",{children:["The bread and butter of data analysis: selecting columns, filtering rows, and grouping data. Polars in Rust provides the same expressive API you know from the Python Polars library — because it is literally the same engine. If you know ",e.jsx("code",{children:"pl.col()"})," in Python, you know it in Rust."]}),e.jsx(l,{title:"Lazy vs Eager",children:e.jsxs("p",{children:["Polars offers both eager and lazy APIs. The ",e.jsx("strong",{children:"lazy API"}),"builds a query plan and optimizes it before execution — pushing down filters, projecting only needed columns, and parallelizing operations. Always prefer ",e.jsx("code",{children:"df.lazy()...collect()"})," for anything beyond simple one-liners."]})}),e.jsx("h2",{children:"Selecting Columns"}),e.jsx(a,{title:"Column selection",description:"Polars expressions look nearly identical in Python and Rust.",pythonCode:`import polars as pl

df = pl.DataFrame({
    "name": ["Alice", "Bob", "Carol", "Dave"],
    "dept": ["ML", "Data", "ML", "Data"],
    "age": [30, 25, 35, 28],
    "salary": [120000, 95000, 130000, 100000],
})

# Select specific columns
result = df.select("name", "salary")

# Select with expressions
result = df.select(
    pl.col("name"),
    pl.col("salary") / 1000,
    (pl.col("salary") * 0.1).alias("bonus"),
)

# Select by dtype
nums = df.select(pl.col(pl.Int64, pl.Float64))

# Exclude columns
no_salary = df.select(pl.exclude("salary"))`,rustCode:`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    let df = df! {
        "name"   => ["Alice", "Bob", "Carol", "Dave"],
        "dept"   => ["ML", "Data", "ML", "Data"],
        "age"    => [30, 25, 35, 28],
        "salary" => [120000, 95000, 130000, 100000],
    }?;

    // Select specific columns
    let result = df.clone().lazy()
        .select([col("name"), col("salary")])
        .collect()?;

    // Select with expressions
    let result = df.clone().lazy()
        .select([
            col("name"),
            (col("salary") / lit(1000)).alias("salary_k"),
            (col("salary") * lit(0.1)).alias("bonus"),
        ])
        .collect()?;

    println!("{}", result);

    // Exclude columns
    let no_salary = df.clone().lazy()
        .select([col("*").exclude(["salary"])])
        .collect()?;

    Ok(())
}`}),e.jsx("h2",{children:"Filtering Rows"}),e.jsx(a,{title:"Row filtering",description:"Filter expressions use the same logical operators and patterns.",pythonCode:`import polars as pl

df = pl.DataFrame({
    "name": ["Alice", "Bob", "Carol", "Dave", "Eve"],
    "dept": ["ML", "Data", "ML", "Data", "ML"],
    "age": [30, 25, 35, 28, 22],
    "score": [95.0, 87.5, 92.0, 88.0, 91.0],
})

# Simple filter
senior = df.filter(pl.col("age") >= 30)

# Multiple conditions
ml_high = df.filter(
    (pl.col("dept") == "ML") &
    (pl.col("score") > 90)
)

# OR conditions
result = df.filter(
    (pl.col("age") < 25) |
    (pl.col("score") > 92)
)

# String contains
ml_team = df.filter(
    pl.col("dept").str.contains("ML")
)

# Is in a set
selected = df.filter(
    pl.col("name").is_in(["Alice", "Carol"])
)`,rustCode:`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    let df = df! {
        "name"  => ["Alice", "Bob", "Carol", "Dave", "Eve"],
        "dept"  => ["ML", "Data", "ML", "Data", "ML"],
        "age"   => [30, 25, 35, 28, 22],
        "score" => [95.0, 87.5, 92.0, 88.0, 91.0],
    }?;

    // Simple filter
    let senior = df.clone().lazy()
        .filter(col("age").gt_eq(lit(30)))
        .collect()?;

    // Multiple conditions (AND)
    let ml_high = df.clone().lazy()
        .filter(
            col("dept").eq(lit("ML"))
            .and(col("score").gt(lit(90.0)))
        )
        .collect()?;

    // OR conditions
    let result = df.clone().lazy()
        .filter(
            col("age").lt(lit(25))
            .or(col("score").gt(lit(92.0)))
        )
        .collect()?;

    // Is in a set
    let selected = df.clone().lazy()
        .filter(col("name").is_in(lit(
            Series::new("".into(), ["Alice", "Carol"])
        )))
        .collect()?;

    println!("ML high scorers:\\n{}", ml_high);
    Ok(())
}`}),e.jsx("h2",{children:"Group By and Aggregation"}),e.jsx(a,{title:"Group by operations",description:"Group by with aggregation — the core of analytical queries.",pythonCode:`import polars as pl

df = pl.DataFrame({
    "dept": ["ML", "Data", "ML", "Data", "ML"],
    "name": ["Alice", "Bob", "Carol", "Dave", "Eve"],
    "salary": [120, 95, 130, 100, 110],
    "years": [5, 3, 8, 4, 2],
})

# Group by with aggregations
summary = df.group_by("dept").agg(
    pl.col("salary").mean().alias("avg_salary"),
    pl.col("salary").max().alias("max_salary"),
    pl.col("name").count().alias("headcount"),
    pl.col("years").sum().alias("total_years"),
)
print(summary)

# Multiple group keys
by_dept_seniority = df.group_by(
    "dept",
    pl.col("years").gt(3).alias("senior"),
).agg(
    pl.col("salary").mean(),
)`,rustCode:`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    let df = df! {
        "dept"   => ["ML", "Data", "ML", "Data", "ML"],
        "name"   => ["Alice", "Bob", "Carol", "Dave", "Eve"],
        "salary" => [120, 95, 130, 100, 110],
        "years"  => [5, 3, 8, 4, 2],
    }?;

    // Group by with aggregations
    let summary = df.clone().lazy()
        .group_by([col("dept")])
        .agg([
            col("salary").mean().alias("avg_salary"),
            col("salary").max().alias("max_salary"),
            col("name").count().alias("headcount"),
            col("years").sum().alias("total_years"),
        ])
        .collect()?;

    println!("{}", summary);

    // Sort after group_by
    let sorted = df.lazy()
        .group_by([col("dept")])
        .agg([
            col("salary").mean().alias("avg_salary"),
        ])
        .sort(
            ["avg_salary"],
            SortMultipleOptions::default()
                .with_order_descending(true),
        )
        .collect()?;

    println!("{}", sorted);
    Ok(())
}`}),e.jsxs(r,{type:"tip",title:"Chain operations for complex queries",children:["Polars shines when you chain operations. The lazy optimizer handles the rest: ",e.jsx("code",{children:"df.lazy().filter(...).select(...).group_by(...).agg(...).sort(...).collect()"}),". Each step builds the query plan; ",e.jsx("code",{children:".collect()"})," executes it all at once, optimally."]}),e.jsx(t,{language:"toml",title:"Cargo.toml for Polars",code:`[dependencies]
polars = { version = "0.46", features = ["lazy", "csv", "parquet", "dtype-struct"] }`}),e.jsx(s,{title:"Sales Analysis Pipeline",difficulty:"intermediate",problem:`Create a sales DataFrame with columns: product (str), region (str), quantity (i32), price (f64).

Add at least 8 rows with 3 products and 2 regions. Then build a lazy pipeline that:

1. Adds a "revenue" column (quantity * price)
2. Filters to revenue > 100
3. Groups by product
4. Aggregates: total_revenue (sum), avg_quantity (mean), num_sales (count)
5. Sorts by total_revenue descending
6. Collects and prints the result`,solution:`use polars::prelude::*;

fn main() -> Result<(), PolarsError> {
    let df = df! {
        "product"  => ["Widget", "Gadget", "Widget", "Doohickey",
                       "Gadget", "Widget", "Doohickey", "Gadget"],
        "region"   => ["East", "West", "West", "East",
                       "East", "East", "West", "West"],
        "quantity" => [10, 5, 8, 3, 12, 15, 7, 20],
        "price"    => [25.0, 50.0, 25.0, 100.0,
                       50.0, 25.0, 100.0, 50.0],
    }?;

    let result = df.lazy()
        // 1. Add revenue column
        .with_column(
            (col("quantity").cast(DataType::Float64) * col("price"))
                .alias("revenue")
        )
        // 2. Filter to revenue > 100
        .filter(col("revenue").gt(lit(100.0)))
        // 3-4. Group by product and aggregate
        .group_by([col("product")])
        .agg([
            col("revenue").sum().alias("total_revenue"),
            col("quantity").mean().alias("avg_quantity"),
            col("product").count().alias("num_sales"),
        ])
        // 5. Sort by total_revenue descending
        .sort(
            ["total_revenue"],
            SortMultipleOptions::default()
                .with_order_descending(true),
        )
        // 6. Collect
        .collect()?;

    println!("{}", result);
    Ok(())
}`})]})}const p=Object.freeze(Object.defineProperty({__proto__:null,default:i},Symbol.toStringTag,{value:"Module"}));export{m as a,p as b,d as s};
