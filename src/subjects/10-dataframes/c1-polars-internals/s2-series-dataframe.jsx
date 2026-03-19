import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function SeriesDataFrame() {
  return (
    <div className="prose-rust">
      <h1>Series &amp; DataFrame in Polars</h1>

      <p>
        If you know Pandas, Polars will feel familiar but faster — much faster.
        Polars is a Rust-native DataFrame library that provides the same
        high-level API (Series, DataFrame, group_by, join) but runs 10-100x
        faster than Pandas on typical workloads. The Rust API is the same
        engine that powers <code>import polars as pl</code> in Python.
      </p>

      <ConceptBlock title="Series and DataFrame">
        <p>
          A <strong>Series</strong> is a single typed column — like a Pandas
          Series or a NumPy array with a name. A <strong>DataFrame</strong> is
          a collection of Series (columns) with the same length. Unlike Pandas,
          Polars Series are always strongly typed and null-aware through Arrow's
          validity bitmaps.
        </p>
      </ConceptBlock>

      <h2>Creating Series and DataFrames</h2>

      <PythonRustCompare
        title="Building DataFrames"
        description="The Polars API in Rust closely mirrors the Python API you already know."
        pythonCode={`import polars as pl

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
print(df.dtypes)    # [Utf8, Int64, Float64, Utf8]`}
        rustCode={`use polars::prelude::*;

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
}`}
      />

      <h2>Accessing Data</h2>

      <PythonRustCompare
        title="Selecting and accessing columns"
        description="Column access works similarly, but Rust returns Results instead of raising exceptions."
        pythonCode={`import polars as pl

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
print(df.tail(1))`}
        rustCode={`use polars::prelude::*;

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
}`}
      />

      <NoteBlock type="pythonista" title="Polars encourages lazy evaluation">
        While the eager API shown above works, Polars really shines with its
        lazy API. Use <code>.lazy()</code> to build a query plan, then{' '}
        <code>.collect()</code> to execute it. The query optimizer can then
        reorder operations, push down filters, and eliminate unused columns
        automatically.
      </NoteBlock>

      <h2>Reading and Writing Data</h2>

      <CodeBlock
        language="rust"
        title="I/O operations with Polars"
        code={`use polars::prelude::*;

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
}`}
      />

      <h2>Adding and Transforming Columns</h2>

      <CodeBlock
        language="rust"
        title="Column operations"
        code={`use polars::prelude::*;

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
}`}
      />

      <ExerciseBlock
        title="Build a Student Report"
        difficulty="intermediate"
        problem={`Create a DataFrame with columns: student (str), math (f64), science (f64), english (f64).

Add 5 students with scores. Then:
1. Add a "total" column (sum of all three scores)
2. Add an "average" column (mean of all three scores)
3. Add a "grade" column: "A" if average >= 90, "B" if >= 80, else "C"
4. Sort by average descending

Use the lazy API (df.lazy()...collect()).`}
        solution={`use polars::prelude::*;

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
// └─────────┴──────┴─────────┴─────────┴───────┴─────────┴───────┘`}
      />
    </div>
  );
}
