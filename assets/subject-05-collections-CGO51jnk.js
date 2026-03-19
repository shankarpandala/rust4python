import{j as e}from"./vendor-Dh_dlHsl.js";import{C as r,P as n,N as t,a as s,E as i}from"./subject-01-getting-started-DoSDK0Fn.js";function o(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Vec<T> — Rust's Dynamic Array"}),e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"list"})," is the most-used collection: it holds any mix of types, grows dynamically, and supports slicing, iteration, and comprehensions. Rust's ",e.jsx("code",{children:"Vec<T>"})," fills the same role but with two key differences: every element must be the same type, and memory management is deterministic."]}),e.jsx(r,{title:"Vec Under the Hood",children:e.jsxs("p",{children:["A ",e.jsx("code",{children:"Vec<T>"})," is a contiguous, growable array stored on the heap. Internally it tracks three things: a pointer to the data, the current length, and the allocated capacity. When you push beyond capacity, it allocates a new, larger buffer and copies the data. This is the same strategy as Python's ",e.jsx("code",{children:"list"}),", but with no per-element boxing — elements are stored inline for maximum cache efficiency."]})}),e.jsx("h2",{children:"Creating and Using Vectors"}),e.jsx(n,{title:"List basics",description:"Creating, appending, and accessing elements in both languages.",pythonCode:`# Creating lists
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
mixed = [1, "hello", 3.14, None]`,rustCode:`fn main() {
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
}`}),e.jsx(t,{title:"Homogeneous types",type:"pythonista",children:e.jsxs("p",{children:["A ",e.jsx("code",{children:"Vec<i32>"})," can only hold ",e.jsx("code",{children:"i32"})," values. This constraint means elements are stored inline (no per-element heap allocation), making iteration dramatically faster. If you need mixed types, use an enum: ",e.jsx("code",{children:"Vec<Value>"})," where",e.jsx("code",{children:"Value"})," is an enum with variants for each type."]})}),e.jsx("h2",{children:"Common Operations"}),e.jsx(s,{language:"rust",title:"Essential Vec methods",code:`fn main() {
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
}`}),e.jsx("h2",{children:"Iteration Patterns"}),e.jsx(n,{title:"Iterating over vectors",description:"Python and Rust share similar iteration patterns, but Rust makes ownership explicit.",pythonCode:`nums = [10, 20, 30, 40, 50]

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
print(nums)  # [10, 20, 30, 40, 50]`,rustCode:`fn main() {
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
}`}),e.jsx(t,{title:"Three iteration modes",type:"warning",children:e.jsxs("p",{children:[e.jsx("code",{children:"&vec"})," or ",e.jsx("code",{children:"vec.iter()"}),": borrows elements (",e.jsx("code",{children:"&T"}),"), vec stays usable.",e.jsx("code",{children:"&mut vec"})," or ",e.jsx("code",{children:"vec.iter_mut()"}),": mutable borrows (",e.jsx("code",{children:"&mut T"}),"), can modify in place.",e.jsx("code",{children:"vec"})," (no ",e.jsx("code",{children:"&"}),") or ",e.jsx("code",{children:"vec.into_iter()"}),": moves elements out, consuming the vec. Choose carefully."]})}),e.jsx("h2",{children:"Vec and Slices"}),e.jsx(s,{language:"rust",title:"Slices: borrowed views into contiguous data",code:`fn sum_slice(data: &[i32]) -> i32 {
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
}`}),e.jsx(t,{title:"Prefer &[T] over &Vec<T>",type:"tip",children:e.jsxs("p",{children:["When a function only needs to read a sequence, accept",e.jsx("code",{children:"&[T]"})," instead of ",e.jsx("code",{children:"&Vec<T>"}),". Slices work with vectors, arrays, and sub-ranges. This is like accepting ",e.jsx("code",{children:"Sequence[T]"})," instead of ",e.jsx("code",{children:"list[T]"}),"in Python type hints — more general, equally fast."]})}),e.jsx(i,{title:"Implement a running average",difficulty:"medium",problem:`Write a function running_average(data: &[f64]) -> Vec<f64> that returns
a new vector where each element is the average of all elements up to and
including that index.

For input [1.0, 3.0, 5.0, 7.0], the output should be:
- Index 0: avg of [1.0] = 1.0
- Index 1: avg of [1.0, 3.0] = 2.0
- Index 2: avg of [1.0, 3.0, 5.0] = 3.0
- Index 3: avg of [1.0, 3.0, 5.0, 7.0] = 4.0

Result: [1.0, 2.0, 3.0, 4.0]

Bonus: can you do it in one pass without re-summing each time?`,solution:`fn running_average(data: &[f64]) -> Vec<f64> {
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
}`})]})}const m=Object.freeze(Object.defineProperty({__proto__:null,default:o},Symbol.toStringTag,{value:"Module"}));function a(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"HashMap & HashSet"}),e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"dict"})," and ",e.jsx("code",{children:"set"})," are among its most powerful and most-used data structures. Rust's",e.jsx("code",{children:"HashMap<K, V>"})," and ",e.jsx("code",{children:"HashSet<T>"}),"serve the same roles with similar performance characteristics, but with ownership-aware APIs that prevent common bugs."]}),e.jsx(r,{title:"HashMap Basics",children:e.jsxs("p",{children:[e.jsx("code",{children:"HashMap<K, V>"})," maps keys of type ",e.jsx("code",{children:"K"}),"to values of type ",e.jsx("code",{children:"V"}),". Keys must implement",e.jsx("code",{children:"Hash"})," and ",e.jsx("code",{children:"Eq"}),". Unlike Python dicts, which have been insertion-ordered since Python 3.7, Rust's HashMap has no guaranteed order. Use ",e.jsx("code",{children:"BTreeMap"})," if you need sorted keys."]})}),e.jsx("h2",{children:"Dict vs HashMap"}),e.jsx(n,{title:"Creating and using dictionaries",description:"Python dicts and Rust HashMaps share similar APIs with different syntax.",pythonCode:`# Creating
scores = {"Alice": 95, "Bob": 87, "Charlie": 92}
empty = {}

# Access
alice = scores["Alice"]           # 95 (KeyError if missing)
bob = scores.get("Bob")           # 87 (None if missing)
unknown = scores.get("Dave", 0)   # 0 (default)

# Insert / Update
scores["Dave"] = 88
scores["Alice"] = 97  # overwrite

# Delete
del scores["Charlie"]
removed = scores.pop("Bob", None)

# Iteration
for name, score in scores.items():
    print(f"{name}: {score}")

# Length and membership
print(len(scores))
print("Alice" in scores)  # True`,rustCode:`use std::collections::HashMap;

