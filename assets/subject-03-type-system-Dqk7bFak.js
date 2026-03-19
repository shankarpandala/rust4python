import{j as e}from"./vendor-Dh_dlHsl.js";import{C as s,P as r,N as t,a as n,E as i}from"./subject-01-getting-started-DoSDK0Fn.js";function o(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Defining Structs"}),e.jsxs("p",{children:["If you come from Python, you have likely used ",e.jsx("code",{children:"dataclasses"}),",",e.jsx("code",{children:"NamedTuple"}),", or plain classes to group related data. Rust's",e.jsx("strong",{children:" structs"})," fill that role, but with compile-time type guarantees and zero runtime overhead."]}),e.jsx(s,{title:"What is a Struct?",children:e.jsxs("p",{children:["A struct is a custom data type that groups named fields together. Unlike Python classes, structs carry ",e.jsx("em",{children:"no"})," inheritance hierarchy, no",e.jsx("code",{children:"__dict__"}),", and no method-resolution order. They are simple, predictable containers whose layout is known at compile time."]})}),e.jsx("h2",{children:"Basic Struct Definition"}),e.jsx(r,{title:"Data Container: Python dataclass vs Rust struct",description:"Both define a named record with typed fields, but Rust enforces types at compile time.",pythonCode:`from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p = Point(1.0, 2.0)
print(p.x)  # 1.0`,rustCode:`struct Point {
    x: f64,
    y: f64,
}

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    println!("{}", p.x); // 1.0
}`}),e.jsx(t,{title:"All fields required",type:"warning",children:e.jsxs("p",{children:["Rust structs have no default values out of the box. Every field must be provided when constructing. To get defaults, implement or derive the",e.jsx("code",{children:"Default"})," trait (covered in the traits chapter)."]})}),e.jsx("h2",{children:"Tuple Structs and Unit Structs"}),e.jsx("p",{children:"Rust has two additional struct forms that Python developers should know about."}),e.jsx(n,{language:"rust",title:"Tuple struct and unit struct",code:`// Tuple struct: fields accessed by index, not name
struct Color(u8, u8, u8);

// Unit struct: zero-sized, useful as marker types
struct Marker;

fn main() {
    let red = Color(255, 0, 0);
    println!("R = {}", red.0);

    let _m = Marker; // occupies 0 bytes
}`}),e.jsx(t,{title:"Newtype pattern",type:"pythonista",children:e.jsxs("p",{children:["A tuple struct with one field is called the ",e.jsx("strong",{children:"newtype pattern"}),". It wraps an existing type to give it a distinct identity:",e.jsx("code",{children:"struct Meters(f64);"}),". In Python you might subclass",e.jsx("code",{children:"float"}),", but the newtype pattern has zero cost and prevents accidental mixing of ",e.jsx("code",{children:"Meters"})," and ",e.jsx("code",{children:"Seconds"}),"."]})}),e.jsx("h2",{children:"Struct Update Syntax"}),e.jsx(r,{title:"Copying with modifications",description:"Python dataclasses offer replace(); Rust has struct update syntax.",pythonCode:`from dataclasses import dataclass, replace

@dataclass
class Config:
    width: int
    height: int
    fullscreen: bool

base = Config(1920, 1080, False)
wide = replace(base, width=2560)`,rustCode:`#[derive(Clone)]
struct Config {
    width: u32,
    height: u32,
    fullscreen: bool,
}

fn main() {
    let base = Config {
        width: 1920,
        height: 1080,
        fullscreen: false,
    };
    let wide = Config { width: 2560, ..base };
    // remaining fields are moved (or copied) from base
}`}),e.jsx(t,{title:"Move semantics matter",type:"tip",children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"..base"})," syntax ",e.jsx("em",{children:"moves"})," fields out of",e.jsx("code",{children:"base"})," unless the struct implements ",e.jsx("code",{children:"Copy"}),". After the update, ",e.jsx("code",{children:"base"})," may no longer be usable if any non-Copy field was moved. Derive ",e.jsx("code",{children:"Clone"})," and call",e.jsx("code",{children:".clone()"})," explicitly when you need both values."]})}),e.jsx("h2",{children:"Visibility: pub Fields"}),e.jsx(n,{language:"rust",title:"Controlling field visibility",code:`mod shapes {
    pub struct Rectangle {
        pub width: f64,
        pub height: f64,
        // private field: callers outside this module cannot set it
        area_cache: Option<f64>,
    }

    impl Rectangle {
        pub fn new(w: f64, h: f64) -> Self {
            Rectangle { width: w, height: h, area_cache: None }
        }
    }
}

fn main() {
    // Must use constructor because area_cache is private
    let r = shapes::Rectangle::new(10.0, 5.0);
    println!("w = {}", r.width); // OK, width is pub
}`}),e.jsx(t,{title:"Python comparison",type:"pythonista",children:e.jsxs("p",{children:["Python uses a ",e.jsx("code",{children:"_"})," prefix convention for private attributes, but nothing stops external code from accessing them. In Rust, a non-",e.jsx("code",{children:"pub"})," field is ",e.jsx("em",{children:"truly"})," inaccessible outside the module. This means if any field is private, external code must use a constructor function instead of literal syntax."]})}),e.jsx(i,{title:"Define a User struct",difficulty:"easy",problem:`Create a struct called User with fields: username (String), email (String),
and active (bool). Write a function new_user that takes a username and email
and returns a User with active set to true. Then use struct update syntax to
create an inactive copy.`,solution:`struct User {
    username: String,
    email: String,
    active: bool,
}

fn new_user(username: String, email: String) -> User {
    // field init shorthand: username instead of username: username
    User { username, email, active: true }
}

fn main() {
    let alice = new_user(
        String::from("alice"),
        String::from("alice@example.com"),
    );
    let inactive = User { active: false, ..alice };
    println!("{} active={}", inactive.username, inactive.active);
}`})]})}const j=Object.freeze(Object.defineProperty({__proto__:null,default:o},Symbol.toStringTag,{value:"Module"}));function a(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Methods & impl Blocks"}),e.jsxs("p",{children:["In Python, methods live inside the class body. In Rust, methods are defined in a separate ",e.jsx("code",{children:"impl"})," block. This separation keeps data layout and behavior cleanly decoupled and allows you to add methods to a type across multiple ",e.jsx("code",{children:"impl"})," blocks, even from different modules."]}),e.jsx(s,{title:"impl Blocks",children:e.jsxs("p",{children:["An ",e.jsx("code",{children:"impl"})," block attaches functions to a struct (or enum). Functions that take ",e.jsx("code",{children:"&self"}),", ",e.jsx("code",{children:"&mut self"}),", or ",e.jsx("code",{children:"self"})," as the first parameter are ",e.jsx("strong",{children:"methods"})," and are called with dot syntax. Functions without a self parameter are",e.jsx("strong",{children:"associated functions"})," (similar to Python's",e.jsx("code",{children:"@staticmethod"})," or ",e.jsx("code",{children:"@classmethod"}),")."]})}),e.jsx("h2",{children:"Defining Methods"}),e.jsx(r,{title:"Methods: Python class vs Rust impl",description:"Both attach behavior to a data type, but Rust makes the self-borrow explicit.",pythonCode:`class Rectangle:
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
print(r.area())   # 200.0`,rustCode:`struct Rectangle {
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
}`}),e.jsx(t,{title:"The three self flavors",type:"note",children:e.jsxs("p",{children:[e.jsx("code",{children:"&self"})," borrows immutably (like reading).",e.jsx("br",{}),e.jsx("code",{children:"&mut self"})," borrows mutably (like writing).",e.jsx("br",{}),e.jsx("code",{children:"self"})," takes ownership (the caller can no longer use the value). Choose the least powerful one that works."]})}),e.jsx("h2",{children:"Associated Functions (Constructors)"}),e.jsx(r,{title:"Constructors",description:"Python uses __init__; Rust uses an associated function named new by convention.",pythonCode:`class Circle:
    def __init__(self, radius: float):
        self.radius = radius

    @classmethod
    def unit(cls) -> "Circle":
        return cls(1.0)

c = Circle(5.0)
u = Circle.unit()`,rustCode:`struct Circle {
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
}`}),e.jsx(t,{title:"Self vs self",type:"pythonista",children:e.jsxs("p",{children:[e.jsx("code",{children:"Self"})," (capital S) is an alias for the type being implemented — like returning ",e.jsx("code",{children:"cls(...)"})," in a Python classmethod.",e.jsx("code",{children:"self"})," (lowercase) is the instance, like Python's",e.jsx("code",{children:"self"})," parameter, except Rust makes its borrow mode explicit."]})}),e.jsx("h2",{children:"Multiple impl Blocks"}),e.jsx(n,{language:"rust",title:"Splitting methods across impl blocks",code:`struct Player {
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
}`}),e.jsx("h2",{children:"Methods That Consume self"}),e.jsx(n,{language:"rust",title:"Builder pattern with self (ownership transfer)",code:`struct RequestBuilder {
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
}`}),e.jsx(t,{title:"Builder pattern",type:"tip",children:e.jsxs("p",{children:["The builder pattern is extremely common in Rust libraries. Each method consumes ",e.jsx("code",{children:"self"})," and returns it, enabling fluent chaining. Python developers will recognise this from libraries like Polars (",e.jsx("code",{children:"df.filter(...).select(...)"}),")."]})}),e.jsx(i,{title:"BankAccount with methods",difficulty:"easy",problem:`Create a BankAccount struct with owner (String) and balance (f64). Implement:
1. new(owner) — starts with balance 0.0
2. deposit(&mut self, amount) — adds to balance
3. withdraw(&mut self, amount) -> bool — subtracts if sufficient funds, returns success
4. summary(&self) -> String — returns "Owner: $balance"
Test by depositing 100, withdrawing 40, then printing the summary.`,solution:`struct BankAccount {
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
}`})]})}const b=Object.freeze(Object.defineProperty({__proto__:null,default:a},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Enums with Data"}),e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"enum.Enum"})," gives you named constants. Rust's enums are ",e.jsx("em",{children:"algebraic data types"})," — each variant can carry different data. This is one of Rust's most powerful features and has no direct Python equivalent."]}),e.jsx(s,{title:"Algebraic Data Types",children:e.jsxs("p",{children:['A Rust enum says: "this value is ',e.jsx("strong",{children:"one of"}),' these variants." Each variant can hold different types and amounts of data. The compiler guarantees you handle every variant, eliminating an entire class of bugs that Python developers fight with ',e.jsx("code",{children:"isinstance"})," checks."]})}),e.jsx("h2",{children:"Simple Enums"}),e.jsx(r,{title:"Basic enum comparison",description:"Simple named-constant enums look similar in both languages.",pythonCode:`from enum import Enum

