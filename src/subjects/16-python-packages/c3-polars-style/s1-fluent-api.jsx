import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function FluentApi() {
  return (
    <div className="prose-rust">
      <h1>Designing a Fluent API</h1>

      <p>
        The best Python libraries have APIs that feel natural to chain:
        Polars' <code>df.filter().select().group_by()</code>, Pandas'
        method chaining, or SQLAlchemy's query builder. When building
        Rust-backed Python packages, designing a fluent API makes your
        library feel Pythonic despite being powered by Rust underneath.
      </p>

      <ConceptBlock title="What Makes an API Fluent">
        <p>
          A fluent API returns <code>self</code> from methods, enabling
          method chaining. In Python, this means returning <code>self</code>
          from each method. In Rust, the builder pattern achieves the same
          effect. The key is that each operation returns the modified object,
          not a bare value.
        </p>
      </ConceptBlock>

      <h2>The Builder Pattern in Rust</h2>

      <PythonRustCompare
        title="Fluent builder in Python and Rust"
        description="Both languages support method chaining, but Rust's ownership makes it more explicit."
        pythonCode={`# Fluent API in Python
class Pipeline:
    def __init__(self):
        self._steps = []
        self._data = None

    def load(self, data):
        self._data = list(data)
        return self  # enables chaining

    def filter(self, predicate):
        self._data = [x for x in self._data
                      if predicate(x)]
        return self

    def map(self, func):
        self._data = [func(x) for x in self._data]
        return self

    def collect(self):
        return self._data

# Usage: method chaining
result = (Pipeline()
    .load([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(lambda x: x > 3)
    .map(lambda x: x * 2)
    .collect())
print(result)  # [8, 10, 12, 14, 16, 18, 20]`}
        rustCode={`struct Pipeline {
    data: Vec<f64>,
}

impl Pipeline {
    fn new() -> Self {
        Pipeline { data: vec![] }
    }

    // Each method consumes self and returns it
    fn load(mut self, data: Vec<f64>) -> Self {
        self.data = data;
        self
    }

    fn filter(mut self, predicate: impl Fn(&f64) -> bool) -> Self {
        self.data.retain(|x| predicate(x));
        self
    }

    fn map(mut self, func: impl Fn(f64) -> f64) -> Self {
        self.data = self.data.into_iter().map(func).collect();
        self
    }

    fn collect(self) -> Vec<f64> {
        self.data
    }
}

fn main() {
    let result = Pipeline::new()
        .load(vec![1.,2.,3.,4.,5.,6.,7.,8.,9.,10.])
        .filter(|&x| x > 3.0)
        .map(|x| x * 2.0)
        .collect();
    println!("{:?}", result);
    // [8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0]
}`}
      />

      <h2>Exposing a Fluent API to Python via PyO3</h2>

      <CodeBlock
        language="rust"
        title="PyO3 fluent builder that returns self"
        code={`use pyo3::prelude::*;

#[pyclass]
#[derive(Clone)]
struct DataPipeline {
    data: Vec<f64>,
    name: String,
}

#[pymethods]
impl DataPipeline {
    #[new]
    #[pyo3(signature = (name="pipeline"))]
    fn new(name: &str) -> Self {
        DataPipeline {
            data: vec![],
            name: name.to_string(),
        }
    }

    /// Load data — returns self for chaining
    fn load(mut slf: PyRefMut<'_, Self>, data: Vec<f64>) -> PyRefMut<'_, Self> {
        slf.data = data;
        slf
    }

    /// Filter values above threshold
    fn filter_above(mut slf: PyRefMut<'_, Self>, threshold: f64) -> PyRefMut<'_, Self> {
        slf.data.retain(|&x| x > threshold);
        slf
    }

    /// Scale all values
    fn scale(mut slf: PyRefMut<'_, Self>, factor: f64) -> PyRefMut<'_, Self> {
        for x in slf.data.iter_mut() {
            *x *= factor;
        }
        slf
    }

    /// Normalize to [0, 1] range
    fn normalize(mut slf: PyRefMut<'_, Self>) -> PyRefMut<'_, Self> {
        if let (Some(&min), Some(&max)) = (
            slf.data.iter().min_by(|a, b| a.partial_cmp(b).unwrap()),
            slf.data.iter().max_by(|a, b| a.partial_cmp(b).unwrap()),
        ) {
            let range = max - min;
            if range > 0.0 {
                for x in slf.data.iter_mut() {
                    *x = (*x - min) / range;
                }
            }
        }
        slf
    }

    /// Terminal operation — returns the data
    fn collect(&self) -> Vec<f64> {
        self.data.clone()
    }

    fn mean(&self) -> Option<f64> {
        if self.data.is_empty() { return None; }
        Some(self.data.iter().sum::<f64>() / self.data.len() as f64)
    }

    fn __repr__(&self) -> String {
        format!("DataPipeline('{}', n={})", self.name, self.data.len())
    }

    fn __len__(&self) -> usize {
        self.data.len()
    }
}

// Python usage:
// from my_lib import DataPipeline
// result = (DataPipeline("test")
//     .load([1, 5, 3, 8, 2, 9, 4, 7])
//     .filter_above(3.0)
//     .scale(2.0)
//     .normalize()
//     .collect())
// print(result)  # [0.333, 0.0, 0.833, 0.167, 1.0, 0.5]`}
      />

      <NoteBlock type="pythonista" title="PyRefMut enables return-self pattern">
        In Python, returning <code>self</code> is trivial. In PyO3,
        returning <code>self</code> requires <code>PyRefMut</code> (or
        alternatively, cloning the object). <code>PyRefMut</code> borrows
        the Python object mutably and can be returned directly, enabling
        method chaining without any copies.
      </NoteBlock>

      <h2>Lazy Evaluation Pattern</h2>

      <CodeBlock
        language="rust"
        title="Polars-style lazy API: build plan, then execute"
        code={`use pyo3::prelude::*;

/// Operations stored as a plan, executed on collect()
#[derive(Clone)]
enum Op {
    FilterAbove(f64),
    Scale(f64),
    Normalize,
    Sort,
}

#[pyclass]
#[derive(Clone)]
struct LazyPipeline {
    data: Vec<f64>,
    ops: Vec<Op>,
}

#[pymethods]
impl LazyPipeline {
    #[new]
    fn new(data: Vec<f64>) -> Self {
        LazyPipeline { data, ops: vec![] }
    }

    /// Queue a filter operation (not executed yet!)
    fn filter_above(&self, threshold: f64) -> Self {
        let mut new = self.clone();
        new.ops.push(Op::FilterAbove(threshold));
        new
    }

    fn scale(&self, factor: f64) -> Self {
        let mut new = self.clone();
        new.ops.push(Op::Scale(factor));
        new
    }

    fn normalize(&self) -> Self {
        let mut new = self.clone();
        new.ops.push(Op::Normalize);
        new
    }

    fn sort(&self) -> Self {
        let mut new = self.clone();
        new.ops.push(Op::Sort);
        new
    }

    /// Execute all queued operations
    fn collect(&self) -> Vec<f64> {
        let mut data = self.data.clone();
        for op in &self.ops {
            match op {
                Op::FilterAbove(t) => data.retain(|&x| x > *t),
                Op::Scale(f) => data.iter_mut().for_each(|x| *x *= f),
                Op::Normalize => {
                    if let (Some(&min), Some(&max)) = (
                        data.iter().min_by(|a,b| a.partial_cmp(b).unwrap()),
                        data.iter().max_by(|a,b| a.partial_cmp(b).unwrap()),
                    ) {
                        let r = max - min;
                        if r > 0.0 { data.iter_mut().for_each(|x| *x = (*x-min)/r); }
                    }
                },
                Op::Sort => data.sort_by(|a,b| a.partial_cmp(b).unwrap()),
            }
        }
        data
    }

    fn __repr__(&self) -> String {
        format!("LazyPipeline({} items, {} pending ops)",
                self.data.len(), self.ops.len())
    }
}

// Python:
// result = (LazyPipeline([5,3,8,1,9])
//     .filter_above(2)   # queued
//     .scale(10)          # queued
//     .sort()             # queued
//     .collect())         # NOW everything executes
// print(result)  # [30, 50, 80, 90]`}
      />

      <ExerciseBlock
        title="Design a Query Builder"
        difficulty="intermediate"
        problem={`Design a fluent query builder for a simple data store:

1. Create a QueryBuilder #[pyclass] that holds query parameters
2. Implement these chainable methods:
   - .select(columns: list[str]) — which columns to return
   - .where_gt(column: str, value: f64) — filter: column > value
   - .order_by(column: str) — sort by column
   - .limit(n: usize) — max rows to return
3. Implement .describe() -> str that prints the query plan as a string
4. Each method should return self for chaining

Example:
  query = (QueryBuilder()
      .select(["name", "score"])
      .where_gt("score", 90.0)
      .order_by("score")
      .limit(10))
  print(query.describe())
  # SELECT name, score WHERE score > 90.0 ORDER BY score LIMIT 10`}
        solution={`use pyo3::prelude::*;

#[pyclass]
#[derive(Clone)]
struct QueryBuilder {
    columns: Option<Vec<String>>,
    filters: Vec<(String, f64)>,
    order: Option<String>,
    max_rows: Option<usize>,
}

#[pymethods]
impl QueryBuilder {
    #[new]
    fn new() -> Self {
        QueryBuilder {
            columns: None,
            filters: vec![],
            order: None,
            max_rows: None,
        }
    }

    fn select(mut slf: PyRefMut<'_, Self>, columns: Vec<String>) -> PyRefMut<'_, Self> {
        slf.columns = Some(columns);
        slf
    }

    fn where_gt(mut slf: PyRefMut<'_, Self>, column: String, value: f64) -> PyRefMut<'_, Self> {
        slf.filters.push((column, value));
        slf
    }

    fn order_by(mut slf: PyRefMut<'_, Self>, column: String) -> PyRefMut<'_, Self> {
        slf.order = Some(column);
        slf
    }

    fn limit(mut slf: PyRefMut<'_, Self>, n: usize) -> PyRefMut<'_, Self> {
        slf.max_rows = Some(n);
        slf
    }

    fn describe(&self) -> String {
        let mut parts = vec!["SELECT".to_string()];

        match &self.columns {
            Some(cols) => parts.push(cols.join(", ")),
            None => parts.push("*".into()),
        }

        for (col, val) in &self.filters {
            parts.push(format!("WHERE {} > {}", col, val));
        }

        if let Some(col) = &self.order {
            parts.push(format!("ORDER BY {}", col));
        }

        if let Some(n) = self.max_rows {
            parts.push(format!("LIMIT {}", n));
        }

        parts.join(" ")
    }

    fn __repr__(&self) -> String {
        self.describe()
    }
}`}
      />
    </div>
  );
}