fn main() {
    // Creating
    let mut scores = HashMap::from([
        ("Alice", 95),
        ("Bob", 87),
        ("Charlie", 92),
    ]);
    let empty: HashMap<String, i32> = HashMap::new();

    // Access
    let alice = scores["Alice"];            // 95 (panics if missing!)
    let bob = scores.get("Bob");            // Some(&87)
    let unknown = scores.get("Dave").copied().unwrap_or(0);  // 0

    // Insert / Update
    scores.insert("Dave", 88);
    scores.insert("Alice", 97);  // overwrite

    // Delete
    scores.remove("Charlie");
    let removed = scores.remove("Bob");     // Some(87)

    // Iteration
    for (name, score) in &scores {
        println!("{}: {}", name, score);
    }

    // Length and membership
    println!("{}", scores.len());
    println!("{}", scores.contains_key("Alice"));  // true
}`}),e.jsx(t,{title:"get() returns a reference",type:"pythonista",children:e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"dict.get()"})," returns the value directly. Rust's ",e.jsx("code",{children:"HashMap::get()"})," returns",e.jsx("code",{children:"Option<&V>"})," — a reference to the value. This avoids copying large values. Use ",e.jsx("code",{children:".copied()"})," for small Copy types or ",e.jsx("code",{children:".cloned()"})," for Clone types when you need an owned value."]})}),e.jsx("h2",{children:"The Entry API — Rust's Superpower"}),e.jsx(n,{title:"Counting and default values",description:"Python uses defaultdict or setdefault. Rust's entry API is more explicit and more powerful.",pythonCode:`from collections import defaultdict, Counter

words = ["hello", "world", "hello", "rust", "world", "hello"]

# Counter (most Pythonic)
counts = Counter(words)
print(counts)  # Counter({'hello': 3, 'world': 2, 'rust': 1})

# defaultdict approach
counts = defaultdict(int)
for word in words:
    counts[word] += 1

# setdefault for nested structures
groups = {}
data = [("fruit", "apple"), ("fruit", "banana"), ("veg", "carrot")]
for category, item in data:
    groups.setdefault(category, []).append(item)`,rustCode:`use std::collections::HashMap;

fn main() {
    let words = vec!["hello", "world", "hello", "rust", "world", "hello"];

    // Entry API for counting
    let mut counts = HashMap::new();
    for word in &words {
        *counts.entry(word).or_insert(0) += 1;
    }
    println!("{:?}", counts);
    // {"hello": 3, "world": 2, "rust": 1}

    // Entry API for grouped collections
    let data = vec![("fruit", "apple"), ("fruit", "banana"), ("veg", "carrot")];
    let mut groups: HashMap<&str, Vec<&str>> = HashMap::new();
    for (category, item) in &data {
        groups.entry(category).or_insert_with(Vec::new).push(item);
    }
    println!("{:?}", groups);
    // {"fruit": ["apple", "banana"], "veg": ["carrot"]}

    // or_default() — uses Default trait
    let mut word_lengths: HashMap<&str, Vec<usize>> = HashMap::new();
    for word in &words {
        word_lengths.entry(word).or_default().push(word.len());
    }
}`}),e.jsx(t,{title:"Entry prevents double lookups",type:"tip",children:e.jsxs("p",{children:["In Python, ",e.jsx("code",{children:"if key in d: d[key] += 1 else: d[key] = 1"}),"does two hash lookups. Rust's ",e.jsx("code",{children:"entry()"})," does one lookup and returns a handle that lets you read or insert. This is both faster and more ergonomic. The entry API is one of Rust's most elegant standard library designs."]})}),e.jsx("h2",{children:"HashSet"}),e.jsx(n,{title:"Set operations",description:"Python sets and Rust HashSets share the same mathematical operations.",pythonCode:`a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

# Set operations
union = a | b            # {1,2,3,4,5,6,7,8}
inter = a & b            # {4, 5}
diff = a - b             # {1, 2, 3}
sym_diff = a ^ b         # {1, 2, 3, 6, 7, 8}

# Membership
print(3 in a)            # True

# Subset / superset
print({1, 2} <= a)       # True (subset)
print(a >= {1, 2})       # True (superset)`,rustCode:`use std::collections::HashSet;

fn main() {
    let a: HashSet<i32> = [1, 2, 3, 4, 5].into();
    let b: HashSet<i32> = [4, 5, 6, 7, 8].into();

    // Set operations (return iterators)
    let union: HashSet<_> = a.union(&b).copied().collect();
    let inter: HashSet<_> = a.intersection(&b).copied().collect();
    let diff: HashSet<_> = a.difference(&b).copied().collect();
    let sym: HashSet<_> = a.symmetric_difference(&b).copied().collect();

    // Or use operator syntax (consumes/borrows):
    let union2: HashSet<_> = &a | &b;
    let inter2: HashSet<_> = &a & &b;

    // Membership
    println!("{}", a.contains(&3));  // true

    // Subset / superset
    let small: HashSet<i32> = [1, 2].into();
    println!("{}", small.is_subset(&a));   // true
    println!("{}", a.is_superset(&small)); // true
}`}),e.jsx("h2",{children:"Building HashMaps from Iterators"}),e.jsx(s,{language:"rust",title:"Functional HashMap construction",code:`use std::collections::HashMap;

fn main() {
    // From iterator of tuples (like Python's dict())
    let scores: HashMap<&str, i32> = vec![
        ("Alice", 95), ("Bob", 87), ("Charlie", 92)
    ].into_iter().collect();

    // Zip two iterators (like Python's dict(zip(keys, values)))
    let keys = vec!["a", "b", "c"];
    let values = vec![1, 2, 3];
    let map: HashMap<_, _> = keys.into_iter().zip(values).collect();
    println!("{:?}", map);  // {"a": 1, "b": 2, "c": 3}

    // Group by with fold
    let words = vec!["hello", "world", "hi", "hay", "woo"];
    let by_first_char: HashMap<char, Vec<&str>> = words
        .iter()
        .fold(HashMap::new(), |mut acc, &word| {
            let first = word.chars().next().unwrap();
            acc.entry(first).or_default().push(word);
            acc
        });
    println!("{:?}", by_first_char);
    // {'h': ["hello", "hi", "hay"], 'w': ["world", "woo"]}
}`}),e.jsx(t,{title:"Ownership and keys",type:"warning",children:e.jsxs("p",{children:["HashMap keys must be owned (or references with appropriate lifetimes). You cannot use ",e.jsx("code",{children:"&str"})," as a key if the underlying string might be dropped. When in doubt, use",e.jsx("code",{children:"String"})," keys. For performance, consider",e.jsx("code",{children:"&str"})," keys with explicit lifetime annotations when the data lives long enough."]})}),e.jsx(i,{title:"Word frequency analyzer",difficulty:"medium",problem:`Write a function word_freq(text: &str) -> Vec<(String, usize)> that:
1. Splits text into words (split_whitespace)
2. Converts to lowercase
3. Counts occurrences using HashMap
4. Returns a Vec of (word, count) pairs sorted by count (descending)
5. For equal counts, sort alphabetically

Test with: "the cat sat on the mat the cat"`,solution:`use std::collections::HashMap;