class Direction(Enum):
    North = "north"
    South = "south"
    East  = "east"
    West  = "west"

def describe(d: Direction) -> str:
    if d == Direction.North:
        return "Going up"
    elif d == Direction.South:
        return "Going down"
    else:
        return "Going sideways"`,rustCode:`enum Direction {
    North,
    South,
    East,
    West,
}

fn describe(d: Direction) -> &'static str {
    match d {
        Direction::North => "Going up",
        Direction::South => "Going down",
        Direction::East | Direction::West => "Going sideways",
    }
}

fn main() {
    println!("{}", describe(Direction::North));
}`}),e.jsx(t,{title:"Exhaustive matching",type:"warning",children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"match"})," expression must cover every variant. If you add a new variant to the enum later, the compiler will show errors everywhere you forgot to handle it. This is a massive safety net compared to Python, where an ",e.jsx("code",{children:"if/elif"})," chain silently ignores new cases."]})}),e.jsx("h2",{children:"Enums with Data — The Superpower"}),e.jsx(r,{title:"Enums carrying data",description:"In Python you'd use unions or different classes. Rust enums bundle variant + data in one type.",pythonCode:`from dataclasses import dataclass
from typing import Union

@dataclass
class Quit:
    pass

@dataclass
class Echo:
    message: str

@dataclass
class Move:
    x: int
    y: int

@dataclass
class ChangeColor:
    r: int
    g: int
    b: int

Command = Union[Quit, Echo, Move, ChangeColor]

def run(cmd: Command):
    if isinstance(cmd, Quit):
        print("Quitting")
    elif isinstance(cmd, Echo):
        print(cmd.message)
    elif isinstance(cmd, Move):
        print(f"Move to ({cmd.x}, {cmd.y})")
    elif isinstance(cmd, ChangeColor):
        print(f"Color: ({cmd.r},{cmd.g},{cmd.b})")`,rustCode:`enum Command {
    Quit,
    Echo(String),
    Move { x: i32, y: i32 },
    ChangeColor(u8, u8, u8),
}

fn run(cmd: Command) {
    match cmd {
        Command::Quit => println!("Quitting"),
        Command::Echo(msg) => println!("{}", msg),
        Command::Move { x, y } => {
            println!("Move to ({}, {})", x, y);
        }
        Command::ChangeColor(r, g, b) => {
            println!("Color: ({},{},{})", r, g, b);
        }
    }
}

fn main() {
    run(Command::Echo("hello".into()));
    run(Command::Move { x: 10, y: 20 });
}`}),e.jsx(t,{title:"Why this matters",type:"pythonista",children:e.jsxs("p",{children:['In Python, representing "one of several shapes of data" requires a Union of classes plus ',e.jsx("code",{children:"isinstance"})," checks that are easy to forget. Rust enums pack the tag and data together, and the compiler verifies every match. You will use this pattern constantly — it replaces unions, sentinel values, and exception-based control flow."]})}),e.jsx("h2",{children:"Pattern Matching with match"}),e.jsx(n,{language:"rust",title:"Nested and guarded patterns",code:`enum Shape {
    Circle(f64),             // radius
    Rect { w: f64, h: f64 }, // named fields
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rect { w, h } => w * h,
    }
}

fn classify(s: &Shape) -> &str {
    match s {
        Shape::Circle(r) if *r > 100.0 => "large circle",
        Shape::Circle(_) => "small circle",
        Shape::Rect { w, h } if w == h => "square",
        Shape::Rect { .. } => "rectangle",
    }
}

fn main() {
    let shapes = vec![
        Shape::Circle(5.0),
        Shape::Circle(200.0),
        Shape::Rect { w: 10.0, h: 10.0 },
        Shape::Rect { w: 3.0, h: 7.0 },
    ];
    for s in &shapes {
        println!("{}: area={:.1}", classify(s), area(s));
    }
}`}),e.jsx("h2",{children:"if let — Quick Single-Variant Check"}),e.jsx(n,{language:"rust",title:"if let for single-variant matching",code:`enum Message {
    Text(String),
    Image { url: String, width: u32 },
    Deleted,
}

fn print_text(msg: &Message) {
    // Only care about one variant? Use if let
    if let Message::Text(content) = msg {
        println!("Text: {}", content);
    }
    // Equivalent to:
    // match msg {
    //     Message::Text(content) => println!("Text: {}", content),
    //     _ => {}
    // }
}`}),e.jsx(t,{title:"if let vs match",type:"tip",children:e.jsxs("p",{children:["Use ",e.jsx("code",{children:"if let"})," when you care about exactly one variant and want to ignore the rest. Use ",e.jsx("code",{children:"match"})," when you need to handle multiple variants — the compiler will ensure completeness."]})}),e.jsx(i,{title:"JSON-like Value enum",difficulty:"medium",problem:`Define an enum called JsonValue with variants:
- Null
- Bool(bool)
- Number(f64)
- Str(String)
Write a function to_string that takes a &JsonValue and returns a String
representation (e.g., "null", "true", "3.14", or the quoted string).
Use match to handle all variants.`,solution:`enum JsonValue {
    Null,
    Bool(bool),
    Number(f64),
    Str(String),
}

fn to_string(val: &JsonValue) -> String {
    match val {
        JsonValue::Null => "null".to_string(),
        JsonValue::Bool(b) => b.to_string(),
        JsonValue::Number(n) => n.to_string(),
        JsonValue::Str(s) => format!(""{}"", s),
    }
}

fn main() {
    let values = vec![
        JsonValue::Null,
        JsonValue::Bool(true),
        JsonValue::Number(3.14),
        JsonValue::Str("hello".into()),
    ];
    for v in &values {
        println!("{}", to_string(v));
    }
}`})]})}const _=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));function c(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Option<T> — Rust's Replacement for None"}),e.jsxs("p",{children:["Python uses ",e.jsx("code",{children:"None"}),' as a universal "no value" sentinel. Any variable can be ',e.jsx("code",{children:"None"})," at any time, and nothing in the language forces you to check. This is a constant source of",e.jsx("code",{children:"AttributeError: 'NoneType' has no attribute ..."})," crashes. Rust eliminates this entire class of bugs with ",e.jsx("code",{children:"Option<T>"}),"."]}),e.jsxs(s,{title:"There Is No Null in Rust",children:[e.jsxs("p",{children:["Rust has no ",e.jsx("code",{children:"null"}),", no ",e.jsx("code",{children:"None"})," value that silently inhabits every type. Instead, the ",e.jsx("strong",{children:"absence of a value"})," is explicitly represented by the ",e.jsx("code",{children:"Option<T>"})," enum:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Some(value)"})," — a value is present"]}),e.jsxs("li",{children:[e.jsx("code",{children:"None"})," — no value"]})]}),e.jsx("p",{children:"The compiler forces you to handle both cases before you can access the inner value. You literally cannot forget to check for None."})]}),e.jsx("h2",{children:"Python None vs Rust Option"}),e.jsx(r,{title:"Optional values",description:"Python lets None slip through unchecked. Rust's Option forces explicit handling.",pythonCode:`def find_user(user_id: int) -> dict | None:
    db = {1: {"name": "Alice"}, 2: {"name": "Bob"}}
    return db.get(user_id)

user = find_user(99)
# Oops — this crashes at runtime!
# TypeError: 'NoneType' object is not subscriptable
print(user["name"])

# You SHOULD check, but nothing forces you:
if user is not None:
    print(user["name"])`,rustCode:`fn find_user(user_id: u32) -> Option<String> {
    match user_id {
        1 => Some("Alice".to_string()),
        2 => Some("Bob".to_string()),
        _ => None,
    }
}

fn main() {
    let user = find_user(99);

    // This won't compile — Option is not a String!
    // println!("{}", user);  // ERROR

    // You MUST handle both cases:
    match user {
        Some(name) => println!("{}", name),
        None => println!("User not found"),
    }
}`}),e.jsx(t,{title:"The billion-dollar mistake, fixed",type:"pythonista",children:e.jsxs("p",{children:['Tony Hoare called inventing null references his "billion-dollar mistake." Python inherited this mistake — any variable can be',e.jsx("code",{children:"None"}),". Rust's ",e.jsx("code",{children:"Option"})," makes absence explicit in the type system. If a function returns ",e.jsx("code",{children:"String"}),", it always returns a string. If it might not, it returns",e.jsx("code",{children:"Option<String>"})," — and the caller must deal with it."]})}),e.jsx("h2",{children:"Common Option Methods"}),e.jsx(n,{language:"rust",title:"Working with Option values",code:`fn main() {
    let some_number: Option<i32> = Some(42);
    let no_number: Option<i32> = None;

    // unwrap_or: provide a default
    println!("{}", some_number.unwrap_or(0));  // 42
    println!("{}", no_number.unwrap_or(0));    // 0

    // map: transform the inner value (if present)
    let doubled = some_number.map(|n| n * 2);  // Some(84)
    let doubled_none = no_number.map(|n| n * 2);  // None

    // and_then (flatmap): chain operations that return Option
    let parsed: Option<i32> = Some("42")
        .and_then(|s| s.parse().ok());  // Some(42)

    // is_some / is_none: boolean checks
    assert!(some_number.is_some());
    assert!(no_number.is_none());

    // unwrap_or_else: default with a closure (lazy)
    let val = no_number.unwrap_or_else(|| {
        println!("Computing default...");
        99
    });
    println!("{}", val);  // 99
}`}),e.jsx(r,{title:"Chaining optional operations",description:"Python uses 'and' / 'or' / ternary; Rust uses map/and_then combinators.",pythonCode:`from typing import Optional

def get_config(key: str) -> Optional[str]:
    config = {"port": "8080"}
    return config.get(key)

def parse_port(s: str) -> Optional[int]:
    try:
        return int(s)
    except ValueError:
        return None

# Manual chaining in Python
raw = get_config("port")
port = parse_port(raw) if raw is not None else None
final_port = port if port is not None else 3000
print(final_port)  # 8080`,rustCode:`use std::collections::HashMap;

fn get_config(key: &str) -> Option<String> {
    let config = HashMap::from([("port", "8080")]);
    config.get(key).map(|s| s.to_string())
}

