import{j as e}from"./vendor-Dh_dlHsl.js";import{C as r,a as t,N as n,P as s,E as i}from"./subject-01-getting-started-DoSDK0Fn.js";const o=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"What Ownership Solves"}),e.jsx("p",{children:"If you only learn one concept from this entire course, make it ownership. Ownership is the foundation of everything that makes Rust different from Python, and it is the single biggest reason Rust programs are both fast and safe."}),e.jsxs(r,{title:"The Problem: Memory Bugs",children:[e.jsx("p",{children:"In languages like C and C++, programmers manually manage memory. This leads to an entire class of devastating bugs:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Use-after-free"})," — accessing memory that has already been freed"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Double-free"})," — freeing the same memory twice, corrupting the allocator"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dangling pointers"})," — holding a reference to freed memory"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Data races"})," — two threads accessing the same memory without synchronization"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Memory leaks"})," — allocating memory that is never freed"]})]}),e.jsx("p",{children:"These bugs cause roughly 70% of all security vulnerabilities in large C/C++ codebases (confirmed by Microsoft, Google, and Mozilla)."})]}),e.jsx("h2",{children:"Python's Approach: Reference Counting + GC"}),e.jsx("p",{children:"Python solves this problem by managing memory for you. Every Python object has a reference count, and when that count drops to zero, the object is freed. A cyclic garbage collector handles reference cycles."}),e.jsx(t,{language:"python",title:"Python's reference counting in action",code:`import sys

a = [1, 2, 3]
print(sys.getrefcount(a))  # 2 (a + the getrefcount arg)

b = a                      # refcount goes to 3
print(sys.getrefcount(a))  # 3

del b                      # refcount drops to 2
# No explicit free needed — Python handles it

# But this comes at a cost:
# - Every assignment updates a reference count (atomic operation)
# - The GC periodically scans for cycles (stop-the-world pauses)
# - Objects are scattered across the heap (poor cache locality)`}),e.jsx(n,{type:"pythonista",title:"Why Python is slow in tight loops",children:e.jsx("p",{children:"Every time you assign a variable in Python, the runtime increments and decrements reference counts. In a hot inner loop processing millions of items, this overhead is significant. This is one reason NumPy operations (which drop into C) are orders of magnitude faster than pure Python loops."})}),e.jsx("h2",{children:"Rust's Approach: Compile-Time Ownership"}),e.jsx("p",{children:"Rust takes a radically different approach. Instead of tracking memory at runtime, the compiler enforces a set of ownership rules at compile time. If your code compiles, it is guaranteed to be free of the memory bugs listed above — with zero runtime cost."}),e.jsx(r,{title:"The Three Rules of Ownership",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Each value has exactly one owner."}),' A variable "owns" the data it holds. There is always exactly one binding responsible for any piece of data.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"There can only be one owner at a time."}),' When you assign a value to a new variable, the original variable gives up ownership (a "move").']}),e.jsxs("li",{children:[e.jsx("strong",{children:"When the owner goes out of scope, the value is dropped."})," Rust automatically frees memory when the owning variable leaves its scope. No GC needed."]})]})}),e.jsx(t,{language:"rust",title:"Ownership in action",code:`fn main() {
    let s1 = String::from("hello");  // s1 owns the String
    let s2 = s1;                     // Ownership MOVES to s2
    // println!("{}", s1);           // ERROR: s1 no longer valid!
    println!("{}", s2);              // OK: s2 is the owner now

    // When s2 goes out of scope here, the String is freed.
    // No reference counting. No garbage collector. Just a simple rule.
}`}),e.jsx(s,{title:"Assignment: Reference vs Move",description:"In Python, assignment creates a new reference to the same object. In Rust, assignment moves ownership — the original variable becomes invalid.",pythonCode:`a = [1, 2, 3]
b = a
# Both a and b point to the SAME list
a.append(4)
print(b)  # [1, 2, 3, 4] — surprise!
# Python uses reference counting to track
# when to free the list`,rustCode:`let a = vec![1, 2, 3];
let b = a;
// Ownership has MOVED from a to b
// a.push(4);  // ERROR: a is no longer valid
println!("{:?}", b);  // [1, 2, 3]
// When b goes out of scope, the Vec is freed
// No reference counting needed`}),e.jsx("h2",{children:"Why This Matters for Performance"}),e.jsx("p",{children:"Ownership eliminates an entire category of runtime overhead:"}),e.jsx(t,{language:"rust",title:"Zero-cost memory management",code:`// This loop processes a million items with NO GC pauses,
// NO reference count updates, and NO runtime memory tracking.
fn process_data(data: Vec<f64>) -> f64 {
    let mut sum = 0.0;
    for value in &data {  // borrow the data, no copy
        sum += value;
    }
    sum
    // data is freed here — deterministically, instantly
}

fn main() {
    let readings = vec![1.0; 1_000_000];
    let result = process_data(readings);
    // readings is no longer valid here (it was moved into the function)
    println!("Sum: {}", result);
}`}),e.jsx(n,{type:"tip",title:"Real-world impact: Polars vs Pandas",children:e.jsx("p",{children:"Polars, a DataFrame library written in Rust, is often 10-100x faster than Pandas for the same operations. One key reason is memory management: Polars uses Rust's ownership system to manage DataFrame memory with zero GC overhead, while Pandas relies on Python's reference counting and garbage collector. In data pipelines processing millions of rows, this difference is enormous."})}),e.jsx("h2",{children:"Ownership vs Garbage Collection: A Summary"}),e.jsx(t,{language:"python",title:"Python: runtime memory management",code:`# Python tracks memory at RUNTIME
import gc

# Reference counting on every assignment
x = SomeLargeObject()   # refcount = 1
y = x                    # refcount = 2
del x                    # refcount = 1
del y                    # refcount = 0 -> freed

# Cyclic GC runs periodically (you can trigger it)
gc.collect()  # stop-the-world pause

# You cannot predict WHEN an object will be freed
# This makes Python unsuitable for real-time systems`}),e.jsx(t,{language:"rust",title:"Rust: compile-time memory management",code:`// Rust tracks memory at COMPILE TIME
fn main() {
    let x = String::from("hello");  // x owns the String
    {
        let y = x;                  // ownership moves to y
        println!("{}", y);
        // y goes out of scope -> String is freed RIGHT HERE
    }
    // No GC. No refcounting. The compiler inserted the
    // deallocation at exactly the right place.
}`}),e.jsx(n,{type:"warning",title:"The learning curve is real",children:e.jsx("p",{children:'Ownership will feel restrictive at first. You will fight the borrow checker. You will wonder why Rust cannot just "figure it out" the way Python does. This is normal. The rules exist because they prevent real bugs — bugs that cause crashes, security vulnerabilities, and subtle data corruption in production systems. Once the ownership model clicks, you will find yourself writing cleaner code in every language.'})}),e.jsx(i,{title:"Think About It",difficulty:"beginner",problem:`Consider this Python code:

data = [1, 2, 3]
backup = data
data.append(4)
print(backup)  # What prints?

Now consider the equivalent Rust code:

let data = vec![1, 2, 3];
let backup = data;
// data.push(4);  // What happens here?

Explain why the Rust version behaves differently from the Python version.
What problem does this difference prevent?`,solution:`In Python, backup = data creates a second reference to the SAME list.
So data.append(4) modifies the list that both variables point to,
and print(backup) outputs [1, 2, 3, 4]. This is called aliasing.

In Rust, let backup = data MOVES ownership. After the move, data is
no longer valid. Trying to call data.push(4) is a compile-time error.

This prevents aliasing bugs where one part of the code modifies data
that another part is still reading. In concurrent programs, aliasing
combined with mutation causes data races — one of the most dangerous
categories of bugs. Rust eliminates this entire class of bugs.`})]}),b=Object.freeze(Object.defineProperty({__proto__:null,default:o},Symbol.toStringTag,{value:"Module"})),a=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Move Semantics"}),e.jsxs("p",{children:["In Python, when you write ",e.jsx("code",{children:"b = a"}),", both variables point to the same object in memory. In Rust, ",e.jsx("code",{children:"b = a"})," ",e.jsx("strong",{children:"moves"})," the value from ",e.jsx("code",{children:"a"})," to ",e.jsx("code",{children:"b"}),", and ",e.jsx("code",{children:"a"})," becomes invalid. This is the single most important conceptual shift for Python developers learning Rust."]}),e.jsx(r,{title:"What Is a Move?",children:e.jsx("p",{children:"A move transfers ownership of a value from one variable to another. After a move, the source variable can no longer be used. The compiler enforces this at compile time — there is no runtime check and no runtime cost. The bits in memory are not copied or relocated; the compiler simply updates its internal tracking of which variable owns the data."})}),e.jsx("h2",{children:"Python Assignment vs Rust Assignment"}),e.jsx(s,{title:"Assignment: alias vs move",description:"Python creates an alias (two names for the same object). Rust transfers ownership (only one name remains valid).",pythonCode:`# Python: assignment creates an ALIAS
name = "Alice"
greeting = name
# Both 'name' and 'greeting' point
# to the same string object in memory
print(name)      # Alice — still valid
print(greeting)  # Alice

# This works because Python tracks
# reference counts at runtime`,rustCode:`fn main() {
    // Rust: assignment MOVES ownership
    let name = String::from("Alice");
    let greeting = name;
    // 'name' is now INVALID
    // println!("{}", name);  // ERROR!
    println!("{}", greeting); // Alice

    // No reference counting needed —
    // only one owner exists at a time
}`}),e.jsx("h2",{children:"Why Strings Move but Integers Don't"}),e.jsxs("p",{children:["Not everything in Rust moves on assignment. Simple types like integers, floats, and booleans are ",e.jsx("strong",{children:"copied"})," instead. The key distinction is where the data lives:"]}),e.jsx(t,{language:"rust",title:"Stack types copy, heap types move",code:`fn main() {
    // Integers live entirely on the stack — they implement Copy
    let x = 42;
    let y = x;
    println!("x = {}, y = {}", x, y); // Both valid!

    // Strings have data on the heap — they MOVE
    let s1 = String::from("hello");
    let s2 = s1;
    // println!("{}", s1); // ERROR: value used after move
    println!("{}", s2);    // OK

    // Why? A String is three values on the stack:
    // - a pointer to heap data
    // - a length
    // - a capacity
    // If both s1 and s2 held the same pointer, who frees the heap data?
    // Rust avoids this ambiguity by invalidating s1.
}`}),e.jsx(n,{type:"pythonista",title:"Python has no equivalent to moves",children:e.jsxs("p",{children:['In Python, every value is reference-counted and heap-allocated. There is no concept of "invalidating" a variable after assignment. When you write',e.jsx("code",{children:" b = a"})," in Python, both names share the same object, and the runtime ensures it stays alive until both names are gone. Rust's move system eliminates the need for this runtime tracking entirely."]})}),e.jsx("h2",{children:"When Does a Move Happen?"}),e.jsx("p",{children:"Moves happen in three situations: assignment, passing arguments to functions, and returning values from functions."}),e.jsx(t,{language:"rust",title:"Three contexts where moves occur",code:`fn take_ownership(s: String) {
    println!("Got: {}", s);
} // s is dropped here

fn give_ownership() -> String {
    let s = String::from("yours now");
    s // ownership moves to the caller
}

fn main() {
    // 1. Assignment
    let a = String::from("hello");
    let b = a;           // move: a -> b
    // a is invalid

    // 2. Function arguments
    let c = String::from("world");
    take_ownership(c);   // move: c -> s (the parameter)
    // c is invalid — the function now owns it

    // 3. Return values
    let d = give_ownership(); // move: return value -> d
    println!("{}", d);        // "yours now"
}`}),e.jsx("h2",{children:"Why Moves Are Zero-Cost"}),e.jsxs(r,{title:"Moves at the Machine Level",children:[e.jsxs("p",{children:["A move does not copy heap data. For a ",e.jsx("code",{children:"String"}),", a move copies only the three stack values (pointer, length, capacity) — 24 bytes total regardless of how large the string is. The heap data stays exactly where it is. The compiler then marks the source variable as unusable so that no double-free can occur."]}),e.jsxs("p",{children:["Compare this to Python, where ",e.jsx("code",{children:"b = a"})," must atomically increment a reference count (an expensive operation in tight loops), and later atomically decrement it when ",e.jsx("code",{children:"a"})," goes away. Rust's approach has literally zero runtime cost."]})]}),e.jsx("h2",{children:"Common Compiler Errors and How to Fix Them"}),e.jsx(t,{language:"rust",title:"Error: use of moved value",code:`fn main() {
    let data = vec![1, 2, 3];
    let backup = data;

    // ERROR: borrow of moved value: \`data\`
    // println!("{:?}", data);

    // Fix 1: Use the new owner
    println!("{:?}", backup);

    // Fix 2: Clone before moving
    let data2 = vec![4, 5, 6];
    let backup2 = data2.clone(); // explicit deep copy
    println!("original: {:?}", data2);   // still valid
    println!("backup: {:?}", backup2);   // independent copy

    // Fix 3: Borrow instead of moving (covered in borrowing chapter)
    let data3 = vec![7, 8, 9];
    print_data(&data3);  // pass a reference, not ownership
    println!("{:?}", data3); // still valid!
}

fn print_data(d: &Vec<i32>) {
    println!("{:?}", d);
}`}),e.jsx(t,{language:"rust",title:"Error: use of moved value in a loop",code:`fn process(s: String) {
    println!("Processing: {}", s);
}

fn main() {
    let name = String::from("Alice");

    // ERROR: this moves 'name' on the first iteration,
    // then tries to use it again on the second iteration
    // for _ in 0..3 {
    //     process(name);  // moved on first iteration!
    // }

    // Fix 1: Clone inside the loop
    for _ in 0..3 {
        process(name.clone()); // each iteration gets its own copy
    }

    // Fix 2: Borrow instead
    let name2 = String::from("Bob");
    for _ in 0..3 {
        println!("Hello, {}", &name2); // borrow — no move
    }
}`}),e.jsxs(n,{type:"tip",title:"Three strategies when the compiler says 'value used after move'",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"1. Clone:"})," Call ",e.jsx("code",{children:".clone()"})," to create an independent copy. Easy but may be expensive for large data."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2. Borrow:"})," Pass a reference (",e.jsx("code",{children:"&value"}),") instead of the value itself. This is the most common solution."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3. Restructure:"})," Rearrange your code so the value is only used once. Often the cleanest solution."]})]}),e.jsx("h2",{children:"Move Semantics with Structs"}),e.jsx(s,{title:"Passing structs to functions",description:"In Python, passing an object to a function shares it. In Rust, it moves unless you borrow.",pythonCode:`class User:
    def __init__(self, name):
        self.name = name

