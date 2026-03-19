import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function BoxT() {
  return (
    <div className="prose-rust">
      <h1>Box&lt;T&gt; — Heap Allocation on Demand</h1>

      <p>
        In Python, every value is already on the heap, so you never think about
        where to put things. In Rust, values live on the stack by default.
        When you need heap allocation — for recursive types, large data, or
        trait objects — <code>Box&lt;T&gt;</code> is the simplest tool.
      </p>

      <ConceptBlock title="What Box<T> Does">
        <p>
          <code>Box&lt;T&gt;</code> allocates a value of type <code>T</code> on
          the heap and stores a pointer to it on the stack. It has exactly one
          owner, and when that owner goes out of scope, both the pointer and the
          heap data are freed. There is zero runtime overhead beyond the
          allocation itself — no reference counting, no garbage collection.
        </p>
        <p>
          Think of it as Rust's equivalent of Python's default behavior, but
          explicit and opt-in.
        </p>
      </ConceptBlock>

      <h2>Basic Box Usage</h2>

      <PythonRustCompare
        title="Putting values on the heap"
        description="Python always heap-allocates. In Rust, you use Box to explicitly choose heap allocation."
        pythonCode={`# Python: everything is heap-allocated
x = 42          # heap-allocated PyObject
name = "Alice"  # heap-allocated PyObject

# You never choose — it's always the heap
# Every variable is essentially a pointer
# to a heap object with a refcount`}
        rustCode={`fn main() {
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
} // boxed is freed here — heap memory released`}
      />

      <NoteBlock type="pythonista" title="Why would I ever want this?">
        Coming from Python, explicit heap allocation seems pointless — Python
        does it automatically! But in Rust, stack allocation is the fast
        default. You use <code>Box</code> when you <em>need</em> the heap:
        recursive data structures, large values you do not want to copy, or
        trait objects for dynamic dispatch.
      </NoteBlock>

      <h2>Recursive Types Require Box</h2>

      <p>
        The most common reason for <code>Box</code> is recursive types. Without
        indirection, the compiler cannot determine the size of a type that
        contains itself.
      </p>

      <CodeBlock
        language="rust"
        title="Building a linked list with Box"
        code={`// This won't compile — infinite size!
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
}`}
      />

      <h2>Box for Large Stack Values</h2>

      <PythonRustCompare
        title="Moving large data without copying"
        description="Box lets you move large structs cheaply by passing an 8-byte pointer instead of copying the whole value."
        pythonCode={`# Python: passing objects is always by reference
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
m = train(m)  # cheap: pointer passed`}
        rustCode={`struct LargeModel {
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
}`}
      />

      <h2>Box for Trait Objects</h2>

      <CodeBlock
        language="rust"
        title="Dynamic dispatch with Box<dyn Trait>"
        code={`trait Summarize {
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
}`}
      />

      <NoteBlock type="tip" title="Box has zero-cost dereferencing">
        <code>Box&lt;T&gt;</code> implements the <code>Deref</code> trait, so
        you can call methods on <code>Box&lt;T&gt;</code> as if it were
        a <code>T</code>. The compiler inserts the dereference automatically.
        There is no runtime cost beyond the initial heap allocation.
      </NoteBlock>

      <ExerciseBlock
        title="Build a Binary Tree"
        difficulty="intermediate"
        problem={`Define a binary tree enum using Box:

enum Tree {
    Leaf(i32),
    Node { left: ???, right: ??? },
}

1. Fill in the ??? types so the enum compiles.
2. Write a function fn tree_sum(tree: &Tree) -> i32 that returns the sum of all values.
3. Create a tree: Node(Leaf(1), Node(Leaf(2), Leaf(3))) and verify sum = 6.

Hint: Each child needs to be a Box<Tree> because Tree is recursive.`}
        solution={`enum Tree {
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
// by providing a fixed-size pointer (8 bytes).`}
      />
    </div>
  );
}