fn main() {
    // Elegant chaining with combinators
    let port: u16 = get_config("port")
        .and_then(|s| s.parse().ok())
        .unwrap_or(3000);

    println!("{}", port);  // 8080
}`}),e.jsx("h2",{children:"if let and while let"}),e.jsx(n,{language:"rust",title:"Pattern matching shortcuts for Option",code:`fn main() {
    let names = vec!["Alice", "Bob", "Charlie"];

    // if let — handle only the Some case
    if let Some(first) = names.first() {
        println!("First name: {}", first);
    }

    // while let — loop while values are Some
    let mut stack = vec![1, 2, 3];
    while let Some(top) = stack.pop() {
        println!("Popped: {}", top);
    }
    // Prints: 3, 2, 1

    // let-else (Rust 1.65+) — unwrap or diverge
    let input = Some("42");
    let Some(value) = input else {
        println!("No value provided");
        return;
    };
    println!("Got: {}", value);
}`}),e.jsx(t,{title:"When to use unwrap()",type:"warning",children:e.jsxs("p",{children:["Calling ",e.jsx("code",{children:".unwrap()"})," on ",e.jsx("code",{children:"None"})," panics (crashes). Only use it when you are ",e.jsx("em",{children:"certain"})," the value is",e.jsx("code",{children:"Some"})," — for example, in tests or after a guard check. In production code, prefer ",e.jsx("code",{children:"unwrap_or"}),",",e.jsx("code",{children:"unwrap_or_else"}),", ",e.jsx("code",{children:"match"}),", or the",e.jsx("code",{children:"?"})," operator."]})}),e.jsx("h2",{children:"Option in Struct Fields"}),e.jsx(n,{language:"rust",title:"Optional fields in structs",code:`struct UserProfile {
    username: String,
    email: String,
    bio: Option<String>,        // user may not have a bio
    age: Option<u32>,           // age is optional
}

impl UserProfile {
    fn display_bio(&self) -> &str {
        // as_deref() converts Option<String> to Option<&str>
        self.bio.as_deref().unwrap_or("No bio provided")
    }

    fn is_adult(&self) -> Option<bool> {
        // map preserves the Option wrapper
        self.age.map(|a| a >= 18)
    }
}

fn main() {
    let user = UserProfile {
        username: "alice".into(),
        email: "alice@example.com".into(),
        bio: None,
        age: Some(25),
    };

    println!("Bio: {}", user.display_bio());     // No bio provided
    println!("Adult? {:?}", user.is_adult());     // Some(true)
}`}),e.jsx(t,{title:"Option vs default values",type:"tip",children:e.jsxs("p",{children:["In Python, you might use a default parameter or empty string for optional data. In Rust, ",e.jsx("code",{children:"Option"})," makes the semantics crystal clear: ",e.jsx("code",{children:"None"}),' means "not provided," while an empty ',e.jsx("code",{children:"String"}),' means "provided but empty." This distinction prevents subtle bugs in data processing.']})}),e.jsx(i,{title:"Safe division with Option",difficulty:"easy",problem:`Write a function safe_div(a: f64, b: f64) -> Option<f64> that returns
None for division by zero, and Some(result) otherwise.

Then write a function chain_div that takes a starting value and a Vec<f64>
of divisors, and returns the result of dividing by each in sequence. If any
division is by zero, the whole chain returns None. Use and_then for chaining.`,solution:`fn safe_div(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 {
        None
    } else {
        Some(a / b)
    }
}

fn chain_div(start: f64, divisors: &[f64]) -> Option<f64> {
    let mut result = Some(start);
    for &d in divisors {
        result = result.and_then(|val| safe_div(val, d));
    }
    result
}

fn main() {
    println!("{:?}", chain_div(100.0, &[2.0, 5.0]));    // Some(10.0)
    println!("{:?}", chain_div(100.0, &[2.0, 0.0, 5.0])); // None
}`})]})}const w=Object.freeze(Object.defineProperty({__proto__:null,default:c},Symbol.toStringTag,{value:"Module"}));function d(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Result<T, E> — Errors as Values"}),e.jsxs("p",{children:["Python uses exceptions for error handling: you ",e.jsx("code",{children:"raise"})," an error and hope someone catches it. Rust takes a fundamentally different approach — errors are ",e.jsx("strong",{children:"values"})," returned from functions via the ",e.jsx("code",{children:"Result<T, E>"})," type. The compiler ensures you handle them."]}),e.jsxs(s,{title:"Result: Ok or Err",children:[e.jsxs("p",{children:[e.jsx("code",{children:"Result<T, E>"})," is an enum with two variants:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Ok(value)"})," — the operation succeeded, here is the result"]}),e.jsxs("li",{children:[e.jsx("code",{children:"Err(error)"})," — the operation failed, here is why"]})]}),e.jsx("p",{children:"Unlike exceptions, errors cannot silently propagate up the call stack. Every function that can fail declares it in its return type, and every caller must explicitly handle the error or propagate it."})]}),e.jsx("h2",{children:"Python Exceptions vs Rust Result"}),e.jsx(r,{title:"Error handling philosophy",description:"Python throws exceptions; Rust returns Result values. Both handle errors, but Rust's approach is explicit and checked at compile time.",pythonCode:`import json

def parse_config(text: str) -> dict:
    # Can raise json.JSONDecodeError
    data = json.loads(text)
    # Can raise KeyError
    port = data["port"]
    # Can raise TypeError/ValueError
    return {"port": int(port)}

# Caller must remember to catch — nothing enforces it
try:
    config = parse_config('{"port": "8080"}')
    print(config)
except (json.JSONDecodeError, KeyError, ValueError) as e:
    print(f"Error: {e}")

# Easy to forget — this crashes on bad input:
# config = parse_config("not json")`,rustCode:`use std::num::ParseIntError;

#[derive(Debug)]
enum ConfigError {
    InvalidJson(String),
    MissingField(String),
    BadPort(ParseIntError),
}

fn parse_port(text: &str) -> Result<u16, ConfigError> {
    // Each step returns Result — errors are explicit
    let port_str = text.strip_prefix("port=")
        .ok_or(ConfigError::MissingField("port".into()))?;

    let port: u16 = port_str.parse()
        .map_err(ConfigError::BadPort)?;

    Ok(port)
}

fn main() {
    match parse_port("port=8080") {
        Ok(port) => println!("Port: {}", port),
        Err(e) => println!("Error: {:?}", e),
    }
}`}),e.jsx(t,{title:"No hidden control flow",type:"pythonista",children:e.jsxs("p",{children:["In Python, any function call might raise any exception — you need to read the docs (or source) to know. In Rust, a function returning",e.jsx("code",{children:"String"})," cannot fail. If it can fail, it returns",e.jsx("code",{children:"Result<String, SomeError>"}),". The type signature is the documentation."]})}),e.jsx("h2",{children:"Common Result Methods"}),e.jsx(n,{language:"rust",title:"Working with Result values",code:`fn main() {
    let good: Result<i32, String> = Ok(42);
    let bad: Result<i32, String> = Err("oops".into());

    // unwrap_or: provide a default on error
    println!("{}", good.unwrap_or(0));  // 42
    println!("{}", bad.unwrap_or(0));   // 0

    // map: transform the success value
    let doubled = good.map(|n| n * 2);  // Ok(84)

    // map_err: transform the error value
    let new_err = bad.map_err(|e| format!("Failed: {}", e));

    // and_then: chain fallible operations
    let parsed: Result<i32, String> = Ok("42".to_string())
        .and_then(|s| s.parse::<i32>().map_err(|e| e.to_string()));

    // is_ok / is_err
    assert!(good.is_ok());
    assert!(bad.is_err());

    // unwrap_or_else: lazy default
    let val = bad.unwrap_or_else(|e| {
        eprintln!("Warning: {}", e);
        -1
    });
    println!("{}", val);  // -1
}`}),e.jsx("h2",{children:"The ? Operator — Propagating Errors"}),e.jsx(r,{title:"Error propagation",description:"Python exceptions auto-propagate. Rust uses the ? operator to explicitly propagate Result errors up the call stack.",pythonCode:`def read_number(path: str) -> int:
    # Exceptions auto-propagate — if open() fails,
    # the exception bubbles up automatically
    with open(path) as f:
        text = f.read().strip()
    return int(text)

def double_from_file(path: str) -> int:
    # No explicit error handling needed —
    # exceptions just fly upward
    return read_number(path) * 2`,rustCode:`use std::fs;
use std::num::ParseIntError;
use std::io;

#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(ParseIntError),
}

impl From<io::Error> for AppError {
    fn from(e: io::Error) -> Self { AppError::Io(e) }
}

impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self { AppError::Parse(e) }
}

fn read_number(path: &str) -> Result<i64, AppError> {
    let text = fs::read_to_string(path)?;  // ? propagates
    let num = text.trim().parse::<i64>()?;  // ? converts & propagates
    Ok(num)
}

fn double_from_file(path: &str) -> Result<i64, AppError> {
    let n = read_number(path)?;  // ? propagates errors
    Ok(n * 2)
}`}),e.jsx(t,{title:"What ? actually does",type:"note",children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"?"})," operator on a ",e.jsx("code",{children:"Result"}),": if the value is",e.jsx("code",{children:"Ok(v)"}),", it unwraps to ",e.jsx("code",{children:"v"})," and continues. If it is ",e.jsx("code",{children:"Err(e)"}),", it converts the error (via ",e.jsx("code",{children:"From"}),") and returns early from the function. It is syntactic sugar for a match statement, not magic — you can always see where errors are propagated."]})}),e.jsx("h2",{children:"Converting Between Option and Result"}),e.jsx(n,{language:"rust",title:"Option ↔ Result conversions",code:`fn find_and_parse(data: &[(&str, &str)], key: &str) -> Result<i32, String> {
    // ok_or: convert Option to Result
    let (_, value) = data.iter()
        .find(|(k, _)| *k == key)
        .ok_or(format!("Key '{}' not found", key))?;

    // map_err: convert one error type to another
    let parsed: i32 = value.parse()
        .map_err(|e| format!("Parse error for '{}': {}", key, e))?;

    Ok(parsed)
}

fn main() {
    let data = vec![("port", "8080"), ("workers", "4")];

    println!("{:?}", find_and_parse(&data, "port"));     // Ok(8080)
    println!("{:?}", find_and_parse(&data, "missing"));  // Err("Key 'missing' not found")
}