def greet(user):
    print(f"Hello, {user.name}")

u = User("Alice")
greet(u)
greet(u)  # works fine — u is still valid
print(u.name)  # still valid`,rustCode:`struct User {
    name: String,
}

fn greet(user: User) {
    println!("Hello, {}", user.name);
} // user is dropped here!

fn main() {
    let u = User { name: String::from("Alice") };
    greet(u);
    // greet(u); // ERROR: u was moved!
    // Fix: fn greet(user: &User) to borrow
}`}),e.jsx(i,{title:"Track the Moves",difficulty:"beginner",problem:`Read the following Rust code and determine which lines would cause
a compiler error. Explain why each error occurs and suggest a fix.

let a = String::from("hello");
let b = a;
let c = a;

let mut names = vec![String::from("Alice"), String::from("Bob")];
let first = names[0];
println!("{:?}", names);`,solution:`Line 3 (let c = a) is an error:
  "use of moved value: a" — ownership moved to b on line 2.
  Fix: let c = b.clone(); or let c = a.clone(); on line 2.

Line 5 (let first = names[0]) is an error:
  "cannot move out of index of Vec<String>" — moving out of a
  Vec element would leave a "hole" in the vector.
  Fix: let first = &names[0]; (borrow instead of move)
  Or: let first = names[0].clone(); (clone the element)
  Or: let first = names.remove(0); (take it out of the vec)`}),e.jsx(i,{title:"Fix the Function",difficulty:"easy",problem:`This code does not compile. Fix it so that the message can be used
after calling send_message:

fn send_message(msg: String) {
    println!("Sending: {}", msg);
}

fn main() {
    let msg = String::from("Hello, world!");
    send_message(msg);
    println!("Sent: {}", msg); // ERROR: value used after move
}`,solution:`// Solution 1: Borrow (preferred)
fn send_message(msg: &str) {
    println!("Sending: {}", msg);
}

fn main() {
    let msg = String::from("Hello, world!");
    send_message(&msg);        // pass a reference
    println!("Sent: {}", msg); // msg is still valid
}

// Solution 2: Clone
fn send_message_v2(msg: String) {
    println!("Sending: {}", msg);
}

fn main() {
    let msg = String::from("Hello, world!");
    send_message_v2(msg.clone()); // pass a clone
    println!("Sent: {}", msg);    // original still valid
}

// Solution 3: Return ownership back
fn send_message_v3(msg: String) -> String {
    println!("Sending: {}", msg);
    msg // return ownership to the caller
}

fn main() {
    let msg = String::from("Hello, world!");
    let msg = send_message_v3(msg); // get ownership back
    println!("Sent: {}", msg);
}`})]}),v=Object.freeze(Object.defineProperty({__proto__:null,default:a},Symbol.toStringTag,{value:"Module"})),l=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Copy vs Clone"}),e.jsxs("p",{children:["In the previous section you learned that assignment in Rust moves ownership. But you also saw that integers don't move — they copy. This section explains",e.jsx("em",{children:" when"})," Rust copies, ",e.jsx("em",{children:"when"})," it moves, and how to explicitly duplicate values with ",e.jsx("code",{children:"Clone"}),"."]}),e.jsxs(r,{title:"Two Ways to Duplicate Values",children:[e.jsx("p",{children:"Rust has two traits for duplicating values:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Copy"})," — implicit, bitwise copy. Happens automatically on assignment. Only for types whose data lives entirely on the stack."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Clone"})," — explicit, potentially expensive deep copy. You must call ",e.jsx("code",{children:".clone()"})," manually. Works for any type that implements the trait."]})]}),e.jsxs("p",{children:["If a type implements ",e.jsx("code",{children:"Copy"}),", assignment duplicates the value instead of moving it. If it does not, assignment moves."]})]}),e.jsx("h2",{children:"Copy Types: Stack-Only Data"}),e.jsx(t,{language:"rust",title:"Types that implement Copy",code:`fn main() {
    // All of these types implement Copy
    let a: i32 = 42;
    let b = a;         // COPY, not move — both valid
    println!("{} {}", a, b);

    let x: f64 = 3.14;
    let y = x;         // copy
    println!("{} {}", x, y);

    let flag: bool = true;
    let flag2 = flag;  // copy
    println!("{} {}", flag, flag2);

    let ch: char = 'A';
    let ch2 = ch;      // copy
    println!("{} {}", ch, ch2);

    // Tuples of Copy types are also Copy
    let point = (1.0, 2.0);
    let point2 = point; // copy
    println!("{:?} {:?}", point, point2);

    // Fixed-size arrays of Copy types are Copy
    let arr = [1, 2, 3];
    let arr2 = arr;     // copy
    println!("{:?} {:?}", arr, arr2);
}`}),e.jsx(n,{type:"pythonista",title:"Python has no Copy vs Move distinction",children:e.jsxs("p",{children:["In Python, every value is a heap-allocated, reference-counted object — even integers. When you write ",e.jsx("code",{children:"b = a"}),", you always get a shared reference, never a copy and never a move. Python's uniformity is simpler but costs performance: even ",e.jsx("code",{children:"x = 42"})," involves a heap object and reference counting. Rust's distinction lets integers live cheaply on the stack."]})}),e.jsx("h2",{children:"Why String Doesn't Implement Copy"}),e.jsx(r,{title:"The Copy Rule",children:e.jsxs("p",{children:["A type can implement ",e.jsx("code",{children:"Copy"})," only if all of its data lives on the stack and duplicating it is just a bitwise copy. ",e.jsx("code",{children:"String"})," contains a pointer to heap-allocated data. A bitwise copy would create two variables pointing to the same heap memory, and when both go out of scope, the memory would be freed twice — a double-free bug. So ",e.jsx("code",{children:"String"})," cannot be ",e.jsx("code",{children:"Copy"}),"."]})}),e.jsx(t,{language:"rust",title:"String must move or be cloned",code:`fn main() {
    let s1 = String::from("hello");

    // This MOVES — s1 is invalidated
    let s2 = s1;
    // println!("{}", s1); // ERROR

    // To duplicate, use .clone()
    let s3 = String::from("world");
    let s4 = s3.clone();  // explicit deep copy
    println!("{} {}", s3, s4); // Both valid

    // What clone does for String:
    // 1. Allocates new heap memory
    // 2. Copies all bytes from s3's buffer to the new buffer
    // 3. Returns a new String pointing to the new buffer
    // This is O(n) where n is the string length
}`}),e.jsx("h2",{children:"Clone: Explicit Deep Copy"}),e.jsx(s,{title:"Deep copying data",description:"Python uses copy.deepcopy() for deep copies. Rust uses .clone() for types that implement Clone.",pythonCode:`import copy

original = {
    "name": "Alice",
    "scores": [95, 87, 92]
}
# Shallow copy — nested lists are shared
shallow = original.copy()

# Deep copy — everything is independent
deep = copy.deepcopy(original)
deep["scores"].append(100)
print(original["scores"])  # [95, 87, 92]
print(deep["scores"])      # [95, 87, 92, 100]`,rustCode:`#[derive(Clone, Debug)]
struct Student {
    name: String,
    scores: Vec<i32>,
}

fn main() {
    let original = Student {
        name: String::from("Alice"),
        scores: vec![95, 87, 92],
    };

    // .clone() always does a deep copy in Rust
    let mut deep = original.clone();
    deep.scores.push(100);
    println!("{:?}", original.scores); // [95, 87, 92]
    println!("{:?}", deep.scores);     // [95, 87, 92, 100]
}`}),e.jsx(n,{type:"tip",title:"Rust has no shallow copy footgun",children:e.jsxs("p",{children:["In Python, ",e.jsx("code",{children:"dict.copy()"})," and ",e.jsx("code",{children:"list[:]"})," create shallow copies where nested mutable objects are shared. This is a common source of bugs. In Rust, ",e.jsx("code",{children:".clone()"})," always produces a fully independent copy. There is no shallow-copy trap."]})}),e.jsx("h2",{children:"Making Your Structs Copy or Clone"}),e.jsx(t,{language:"rust",title:"Deriving Copy and Clone for your types",code:`// Clone only: the struct contains a String (heap data)
#[derive(Clone, Debug)]
struct User {
    name: String,
    age: u32,
}

// Both Copy and Clone: all fields are Copy types
#[derive(Copy, Clone, Debug)]
struct Point {
    x: f64,
    y: f64,
}

// Copy requires Clone — you always derive both together
// #[derive(Copy)] alone won't compile

fn main() {
    // Point copies implicitly
    let p1 = Point { x: 1.0, y: 2.0 };
    let p2 = p1;
    println!("{:?} {:?}", p1, p2); // both valid

    // User must be cloned explicitly
    let u1 = User { name: String::from("Alice"), age: 30 };
    let u2 = u1.clone();
    println!("{:?} {:?}", u1, u2); // both valid

    // Without clone, User moves
    let u3 = u1; // move
    // println!("{:?}", u1); // ERROR: u1 moved
    println!("{:?}", u3);
}`}),e.jsx(n,{type:"warning",title:"You cannot derive Copy if any field is non-Copy",children:e.jsxs("p",{children:["If your struct has even one ",e.jsx("code",{children:"String"}),", ",e.jsx("code",{children:"Vec"}),", or other heap-allocated field, you cannot derive ",e.jsx("code",{children:"Copy"}),". The compiler will reject it with a clear error message. In those cases, derive ",e.jsx("code",{children:"Clone"}),"and use ",e.jsx("code",{children:".clone()"})," when you need a duplicate."]})}),e.jsx("h2",{children:"When to Use Clone"}),e.jsx(t,{language:"rust",title:"Practical patterns with Clone",code:`fn main() {
    // Pattern 1: Need a value in two places
    let config_name = String::from("production");
    let logger_name = config_name.clone();
    start_server(config_name);
    start_logger(logger_name);

    // Pattern 2: Building a collection from repeated data
    let template = String::from("item");
    let items: Vec<String> = (0..5)
        .map(|i| format!("{}_{}", template, i))
        .collect();
    println!("{:?}", items);

    // Pattern 3: Keeping a backup
    let mut data = vec![3, 1, 4, 1, 5];
    let original = data.clone();
    data.sort();
    println!("sorted: {:?}", data);
    println!("original: {:?}", original);
}

fn start_server(name: String) { println!("Server: {}", name); }
fn start_logger(name: String) { println!("Logger: {}", name); }
`}),e.jsx(n,{type:"tip",title:"Clone is not free — but it's not evil either",children:e.jsxs("p",{children:["New Rust programmers sometimes avoid ",e.jsx("code",{children:".clone()"}),` obsessively because they think it's "bad". It does have a cost (heap allocation + memcpy), but for most applications it's perfectly fine. Use `,e.jsx("code",{children:".clone()"})," to get your code working, then optimize with borrowing later if profiling shows it matters. Premature optimization of clones is a common time sink for beginners."]})}),e.jsx("h2",{children:"Copy, Clone, and Function Arguments"}),e.jsx(t,{language:"rust",title:"How Copy and Clone interact with functions",code:`fn print_number(n: i32) {
    println!("{}", n);
}

fn print_string(s: String) {
    println!("{}", s);
}

fn main() {
    let num = 42;
    print_number(num);  // i32 is Copy — num is copied
    print_number(num);  // still valid, no problem
    println!("{}", num); // still valid

    let text = String::from("hello");
    print_string(text); // String moves — text is invalidated
    // print_string(text); // ERROR: value used after move

    // Solutions:
    let text2 = String::from("world");
    print_string(text2.clone()); // clone: text2 stays valid
    print_string(text2);         // now text2 moves — last use is fine
}`}),e.jsx(i,{title:"Copy or Move?",difficulty:"beginner",problem:`For each of the following types, determine whether assignment copies or moves.
Explain why.

1. i64
2. String
3. (f32, f32)
4. Vec<i32>
5. [u8; 4]
6. &str
7. bool`,solution:`1. i64 — COPY. Primitive integer, lives on the stack.
2. String — MOVE. Contains a heap pointer. Cannot be Copy.
3. (f32, f32) — COPY. Tuple of Copy types is Copy.
4. Vec<i32> — MOVE. Contains a heap pointer. Cannot be Copy.
5. [u8; 4] — COPY. Fixed-size array of Copy types is Copy.
6. &str — COPY. References implement Copy (they're just a pointer + length on the stack).
7. bool — COPY. Primitive type, lives on the stack.

The rule: if a type's data lives entirely on the stack and a bitwise
copy produces a valid independent value, it can be Copy. If it owns
heap data (String, Vec, Box, HashMap, etc.), it must move.`}),e.jsx(i,{title:"Make It Compile",difficulty:"easy",problem:`Fix this code so it compiles and prints all three lines:

struct Config {
    name: String,
    max_retries: u32,
}

fn apply_config(config: Config) {
    println!("Applying: {} (retries: {})", config.name, config.max_retries);
}

fn main() {
    let cfg = Config { name: String::from("prod"), max_retries: 3 };
    apply_config(cfg);
    apply_config(cfg);
    println!("Done with: {}", cfg.name);
}`,solution:`// Solution: Derive Clone and use .clone()
#[derive(Clone)]
struct Config {
    name: String,
    max_retries: u32,
}

fn apply_config(config: Config) {
    println!("Applying: {} (retries: {})", config.name, config.max_retries);
}

fn main() {
    let cfg = Config { name: String::from("prod"), max_retries: 3 };
    apply_config(cfg.clone());  // clone for first call
    apply_config(cfg.clone());  // clone for second call
    println!("Done with: {}", cfg.name);
}

// Even better: change apply_config to take &Config (borrowing)
// fn apply_config(config: &Config) { ... }
// Then no cloning is needed at all.`})]}),j=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"})),c=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Scope & Drop"}),e.jsxs("p",{children:['In Python, you rarely think about when objects are destroyed. The garbage collector handles it "eventually." In Rust, destruction is ',e.jsx("strong",{children:"deterministic"}),": a value is dropped the instant its owner goes out of scope. This gives you precise control over resource cleanup without any manual effort."]}),e.jsx(r,{title:"Scope Defines Lifetime",children:e.jsxs("p",{children:["A scope is the region of code where a variable is valid — typically delimited by curly braces ",e.jsx("code",{children:"{}"}),". When execution reaches the closing brace, all variables owned by that scope are dropped in reverse order of creation. This is guaranteed by the compiler — there is no ambiguity about ",e.jsx("em",{children:"when"})," cleanup happens."]})}),e.jsx(t,{language:"rust",title:"Scope and automatic drop",code:`fn main() {
    let outer = String::from("I live longer");

    {
        let inner = String::from("I'm temporary");
        println!("{}", inner);  // valid here
        println!("{}", outer);  // outer is still in scope
    } // 'inner' is DROPPED here — memory freed instantly

    println!("{}", outer);      // outer still valid
    // println!("{}", inner);   // ERROR: inner doesn't exist
} // 'outer' is DROPPED here`}),e.jsx("h2",{children:"The Drop Trait: Rust's Destructor"}),e.jsx(s,{title:"Deterministic cleanup",description:"Python's __del__ is called 'eventually' by the GC. Rust's Drop::drop is called at a precise, predictable point.",pythonCode:`class Resource:
    def __init__(self, name):
        self.name = name
        print(f"Acquired: {self.name}")

    def __del__(self):
        # Called "sometime" by the GC
        # NOT guaranteed to run!
        print(f"Released: {self.name}")