fn word_freq(text: &str) -> Vec<(String, usize)> {
    let mut counts: HashMap<String, usize> = HashMap::new();

    for word in text.split_whitespace() {
        let lower = word.to_lowercase();
        *counts.entry(lower).or_insert(0) += 1;
    }

    let mut result: Vec<(String, usize)> = counts.into_iter().collect();

    // Sort by count descending, then alphabetically
    result.sort_by(|a, b| {
        b.1.cmp(&a.1)               // count descending
            .then(a.0.cmp(&b.0))     // then alphabetical
    });

    result
}

fn main() {
    let freq = word_freq("the cat sat on the mat the cat");
    for (word, count) in &freq {
        println!("{}: {}", word, count);
    }
    // the: 3
    // cat: 2
    // mat: 1
    // on: 1
    // sat: 1
}`})]})}const f=Object.freeze(Object.defineProperty({__proto__:null,default:a},Symbol.toStringTag,{value:"Module"}));function l(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Iterator Trait & next()"}),e.jsxs("p",{children:["Python's iterator protocol (",e.jsx("code",{children:"__iter__"})," and",e.jsx("code",{children:"__next__"}),") and generators are central to the language. Rust's ",e.jsx("code",{children:"Iterator"})," trait serves the same purpose, but with zero-cost abstractions: iterator chains compile down to tight loops with no heap allocation and no virtual dispatch."]}),e.jsx(r,{title:"The Iterator Trait",children:e.jsxs("p",{children:["Rust's ",e.jsx("code",{children:"Iterator"})," trait requires implementing a single method: ",e.jsx("code",{children:"next(&mut self) -> Option<Self::Item>"}),". Return ",e.jsx("code",{children:"Some(value)"})," for each element, and ",e.jsx("code",{children:"None"}),"when the iterator is exhausted. That is it — from this one method, you get dozens of adapter methods (map, filter, fold, zip, etc.) for free."]})}),e.jsx("h2",{children:"Python Iterators vs Rust Iterators"}),e.jsx(n,{title:"The iterator protocol",description:"Both languages use the same core concept: a next() method that signals exhaustion.",pythonCode:`class Countdown:
    def __init__(self, start: int):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self) -> int:
        if self.current <= 0:
            raise StopIteration
        val = self.current
        self.current -= 1
        return val

# Usage
for n in Countdown(5):
    print(n)  # 5, 4, 3, 2, 1

# Manual iteration
it = iter(Countdown(3))
print(next(it))  # 3
print(next(it))  # 2
print(next(it))  # 1
# next(it)       # raises StopIteration`,rustCode:`struct Countdown {
    current: u32,
}

impl Countdown {
    fn new(start: u32) -> Self {
        Countdown { current: start }
    }
}

impl Iterator for Countdown {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        if self.current == 0 {
            None
        } else {
            let val = self.current;
            self.current -= 1;
            Some(val)
        }
    }
}

fn main() {
    // Usage
    for n in Countdown::new(5) {
        println!("{}", n);  // 5, 4, 3, 2, 1
    }

    // Manual iteration
    let mut it = Countdown::new(3);
    println!("{:?}", it.next());  // Some(3)
    println!("{:?}", it.next());  // Some(2)
    println!("{:?}", it.next());  // Some(1)
    println!("{:?}", it.next());  // None
}`}),e.jsx(t,{title:"Option vs StopIteration",type:"pythonista",children:e.jsxs("p",{children:["Python uses an exception (",e.jsx("code",{children:"StopIteration"}),") to signal the end of iteration — a control flow mechanism disguised as an error. Rust uses ",e.jsx("code",{children:"Option"}),": ",e.jsx("code",{children:"Some(value)"}),'means "here is the next element," ',e.jsx("code",{children:"None"}),' means "done." No exception overhead, no hidden control flow.']})}),e.jsx("h2",{children:"Built-in Iterators"}),e.jsx(s,{language:"rust",title:"Sources of iterators in the standard library",code:`fn main() {
    // Ranges
    let range_iter = 0..5;           // 0, 1, 2, 3, 4
    let inclusive = 0..=5;           // 0, 1, 2, 3, 4, 5

    // Collections
    let v = vec![10, 20, 30];
    let vec_iter = v.iter();         // borrows: &T
    // v.iter_mut()                  // mutable borrows: &mut T
    // v.into_iter()                 // owned values: T (consumes vec)

    // Strings
    let char_iter = "hello".chars(); // 'h', 'e', 'l', 'l', 'o'
    let byte_iter = "hello".bytes(); // 104, 101, 108, 108, 111

    // Splitting
    let split_iter = "a,b,c".split(',');  // "a", "b", "c"
    let lines_iter = "line1
line2".lines();

    // Repeating
    let repeat = std::iter::repeat(42);   // infinite: 42, 42, 42, ...
    let once = std::iter::once(99);        // single element

    // Consuming into a collection
    let collected: Vec<i32> = (1..=5).collect();
    println!("{:?}", collected);  // [1, 2, 3, 4, 5]
}`}),e.jsx("h2",{children:"Laziness: Iterators Don't Run Until Consumed"}),e.jsx(n,{title:"Lazy evaluation",description:"Both Python generators and Rust iterators are lazy — they produce values on demand.",pythonCode:`# Python generators are lazy
def expensive():
    print("Computing...")
    for i in range(1_000_000):
        yield i * 2

# Nothing happens yet
gen = expensive()

# Values computed on demand
first = next(gen)     # prints "Computing...", returns 0
second = next(gen)    # returns 2 (no print)

# Take first 3 — only computes 3 values
from itertools import islice
first_3 = list(islice(expensive(), 3))
# prints "Computing...", returns [0, 2, 4]`,rustCode:`fn main() {
    // Rust iterators are lazy — no work until consumed
    let iter = (0..1_000_000)
        .map(|i| {
            // This closure is NOT called yet
            i * 2
        })
        .filter(|&x| x > 100);

    // Nothing has been computed!

    // .take(3) limits to first 3 matches
    let first_3: Vec<i32> = iter.take(3).collect();
    println!("{:?}", first_3);  // [102, 104, 106]
    // Only computed 54 elements (0..53), not 1 million!

    // Consuming adaptors trigger computation:
    // .collect()  — gather into a collection
    // .sum()      — add all values
    // .count()    — count elements
    // .for_each() — run a side effect
    // .any() / .all() — boolean checks (short-circuit)

    let sum: i32 = (1..=100).sum();
    println!("Sum 1..100: {}", sum);  // 5050
}`}),e.jsx(t,{title:"Zero-cost abstraction",type:"note",children:e.jsxs("p",{children:["Rust's iterator chains compile to the same machine code as a hand-written loop. The compiler sees through ",e.jsx("code",{children:".map().filter().take()"}),"and fuses them into a single loop with no intermediate allocations. This is fundamentally different from Python, where each generator has function-call overhead."]})}),e.jsx("h2",{children:"Collecting into Different Types"}),e.jsx(s,{language:"rust",title:"collect() is polymorphic",code:`use std::collections::{HashMap, HashSet, BTreeSet, VecDeque};