// Going the other way:
// result.ok()  -> Option<T>  (discards the error)
// result.err() -> Option<E>  (discards the success)`}),e.jsx(t,{title:"Result in the standard library",type:"tip",children:e.jsxs("p",{children:["Many standard library functions return ",e.jsx("code",{children:"Result"}),": file I/O, parsing, networking, thread spawning. When you see",e.jsx("code",{children:"Result"}),' in a function signature, that is the author telling you "this can fail, and here is how." Learn to read and follow the Result chain — it is one of the most important Rust skills.']})}),e.jsx(i,{title:"Parse a CSV-like row",difficulty:"medium",problem:`Write a function parse_row(line: &str) -> Result<(String, u32, f64), String>
that parses a comma-separated line like "Alice,30,95.5" into a tuple of
(name, age, score). Return descriptive error messages for:
- Wrong number of fields
- Age not parseable as u32
- Score not parseable as f64
Use the ? operator with map_err for clean error propagation.`,solution:`fn parse_row(line: &str) -> Result<(String, u32, f64), String> {
    let fields: Vec<&str> = line.split(',').collect();

    if fields.len() != 3 {
        return Err(format!(
            "Expected 3 fields, got {}", fields.len()
        ));
    }

    let name = fields[0].to_string();

    let age: u32 = fields[1].parse()
        .map_err(|e| format!("Invalid age '{}': {}", fields[1], e))?;

    let score: f64 = fields[2].parse()
        .map_err(|e| format!("Invalid score '{}': {}", fields[2], e))?;

    Ok((name, age, score))
}

fn main() {
    println!("{:?}", parse_row("Alice,30,95.5"));
    // Ok(("Alice", 30, 95.5))

    println!("{:?}", parse_row("Bob,xyz,80.0"));
    // Err("Invalid age 'xyz': ...")

    println!("{:?}", parse_row("too,few"));
    // Err("Expected 3 fields, got 2")
}`})]})}const v=Object.freeze(Object.defineProperty({__proto__:null,default:d},Symbol.toStringTag,{value:"Module"}));function u(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Defining & Implementing Traits"}),e.jsxs("p",{children:["Python uses duck typing, ABCs, and Protocols to define shared behavior. Rust uses ",e.jsx("strong",{children:"traits"})," — the cornerstone of its type system. Traits define what a type ",e.jsx("em",{children:"can do"}),", similar to interfaces in other languages, but with the power of default implementations and compile-time enforcement."]}),e.jsxs(s,{title:"What Is a Trait?",children:[e.jsx("p",{children:"A trait is a collection of method signatures (and optionally default implementations) that types can implement. When a type implements a trait, it promises to provide all the required methods. The compiler checks this at compile time — no runtime surprises."}),e.jsxs("p",{children:["Traits serve the same role as Python's ",e.jsx("code",{children:"Protocol"})," (structural typing) and ",e.jsx("code",{children:"ABC"})," (nominal typing), but are checked statically and have zero runtime cost."]})]}),e.jsx("h2",{children:"Python Protocol/ABC vs Rust Trait"}),e.jsx(r,{title:"Defining shared behavior",description:"Python uses Protocol or ABC for interface contracts. Rust uses traits with compile-time enforcement.",pythonCode:`from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> str: ...
    def area(self) -> float: ...

class Circle:
    def __init__(self, radius: float):
        self.radius = radius

    def draw(self) -> str:
        return f"Circle(r={self.radius})"

    def area(self) -> float:
        return 3.14159 * self.radius ** 2

# Structural typing: Circle satisfies Drawable
# But errors only appear at runtime if a method
# is missing or has the wrong signature
def render(shape: Drawable):
    print(f"{shape.draw()} area={shape.area():.2f}")`,rustCode:`trait Drawable {
    fn draw(&self) -> String;
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

impl Drawable for Circle {
    fn draw(&self) -> String {
        format!("Circle(r={})", self.radius)
    }

    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}

// Compile-time checked: item must implement Drawable
fn render(shape: &impl Drawable) {
    println!("{} area={:.2}", shape.draw(), shape.area());
}

fn main() {
    let c = Circle { radius: 5.0 };
    render(&c);
}`}),e.jsx(t,{title:"No forgetting methods",type:"pythonista",children:e.jsxs("p",{children:["In Python, if you forget to implement a Protocol method, you only find out when that method is called at runtime. With ABCs, you get an error at instantiation — better, but still runtime. Rust catches missing trait methods at compile time. If you forget",e.jsx("code",{children:"area()"}),", the code will not compile."]})}),e.jsx("h2",{children:"Default Implementations"}),e.jsx(n,{language:"rust",title:"Traits with default methods",code:`trait Summary {
    // Required: implementors must provide this
    fn title(&self) -> &str;

    // Default: implementors can override or use as-is
    fn summarize(&self) -> String {
        format!("{} (read more...)", self.title())
    }
}

struct Article {
    title: String,
    content: String,
}

impl Summary for Article {
    fn title(&self) -> &str {
        &self.title
    }
    // summarize() uses the default implementation
}

struct Tweet {
    user: String,
    body: String,
}

impl Summary for Tweet {
    fn title(&self) -> &str {
        &self.user
    }

    // Override the default
    fn summarize(&self) -> String {
        format!("@{}: {}", self.user, self.body)
    }
}

fn main() {
    let article = Article {
        title: "Rust for Pythonistas".into(),
        content: "Long content...".into(),
    };
    let tweet = Tweet {
        user: "rustlang".into(),
        body: "Rust 2024 edition!".into(),
    };

    println!("{}", article.summarize());
    // "Rust for Pythonistas (read more...)"

    println!("{}", tweet.summarize());
    // "@rustlang: Rust 2024 edition!"
}`}),e.jsx("h2",{children:"Implementing Traits for Existing Types"}),e.jsx(r,{title:"Extending existing types",description:"Python monkey-patches classes. Rust implements traits for any type (with the orphan rule).",pythonCode:`# Python: monkey-patching
def word_count(self: str) -> int:
    return len(self.split())

# Technically works, but frowned upon:
str.word_count = word_count
# "hello world".word_count()  # 2

# More idiomatic: standalone function
def word_count(text: str) -> int:
    return len(text.split())

print(word_count("hello world"))  # 2`,rustCode:`// Rust: implement a trait for an existing type
trait WordCount {
    fn word_count(&self) -> usize;
}

impl WordCount for str {
    fn word_count(&self) -> usize {
        self.split_whitespace().count()
    }
}

fn main() {
    let text = "hello world";
    println!("{}", text.word_count());  // 2

    // This is safe and idiomatic — the trait must
    // be in scope to use the method.
}`}),e.jsx(t,{title:"The orphan rule",type:"warning",children:e.jsx("p",{children:"You can implement a trait for a type only if either the trait or the type is defined in your crate. You cannot implement someone else's trait for someone else's type. This prevents conflicting implementations and keeps the ecosystem coherent."})}),e.jsx("h2",{children:"Deriving Traits Automatically"}),e.jsx(n,{language:"rust",title:"The derive macro",code:`// derive generates implementations automatically
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: f64,
    y: f64,
}

fn main() {
    let p1 = Point { x: 1.0, y: 2.0 };

    // Debug: enables {:?} formatting
    println!("{:?}", p1);  // Point { x: 1.0, y: 2.0 }

    // Clone: explicit duplication
    let p2 = p1.clone();

    // PartialEq: enables == comparison
    assert_eq!(p1, p2);
}

// Common derivable traits:
// Debug    — {:?} formatting (like Python __repr__)
// Clone    — .clone() method (like Python copy.copy)
// Copy     — implicit copy on assignment (small, stack-only types)
// PartialEq / Eq — == and != (like Python __eq__)
// PartialOrd / Ord — <, >, <=, >= (like Python __lt__ etc.)
// Hash     — usable as HashMap key (like Python __hash__)
// Default  — Type::default() (like Python default values)`}),e.jsx(t,{title:"derive = Python's @dataclass on steroids",type:"tip",children:e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"@dataclass"})," auto-generates ",e.jsx("code",{children:"__init__"}),",",e.jsx("code",{children:"__repr__"}),", ",e.jsx("code",{children:"__eq__"}),", and more. Rust's",e.jsx("code",{children:"#[derive(...)]"})," does the same for traits like",e.jsx("code",{children:"Debug"}),", ",e.jsx("code",{children:"Clone"}),", and ",e.jsx("code",{children:"PartialEq"}),". The difference: Rust's derives work for enums too, and the generated code is zero-cost."]})}),e.jsx(i,{title:"Shape trait with area and perimeter",difficulty:"medium",problem:`Define a trait Shape with two required methods: area(&self) -> f64 and
perimeter(&self) -> f64, plus a default method describe(&self) -> String
that returns "Area: {area:.2}, Perimeter: {perimeter:.2}".

Implement Shape for Circle (radius: f64) and Rectangle (width: f64, height: f64).
Override describe() for Circle to also include the radius.

Write a function print_shapes that takes a slice of &dyn Shape references
and prints each shape's description.`,solution:`trait Shape {
    fn area(&self) -> f64;
    fn perimeter(&self) -> f64;

    fn describe(&self) -> String {
        format!(
            "Area: {:.2}, Perimeter: {:.2}",
            self.area(),
            self.perimeter()
        )
    }
}

struct Circle { radius: f64 }
struct Rectangle { width: f64, height: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
    fn perimeter(&self) -> f64 {
        2.0 * std::f64::consts::PI * self.radius
    }
    fn describe(&self) -> String {
        format!(
            "Circle(r={:.1}): Area: {:.2}, Perimeter: {:.2}",
            self.radius, self.area(), self.perimeter()
        )
    }
}

impl Shape for Rectangle {
    fn area(&self) -> f64 { self.width * self.height }
    fn perimeter(&self) -> f64 { 2.0 * (self.width + self.height) }
}

fn print_shapes(shapes: &[&dyn Shape]) {
    for s in shapes {
        println!("{}", s.describe());
    }
}

fn main() {
    let c = Circle { radius: 5.0 };
    let r = Rectangle { width: 4.0, height: 6.0 };
    print_shapes(&[&c, &r]);
}`})]})}const S=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"}));function p(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Trait Bounds & Generics"}),e.jsxs("p",{children:[`Python's type hints let you say "this function takes a`,e.jsx("code",{children:"Sequence[int]"}),`," but the runtime ignores them. Rust's trait bounds are the real deal — they constrain generic types at compile time, guaranteeing that only types with the right capabilities can be used.`]}),e.jsx(s,{title:"What Are Trait Bounds?",children:e.jsxs("p",{children:['A trait bound says: "this generic type ',e.jsx("code",{children:"T"}),' must implement these traits." It is a contract between the caller and the function. The compiler verifies it at every call site — not at runtime, not in tests, but before the program can even be compiled.']})}),e.jsx("h2",{children:"Python Type Hints vs Rust Trait Bounds"}),e.jsx(r,{title:"Constraining function arguments",description:"Python type hints are suggestions; Rust trait bounds are enforced.",pythonCode:`from typing import TypeVar, Protocol