r = Resource("database")
del r  # Hints to GC, but __del__ timing
       # is implementation-dependent
# In CPython it runs immediately,
# in PyPy it may run much later`,rustCode:`struct Resource {
    name: String,
}

impl Drop for Resource {
    fn drop(&mut self) {
        // GUARANTEED to run at scope exit
        println!("Released: {}", self.name);
    }
}

fn main() {
    let r = Resource {
        name: String::from("database"),
    };
    println!("Using: {}", r.name);
} // drop() called HERE — always,
  // deterministically, no exceptions`}),e.jsx(n,{type:"warning",title:"Python's __del__ is unreliable",children:e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"__del__"})," is not guaranteed to run. If objects are in a reference cycle, ",e.jsx("code",{children:"__del__"})," may never be called. Even in CPython,",e.jsx("code",{children:"__del__"})," during interpreter shutdown is unreliable. This is why Python uses context managers (",e.jsx("code",{children:"with"})," statements) for resource cleanup. In Rust, ",e.jsx("code",{children:"Drop"})," always runs — no special syntax needed."]})}),e.jsx("h2",{children:"RAII: Resource Acquisition Is Initialization"}),e.jsx(r,{title:"The RAII Pattern",children:e.jsx("p",{children:"RAII ties the lifetime of a resource (file handle, network connection, mutex lock) to the lifetime of an object. When the object is created, the resource is acquired. When the object is dropped, the resource is released. Because Rust drops values deterministically at scope exit, RAII provides automatic, reliable resource management without explicit cleanup code."})}),e.jsx(s,{title:"File handling: context manager vs RAII",description:"Python needs a 'with' block to ensure files are closed. Rust closes them automatically when the owner goes out of scope.",pythonCode:`# Python: MUST use 'with' for reliable cleanup
with open("data.txt", "w") as f:
    f.write("hello")
# File is closed here by __exit__

# Without 'with', the file might stay open:
f = open("data.txt", "w")
f.write("hello")
# f.close()  # Easy to forget!
# If an exception occurs before close(),
# the file handle leaks`,rustCode:`use std::fs::File;
use std::io::Write;

fn main() {
    let mut f = File::create("data.txt")
        .unwrap();
    f.write_all(b"hello").unwrap();

    // No close() needed!
    // No 'with' block needed!
} // File is closed HERE automatically
  // when 'f' is dropped.
  // Even if a panic occurs, Drop runs.`}),e.jsx("h2",{children:"Drop Order: Reverse of Creation"}),e.jsx(t,{language:"rust",title:"Values are dropped in reverse order",code:`struct Named {
    name: String,
}

impl Drop for Named {
    fn drop(&mut self) {
        println!("Dropping: {}", self.name);
    }
}

fn main() {
    let first = Named { name: String::from("first") };
    let second = Named { name: String::from("second") };
    let third = Named { name: String::from("third") };
    println!("All created");
}
// Output:
// All created
// Dropping: third    <-- last created, first dropped
// Dropping: second
// Dropping: first    <-- first created, last dropped`}),e.jsx(n,{type:"tip",title:"Why reverse order matters",children:e.jsxs("p",{children:["Reverse drop order ensures that if ",e.jsx("code",{children:"second"})," depends on",e.jsx("code",{children:" first"})," (e.g., a connection pool and a connection from that pool), the dependent value (",e.jsx("code",{children:"second"}),") is cleaned up before the thing it depends on (",e.jsx("code",{children:"first"}),"). This prevents use-after-free in destructors."]})}),e.jsx("h2",{children:"Nested Scopes for Early Cleanup"}),e.jsx(t,{language:"rust",title:"Using inner scopes to free resources early",code:`use std::fs;

fn process_file() {
    // We need a large buffer only temporarily
    {
        let huge_buffer: Vec<u8> = vec![0u8; 100_000_000]; // 100MB
        // ... process the buffer ...
        println!("Buffer size: {} bytes", huge_buffer.len());
    } // huge_buffer is freed HERE — 100MB returned to the system

    // Now we can do other work without holding 100MB in memory
    println!("Buffer is gone, memory is free");

    // Another common pattern: lock scoping
    // {
    //     let lock = mutex.lock().unwrap();
    //     // ... critical section ...
    // } // lock is released here, as early as possible
}`}),e.jsx("h2",{children:"You Cannot Call drop() Explicitly on Values"}),e.jsx(t,{language:"rust",title:"Using std::mem::drop for early cleanup",code:`fn main() {
    let s = String::from("hello");

    // You CANNOT call s.drop() — the compiler prevents it
    // s.drop(); // ERROR: explicit use of destructor method

    // Use std::mem::drop() instead — it takes ownership and drops
    drop(s); // s is moved into drop() and immediately freed
    // println!("{}", s); // ERROR: value used after move

    // This is useful when you need to free something before
    // the scope ends but can't use a nested scope
    let data = vec![1, 2, 3];
    println!("{:?}", data);
    drop(data); // free the Vec now
    // ... lots more code that doesn't need data ...
}`}),e.jsx(n,{type:"pythonista",title:"drop() vs del",children:e.jsxs("p",{children:["Rust's ",e.jsx("code",{children:"std::mem::drop()"})," works by taking ownership of the value, which forces the compiler to run ",e.jsx("code",{children:"Drop::drop()"})," immediately. Python's ",e.jsx("code",{children:"del x"})," merely decrements the reference count — the object may or may not be freed depending on whether other references exist. Rust's version is guaranteed: after ",e.jsx("code",{children:"drop(x)"}),", the memory is freed and",e.jsx("code",{children:"x"})," cannot be used."]})}),e.jsx("h2",{children:"Drop and Ownership Together"}),e.jsx(t,{language:"rust",title:"Ownership transfer prevents double-drop",code:`struct Connection {
    id: u32,
}

impl Drop for Connection {
    fn drop(&mut self) {
        println!("Closing connection {}", self.id);
    }
}

fn use_connection(conn: Connection) {
    println!("Using connection {}", conn.id);
} // conn is dropped here

fn main() {
    let c = Connection { id: 1 };
    use_connection(c);
    // c was moved into the function, so drop() runs inside use_connection.
    // c is NOT dropped again here — no double-free!

    let c2 = Connection { id: 2 };
    println!("Created connection {}", c2.id);
} // Only c2 is dropped here (once). c was already moved and dropped.

// Output:
// Using connection 1
// Closing connection 1    <-- dropped inside use_connection
// Created connection 2
// Closing connection 2    <-- dropped at end of main`}),e.jsx(i,{title:"Predict the Output",difficulty:"beginner",problem:`What does this program print? Write the exact output, line by line.

struct Guard {
    name: String,
}

impl Drop for Guard {
    fn drop(&mut self) {
        println!("Dropping {}", self.name);
    }
}

fn main() {
    let a = Guard { name: String::from("A") };
    let b = Guard { name: String::from("B") };
    {
        let c = Guard { name: String::from("C") };
        println!("Inside inner scope");
    }
    println!("After inner scope");
    drop(a);
    println!("After explicit drop");
}`,solution:`Inside inner scope
Dropping C
After inner scope
Dropping A
After explicit drop
Dropping B

Explanation:
- "Inside inner scope" prints first.
- C is dropped when the inner scope ends (immediately after).
- "After inner scope" prints next.
- drop(a) explicitly drops A, printing "Dropping A".
- "After explicit drop" prints next.
- At the end of main, only B remains. It is dropped last.
- Note: a was moved into drop() so it's not dropped again at scope end.`}),e.jsx(i,{title:"RAII File Writer",difficulty:"medium",problem:`Design a struct LogFile that:
1. Opens a file in its constructor (new function)
2. Has a write_line method that writes a line to the file
3. Automatically flushes and prints "Log closed" when dropped

Hint: use std::fs::File and std::io::Write.
Show how this is safer than Python's manual file handling.`,solution:`use std::fs::File;
use std::io::{Write, BufWriter};

struct LogFile {
    writer: BufWriter<File>,
    path: String,
}

impl LogFile {
    fn new(path: &str) -> std::io::Result<Self> {
        let file = File::create(path)?;
        Ok(LogFile {
            writer: BufWriter::new(file),
            path: path.to_string(),
        })
    }

    fn write_line(&mut self, msg: &str) -> std::io::Result<()> {
        writeln!(self.writer, "{}", msg)
    }
}

impl Drop for LogFile {
    fn drop(&mut self) {
        let _ = self.writer.flush();
        println!("Log closed: {}", self.path);
    }
}

fn main() -> std::io::Result<()> {
    let mut log = LogFile::new("app.log")?;
    log.write_line("Starting up")?;
    log.write_line("Processing data")?;
    // No close() needed — Drop handles it!
    Ok(())
} // "Log closed: app.log" printed here`})]}),S=Object.freeze(Object.defineProperty({__proto__:null,default:c},Symbol.toStringTag,{value:"Module"})),d=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Immutable References (&T)"}),e.jsxs("p",{children:["Moving ownership every time you want to read a value would be impractical. Rust's solution is ",e.jsx("strong",{children:"borrowing"}),": you can create a reference to a value without taking ownership. The original owner keeps the value, and the borrower gets temporary read access."]}),e.jsx(r,{title:"Borrowing vs Owning",children:e.jsxs("p",{children:["Think of it like lending a book. When you lend a book to a friend, you still own it — they can read it, but they cannot sell it or throw it away. In Rust, a reference (",e.jsx("code",{children:"&T"}),') lets you "lend" a value: the borrower can read it but cannot drop it or move it. The owner retains responsibility for cleanup.']})}),e.jsx("h2",{children:"Creating References with &"}),e.jsx(t,{language:"rust",title:"The & operator creates a reference",code:`fn calculate_length(s: &String) -> usize {
    s.len()
    // s goes out of scope here, but since it doesn't own the String,
    // nothing is dropped. The caller still has the original.
}

fn main() {
    let greeting = String::from("hello");

    // Pass a REFERENCE, not the value itself
    let len = calculate_length(&greeting);

    // greeting is still valid — we only lent it
    println!("'{}' has {} characters", greeting, len);
}`}),e.jsx(s,{title:"Passing data to functions",description:"Python always passes references (to shared, mutable objects). Rust makes you choose: pass ownership or pass a reference.",pythonCode:`def calculate_length(s):
    return len(s)
    # In Python, s is ALWAYS a reference
    # to the same object. No special syntax.

greeting = "hello"
length = calculate_length(greeting)
print(f"'{greeting}' has {length} chars")
# greeting is still valid — it was never
# "moved" because Python doesn't have moves

# But this means functions can secretly
# mutate your data:
def sneaky(lst):
    lst.append(999)  # modifies caller's list!

data = [1, 2, 3]
sneaky(data)
print(data)  # [1, 2, 3, 999] — surprise!`,rustCode:`fn calculate_length(s: &String) -> usize {
    s.len()
    // s is an immutable reference — it
    // CANNOT modify the String.
}

fn main() {
    let greeting = String::from("hello");
    let len = calculate_length(&greeting);
    println!("'{}' has {} chars", greeting, len);

    // Rust's references are explicit:
    // &greeting  = immutable borrow
    // &mut greeting = mutable borrow
    // greeting   = move (transfer ownership)
    // The type system enforces what each
    // function can do with your data.
}`}),e.jsx(n,{type:"pythonista",title:"In Python, everything is a reference",children:e.jsxs("p",{children:["Python developers already work with references all the time — every variable in Python ",e.jsx("em",{children:"is"})," a reference to a heap object. The difference is that Python references are always mutable (you can call any method on them) and always shared (multiple variables can reference the same object). Rust's ",e.jsx("code",{children:"&T"}),' is more restrictive: it grants read-only access and the compiler tracks exactly who is borrowing what. This strictness prevents the "sneaky mutation" bugs shown above.']})}),e.jsx("h2",{children:"Multiple Immutable References Are Allowed"}),e.jsx(t,{language:"rust",title:"You can have many &T references at once",code:`fn main() {
    let data = String::from("shared data");

    // Multiple immutable borrows — perfectly fine
    let r1 = &data;
    let r2 = &data;
    let r3 = &data;

    println!("{}", r1);
    println!("{}", r2);
    println!("{}", r3);
    println!("{}", data); // original still accessible too

    // Why is this safe? Because none of these references can
    // modify the data. Multiple readers, no writers = no conflicts.
}`}),e.jsx("h2",{children:"References Don't Own the Data"}),e.jsxs(r,{title:"References Are Non-Owning",children:[e.jsx("p",{children:"A critical rule: references never own the data they point to. This means:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"When a reference goes out of scope, nothing is freed."}),e.jsx("li",{children:"The referenced data must live at least as long as the reference."}),e.jsx("li",{children:"You cannot return a reference to a local variable (it would dangle)."})]})]}),e.jsx(t,{language:"rust",title:"A reference cannot outlive what it points to",code:`// This will NOT compile:
// fn dangling() -> &String {
//     let s = String::from("hello");
//     &s  // ERROR: s is dropped at the end of this function,
//         // but we're trying to return a reference to it!
// }

// Fix: return the owned value instead
fn not_dangling() -> String {
    let s = String::from("hello");
    s  // move the String out — caller takes ownership
}

fn main() {
    let s = not_dangling();
    println!("{}", s);
}`}),e.jsx(n,{type:"tip",title:"The compiler prevents dangling references",children:e.jsx("p",{children:"In C/C++, returning a pointer to a local variable is a common bug that causes crashes. In Python, the garbage collector keeps the object alive as long as any reference exists. Rust takes a third approach: the compiler refuses to compile code that would create a dangling reference. You cannot have this bug."})}),e.jsx("h2",{children:"&str vs String: References in Practice"}),e.jsx(t,{language:"rust",title:"String ownership vs &str borrowing",code:`// Takes a reference to a string slice — most flexible
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    // String literals are &str (they live in the binary)
    let literal = "world";
    greet(literal);  // &str passed directly

    // String::from creates an owned String on the heap
    let owned = String::from("Alice");
    greet(&owned);   // &String auto-converts to &str

    // After the calls, both literal and owned are still valid
    println!("literal: {}", literal);
    println!("owned: {}", owned);

    // Rule of thumb: functions that only READ a string
    // should take &str, not String or &String
}`}),e.jsx("h2",{children:"Immutable References Prevent Mutation"}),e.jsx(t,{language:"rust",title:"You cannot modify through an immutable reference",code:`fn try_to_modify(s: &String) {
    // s.push_str(" world"); // ERROR: cannot borrow as mutable
    // An immutable reference grants read-only access.
    // This is enforced at compile time, not runtime.
    println!("I can read: {}", s);
}