fn main() {
    let data = vec![3, 1, 4, 1, 5, 9, 2, 6, 5, 3];

    // Into Vec
    let vec: Vec<i32> = data.iter().copied().collect();

    // Into HashSet (deduplicates)
    let set: HashSet<i32> = data.iter().copied().collect();
    println!("Unique: {:?}", set);  // {1, 2, 3, 4, 5, 6, 9}

    // Into BTreeSet (sorted + deduped)
    let sorted: BTreeSet<i32> = data.iter().copied().collect();
    println!("Sorted: {:?}", sorted);  // {1, 2, 3, 4, 5, 6, 9}

    // Into String
    let s: String = ['H', 'e', 'l', 'l', 'o'].iter().collect();
    println!("{}", s);  // Hello

    // Into HashMap from tuples
    let map: HashMap<&str, i32> = vec![("a", 1), ("b", 2)]
        .into_iter()
        .collect();

    // Into Result<Vec<_>, _> — fails on first error
    let results: Vec<Result<i32, _>> = vec![
        "1".parse::<i32>(), "2".parse(), "oops".parse()
    ];
    let collected: Result<Vec<i32>, _> = results.into_iter().collect();
    println!("{:?}", collected);  // Err(invalid digit)
}`}),e.jsx(i,{title:"Fibonacci iterator",difficulty:"medium",problem:`Implement a Fibonacci iterator that yields the Fibonacci sequence:
0, 1, 1, 2, 3, 5, 8, 13, 21, ...

Create a struct Fibonacci with two fields (current and next pair).
Implement Iterator with Item = u64.

Then use your iterator to:
1. Print the first 10 Fibonacci numbers
2. Find the first Fibonacci number greater than 1000
3. Sum the first 20 Fibonacci numbers`,solution:`struct Fibonacci {
    a: u64,
    b: u64,
}

impl Fibonacci {
    fn new() -> Self {
        Fibonacci { a: 0, b: 1 }
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let current = self.a;
        let new_next = self.a + self.b;
        self.a = self.b;
        self.b = new_next;
        Some(current)  // infinite iterator — always returns Some
    }
}

fn main() {
    // First 10 Fibonacci numbers
    let first_10: Vec<u64> = Fibonacci::new().take(10).collect();
    println!("First 10: {:?}", first_10);
    // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

    // First Fibonacci number > 1000
    let big = Fibonacci::new().find(|&n| n > 1000);
    println!("First > 1000: {:?}", big);
    // Some(1597)

    // Sum of first 20
    let sum: u64 = Fibonacci::new().take(20).sum();
    println!("Sum of first 20: {}", sum);
    // 10945
}`})]})}const x=Object.freeze(Object.defineProperty({__proto__:null,default:l},Symbol.toStringTag,{value:"Module"}));function c(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Adapters: map, filter, fold, zip"}),e.jsxs("p",{children:["Python has ",e.jsx("code",{children:"map()"}),", ",e.jsx("code",{children:"filter()"}),",",e.jsx("code",{children:"zip()"}),", and ",e.jsx("code",{children:"functools.reduce()"})," as built-in or standard library functions. Rust has the same operations as methods on the ",e.jsx("code",{children:"Iterator"})," trait — but they compile to zero-overhead loops and chain beautifully."]}),e.jsxs(r,{title:"Adapters vs Consumers",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Adapters"})," transform an iterator into another iterator (lazy): ",e.jsx("code",{children:"map"}),", ",e.jsx("code",{children:"filter"}),",",e.jsx("code",{children:"take"}),", ",e.jsx("code",{children:"skip"}),", ",e.jsx("code",{children:"zip"}),",",e.jsx("code",{children:"enumerate"}),", ",e.jsx("code",{children:"chain"}),", ",e.jsx("code",{children:"flatten"}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Consumers"})," drive the iterator to produce a result:",e.jsx("code",{children:"collect"}),", ",e.jsx("code",{children:"sum"}),", ",e.jsx("code",{children:"count"}),",",e.jsx("code",{children:"fold"}),", ",e.jsx("code",{children:"any"}),", ",e.jsx("code",{children:"all"}),",",e.jsx("code",{children:"find"}),", ",e.jsx("code",{children:"for_each"}),"."]}),e.jsx("p",{children:"Nothing happens until a consumer is called."})]}),e.jsx("h2",{children:"map and filter"}),e.jsx(n,{title:"Transform and filter",description:"Python uses list comprehensions or builtins. Rust uses method chains.",pythonCode:`numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# List comprehension (most Pythonic)
evens_doubled = [n * 2 for n in numbers if n % 2 == 0]
print(evens_doubled)  # [4, 8, 12, 16, 20]

# map + filter (less common in Python)
result = list(map(lambda n: n * 2,
                  filter(lambda n: n % 2 == 0, numbers)))

# Chaining with generators
result = (
    n * 2
    for n in numbers
    if n % 2 == 0
)
print(list(result))  # [4, 8, 12, 16, 20]`,rustCode:`fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Method chain (idiomatic Rust)
    let evens_doubled: Vec<i32> = numbers.iter()
        .filter(|&&n| n % 2 == 0)
        .map(|&n| n * 2)
        .collect();
    println!("{:?}", evens_doubled);  // [4, 8, 12, 16, 20]

    // filter_map: filter + map in one step
    let parsed: Vec<i32> = vec!["1", "abc", "3", "def", "5"]
        .iter()
        .filter_map(|s| s.parse().ok())
        .collect();
    println!("{:?}", parsed);  // [1, 3, 5]

    // flat_map: map then flatten (like Python's nested comprehension)
    let nested = vec![vec![1, 2], vec![3, 4], vec![5]];
    let flat: Vec<i32> = nested.iter()
        .flat_map(|v| v.iter().copied())
        .collect();
    println!("{:?}", flat);  // [1, 2, 3, 4, 5]
}`}),e.jsx(t,{title:"filter_map is your friend",type:"tip",children:e.jsxs("p",{children:[e.jsx("code",{children:"filter_map"})," combines filter and map into a single step: the closure returns ",e.jsx("code",{children:"Option<T>"}),".",e.jsx("code",{children:"Some(value)"})," keeps the element (mapped),",e.jsx("code",{children:"None"})," filters it out. This is extremely useful for parsing and data cleaning where some inputs might be invalid."]})}),e.jsx("h2",{children:"fold (reduce) and scan"}),e.jsx(n,{title:"Reducing to a single value",description:"Python uses functools.reduce or sum/min/max. Rust uses fold as the general case.",pythonCode:`from functools import reduce

numbers = [1, 2, 3, 4, 5]

# Built-in reductions
total = sum(numbers)              # 15
largest = max(numbers)            # 5
product = reduce(lambda a, b: a * b, numbers)  # 120