class HasLen(Protocol):
    def __len__(self) -> int: ...

T = TypeVar("T", bound=HasLen)

def print_length(item: T) -> None:
    print(f"Length: {len(item)}")

# Works with any object that has __len__
print_length([1, 2, 3])     # Length: 3
print_length("hello")       # Length: 5
print_length(42)             # No error at call time!
# TypeError happens inside the function at runtime`,rustCode:`// Trait bound syntax: T must implement Display
fn print_item<T: std::fmt::Display>(item: T) {
    println!("Item: {}", item);
}

// Multiple bounds: T must be Display AND Clone
fn print_and_keep<T: std::fmt::Display + Clone>(item: T) {
    println!("Item: {}", item);
    let _copy = item.clone();  // guaranteed to work
}

fn main() {
    print_item(42);        // OK: i32 implements Display
    print_item("hello");   // OK: &str implements Display

    // This won't compile — Vec<i32> doesn't implement Display:
    // print_item(vec![1, 2, 3]);  // ERROR at compile time
}`}),e.jsx(t,{title:"Compile-time vs runtime checking",type:"pythonista",children:e.jsxs("p",{children:["In Python, ",e.jsx("code",{children:"print_length(42)"})," only fails when",e.jsx("code",{children:"len()"})," is actually called inside the function. In Rust, passing a type that does not satisfy the bound fails immediately at the call site — you get a clear compiler error saying exactly which trait is missing."]})}),e.jsx("h2",{children:"Syntax Variations"}),e.jsx(n,{language:"rust",title:"Three ways to write trait bounds",code:`use std::fmt::{Display, Debug};

// 1. impl Trait syntax (simplest, for function args)
fn log_value(val: &impl Display) {
    println!("LOG: {}", val);
}

// 2. Generic with bound (more flexible)
fn log_pair<T: Display, U: Display>(a: T, b: U) {
    println!("({}, {})", a, b);
}

// 3. where clause (cleanest for complex bounds)
fn process<T, U>(a: T, b: U) -> String
where
    T: Display + Clone,
    U: Debug + Default,
{
    let a_copy = a.clone();
    format!("{} with {:?}", a_copy, b)
}

fn main() {
    log_value(&42);
    log_pair("hello", 3.14);
    println!("{}", process("data", 0_i32));
}`}),e.jsx(t,{title:"When to use which syntax",type:"tip",children:e.jsxs("p",{children:["Use ",e.jsx("code",{children:"impl Trait"})," for simple cases with one or two parameters. Use the ",e.jsx("code",{children:"where"})," clause when bounds get complex — it keeps the function signature readable. Both generate identical machine code."]})}),e.jsx("h2",{children:"Returning Trait Types"}),e.jsx(r,{title:"Returning abstract types",description:"Python returns a Protocol type (or Any). Rust uses impl Trait in return position.",pythonCode:`from typing import Iterator

def count_up(start: int) -> Iterator[int]:
    """Return type says Iterator, but Python
    doesn't enforce what the iterator yields."""
    n = start
    while True:
        yield n
        n += 1

gen = count_up(10)
print(next(gen))  # 10
print(next(gen))  # 11`,rustCode:`// impl Trait in return position: the function
// returns "some type that implements Iterator"
fn count_up(start: i32) -> impl Iterator<Item = i32> {
    // The actual type (RangeFrom<i32>) is hidden
    start..  // infinite range
}

fn main() {
    let mut counter = count_up(10);
    println!("{}", counter.next().unwrap());  // 10
    println!("{}", counter.next().unwrap());  // 11
}`}),e.jsx("h2",{children:"Multiple Trait Bounds in Practice"}),e.jsx(n,{language:"rust",title:"Real-world trait bounds",code:`use std::fmt::Display;
use std::collections::HashMap;
use std::hash::Hash;

// A function that counts occurrences — the key must be
// hashable (Hash), comparable (Eq), and printable (Display)
fn count_and_report<T>(items: Vec<T>) -> HashMap<T, usize>
where
    T: Hash + Eq + Display,
{
    let mut counts = HashMap::new();
    for item in items {
        println!("Counting: {}", item);
        *counts.entry(item).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let words = vec!["hello", "world", "hello", "rust"];
    let counts = count_and_report(words);
    println!("{:?}", counts);
    // {"hello": 2, "world": 1, "rust": 1}
}

// Compare with Python:
// def count_and_report(items: list[Hashable]) -> dict
// Python's Hashable protocol exists but is rarely enforced`}),e.jsx(t,{title:"Trait bounds document requirements",type:"note",children:e.jsxs("p",{children:["Reading ",e.jsx("code",{children:"T: Hash + Eq + Display"})," tells you exactly what capabilities the function requires. In Python, you would need to read the function body to discover it calls ",e.jsx("code",{children:"hash()"}),", uses ",e.jsx("code",{children:"=="}),", and calls ",e.jsx("code",{children:"str()"}),". Trait bounds are self-documenting contracts."]})}),e.jsx(i,{title:"Generic max function",difficulty:"medium",problem:`Write a generic function largest<T>(list: &[T]) -> Option<&T> that returns
a reference to the largest item in a slice. Think about which trait bound T
needs (hint: you need to compare items). Then call it with:
1. A slice of integers
2. A slice of strings (lexicographic comparison)
3. A slice of chars
Handle the empty-slice case by returning None.`,solution:`fn largest<T: PartialOrd>(list: &[T]) -> Option<&T> {
    if list.is_empty() {
        return None;
    }

    let mut max = &list[0];
    for item in &list[1..] {
        if item > max {
            max = item;
        }
    }
    Some(max)
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("Largest number: {:?}", largest(&numbers));
    // Some(100)

    let words = vec!["cherry", "apple", "banana"];
    println!("Largest word: {:?}", largest(&words));
    // Some("cherry")

    let chars = vec!['z', 'a', 'm'];
    println!("Largest char: {:?}", largest(&chars));
    // Some('z')

    let empty: Vec<i32> = vec![];
    println!("Largest of empty: {:?}", largest(&empty));
    // None
}`})]})}const T=Object.freeze(Object.defineProperty({__proto__:null,default:p},Symbol.toStringTag,{value:"Module"}));function h(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Common Standard Library Traits"}),e.jsxs("p",{children:["Python has dunder methods (",e.jsx("code",{children:"__str__"}),", ",e.jsx("code",{children:"__repr__"}),",",e.jsx("code",{children:"__eq__"}),", etc.) that customize how objects behave. Rust uses standard library traits for the same purpose. Knowing these traits is essential — they are the building blocks of idiomatic Rust."]}),e.jsx(s,{title:"The Trait Ecosystem",children:e.jsxs("p",{children:["Rust's standard library defines a rich set of traits that let your types integrate with the language and ecosystem. Most can be auto-generated with ",e.jsx("code",{children:"#[derive(...)]"}),". Understanding these traits is like learning Python's data model — once you know them, everything clicks."]})}),e.jsx("h2",{children:"Display and Debug — Printing Your Types"}),e.jsx(r,{title:"String representation",description:"Python's __str__ and __repr__ map to Rust's Display and Debug traits.",pythonCode:`class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __str__(self) -> str:
        return f"({self.x}, {self.y})"

    def __repr__(self) -> str:
        return f"Point(x={self.x}, y={self.y})"

p = Point(1.0, 2.0)
print(str(p))   # (1.0, 2.0)    — __str__
print(repr(p))  # Point(x=1.0, y=2.0) — __repr__`,rustCode:`use std::fmt;

#[derive(Debug)]  // Auto-generates Debug
struct Point {
    x: f64,
    y: f64,
}

// Display must be implemented manually
impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    println!("{}", p);    // (1.0, 2.0)     — Display
    println!("{:?}", p);  // Point { x: 1.0, y: 2.0 } — Debug
    println!("{p:#?}");   // Pretty-printed Debug
}`}),e.jsx(t,{title:"Display enables .to_string()",type:"tip",children:e.jsxs("p",{children:["Implementing ",e.jsx("code",{children:"Display"})," automatically gives your type a",e.jsx("code",{children:".to_string()"})," method and lets it work with",e.jsx("code",{children:"format!()"}),", ",e.jsx("code",{children:"println!()"}),", and string interpolation. Always derive ",e.jsx("code",{children:"Debug"}),"; implement",e.jsx("code",{children:"Display"})," when you want user-friendly output."]})}),e.jsx("h2",{children:"From and Into — Type Conversions"}),e.jsx(r,{title:"Type conversions",description:"Python uses __init__ or class methods for conversions. Rust uses From/Into traits.",pythonCode:`class Celsius:
    def __init__(self, temp: float):
        self.temp = temp

    @classmethod
    def from_fahrenheit(cls, f: float) -> "Celsius":
        return cls((f - 32.0) * 5.0 / 9.0)

    def __str__(self):
        return f"{self.temp:.1f}°C"

c = Celsius.from_fahrenheit(212.0)
print(c)  # 100.0°C`,rustCode:`use std::fmt;

struct Celsius(f64);
struct Fahrenheit(f64);

// Implement From<Fahrenheit> for Celsius
impl From<Fahrenheit> for Celsius {
    fn from(f: Fahrenheit) -> Self {
        Celsius((f.0 - 32.0) * 5.0 / 9.0)
    }
}

impl fmt::Display for Celsius {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:.1}°C", self.0)
    }
}

fn main() {
    // From: explicit conversion
    let c = Celsius::from(Fahrenheit(212.0));
    println!("{}", c);  // 100.0°C

    // Into: the reverse (free when From is implemented)
    let c2: Celsius = Fahrenheit(32.0).into();
    println!("{}", c2); // 0.0°C
}`}),e.jsx(t,{title:"From gives you Into for free",type:"note",children:e.jsxs("p",{children:["When you implement ",e.jsx("code",{children:"From<A> for B"}),", Rust automatically provides ",e.jsx("code",{children:"Into<B> for A"}),". Always implement ",e.jsx("code",{children:"From"})," — you get both directions. The",e.jsx("code",{children:"?"})," operator uses ",e.jsx("code",{children:"From"})," to convert error types, making this trait essential for error handling."]})}),e.jsx("h2",{children:"Default — Sensible Starting Values"}),e.jsx(n,{language:"rust",title:"The Default trait",code:`#[derive(Debug, Default)]
struct Config {
    host: String,       // Default: ""
    port: u16,          // Default: 0
    verbose: bool,      // Default: false
    workers: usize,     // Default: 0
}

