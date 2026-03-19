import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function MentalModel() {
  return (
    <div className="prose-rust">
      <h1>Rust vs Python Mental Model</h1>

      <p>
        Moving from Python to Rust is not just about learning new syntax — it requires
        a fundamental shift in how you think about code. Python lets you focus on
        <em>what</em> your program does. Rust forces you to also think about <em>how</em> it
        does it: where values live in memory, who owns them, and when they are freed.
        This section maps out the key mental shifts so you know what to expect.
      </p>

      <ConceptBlock title="The Six Key Mental Shifts">
        <p>
          Every difference between Rust and Python stems from a core design philosophy:
          Rust chooses <strong>compile-time guarantees</strong> over runtime convenience.
          This means the compiler does more work so your program does less. The result
          is faster, safer code — but you pay for it with a stricter authoring experience.
        </p>
        <ol>
          <li>Compiled vs interpreted</li>
          <li>Static vs dynamic typing</li>
          <li>Ownership vs reference counting</li>
          <li>No null, no exceptions — Option and Result instead</li>
          <li>Explicit vs implicit</li>
          <li>Zero-cost abstractions</li>
        </ol>
      </ConceptBlock>

      <h2>1. Compiled vs Interpreted</h2>

      <p>
        Python reads and executes your code line by line at runtime. Rust compiles your
        entire program to native machine code <em>before</em> it runs. This means Rust
        catches many bugs at compile time that Python would only reveal when the buggy
        line actually executes.
      </p>

      <PythonRustCompare
        title="When errors are caught"
        description="Python discovers this bug only when the function is called. Rust catches it before the program ever runs."
        pythonCode={`def greet(name):
    # Python doesn't check types at all —
    # this function happily accepts anything
    return "Hello, " + name

# This works fine
print(greet("Alice"))

# This crashes at RUNTIME
print(greet(42))
# TypeError: can only concatenate
# str to str, not "int"`}
        rustCode={`fn greet(name: &str) -> String {
    format!("Hello, {}", name)
}

fn main() {
    // This works fine
    println!("{}", greet("Alice"));

    // This fails at COMPILE TIME
    // println!("{}", greet(42));
    // error: expected '&str', found
    // integer
}`}
      />

      <NoteBlock type="pythonista" title="Think of it as type-checking on steroids">
        If you use mypy or pyright in strict mode, you have a taste of what Rust's
        compiler does. But Rust goes much further — it also checks memory safety,
        thread safety, and lifetime validity, all at compile time.
      </NoteBlock>

      <h2>2. Static vs Dynamic Typing</h2>

      <p>
        In Python, variables do not have types — values do. A variable can hold a string
        one moment and an integer the next. In Rust, every variable has a fixed type
        determined at compile time. The compiler often infers the type, so you do not
        always need to write it out, but it is always known.
      </p>

      <PythonRustCompare
        title="Variable types"
        description="Python variables can change type freely. Rust variables have a single, fixed type."
        pythonCode={`# Python: variables are just labels
x = 42        # x points to an int
x = "hello"   # now x points to a str
x = [1, 2, 3] # now x points to a list

# Type is checked at runtime, if at all
def double(n):
    return n * 2

double(5)       # 10
double("hi")    # "hihi"
double([1, 2])  # [1, 2, 1, 2]`}
        rustCode={`fn main() {
    // Rust: variables have fixed types
    let x: i32 = 42;
    // x = "hello"; // ERROR: expected
    //              // i32, found &str

    // Type inference — compiler figures
    // it out
    let y = 42;    // inferred as i32
    let z = "hi";  // inferred as &str

    // Functions require explicit types
    fn double(n: i32) -> i32 {
        n * 2
    }
    println!("{}", double(5)); // 10
}`}
      />

      <h2>3. Ownership vs Reference Counting</h2>

      <p>
        This is the biggest mental shift. In Python, values are reference-counted: multiple
        variables can point to the same object, and it is freed when the last reference
        goes away. In Rust, every value has exactly one <strong>owner</strong>. When the
        owner goes out of scope, the value is freed. You can lend access through
        <strong>references</strong> (&amp;), but the owner remains in control.
      </p>

      <CodeBlock
        language="rust"
        title="Ownership: values have exactly one owner"
        code={`fn main() {
    let data = vec![1, 2, 3]; // 'data' owns this vector

    let other = data;         // Ownership MOVES to 'other'

    // println!("{:?}", data); // ERROR: 'data' no longer owns it
    println!("{:?}", other);   // OK: 'other' is the owner now

    // Borrowing: lend access without giving up ownership
    let data2 = vec![4, 5, 6];
    print_vec(&data2);          // Borrow with &
    println!("{:?}", data2);    // Still valid — we only lent it
}

fn print_vec(v: &Vec<i32>) {
    println!("{:?}", v);
}`}
      />

      <NoteBlock type="pythonista" title="Python equivalent intuition">
        Imagine if Python's garbage collector were replaced by a rule: every object
        has exactly one variable that &quot;owns&quot; it. You can pass references
        around, but only the owner can destroy it. That is Rust's ownership model.
        It sounds restrictive, but it eliminates use-after-free bugs, double frees,
        and data races — entire classes of bugs that don't even exist in Rust.
      </NoteBlock>

      <h2>4. No Null, No Exceptions</h2>

      <p>
        Python uses <code>None</code> for absent values and exceptions for errors.
        Both are invisible in function signatures — you cannot tell from a function's
        type whether it might return <code>None</code> or raise an exception. Rust
        replaces these with <code>Option&lt;T&gt;</code> and <code>Result&lt;T, E&gt;</code>,
        which are explicit in the type signature and <em>must</em> be handled.
      </p>

      <PythonRustCompare
        title="Handling absence and errors"
        description="Python's None and exceptions are implicit. Rust's Option and Result are explicit in the type system."
        pythonCode={`# Python: None is implicit — nothing
# in the signature warns you
def find_user(id: int):
    if id == 1:
        return {"name": "Alice"}
    return None  # surprise!

user = find_user(2)
# Forgetting to check for None:
print(user["name"])  # RUNTIME crash
# TypeError: 'NoneType' not subscriptable

# Exceptions are also invisible
def parse_int(s: str) -> int:
    return int(s)  # might raise ValueError`}
        rustCode={`// Rust: the type tells you it might
// be absent
fn find_user(id: u32) -> Option<String> {
    if id == 1 {
        Some("Alice".to_string())
    } else {
        None
    }
}

fn main() {
    // You MUST handle the Option
    match find_user(2) {
        Some(name) => println!("{}", name),
        None => println!("Not found"),
    }

    // Result for operations that can fail
    let n: Result<i32, _> = "42".parse();
    // Must handle the Result too
}`}
      />

      <h2>5. Explicit vs Implicit</h2>

      <p>
        Python embraces implicit behavior: duck typing, automatic type coercion,
        implicit returns of <code>None</code>. Rust demands explicitness: type
        conversions must be explicit, there is no truthy/falsy coercion, and
        you must handle every possible case.
      </p>

      <CodeBlock
        language="rust"
        title="Rust requires explicit conversions"
        code={`fn main() {
    let x: i32 = 42;
    // let y: f64 = x;     // ERROR: no implicit conversion
    let y: f64 = x as f64; // OK: explicit cast

    let a: i32 = 100;
    let b: i64 = 200;
    // let c = a + b;          // ERROR: can't add different types
    let c = a as i64 + b;      // OK: explicit widening

    // No truthy/falsy
    let name = "hello";
    // if name { }             // ERROR: expected bool
    if !name.is_empty() { }    // OK: explicit bool check

    let count = 0;
    // if count { }            // ERROR: expected bool
    if count != 0 { }          // OK: explicit comparison
}`}
      />

      <NoteBlock type="tip" title="Explicitness prevents bugs">
        While Python's implicit behavior feels convenient, it is a common source
        of subtle bugs (e.g., <code>if my_list:</code> behaving differently for
        empty lists vs <code>None</code>). Rust's explicitness means less
        guessing and fewer surprises.
      </NoteBlock>

      <h2>6. Zero-Cost Abstractions</h2>

      <p>
        In Python, abstractions have runtime cost: classes, decorators, generators all
        add overhead. Rust's abstractions — generics, traits, iterators — are
        resolved at compile time and produce code as fast as hand-written low-level
        code. You do not pay a performance penalty for writing clean, high-level Rust.
      </p>

      <CodeBlock
        language="rust"
        title="Zero-cost iterators compile to optimal machine code"
        code={`fn main() {
    // This high-level iterator chain...
    let sum: i32 = (0..1000)
        .filter(|x| x % 2 == 0)
        .map(|x| x * x)
        .sum();

    // ...compiles to the SAME machine code as this manual loop:
    let mut sum2: i32 = 0;
    let mut i = 0;
    while i < 1000 {
        if i % 2 == 0 {
            sum2 += i * i;
        }
        i += 1;
    }

    assert_eq!(sum, sum2);
    println!("Sum of even squares: {}", sum);
}`}
      />

      <NoteBlock type="note" title="What 'zero-cost' really means">
        Bjarne Stroustrup's principle: &quot;What you don't use, you don't pay for.
        What you do use, you couldn't hand-code any better.&quot; Rust's generics
        are monomorphized (specialized for each type at compile time), iterators
        are inlined, and trait dispatch is static by default. The abstraction
        disappears completely in the compiled binary.
      </NoteBlock>

      <ExerciseBlock
        title="Mental Model Mapping"
        difficulty="beginner"
        problem={`For each Python concept below, identify the Rust equivalent and the key difference:

1. \`None\` return value
2. \`try/except\` block
3. \`x = 42; x = "hello"\` (reassigning to a different type)
4. \`def add(a, b): return a + b\` (no type annotations)
5. \`del my_list\` (manual memory management)
6. \`if my_list:\` (truthy check)

For each one, explain: what would you write in Rust instead, and why does Rust do it differently?`}
        solution={`1. None → Option<T>. Rust makes absence explicit in the type system so the compiler forces you to handle it.

2. try/except → Result<T, E> with match or the ? operator. Errors are values, not control flow — they appear in function signatures and must be handled.

3. Reassigning to different type → Not allowed. Variables have a fixed type. Use shadowing (\`let x = 42; let x = "hello";\`) to redeclare with a new type.

4. No type annotations → fn add(a: i32, b: i32) -> i32. Function signatures always require types so the compiler (and readers) know exactly what goes in and out.

5. del → Automatic. When a variable goes out of scope, its value is dropped. You never manually free memory, but it's freed deterministically (not by a GC).

6. Truthy check → if !my_list.is_empty(). Rust has no implicit bool conversion. You must write an explicit boolean expression.

The common theme: Rust shifts complexity from runtime to compile time. You write more explicit code, but the compiler catches more bugs.`}
      />
    </div>
  );
}