# Accumulating with reduce
# Running total: [1, 3, 6, 10, 15]
from itertools import accumulate
running = list(accumulate(numbers))
print(running)  # [1, 3, 6, 10, 15]`,rustCode:`fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // Built-in consumers
    let total: i32 = numbers.iter().sum();           // 15
    let largest = numbers.iter().max();               // Some(&5)
    let product: i32 = numbers.iter().product();      // 120

    // fold: general reduction (like functools.reduce with init)
    let product2 = numbers.iter()
        .fold(1, |acc, &x| acc * x);                // 120

    // fold with a different accumulator type
    let csv = numbers.iter()
        .fold(String::new(), |acc, &x| {
            if acc.is_empty() {
                x.to_string()
            } else {
                format!("{},{}", acc, x)
            }
        });
    println!("{}", csv);  // "1,2,3,4,5"

    // scan: like fold but yields intermediate results
    let running: Vec<i32> = numbers.iter()
        .scan(0, |state, &x| {
            *state += x;
            Some(*state)
        })
        .collect();
    println!("{:?}", running);  // [1, 3, 6, 10, 15]
}`}),e.jsx("h2",{children:"zip, enumerate, chain"}),e.jsx(n,{title:"Combining iterators",description:"Python and Rust have nearly identical zip, enumerate, and chain operations.",pythonCode:`names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 92]

# zip
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# enumerate
for i, name in enumerate(names):
    print(f"{i}: {name}")

# chain (itertools)
from itertools import chain
a = [1, 2, 3]
b = [4, 5, 6]
all_items = list(chain(a, b))  # [1, 2, 3, 4, 5, 6]

# zip_longest (itertools)
from itertools import zip_longest
for a, b in zip_longest([1, 2], [10, 20, 30], fillvalue=0):
    print(a, b)  # (1,10) (2,20) (0,30)`,rustCode:`fn main() {
    let names = vec!["Alice", "Bob", "Charlie"];
    let scores = vec![95, 87, 92];

    // zip
    for (name, score) in names.iter().zip(scores.iter()) {
        println!("{}: {}", name, score);
    }

    // enumerate
    for (i, name) in names.iter().enumerate() {
        println!("{}: {}", i, name);
    }

    // chain
    let a = vec![1, 2, 3];
    let b = vec![4, 5, 6];
    let all: Vec<i32> = a.iter().chain(b.iter()).copied().collect();
    println!("{:?}", all);  // [1, 2, 3, 4, 5, 6]

    // Unzip: split a iterator of pairs into two collections
    let pairs = vec![(1, "a"), (2, "b"), (3, "c")];
    let (nums, letters): (Vec<i32>, Vec<&str>) =
        pairs.into_iter().unzip();
    println!("{:?} {:?}", nums, letters);
    // [1, 2, 3] ["a", "b", "c"]
}`}),e.jsx("h2",{children:"Short-Circuiting: any, all, find, position"}),e.jsx(s,{language:"rust",title:"Stop early when you have the answer",code:`fn main() {
    let data = vec![2, 4, 6, 7, 8, 10];

    // any: is there at least one odd number?
    let has_odd = data.iter().any(|&x| x % 2 != 0);
    println!("Has odd: {}", has_odd);  // true (stops at 7)

    // all: are all numbers positive?
    let all_positive = data.iter().all(|&x| x > 0);
    println!("All positive: {}", all_positive);  // true

    // find: first element matching a predicate
    let first_odd = data.iter().find(|&&x| x % 2 != 0);
    println!("First odd: {:?}", first_odd);  // Some(&7)

    // position: index of first match
    let odd_idx = data.iter().position(|&x| x % 2 != 0);
    println!("Odd at index: {:?}", odd_idx);  // Some(3)

    // These short-circuit: they stop iterating as soon as
    // the answer is known, just like Python's any()/all().

    // Practical: check if a large dataset has any NaN values
    let measurements = vec![1.0, 2.0, f64::NAN, 4.0];
    let has_nan = measurements.iter().any(|x| x.is_nan());
    println!("Has NaN: {}", has_nan);  // true
}`}),e.jsx(t,{title:"Chaining is free",type:"note",children:e.jsxs("p",{children:["A chain like ",e.jsx("code",{children:".filter().map().take().collect()"}),` does not create intermediate vectors. The compiler fuses the entire chain into a single loop. Each element flows through all adaptors before the next element is processed. This is called "internal iteration" and is one of Rust's key performance advantages.`]})}),e.jsx("h2",{children:"Real-World Example: Data Processing Pipeline"}),e.jsx(s,{language:"rust",title:"Processing CSV-like data with iterators",code:`fn main() {
    let csv_data = "name,age,score
Alice,30,95.5
Bob,25,87.3
Charlie,35,92.1
Diana,28,88.9
Eve,32,91.0";

    // Parse, filter, and aggregate in one pipeline
    let high_scorers: Vec<(&str, f64)> = csv_data
        .lines()
        .skip(1)                          // skip header
        .filter_map(|line| {
            let fields: Vec<&str> = line.split(',').collect();
            let name = *fields.first()?;
            let score: f64 = fields.get(2)?.parse().ok()?;
            Some((name, score))
        })
        .filter(|&(_, score)| score >= 90.0)   // high scorers only
        .collect();

    println!("High scorers: {:?}", high_scorers);
    // [("Alice", 95.5), ("Charlie", 92.1), ("Eve", 91.0)]

    // Average score of high scorers
    let (sum, count) = high_scorers.iter()
        .fold((0.0, 0), |(sum, count), &(_, score)| {
            (sum + score, count + 1)
        });

    if count > 0 {
        println!("Average: {:.1}", sum / count as f64);
        // Average: 92.9
    }
}`}),e.jsx(i,{title:"Iterator chain challenge",difficulty:"hard",problem:`Given a Vec<String> of sentences, write a single iterator chain that:
1. Splits each sentence into words
2. Converts all words to lowercase
3. Filters out words shorter than 4 characters
4. Removes duplicate words (hint: collect to HashSet, then back)
5. Sorts the result alphabetically
6. Returns a Vec<String>

Test with:
vec!["The Quick Brown Fox", "jumps Over The Lazy Dog", "the fox is quick"]`,solution:`use std::collections::HashSet;

fn unique_long_words(sentences: &[String]) -> Vec<String> {
    let mut words: Vec<String> = sentences.iter()
        .flat_map(|s| s.split_whitespace())  // flatten all words
        .map(|w| w.to_lowercase())            // lowercase
        .filter(|w| w.len() >= 4)             // min 4 chars
        .collect::<HashSet<String>>()          // deduplicate
        .into_iter()
        .collect();

    words.sort();  // alphabetical
    words
}