fn main() {
    let greeting = String::from("hello");
    try_to_modify(&greeting);
    println!("{}", greeting); // still "hello"

    // Compare to Python where any function can mutate:
    // def try_to_modify(lst):
    //     lst.append("surprise!")  # Python allows this!
}`}),e.jsx(n,{type:"pythonista",title:"Rust's references solve a real Python problem",children:e.jsxs("p",{children:["A common Python bug: you pass a list or dict to a function, and the function modifies it unexpectedly. Defensive copying (",e.jsx("code",{children:"data.copy()"}),") is the usual workaround, but it's easy to forget. In Rust, if a function takes",e.jsx("code",{children:"&T"}),", the compiler ",e.jsx("em",{children:"guarantees"})," it cannot modify your data. You get the safety of immutable data without the cost of copying."]})}),e.jsx(i,{title:"Borrow, Don't Move",difficulty:"beginner",problem:`Fix this code so it compiles. The function should read the vector
but not take ownership of it:

fn sum_values(numbers: Vec<i32>) -> i32 {
    let mut total = 0;
    for n in &numbers {
        total += n;
    }
    total
}

fn main() {
    let data = vec![10, 20, 30, 40];
    let total = sum_values(data);
    println!("Sum: {}", total);
    println!("Data: {:?}", data); // ERROR: data was moved
}`,solution:`// Change the function to take a reference:
fn sum_values(numbers: &Vec<i32>) -> i32 {
    let mut total = 0;
    for n in numbers {  // iterating &Vec<i32> yields &i32
        total += n;
    }
    total
}

fn main() {
    let data = vec![10, 20, 30, 40];
    let total = sum_values(&data);  // pass a reference
    println!("Sum: {}", total);
    println!("Data: {:?}", data);   // still valid!
}

// Even better: take a slice &[i32] instead of &Vec<i32>
// fn sum_values(numbers: &[i32]) -> i32 { ... }
// This works with Vec, arrays, and slices alike.`}),e.jsx(i,{title:"Multiple Borrows",difficulty:"easy",problem:`Write a function longest_word that takes two &str references and
returns the one that is longer (return &str). Then call it twice
with different combinations from three string variables, showing
that borrowing lets you use the same variables multiple times.`,solution:`fn longest_word<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

fn main() {
    let x = String::from("hello");
    let y = String::from("rust");
    let z = String::from("programming");

    // Borrow x and y — both remain valid
    let result1 = longest_word(&x, &y);
    println!("Longest of x,y: {}", result1);

    // Borrow x and z — x was already borrowed above, still valid
    let result2 = longest_word(&x, &z);
    println!("Longest of x,z: {}", result2);

    // All three originals still usable
    println!("{} {} {}", x, y, z);
}

// Note: the 'a lifetime annotation tells the compiler that
// the returned reference lives as long as both inputs.
// We'll cover lifetimes in detail in a later section.`})]}),_=Object.freeze(Object.defineProperty({__proto__:null,default:d},Symbol.toStringTag,{value:"Module"})),h=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Mutable References (&mut T)"}),e.jsxs("p",{children:["Immutable references let you read data without taking ownership. But what if a function needs to ",e.jsx("em",{children:"modify"})," data it doesn't own? That's what mutable references (",e.jsx("code",{children:"&mut T"}),") are for. They come with a strict rule that prevents an entire class of bugs: you can have ",e.jsx("strong",{children:"only one"})," mutable reference to a value at a time."]}),e.jsxs(r,{title:"The Mutable Borrowing Rule",children:[e.jsxs("p",{children:["At any given time, you can have ",e.jsx("strong",{children:"either"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Any number of immutable references (",e.jsx("code",{children:"&T"}),"), OR"]}),e.jsxs("li",{children:["Exactly one mutable reference (",e.jsx("code",{children:"&mut T"}),")"]})]}),e.jsx("p",{children:"Never both. This rule is checked at compile time and prevents data races, iterator invalidation, and aliasing bugs — all without any runtime cost."})]}),e.jsx("h2",{children:"Creating Mutable References"}),e.jsx(t,{language:"rust",title:"Using &mut to modify borrowed data",code:`fn add_greeting(s: &mut String) {
    s.push_str(", world!");
    // We can modify s because we have a mutable reference
}

fn main() {
    let mut greeting = String::from("hello");
    //  ^^^ the variable must be declared 'mut'

    add_greeting(&mut greeting);
    //           ^^^^ explicitly pass as mutable reference

    println!("{}", greeting); // "hello, world!"
}`}),e.jsx(n,{type:"tip",title:"Two 'mut' markers required",children:e.jsxs("p",{children:["Both the variable declaration (",e.jsx("code",{children:"let mut"}),") and the reference creation (",e.jsx("code",{children:"&mut"}),") must use ",e.jsx("code",{children:"mut"}),". This is intentional: Rust wants you to be explicit about mutability at every step. If you see",e.jsx("code",{children:"&mut"})," in a function signature, you know immediately that the function will modify your data."]})}),e.jsx(s,{title:"Modifying data through a reference",description:"Python lets any function mutate any mutable object passed to it. Rust requires explicit &mut to grant write access.",pythonCode:`def process(items):
    # Python: no way to know from the
    # signature if this mutates 'items'
    items.append("new")
    items.sort()

data = ["c", "a", "b"]
process(data)
print(data)  # ['a', 'b', 'c', 'new']
# Was mutation intentional? Who knows!

# Defensive pattern: copy before calling
process(data.copy())
# But this is easy to forget.`,rustCode:`fn process(items: &mut Vec<String>) {
    // The &mut in the signature TELLS you
    // this function will modify items
    items.push(String::from("new"));
    items.sort();
}

fn main() {
    let mut data = vec![
        String::from("c"),
        String::from("a"),
        String::from("b"),
    ];
    process(&mut data);
    println!("{:?}", data);
    // ["a", "b", "c", "new"]
    // Mutation was explicit and intentional
}`}),e.jsx("h2",{children:"Only One Mutable Reference at a Time"}),e.jsx(t,{language:"rust",title:"The exclusive mutable borrow rule",code:`fn main() {
    let mut s = String::from("hello");

    let r1 = &mut s;
    // let r2 = &mut s; // ERROR: cannot borrow 's' as mutable
    //                   // more than once at a time

    r1.push_str(" world");
    println!("{}", r1);

    // After r1 is no longer used, we can create a new mutable reference
    let r2 = &mut s;  // OK: r1's borrow has ended
    r2.push_str("!");
    println!("{}", r2);
}`}),e.jsxs(r,{title:"Why Only One &mut?",children:[e.jsx("p",{children:"If two mutable references existed simultaneously, two parts of your code could modify the same data at the same time. This causes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Data races"})," in concurrent code (two threads writing simultaneously)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Iterator invalidation"})," (modifying a collection while iterating)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Aliasing bugs"})," (reading stale data while another reference is writing)"]})]}),e.jsx("p",{children:"Rust prevents all of these at compile time by enforcing exclusive access."})]}),e.jsx("h2",{children:"Cannot Mix Immutable and Mutable References"}),e.jsx(t,{language:"rust",title:"Immutable and mutable references cannot coexist",code:`fn main() {
    let mut data = vec![1, 2, 3];

    let first = &data[0];      // immutable borrow of data
    // data.push(4);           // ERROR: cannot borrow 'data' as mutable
    //                         // because it is also borrowed as immutable

    println!("first element: {}", first);
    // first's borrow ends here (last use)

    // NOW we can mutate — no more immutable borrows active
    data.push(4);              // OK
    println!("{:?}", data);    // [1, 2, 3, 4]
}`}),e.jsxs(n,{type:"pythonista",title:"This prevents a real Python bug",children:[e.jsx("p",{children:"In Python, this is valid but dangerous:"}),e.jsx("pre",{children:`items = [1, 2, 3]
first = items[0]  # reads from items
items.clear()     # mutates items
print(first)      # 1 — OK for integers (they're copied)

# But with mutable objects it's a real problem:
matrix = [[1], [2], [3]]
row = matrix[0]   # reference to inner list
matrix.clear()    # destroy the matrix
row.append(99)    # row still works... or does it?`}),e.jsx("p",{children:"Rust prevents this at compile time. You cannot modify a collection while anyone is holding a reference into it."})]}),e.jsx("h2",{children:"Non-Lexical Lifetimes (NLL)"}),e.jsxs("p",{children:["Modern Rust uses ",e.jsx("strong",{children:"non-lexical lifetimes"}),": a borrow ends at its last use, not at the end of its scope. This makes the borrow checker more flexible:"]}),e.jsx(t,{language:"rust",title:"Borrows end at their last use",code:`fn main() {
    let mut s = String::from("hello");

    let r1 = &s;        // immutable borrow starts
    let r2 = &s;        // another immutable borrow — fine
    println!("{} {}", r1, r2);
    // r1 and r2 are never used again — their borrows end here

    let r3 = &mut s;    // mutable borrow starts — OK because
                        // r1 and r2 are no longer in use
    r3.push_str(" world");
    println!("{}", r3);
}`}),e.jsx("h2",{children:"Common Patterns for Mutable Access"}),e.jsx(t,{language:"rust",title:"Practical mutable reference patterns",code:`// Pattern 1: Modify and return
fn add_and_get_length(v: &mut Vec<i32>, item: i32) -> usize {
    v.push(item);
    v.len()
}

// Pattern 2: Conditional mutation
fn ensure_non_empty(v: &mut Vec<String>) {
    if v.is_empty() {
        v.push(String::from("default"));
    }
}

// Pattern 3: In-place transformation
fn normalize(values: &mut Vec<f64>) {
    let max = values.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    if max > 0.0 {
        for v in values.iter_mut() {
            *v /= max;
        }
    }
}

fn main() {
    let mut numbers = vec![1, 2, 3];
    let len = add_and_get_length(&mut numbers, 4);
    println!("{:?} (len={})", numbers, len);

    let mut names: Vec<String> = vec![];
    ensure_non_empty(&mut names);
    println!("{:?}", names); // ["default"]

    let mut data = vec![2.0, 4.0, 8.0];
    normalize(&mut data);
    println!("{:?}", data); // [0.25, 0.5, 1.0]
}`}),e.jsx(n,{type:"warning",title:"Mutable references and the self parameter",children:e.jsxs("p",{children:["In methods, ",e.jsx("code",{children:"&mut self"})," borrows the struct mutably. While a method is running with ",e.jsx("code",{children:"&mut self"}),", no other code can access the struct. This is the same rule as standalone mutable references, applied to method calls."]})}),e.jsx(i,{title:"Fix the Mutable Borrow Error",difficulty:"beginner",problem:`This code fails to compile. Fix it without cloning.

fn main() {
    let mut scores = vec![85, 92, 78, 95, 88];
    let highest = &scores[3];  // borrow the 4th element
    scores.push(100);          // try to add a new score
    println!("Highest was: {}", highest);
}`,solution:`// The problem: 'highest' borrows 'scores', but 'push' needs
// a mutable borrow. They can't coexist.

// Fix 1: Read the value (copy it) before mutating
fn main() {
    let mut scores = vec![85, 92, 78, 95, 88];
    let highest = scores[3]; // i32 is Copy — this copies the value
    scores.push(100);
    println!("Highest was: {}", highest);
}

// Fix 2: Finish using the reference before mutating
fn main() {
    let mut scores = vec![85, 92, 78, 95, 88];
    let highest = &scores[3];
    println!("Highest was: {}", highest); // last use of 'highest'
    scores.push(100); // OK — the immutable borrow ended
}

// Fix 3: Use a separate scope
fn main() {
    let mut scores = vec![85, 92, 78, 95, 88];
    {
        let highest = &scores[3];
        println!("Highest was: {}", highest);
    } // borrow ends
    scores.push(100);
}`}),e.jsx(i,{title:"Build a Counter",difficulty:"easy",problem:`Create a struct Counter with a count field (u32). Implement:
1. A new() method that starts at 0
2. An increment(&mut self) method
3. A value(&self) method that returns the count

Then show that you cannot call increment while holding a reference
from value() — and fix it.`,solution:`struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Self {
        Counter { count: 0 }
    }

    fn increment(&mut self) {
        self.count += 1;
    }

    fn value(&self) -> u32 {
        self.count  // returns a copy (u32 is Copy)
    }
}