// Custom Default when derive isn't enough
#[derive(Debug)]
struct ServerConfig {
    host: String,
    port: u16,
    max_connections: usize,
}

impl Default for ServerConfig {
    fn default() -> Self {
        ServerConfig {
            host: "localhost".to_string(),
            port: 8080,
            max_connections: 100,
        }
    }
}

fn main() {
    // Use all defaults
    let cfg1 = Config::default();
    println!("{:?}", cfg1);

    // Override some fields (struct update with Default)
    let cfg2 = ServerConfig {
        port: 3000,
        ..ServerConfig::default()
    };
    println!("{:?}", cfg2);
    // ServerConfig { host: "localhost", port: 3000, max_connections: 100 }
}`}),e.jsx("h2",{children:"Clone and Copy — Duplication Semantics"}),e.jsx(n,{language:"rust",title:"Clone vs Copy",code:`// Copy: implicit, bitwise duplication (cheap, stack-only types)
#[derive(Debug, Clone, Copy)]
struct Point { x: f64, y: f64 }

// Clone only: explicit duplication (heap data, expensive)
#[derive(Debug, Clone)]
struct Dataset {
    name: String,
    values: Vec<f64>,
}

fn main() {
    // Copy types are implicitly duplicated on assignment
    let p1 = Point { x: 1.0, y: 2.0 };
    let p2 = p1;       // p1 is copied, both usable
    println!("{:?} {:?}", p1, p2);  // both work

    // Clone types must be explicitly cloned
    let d1 = Dataset {
        name: "train".into(),
        values: vec![1.0, 2.0, 3.0],
    };
    let d2 = d1.clone();  // explicit — you see the cost
    // let d3 = d1;        // This MOVES d1, making it unusable
    println!("{:?}", d2);
}

// Rule of thumb:
// - Small, stack-only types (numbers, Point): derive Copy + Clone
// - Types with heap data (String, Vec): derive Clone only
// - Types that own unique resources (File): neither`}),e.jsx(t,{title:"Python comparison",type:"pythonista",children:e.jsxs("p",{children:["In Python, assignment always creates a new reference to the same object (",e.jsx("code",{children:"b = a"})," does not copy). You use",e.jsx("code",{children:"copy.copy()"})," for shallow copies and",e.jsx("code",{children:"copy.deepcopy()"})," for deep copies. Rust's",e.jsx("code",{children:"Copy"})," is like automatic shallow copy for simple types, and ",e.jsx("code",{children:"Clone"})," is like an explicit deep copy."]})}),e.jsx("h2",{children:"PartialEq, Eq, PartialOrd, Ord — Comparison"}),e.jsx(n,{language:"rust",title:"Comparison traits",code:`// Derive all comparison traits
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Score {
    points: u32,
    name: String,  // compared second (field order matters!)
}

fn main() {
    let scores = vec![
        Score { points: 100, name: "Alice".into() },
        Score { points: 85, name: "Bob".into() },
        Score { points: 100, name: "Charlie".into() },
    ];

    // PartialEq: enables ==
    assert!(scores[0] != scores[1]);

    // Ord: enables sorting
    let mut sorted = scores.clone();
    sorted.sort();
    for s in &sorted {
        println!("{}: {}", s.name, s.points);
    }
    // Bob: 85, Alice: 100, Charlie: 100

    // PartialOrd: enables <, >, min, max
    println!("Best: {:?}", sorted.last());
}

// Why Partial vs Total?
// f64 has NaN (NaN != NaN), so it's only PartialEq/PartialOrd.
// Integers are always comparable, so they implement Eq/Ord too.`}),e.jsx(i,{title:"Implement a Temperature type",difficulty:"medium",problem:`Create a Temperature struct that wraps an f64 (in Celsius). Implement:
1. Display — format as "23.5°C"
2. From<f64> — create from raw number
3. Default — default to 20.0 (room temperature)
4. A method to_fahrenheit(&self) -> f64

Then create a function warmest(temps: &[Temperature]) -> Option<&Temperature>
that finds the highest temperature using PartialOrd (you'll need to derive it).`,solution:`use std::fmt;

#[derive(Debug, Clone, PartialEq, PartialOrd)]
struct Temperature(f64);

impl fmt::Display for Temperature {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:.1}°C", self.0)
    }
}

impl From<f64> for Temperature {
    fn from(celsius: f64) -> Self {
        Temperature(celsius)
    }
}

impl Default for Temperature {
    fn default() -> Self {
        Temperature(20.0)
    }
}

impl Temperature {
    fn to_fahrenheit(&self) -> f64 {
        self.0 * 9.0 / 5.0 + 32.0
    }
}

fn warmest(temps: &[Temperature]) -> Option<&Temperature> {
    temps.iter().max_by(|a, b| {
        a.partial_cmp(b).unwrap()
    })
}

fn main() {
    let temps: Vec<Temperature> = vec![
        18.5.into(), 22.0.into(), 19.3.into(),
    ];

    for t in &temps {
        println!("{} = {:.1}°F", t, t.to_fahrenheit());
    }

    if let Some(max) = warmest(&temps) {
        println!("Warmest: {}", max);
    }
}`})]})}const C=Object.freeze(Object.defineProperty({__proto__:null,default:h},Symbol.toStringTag,{value:"Module"}));function f(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Generic Functions & Structs"}),e.jsxs("p",{children:["Python is dynamically typed, so functions naturally work with any type. Rust is statically typed, but ",e.jsx("strong",{children:"generics"})," let you write code that works with many types while preserving full type safety. The compiler generates specialized versions for each concrete type used — zero runtime cost."]}),e.jsx(s,{title:"Generics = Compile-Time Polymorphism",children:e.jsxs("p",{children:["A generic function or struct uses type parameters (like",e.jsx("code",{children:"<T>"}),") as placeholders. When you call",e.jsx("code",{children:"largest(&vec![1, 2, 3])"}),", the compiler generates a version of ",e.jsx("code",{children:"largest"})," specialized for ",e.jsx("code",{children:"i32"}),". This process is called ",e.jsx("strong",{children:"monomorphization"})," — it produces the same machine code as if you wrote a separate function for each type."]})}),e.jsx("h2",{children:"Python Duck Typing vs Rust Generics"}),e.jsx(r,{title:"Functions that work with many types",description:"Python relies on duck typing at runtime. Rust uses generics with trait bounds checked at compile time.",pythonCode:`from typing import TypeVar, Sequence

T = TypeVar("T")

def first(items: Sequence[T]) -> T | None:
    """Return the first item, or None."""
    return items[0] if items else None

# Works with any sequence — duck typing
print(first([1, 2, 3]))       # 1
print(first(("a", "b")))      # "a"
print(first("hello"))          # "h"
print(first([]))               # None

# But also "works" with nonsense — no error until runtime:
# first(42)  # TypeError: object is not subscriptable`,rustCode:`fn first<T>(items: &[T]) -> Option<&T> {
    items.first()
}

fn main() {
    let nums = vec![1, 2, 3];
    let words = vec!["a", "b"];

    println!("{:?}", first(&nums));   // Some(1)
    println!("{:?}", first(&words));  // Some("a")

    let empty: Vec<i32> = vec![];
    println!("{:?}", first(&empty));  // None

    // This won't compile — 42 is not a slice:
    // first(&42);  // ERROR at compile time
}`}),e.jsx(t,{title:"Monomorphization",type:"note",children:e.jsxs("p",{children:["When you call ",e.jsx("code",{children:"first(&nums)"})," and",e.jsx("code",{children:"first(&words)"}),", the compiler generates two separate functions: ",e.jsx("code",{children:"first_i32"})," and ",e.jsx("code",{children:"first_str"}),". This is why generics have zero runtime overhead — the type parameter is resolved entirely at compile time. Python's equivalent would be writing separate functions by hand."]})}),e.jsx("h2",{children:"Generic Structs"}),e.jsx(r,{title:"Generic data containers",description:"Python uses Generic[T] for type hints. Rust's generics define the actual memory layout.",pythonCode:`from typing import Generic, TypeVar, Optional

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self):
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> Optional[T]:
        return self._items.pop() if self._items else None

    def peek(self) -> Optional[T]:
        return self._items[-1] if self._items else None

s: Stack[int] = Stack()
s.push(1)
s.push(2)
print(s.pop())  # 2`,rustCode:`struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    fn peek(&self) -> Option<&T> {
        self.items.last()
    }
}

fn main() {
    let mut s: Stack<i32> = Stack::new();
    s.push(1);
    s.push(2);
    println!("{:?}", s.pop());  // Some(2)

    // Type is often inferred:
    let mut names = Stack::new();  // Stack<&str>
    names.push("Alice");
    names.push("Bob");
}`}),e.jsx("h2",{children:"Multiple Type Parameters"}),e.jsx(n,{language:"rust",title:"Structs and functions with multiple generics",code:`// A key-value pair with different types for key and value
#[derive(Debug)]
struct Pair<K, V> {
    key: K,
    value: V,
}

impl<K, V> Pair<K, V> {
    fn new(key: K, value: V) -> Self {
        Pair { key, value }
    }

    fn into_tuple(self) -> (K, V) {
        (self.key, self.value)
    }
}

// Methods only available when K is displayable
impl<K: std::fmt::Display, V: std::fmt::Debug> Pair<K, V> {
    fn describe(&self) -> String {
        format!("{} => {:?}", self.key, self.value)
    }
}

fn main() {
    let p1 = Pair::new("name", "Alice");
    let p2 = Pair::new(1, vec![10, 20, 30]);

    println!("{}", p1.describe());  // name => "Alice"
    println!("{}", p2.describe());  // 1 => [10, 20, 30]

    let (k, v) = p2.into_tuple();
    println!("Key: {}, Values: {:?}", k, v);
}`}),e.jsx(t,{title:"Conditional method implementations",type:"tip",children:e.jsxs("p",{children:["Notice the second ",e.jsx("code",{children:"impl"})," block adds ",e.jsx("code",{children:"describe()"}),"only when ",e.jsx("code",{children:"K: Display"})," and ",e.jsx("code",{children:"V: Debug"}),". This is a powerful pattern — you can add methods that are available only for certain type combinations. Python has no equivalent; you would need runtime ",e.jsx("code",{children:"isinstance"})," checks."]})}),e.jsx("h2",{children:"Generic Enums"}),e.jsx(n,{language:"rust",title:"You already use generic enums",code:`// Option and Result ARE generic enums!
// Here's how they're defined (simplified):

// enum Option<T> {
//     Some(T),
//     None,
// }