fn main() {
    let sentences = vec![
        "The Quick Brown Fox".to_string(),
        "jumps Over The Lazy Dog".to_string(),
        "the fox is quick".to_string(),
    ];

    let result = unique_long_words(&sentences);
    println!("{:?}", result);
    // ["brown", "jumps", "lazy", "over", "quick"]
}`})]})}const g=Object.freeze(Object.defineProperty({__proto__:null,default:c},Symbol.toStringTag,{value:"Module"}));function d(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Closures: Fn, FnMut, FnOnce"}),e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"lambda"})," and nested functions capture variables from their enclosing scope freely. Rust closures do the same, but the compiler tracks ",e.jsx("em",{children:"how"})," they capture variables — by reference, by mutable reference, or by value — and encodes this in the type system with three traits: ",e.jsx("code",{children:"Fn"}),",",e.jsx("code",{children:"FnMut"}),", and ",e.jsx("code",{children:"FnOnce"}),"."]}),e.jsxs(r,{title:"The Three Closure Traits",children:[e.jsx("p",{children:"Every Rust closure implements one or more of these traits, determined automatically by how it uses captured variables:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Fn"})," — captures by shared reference (",e.jsx("code",{children:"&T"}),"). Can be called multiple times. Read-only access."]}),e.jsxs("li",{children:[e.jsx("code",{children:"FnMut"})," — captures by mutable reference (",e.jsx("code",{children:"&mut T"}),"). Can be called multiple times. Can modify captured state."]}),e.jsxs("li",{children:[e.jsx("code",{children:"FnOnce"})," — captures by value (moves). Can be called only once. Consumes captured values."]})]}),e.jsxs("p",{children:[e.jsx("code",{children:"Fn"})," is a subtrait of ",e.jsx("code",{children:"FnMut"}),", which is a subtrait of ",e.jsx("code",{children:"FnOnce"}),". So an ",e.jsx("code",{children:"Fn"})," closure can be used anywhere a ",e.jsx("code",{children:"FnMut"})," or ",e.jsx("code",{children:"FnOnce"}),"is expected."]})]}),e.jsx("h2",{children:"Python Closures vs Rust Closures"}),e.jsx(n,{title:"Capturing variables",description:"Python closures capture by reference (with caveats). Rust makes the capture mode explicit.",pythonCode:`# Python: closures capture the variable binding
def make_counter():
    count = 0
    def increment():
        nonlocal count  # required to mutate!
        count += 1
        return count
    return increment

counter = make_counter()
print(counter())  # 1
print(counter())  # 2

# Lambda (limited to expressions)
double = lambda x: x * 2
print(double(5))  # 10

# Common gotcha: late binding
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])  # [2, 2, 2] — NOT [0, 1, 2]!`,rustCode:`fn main() {
    // Fn: captures by shared reference (read-only)
    let name = String::from("Alice");
    let greet = || println!("Hello, {}", name);
    greet();  // can call multiple times
    greet();
    println!("{}", name);  // name still usable

    // FnMut: captures by mutable reference
    let mut count = 0;
    let mut increment = || {
        count += 1;  // mutates captured variable
        count
    };
    println!("{}", increment());  // 1
    println!("{}", increment());  // 2

    // FnOnce: captures by value (moves)
    let data = vec![1, 2, 3];
    let consume = move || {
        println!("Data: {:?}", data);
        drop(data);  // consumes data
    };
    consume();
    // consume();  // ERROR: can't call again, data was moved
    // println!("{:?}", data);  // ERROR: data was moved
}`}),e.jsx(t,{title:"No late binding gotcha",type:"pythonista",children:e.jsxs("p",{children:[`Python's infamous "closures capture variables, not values" bug (the loop variable gotcha) cannot happen in Rust. Each closure captures a snapshot of the value (with `,e.jsx("code",{children:"move"}),") or a reference to a specific memory location. The compiler enforces that references remain valid."]})}),e.jsx("h2",{children:"Closures as Function Parameters"}),e.jsx(s,{language:"rust",title:"Accepting closures with trait bounds",code:`// Fn: closure only reads captured state
fn apply_twice<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(f(x))
}

// FnMut: closure may modify captured state
fn call_n_times<F: FnMut()>(mut f: F, n: usize) {
    for _ in 0..n {
        f();
    }
}

// FnOnce: closure may consume captured state (called at most once)
fn consume_and_report<F: FnOnce() -> String>(f: F) {
    let result = f();
    println!("Result: {}", result);
}

fn main() {
    // Fn
    let double = |x| x * 2;
    println!("{}", apply_twice(double, 3));  // 12

    // FnMut
    let mut total = 0;
    call_n_times(|| { total += 1; }, 5);
    println!("Total: {}", total);  // 5

    // FnOnce
    let name = String::from("Alice");
    consume_and_report(move || {
        format!("Hello, {}!", name)  // moves name into the closure
    });
}`}),e.jsxs(t,{title:"Which trait to accept?",type:"tip",children:[e.jsx("p",{children:"When writing a function that accepts a closure, choose the least restrictive trait that works:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Accept ",e.jsx("code",{children:"Fn"})," when you call the closure multiple times and it should not have side effects."]}),e.jsxs("li",{children:["Accept ",e.jsx("code",{children:"FnMut"})," when the closure needs to modify state (most common)."]}),e.jsxs("li",{children:["Accept ",e.jsx("code",{children:"FnOnce"})," when you call it at most once (most permissive — accepts any closure)."]})]})]}),e.jsx("h2",{children:"move Closures"}),e.jsx(s,{language:"rust",title:"Forcing ownership transfer with move",code:`use std::thread;

fn main() {
    // Without move: closure borrows the variable
    let x = 42;
    let print_x = || println!("{}", x);  // borrows x
    print_x();
    println!("x is still here: {}", x);

    // With move: closure takes ownership
    let data = vec![1, 2, 3];
    let handle = thread::spawn(move || {
        // data is MOVED into the thread's closure
        // This is required because the thread might outlive
        // the current scope
        println!("Thread got: {:?}", data);
    });
    // println!("{:?}", data);  // ERROR: data was moved
    handle.join().unwrap();

    // move with Copy types: the value is copied, not moved
    let count = 42;  // i32 is Copy
    let closure = move || println!("{}", count);
    closure();
    println!("count still here: {}", count);  // OK! i32 was copied
}`}),e.jsx("h2",{children:"Returning Closures"}),e.jsx(n,{title:"Factory functions",description:"Both languages can return closures, but Rust requires explicit syntax.",pythonCode:`def make_adder(n: int):
    def adder(x: int) -> int:
        return x + n
    return adder

add5 = make_adder(5)
add10 = make_adder(10)
print(add5(3))   # 8
print(add10(3))  # 13

def make_multiplier(factor: float):
    return lambda x: x * factor

double = make_multiplier(2.0)
print(double(7))  # 14.0`,rustCode:`// Return closures with impl Fn
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn make_multiplier(factor: f64) -> impl Fn(f64) -> f64 {
    move |x| x * factor
}

fn main() {
    let add5 = make_adder(5);
    let add10 = make_adder(10);
    println!("{}", add5(3));   // 8
    println!("{}", add10(3));  // 13

    let double = make_multiplier(2.0);
    println!("{}", double(7.0));  // 14.0
}