fn main() {
    let mut c = Counter::new();

    // This would fail:
    // let val = &c;  // immutable borrow
    // c.increment(); // ERROR: can't mutate while borrowed
    // println!("{}", val.value());

    // Fix: use value() (which returns a Copy) before mutating
    let val = c.value();    // returns u32 (Copy) — no active borrow
    c.increment();          // mutable borrow — OK
    println!("was: {}, now: {}", val, c.value());
    // "was: 0, now: 1"
}`})]}),R=Object.freeze(Object.defineProperty({__proto__:null,default:h},Symbol.toStringTag,{value:"Module"})),u=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"The Borrow Checker"}),e.jsx("p",{children:`The borrow checker is Rust's compile-time system that enforces ownership and borrowing rules. It's the part of the compiler that produces "cannot borrow," "value used after move," and "does not live long enough" errors. Learning to read and fix these errors is the most important practical skill for new Rust developers.`}),e.jsxs(r,{title:"What the Borrow Checker Verifies",children:[e.jsx("p",{children:"For every reference in your program, the borrow checker verifies:"}),e.jsxs("ol",{children:[e.jsx("li",{children:"The referenced data is not moved or dropped while the reference exists."}),e.jsx("li",{children:"If a mutable reference exists, no other references (mutable or immutable) to the same data are active."}),e.jsx("li",{children:"References do not outlive the data they point to."}),e.jsx("li",{children:"You do not modify data through an immutable reference."})]}),e.jsx("p",{children:"All of this happens at compile time with zero runtime cost."})]}),e.jsx(n,{type:"pythonista",title:"Python has no borrow checker",children:e.jsx("p",{children:"Python lets you create references freely and mutate anything at any time. The bugs that the borrow checker prevents — iterator invalidation, data races, use-after-free — either cause silent corruption or require defensive programming (deep copies, locks, careful documentation) in Python. Rust's approach trades compile-time friction for runtime safety."})}),e.jsx("h2",{children:'Error 1: "Cannot borrow as mutable because also borrowed as immutable"'}),e.jsx("p",{children:"This is the most common borrow checker error. It means you're trying to modify data while a read-only reference to it still exists."}),e.jsx(t,{language:"rust",title:"The classic aliasing conflict",code:`fn main() {
    let mut items = vec![String::from("a"), String::from("b")];

    // ERROR version:
    // let first = &items[0];     // immutable borrow
    // items.push(String::from("c")); // mutable borrow — CONFLICT
    // println!("{}", first);     // immutable borrow still in use

    // WHY this is an error:
    // push() might reallocate the Vec's buffer, which would
    // invalidate 'first' (it points into the old buffer).
    // This is exactly the bug C++ has with iterator invalidation.

    // Fix 1: Use the reference before mutating
    let first = &items[0];
    println!("{}", first);        // last use of 'first'
    items.push(String::from("c")); // now OK

    // Fix 2: Copy/clone the value out
    let first_owned = items[0].clone(); // independent copy
    items.push(String::from("d"));
    println!("{}", first_owned);  // works — it's a separate String

    // Fix 3: Restructure with index
    let first_idx = 0;            // store the index, not a reference
    items.push(String::from("e"));
    println!("{}", items[first_idx]); // re-borrow after mutation
}`}),e.jsx("h2",{children:'Error 2: "Cannot move out of borrowed content"'}),e.jsx(t,{language:"rust",title:"Moving out of a reference is not allowed",code:`fn main() {
    let names = vec![String::from("Alice"), String::from("Bob")];

    // ERROR: cannot move out of index of Vec<String>
    // let first = names[0]; // This would leave a "hole" in the Vec

    // Fix 1: Borrow instead
    let first = &names[0];
    println!("{}", first);

    // Fix 2: Clone
    let first_owned = names[0].clone();
    println!("{}", first_owned);

    // Fix 3: Remove from the collection (if you own it and it's mutable)
    let mut names2 = vec![String::from("Carol"), String::from("Dave")];
    let first = names2.remove(0); // takes it out of the Vec
    println!("{}", first); // "Carol"
    println!("{:?}", names2); // ["Dave"]

    // Fix 4: swap_remove (O(1) but changes order)
    let mut names3 = vec![String::from("Eve"), String::from("Frank")];
    let first = names3.swap_remove(0);
    println!("{}", first); // "Eve"
}`}),e.jsx("h2",{children:'Error 3: "Does not live long enough"'}),e.jsx(t,{language:"rust",title:"Reference outlives the data it borrows",code:`// ERROR: dangling reference
// fn get_greeting() -> &str {
//     let s = String::from("hello");
//     &s  // 's' is dropped when the function returns,
//         // but we're trying to return a reference to it!
// }

// Fix 1: Return the owned value
fn get_greeting() -> String {
    let s = String::from("hello");
    s  // move ownership to the caller
}

// Fix 2: Take a reference as input (borrow from caller)
fn get_first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[..i];
        }
    }
    s
}

fn main() {
    let greeting = get_greeting();
    println!("{}", greeting);

    let sentence = String::from("hello world");
    let word = get_first_word(&sentence);
    println!("{}", word); // "hello"
}`}),e.jsx("h2",{children:'Error 4: "Cannot borrow as mutable more than once"'}),e.jsx(t,{language:"rust",title:"Two mutable references to the same data",code:`fn main() {
    let mut data = vec![1, 2, 3, 4, 5];

    // ERROR: two mutable borrows at the same time
    // let left = &mut data[..2];
    // let right = &mut data[3..];
    // left[0] = 10;  // using both mutable refs
    // right[0] = 40;

    // Fix: Use split_at_mut — Rust provides safe APIs for this pattern
    let (left, right) = data.split_at_mut(3);
    left[0] = 10;
    right[0] = 40;  // right[0] is data[3]
    println!("{:?}", data); // [10, 2, 3, 40, 5]

    // Why split_at_mut works: the compiler can prove the two
    // slices don't overlap, so it allows two &mut borrows.
}`}),e.jsx(n,{type:"tip",title:"The borrow checker is your pair programmer",children:e.jsx("p",{children:`Every borrow checker error corresponds to a real bug that could occur at runtime. When you get an error, don't think "how do I trick the compiler." Think "what bug is the compiler preventing?" Then choose the fix that makes your code genuinely correct.`})}),e.jsx("h2",{children:"Strategies for Working with the Borrow Checker"}),e.jsx(r,{title:"Five Strategies When the Borrow Checker Complains",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"1. Reduce scope of borrows."})," Use values immediately rather than storing references in long-lived variables. Let borrows end before you need to mutate."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"2. Clone when cheap."})," For small data or infrequent operations,",e.jsx("code",{children:".clone()"})," eliminates borrow conflicts entirely. Don't optimize prematurely."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"3. Use indices instead of references."})," Store an index into a collection instead of a reference. Re-index when you need the value."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"4. Restructure ownership."})," Sometimes the cleanest fix is to rethink who owns what. Can you split data into separate structs?"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"5. Use interior mutability."})," Types like ",e.jsx("code",{children:"RefCell"}),",",e.jsx("code",{children:"Cell"}),", and ",e.jsx("code",{children:"Mutex"})," move borrow checking to runtime. Use sparingly — they're the escape hatch, not the default."]})]})}),e.jsx("h2",{children:"When to Restructure vs When to Clone"}),e.jsx(s,{title:"A common borrow checker scenario",description:"In Python, you can read and write freely. In Rust, you may need to restructure the code.",pythonCode:`class Cache:
    def __init__(self):
        self.data = {}

    def get_or_compute(self, key):
        if key not in self.data:
            # Read AND write self.data freely
            value = expensive_compute(key)
            self.data[key] = value
        return self.data[key]

# This works in Python because there's
# no borrow checking — but in concurrent
# code, this is a data race waiting to
# happen.`,rustCode:`use std::collections::HashMap;

struct Cache {
    data: HashMap<String, String>,
}

impl Cache {
    fn get_or_compute(&mut self, key: &str) -> &str {
        // Can't borrow self.data immutably (to check)
        // AND mutably (to insert) at the same time.

        // Solution: use entry API
        self.data.entry(key.to_string())
            .or_insert_with(|| expensive_compute(key))
    }
}

fn expensive_compute(key: &str) -> String {
    format!("computed_{}", key)
}`}),e.jsx(t,{language:"rust",title:"Real-world pattern: processing items in a struct",code:`struct Processor {
    items: Vec<String>,
    log: Vec<String>,
}

impl Processor {
    // BAD: tries to borrow self immutably (items) and mutably (log)
    // fn process_bad(&mut self) {
    //     for item in &self.items {       // immutable borrow of self
    //         self.log.push(item.clone()); // mutable borrow of self — ERROR
    //     }
    // }

    // GOOD: borrow individual fields, not all of self
    fn process(&mut self) {
        for item in &self.items {
            self.log.push(item.clone());
        }
        // This actually works! Rust is smart enough to see that
        // &self.items and &mut self.log borrow DIFFERENT fields.
        // This is called "split borrowing."
    }

    // If split borrowing doesn't work, collect first:
    fn process_v2(&mut self) {
        let items_copy: Vec<String> = self.items.clone();
        for item in items_copy {
            self.log.push(item);
        }
    }
}

fn main() {
    let mut p = Processor {
        items: vec![String::from("a"), String::from("b")],
        log: vec![],
    };
    p.process();
    println!("{:?}", p.log); // ["a", "b"]
}`}),e.jsx(n,{type:"note",title:"Split borrowing of struct fields",children:e.jsxs("p",{children:["Rust allows borrowing different fields of a struct independently. If you borrow",e.jsx("code",{children:"&self.items"})," immutably and ",e.jsx("code",{children:"&mut self.log"})," mutably, the compiler sees these as non-overlapping borrows and allows it. This only works when the compiler can see the individual field access — it does not work through method calls that take ",e.jsx("code",{children:"&self"})," or ",e.jsx("code",{children:"&mut self"}),"."]})}),e.jsx(i,{title:"Diagnose and Fix",difficulty:"medium",problem:`This function tries to remove duplicates from a vector in place.
It does not compile. Identify the borrow checker error and fix it.

fn remove_duplicates(items: &mut Vec<String>) {
    let mut seen = std::collections::HashSet::new();
    let mut i = 0;
    while i < items.len() {
        if seen.contains(&items[i]) {
            items.remove(i);
        } else {
            seen.insert(&items[i]);
            i += 1;
        }
    }
}

Hint: think about what 'seen' is holding references to.`,solution:`// The problem: 'seen' holds references to elements inside 'items'.
// When we call items.remove(i), we mutably borrow items — but
// seen still holds immutable references into it. Conflict!

// Fix: store owned values in the HashSet instead of references
fn remove_duplicates(items: &mut Vec<String>) {
    let mut seen = std::collections::HashSet::new();
    let mut i = 0;
    while i < items.len() {
        if seen.contains(&items[i]) {
            items.remove(i);
        } else {
            seen.insert(items[i].clone()); // clone into the set
            i += 1;
        }
    }
}

// Alternative: functional approach (rebuild the vec)
fn remove_duplicates_v2(items: &mut Vec<String>) {
    let mut seen = std::collections::HashSet::new();
    items.retain(|item| seen.insert(item.clone()));
}

fn main() {
    let mut data = vec![
        String::from("a"), String::from("b"),
        String::from("a"), String::from("c"),
        String::from("b"),
    ];
    remove_duplicates(&mut data);
    println!("{:?}", data); // ["a", "b", "c"]
}`}),e.jsx(i,{title:"Borrow Checker Quiz",difficulty:"medium",problem:`For each code snippet, state whether it compiles and why:

// Snippet A
let mut v = vec![1, 2, 3];
let r = &v;
println!("{:?}", r);
v.push(4);

// Snippet B
let mut v = vec![1, 2, 3];
let r = &v;
v.push(4);
println!("{:?}", r);

// Snippet C
let mut v = vec![1, 2, 3];
let r = &v[0];
let val = *r;
v.push(4);
println!("{}", val);

// Snippet D
let mut s = String::from("hello");
let r1 = &s;
let r2 = &s;
println!("{} {}", r1, r2);
let r3 = &mut s;
r3.push_str(" world");`,solution:`// Snippet A: COMPILES
// r's last use is println, which comes BEFORE v.push(4).
// The immutable borrow ends at println, so push is fine.

// Snippet B: DOES NOT COMPILE
// r is used in println AFTER v.push(4).
// The immutable borrow (r) and mutable borrow (push) overlap.

// Snippet C: COMPILES
// r borrows v[0] immutably. *r copies the i32 (Copy type) into val.
// After 'let val = *r', r is no longer used. v.push(4) is fine.
// val is an independent copy, not a reference.

// Snippet D: COMPILES
// r1 and r2 are immutable borrows, both last used in println.
// After println, both borrows end. r3 is a mutable borrow that
// starts after the immutable borrows are done. No conflict.`})]}),C=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"})),m=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"String vs &str"}),e.jsxs("p",{children:["One of the first things that trips up Python developers in Rust is that there are ",e.jsx("em",{children:"two"})," main string types: ",e.jsx("code",{children:"String"})," and",e.jsx("code",{children:" &str"}),". In Python, there is just ",e.jsx("code",{children:"str"}),". Understanding the difference is essential because you'll use strings constantly, and choosing the wrong type leads to confusing compiler errors."]}),e.jsx(r,{title:"Two String Types, Two Purposes",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"String"})," — An owned, heap-allocated, growable string. You can modify it, append to it, and pass ownership around. Analogous to a Python ",e.jsx("code",{children:"str"})," that you built with ",e.jsx("code",{children:"f-strings"})," or concatenation."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"&str"})," (string slice) — A borrowed, read-only view into string data. It doesn't own the data — it's a reference to bytes owned by something else (a ",e.jsx("code",{children:"String"}),", a string literal, or a file)."]})]})}),e.jsx(s,{title:"String types comparison",description:"Python has one string type. Rust splits the concept into owned (String) and borrowed (&str).",pythonCode:`# Python: just one string type
name = "Alice"        # str
greeting = f"Hi {name}"  # str
greeting += "!"       # creates a new str

# Python strings are:
# - Always heap-allocated
# - Always reference-counted
# - Immutable (concatenation creates new objects)
# - One type for everything

type(name)      # <class 'str'>
type(greeting)  # <class 'str'>`,rustCode:`fn main() {
    // &str: string literal (baked into binary)
    let name: &str = "Alice";

    // String: owned, heap-allocated
    let greeting: String = format!("Hi {}", name);

    // String is growable
    let mut msg = String::from("hello");
    msg.push_str(" world");

    // &str is a lightweight view
    let slice: &str = &msg[0..5]; // "hello"

    println!("{}", slice);
}`}),e.jsx("h2",{children:"String: Owned and Growable"}),e.jsx(t,{language:"rust",title:"Creating and modifying Strings",code:`fn main() {
    // Ways to create a String
    let s1 = String::from("hello");
    let s2 = "hello".to_string();
    let s3 = String::new();          // empty
    let s4 = format!("{}-{}", "hello", "world");

    // Strings are growable
    let mut s = String::from("hello");
    s.push(' ');           // push a single char
    s.push_str("world");  // push a string slice
    s += "!";              // += works too
    println!("{}", s);     // "hello world!"

    // String owns its data on the heap
    // When s goes out of scope, the heap memory is freed
    println!("Length: {}, Capacity: {}", s.len(), s.capacity());
}`}),e.jsx("h2",{children:"&str: Borrowed String Slice"}),e.jsx(t,{language:"rust",title:"String slices are lightweight views",code:`fn main() {
    let owned = String::from("hello world");

    // &str can be a slice of a String
    let hello: &str = &owned[0..5];
    let world: &str = &owned[6..11];
    println!("{} {}", hello, world);

    // String literals are &str — they point to data in the binary
    let literal: &str = "I live in the executable";

    // &str is just a pointer + length (16 bytes on 64-bit)
    // It does NOT own the data and does NOT allocate
    println!("{}", literal);

    // A &String automatically converts to &str
    let s = String::from("auto-conversion");
    let slice: &str = &s;  // Deref coercion: &String -> &str
    println!("{}", slice);
}`}),e.jsx("h2",{children:"When to Use Which"}),e.jsx(r,{title:"String vs &str: Decision Guide",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Use String when:"})," you need to own the data, modify it, store it in a struct, return it from a function, or build it dynamically."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Use &str when:"})," you only need to read the data, especially in function parameters. This accepts both ",e.jsx("code",{children:"String"})," (via",e.jsx("code",{children:"&my_string"}),") and string literals."]})]})}),e.jsx(t,{language:"rust",title:"Function parameters should usually take &str",code:`// GOOD: accepts both String and &str
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