// enum Result<T, E> {
//     Ok(T),
//     Err(E),
// }

// Your own generic enum:
#[derive(Debug)]
enum Response<T> {
    Success(T),
    Error(String),
    Loading,
}

impl<T: std::fmt::Display> Response<T> {
    fn unwrap_or(self, default: T) -> T {
        match self {
            Response::Success(val) => val,
            _ => default,
        }
    }
}

fn fetch_data(id: u32) -> Response<String> {
    match id {
        1 => Response::Success("Alice".into()),
        2 => Response::Success("Bob".into()),
        _ => Response::Error("Not found".into()),
    }
}

fn main() {
    let name = fetch_data(1).unwrap_or("Unknown".into());
    println!("{}", name);  // Alice

    let missing = fetch_data(99).unwrap_or("Unknown".into());
    println!("{}", missing);  // Unknown
}`}),e.jsx(t,{title:"Generics are everywhere",type:"pythonista",children:e.jsxs("p",{children:["Once you recognize that ",e.jsx("code",{children:"Option<T>"}),",",e.jsx("code",{children:"Result<T, E>"}),", ",e.jsx("code",{children:"Vec<T>"}),",",e.jsx("code",{children:"HashMap<K, V>"}),", and ",e.jsx("code",{children:"Iterator<Item = T>"}),"are all generic types, Rust's type system clicks into place. Think of generics as Python's duck typing, but with the types checked before your code runs."]})}),e.jsx(i,{title:"Generic min-max tracker",difficulty:"medium",problem:`Create a generic struct MinMax<T> that tracks the minimum and maximum
values seen so far. It should have:
1. new(first: T) -> Self — initialize with the first value
2. update(&mut self, value: T) — update min/max if the new value is smaller/larger
3. min(&self) -> &T and max(&self) -> &T — return references to current min/max
4. spread(&self) -> T where T also implements Sub (subtraction) — return max - min

What trait bound does T need for comparison? For subtraction?`,solution:`use std::ops::Sub;

struct MinMax<T> {
    min_val: T,
    max_val: T,
}

impl<T: PartialOrd + Clone> MinMax<T> {
    fn new(first: T) -> Self {
        MinMax {
            min_val: first.clone(),
            max_val: first,
        }
    }

    fn update(&mut self, value: T) {
        if value < self.min_val {
            self.min_val = value.clone();
        }
        if value > self.max_val {
            self.max_val = value;
        }
    }

    fn min(&self) -> &T { &self.min_val }
    fn max(&self) -> &T { &self.max_val }
}

// spread() needs Sub in addition to the base bounds
impl<T> MinMax<T>
where
    T: PartialOrd + Clone + Sub<Output = T>,
{
    fn spread(&self) -> T {
        self.max_val.clone() - self.min_val.clone()
    }
}

fn main() {
    let mut tracker = MinMax::new(5);
    tracker.update(3);
    tracker.update(8);
    tracker.update(1);

    println!("Min: {}, Max: {}", tracker.min(), tracker.max());
    println!("Spread: {}", tracker.spread());
    // Min: 1, Max: 8, Spread: 7
}`})]})}const k=Object.freeze(Object.defineProperty({__proto__:null,default:f},Symbol.toStringTag,{value:"Module"}));function m(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Associated Types"}),e.jsxs("p",{children:['When a trait has a type that "belongs" to it — like the item type of an iterator — Rust uses ',e.jsx("strong",{children:"associated types"})," instead of additional generic parameters. This keeps trait usage clean and avoids type parameter explosion."]}),e.jsx(s,{title:"Associated Types vs Generic Parameters",children:e.jsx("p",{children:'An associated type says: "each implementation of this trait chooses one specific type for this slot." A generic parameter says: "a type can implement this trait for many different type parameters." Associated types are the right choice when there should be exactly one implementation per type.'})}),e.jsx("h2",{children:"The Problem Associated Types Solve"}),e.jsx(r,{title:"Iterator item types",description:"Python iterators yield 'object'. Rust iterators have a concrete associated Item type.",pythonCode:`from typing import Iterator

class Counter:
    """Yields ints, but Python doesn't enforce this."""
    def __init__(self, max: int):
        self.current = 0
        self.max = max

    def __iter__(self) -> "Counter":
        return self

    def __next__(self) -> int:  # type hint only
        if self.current >= self.max:
            raise StopIteration
        val = self.current
        self.current += 1
        return val

# Nothing stops you from yielding mixed types:
# def __next__(self) -> int:
#     return "surprise!"  # No error until someone uses it`,rustCode:`struct Counter {
    current: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Self {
        Counter { current: 0, max }
    }
}

impl Iterator for Counter {
    type Item = u32;  // Associated type: this iterator yields u32

    fn next(&mut self) -> Option<Self::Item> {
        if self.current >= self.max {
            None
        } else {
            let val = self.current;
            self.current += 1;
            Some(val)
        }
    }
}

fn main() {
    let sum: u32 = Counter::new(5).sum();
    println!("{}", sum);  // 10
}`}),e.jsx(t,{title:"Why not Iterator<T>?",type:"note",children:e.jsxs("p",{children:["If ",e.jsx("code",{children:"Iterator"})," used a generic parameter",e.jsx("code",{children:"Iterator<T>"}),", a single type could implement",e.jsx("code",{children:"Iterator<i32>"})," AND ",e.jsx("code",{children:"Iterator<String>"}),", making it ambiguous which ",e.jsx("code",{children:"next()"})," to call. With an associated type, each type implements ",e.jsx("code",{children:"Iterator"})," exactly once, with exactly one ",e.jsx("code",{children:"Item"})," type. Clarity over flexibility."]})}),e.jsx("h2",{children:"Defining Your Own Traits with Associated Types"}),e.jsx(n,{language:"rust",title:"A trait with an associated type",code:`trait Transformer {
    type Input;
    type Output;

    fn transform(&self, input: Self::Input) -> Self::Output;
}

struct Doubler;

impl Transformer for Doubler {
    type Input = i32;
    type Output = i32;

    fn transform(&self, input: i32) -> i32 {
        input * 2
    }
}

struct Stringifier;

impl Transformer for Stringifier {
    type Input = i32;
    type Output = String;

    fn transform(&self, input: i32) -> String {
        format!("Value: {}", input)
    }
}

// Using the trait in a generic function
fn apply<T: Transformer>(t: &T, input: T::Input) -> T::Output {
    t.transform(input)
}

fn main() {
    println!("{}", apply(&Doubler, 21));          // 42
    println!("{}", apply(&Stringifier, 42));       // Value: 42
}`}),e.jsx("h2",{children:"Associated Types in the Standard Library"}),e.jsx(n,{language:"rust",title:"Common traits with associated types",code:`use std::ops::Add;

// std::ops::Add has an associated type Output:
// trait Add<Rhs = Self> {
//     type Output;
//     fn add(self, rhs: Rhs) -> Self::Output;
// }

#[derive(Debug, Clone, Copy)]
struct Vector2D { x: f64, y: f64 }

impl Add for Vector2D {
    type Output = Vector2D;  // Adding two Vector2Ds gives a Vector2D

