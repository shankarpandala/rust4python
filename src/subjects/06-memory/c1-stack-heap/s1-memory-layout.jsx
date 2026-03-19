import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function MemoryLayout() {
  return (
    <div className="prose-rust">
      <h1>Memory Layout in Rust</h1>

      <p>
        In Python, every value lives on the heap. Integers, strings, lists — everything
        is a heap-allocated object with a reference count. Rust gives you explicit control
        over whether data lives on the stack or the heap, and that distinction is one of
        the biggest reasons Rust code runs faster and uses less memory.
      </p>

      <ConceptBlock title="Stack vs Heap: The Two Memory Regions">
        <p>
          The <strong>stack</strong> is a fixed-size, last-in-first-out region of memory.
          Allocating and deallocating on the stack is essentially free — it just moves a
          pointer. The <strong>heap</strong> is a large, flexible region where you can
          allocate arbitrarily sized data, but allocation requires finding free space
          and deallocation requires bookkeeping.
        </p>
        <p>
          In Rust, values with a known, fixed size at compile time live on the stack by
          default. Values with dynamic or unknown size (like <code>String</code> or{' '}
          <code>Vec</code>) store a small header on the stack that points to data on the heap.
        </p>
      </ConceptBlock>

      <h2>Python: Everything Is on the Heap</h2>

      <PythonRustCompare
        title="Where values live in memory"
        description="Python allocates every object on the heap with reference counting. Rust puts fixed-size values directly on the stack."
        pythonCode={`# Python: ALL values are heap-allocated objects
x = 42          # heap: PyObject { refcount, type, value: 42 }
y = 3.14        # heap: PyObject { refcount, type, value: 3.14 }
name = "Alice"  # heap: PyObject { refcount, type, ..., data }
nums = [1,2,3]  # heap: PyObject + separate heap array

# Each object has ~28 bytes of overhead
# (refcount + type pointer + gc header)
import sys
print(sys.getsizeof(42))    # 28 bytes for a single int!
print(sys.getsizeof(3.14))  # 24 bytes for a float`}
        rustCode={`fn main() {
    // Stack-allocated: zero overhead, instant alloc/dealloc
    let x: i32 = 42;       // 4 bytes on the stack
    let y: f64 = 3.14;     // 8 bytes on the stack
    let flag: bool = true;  // 1 byte on the stack

    // Heap-allocated: stack header + heap data
    let name = String::from("Alice");
    // Stack: { ptr, len: 5, capacity: 5 } = 24 bytes
    // Heap:  "Alice" = 5 bytes

    let nums = vec![1, 2, 3];
    // Stack: { ptr, len: 3, capacity: 3 } = 24 bytes
    // Heap:  [1, 2, 3] = 12 bytes (3 × 4-byte i32)
}`}
      />

      <NoteBlock type="pythonista" title="Why stack allocation matters">
        When Python creates the integer <code>42</code>, it allocates a 28-byte object
        on the heap and the garbage collector must track it. When Rust creates{' '}
        <code>let x: i32 = 42</code>, it writes 4 bytes on the stack — no allocation,
        no tracking. Multiply this by millions of values in a data pipeline and the
        difference is enormous.
      </NoteBlock>

      <h2>What Lives Where in Rust</h2>

      <CodeBlock
        language="rust"
        title="Stack vs heap: a visual mental model"
        code={`fn demonstrate_layout() {
    // === STACK VALUES (fixed size, known at compile time) ===
    let a: i32 = 10;           // 4 bytes
    let b: f64 = 2.718;        // 8 bytes
    let c: (i32, i32) = (1,2); // 8 bytes (two i32s)
    let d: [u8; 4] = [0; 4];   // 4 bytes (fixed-size array)

    // === HEAP VALUES (dynamic size) ===
    // These types store a "fat pointer" on the stack
    // that points to heap-allocated data:
    let s: String = String::from("hello");
    //   Stack: { ptr: 0x..., len: 5, cap: 5 }  (24 bytes)
    //   Heap:  [b'h', b'e', b'l', b'l', b'o']  (5 bytes)

    let v: Vec<i32> = vec![1, 2, 3, 4, 5];
    //   Stack: { ptr: 0x..., len: 5, cap: 5 }  (24 bytes)
    //   Heap:  [1, 2, 3, 4, 5]                 (20 bytes)

    // === STACK REFERENCE TO HEAP DATA ===
    let slice: &[i32] = &v[1..3];
    //   Stack: { ptr: 0x..., len: 2 }  (16 bytes)
    //   Points into v's heap data — no new allocation!
}`}
      />

      <h2>Structs: Stack by Default</h2>

      <CodeBlock
        language="rust"
        title="Structs are stack-allocated when all fields are sized"
        code={`struct Point {
    x: f64,  // 8 bytes
    y: f64,  // 8 bytes
}
// Total: 16 bytes on the stack. No heap allocation!

struct DataRow {
    id: u64,          // 8 bytes on stack
    value: f64,       // 8 bytes on stack
    label: String,    // 24 bytes on stack (pointer to heap data)
}
// Stack: 40 bytes. Heap: the string's character data.

fn main() {
    // This entire struct lives on the stack
    let p = Point { x: 1.0, y: 2.0 };

    // Stack part is 40 bytes; label's chars are on the heap
    let row = DataRow {
        id: 1,
        value: 3.14,
        label: String::from("train"),
    };

    // Arrays of stack types are also on the stack
    let points: [Point; 3] = [
        Point { x: 0.0, y: 0.0 },
        Point { x: 1.0, y: 1.0 },
        Point { x: 2.0, y: 2.0 },
    ];
    // 3 × 16 = 48 bytes, all on the stack
}`}
      />

      <NoteBlock type="tip" title="Use std::mem::size_of to inspect sizes">
        You can check the stack size of any type at compile time with{' '}
        <code>std::mem::size_of::&lt;T&gt;()</code>. For example,{' '}
        <code>size_of::&lt;i32&gt;()</code> is 4,{' '}
        <code>size_of::&lt;String&gt;()</code> is 24 (the stack portion only), and{' '}
        <code>size_of::&lt;Option&lt;i32&gt;&gt;()</code> is 8 (Rust uses niche optimization).
      </NoteBlock>

      <h2>Why This Matters for Performance</h2>

      <PythonRustCompare
        title="Processing a million points"
        description="Python allocates millions of heap objects; Rust uses a single contiguous allocation."
        pythonCode={`# Python: 1 million Point objects
# Each is a separate heap allocation
class Point:
    def __init__(self, x, y):
        self.x = x  # heap-alloc float
        self.y = y  # heap-alloc float

# ~1 million heap allocations,
# scattered in memory (cache-unfriendly)
points = [Point(float(i), float(i))
          for i in range(1_000_000)]

# Memory: ~100+ MB (object overhead)
# Access pattern: pointer chasing`}
        rustCode={`struct Point { x: f64, y: f64 }

fn main() {
    // ONE heap allocation: contiguous block
    // of 16 million bytes (1M × 16 bytes)
    let points: Vec<Point> = (0..1_000_000)
        .map(|i| Point {
            x: i as f64,
            y: i as f64,
        })
        .collect();

    // Memory: exactly 16 MB (no overhead)
    // Access pattern: sequential, cache-friendly
}`}
      />

      <NoteBlock type="warning" title="Stack size is limited">
        The default stack size is typically 8 MB. Do not allocate huge arrays on
        the stack (e.g., <code>[0u8; 10_000_000]</code>). Use <code>Vec</code> for
        large collections — it stores data on the heap where space is plentiful.
      </NoteBlock>

      <ExerciseBlock
        title="Predict the Memory Layout"
        difficulty="intermediate"
        problem={`For each Rust declaration below, predict:
(a) how many bytes are on the stack, and
(b) whether any heap allocation occurs.

1. let x: u8 = 255;
2. let pair: (f32, f32) = (1.0, 2.0);
3. let v: Vec<u8> = vec![0; 1000];
4. let s: &str = "hello";
5. let owned: String = String::from("hello");

Hint: use std::mem::size_of to verify your answers in a Rust program.`}
        solution={`1. x: u8 → stack: 1 byte, no heap allocation.

2. pair: (f32, f32) → stack: 8 bytes (two 4-byte floats), no heap.

3. v: Vec<u8> → stack: 24 bytes (ptr + len + capacity), heap: 1000 bytes.

4. s: &str → stack: 16 bytes (pointer + length, a "fat pointer"), no heap.
   The string data "hello" lives in the compiled binary's read-only segment.

5. owned: String → stack: 24 bytes (ptr + len + capacity), heap: 5 bytes.

Key insight: String and Vec always have 24 bytes on the stack (on 64-bit),
regardless of how much data is on the heap. &str is 16 bytes (no capacity field).`}
      />
    </div>
  );
}
