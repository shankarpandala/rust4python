import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function SelectFilterGroupBy() {
  return (
    <div className="prose-rust">
      <h1>Select, Filter, Group By</h1>

      <p>
        The bread and butter of data analysis: selecting columns, filtering
        rows, and grouping data. Polars in Rust provides the same expressive
        API you know from the Python Polars library — because it is literally
        the same engine. If you know <code>pl.col()</code> in Python, you know
        it in Rust.
      </p>

      <ConceptBlock title="Lazy vs Eager">
        <p>
          Polars offers both eager and lazy APIs. The <strong>lazy API</strong>
          builds a query plan and optimizes it before execution — pushing down
          filters, projecting only needed columns, and parallelizing operations.
          Always prefer <code>df.lazy()...collect()</code> for anything beyond
          simple one-liners.
        </p>
      </ConceptBlock>

      <h2>Selecting Columns</h2>

      <PythonRustCompare
        title="Column selection"
        description="Polars expressions look nearly identical in Python and Rust."
        pythonCode={`import polars as pl

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
no_salary = df.select(pl.exclude("salary"))`}
        rustCode={`use polars::prelude::*;

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
}`}
      />

      <h2>Filtering Rows</h2>

      <PythonRustCompare
        title="Row filtering"
        description="Filter expressions use the same logical operators and patterns."
        pythonCode={`import polars as pl

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
)`}
        rustCode={`use polars::prelude::*;

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
}`}
      />

      <h2>Group By and Aggregation</h2>

      <PythonRustCompare
        title="Group by operations"
        description="Group by with aggregation — the core of analytical queries."
        pythonCode={`import polars as pl

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
)`}
        rustCode={`use polars::prelude::*;

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
}`}
      />

      <NoteBlock type="tip" title="Chain operations for complex queries">
        Polars shines when you chain operations. The lazy optimizer handles
        the rest: <code>df.lazy().filter(...).select(...).group_by(...).agg(...).sort(...).collect()</code>.
        Each step builds the query plan; <code>.collect()</code> executes it
        all at once, optimally.
      </NoteBlock>

      <CodeBlock
        language="toml"
        title="Cargo.toml for Polars"
        code={`[dependencies]
polars = { version = "0.46", features = ["lazy", "csv", "parquet", "dtype-struct"] }`}
      />

      <ExerciseBlock
        title="Sales Analysis Pipeline"
        difficulty="intermediate"
        problem={`Create a sales DataFrame with columns: product (str), region (str), quantity (i32), price (f64).

Add at least 8 rows with 3 products and 2 regions. Then build a lazy pipeline that:

1. Adds a "revenue" column (quantity * price)
2. Filters to revenue > 100
3. Groups by product
4. Aggregates: total_revenue (sum), avg_quantity (mean), num_sales (count)
5. Sorts by total_revenue descending
6. Collects and prints the result`}
        solution={`use polars::prelude::*;

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
}`}
      />
    </div>
  );
}
