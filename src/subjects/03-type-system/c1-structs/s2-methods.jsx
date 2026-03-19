import React from 'react';
import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function Methods() {
  return (
    <div className="prose-rust">
      <h1>Methods &amp; impl Blocks</h1>
      <p>
        In Python, methods live inside the class body. In Rust, methods are
        defined in a separate <code>impl</code> block. This separation keeps data
        layout and behavior cleanly decoupled and allows you to add methods to a
        type across multiple <code>impl</code> blocks, even from different modules.
      </p>

      <ConceptBlock title="impl Blocks">
        <p>
          An <code>impl</code> block attaches functions to a struct (or enum).
          Functions that take <code>&amp;self</code>, <code>&amp;mut self</code>,
          or <code>self</code> as the first parameter are <strong>methods</strong> and
          are called with dot syntax. Functions without a self parameter are
          <strong>associated functions</strong> (similar to Python's
          <code>@staticmethod</code> or <code>@classmethod</code>).
        </p>
      </ConceptBlock>

      <h2>Defining Methods</h2>
      <PythonRustCompare
        title="Methods: Python class vs Rust impl"
        description="Both attach behavior to a data type, but Rust makes the self-borrow explicit."
        pythonCode={`class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def scale(self, factor: float):
        self.width *= factor
        self.height *= factor

r = Rectangle(10.0, 5.0)
print(r.area())   # 50.0
r.scale(2.0)
print(r.area())   # 200.0`}
        rustCode={`struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    // &self = immutable borrow (read-only)
    fn area(&self) -> f64 {
        self.width * self.height
    }

    // &mut self = mutable borrow (can modify)
    fn scale(&mut self, factor: f64) {
        self.width *= factor;
        self.height *= factor;
    }
}

fn main() {
    let mut r = Rectangle { width: 10.0, height: 5.0 };
    println!("{}", r.area());  // 50.0
    r.scale(2.0);
    println!("{}", r.area());  // 200.0
}`}
      />

      <NoteBlock title="The three self flavors" type="note">
        <p>
          <code>&amp;self</code> borrows immutably (like reading).<br />
          <code>&amp;mut self</code> borrows mutably (like writing).<br />
          <code>self</code> takes ownership (the caller can no longer use the
          value). Choose the least powerful one that works.
        </p>
      </NoteBlock>

      <h2>Associated Functions (Constructors)</h2>
      <PythonRustCompare
        title="Constructors"
        description="Python uses __init__; Rust uses an associated function named new by convention."
        pythonCode={`class Circle:
    def __init__(self, radius: float):
        self.radius = radius

    @classmethod
    def unit(cls) -> "Circle":
        return cls(1.0)

c = Circle(5.0)
u = Circle.unit()`}
        rustCode={`struct Circle {
    radius: f64,
}

impl Circle {
    // Associated function (no self) — called with ::
    fn new(radius: f64) -> Self {
        Circle { radius }
    }

    fn unit() -> Self {
        Circle { radius: 1.0 }
    }
}

fn main() {
    let c = Circle::new(5.0);
    let u = Circle::unit();
}`}
      />

      <NoteBlock title="Self vs self" type="pythonista">
        <p>
          <code>Self</code> (capital S) is an alias for the type being implemented
          — like returning <code>cls(...)</code> in a Python classmethod.
          <code>self</code> (lowercase) is the instance, like Python's
          <code>self</code> parameter, except Rust makes its borrow mode explicit.
        </p>
      </NoteBlock>

      <h2>Multiple impl Blocks</h2>
      <CodeBlock
        language="rust"
        title="Splitting methods across impl blocks"
        code={`struct Player {
    name: String,
    health: i32,
    score: u64,
}

// Core gameplay methods
impl Player {
    fn new(name: String) -> Self {
        Player { name, health: 100, score: 0 }
    }

    fn take_damage(&mut self, amount: i32) {
        self.health = (self.health - amount).max(0);
    }
}

// Display / formatting helpers
impl Player {
    fn summary(&self) -> String {
        format!("{}: HP={} Score={}", self.name, self.health, self.score)
    }
}

fn main() {
    let mut p = Player::new("Alice".into());
    p.take_damage(30);
    println!("{}", p.summary());
}`}
      />

      <h2>Methods That Consume self</h2>
      <CodeBlock
        language="rust"
        title="Builder pattern with self (ownership transfer)"
        code={`struct RequestBuilder {
    url: String,
    timeout: u64,
}

impl RequestBuilder {
    fn new(url: String) -> Self {
        RequestBuilder { url, timeout: 30 }
    }

    // Takes ownership and returns a new builder
    fn timeout(mut self, secs: u64) -> Self {
        self.timeout = secs;
        self
    }

    fn build(self) -> String {
        format!("GET {} (timeout={}s)", self.url, self.timeout)
    }
}

fn main() {
    let req = RequestBuilder::new("https://api.example.com".into())
        .timeout(60)
        .build();
    println!("{}", req);
}`}
      />

      <NoteBlock title="Builder pattern" type="tip">
        <p>
          The builder pattern is extremely common in Rust libraries. Each method
          consumes <code>self</code> and returns it, enabling fluent chaining.
          Python developers will recognise this from libraries like Polars
          (<code>df.filter(...).select(...)</code>).
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="BankAccount with methods"
        difficulty="easy"
        problem={`Create a BankAccount struct with owner (String) and balance (f64). Implement:
1. new(owner) — starts with balance 0.0
2. deposit(&mut self, amount) — adds to balance
3. withdraw(&mut self, amount) -> bool — subtracts if sufficient funds, returns success
4. summary(&self) -> String — returns "Owner: $balance"
Test by depositing 100, withdrawing 40, then printing the summary.`}
        solution={`struct BankAccount {
    owner: String,
    balance: f64,
}

impl BankAccount {
    fn new(owner: String) -> Self {
        BankAccount { owner, balance: 0.0 }
    }

    fn deposit(&mut self, amount: f64) {
        self.balance += amount;
    }

    fn withdraw(&mut self, amount: f64) -> bool {
        if amount <= self.balance {
            self.balance -= amount;
            true
        } else {
            false
        }
    }

    fn summary(&self) -> String {
        format!("{}: {:.2}", self.owner, self.balance)
    }
}

fn main() {
    let mut acct = BankAccount::new("Alice".into());
    acct.deposit(100.0);
    acct.withdraw(40.0);
    println!("{}", acct.summary()); // Alice: $60.00
}`}
      />
    </div>
  );
}