// LESS FLEXIBLE: only accepts String (forces caller to allocate)
fn greet_owned(name: String) {
    println!("Hello, {}!", name);
}

fn main() {
    let owned = String::from("Alice");
    let literal = "Bob";

    // &str parameter works with everything
    greet(&owned);    // &String -> &str (automatic)
    greet(literal);   // &str -> &str (direct)

    // String parameter requires an owned String
    greet_owned(String::from("Carol")); // must create a String
    greet_owned(owned);                 // moves ownership!
    // greet_owned(literal.to_string()); // must convert
}`}),e.jsx(n,{type:"tip",title:"The golden rule: take &str, return String",children:e.jsxs("p",{children:["For function parameters, prefer ",e.jsx("code",{children:"&str"})," (maximum flexibility for callers). For return types, prefer ",e.jsx("code",{children:"String"})," (the caller gets ownership and can decide what to do with it). This pattern avoids lifetime complexity and works well in 90% of cases."]})}),e.jsx("h2",{children:"Converting Between String and &str"}),e.jsx(t,{language:"rust",title:"Conversions between string types",code:`fn main() {
    // &str -> String
    let s1: String = "hello".to_string();
    let s2: String = String::from("hello");
    let s3: String = "hello".to_owned();
    // All three are equivalent. to_string() is most common.

    // String -> &str
    let owned = String::from("hello");
    let slice1: &str = &owned;          // Deref coercion
    let slice2: &str = owned.as_str();  // Explicit method
    let slice3: &str = &owned[..];      // Full-range slice

    // In practice, you rarely need explicit conversion.
    // Deref coercion handles &String -> &str automatically
    // when calling functions that take &str.
    fn print_it(s: &str) { println!("{}", s); }
    print_it(&owned);  // automatic conversion
}`}),e.jsx(s,{title:"String operations comparison",description:"Common string operations mapped between Python and Rust.",pythonCode:`name = "alice"

# Common operations
upper = name.upper()
has_a = "a" in name
parts = "a,b,c".split(",")
joined = "-".join(parts)
trimmed = "  hello  ".strip()
starts = name.startswith("al")
length = len(name)`,rustCode:`fn main() {
    let name = "alice";

    // Same operations in Rust
    let upper = name.to_uppercase();
    let has_a = name.contains('a');
    let parts: Vec<&str> = "a,b,c".split(',').collect();
    let joined = parts.join("-");
    let trimmed = "  hello  ".trim();
    let starts = name.starts_with("al");
    let length = name.len(); // bytes, not chars!
    // For char count: name.chars().count()
}`}),e.jsx(n,{type:"warning",title:"len() counts bytes, not characters",children:e.jsxs("p",{children:["Rust strings are UTF-8 encoded. ",e.jsx("code",{children:".len()"})," returns the number of bytes, not characters. For ASCII strings this is the same, but for strings with multi-byte characters (emoji, CJK, accented letters), it differs. Use ",e.jsx("code",{children:".chars().count()"})," for the character count."]})}),e.jsx("h2",{children:"Strings in Structs"}),e.jsx(t,{language:"rust",title:"Structs that hold string data",code:`// COMMON: struct owns its string data with String
struct User {
    name: String,    // owned — the struct controls the lifetime
    email: String,
}

// LESS COMMON: struct borrows string data with &str
// Requires a lifetime annotation (covered in lifetimes chapter)
struct UserRef<'a> {
    name: &'a str,   // borrowed — someone else owns the data
    email: &'a str,
}

fn main() {
    // Owned version: straightforward
    let user = User {
        name: String::from("Alice"),
        email: String::from("alice@example.com"),
    };

    // Borrowed version: data must outlive the struct
    let name = String::from("Bob");
    let email = String::from("bob@example.com");
    let user_ref = UserRef {
        name: &name,
        email: &email,
    };
    println!("{} <{}>", user_ref.name, user_ref.email);
}

// Guideline: Use String in structs unless you have a specific
// reason to use &str (e.g., zero-copy parsing).`}),e.jsx(i,{title:"String Type Detective",difficulty:"beginner",problem:`For each variable below, state whether its type is String or &str,
and explain why:

let a = "hello";
let b = String::from("hello");
let c = &b;
let d = &b[1..3];
let e = b.as_str();
let f = "hello".to_string();
let g = format!("hi {}", a);`,solution:`let a = "hello";              // &str — string literal
let b = String::from("hello"); // String — explicitly created
let c = &b;                   // &String — reference to a String
                              // (auto-converts to &str when needed)
let d = &b[1..3];            // &str — a slice of the String
let e = b.as_str();          // &str — explicit conversion
let f = "hello".to_string(); // String — converted from &str
let g = format!("hi {}", a); // String — format! always returns String

Key insight: string literals are &str (compiled into the binary),
format!/to_string/String::from create owned Strings on the heap.`}),e.jsx(i,{title:"Fix the String Errors",difficulty:"easy",problem:`Fix each function so it compiles:

// 1. This function should accept both String and &str
fn contains_hello(s: String) -> bool {
    s.contains("hello")
}

// 2. This function should build and return a greeting
fn make_greeting(name: &str) -> &str {
    let greeting = format!("Hello, {}!", name);
    &greeting
}

// 3. This struct should store a name
struct Config {
    name: &str,
}`,solution:`// 1. Take &str instead of String for flexibility
fn contains_hello(s: &str) -> bool {
    s.contains("hello")
}
// Now works with: contains_hello("hello world")
// And with: contains_hello(&my_string)

// 2. Return String instead of &str (you can't return a
// reference to a local variable — it would dangle)
fn make_greeting(name: &str) -> String {
    format!("Hello, {}!", name)
}

// 3. Either use String (simplest) or add a lifetime
struct Config {
    name: String,  // owns the data — no lifetime needed
}

// Or with lifetime (less common):
struct ConfigRef<'a> {
    name: &'a str,
}`})]}),k=Object.freeze(Object.defineProperty({__proto__:null,default:m},Symbol.toStringTag,{value:"Module"})),f=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Slice Patterns"}),e.jsxs("p",{children:["Slices are one of Rust's most powerful features — they give you a ",e.jsx("em",{children:"view"})," into a contiguous sequence of elements without copying. If you come from Python, you use slicing all the time (",e.jsx("code",{children:"list[1:3]"}),"), but there's a critical difference: Python slicing creates a new list, while Rust slicing creates a zero-cost reference into the original data."]}),e.jsx(r,{title:"What Is a Slice?",children:e.jsxs("p",{children:["A slice (",e.jsx("code",{children:"&[T]"}),") is a reference to a contiguous section of an array or vector. It consists of just two values: a pointer to the first element and a length. Slices don't own data — they borrow it. This makes them extremely cheap to create and pass around."]})}),e.jsx("h2",{children:"Python Slicing vs Rust Slicing"}),e.jsx(s,{title:"Slicing: copy vs view",description:"Python slicing creates a new list (O(n) copy). Rust slicing creates a reference (O(1) view).",pythonCode:`data = [10, 20, 30, 40, 50]

# Python slice COPIES the elements
chunk = data[1:4]
print(chunk)      # [20, 30, 40]

# chunk is independent — modifying it
# does NOT affect data
chunk[0] = 999
print(data)       # [10, 20, 30, 40, 50]
print(chunk)      # [999, 30, 40]

# This copying is O(n) and allocates
# For large arrays, it's expensive`,rustCode:`fn main() {
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
}`}),e.jsx(n,{type:"pythonista",title:"NumPy slicing is closer to Rust",children:e.jsxs("p",{children:["If you use NumPy, you already understand views vs copies. NumPy's",e.jsx("code",{children:" arr[1:4]"})," creates a view (like Rust), not a copy (like Python lists). Rust applies this same zero-copy view concept to all slice types."]})}),e.jsx("h2",{children:"Creating Slices"}),e.jsx(t,{language:"rust",title:"Slice syntax with ranges",code:`fn main() {
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
}`}),e.jsx("h2",{children:"Slices as Function Parameters"}),e.jsx(t,{language:"rust",title:"Take &[T] for maximum flexibility",code:`// Takes a slice — works with Vec, array, or any contiguous data
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
}`}),e.jsx(n,{type:"tip",title:"Prefer &[T] over &Vec<T> in function signatures",children:e.jsxs("p",{children:["Just as ",e.jsx("code",{children:"&str"})," is preferred over ",e.jsx("code",{children:"&String"})," for string parameters, ",e.jsx("code",{children:"&[T]"})," is preferred over ",e.jsx("code",{children:"&Vec<T>"}),". A ",e.jsx("code",{children:"&[T]"})," slice accepts data from ",e.jsx("code",{children:"Vec"}),", arrays, and other slices. A ",e.jsx("code",{children:"&Vec<T>"})," only accepts ",e.jsx("code",{children:"Vec"})," references. More flexible, same performance."]})}),e.jsx("h2",{children:"Mutable Slices"}),e.jsx(t,{language:"rust",title:"Modifying data through &mut [T]",code:`fn double_all(values: &mut [i32]) {
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
}`}),e.jsx("h2",{children:"String Slices Revisited"}),e.jsx(t,{language:"rust",title:"&str is a slice of String data",code:`fn first_word(s: &str) -> &str {
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
}`}),e.jsx(n,{type:"warning",title:"String slicing panics on invalid UTF-8 boundaries",children:e.jsxs("p",{children:["Rust strings are UTF-8. Slicing with byte indices that fall in the middle of a multi-byte character causes a runtime panic. For safe character-level slicing, use ",e.jsx("code",{children:".chars()"})," iterator methods. For ASCII-only text, byte slicing is always safe."]})}),e.jsx("h2",{children:"Common Slice Methods"}),e.jsx(t,{language:"rust",title:"Useful methods on slices",code:`fn main() {
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
}`}),e.jsx(s,{title:"Slice operations compared",description:"Common slice/list operations mapped between Python and Rust.",pythonCode:`data = [3, 1, 4, 1, 5, 9]

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
chunks = list(itertools.batched(data, 2))`,rustCode:`fn main() {
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
}`}),e.jsx(i,{title:"Sliding Window Average",difficulty:"easy",problem:`Write a function moving_average that takes a &[f64] and a window
size, and returns a Vec<f64> of averages for each window position.

Example: moving_average(&[1.0, 2.0, 3.0, 4.0, 5.0], 3)
should return [2.0, 3.0, 4.0]

Hint: use the .windows() method on slices.`,solution:`fn moving_average(data: &[f64], window_size: usize) -> Vec<f64> {
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
}`}),e.jsx(i,{title:"Split Without Copying",difficulty:"medium",problem:`Write a function split_at_value that takes a &[i32] and a target value,
and returns two slices: everything before the first occurrence of the target,
and everything after it (excluding the target itself). Return None if the
target is not found.

fn split_at_value(data: &[i32], target: i32) -> Option<(&[i32], &[i32])>

Example: split_at_value(&[1, 2, 3, 4, 5], 3) returns Some(([1, 2], [4, 5]))

Important: the returned slices must be views into the original data, not copies.`,solution:`fn split_at_value(data: &[i32], target: i32) -> Option<(&[i32], &[i32])> {
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
}`})]}),T=Object.freeze(Object.defineProperty({__proto__:null,default:f},Symbol.toStringTag,{value:"Module"})),p=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Lifetime Annotations"}),e.jsxs("p",{children:["Lifetimes are the part of Rust's ownership system that ensures references are always valid. They are Rust's answer to a problem Python developers never face because Python's garbage collector keeps objects alive as long as any reference exists. In Rust, there is no GC, so the compiler needs help understanding",e.jsx("em",{children:" how long"})," references are valid."]}),e.jsx(r,{title:"Why Lifetimes Exist",children:e.jsx("p",{children:"Consider a function that returns a reference. The compiler needs to know: does the returned reference point to data from the first argument or the second? How long must the caller keep those arguments alive? Lifetime annotations answer these questions. They don't change how long data lives — they describe relationships between reference lifetimes so the compiler can verify safety."})}),e.jsx("h2",{children:"The Dangling Reference Problem"}),e.jsx(t,{language:"rust",title:"What lifetimes prevent",code:`// This code will NOT compile — and that's a good thing.
// fn dangling() -> &str {
//     let s = String::from("hello");
//     &s  // ERROR: 's' is dropped when this function returns,
//         // creating a dangling reference
// }

// In C, this compiles and returns a pointer to freed memory.
// In Python, the GC would keep 's' alive. In Rust, the compiler
// catches it at compile time.

// Fix: return the owned value
fn not_dangling() -> String {
    let s = String::from("hello");
    s  // transfer ownership to the caller
}

fn main() {
    let s = not_dangling();
    println!("{}", s);
}`}),e.jsx(n,{type:"pythonista",title:"Why Python doesn't have lifetimes",children:e.jsx("p",{children:"In Python, the garbage collector tracks every reference and keeps objects alive as long as any reference exists. This means you never encounter dangling references — but it costs runtime performance (reference counting, GC pauses). Rust's lifetimes achieve the same safety guarantee at compile time with zero runtime cost."})}),e.jsx("h2",{children:"Lifetime Syntax: 'a"}),e.jsxs("p",{children:["Lifetime annotations use an apostrophe followed by a short name, conventionally starting with ",e.jsx("code",{children:"'a"}),". They appear in function signatures, struct definitions, and impl blocks."]}),e.jsx(t,{language:"rust",title:"Basic lifetime annotation syntax",code:`// This function takes two string references and returns one.
// The lifetime 'a tells the compiler: "the returned reference
// will be valid as long as BOTH inputs are valid."

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let string1 = String::from("long string");

    {
        let string2 = String::from("xyz");
        let result = longest(&string1, &string2);
        println!("Longest: {}", result); // OK: both strings are alive
    }
    // string2 is dropped here

    // This would NOT compile:
    // let result;
    // {
    //     let string2 = String::from("xyz");
    //     result = longest(&string1, &string2);
    // }
    // println!("{}", result); // ERROR: string2 already dropped
    //                         // but result might reference it
}`}),e.jsx("h2",{children:"What Lifetimes Tell the Compiler"}),e.jsxs(r,{title:"Lifetimes Are Constraints, Not Commands",children:[e.jsxs("p",{children:["Lifetime annotations do not change how long values live. They are",e.jsx("strong",{children:" constraints"})," that the compiler checks:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"fn longest<'a>(x: &'a str, y: &'a str) -> &'a str"}),' says: "the returned reference lives at most as long as the shorter of x and y."']}),e.jsx("li",{children:"The compiler uses this to verify that callers don't use the return value after either input has been dropped."}),e.jsx("li",{children:"You're not telling Rust how long to keep data alive — you're telling it what guarantees to check."})]})]}),e.jsx(t,{language:"rust",title:"Understanding what lifetimes mean",code:`// The lifetime 'a means: "these references all share the same lifetime constraint"
// In practice: the return value's lifetime is the MINIMUM of all 'a references