    fn add(self, other: Vector2D) -> Vector2D {
        Vector2D {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

// You can even add different types:
impl Add<f64> for Vector2D {
    type Output = Vector2D;  // Adding a scalar to a Vector2D

    fn add(self, scalar: f64) -> Vector2D {
        Vector2D {
            x: self.x + scalar,
            y: self.y + scalar,
        }
    }
}

fn main() {
    let a = Vector2D { x: 1.0, y: 2.0 };
    let b = Vector2D { x: 3.0, y: 4.0 };

    let c = a + b;           // Vector2D + Vector2D
    println!("{:?}", c);     // Vector2D { x: 4.0, y: 6.0 }

    let d = a + 10.0;        // Vector2D + f64
    println!("{:?}", d);     // Vector2D { x: 11.0, y: 12.0 }
}`}),e.jsx(t,{title:"Operator overloading in Rust",type:"pythonista",children:e.jsxs("p",{children:["Python uses ",e.jsx("code",{children:"__add__"}),", ",e.jsx("code",{children:"__mul__"}),", etc. for operator overloading. Rust uses traits from ",e.jsx("code",{children:"std::ops"}),":",e.jsx("code",{children:"Add"}),", ",e.jsx("code",{children:"Mul"}),", ",e.jsx("code",{children:"Index"}),", etc. The associated ",e.jsx("code",{children:"Output"})," type lets the result type differ from the input types — something Python's dunder methods do implicitly but Rust makes explicit."]})}),e.jsx("h2",{children:"When to Use Associated Types vs Generics"}),e.jsx(n,{language:"rust",title:"Decision guide",code:`// USE ASSOCIATED TYPES when:
// There should be ONE implementation per type

trait Parser {
    type Output;                     // Each parser has one output type
    fn parse(&self, input: &str) -> Option<Self::Output>;
}

struct IntParser;
impl Parser for IntParser {
    type Output = i32;               // IntParser always produces i32
    fn parse(&self, input: &str) -> Option<i32> {
        input.parse().ok()
    }
}

// USE GENERIC PARAMETERS when:
// A type should implement the trait for MULTIPLE type parameters

trait Convertible<T> {
    fn convert(&self) -> T;
}

struct MyNumber(f64);

impl Convertible<i32> for MyNumber {
    fn convert(&self) -> i32 { self.0 as i32 }
}

impl Convertible<String> for MyNumber {
    fn convert(&self) -> String { self.0.to_string() }
}

fn main() {
    let n = MyNumber(3.14);
    let i: i32 = n.convert();      // uses Convertible<i32>
    let s: String = n.convert();    // uses Convertible<String>
    println!("{}, {}", i, s);       // 3, 3.14
}`}),e.jsx(i,{title:"A DataSource trait",difficulty:"medium",problem:`Define a trait DataSource with:
- An associated type Record
- A method fetch(&self) -> Vec<Self::Record>
- A method count(&self) -> usize with a default implementation that calls fetch().len()

Implement DataSource for two structs:
1. CsvSource (returns Vec<Vec<String>> — rows of string fields)
2. JsonSource (returns Vec<HashMap<String, String>> — list of objects)

Write a function summarize<D: DataSource>(source: &D) that prints the count.`,solution:`use std::collections::HashMap;

trait DataSource {
    type Record;

    fn fetch(&self) -> Vec<Self::Record>;

    fn count(&self) -> usize {
        self.fetch().len()
    }
}

struct CsvSource {
    data: Vec<Vec<String>>,
}

impl DataSource for CsvSource {
    type Record = Vec<String>;

    fn fetch(&self) -> Vec<Vec<String>> {
        self.data.clone()
    }
}

struct JsonSource {
    data: Vec<HashMap<String, String>>,
}

impl DataSource for JsonSource {
    type Record = HashMap<String, String>;

    fn fetch(&self) -> Vec<HashMap<String, String>> {
        self.data.clone()
    }
}

fn summarize<D: DataSource>(source: &D) {
    println!("Records: {}", source.count());
}

fn main() {
    let csv = CsvSource {
        data: vec![
            vec!["Alice".into(), "30".into()],
            vec!["Bob".into(), "25".into()],
        ],
    };
    summarize(&csv);  // Records: 2

    let json = JsonSource {
        data: vec![
            HashMap::from([("name".into(), "Alice".into())]),
        ],
    };
    summarize(&json);  // Records: 1
}`})]})}const P=Object.freeze(Object.defineProperty({__proto__:null,default:m},Symbol.toStringTag,{value:"Module"}));function y(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Trait Objects (dyn Trait)"}),e.jsxs("p",{children:["Generics give you compile-time polymorphism — the compiler generates specialized code for each type. But sometimes you need runtime polymorphism: a collection of different types that share a trait. This is where ",e.jsx("strong",{children:"trait objects"})," come in, using",e.jsx("code",{children:"dyn Trait"}),"."]}),e.jsxs(s,{title:"Static vs Dynamic Dispatch",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Static dispatch"})," (generics): The compiler knows the exact type at compile time and generates specialized code. Fast, but each type combination creates a new copy of the function."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Dynamic dispatch"})," (trait objects): The exact type is determined at runtime via a vtable (a table of function pointers). Slightly slower, but allows heterogeneous collections and runtime flexibility."]})]}),e.jsx("h2",{children:"Python's Default vs Rust's Explicit Choice"}),e.jsx(r,{title:"Runtime polymorphism",description:"Python always uses dynamic dispatch. Rust lets you choose between static and dynamic.",pythonCode:`class Dog:
    def speak(self) -> str:
        return "Woof!"

class Cat:
    def speak(self) -> str:
        return "Meow!"

class Fish:
    def speak(self) -> str:
        return "..."

# Python: any list can hold mixed types
# Dispatch is always dynamic (via __dict__ lookup)
animals = [Dog(), Cat(), Fish()]
for animal in animals:
    print(animal.speak())  # resolved at runtime`,rustCode:`trait Animal {
    fn speak(&self) -> &str;
}

struct Dog;
struct Cat;
struct Fish;

impl Animal for Dog  { fn speak(&self) -> &str { "Woof!" } }
impl Animal for Cat  { fn speak(&self) -> &str { "Meow!" } }
impl Animal for Fish { fn speak(&self) -> &str { "..." } }

fn main() {
    // dyn Animal: a trait object — type resolved at runtime
    let animals: Vec<Box<dyn Animal>> = vec![
        Box::new(Dog),
        Box::new(Cat),
        Box::new(Fish),
    ];

    for animal in &animals {
        println!("{}", animal.speak()); // dynamic dispatch
    }
}`}),e.jsx(t,{title:"Box<dyn Trait>",type:"note",children:e.jsxs("p",{children:["Trait objects must be behind a pointer (",e.jsx("code",{children:"Box"}),",",e.jsx("code",{children:"&dyn"}),", or ",e.jsx("code",{children:"Arc"}),") because different types have different sizes. The pointer has a fixed size and includes a vtable pointer for method lookup. ",e.jsx("code",{children:"Box<dyn Animal>"}),"owns the value on the heap; ",e.jsx("code",{children:"&dyn Animal"})," borrows it."]})}),e.jsx("h2",{children:"Static vs Dynamic: When to Choose Which"}),e.jsx(n,{language:"rust",title:"The same trait, two dispatch strategies",code:`trait Processor {
    fn process(&self, data: &str) -> String;
}

struct Upper;
struct Lower;

impl Processor for Upper {
    fn process(&self, data: &str) -> String { data.to_uppercase() }
}

impl Processor for Lower {
    fn process(&self, data: &str) -> String { data.to_lowercase() }
}

// STATIC dispatch: compiler generates one version per type
// Pro: fastest, enables inlining.  Con: no mixed collections.
fn apply_static(proc: &impl Processor, data: &str) -> String {
    proc.process(data)
}

// DYNAMIC dispatch: one version, dispatched via vtable
// Pro: mixed collections, smaller binary.  Con: slight overhead.
fn apply_dynamic(proc: &dyn Processor, data: &str) -> String {
    proc.process(data)
}

fn main() {
    // Static — type known at compile time
    println!("{}", apply_static(&Upper, "hello"));  // HELLO
    println!("{}", apply_static(&Lower, "HELLO"));  // hello

    // Dynamic — type resolved at runtime
    let processors: Vec<Box<dyn Processor>> = vec![
        Box::new(Upper),
        Box::new(Lower),
    ];
    for p in &processors {
        println!("{}", apply_dynamic(p.as_ref(), "Rust"));
    }
}`}),e.jsx("h2",{children:"Trait Object Limitations"}),e.jsx(n,{language:"rust",title:"Object safety rules",code:`// This trait IS object-safe (can be used as dyn)
trait Drawable {
    fn draw(&self) -> String;
    fn area(&self) -> f64;
}

// This trait is NOT object-safe
trait Clonable {
    fn clone_box(&self) -> Self;  // Returns Self — size unknown!
}

// This trait is NOT object-safe
trait Typed {
    fn convert<T>(&self) -> T;   // Generic method — can't dispatch
}

// Workaround: make non-object-safe traits object-safe
trait CloneBox {
    fn clone_box(&self) -> Box<dyn CloneBox>;
}

impl<T: Clone + 'static> CloneBox for T {
    fn clone_box(&self) -> Box<dyn CloneBox> {
        Box::new(self.clone())
    }
}

// Object safety rules:
// 1. Methods cannot return Self (use Box<dyn Trait> instead)
// 2. Methods cannot have generic type parameters
// 3. The trait cannot require Self: Sized`}),e.jsx(t,{title:"When to use trait objects",type:"tip",children:e.jsxs("p",{children:["Use ",e.jsx("strong",{children:"generics"})," (static dispatch) by default — they are faster and let the compiler optimize more aggressively. Use",e.jsx("strong",{children:"trait objects"})," (dynamic dispatch) when you need heterogeneous collections, plugin architectures, or when reducing binary size matters. In data-intensive code, generics are almost always the right choice."]})}),e.jsx("h2",{children:"Real-World Pattern: Strategy with Trait Objects"}),e.jsx(r,{title:"Strategy pattern",description:"A common pattern in both languages: swap behavior at runtime.",pythonCode:`from typing import Protocol

class Tokenizer(Protocol):
    def tokenize(self, text: str) -> list[str]: ...

class WhitespaceTokenizer:
    def tokenize(self, text: str) -> list[str]:
        return text.split()

class CharTokenizer:
    def tokenize(self, text: str) -> list[str]:
        return list(text)

class Pipeline:
    def __init__(self, tokenizer: Tokenizer):
        self.tokenizer = tokenizer

    def run(self, text: str) -> list[str]:
        return self.tokenizer.tokenize(text)

pipe = Pipeline(WhitespaceTokenizer())
print(pipe.run("hello world"))  # ['hello', 'world']`,rustCode:`trait Tokenizer {
    fn tokenize(&self, text: &str) -> Vec<String>;
}

struct WhitespaceTokenizer;
struct CharTokenizer;

impl Tokenizer for WhitespaceTokenizer {
    fn tokenize(&self, text: &str) -> Vec<String> {
        text.split_whitespace().map(String::from).collect()
    }
}

impl Tokenizer for CharTokenizer {
    fn tokenize(&self, text: &str) -> Vec<String> {
        text.chars().map(|c| c.to_string()).collect()
    }
}

struct Pipeline {
    tokenizer: Box<dyn Tokenizer>,  // swappable at runtime
}

impl Pipeline {
    fn new(tokenizer: Box<dyn Tokenizer>) -> Self {
        Pipeline { tokenizer }
    }

    fn run(&self, text: &str) -> Vec<String> {
        self.tokenizer.tokenize(text)
    }
}

fn main() {
    let pipe = Pipeline::new(Box::new(WhitespaceTokenizer));
    println!("{:?}", pipe.run("hello world"));
    // ["hello", "world"]
}`}),e.jsx(i,{title:"Plugin system with trait objects",difficulty:"medium",problem:`Create a trait Plugin with a method name(&self) -> &str and
execute(&self, input: &str) -> String.

Implement three plugins:
1. UpperPlugin — converts to uppercase
2. ReversePlugin — reverses the string
3. CountPlugin — returns the character count as a string

Create a PluginRunner struct that holds a Vec<Box<dyn Plugin>>.
Add a method run_all(&self, input: &str) that runs each plugin
and prints "PluginName: result" for each.`,solution:`trait Plugin {
    fn name(&self) -> &str;
    fn execute(&self, input: &str) -> String;
}

struct UpperPlugin;
impl Plugin for UpperPlugin {
    fn name(&self) -> &str { "Upper" }
    fn execute(&self, input: &str) -> String { input.to_uppercase() }
}

struct ReversePlugin;
impl Plugin for ReversePlugin {
    fn name(&self) -> &str { "Reverse" }
    fn execute(&self, input: &str) -> String {
        input.chars().rev().collect()
    }
}

struct CountPlugin;
impl Plugin for CountPlugin {
    fn name(&self) -> &str { "Count" }
    fn execute(&self, input: &str) -> String {
        format!("{} chars", input.len())
    }
}

struct PluginRunner {
    plugins: Vec<Box<dyn Plugin>>,
}

impl PluginRunner {
    fn new() -> Self {
        PluginRunner { plugins: Vec::new() }
    }

    fn add(&mut self, plugin: Box<dyn Plugin>) {
        self.plugins.push(plugin);
    }

    fn run_all(&self, input: &str) {
        for p in &self.plugins {
            println!("{}: {}", p.name(), p.execute(input));
        }
    }
}

fn main() {
    let mut runner = PluginRunner::new();
    runner.add(Box::new(UpperPlugin));
    runner.add(Box::new(ReversePlugin));
    runner.add(Box::new(CountPlugin));
    runner.run_all("Hello Rust");
    // Upper: HELLO RUST
    // Reverse: tsuR olleH
    // Count: 10 chars
}`})]})}const R=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"}));export{b as a,_ as b,w as c,v as d,S as e,T as f,C as g,k as h,P as i,R as j,j as s};
