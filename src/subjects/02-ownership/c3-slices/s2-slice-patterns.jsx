import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

const SlicePatterns = () => {
  return (
    <div className="prose-rust">
      <h1>Slice Patterns</h1>

      <p>
        Slices are one of Rust's most powerful features — they give you a <em>view</em> into
        a contiguous sequence of elements without copying. If you come from Python, you
        use slicing all the time (<code>list[1:3]</code>), but there's a critical
        difference: Python slicing creates a new list, while Rust slicing creates a
        zero-cost reference into the original data.
      </p>

      <ConceptBlock title="What Is a Slice?">
        <p>
          A slice (<code>&[T]</code>) is a reference to a contiguous section of an array
          or vector. It consists of just two values: a pointer to the first element and a
          length. Slices don't own data — they borrow it. This makes them extremely cheap
          to create and pass around.
        </p>
      </ConceptBlock>

      <h2>Python Slicing vs Rust Slicing</h2>

      <PythonRustCompare
        title="Slicing: copy vs view"
        description="Python slicing creates a new list (O(n) copy). Rust slicing creates a reference (O(1) view)."
        pythonCode={`data = [10, 20, 30, 40, 50]

# Python slice COPIES the elements
chunk = data[1:4]
print(chunk)      # [20, 30, 40]

# chunk is independent — modifying it
# does NOT affect data
chunk[0] = 999
print(data)       # [10, 20, 30, 40, 50]
print(chunk)      # [999, 30, 40]

# This copying is O(n) and allocates
# For large arrays, it's expensive`}
        rustCode={`fn main() {
    let data = vec![10, 20, 30, 40, 50];

    // Rust slice BORROWS the elements
    let chunk: &[i32] = &data[1..4];
    println!("{:?}", chunk); // [20, 30, 40]

    // chunk is a VIEW into data — no copy!
    // It's just a pointer + length (16 bytes)
    // regardless of how many elements

    // Because it's a borrow, you can't
    // modify data while chunk exists:
    // data.push(60); // ERROR while chunk borrowed

    println!("{:?}", data); // still accessible
}`}
      />

      <NoteBlock type="pythonista" title="NumPy slicing is closer to Rust">
        <p>
          If you use NumPy, you already understand views vs copies. NumPy's
          <code> arr[1:4]</code> creates a view (like Rust), not a copy (like Python lists).
          Rust applies this same zero-copy view concept to all slice types.
        </p>
      </NoteBlock>

      <h2>Creating Slices</h2>

      <CodeBlock
        language="rust"
        title="Slice syntax with ranges"
        code={`fn main() {
    let v = vec![1, 2, 3, 4, 5, 6, 7, 8];

    let full: &[i32] = &v[..];      // all elements [1,2,3,4,5,6,7,8]
    let first_three: &[i32] = &v[..3];  // [1, 2, 3]
    let last_three: &[i32] = &v[5..];   // [6, 7, 8]
    let middle: &[i32] = &v[2..5];      // [3, 4, 5]

    println!("full: {:?}", full);
    println!("first 3: {:?}", first_three);
    println!("last 3: {:?}", last_three);
    println!("middle: {:?}", middle);

    // Slices from arrays work the same way
    let arr = [10, 20, 30, 40, 50];
    let slice: &[i32] = &arr[1..4];  // [20, 30, 40]
    println!("array slice: {:?}", slice);
}`}
      />

      <h2>Slices as Function Parameters</h2>

      <CodeBlock
        language="rust"
        title="Take &[T] for maximum flexibility"
        code={`// Takes a slice — works with Vec, array, or any contiguous data
fn sum(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}

fn find_max(values: &[f64]) -> Option<f64> {
    values.iter().cloned().reduce(f64::max)
}

fn main() {
    // From a Vec
    let vec_data = vec![1, 2, 3, 4, 5];
    println!("Vec sum: {}", sum(&vec_data));

    // From an array
    let arr_data = [10, 20, 30];
    println!("Array sum: {}", sum(&arr_data));

    // From a sub-slice
    println!("Partial sum: {}", sum(&vec_data[1..4]));

    // find_max with floats
    let readings = vec![23.1, 19.8, 25.4, 21.0];
    println!("Max: {:?}", find_max(&readings));
}`}
      />

      <NoteBlock type="tip" title="Prefer &[T] over &Vec<T> in function signatures">
        <p>
          Just as <code>&str</code> is preferred over <code>&String</code> for string
          parameters, <code>&[T]</code> is preferred over <code>&Vec&lt;T&gt;</code>.
          A <code>&[T]</code> slice accepts data from <code>Vec</code>, arrays, and other
          slices. A <code>&Vec&lt;T&gt;</code> only accepts <code>Vec</code> references.
          More flexible, same performance.
        </p>
      </NoteBlock>

      <h2>Mutable Slices</h2>

      <CodeBlock
        language="rust"
        title="Modifying data through &mut [T]"
        code={`fn double_all(values: &mut [i32]) {
    for v in values.iter_mut() {
        *v *= 2;
    }
}

fn zero_fill(buffer: &mut [u8]) {
    for byte in buffer.iter_mut() {
        *byte = 0;
    }
}

fn main() {
    let mut data = vec![1, 2, 3, 4, 5];

    // Mutate a sub-slice
    double_all(&mut data[1..4]);
    println!("{:?}", data); // [1, 4, 6, 8, 5]

    // Mutate the whole thing
    double_all(&mut data);
    println!("{:?}", data); // [2, 8, 12, 16, 10]

    // Zero out a buffer
    let mut buffer = vec![0xFFu8; 8];
    zero_fill(&mut buffer[2..6]);
    println!("{:?}", buffer); // [255, 255, 0, 0, 0, 0, 255, 255]
}`}
      />

      <h2>String Slices Revisited</h2>

      <CodeBlock
        language="rust"
        title="&str is a slice of String data"
        code={`fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return &s[..i];
        }
    }
    s // whole string is one word
}

fn main() {
    let sentence = String::from("hello beautiful world");

    // &str slices into the String
    let word = first_word(&sentence);
    println!("First word: {}", word); // "hello"

    // Multiple non-overlapping slices are fine
    let first = &sentence[0..5];    // "hello"
    let last = &sentence[16..21];   // "world"
    println!("{} ... {}", first, last);

    // But be careful with UTF-8 boundaries!
    let emoji = String::from("Hello 🌍");
    // let bad = &emoji[6..7]; // PANIC: byte index 7 is not a char boundary
    let good = &emoji[0..5];   // "Hello" — ASCII is safe
    println!("{}", good);
}`}
      />

      <NoteBlock type="warning" title="String slicing panics on invalid UTF-8 boundaries">
        <p>
          Rust strings are UTF-8. Slicing with byte indices that fall in the middle of
          a multi-byte character causes a runtime panic. For safe character-level slicing,
          use <code>.chars()</code> iterator methods. For ASCII-only text, byte slicing
          is always safe.
        </p>
      </NoteBlock>

      <h2>Common Slice Methods</h2>

      <CodeBlock
        language="rust"
        title="Useful methods on slices"
        code={`fn main() {
    let data = vec![3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
    let slice = &data[..];

    // Querying
    println!("len: {}", slice.len());           // 10
    println!("empty: {}", slice.is_empty());     // false
    println!("contains 9: {}", slice.contains(&9)); // true
    println!("first: {:?}", slice.first());      // Some(3)
    println!("last: {:?}", slice.last());        // Some(3)

    // Splitting
    let (left, right) = slice.split_at(5);
    println!("left: {:?}", left);   // [3, 1, 4, 1, 5]
    println!("right: {:?}", right); // [9, 2, 6, 5, 3]

    // Chunking
    for chunk in slice.chunks(3) {
        println!("chunk: {:?}", chunk);
    }
    // [3, 1, 4], [1, 5, 9], [2, 6, 5], [3]

    // Windows (sliding window)
    for window in slice.windows(3) {
        println!("window: {:?}", window);
    }
    // [3,1,4], [1,4,1], [4,1,5], [1,5,9], ...

    // Searching
    let pos = slice.iter().position(|&x| x == 9);
    println!("position of 9: {:?}", pos); // Some(5)

    // Sorting (on a mutable slice)
    let mut sortable = data.clone();
    sortable.sort();
    println!("sorted: {:?}", sortable);
}`}
      />

      <PythonRustCompare
        title="Slice operations compared"
        description="Common slice/list operations mapped between Python and Rust."
        pythonCode={`data = [3, 1, 4, 1, 5, 9]

# Slicing (creates copies!)
first_half = data[:3]
second_half = data[3:]

# Reversing
rev = data[::-1]

# Finding
idx = data.index(5)

# Checking
has_9 = 9 in data

# Iterating in chunks (no built-in)
import itertools
chunks = list(itertools.batched(data, 2))`}
        rustCode={`fn main() {
    let data = vec![3, 1, 4, 1, 5, 9];

    // Slicing (creates views!)
    let first_half = &data[..3];
    let second_half = &data[3..];

    // Reversing (iterator, no copy)
    let rev: Vec<_> = data.iter().rev().collect();

    // Finding
    let idx = data.iter().position(|&x| x == 5);

    // Checking
    let has_9 = data.contains(&9);

    // Iterating in chunks (built-in!)
    for chunk in data.chunks(2) {
        println!("{:?}", chunk);
    }
}`}
      />

      <ExerciseBlock
        title="Sliding Window Average"
        difficulty="easy"
        problem={`Write a function moving_average that takes a &[f64] and a window
size, and returns a Vec<f64> of averages for each window position.

Example: moving_average(&[1.0, 2.0, 3.0, 4.0, 5.0], 3)
should return [2.0, 3.0, 4.0]

Hint: use the .windows() method on slices.`}
        solution={`fn moving_average(data: &[f64], window_size: usize) -> Vec<f64> {
    data.windows(window_size)
        .map(|w| w.iter().sum::<f64>() / w.len() as f64)
        .collect()
}

fn main() {
    let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
    let avgs = moving_average(&data, 3);
    println!("{:?}", avgs); // [2.0, 3.0, 4.0]

    // Works with any slice — no copy of the input data
    let readings = vec![10.0, 20.0, 15.0, 25.0, 30.0, 20.0];
    let smoothed = moving_average(&readings, 2);
    println!("{:?}", smoothed); // [15.0, 17.5, 20.0, 27.5, 25.0]
}`}
      />

      <ExerciseBlock
        title="Split Without Copying"
        difficulty="medium"
        problem={`Write a function split_at_value that takes a &[i32] and a target value,
and returns two slices: everything before the first occurrence of the target,
and everything after it (excluding the target itself). Return None if the
target is not found.

fn split_at_value(data: &[i32], target: i32) -> Option<(&[i32], &[i32])>

Example: split_at_value(&[1, 2, 3, 4, 5], 3) returns Some(([1, 2], [4, 5]))

Important: the returned slices must be views into the original data, not copies.`}
        solution={`fn split_at_value(data: &[i32], target: i32) -> Option<(&[i32], &[i32])> {
    let pos = data.iter().position(|&x| x == target)?;
    Some((&data[..pos], &data[pos + 1..]))
}

fn main() {
    let data = vec![1, 2, 3, 4, 5];

    if let Some((before, after)) = split_at_value(&data, 3) {
        println!("before: {:?}", before); // [1, 2]
        println!("after: {:?}", after);   // [4, 5]
    }

    // No copies were made — before and after are views into data
    println!("original: {:?}", data); // [1, 2, 3, 4, 5]

    // Not found case
    let result = split_at_value(&data, 99);
    println!("not found: {:?}", result); // None
}`}
      />
    </div>
  );
};

export default SlicePatterns;