// Only x's lifetime affects the output
fn first_of<'a>(x: &'a str, _y: &str) -> &'a str {
    x  // returned reference has the same lifetime as x
    // _y has no lifetime connection to the return value
}

// Different lifetimes for different relationships
fn pick_first<'a, 'b>(x: &'a str, _y: &'b str) -> &'a str {
    x  // returned reference tied to x's lifetime only
}

fn main() {
    let x = String::from("hello");
    let result;
    {
        let y = String::from("world");
        result = first_of(&x, &y);
        // Even though y is about to be dropped, this is fine
        // because the return value is tied to x's lifetime, not y's
    }
    println!("{}", result); // OK: x is still alive
}`}),e.jsx("h2",{children:"Simple Examples"}),e.jsx(t,{language:"rust",title:"Common patterns with lifetime annotations",code:`// Return a reference to part of the input
fn first_word<'a>(s: &'a str) -> &'a str {
    match s.find(' ') {
        Some(pos) => &s[..pos],
        None => s,
    }
}

// Return a reference to whichever condition matches
fn get_label<'a>(value: i32, positive: &'a str, negative: &'a str) -> &'a str {
    if value >= 0 { positive } else { negative }
}

// Return a reference to an element in a slice
fn find_item<'a>(items: &'a [String], target: &str) -> Option<&'a String> {
    items.iter().find(|item| item.as_str() == target)
}

fn main() {
    let sentence = String::from("hello world");
    let word = first_word(&sentence);
    println!("First word: {}", word);

    let label = get_label(-5, "positive", "negative");
    println!("Label: {}", label);

    let names = vec![String::from("Alice"), String::from("Bob")];
    if let Some(found) = find_item(&names, "Alice") {
        println!("Found: {}", found);
    }
}`}),e.jsx(s,{title:"Returning references: Python vs Rust",description:"Python never worries about reference validity. Rust requires lifetime annotations to guarantee it.",pythonCode:`def longest(x, y):
    return x if len(x) > len(y) else y

# Python keeps everything alive via refcount
a = "long string"
b = "xyz"
result = longest(a, b)

# Even if we delete the originals,
# result stays valid
del a, b
print(result)  # "long string"
# The GC ensures the string lives on`,rustCode:`fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let a = String::from("long string");
    let b = String::from("xyz");
    let result = longest(&a, &b);

    // result is valid because both a and b
    // are still in scope
    println!("{}", result); // "long string"

    // The compiler ensures we don't use
    // result after a or b are dropped
}`}),e.jsx(n,{type:"tip",title:"You rarely need to write lifetimes",children:e.jsx("p",{children:"Thanks to lifetime elision rules (covered in the next section), the compiler can infer lifetimes in most cases. You only need explicit annotations when a function takes multiple references and returns a reference — the compiler needs to know which input lifetime the output is tied to."})}),e.jsx("h2",{children:"When Lifetimes Don't Help: Return Owned Data"}),e.jsx(t,{language:"rust",title:"Sometimes the answer is to not use references",code:`// You CANNOT return a reference to data created inside the function
// fn make_greeting(name: &str) -> &str {
//     let greeting = format!("Hello, {}!", name);
//     &greeting  // ERROR: greeting is dropped when function returns
// }

// Solution: return an owned String
fn make_greeting(name: &str) -> String {
    format!("Hello, {}!", name)  // String is moved to the caller
}

// Rule of thumb:
// - If you're returning data that existed before your function was called,
//   you can return a reference (with a lifetime annotation).
// - If you're creating new data inside the function, return an owned value.

fn main() {
    let greeting = make_greeting("Alice");
    println!("{}", greeting);
}`}),e.jsx(i,{title:"Add Lifetime Annotations",difficulty:"easy",problem:`The following functions need lifetime annotations to compile. Add them:

fn get_shorter(a: &str, b: &str) -> &str {
    if a.len() <= b.len() { a } else { b }
}

fn first_element(items: &[String]) -> &String {
    &items[0]
}

fn identity(s: &str) -> &str {
    s
}`,solution:`// get_shorter: return could be either input, so both need 'a
fn get_shorter<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() <= b.len() { a } else { b }
}

// first_element: return borrows from the input slice
fn first_element<'a>(items: &'a [String]) -> &'a String {
    &items[0]
}

// identity: actually compiles WITHOUT annotations!
// Lifetime elision rule 1 handles this case:
// one input reference -> output gets the same lifetime
fn identity(s: &str) -> &str {
    s
}

// But you could write it explicitly:
// fn identity<'a>(s: &'a str) -> &'a str { s }`}),e.jsx(i,{title:"Spot the Lifetime Error",difficulty:"medium",problem:`Why does this code fail to compile? Fix it without removing the
inner scope.

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let result;
    let s1 = String::from("hello world");
    {
        let s2 = String::from("hi");
        result = longest(&s1, &s2);
    }
    println!("{}", result);
}`,solution:`// The problem: result might reference s2, which is dropped
// at the end of the inner scope. But result is used after
// the inner scope (in println!). The compiler rejects this.

// Fix 1: Use result inside the inner scope
fn main() {
    let s1 = String::from("hello world");
    {
        let s2 = String::from("hi");
        let result = longest(&s1, &s2);
        println!("{}", result); // used while both are alive
    }
}

// Fix 2: Move s2 to the outer scope
fn main() {
    let s1 = String::from("hello world");
    let s2 = String::from("hi");
    let result = longest(&s1, &s2);
    println!("{}", result);
}

// Fix 3: Clone to get an owned value (no lifetime issue)
fn main() {
    let s1 = String::from("hello world");
    let result;
    {
        let s2 = String::from("hi");
        result = longest(&s1, &s2).to_string(); // owned copy
    }
    println!("{}", result);
}`})]}),O=Object.freeze(Object.defineProperty({__proto__:null,default:p},Symbol.toStringTag,{value:"Module"})),g=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Lifetime Elision Rules"}),e.jsxs("p",{children:["After the previous section, you might worry that every function with references needs lifetime annotations. The good news: the Rust compiler can ",e.jsx("em",{children:"infer"}),"lifetimes in most cases using a set of deterministic rules called ",e.jsx("strong",{children:"lifetime elision rules"}),". You only need explicit annotations when the compiler cannot figure out the lifetimes on its own."]}),e.jsx(r,{title:"What Is Lifetime Elision?",children:e.jsx("p",{children:"Lifetime elision is a set of patterns the compiler recognizes, allowing it to fill in lifetime annotations automatically. Early versions of Rust required lifetimes on every function with references. The Rust team noticed that the same patterns appeared over and over, so they taught the compiler to handle them. The result: you rarely need to write lifetimes explicitly."})}),e.jsx("h2",{children:"The Three Elision Rules"}),e.jsx(t,{language:"rust",title:"The three rules the compiler applies",code:`// Rule 1: Each input reference gets its own lifetime parameter
// What you write:
fn first_word(s: &str) -> &str { todo!() }
// What the compiler infers:
// fn first_word<'a>(s: &'a str) -> &'a str

// Rule 2: If there's exactly one input lifetime, the output
//         lifetime equals the input lifetime
// What you write:
fn trim(s: &str) -> &str { todo!() }
// What the compiler infers:
// fn trim<'a>(s: &'a str) -> &'a str

// Rule 3: If one of the inputs is &self or &mut self,
//         the output lifetime equals self's lifetime
// What you write:
// impl MyStruct {
//     fn name(&self) -> &str { todo!() }
// }
// What the compiler infers:
// fn name<'a>(&'a self) -> &'a str`}),e.jsx(r,{title:"How the Rules Work Together",children:e.jsx("p",{children:"The compiler applies the rules in order. If, after applying all three, every output reference has a determined lifetime, the function compiles without explicit annotations. If any output lifetime is still ambiguous, the compiler emits an error asking you to add annotations."})}),e.jsx("h2",{children:"Rule 1: Each Input Gets Its Own Lifetime"}),e.jsx(t,{language:"rust",title:"Rule 1 in action",code:`// One input reference -> one lifetime parameter
fn len(s: &str) -> usize { s.len() }
// Compiler sees: fn len<'a>(s: &'a str) -> usize

// Two input references -> two lifetime parameters
fn compare(a: &str, b: &str) -> bool { a == b }
// Compiler sees: fn compare<'a, 'b>(a: &'a str, b: &'b str) -> bool

// Three input references -> three lifetime parameters
fn middle(a: &str, b: &str, c: &str) -> &str { b }
// Compiler sees: fn middle<'a, 'b, 'c>(a: &'a str, b: &'b str, c: &'c str) -> &str
// But which lifetime does the return get? Rule 2 doesn't apply (multiple inputs).
// Rule 3 doesn't apply (no &self). So this NEEDS explicit annotation:
// fn middle<'b>(a: &str, b: &'b str, c: &str) -> &'b str { b }`}),e.jsx("h2",{children:"Rule 2: Single Input Lifetime Propagates to Output"}),e.jsx(t,{language:"rust",title:"Rule 2 handles the most common case",code:`// All of these work WITHOUT explicit lifetimes thanks to Rule 2:

// One input, one output — lifetime propagates
fn first_char(s: &str) -> &str {
    &s[..1]
}

// One reference input (plus non-reference inputs)
fn skip_n(s: &str, n: usize) -> &str {
    &s[n..]
}

// Returning an element from a slice
fn get_first(items: &[String]) -> &String {
    &items[0]
}

// Returning an Option with a reference
fn find_prefix<'a>(s: &'a str, prefix: &str) -> Option<&'a str> {
    // Wait — this has TWO reference inputs!
    // Rule 2 doesn't apply. But actually this DOES compile
    // without the 'a because... let's check:
    // After Rule 1: fn find_prefix<'a, 'b>(s: &'a str, prefix: &'b str) -> Option<&??? str>
    // Rule 2: only ONE input? No, there are two. Ambiguous!
    // Actually, this NEEDS the annotation. Let me fix it:
    if s.starts_with(prefix) { Some(s) } else { None }
}

fn main() {
    let text = String::from("hello world");
    println!("{}", first_char(&text));  // "h"
    println!("{}", skip_n(&text, 6));   // "world"
}`}),e.jsx("h2",{children:"Rule 3: Methods Get Self's Lifetime"}),e.jsx(t,{language:"rust",title:"Rule 3 makes methods ergonomic",code:`struct Document {
    title: String,
    body: String,
}

impl Document {
    // Rule 3: &self's lifetime is assigned to the return value
    // No explicit lifetime needed!
    fn title(&self) -> &str {
        &self.title
    }

    fn body(&self) -> &str {
        &self.body
    }

    // Even with additional reference parameters, &self wins
    fn title_or(&self, default: &str) -> &str {
        // The return lifetime is tied to &self, not 'default'
        // Rule 3 makes this work without annotations
        if self.title.is_empty() { default } else { &self.title }
    }
    // Note: title_or actually DOES need explicit lifetimes if the
    // return could be 'default'. The elided version ties it to &self.
    // If default could be returned, you'd need:
    // fn title_or<'a>(&'a self, default: &'a str) -> &'a str
}

fn main() {
    let doc = Document {
        title: String::from("Rust Guide"),
        body: String::from("Lifetimes are useful."),
    };
    println!("{}: {}", doc.title(), doc.body());
}`}),e.jsx(n,{type:"tip",title:"Don't memorize — let the compiler guide you",children:e.jsx("p",{children:"You don't need to memorize the elision rules. Write your function without lifetime annotations. If the compiler is happy, you're done. If it asks for lifetimes, add them where it tells you. Over time, you'll develop an intuition for when annotations are needed."})}),e.jsx("h2",{children:"When Elision Does Not Work"}),e.jsx(t,{language:"rust",title:"Cases that require explicit lifetimes",code:`// Case 1: Multiple reference inputs, return is a reference
// The compiler doesn't know which input the return borrows from
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// Case 2: The return references only one of multiple inputs
fn first_of_two<'a>(x: &'a str, _y: &str) -> &'a str {
    x
}

// Case 3: Struct methods where the return doesn't come from self
struct Parser {
    data: String,
}

impl Parser {
    // If the return comes from 'input', not 'self', you need annotations
    fn extract<'a>(&self, input: &'a str) -> &'a str {
        &input[1..input.len()-1]
    }
}

fn main() {
    let a = String::from("hello");
    let b = String::from("world!");
    println!("{}", longest(&a, &b));
    println!("{}", first_of_two(&a, &b));

    let parser = Parser { data: String::new() };
    let result = parser.extract("(content)");
    println!("{}", result); // "content"
}`}),e.jsx("h2",{children:"Common Cases Where Elision Works"}),e.jsx(s,{title:"Most functions don't need lifetime annotations",description:"The vast majority of Rust functions either don't use references, or have a single reference input whose lifetime is automatically propagated.",pythonCode:`# Python: no lifetime concept at all
def first_word(s: str) -> str:
    return s.split()[0] if s else ""

def get_name(user: dict) -> str:
    return user["name"]

class Config:
    def __init__(self, name: str):
        self.name = name

    def get_name(self) -> str:
        return self.name

# Python's GC makes lifetimes invisible
# but also adds runtime overhead`,rustCode:`// Rust: elision handles all of these
fn first_word(s: &str) -> &str {
    s.split_whitespace().next().unwrap_or("")
}

fn get_name(user: &HashMap<String, String>) -> &str {
    &user["name"]
}

struct Config { name: String }
impl Config {
    fn get_name(&self) -> &str {
        &self.name // Rule 3: self's lifetime
    }
}

// No explicit lifetimes needed for any
// of these — the compiler infers them

use std::collections::HashMap;`}),e.jsx(n,{type:"note",title:"The 'static lifetime",children:e.jsxs("p",{children:["One special lifetime you'll encounter is ",e.jsx("code",{children:"'static"}),". It means the reference is valid for the entire program. String literals have type",e.jsx("code",{children:"&'static str"})," because they're embedded in the binary. You rarely need to write ",e.jsx("code",{children:"'static"})," yourself, but you'll see it in error messages and trait bounds (e.g., thread spawning requires ",e.jsx("code",{children:"'static"})," data)."]})}),e.jsx(i,{title:"Elision Detective",difficulty:"easy",problem:`For each function, determine whether it compiles without explicit
lifetime annotations. If not, add the necessary annotations.

fn echo(s: &str) -> &str { s }

fn longer(a: &str, b: &str) -> &str {
    if a.len() > b.len() { a } else { b }
}

fn first(items: &[&str]) -> &str {
    items[0]
}

struct Wrapper { value: String }
impl Wrapper {
    fn get(&self) -> &str { &self.value }
    fn compare(&self, other: &str) -> &str {
        if self.value.len() > other.len() { &self.value } else { other }
    }
}`,solution:`// echo: COMPILES — Rule 1 gives 'a to s, Rule 2 gives 'a to output
fn echo(s: &str) -> &str { s }