// Note: impl Fn works when returning a single closure type.
// For multiple possible closure types, use Box<dyn Fn(...)>:
fn choose_op(add: bool) -> Box<dyn Fn(i32) -> i32> {
    if add {
        Box::new(|x| x + 1)
    } else {
        Box::new(|x| x * 2)
    }
}`}),e.jsx(i,{title:"Build a pipeline combinator",difficulty:"hard",problem:`Write a function pipeline that takes a Vec of closures (each taking f64 and
returning f64) and returns a single closure that applies them all in sequence.

Example:
let ops: Vec<Box<dyn Fn(f64) -> f64>> = vec![
    Box::new(|x| x + 1.0),     // add 1
    Box::new(|x| x * 2.0),     // multiply by 2
    Box::new(|x| x - 3.0),     // subtract 3
];
let combined = pipeline(ops);
println!("{}", combined(10.0));  // ((10 + 1) * 2) - 3 = 19.0

Hint: use fold to chain the closures.`,solution:`fn pipeline(ops: Vec<Box<dyn Fn(f64) -> f64>>) -> Box<dyn Fn(f64) -> f64> {
    Box::new(move |x| {
        ops.iter().fold(x, |acc, f| f(acc))
    })
}

fn main() {
    let ops: Vec<Box<dyn Fn(f64) -> f64>> = vec![
        Box::new(|x| x + 1.0),     // add 1
        Box::new(|x| x * 2.0),     // multiply by 2
        Box::new(|x| x - 3.0),     // subtract 3
    ];

    let combined = pipeline(ops);
    println!("{}", combined(10.0));  // 19.0
    println!("{}", combined(0.0));   // -1.0
    println!("{}", combined(5.0));   // 9.0

    // Data processing pipeline
    let normalize: Vec<Box<dyn Fn(f64) -> f64>> = vec![
        Box::new(|x| x - 50.0),     // center around 0
        Box::new(|x| x / 25.0),     // scale to [-1, 1] range
        Box::new(|x| x.max(-1.0).min(1.0)),  // clamp
    ];

    let norm = pipeline(normalize);
    println!("{}", norm(75.0));   // 1.0
    println!("{}", norm(50.0));   // 0.0
    println!("{}", norm(25.0));   // -1.0
}`})]})}const y=Object.freeze(Object.defineProperty({__proto__:null,default:d},Symbol.toStringTag,{value:"Module"}));function u(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Method Chaining (Polars-style)"}),e.jsxs("p",{children:["If you have used Polars, pandas, or PySpark, you already think in method chains: ",e.jsx("code",{children:"df.filter(...).select(...).group_by(...).agg(...)"}),". Rust's iterator system and builder pattern make method chaining a first-class programming style — and unlike Python, the chains compile to maximally efficient code."]}),e.jsxs(r,{title:"Method Chaining in Rust",children:[e.jsx("p",{children:"Method chaining works when each method returns something that has more methods. In Rust, this happens in two main contexts:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Iterator chains"}),": each adapter returns a new iterator."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Builder pattern"}),": each method returns ",e.jsx("code",{children:"self"})," (or a new modified value)."]})]}),e.jsxs("p",{children:["Both patterns produce clean, readable code that describes",e.jsx("em",{children:"what"})," to compute rather than ",e.jsx("em",{children:"how"}),"."]})]}),e.jsx("h2",{children:"Polars-Style Data Processing"}),e.jsx(n,{title:"Data pipeline comparison",description:"Polars in Python vs pure Rust iterators — same chaining style, same mental model.",pythonCode:`import polars as pl

df = pl.DataFrame({
    "name": ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "dept": ["Eng", "Sales", "Eng", "Sales", "Eng"],
    "salary": [95000, 72000, 88000, 68000, 105000],
})

result = (
    df
    .filter(pl.col("salary") > 70000)
    .with_columns(
        (pl.col("salary") * 1.1).alias("new_salary")
    )
    .group_by("dept")
    .agg(
        pl.col("new_salary").mean().alias("avg_salary"),
        pl.col("name").count().alias("headcount"),
    )
    .sort("avg_salary", descending=True)
)
print(result)`,rustCode:`use std::collections::HashMap;

#[derive(Debug, Clone)]
struct Employee {
    name: String,
    dept: String,
    salary: f64,
}

fn main() {
    let employees = vec![
        Employee { name: "Alice".into(), dept: "Eng".into(), salary: 95000.0 },
        Employee { name: "Bob".into(), dept: "Sales".into(), salary: 72000.0 },
        Employee { name: "Charlie".into(), dept: "Eng".into(), salary: 88000.0 },
        Employee { name: "Diana".into(), dept: "Sales".into(), salary: 68000.0 },
        Employee { name: "Eve".into(), dept: "Eng".into(), salary: 105000.0 },
    ];

    // Same pipeline, Rust iterator style
    let by_dept: HashMap<&str, (f64, usize)> = employees.iter()
        .filter(|e| e.salary > 70000.0)                    // filter
        .map(|e| (e.dept.as_str(), e.salary * 1.1))         // transform
        .fold(HashMap::new(), |mut acc, (dept, salary)| {   // group + agg
            let entry = acc.entry(dept).or_insert((0.0, 0));
            entry.0 += salary;
            entry.1 += 1;
            acc
        });

    let mut results: Vec<_> = by_dept.iter()
        .map(|(&dept, &(total, count))| {
            (dept, total / count as f64, count)
        })
        .collect();

    results.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());  // sort desc

    for (dept, avg, count) in &results {
        println!("{}: avg={:.0}, headcount={}", dept, avg, count);
    }
}`}),e.jsx(t,{title:"When to use Polars from Rust",type:"tip",children:e.jsx("p",{children:"For simple data transformations, Rust iterators are perfect. For complex analytical queries on large datasets, use the Polars Rust crate directly — it is a Rust library first, with a Python binding. You get the same Polars API with native Rust performance and no Python overhead."})}),e.jsx("h2",{children:"Building Fluent APIs"}),e.jsx(s,{language:"rust",title:"The builder pattern for configuration",code:`#[derive(Debug)]
struct Query {
    table: String,
    columns: Vec<String>,
    filter: Option<String>,
    limit: Option<usize>,
    order_by: Option<String>,
}

impl Query {
    fn from_table(table: &str) -> Self {
        Query {
            table: table.to_string(),
            columns: vec![],
            filter: None,
            limit: None,
            order_by: None,
        }
    }

    fn select(mut self, cols: &[&str]) -> Self {
        self.columns = cols.iter().map(|s| s.to_string()).collect();
        self
    }

    fn where_clause(mut self, condition: &str) -> Self {
        self.filter = Some(condition.to_string());
        self
    }

    fn limit(mut self, n: usize) -> Self {
        self.limit = Some(n);
        self
    }

    fn order_by(mut self, col: &str) -> Self {
        self.order_by = Some(col.to_string());
        self
    }

    fn to_sql(&self) -> String {
        let cols = if self.columns.is_empty() {
            "*".to_string()
        } else {
            self.columns.join(", ")
        };

        let mut sql = format!("SELECT {} FROM {}", cols, self.table);

        if let Some(ref f) = self.filter {
            sql.push_str(&format!(" WHERE {}", f));
        }
        if let Some(ref o) = self.order_by {
            sql.push_str(&format!(" ORDER BY {}", o));
        }
        if let Some(n) = self.limit {
            sql.push_str(&format!(" LIMIT {}", n));
        }

        sql
    }
}

