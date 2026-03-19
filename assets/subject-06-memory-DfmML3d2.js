import{j as e}from"./vendor-Dh_dlHsl.js";import{C as o,P as s,N as t,a,E as r}from"./subject-01-getting-started-DoSDK0Fn.js";function n(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Memory Layout in Rust"}),e.jsx("p",{children:"In Python, every value lives on the heap. Integers, strings, lists — everything is a heap-allocated object with a reference count. Rust gives you explicit control over whether data lives on the stack or the heap, and that distinction is one of the biggest reasons Rust code runs faster and uses less memory."}),e.jsxs(o,{title:"Stack vs Heap: The Two Memory Regions",children:[e.jsxs("p",{children:["The ",e.jsx("strong",{children:"stack"})," is a fixed-size, last-in-first-out region of memory. Allocating and deallocating on the stack is essentially free — it just moves a pointer. The ",e.jsx("strong",{children:"heap"})," is a large, flexible region where you can allocate arbitrarily sized data, but allocation requires finding free space and deallocation requires bookkeeping."]}),e.jsxs("p",{children:["In Rust, values with a known, fixed size at compile time live on the stack by default. Values with dynamic or unknown size (like ",e.jsx("code",{children:"String"})," or"," ",e.jsx("code",{children:"Vec"}),") store a small header on the stack that points to data on the heap."]})]}),e.jsx("h2",{children:"Python: Everything Is on the Heap"}),e.jsx(s,{title:"Where values live in memory",description:"Python allocates every object on the heap with reference counting. Rust puts fixed-size values directly on the stack.",pythonCode:`# Python: ALL values are heap-allocated objects
x = 42          # heap: PyObject { refcount, type, value: 42 }
y = 3.14        # heap: PyObject { refcount, type, value: 3.14 }
name = "Alice"  # heap: PyObject { refcount, type, ..., data }
nums = [1,2,3]  # heap: PyObject + separate heap array

# Each object has ~28 bytes of overhead
# (refcount + type pointer + gc header)
import sys
print(sys.getsizeof(42))    # 28 bytes for a single int!
print(sys.getsizeof(3.14))  # 24 bytes for a float`,rustCode:`fn main() {
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
}`}),e.jsxs(t,{type:"pythonista",title:"Why stack allocation matters",children:["When Python creates the integer ",e.jsx("code",{children:"42"}),", it allocates a 28-byte object on the heap and the garbage collector must track it. When Rust creates"," ",e.jsx("code",{children:"let x: i32 = 42"}),", it writes 4 bytes on the stack — no allocation, no tracking. Multiply this by millions of values in a data pipeline and the difference is enormous."]}),e.jsx("h2",{children:"What Lives Where in Rust"}),e.jsx(a,{language:"rust",title:"Stack vs heap: a visual mental model",code:`fn demonstrate_layout() {
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
}`}),e.jsx("h2",{children:"Structs: Stack by Default"}),e.jsx(a,{language:"rust",title:"Structs are stack-allocated when all fields are sized",code:`struct Point {
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
}`}),e.jsxs(t,{type:"tip",title:"Use std::mem::size_of to inspect sizes",children:["You can check the stack size of any type at compile time with"," ",e.jsx("code",{children:"std::mem::size_of::<T>()"}),". For example,"," ",e.jsx("code",{children:"size_of::<i32>()"})," is 4,"," ",e.jsx("code",{children:"size_of::<String>()"})," is 24 (the stack portion only), and"," ",e.jsx("code",{children:"size_of::<Option<i32>>()"})," is 8 (Rust uses niche optimization)."]}),e.jsx("h2",{children:"Why This Matters for Performance"}),e.jsx(s,{title:"Processing a million points",description:"Python allocates millions of heap objects; Rust uses a single contiguous allocation.",pythonCode:`# Python: 1 million Point objects
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
# Access pattern: pointer chasing`,rustCode:`struct Point { x: f64, y: f64 }

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
}`}),e.jsxs(t,{type:"warning",title:"Stack size is limited",children:["The default stack size is typically 8 MB. Do not allocate huge arrays on the stack (e.g., ",e.jsx("code",{children:"[0u8; 10_000_000]"}),"). Use ",e.jsx("code",{children:"Vec"})," for large collections — it stores data on the heap where space is plentiful."]}),e.jsx(r,{title:"Predict the Memory Layout",difficulty:"intermediate",problem:`For each Rust declaration below, predict:
(a) how many bytes are on the stack, and
(b) whether any heap allocation occurs.

