import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function VecType() {
  return (
    <div className="prose-rust">
      <h1>Vec&lt;T&gt; — Rust's Dynamic Array</h1>

      <p>
        Python's <code>list</code> is the most-used collection: it holds any
        mix of types, grows dynamically, and supports slicing, iteration, and
        comprehensions. Rust's <code>Vec&lt;T&gt;</code> fills the same role
        but with two key differences: every element must be the same type,
        and memory management is deterministic.
      </p>

      <ConceptBlock title="Vec Under the Hood">
        <p>
          A <code>Vec&lt;T&gt;</code> is a contiguous, growable array stored on
          the heap. Internally it tracks three things: a pointer to the data,
          the current length, and the allocated capacity. When you push beyond
          capacity, it allocates a new, larger buffer and copies the data.
          This is the same strategy as Python's <code>list</code>, but with
          no per-element boxing — elements are stored inline for maximum
          cache efficiency.
        </p>
      </ConceptBlock>

      <h2>Creating and Using Vectors</h2>

      <PythonRustCompare
        title="List basics"
        description="Creating, appending, and accessing elements in both languages."
        pythonCode={`# Creating lists
empty = []
nums = [1, 2, 3, 4, 5]
zeros = [0] * 10
ranged = list(range(1, 6))

# Appending
nums.append(6)
nums.extend([7, 8, 9])

# Accessing
first = nums[0]          # 1
last = nums[-1]          # 9
middle = nums[2:5]       # [3, 4, 5]
length = len(nums)       # 9

# Python lists hold mixed types (but shouldn't):
mixed = [1, "hello", 3.14, None]`}
        rustCode={`fn main() {
    // Creating vectors
    let empty: Vec<i32> = Vec::new();
    let nums = vec![1, 2, 3, 4, 5];
    let zeros = vec![0; 10];
    let ranged: Vec<i32> = (1..6).collect();

    // Appending
    let mut nums = nums;  // must be mutable
    nums.push(6);
    nums.extend([7, 8, 9]);

    // Accessing
    let first = nums[0];           // 1 (panics if out of bounds)
    let last = nums.last();        // Some(&9)
    let middle = &nums[2..5];      // &[3, 4, 5] (a slice)
    let length = nums.len();       // 9

    // Safe access that doesn't panic
    let maybe = nums.get(100);     // None
    let safe = nums.get(0);        // Some(&1)
}`}
      />

      <NoteBlock title="Homogeneous types" type="pythonista">
        <p>
          A <code>Vec&lt;i32&gt;</code> can only hold <code>i32</code> values.
          This constraint means elements are stored inline (no per-element
          heap allocation), making iteration dramatically faster. If you need
          mixed types, use an enum: <code>Vec&lt;Value&gt;</code> where
          <code>Value</code> is an enum with variants for each type.
        </p>
      </NoteBlock>

      <h2>Common Operations</h2>

      <CodeBlock
        language="rust"
        title="Essential Vec methods"
        code={`fn main() {
    let mut v = vec![3, 1, 4, 1, 5, 9, 2, 6];

    // Sorting
    v.sort();                    // [1, 1, 2, 3, 4, 5, 6, 9]
    v.sort_by(|a, b| b.cmp(a)); // reverse: [9, 6, 5, 4, 3, 2, 1, 1]

    // Searching
    let has_five = v.contains(&5);     // true
    let pos = v.iter().position(|&x| x == 4); // Some(3)

    // Removing
    let removed = v.remove(0);        // removes and returns 9
    v.retain(|&x| x > 2);             // keep only elements > 2
    println!("{:?}", v);               // [6, 5, 4, 3]

    // Deduplication (requires sorted)
    let mut duped = vec![1, 1, 2, 3, 3, 3, 4];
    duped.dedup();                     // [1, 2, 3, 4]

    // Splitting and joining
    let (left, right) = duped.split_at(2);  // [1, 2] and [3, 4]
    println!("Left: {:?}, Right: {:?}", left, right);

    // Capacity management
    let mut big = Vec::with_capacity(1000); // pre-allocate
    println!("Len: {}, Cap: {}", big.len(), big.capacity());
    big.push(42);
    println!("Len: {}, Cap: {}", big.len(), big.capacity());
    // Len: 1, Cap: 1000  — no reallocation needed
}`}
      />

      <h2>Iteration Patterns</h2>

      <PythonRustCompare
        title="Iterating over vectors"
        description="Python and Rust share similar iteration patterns, but Rust makes ownership explicit."
        pythonCode={`nums = [10, 20, 30, 40, 50]

# Simple iteration
for n in nums:
    print(n)

# With index
for i, n in enumerate(nums):
    print(f"{i}: {n}")

# Transforming (list comprehension)
doubled = [n * 2 for n in nums]

# Filtering
big = [n for n in nums if n > 25]

# Reducing
total = sum(nums)

# The list is still usable after iteration
print(nums)  # [10, 20, 30, 40, 50]`}
        rustCode={`fn main() {
    let nums = vec![10, 20, 30, 40, 50];

    // Borrow iteration (&) — vec stays usable
    for n in &nums {
        println!("{}", n);
    }

    // With index
    for (i, n) in nums.iter().enumerate() {
        println!("{}: {}", i, n);
    }

    // Transforming (iterator + collect)
    let doubled: Vec<i32> = nums.iter().map(|n| n * 2).collect();

    // Filtering
    let big: Vec<&i32> = nums.iter().filter(|&&n| n > 25).collect();

    // Reducing
    let total: i32 = nums.iter().sum();

    // nums is still usable — we only borrowed
    println!("{:?}", nums);

    // Consuming iteration (no & ) — vec is moved
    for n in nums {
        println!("Consumed: {}", n);
    }
    // nums is gone — can't use it anymore
}`}
      />

      <NoteBlock title="Three iteration modes" type="warning">
        <p>
          <code>&amp;vec</code> or <code>vec.iter()</code>: borrows elements
          (<code>&amp;T</code>), vec stays usable.
          <code>&amp;mut vec</code> or <code>vec.iter_mut()</code>: mutable
          borrows (<code>&amp;mut T</code>), can modify in place.
          <code>vec</code> (no <code>&amp;</code>) or <code>vec.into_iter()</code>:
          moves elements out, consuming the vec. Choose carefully.
        </p>
      </NoteBlock>

      <h2>Vec and Slices</h2>

      <CodeBlock
        language="rust"
        title="Slices: borrowed views into contiguous data"
        code={`fn sum_slice(data: &[i32]) -> i32 {
    // &[i32] accepts both &Vec<i32> and &[i32]
    data.iter().sum()
}

fn main() {
    let v = vec![1, 2, 3, 4, 5];

    // Vec auto-derefs to a slice
    println!("Sum: {}", sum_slice(&v));       // 15

    // Slice a portion
    println!("Sum: {}", sum_slice(&v[1..4])); // 9

    // Arrays also work
    let arr = [10, 20, 30];
    println!("Sum: {}", sum_slice(&arr));     // 60

    // Rule: accept &[T] in function parameters, not &Vec<T>
    // This makes your functions more flexible.
}`}
      />

      <NoteBlock title="Prefer &[T] over &Vec<T>" type="tip">
        <p>
          When a function only needs to read a sequence, accept
          <code>&amp;[T]</code> instead of <code>&amp;Vec&lt;T&gt;</code>.
          Slices work with vectors, arrays, and sub-ranges. This is like
          accepting <code>Sequence[T]</code> instead of <code>list[T]</code>
          in Python type hints — more general, equally fast.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Implement a running average"
        difficulty="medium"
        problem={`Write a function running_average(data: &[f64]) -> Vec<f64> that returns
a new vector where each element is the average of all elements up to and
including that index.

For input [1.0, 3.0, 5.0, 7.0], the output should be:
- Index 0: avg of [1.0] = 1.0
- Index 1: avg of [1.0, 3.0] = 2.0
- Index 2: avg of [1.0, 3.0, 5.0] = 3.0
- Index 3: avg of [1.0, 3.0, 5.0, 7.0] = 4.0

Result: [1.0, 2.0, 3.0, 4.0]

Bonus: can you do it in one pass without re-summing each time?`}
        solution={`fn running_average(data: &[f64]) -> Vec<f64> {
    let mut result = Vec::with_capacity(data.len());
    let mut sum = 0.0;

    for (i, &val) in data.iter().enumerate() {
        sum += val;
        result.push(sum / (i + 1) as f64);
    }

    result
}

// Alternative with scan (more functional style):
fn running_average_functional(data: &[f64]) -> Vec<f64> {
    data.iter()
        .enumerate()
        .scan(0.0, |sum, (i, &val)| {
            *sum += val;
            Some(*sum / (i + 1) as f64)
        })
        .collect()
}

fn main() {
    let data = vec![1.0, 3.0, 5.0, 7.0];
    println!("{:?}", running_average(&data));
    // [1.0, 2.0, 3.0, 4.0]

    println!("{:?}", running_average_functional(&data));
    // [1.0, 2.0, 3.0, 4.0]

    println!("{:?}", running_average(&[]));
    // []
}`}
      />
    </div>
  );
}