fn main() {
    let query = Query::from_table("users")
        .select(&["name", "email", "age"])
        .where_clause("age > 18")
        .order_by("name")
        .limit(100)
        .to_sql();

    println!("{}", query);
    // SELECT name, email, age FROM users WHERE age > 18 ORDER BY name LIMIT 100
}`}),e.jsx("h2",{children:"Chaining with Itertools"}),e.jsx(s,{language:"rust",title:"itertools crate — Python itertools for Rust",code:`// cargo add itertools
use itertools::Itertools;

fn main() {
    let data = vec![3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];

    // sorted + dedup (like Python's sorted(set(...)))
    let unique_sorted: Vec<_> = data.iter()
        .copied()
        .sorted()
        .dedup()
        .collect();
    println!("{:?}", unique_sorted);  // [1, 2, 3, 4, 5, 6, 9]

    // group_by (like Python's itertools.groupby)
    let words = vec!["apple", "avocado", "banana", "blueberry", "cherry"];
    for (key, group) in &words.iter().sorted().chunk_by(|w| w.chars().next().unwrap()) {
        let items: Vec<_> = group.collect();
        println!("{}: {:?}", key, items);
    }
    // a: ["apple", "avocado"]
    // b: ["banana", "blueberry"]
    // c: ["cherry"]

    // join (like Python's ", ".join(...))
    let csv = data.iter().join(", ");
    println!("{}", csv);  // "3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5"

    // combinations and permutations
    let items = vec!['a', 'b', 'c'];
    let combos: Vec<Vec<_>> = items.iter().combinations(2).collect();
    println!("{:?}", combos);
    // [['a', 'b'], ['a', 'c'], ['b', 'c']]

    // tuple_windows (sliding window)
    let pairs: Vec<_> = (1..=5).tuple_windows().collect::<Vec<(i32, i32)>>();
    println!("{:?}", pairs);
    // [(1, 2), (2, 3), (3, 4), (4, 5)]
}`}),e.jsx(t,{title:"itertools is the Rust itertools",type:"pythonista",children:e.jsxs("p",{children:["Python's ",e.jsx("code",{children:"itertools"})," module provides ",e.jsx("code",{children:"chain"}),",",e.jsx("code",{children:"groupby"}),", ",e.jsx("code",{children:"combinations"}),", ",e.jsx("code",{children:"permutations"}),",",e.jsx("code",{children:"product"}),", and more. Rust's ",e.jsx("code",{children:"itertools"})," crate provides all of these plus extras like ",e.jsx("code",{children:"sorted()"}),",",e.jsx("code",{children:"unique()"}),", ",e.jsx("code",{children:"join()"}),", and",e.jsx("code",{children:"tuple_windows()"}),". Add it to almost every Rust project."]})}),e.jsx("h2",{children:"Composing Complex Pipelines"}),e.jsx(s,{language:"rust",title:"Multi-stage data processing",code:`use std::collections::HashMap;

fn main() {
    let log_lines = vec![
        "2024-01-15 INFO  User login: alice",
        "2024-01-15 ERROR Database timeout",
        "2024-01-15 INFO  User login: bob",
        "2024-01-16 WARN  High memory usage",
        "2024-01-16 ERROR Connection refused",
        "2024-01-16 INFO  User login: alice",
        "2024-01-16 ERROR Database timeout",
    ];

    // Pipeline: parse → filter → group → summarize
    let error_summary: Vec<(String, usize)> = log_lines.iter()
        // Parse each line into (date, level, message)
        .filter_map(|line| {
            let parts: Vec<&str> = line.splitn(3, ' ').collect();
            if parts.len() == 3 {
                Some((parts[0], parts[1], parts[2]))
            } else {
                None
            }
        })
        // Keep only errors
        .filter(|&(_, level, _)| level == "ERROR")
        // Group by message
        .fold(HashMap::new(), |mut acc, (_, _, msg)| {
            *acc.entry(msg.to_string()).or_insert(0_usize) += 1;
            acc
        })
        // Convert to sorted vec
        .into_iter()
        .collect::<Vec<_>>()
        .into_iter()
        .sorted_by(|a, b| b.1.cmp(&a.1))
        .collect();

    for (msg, count) in &error_summary {
        println!("{:>3}x {}", count, msg);
    }
    // 2x Database timeout
    // 1x Connection refused
}

// Required at top: use itertools::Itertools;`}),e.jsx(i,{title:"Build a text analysis pipeline",difficulty:"hard",problem:`Write a function analyze_text(text: &str) that uses method chaining to produce
a report with:
1. Total word count
2. Unique word count
3. Top 5 most frequent words (with counts)
4. Average word length

Process: lowercase all words, strip punctuation (keep only alphanumeric chars),
filter out empty strings.

Return a struct TextReport with these fields. Implement Display for it.

Test with a paragraph of text.`,solution:`use std::collections::HashMap;
use std::fmt;

struct TextReport {
    total_words: usize,
    unique_words: usize,
    top_words: Vec<(String, usize)>,
    avg_word_length: f64,
}

impl fmt::Display for TextReport {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        writeln!(f, "=== Text Analysis ===")?;
        writeln!(f, "Total words:  {}", self.total_words)?;
        writeln!(f, "Unique words: {}", self.unique_words)?;
        writeln!(f, "Avg length:   {:.1}", self.avg_word_length)?;
        writeln!(f, "Top words:")?;
        for (word, count) in &self.top_words {
            writeln!(f, "  {:>3}x {}", count, word)?;
        }
        Ok(())
    }
}

fn analyze_text(text: &str) -> TextReport {
    let words: Vec<String> = text
        .split_whitespace()
        .map(|w| w.to_lowercase())
        .map(|w| w.chars().filter(|c| c.is_alphanumeric()).collect::<String>())
        .filter(|w| !w.is_empty())
        .collect();

    let total_words = words.len();

    let avg_word_length = if total_words > 0 {
        words.iter().map(|w| w.len()).sum::<usize>() as f64
            / total_words as f64
    } else {
        0.0
    };

    let mut counts: HashMap<&str, usize> = HashMap::new();
    for word in &words {
        *counts.entry(word.as_str()).or_insert(0) += 1;
    }

    let unique_words = counts.len();

    let mut top_words: Vec<(String, usize)> = counts
        .into_iter()
        .map(|(w, c)| (w.to_string(), c))
        .collect();
    top_words.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(&b.0)));
    top_words.truncate(5);

    TextReport { total_words, unique_words, top_words, avg_word_length }
}

fn main() {
    let text = "The quick brown fox jumps over the lazy dog.                 The dog barked at the fox, and the fox ran away.";
    println!("{}", analyze_text(text));
}`})]})}const b=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"}));export{f as a,x as b,g as c,y as d,b as e,m as s};