1. let x: u8 = 255;
2. let pair: (f32, f32) = (1.0, 2.0);
3. let v: Vec<u8> = vec![0; 1000];
4. let s: &str = "hello";
5. let owned: String = String::from("hello");

Hint: use std::mem::size_of to verify your answers in a Rust program.`,solution:`1. x: u8 → stack: 1 byte, no heap allocation.

2. pair: (f32, f32) → stack: 8 bytes (two 4-byte floats), no heap.

3. v: Vec<u8> → stack: 24 bytes (ptr + len + capacity), heap: 1000 bytes.

4. s: &str → stack: 16 bytes (pointer + length, a "fat pointer"), no heap.
   The string data "hello" lives in the compiled binary's read-only segment.

5. owned: String → stack: 24 bytes (ptr + len + capacity), heap: 5 bytes.

Key insight: String and Vec always have 24 bytes on the stack (on 64-bit),
regardless of how much data is on the heap. &str is 16 bytes (no capacity field).`})]})}const u=Object.freeze(Object.defineProperty({__proto__:null,default:n},Symbol.toStringTag,{value:"Module"}));function i(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Box<T> — Heap Allocation on Demand"}),e.jsxs("p",{children:["In Python, every value is already on the heap, so you never think about where to put things. In Rust, values live on the stack by default. When you need heap allocation — for recursive types, large data, or trait objects — ",e.jsx("code",{children:"Box<T>"})," is the simplest tool."]}),e.jsxs(o,{title:"What Box<T> Does",children:[e.jsxs("p",{children:[e.jsx("code",{children:"Box<T>"})," allocates a value of type ",e.jsx("code",{children:"T"})," on the heap and stores a pointer to it on the stack. It has exactly one owner, and when that owner goes out of scope, both the pointer and the heap data are freed. There is zero runtime overhead beyond the allocation itself — no reference counting, no garbage collection."]}),e.jsx("p",{children:"Think of it as Rust's equivalent of Python's default behavior, but explicit and opt-in."})]}),e.jsx("h2",{children:"Basic Box Usage"}),e.jsx(s,{title:"Putting values on the heap",description:"Python always heap-allocates. In Rust, you use Box to explicitly choose heap allocation.",pythonCode:`# Python: everything is heap-allocated
x = 42          # heap-allocated PyObject
name = "Alice"  # heap-allocated PyObject

# You never choose — it's always the heap
# Every variable is essentially a pointer
# to a heap object with a refcount`,rustCode:`fn main() {
    // Stack-allocated by default
    let x: i32 = 42;        // 4 bytes on stack

    // Explicitly heap-allocated with Box
    let boxed: Box<i32> = Box::new(42);
    // Stack: 8-byte pointer
    // Heap:  4-byte i32

    // Dereference to access the value
    println!("boxed value: {}", *boxed);

    // You can also auto-deref
    println!("auto-deref: {}", boxed);
} // boxed is freed here — heap memory released`}),e.jsxs(t,{type:"pythonista",title:"Why would I ever want this?",children:["Coming from Python, explicit heap allocation seems pointless — Python does it automatically! But in Rust, stack allocation is the fast default. You use ",e.jsx("code",{children:"Box"})," when you ",e.jsx("em",{children:"need"})," the heap: recursive data structures, large values you do not want to copy, or trait objects for dynamic dispatch."]}),e.jsx("h2",{children:"Recursive Types Require Box"}),e.jsxs("p",{children:["The most common reason for ",e.jsx("code",{children:"Box"})," is recursive types. Without indirection, the compiler cannot determine the size of a type that contains itself."]}),e.jsx(a,{language:"rust",title:"Building a linked list with Box",code:`// This won't compile — infinite size!
// enum List { Cons(i32, List), Nil }

