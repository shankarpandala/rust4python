import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function BasicTypes() {
  return (
    <div className="prose-rust">
      <h1>Basic Types</h1>

      <p>
        Python has a small set of built-in types with few surprises: <code>int</code>,
        <code>float</code>, <code>str</code>, <code>bool</code>, <code>list</code>,
        <code>tuple</code>. Rust has a richer type system with explicit control over
        memory layout and size. Knowing exactly how many bytes your integer uses might
        seem pedantic, but it is essential for performance-critical code and interacting
        with C/hardware/GPUs.
      </p>

      <ConceptBlock title="Scalar Types in Rust">
        <p>
          Rust has four categories of scalar (single-value) types:
        </p>
        <ul>
          <li><strong>Integers:</strong> i8, i16, i32, i64, i128, isize (signed) and u8, u16, u32, u64, u128, usize (unsigned)</li>
          <li><strong>Floats:</strong> f32, f64</li>
          <li><strong>Boolean:</strong> bool (true/false)</li>
          <li><strong>Character:</strong> char (4-byte Unicode scalar value)</li>
        </ul>
        <p>
          The number in the type name tells you how many bits it uses. <code>i32</code> is
          a 32-bit signed integer. <code>u8</code> is an 8-bit unsigned integer (0-255).
          This explicitness means you always know exactly how much memory a value occupies.
        </p>
      </ConceptBlock>

      <h2>Integers</h2>

      <PythonRustCompare
        title="Integer types"
        description="Python has one unlimited-precision int. Rust has many fixed-size integer types for explicit memory control."
        pythonCode={`# Python: one int type, unlimited size
x = 42
big = 2 ** 1000  # works fine!

# No overflow — Python grows the int
print(big)  # a number with 302 digits

# You never think about how many bytes
# an integer takes up

# Type checking
print(type(x))    # <class 'int'>
print(isinstance(x, int))  # True`}
        rustCode={`fn main() {
    // Rust: explicit integer sizes
    let a: i8  = 127;       // -128 to 127
    let b: u8  = 255;       // 0 to 255
    let c: i32 = 42;        // default int type
    let d: i64 = 1_000_000; // underscores for readability
    let e: u64 = 42;        // unsigned 64-bit

    // isize/usize: pointer-sized (64-bit on
    // modern systems), used for indexing
    let index: usize = 0;

    // Integer overflow is caught in debug:
    // let overflow: u8 = 256; // ERROR

    // Literal suffixes
    let x = 42_i64;  // i64
    let y = 0xff_u8;  // hex: 255
    let z = 0b1010;   // binary: 10
    let w = 0o77;     // octal: 63
}`}
      />

      <NoteBlock type="pythonista" title="Why so many integer types?">
        Python's unlimited-precision integers are convenient but slow — each
        arithmetic operation checks the size and may allocate memory. Rust's fixed-size
        integers map directly to CPU registers and compile to single machine
        instructions. When processing millions of data points, this difference matters.
        For most code, <code>i32</code> or <code>i64</code> is the right choice.
        Use <code>usize</code> for array indices and lengths.
      </NoteBlock>

      <h2>Floating Point Numbers</h2>

      <PythonRustCompare
        title="Float types"
        description="Python has one float (64-bit). Rust gives you f32 and f64."
        pythonCode={`# Python: one float type (64-bit IEEE 754)
x = 3.14
y = 2.0e10     # scientific notation
z = float('inf')

# Floating point imprecision exists
print(0.1 + 0.2)  # 0.30000000000000004

# Math operations
import math
print(math.sqrt(2.0))
print(math.pi)
print(abs(-3.5))`}
        rustCode={`fn main() {
    // Rust: f32 (32-bit) and f64 (64-bit)
    let x: f64 = 3.14;     // default float
    let y: f32 = 2.0;      // 32-bit float
    let z = 2.0e10_f64;    // scientific

    // Same imprecision (IEEE 754)
    println!("{}", 0.1_f64 + 0.2); // 0.3...04

    // Math operations are methods
    println!("{}", 2.0_f64.sqrt());
    println!("{}", std::f64::consts::PI);
    println!("{}", (-3.5_f64).abs());

    // f32 vs f64: use f32 for GPU/ML
    // tensors, f64 for general computation
    let precise: f64 = 1.0 / 3.0;
    let fast: f32 = 1.0 / 3.0;
    println!("f64: {:.10}", precise);
    println!("f32: {:.10}", fast);
}`}
      />

      <NoteBlock type="tip" title="f32 vs f64 in ML">
        In machine learning, <code>f32</code> is standard for model weights and tensors
        because GPUs process 32-bit floats much faster, and the extra precision of
        f64 rarely matters for neural networks. When doing scientific computation or
        financial calculations, prefer <code>f64</code>. Rust defaults to <code>f64</code>.
      </NoteBlock>

      <h2>Booleans and Characters</h2>

      <CodeBlock
        language="rust"
        title="bool and char types"
        code={`fn main() {
    // bool: true or false (lowercase!)
    let is_active: bool = true;
    let is_empty = false;

    // No truthy/falsy — must be explicit
    let count = 5;
    // if count { }          // ERROR
    if count > 0 { }         // OK
    if is_active { }         // OK

    // Boolean operations
    let both = is_active && !is_empty;
    let either = is_active || is_empty;
    println!("both: {}, either: {}", both, either);

    // char: a Unicode scalar value (4 bytes!)
    let letter: char = 'A';
    let emoji: char = '🦀';     // Rust's mascot!
    let chinese: char = '中';

    // char is NOT the same as a single-char string
    let c: char = 'A';        // char — 4 bytes
    let s: &str = "A";        // string slice — 1+ bytes

    println!("letter: {}, emoji: {}", letter, emoji);
    println!("Is alphabetic: {}", letter.is_alphabetic());
    println!("Is digit: {}", '7'.is_ascii_digit());
}`}
      />

      <NoteBlock type="pythonista" title="char vs str">
        Python has no separate character type — a single character is just a
        <code>str</code> of length 1. Rust distinguishes between <code>char</code>
        (a single Unicode scalar, always 4 bytes, uses single quotes) and
        <code>&amp;str</code>/<code>String</code> (a sequence of UTF-8 bytes, uses
        double quotes). This distinction matters when you need to work with
        individual characters vs byte strings.
      </NoteBlock>

      <h2>Strings: String vs &amp;str</h2>

      <p>
        Strings in Rust are more complex than in Python because Rust gives you control
        over memory. There are two main string types, and understanding the difference
        early prevents confusion later.
      </p>

      <CodeBlock
        language="rust"
        title="Two string types: String and &str"
        code={`fn main() {
    // &str — a string SLICE (borrowed reference)
    // Fixed-size view into string data. Cannot grow.
    let greeting: &str = "hello, world";

    // String — an owned, heap-allocated string
    // Can grow, shrink, and be modified.
    let mut name = String::from("Alice");
    name.push_str(" Smith");
    println!("{}", name); // Alice Smith

    // Converting between them
    let s: &str = "hello";
    let owned: String = s.to_string();     // &str → String
    let owned2: String = String::from(s);  // same thing
    let borrowed: &str = &owned;           // String → &str

    // String formatting creates a String
    let msg = format!("Hello, {}!", name);
    println!("{}", msg);

    // Common string methods (similar to Python)
    let text = "  Hello, World!  ";
    println!("{}", text.trim());              // trim whitespace
    println!("{}", text.to_uppercase());      // uppercase
    println!("{}", text.contains("World"));   // true
    println!("{}", text.replace("World", "Rust"));

    let parts: Vec<&str> = "a,b,c".split(',').collect();
    println!("{:?}", parts); // ["a", "b", "c"]
}`}
      />

      <h2>Tuples and Arrays</h2>

      <PythonRustCompare
        title="Tuples and arrays"
        description="Rust tuples are similar to Python's, but arrays are fixed-size and single-type (unlike Python lists)."
        pythonCode={`# Python tuple: immutable, mixed types
point = (10, 20)
record = ("Alice", 30, True)

# Destructuring
x, y = point
name, age, active = record

# Access by index
print(point[0])  # 10

# Python list: mutable, mixed types
nums = [1, 2, 3, 4, 5]
mixed = [1, "hello", True]
nums.append(6)
print(len(nums))  # 6`}
        rustCode={`fn main() {
    // Rust tuple: fixed-size, mixed types
    let point: (i32, i32) = (10, 20);
    let record = ("Alice", 30, true);

    // Destructuring
    let (x, y) = point;
    let (name, age, active) = record;

    // Access by index (dot notation!)
    println!("{}", point.0); // 10
    println!("{}", point.1); // 20

    // Rust array: fixed-size, SINGLE type
    let nums: [i32; 5] = [1, 2, 3, 4, 5];
    // [type; length] — length is part of type!
    let zeros = [0; 10]; // ten zeros

    println!("{}", nums[0]); // 1
    println!("{}", nums.len()); // 5

    // For growable collections, use Vec
    let mut v = vec![1, 2, 3];
    v.push(4);
    println!("{:?}", v); // [1, 2, 3, 4]
}`}
      />

      <NoteBlock type="warning" title="Arrays vs Vec">
        Rust arrays (<code>[i32; 5]</code>) have a fixed length known at compile time
        and live on the stack. For a growable, heap-allocated collection like Python's
        <code>list</code>, use <code>Vec&lt;T&gt;</code>. You will use <code>Vec</code>
        far more often than arrays, just as you use <code>list</code> far more than
        <code>tuple</code> in Python.
      </NoteBlock>

      <h2>Type Annotations</h2>

      <CodeBlock
        language="rust"
        title="Type annotation syntax"
        code={`fn main() {
    // Variable annotations
    let x: i32 = 42;
    let name: &str = "Alice";
    let scores: Vec<f64> = vec![95.5, 87.0, 92.3];

    // Function signatures (always required)
    fn add(a: i32, b: i32) -> i32 {
        a + b
    }

    // Generic type annotations
    let numbers: Vec<i32> = Vec::new();
    let lookup: std::collections::HashMap<String, i32> =
        std::collections::HashMap::new();

    // Turbofish syntax (inline type parameter)
    let parsed = "42".parse::<i32>().unwrap();
    let collected: Vec<i32> = (0..5).collect();
    // or:
    let collected = (0..5).collect::<Vec<i32>>();

    println!("{}, {}", add(2, 3), parsed);
}`}
      />

      <ExerciseBlock
        title="Type Explorer"
        difficulty="beginner"
        problem={`Write a Rust program that declares variables of each basic type and prints them:

1. An i32 integer set to your birth year
2. A u8 integer set to your age (what happens if age > 255?)
3. An f64 float set to your height in meters
4. A bool indicating whether you like Rust so far
5. A char set to the first letter of your name
6. A &str set to your favorite programming language
7. A String created by formatting your name with String::from() or format!()
8. A tuple containing (year, age, height)
9. An array of 5 i32 scores
10. A Vec<String> containing three programming languages

For each, print both the value and use {:?} debug format.

Bonus: Try assigning a value of 256 to a u8 variable and read the compiler error.`}
        solution={`\`\`\`rust
fn main() {
    let birth_year: i32 = 1995;
    let age: u8 = 29;
    let height: f64 = 1.75;
    let likes_rust: bool = true;
    let initial: char = 'A';
    let fav_lang: &str = "Python";
    let name: String = format!("Alice from {}", fav_lang);
    let info: (i32, u8, f64) = (birth_year, age, height);
    let scores: [i32; 5] = [95, 87, 92, 88, 91];
    let languages: Vec<String> = vec![
        String::from("Python"),
        String::from("Rust"),
        String::from("SQL"),
    ];

    println!("Year: {} | {:?}", birth_year, birth_year);
    println!("Age: {} | {:?}", age, age);
    println!("Height: {} | {:?}", height, height);
    println!("Likes Rust: {} | {:?}", likes_rust, likes_rust);
    println!("Initial: {} | {:?}", initial, initial);
    println!("Fav lang: {} | {:?}", fav_lang, fav_lang);
    println!("Name: {} | {:?}", name, name);
    println!("Info: {:?}", info);
    println!("Scores: {:?}", scores);
    println!("Languages: {:?}", languages);
}
\`\`\`

Trying \`let age: u8 = 256;\` gives a compile error: "literal out of range for \`u8\`". The compiler catches overflow at compile time for literals. For runtime overflow, debug mode panics and release mode wraps around (256_u8 becomes 0).`}
      />
    </div>
  );
}