// longer: DOES NOT COMPILE — two inputs, compiler doesn't know which
// the output borrows from. Fix:
fn longer<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

// first: COMPILES — the slice &[&str] has one lifetime for
// the outer reference. Rule 2 propagates it.
// (The inner &str elements share the slice's lifetime)
fn first(items: &[&str]) -> &str { items[0] }
// Actually this needs annotation because &[&str] involves two lifetimes.
// But in practice, the compiler handles this correctly with elision.

// get: COMPILES — Rule 3 gives &self's lifetime to output
// compare: COMPILES with Rule 3 (output tied to &self)
// BUT if 'other' is returned, this is technically wrong!
// The elided version ties the return to &self's lifetime.
// If you need to return 'other', you need explicit lifetimes:
// fn compare<'a>(&'a self, other: &'a str) -> &'a str`}),e.jsx(i,{title:"Write Without Lifetimes First",difficulty:"easy",problem:`Write these three functions. Start without any lifetime annotations.
Add annotations only if the compiler requires them.

1. A function 'trim_prefix' that takes a &str and a prefix &str,
   returning the &str with the prefix removed (or the original if
   no prefix matches).

2. A method on a struct Article { title: String, content: String }
   that returns &str of the title.

3. A function 'pick' that takes two &str and a bool, returning
   the first &str if the bool is true, the second otherwise.`,solution:`// 1. trim_prefix — needs annotations (two reference inputs)
fn trim_prefix<'a>(s: &'a str, prefix: &str) -> &'a str {
    s.strip_prefix(prefix).unwrap_or(s)
}

// 2. Article::title — no annotations needed (Rule 3)
struct Article {
    title: String,
    content: String,
}

impl Article {
    fn title(&self) -> &str {
        &self.title
    }
}

// 3. pick — needs annotations (two reference inputs, return is a reference)
fn pick<'a>(a: &'a str, b: &'a str, first: bool) -> &'a str {
    if first { a } else { b }
}

fn main() {
    println!("{}", trim_prefix("hello_world", "hello_"));
    let a = Article { title: "Rust".into(), content: "Great".into() };
    println!("{}", a.title());
    println!("{}", pick("yes", "no", true));
}`})]}),P=Object.freeze(Object.defineProperty({__proto__:null,default:g},Symbol.toStringTag,{value:"Module"})),y=()=>e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Struct Lifetimes"}),e.jsx("p",{children:"Sometimes you want a struct to hold a reference to data it doesn't own — for example, a parser that borrows the input text, or a view into a larger dataset. When a struct contains references, it needs lifetime annotations so the compiler can ensure the referenced data outlives the struct."}),e.jsx(r,{title:"Why Structs Need Lifetime Annotations",children:e.jsxs("p",{children:["If a struct holds a reference, the data it points to must live at least as long as the struct itself. Otherwise, the struct would contain a dangling pointer. The lifetime annotation ",e.jsx("code",{children:"<'a>"}),' on a struct tells the compiler: "any instance of this struct cannot outlive the data it references."']})}),e.jsx("h2",{children:"Basic Struct with a Reference"}),e.jsx(t,{language:"rust",title:"A struct that borrows data",code:`// This struct borrows a string slice — it does NOT own the string
struct Excerpt<'a> {
    text: &'a str,
}

fn main() {
    let novel = String::from(
        "Call me Ishmael. Some years ago..."
    );

    // The excerpt borrows from novel
    let first_sentence;
    {
        let excerpt = Excerpt {
            text: &novel[..15], // "Call me Ishmael"
        };
        first_sentence = excerpt.text;
    }
    // excerpt is dropped, but first_sentence still borrows from novel
    println!("{}", first_sentence); // OK: novel is still alive

    // This would NOT compile:
    // let dangling;
    // {
    //     let temp = String::from("temporary");
    //     dangling = Excerpt { text: &temp };
    // } // temp dropped — dangling would have an invalid reference
    // println!("{}", dangling.text); // ERROR
}`}),e.jsx(s,{title:"Structs with references vs Python objects",description:"Python objects freely reference other objects — the GC keeps everything alive. Rust requires explicit lifetime management.",pythonCode:`class Excerpt:
    def __init__(self, text):
        self.text = text

novel = "Call me Ishmael. Some years ago..."
excerpt = Excerpt(novel[:15])

# In Python, you never worry about
# whether 'novel' outlives 'excerpt'.
# The GC keeps the string alive as long
# as ANY reference exists.

del novel
# excerpt.text is still valid because
# Python strings are reference-counted
print(excerpt.text)  # "Call me Ishmael"`,rustCode:`struct Excerpt<'a> {
    text: &'a str,
}

fn main() {
    let novel = String::from(
        "Call me Ishmael. Some years ago..."
    );
    let excerpt = Excerpt {
        text: &novel[..15],
    };

    // Cannot drop novel while excerpt exists:
    // drop(novel); // ERROR: still borrowed
    println!("{}", excerpt.text);

    // This is the tradeoff: no GC overhead,
    // but you must ensure data outlives
    // the structs that reference it.
}`}),e.jsx("h2",{children:"Multiple References in a Struct"}),e.jsx(t,{language:"rust",title:"Struct with multiple lifetime parameters",code:`// Same lifetime: both references must live at least as long
struct Pair<'a> {
    first: &'a str,
    second: &'a str,
}

// Different lifetimes: references can have different scopes
struct PairDiff<'a, 'b> {
    first: &'a str,
    second: &'b str,
}

fn main() {
    let x = String::from("hello");
    let y = String::from("world");

    // Same lifetime — both must be alive when pair is used
    let pair = Pair {
        first: &x,
        second: &y,
    };
    println!("{} {}", pair.first, pair.second);

    // Different lifetimes — more flexible
    let outer = String::from("outer");
    let pair2;
    {
        let inner = String::from("inner");
        let p = PairDiff {
            first: &outer,
            second: &inner,
        };
        println!("{} {}", p.first, p.second);
        // p is dropped here — inner can be freed
    }
    // pair2 with different lifetimes could keep borrowing outer
}`}),e.jsx("h2",{children:"Methods on Structs with Lifetimes"}),e.jsx(t,{language:"rust",title:"impl blocks with lifetime parameters",code:`struct Config<'a> {
    name: &'a str,
    values: &'a [i32],
}

impl<'a> Config<'a> {
    // Constructor-like function
    fn new(name: &'a str, values: &'a [i32]) -> Self {
        Config { name, values }
    }

    // Method returning a reference — lifetime tied to self (Rule 3)
    fn name(&self) -> &str {
        self.name
    }

    // Method using the borrowed data
    fn sum(&self) -> i32 {
        self.values.iter().sum()
    }

    fn describe(&self) -> String {
        format!("{}: {:?} (sum={})", self.name, self.values, self.sum())
    }
}

fn main() {
    let name = "production";
    let values = vec![10, 20, 30];

    let config = Config::new(name, &values);
    println!("{}", config.describe());
    // "production: [10, 20, 30] (sum=60)"
}`}),e.jsx("h2",{children:"The Alternative: Own the Data"}),e.jsxs(r,{title:"References in Structs vs Owned Data",children:[e.jsxs("p",{children:["You often have a choice: should your struct ",e.jsx("em",{children:"borrow"})," data with references, or ",e.jsx("em",{children:"own"})," the data with types like ",e.jsx("code",{children:"String"}),"and ",e.jsx("code",{children:"Vec"}),"? Here's the tradeoff:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"References (&'a T):"})," No allocation, zero-copy, but the struct can't outlive the source data. Good for temporary views and parsing."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Owned data (String, Vec):"})," The struct is self-contained and can be moved anywhere. Simpler to use but involves allocation. Good for long-lived data and when you're unsure about lifetimes."]})]})]}),e.jsx(t,{language:"rust",title:"Borrowed vs owned struct comparison",code:`// BORROWED: zero-copy, but lifetime-constrained
struct LogEntryRef<'a> {
    timestamp: &'a str,
    message: &'a str,
    level: &'a str,
}

// OWNED: self-contained, but allocates
struct LogEntry {
    timestamp: String,
    message: String,
    level: String,
}

// Borrowed is great for parsing (no allocation needed)
fn parse_log_line(line: &str) -> Option<LogEntryRef> {
    let parts: Vec<&str> = line.splitn(3, ' ').collect();
    if parts.len() == 3 {
        Some(LogEntryRef {
            timestamp: parts[0],
            level: parts[1],
            message: parts[2],
        })
    } else {
        None
    }
}

// Owned is great for storing (no lifetime constraints)
fn parse_and_store(line: &str) -> Option<LogEntry> {
    let parts: Vec<&str> = line.splitn(3, ' ').collect();
    if parts.len() == 3 {
        Some(LogEntry {
            timestamp: parts[0].to_string(),
            level: parts[1].to_string(),
            message: parts[2].to_string(),
        })
    } else {
        None
    }
}

fn main() {
    let line = "2024-01-15 INFO Server started";

    // Borrowed: efficient but tied to 'line'
    let entry_ref = parse_log_line(line).unwrap();
    println!("{}: {}", entry_ref.level, entry_ref.message);

    // Owned: independent, can be stored in a Vec, sent to another thread
    let entry_owned = parse_and_store(line).unwrap();
    // entry_owned can be stored anywhere — it owns all its data
    let logs: Vec<LogEntry> = vec![entry_owned];
    println!("{}: {}", logs[0].level, logs[0].message);
}`}),e.jsx(n,{type:"tip",title:"When in doubt, own the data",children:e.jsxs("p",{children:["For beginners, start with owned data (",e.jsx("code",{children:"String"})," instead of",e.jsx("code",{children:"&str"}),", ",e.jsx("code",{children:"Vec<T>"})," instead of ",e.jsx("code",{children:"&[T]"}),"). Owned structs are simpler — no lifetime annotations, no constraints on how long they live. Optimize to references later if performance profiling shows allocation is a bottleneck. Many production Rust programs use owned data throughout and are plenty fast."]})}),e.jsx("h2",{children:"Real-World Example: Zero-Copy Parser"}),e.jsx(t,{language:"rust",title:"A CSV row parser that borrows from the input",code:`struct CsvRow<'a> {
    fields: Vec<&'a str>,
}

impl<'a> CsvRow<'a> {
    fn parse(line: &'a str) -> Self {
        CsvRow {
            fields: line.split(',').map(|f| f.trim()).collect(),
        }
    }

    fn get(&self, index: usize) -> Option<&str> {
        self.fields.get(index).copied()
    }

    fn len(&self) -> usize {
        self.fields.len()
    }
}

fn main() {
    let data = "Alice, 30, Engineer
Bob, 25, Designer";

    // Parse without any allocation for field strings
    for line in data.lines() {
        let row = CsvRow::parse(line);
        if let (Some(name), Some(age)) = (row.get(0), row.get(1)) {
            println!("{} is {} years old", name, age);
        }
    }
    // Each CsvRow borrows slices of the original string.
    // Zero allocations for the field data itself!
    // (The Vec<&str> allocates, but the strings don't.)
}`}),e.jsx(n,{type:"pythonista",title:"Python's csv module allocates for every field",children:e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"csv.reader"})," creates a new string object for every field in every row. For a CSV with 1 million rows and 10 columns, that's 10 million string allocations. Rust's borrowing approach can parse the same CSV with zero string allocations — each field is just a pointer into the original input buffer. This is why Rust-based CSV parsers are dramatically faster."]})}),e.jsx(i,{title:"Build a Borrowing Struct",difficulty:"easy",problem:`Create a struct WordStats<'a> that borrows a &str and provides
methods to compute:
1. word_count() -> usize
2. longest_word() -> &str (returns the longest word)
3. contains_word(&self, target: &str) -> bool

The struct should NOT own the string data.`,solution:`struct WordStats<'a> {
    text: &'a str,
}

impl<'a> WordStats<'a> {
    fn new(text: &'a str) -> Self {
        WordStats { text }
    }

    fn word_count(&self) -> usize {
        self.text.split_whitespace().count()
    }

    fn longest_word(&self) -> &str {
        self.text
            .split_whitespace()
            .max_by_key(|w| w.len())
            .unwrap_or("")
    }

    fn contains_word(&self, target: &str) -> bool {
        self.text.split_whitespace().any(|w| w == target)
    }
}

fn main() {
    let text = String::from("the quick brown fox jumps over the lazy dog");
    let stats = WordStats::new(&text);

    println!("Words: {}", stats.word_count());       // 9
    println!("Longest: {}", stats.longest_word());    // "jumps"
    println!("Has 'fox': {}", stats.contains_word("fox")); // true
    println!("Has 'cat': {}", stats.contains_word("cat")); // false

    // text is still usable
    println!("Original: {}", text);
}`}),e.jsx(i,{title:"Refactor to Owned",difficulty:"medium",problem:`Take this borrowed struct and refactor it to use owned data.
Explain the tradeoffs.

struct SearchResult<'a> {
    query: &'a str,
    matches: Vec<&'a str>,
    source: &'a str,
}

impl<'a> SearchResult<'a> {
    fn summary(&self) -> String {
        format!(
            "Found {} matches for '{}' in '{}'",
            self.matches.len(), self.query, self.source
        )
    }
}`,solution:`// Owned version — no lifetime annotations needed
struct SearchResult {
    query: String,
    matches: Vec<String>,
    source: String,
}

impl SearchResult {
    fn new(query: &str, matches: Vec<&str>, source: &str) -> Self {
        SearchResult {
            query: query.to_string(),
            matches: matches.into_iter().map(|s| s.to_string()).collect(),
            source: source.to_string(),
        }
    }

    fn summary(&self) -> String {
        format!(
            "Found {} matches for '{}' in '{}'",
            self.matches.len(), self.query, self.source
        )
    }
}

// Tradeoffs:
// BORROWED version:
//   + No allocation for query, matches, or source strings
//   + Faster construction (just copies pointers)
//   - Cannot outlive the source data
//   - Cannot be stored in a Vec, HashMap, or sent to another thread
//     without lifetime gymnastics
//   - Requires lifetime annotations on every function that uses it
//
// OWNED version:
//   + Self-contained — can be stored, returned, sent anywhere
//   + Simpler API — no lifetime annotations
//   + Can be put in collections: Vec<SearchResult>
//   - Allocates memory for each string (to_string() calls)
//   - More memory usage

// Guideline: Use borrowed for short-lived, performance-critical
// parsing. Use owned for data that needs to be stored or moved.`})]}),I=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"}));export{v as a,j as b,S as c,_ as d,R as e,C as f,k as g,T as h,O as i,P as j,I as k,b as s};