// Box provides indirection: known pointer size
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    // Build: 1 -> 2 -> 3 -> Nil
    let list = Cons(1,
        Box::new(Cons(2,
            Box::new(Cons(3,
                Box::new(Nil)
            ))
        ))
    );

    // Walk the list
    fn sum(list: &List) -> i32 {
        match list {
            Cons(val, next) => val + sum(next),
            Nil => 0,
        }
    }

    println!("Sum: {}", sum(&list)); // 6
}`}),e.jsx("h2",{children:"Box for Large Stack Values"}),e.jsx(s,{title:"Moving large data without copying",description:"Box lets you move large structs cheaply by passing an 8-byte pointer instead of copying the whole value.",pythonCode:`# Python: passing objects is always by reference
# (pointer to heap object), so it's always cheap
class LargeModel:
    def __init__(self):
        self.weights = [0.0] * 10_000
        self.biases = [0.0] * 1_000

def train(model):
    # 'model' is just a pointer — no copy
    model.weights[0] = 1.0
    return model

m = LargeModel()
m = train(m)  # cheap: pointer passed`,rustCode:`struct LargeModel {
    weights: [f64; 10_000],  // 80,000 bytes!
    biases: [f64; 1_000],   // 8,000 bytes
}

fn train(mut model: Box<LargeModel>) -> Box<LargeModel> {
    // Only an 8-byte pointer was moved — not 88KB!
    model.weights[0] = 1.0;
    model
}

fn main() {
    // Allocate on heap to avoid stack overflow
    // and enable cheap moves
    let model = Box::new(LargeModel {
        weights: [0.0; 10_000],
        biases: [0.0; 1_000],
    });

    let model = train(model); // moves 8-byte pointer
    println!("w[0] = {}", model.weights[0]);
}`}),e.jsx("h2",{children:"Box for Trait Objects"}),e.jsx(a,{language:"rust",title:"Dynamic dispatch with Box<dyn Trait>",code:`trait Summarize {
    fn summary(&self) -> String;
}

struct Article { title: String, body: String }
struct Tweet { user: String, text: String }

impl Summarize for Article {
    fn summary(&self) -> String {
        format!("{}: {}...", self.title, &self.body[..20])
    }
}

impl Summarize for Tweet {
    fn summary(&self) -> String {
        format!("@{}: {}", self.user, self.text)
    }
}

fn main() {
    // Box<dyn Trait> enables storing different types
    // in the same collection — like Python's duck typing
    let items: Vec<Box<dyn Summarize>> = vec![
        Box::new(Article {
            title: "Rust Guide".into(),
            body: "Rust is a systems language...".into(),
        }),
        Box::new(Tweet {
            user: "rustlang".into(),
            text: "Rust 2024 is here!".into(),
        }),
    ];

    for item in &items {
        println!("{}", item.summary());
    }
}`}),e.jsxs(t,{type:"tip",title:"Box has zero-cost dereferencing",children:[e.jsx("code",{children:"Box<T>"})," implements the ",e.jsx("code",{children:"Deref"})," trait, so you can call methods on ",e.jsx("code",{children:"Box<T>"})," as if it were a ",e.jsx("code",{children:"T"}),". The compiler inserts the dereference automatically. There is no runtime cost beyond the initial heap allocation."]}),e.jsx(r,{title:"Build a Binary Tree",difficulty:"intermediate",problem:`Define a binary tree enum using Box:

enum Tree {
    Leaf(i32),
    Node { left: ???, right: ??? },
}

1. Fill in the ??? types so the enum compiles.
2. Write a function fn tree_sum(tree: &Tree) -> i32 that returns the sum of all values.
3. Create a tree: Node(Leaf(1), Node(Leaf(2), Leaf(3))) and verify sum = 6.

Hint: Each child needs to be a Box<Tree> because Tree is recursive.`,solution:`enum Tree {
    Leaf(i32),
    Node { left: Box<Tree>, right: Box<Tree> },
}

fn tree_sum(tree: &Tree) -> i32 {
    match tree {
        Tree::Leaf(val) => *val,
        Tree::Node { left, right } => {
            tree_sum(left) + tree_sum(right)
        }
    }
}

fn main() {
    let tree = Tree::Node {
        left: Box::new(Tree::Leaf(1)),
        right: Box::new(Tree::Node {
            left: Box::new(Tree::Leaf(2)),
            right: Box::new(Tree::Leaf(3)),
        }),
    };

    assert_eq!(tree_sum(&tree), 6);
    println!("Sum: {}", tree_sum(&tree));
}

// Box is needed because without it, Tree would have
// infinite size — Node contains Tree which contains
// Node which contains Tree... Box breaks the cycle
// by providing a fixed-size pointer (8 bytes).`})]})}const p=Object.freeze(Object.defineProperty({__proto__:null,default:i},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Rc<T> & Arc<T> — Reference Counting"}),e.jsxs("p",{children:["Python manages memory with reference counting — every object tracks how many variables point to it, and gets freed when the count hits zero. Rust's ownership model normally requires a single owner, but sometimes you genuinely need shared ownership. That is where ",e.jsx("code",{children:"Rc<T>"})," and"," ",e.jsx("code",{children:"Arc<T>"})," come in — they bring Python-style reference counting to Rust, but as an explicit opt-in."]}),e.jsxs(o,{title:"Rc vs Arc",children:[e.jsxs("p",{children:[e.jsx("code",{children:"Rc<T>"})," (Reference Counted) provides shared ownership for ",e.jsx("strong",{children:"single-threaded"})," code. It is cheap because it uses non-atomic reference counting."]}),e.jsxs("p",{children:[e.jsx("code",{children:"Arc<T>"})," (Atomically Reference Counted) does the same for ",e.jsx("strong",{children:"multi-threaded"})," code, using atomic operations to safely update the count across threads."]}),e.jsx("p",{children:"Both are analogous to Python's built-in refcounting, but you choose when to use them rather than paying the cost on every single value."})]}),e.jsx("h2",{children:"Shared Ownership with Rc"}),e.jsx(s,{title:"Multiple owners of the same data",description:"Python lets any number of variables reference the same object. In Rust, you use Rc to get that behavior.",pythonCode:`import sys

data = [1, 2, 3, 4, 5]
print(sys.getrefcount(data))  # 2 (data + getrefcount arg)

# Multiple references — Python handles this
alias = data
print(sys.getrefcount(data))  # 3

another = data
print(sys.getrefcount(data))  # 4

# All three variables share the same list
# Freed when last reference goes away
del data
del alias
# 'another' still works — refcount is 1
print(another)  # [1, 2, 3, 4, 5]`,rustCode:`use std::rc::Rc;

fn main() {
    // Rc wraps data in a reference-counted pointer
    let data = Rc::new(vec![1, 2, 3, 4, 5]);
    println!("refcount: {}", Rc::strong_count(&data)); // 1

    // Clone the Rc — increments refcount, no data copy!
    let alias = Rc::clone(&data);
    println!("refcount: {}", Rc::strong_count(&data)); // 2

    let another = Rc::clone(&data);
    println!("refcount: {}", Rc::strong_count(&data)); // 3

    drop(data);
    drop(alias);
    // 'another' still works — refcount is 1
    println!("{:?}", another); // [1, 2, 3, 4, 5]
} // freed here when last Rc is dropped`}),e.jsxs(t,{type:"pythonista",title:"Rc::clone is NOT a deep copy",children:["Do not let the name fool you. ",e.jsx("code",{children:"Rc::clone(&data)"})," only increments the reference count — it does NOT copy the underlying data. It is equivalent to Python's ",e.jsx("code",{children:"alias = data"})," (which also just increments the refcount). An actual deep copy in Rust would use"," ",e.jsx("code",{children:".clone()"})," on the inner value directly."]}),e.jsx("h2",{children:"Rc in Graph Structures"}),e.jsx(a,{language:"rust",title:"Multiple nodes sharing the same child",code:`use std::rc::Rc;

#[derive(Debug)]
struct Node {
    value: i32,
    children: Vec<Rc<Node>>,
}

fn main() {
    // Shared child node — referenced by two parents
    let shared_child = Rc::new(Node {
        value: 3,
        children: vec![],
    });

    let parent_a = Node {
        value: 1,
        children: vec![Rc::clone(&shared_child)],
    };

    let parent_b = Node {
        value: 2,
        children: vec![Rc::clone(&shared_child)],
    };

    println!("shared_child refcount: {}", Rc::strong_count(&shared_child));
    // 3: shared_child + parent_a's ref + parent_b's ref

    println!("parent_a child: {:?}", parent_a.children[0].value); // 3
    println!("parent_b child: {:?}", parent_b.children[0].value); // 3
}`}),e.jsx("h2",{children:"Arc for Thread-Safe Sharing"}),e.jsx(s,{title:"Sharing data across threads",description:"Python's GIL makes sharing 'safe' but slow. Rust's Arc provides true thread-safe sharing.",pythonCode:`import threading

# Python: GIL makes this 'safe' but serialized
shared_data = [1, 2, 3, 4, 5]

def process(data):
    total = sum(data)
    print(f"Sum: {total}")

threads = []
for _ in range(4):
    # All threads share same list
    # GIL prevents true parallelism
    t = threading.Thread(target=process,
                         args=(shared_data,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()`,rustCode:`use std::sync::Arc;
use std::thread;

fn main() {
    // Arc = Atomic Reference Counted
    // Safe to share across threads
    let data = Arc::new(vec![1, 2, 3, 4, 5]);

    let mut handles = vec![];

    for _ in 0..4 {
        let data_clone = Arc::clone(&data);
        let handle = thread::spawn(move || {
            let total: i32 = data_clone.iter().sum();
            println!("Sum: {}", total);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
    // True parallelism — no GIL!
}`}),e.jsxs(t,{type:"warning",title:"Rc is NOT thread-safe",children:["If you try to send an ",e.jsx("code",{children:"Rc"})," to another thread, the compiler will refuse with a clear error message. This is Rust's type system protecting you: non-atomic reference counting would cause data races. Use ",e.jsx("code",{children:"Arc"})," whenever data crosses thread boundaries."]}),e.jsx("h2",{children:"When to Use What"}),e.jsx(a,{language:"rust",title:"Choosing the right pointer type",code:`// Box<T> — single owner, heap allocation
// Use when: recursive types, large structs, trait objects
let unique = Box::new(42);

// Rc<T> — multiple owners, single thread
// Use when: shared graph nodes, caches, read-only shared data
use std::rc::Rc;
let shared = Rc::new(42);
let also_shared = Rc::clone(&shared);

// Arc<T> — multiple owners, multiple threads
// Use when: thread pools, parallel processing, shared config
use std::sync::Arc;
let thread_safe = Arc::new(42);
let for_thread = Arc::clone(&thread_safe);

// Key rule: start with Box or plain ownership.
// Only reach for Rc/Arc when the compiler tells you
// that you need shared ownership.`}),e.jsx(r,{title:"Shared Configuration",difficulty:"intermediate",problem:`Create a Config struct with fields app_name: String and max_retries: u32.

1. Wrap it in Arc so multiple threads can read the config.
2. Spawn 3 threads, each printing the config's app_name.
3. After all threads finish, print the Arc's strong_count (should be 1).

Why must you use Arc instead of Rc here?`,solution:`use std::sync::Arc;
use std::thread;

struct Config {
    app_name: String,
    max_retries: u32,
}

fn main() {
    let config = Arc::new(Config {
        app_name: "MyApp".to_string(),
        max_retries: 3,
    });

    let mut handles = vec![];
    for i in 0..3 {
        let cfg = Arc::clone(&config);
        handles.push(thread::spawn(move || {
            println!("Thread {}: app = {}", i, cfg.app_name);
        }));
    }

    for h in handles {
        h.join().unwrap();
    }

    // All thread clones dropped, only 'config' remains
    println!("Final refcount: {}", Arc::strong_count(&config)); // 1

    // Arc is required because Rc does not implement Send,
    // so the compiler won't let you move it into a thread.
    // Arc uses atomic operations to safely update the
    // reference count from multiple threads simultaneously.
}`})]})}const f=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));function c(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"RefCell & Interior Mutability"}),e.jsxs("p",{children:["Rust's borrowing rules normally enforce at compile time that you either have one mutable reference or any number of immutable references. But some patterns — caches, observer lists, mock objects — need to mutate data behind a shared reference. ",e.jsx("code",{children:"RefCell<T>"})," moves the borrow check to runtime, giving you ",e.jsx("strong",{children:"interior mutability"}),"."]}),e.jsxs(o,{title:"Interior Mutability",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Interior mutability"})," lets you mutate data even when you only have an immutable reference to the container. In Python, this is the default — you can always modify a list attribute on an object regardless of how you got that reference. In Rust, you must opt in with types like ",e.jsx("code",{children:"RefCell<T>"}),", ",e.jsx("code",{children:"Cell<T>"}),", or ",e.jsx("code",{children:"Mutex<T>"}),"."]}),e.jsxs("p",{children:[e.jsx("code",{children:"RefCell"})," enforces the same borrowing rules (one writer XOR many readers), but checks them at runtime instead of compile time. Violations cause a panic rather than a compile error."]})]}),e.jsx("h2",{children:"The Problem RefCell Solves"}),e.jsx(s,{title:"Mutating through a shared reference",description:"Python allows mutation anywhere. Rust requires RefCell for interior mutability.",pythonCode:`class Logger:
    def __init__(self):
        self.messages = []  # mutable list

    def log(self, msg):
        # Mutating self.messages is always allowed,
        # even if Logger is shared by many objects
        self.messages.append(msg)

# Multiple objects share the same logger
logger = Logger()

# Both can call log() — Python doesn't care
# about how many references exist
logger.log("started")
logger.log("finished")
print(logger.messages)`,rustCode:`use std::cell::RefCell;

struct Logger {
    // RefCell allows mutation behind &self
    messages: RefCell<Vec<String>>,
}

impl Logger {
    fn new() -> Self {
        Logger { messages: RefCell::new(vec![]) }
    }

    fn log(&self, msg: &str) {
        // borrow_mut() checks at runtime that no
        // other borrow is active
        self.messages
            .borrow_mut()
            .push(msg.to_string());
    }

    fn dump(&self) {
        // borrow() for immutable access
        let msgs = self.messages.borrow();
        for m in msgs.iter() {
            println!("{}", m);
        }
    }
}

fn main() {
    let logger = Logger::new();
    logger.log("started");  // &self, but mutates!
    logger.log("finished");
    logger.dump();
}`}),e.jsx("h2",{children:"borrow() and borrow_mut()"}),e.jsx(a,{language:"rust",title:"Runtime borrow checking in action",code:`use std::cell::RefCell;

fn main() {
    let data = RefCell::new(vec![1, 2, 3]);

    // Immutable borrow — like &Vec<i32>
    {
        let reader = data.borrow();
        println!("length: {}", reader.len());
        // reader is dropped here
    }

    // Mutable borrow — like &mut Vec<i32>
    {
        let mut writer = data.borrow_mut();
        writer.push(4);
        // writer is dropped here
    }

    // Multiple immutable borrows are OK
    {
        let r1 = data.borrow();
        let r2 = data.borrow();
        println!("r1: {:?}, r2: {:?}", *r1, *r2);
    }

    // THIS WOULD PANIC at runtime:
    // let reader = data.borrow();
    // let writer = data.borrow_mut(); // PANIC!
    // Can't have reader and writer at the same time

    println!("final: {:?}", data.borrow());
}`}),e.jsxs(t,{type:"warning",title:"Runtime panics replace compile errors",children:["With ",e.jsx("code",{children:"RefCell"}),", violating the borrowing rules panics at runtime instead of failing at compile time. Use"," ",e.jsx("code",{children:"try_borrow()"})," and ",e.jsx("code",{children:"try_borrow_mut()"})," if you want to handle conflicts gracefully with ",e.jsx("code",{children:"Result"})," instead of crashing."]}),e.jsx("h2",{children:"Rc + RefCell: Shared Mutable Data"}),e.jsxs("p",{children:["The most common pattern combines ",e.jsx("code",{children:"Rc"})," (shared ownership) with"," ",e.jsx("code",{children:"RefCell"})," (interior mutability) to achieve what Python gives you by default: multiple variables that can all read and write the same data."]}),e.jsx(a,{language:"rust",title:"Rc<RefCell<T>> — Python-like shared mutable state",code:`use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
struct Sensor {
    name: String,
    readings: Rc<RefCell<Vec<f64>>>,
}

impl Sensor {
    fn record(&self, value: f64) {
        self.readings.borrow_mut().push(value);
    }
}

fn main() {
    // Shared mutable buffer — like a Python list
    // referenced by multiple objects
    let buffer = Rc::new(RefCell::new(Vec::new()));

    let temp = Sensor {
        name: "temperature".into(),
        readings: Rc::clone(&buffer),
    };

    let humidity = Sensor {
        name: "humidity".into(),
        readings: Rc::clone(&buffer),
    };

    // Both sensors write to the same buffer
    temp.record(22.5);
    humidity.record(65.0);
    temp.record(23.1);

    println!("All readings: {:?}", buffer.borrow());
    // [22.5, 65.0, 23.1]
}`}),e.jsxs(t,{type:"pythonista",title:"Rc<RefCell<T>> is Rust's Python mode",children:[e.jsx("code",{children:"Rc<RefCell<T>>"})," gives you the same semantics as Python: shared ownership with mutable access. But in Rust, this is the exception, not the rule. Prefer unique ownership and compile-time borrowing. Reach for ",e.jsx("code",{children:"RefCell"})," only when the borrow checker cannot express your legitimate pattern."]}),e.jsx(r,{title:"Build a Shared Cache",difficulty:"intermediate",problem:`Create a Cache struct that:

1. Stores key-value pairs in a RefCell<HashMap<String, String>>
2. Has a get_or_compute(&self, key: &str) -> String method that:
   - Returns the cached value if it exists
   - Otherwise computes it (use format!("computed_{}", key)), caches it, and returns it
3. Uses &self (not &mut self) — this is the whole point of RefCell!

Verify that calling get_or_compute twice with the same key returns the cached value.`,solution:`use std::cell::RefCell;
use std::collections::HashMap;

struct Cache {
    store: RefCell<HashMap<String, String>>,
}

impl Cache {
    fn new() -> Self {
        Cache {
            store: RefCell::new(HashMap::new()),
        }
    }

    fn get_or_compute(&self, key: &str) -> String {
        // Check if cached (immutable borrow)
        if let Some(val) = self.store.borrow().get(key) {
            return val.clone();
        }

        // Compute and cache (mutable borrow)
        let value = format!("computed_{}", key);
        self.store
            .borrow_mut()
            .insert(key.to_string(), value.clone());
        value
    }
}

fn main() {
    let cache = Cache::new();

    let v1 = cache.get_or_compute("foo");
    println!("{}", v1); // "computed_foo"

    let v2 = cache.get_or_compute("foo");
    println!("{}", v2); // "computed_foo" (from cache)

    assert_eq!(v1, v2);
    println!("Cache works!");
}

// Note: the immutable borrow in the if-let must be dropped
// before we take the mutable borrow to insert. Rust's RefCell
// tracks this at runtime.`})]})}const m=Object.freeze(Object.defineProperty({__proto__:null,default:c},Symbol.toStringTag,{value:"Module"}));export{p as a,f as b,m as c,u as s};
