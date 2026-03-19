/**
 * Curriculum registry for Rust4Python.
 * Defines all 17 subjects, their chapters, and sections.
 */

export const CURRICULUM = [
  {
    id: '01-getting-started',
    title: 'Getting Started',
    icon: '🚀',
    colorHex: '#f97316',
    description: 'Your first steps from Python to Rust — setting up the toolchain, understanding the compilation model, and writing your first programs with cargo.',
    prerequisites: [],
    mlRelevance: 70,
    estimatedHours: 15,
    difficulty: 'beginner',
    chapters: [
      {
        id: 'c1-why-rust', title: 'Why Rust for Python Developers', description: 'Why Rust matters for data science, ML, and AI — performance, safety, and the growing Rust ecosystem.', difficulty: 'beginner', estimatedMinutes: 150,
        sections: [
          { id: 's1-why-rust', title: 'Why Rust Matters for DS/ML/AI', difficulty: 'beginner', readingMinutes: 15, description: 'Performance gains, memory safety, and real-world examples like Polars and tokenizers.', buildsOn: null },
          { id: 's2-mental-model', title: 'Rust vs Python Mental Model', difficulty: 'beginner', readingMinutes: 20, description: 'Key mental shifts: compiled vs interpreted, ownership vs GC, explicit vs implicit.', buildsOn: '01-getting-started/c1-why-rust/s1-why-rust' },
          { id: 's3-setup', title: 'Setting Up Rust', difficulty: 'beginner', readingMinutes: 15, description: 'Installing rustup, cargo basics, IDE setup, and creating your first project.', buildsOn: '01-getting-started/c1-why-rust/s2-mental-model' },
        ],
      },
      {
        id: 'c2-first-programs', title: 'First Rust Programs', description: 'Writing and running Rust code — variables, types, and the basics of the language.', difficulty: 'beginner', estimatedMinutes: 180,
        sections: [
          { id: 's1-hello-world', title: 'Hello World & Cargo', difficulty: 'beginner', readingMinutes: 15, description: 'fn main(), println!, cargo new/run — your first Rust program.', buildsOn: '01-getting-started/c1-why-rust/s3-setup' },
          { id: 's2-variables', title: 'Variables & Mutability', difficulty: 'beginner', readingMinutes: 20, description: 'Immutable by default, let mut, shadowing, and type inference.', buildsOn: '01-getting-started/c2-first-programs/s1-hello-world' },
          { id: 's3-basic-types', title: 'Basic Types', difficulty: 'beginner', readingMinutes: 25, description: 'Integers, floats, booleans, characters, tuples, and arrays.', buildsOn: '01-getting-started/c2-first-programs/s2-variables' },
        ],
      },
      {
        id: 'c3-control-flow', title: 'Control Flow', description: 'Conditionals, loops, and pattern matching — control flow as expressions.', difficulty: 'beginner', estimatedMinutes: 180,
        sections: [
          { id: 's1-conditionals', title: 'If/Else Expressions', difficulty: 'beginner', readingMinutes: 15, description: 'if/else as expressions that return values, no truthy/falsy.', buildsOn: '01-getting-started/c2-first-programs/s3-basic-types' },
          { id: 's2-loops', title: 'Loops', difficulty: 'beginner', readingMinutes: 20, description: 'loop, while, for — iterating in Rust vs Python.', buildsOn: '01-getting-started/c3-control-flow/s1-conditionals' },
          { id: 's3-pattern-matching', title: 'Pattern Matching with match', difficulty: 'beginner', readingMinutes: 25, description: 'Exhaustive pattern matching, destructuring, and guards.', buildsOn: '01-getting-started/c3-control-flow/s2-loops' },
        ],
      },
      {
        id: 'c4-functions', title: 'Functions & Modules', description: 'Defining functions, closures, and organizing code with modules and crates.', difficulty: 'beginner', estimatedMinutes: 210,
        sections: [
          { id: 's1-functions', title: 'Function Signatures & Return Types', difficulty: 'beginner', readingMinutes: 20, description: 'fn keyword, parameter types, return values, and expressions.', buildsOn: '01-getting-started/c3-control-flow/s3-pattern-matching' },
          { id: 's2-closures', title: 'Closures', difficulty: 'beginner', readingMinutes: 25, description: 'Closure syntax, capturing variables, and comparison with Python lambdas.', buildsOn: '01-getting-started/c4-functions/s1-functions' },
          { id: 's3-modules', title: 'Modules & Crates', difficulty: 'beginner', readingMinutes: 25, description: 'mod, use, pub — organizing Rust code vs Python imports.', buildsOn: '01-getting-started/c4-functions/s2-closures' },
        ],
      },
    ],
  },
  {
    id: '02-ownership',
    title: 'Ownership & Borrowing',
    icon: '🔒',
    colorHex: '#ef4444',
    description: 'The heart of Rust — ownership, borrowing, and lifetimes. This is what makes Rust unique and eliminates entire classes of bugs that plague C/C++ and even Python at scale.',
    prerequisites: ['01-getting-started'],
    mlRelevance: 75,
    estimatedHours: 20,
    difficulty: 'beginner',
    chapters: [
      {
        id: 'c1-ownership', title: 'Ownership', description: 'Each value has one owner — the foundation of Rust memory safety.', difficulty: 'beginner', estimatedMinutes: 255,
        sections: [
          { id: 's1-what-ownership-solves', title: 'What Ownership Solves', difficulty: 'beginner', readingMinutes: 20, description: 'Memory bugs eliminated at compile time — no GC needed.', buildsOn: '01-getting-started/c4-functions/s3-modules' },
          { id: 's2-move-semantics', title: 'Move Semantics', difficulty: 'beginner', readingMinutes: 25, description: 'Assignment moves ownership — the biggest mental shift from Python.', buildsOn: '02-ownership/c1-ownership/s1-what-ownership-solves' },
          { id: 's3-copy-clone', title: 'Copy vs Clone', difficulty: 'beginner', readingMinutes: 20, description: 'Stack-only Copy types vs explicit Clone for heap data.', buildsOn: '02-ownership/c1-ownership/s2-move-semantics' },
          { id: 's4-scope-drop', title: 'Scope & Drop', difficulty: 'beginner', readingMinutes: 20, description: 'Deterministic cleanup when values go out of scope — RAII pattern.', buildsOn: '02-ownership/c1-ownership/s3-copy-clone' },
        ],
      },
      {
        id: 'c2-borrowing', title: 'References & Borrowing', description: 'Borrowing data without taking ownership — shared and exclusive access.', difficulty: 'beginner', estimatedMinutes: 225,
        sections: [
          { id: 's1-immutable-refs', title: 'Immutable References (&T)', difficulty: 'beginner', readingMinutes: 20, description: 'Shared read-only access with & references.', buildsOn: '02-ownership/c1-ownership/s4-scope-drop' },
          { id: 's2-mutable-refs', title: 'Mutable References (&mut T)', difficulty: 'beginner', readingMinutes: 25, description: 'Exclusive mutable access — one &mut at a time.', buildsOn: '02-ownership/c2-borrowing/s1-immutable-refs' },
          { id: 's3-borrow-checker', title: 'The Borrow Checker', difficulty: 'intermediate', readingMinutes: 30, description: 'Understanding and working with the borrow checker.', buildsOn: '02-ownership/c2-borrowing/s2-mutable-refs' },
        ],
      },
      {
        id: 'c3-slices', title: 'Slices & String Types', description: 'Views into contiguous data — the key to efficient Rust APIs.', difficulty: 'intermediate', estimatedMinutes: 135,
        sections: [
          { id: 's1-string-types', title: 'String vs &str', difficulty: 'intermediate', readingMinutes: 25, description: 'Owned String vs borrowed &str — when to use which.', buildsOn: '02-ownership/c2-borrowing/s3-borrow-checker' },
          { id: 's2-slice-patterns', title: 'Slice Patterns', difficulty: 'intermediate', readingMinutes: 20, description: 'Working with &[T] slices and subslicing.', buildsOn: '02-ownership/c3-slices/s1-string-types' },
        ],
      },
      {
        id: 'c4-lifetimes', title: 'Lifetimes Deep Dive', description: 'Telling the compiler how long references live — the final ownership concept.', difficulty: 'intermediate', estimatedMinutes: 255,
        sections: [
          { id: 's1-lifetime-annotations', title: 'Lifetime Annotations', difficulty: 'intermediate', readingMinutes: 30, description: "The 'a syntax and what lifetimes tell the compiler.", buildsOn: '02-ownership/c3-slices/s2-slice-patterns' },
          { id: 's2-lifetime-elision', title: 'Lifetime Elision Rules', difficulty: 'intermediate', readingMinutes: 25, description: 'When the compiler infers lifetimes for you.', buildsOn: '02-ownership/c4-lifetimes/s1-lifetime-annotations' },
          { id: 's3-struct-lifetimes', title: 'Struct Lifetimes', difficulty: 'advanced', readingMinutes: 30, description: 'Structs that hold references and when to use owned data instead.', buildsOn: '02-ownership/c4-lifetimes/s2-lifetime-elision' },
        ],
      },
    ],
  },
  {
    id: '03-type-system',
    title: 'Type System & Data Modeling',
    icon: '🔷',
    colorHex: '#8b5cf6',
    description: 'Structs, enums, traits, and generics — Rust\'s powerful type system for modeling data and behavior, replacing Python classes and protocols.',
    prerequisites: ['02-ownership'],
    mlRelevance: 80,
    estimatedHours: 25,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-structs', title: 'Structs', description: 'Custom data types — Rust\'s answer to Python dataclasses and named tuples.', difficulty: 'beginner', estimatedMinutes: 195,
        sections: [
          { id: 's1-defining-structs', title: 'Defining Structs', difficulty: 'beginner', readingMinutes: 20, description: 'Struct syntax compared to Python dataclasses.', buildsOn: '02-ownership/c4-lifetimes/s3-struct-lifetimes' },
          { id: 's2-methods', title: 'Methods & impl Blocks', difficulty: 'beginner', readingMinutes: 25, description: 'Adding behavior with impl — Rust\'s self vs Python\'s self.', buildsOn: '03-type-system/c1-structs/s1-defining-structs' },
          { id: 's3-builder-pattern', title: 'Builder Pattern', difficulty: 'intermediate', readingMinutes: 20, description: 'Fluent APIs and builder pattern for complex construction.', buildsOn: '03-type-system/c1-structs/s2-methods' },
        ],
      },
      {
        id: 'c2-enums', title: 'Enums & Pattern Matching', description: 'Algebraic data types — Rust enums carry data and eliminate null pointer bugs.', difficulty: 'beginner', estimatedMinutes: 210,
        sections: [
          { id: 's1-enums', title: 'Enums with Data', difficulty: 'beginner', readingMinutes: 20, description: 'Rust enums are algebraic types — far more powerful than Python Enum.', buildsOn: '03-type-system/c1-structs/s3-builder-pattern' },
          { id: 's2-option', title: 'Option<T>', difficulty: 'beginner', readingMinutes: 25, description: 'Rust\'s None — no null, no NoneType errors, compiler-enforced.', buildsOn: '03-type-system/c2-enums/s1-enums' },
          { id: 's3-result', title: 'Result<T, E>', difficulty: 'beginner', readingMinutes: 25, description: 'Error handling without exceptions — Result replaces try/except.', buildsOn: '03-type-system/c2-enums/s2-option' },
        ],
      },
      {
        id: 'c3-traits', title: 'Traits', description: 'Shared behavior — Rust\'s answer to Python protocols, ABCs, and duck typing.', difficulty: 'intermediate', estimatedMinutes: 240,
        sections: [
          { id: 's1-defining-traits', title: 'Defining & Implementing Traits', difficulty: 'intermediate', readingMinutes: 25, description: 'Trait definitions, implementations, and default methods.', buildsOn: '03-type-system/c2-enums/s3-result' },
          { id: 's2-trait-bounds', title: 'Trait Bounds & Generics', difficulty: 'intermediate', readingMinutes: 30, description: 'Constraining generic types with trait bounds.', buildsOn: '03-type-system/c3-traits/s1-defining-traits' },
          { id: 's3-common-traits', title: 'Common Std Traits', difficulty: 'intermediate', readingMinutes: 25, description: 'Display, Debug, Clone, From, Into, Default — the standard toolkit.', buildsOn: '03-type-system/c3-traits/s2-trait-bounds' },
        ],
      },
      {
        id: 'c4-generics', title: 'Generics', description: 'Write once, use with any type — zero-cost generic programming.', difficulty: 'intermediate', estimatedMinutes: 195,
        sections: [
          { id: 's1-generic-functions', title: 'Generic Functions & Structs', difficulty: 'intermediate', readingMinutes: 25, description: 'Parameterizing functions and structs over types.', buildsOn: '03-type-system/c3-traits/s3-common-traits' },
          { id: 's2-monomorphization', title: 'Monomorphization', difficulty: 'intermediate', readingMinutes: 20, description: 'How Rust compiles generics to specialized code — zero cost.', buildsOn: '03-type-system/c4-generics/s1-generic-functions' },
          { id: 's3-where-clauses', title: 'Where Clauses', difficulty: 'intermediate', readingMinutes: 20, description: 'Complex trait bounds with where syntax.', buildsOn: '03-type-system/c4-generics/s2-monomorphization' },
        ],
      },
      {
        id: 'c5-advanced-types', title: 'Advanced Type System', description: 'Associated types, trait objects, and the newtype pattern for expert-level Rust.', difficulty: 'advanced', estimatedMinutes: 225,
        sections: [
          { id: 's1-associated-types', title: 'Associated Types', difficulty: 'advanced', readingMinutes: 25, description: 'Types defined within traits for cleaner APIs.', buildsOn: '03-type-system/c4-generics/s3-where-clauses' },
          { id: 's2-trait-objects', title: 'Trait Objects (dyn Trait)', difficulty: 'advanced', readingMinutes: 30, description: 'Dynamic dispatch vs static dispatch — when to use each.', buildsOn: '03-type-system/c5-advanced-types/s1-associated-types' },
          { id: 's3-newtype', title: 'Newtype Pattern', difficulty: 'advanced', readingMinutes: 20, description: 'Type-safe wrappers with zero runtime cost.', buildsOn: '03-type-system/c5-advanced-types/s2-trait-objects' },
        ],
      },
    ],
  },
  {
    id: '04-error-handling',
    title: 'Error Handling & Safety',
    icon: '⚠️',
    colorHex: '#f43f5e',
    description: 'Result, Option, and the ? operator — Rust\'s approach to errors replaces Python\'s try/except with compile-time guarantees.',
    prerequisites: ['03-type-system'],
    mlRelevance: 72,
    estimatedHours: 15,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-error-philosophy', title: 'Error Handling Philosophy', description: 'Result and Option in depth — making errors explicit and composable.', difficulty: 'intermediate', estimatedMinutes: 270,
        sections: [
          { id: 's1-result-option', title: 'Result & Option in Depth', difficulty: 'intermediate', readingMinutes: 25, description: 'Deep dive into Result<T,E> and Option<T> patterns.', buildsOn: '03-type-system/c5-advanced-types/s3-newtype' },
          { id: 's2-question-mark', title: 'The ? Operator', difficulty: 'intermediate', readingMinutes: 20, description: 'Ergonomic error propagation — Rust\'s alternative to try/except.', buildsOn: '04-error-handling/c1-error-philosophy/s1-result-option' },
          { id: 's3-custom-errors', title: 'Custom Error Types', difficulty: 'intermediate', readingMinutes: 25, description: 'Designing error types for libraries and applications.', buildsOn: '04-error-handling/c1-error-philosophy/s2-question-mark' },
          { id: 's4-anyhow-thiserror', title: 'anyhow & thiserror', difficulty: 'intermediate', readingMinutes: 20, description: 'Popular error handling crates for applications and libraries.', buildsOn: '04-error-handling/c1-error-philosophy/s3-custom-errors' },
        ],
      },
      {
        id: 'c2-error-patterns', title: 'Error Patterns', description: 'When to panic, when to propagate, and practical error handling.', difficulty: 'intermediate', estimatedMinutes: 135,
        sections: [
          { id: 's1-unwrap-considered', title: 'When panic Is OK', difficulty: 'intermediate', readingMinutes: 20, description: 'Unwrap in prototypes, expect with messages, and unrecoverable errors.', buildsOn: '04-error-handling/c1-error-philosophy/s4-anyhow-thiserror' },
          { id: 's2-error-propagation', title: 'Propagating Errors Gracefully', difficulty: 'intermediate', readingMinutes: 25, description: 'Error conversion chains and designing error hierarchies.', buildsOn: '04-error-handling/c2-error-patterns/s1-unwrap-considered' },
        ],
      },
      {
        id: 'c3-unsafe', title: 'Unsafe Rust', description: 'When and how to use unsafe — raw pointers and FFI for advanced use cases.', difficulty: 'advanced', estimatedMinutes: 165,
        sections: [
          { id: 's1-what-unsafe-unlocks', title: 'What Unsafe Unlocks', difficulty: 'advanced', readingMinutes: 25, description: 'The five unsafe superpowers and when you need them.', buildsOn: '04-error-handling/c2-error-patterns/s2-error-propagation' },
          { id: 's2-raw-pointers', title: 'Raw Pointers & FFI Safety', difficulty: 'advanced', readingMinutes: 30, description: 'Working with raw pointers and C interop safely.', buildsOn: '04-error-handling/c3-unsafe/s1-what-unsafe-unlocks' },
        ],
      },
    ],
  },
  {
    id: '05-collections',
    title: 'Collections & Iterators',
    icon: '📦',
    colorHex: '#10b981',
    description: 'Vec, HashMap, and Rust\'s powerful iterator system — functional programming patterns that rival Python\'s list comprehensions with zero-cost performance.',
    prerequisites: ['03-type-system'],
    mlRelevance: 85,
    estimatedHours: 20,
    difficulty: 'intermediate',
    chapters: [
      { id: 'c1-standard-collections', title: 'Standard Collections', description: 'Vec, HashMap, HashSet — Rust equivalents of Python lists, dicts, and sets.', difficulty: 'beginner', estimatedMinutes: 195, sections: [
          { id: 's1-vec', title: 'Vec<T>', difficulty: 'beginner', readingMinutes: 20, description: 'Growable arrays — Rust\'s Python list equivalent.', buildsOn: '03-type-system/c5-advanced-types/s3-newtype' },
          { id: 's2-hashmap', title: 'HashMap & HashSet', difficulty: 'beginner', readingMinutes: 25, description: 'Key-value maps and sets — Rust\'s dict and set.', buildsOn: '05-collections/c1-standard-collections/s1-vec' },
          { id: 's3-other-collections', title: 'BTreeMap, VecDeque, BinaryHeap', difficulty: 'intermediate', readingMinutes: 20, description: 'Specialized collections for specific use cases.', buildsOn: '05-collections/c1-standard-collections/s2-hashmap' },
        ], },
      { id: 'c2-iterators', title: 'Iterator Deep Dive', description: 'Lazy, composable, zero-cost iteration — Rust iterators are supercharged.', difficulty: 'intermediate', estimatedMinutes: 210, sections: [
          { id: 's1-iterator-trait', title: 'Iterator Trait & next()', difficulty: 'intermediate', readingMinutes: 25, description: 'The Iterator trait and lazy evaluation.', buildsOn: '05-collections/c1-standard-collections/s3-other-collections' },
          { id: 's2-adapters', title: 'Adapters: map, filter, fold, zip', difficulty: 'intermediate', readingMinutes: 25, description: 'Composable iterator adapters — functional Rust.', buildsOn: '05-collections/c2-iterators/s1-iterator-trait' },
          { id: 's3-collecting', title: 'Collecting into Types', difficulty: 'intermediate', readingMinutes: 20, description: 'Transforming iterators into collections with collect().', buildsOn: '05-collections/c2-iterators/s2-adapters' },
        ], },
      { id: 'c3-custom-iterators', title: 'Custom Iterators', description: 'Implementing Iterator for your own types.', difficulty: 'intermediate', estimatedMinutes: 135, sections: [
          { id: 's1-implementing-iterator', title: 'Implementing Iterator', difficulty: 'intermediate', readingMinutes: 25, description: 'Creating custom iterators for your types.', buildsOn: '05-collections/c2-iterators/s3-collecting' },
          { id: 's2-into-iterator', title: 'IntoIterator', difficulty: 'intermediate', readingMinutes: 20, description: 'Making types work with for loops.', buildsOn: '05-collections/c3-custom-iterators/s1-implementing-iterator' },
        ], },
      { id: 'c4-functional', title: 'Functional Patterns', description: 'Closures, higher-order functions, and method chaining — Polars-style APIs.', difficulty: 'intermediate', estimatedMinutes: 225, sections: [
          { id: 's1-closures-depth', title: 'Closures: Fn, FnMut, FnOnce', difficulty: 'intermediate', readingMinutes: 25, description: 'The three closure traits and when each applies.', buildsOn: '05-collections/c3-custom-iterators/s2-into-iterator' },
          { id: 's2-method-chaining', title: 'Method Chaining (Polars-style)', difficulty: 'intermediate', readingMinutes: 25, description: 'Building fluent APIs with method chaining.', buildsOn: '05-collections/c4-functional/s1-closures-depth' },
          { id: 's3-combinators', title: 'Combinator Patterns', difficulty: 'intermediate', readingMinutes: 25, description: 'Composing operations with combinators.', buildsOn: '05-collections/c4-functional/s2-method-chaining' },
        ], },
    ],
  },
  {
    id: '06-memory', title: 'Memory & Performance', icon: '🧠', colorHex: '#06b6d4',
    description: 'Stack vs heap, smart pointers, and zero-cost abstractions — understanding how Rust achieves C-level performance without a garbage collector.',
    prerequisites: ['02-ownership'], mlRelevance: 78, estimatedHours: 20, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-stack-heap', title: 'Stack vs Heap', description: 'Memory layout, Box, Rc, Arc — understanding where data lives.', difficulty: 'intermediate', estimatedMinutes: 210, sections: [
          { id: 's1-memory-layout', title: 'Memory Layout in Rust', difficulty: 'intermediate', readingMinutes: 25, description: 'Stack vs heap and how it differs from Python\'s all-heap model.', buildsOn: '02-ownership/c4-lifetimes/s3-struct-lifetimes' },
          { id: 's2-box', title: 'Box<T>', difficulty: 'intermediate', readingMinutes: 20, description: 'Explicit heap allocation with Box.', buildsOn: '06-memory/c1-stack-heap/s1-memory-layout' },
          { id: 's3-rc-arc', title: 'Rc<T> & Arc<T>', difficulty: 'intermediate', readingMinutes: 25, description: 'Reference counting — familiar from Python\'s object model.', buildsOn: '06-memory/c1-stack-heap/s2-box' },
        ], },
      { id: 'c2-smart-pointers', title: 'Smart Pointers', description: 'RefCell, interior mutability, and weak references.', difficulty: 'intermediate', estimatedMinutes: 150, sections: [
          { id: 's1-refcell', title: 'RefCell & Interior Mutability', difficulty: 'intermediate', readingMinutes: 25, description: 'Runtime borrow checking when compile-time won\'t do.', buildsOn: '06-memory/c1-stack-heap/s3-rc-arc' },
          { id: 's2-weak-refs', title: 'Weak References & Cycles', difficulty: 'intermediate', readingMinutes: 25, description: 'Breaking reference cycles with Weak.', buildsOn: '06-memory/c2-smart-pointers/s1-refcell' },
        ], },
      { id: 'c3-zero-cost', title: 'Zero-Cost Abstractions', description: 'How Rust achieves high-level ergonomics with low-level performance.', difficulty: 'advanced', estimatedMinutes: 225, sections: [
          { id: 's1-generics-compile', title: 'How Generics Compile', difficulty: 'advanced', readingMinutes: 25, description: 'Monomorphization and inlining — zero overhead generics.', buildsOn: '06-memory/c2-smart-pointers/s2-weak-refs' },
          { id: 's2-simd', title: 'SIMD Basics', difficulty: 'advanced', readingMinutes: 30, description: 'Using SIMD intrinsics for data-parallel computation.', buildsOn: '06-memory/c3-zero-cost/s1-generics-compile' },
          { id: 's3-benchmarking', title: 'Benchmarking with criterion', difficulty: 'intermediate', readingMinutes: 20, description: 'Measuring performance with statistical rigor.', buildsOn: '06-memory/c3-zero-cost/s2-simd' },
        ], },
      { id: 'c4-memory-optimization', title: 'Memory Optimization', description: 'Data-oriented design, struct layout, and arena allocation.', difficulty: 'advanced', estimatedMinutes: 225, sections: [
          { id: 's1-data-oriented', title: 'Data-Oriented Design', difficulty: 'advanced', readingMinutes: 25, description: 'Designing for CPU caches and memory access patterns.', buildsOn: '06-memory/c3-zero-cost/s3-benchmarking' },
          { id: 's2-struct-layout', title: 'Struct Layout & Padding', difficulty: 'advanced', readingMinutes: 25, description: 'Understanding repr and field ordering.', buildsOn: '06-memory/c4-memory-optimization/s1-data-oriented' },
          { id: 's3-arena', title: 'Arena Allocation', difficulty: 'advanced', readingMinutes: 25, description: 'Bulk allocation for performance-critical code.', buildsOn: '06-memory/c4-memory-optimization/s2-struct-layout' },
        ], },
    ],
  },
  {
    id: '07-concurrency', title: 'Concurrency & Parallelism', icon: '⚡', colorHex: '#3b82f6',
    description: 'Fearless concurrency — threads, async/await, and Rayon for data parallelism. No GIL means true parallel execution for ML workloads.',
    prerequisites: ['06-memory'], mlRelevance: 88, estimatedHours: 25, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-fearless-concurrency', title: 'Fearless Concurrency', description: 'Send, Sync, and why Rust concurrency is fundamentally different.', difficulty: 'intermediate', estimatedMinutes: 210, sections: [
          { id: 's1-why-different', title: 'Why Rust Concurrency Is Different', difficulty: 'intermediate', readingMinutes: 20, description: 'No GIL, data race prevention at compile time.', buildsOn: '06-memory/c4-memory-optimization/s3-arena' },
          { id: 's2-send-sync', title: 'Send & Sync Traits', difficulty: 'intermediate', readingMinutes: 25, description: 'Marker traits that guarantee thread safety.', buildsOn: '07-concurrency/c1-fearless-concurrency/s1-why-different' },
          { id: 's3-threads', title: 'std::thread Basics', difficulty: 'intermediate', readingMinutes: 25, description: 'Spawning threads and joining results.', buildsOn: '07-concurrency/c1-fearless-concurrency/s2-send-sync' },
        ], },
      { id: 'c2-shared-state', title: 'Threads & Shared State', description: 'Mutex, RwLock, and atomic types for shared mutable state.', difficulty: 'intermediate', estimatedMinutes: 150, sections: [
          { id: 's1-mutex', title: 'Mutex<T> & RwLock<T>', difficulty: 'intermediate', readingMinutes: 25, description: 'Safe shared mutable access across threads.', buildsOn: '07-concurrency/c1-fearless-concurrency/s3-threads' },
          { id: 's2-atomics', title: 'Atomic Types', difficulty: 'advanced', readingMinutes: 25, description: 'Lock-free concurrent data access.', buildsOn: '07-concurrency/c2-shared-state/s1-mutex' },
        ], },
      { id: 'c3-channels', title: 'Channels & Message Passing', description: 'Communication between threads without shared state.', difficulty: 'intermediate', estimatedMinutes: 135, sections: [
          { id: 's1-mpsc', title: 'mpsc Channels', difficulty: 'intermediate', readingMinutes: 25, description: 'Multi-producer, single-consumer channels.', buildsOn: '07-concurrency/c2-shared-state/s2-atomics' },
          { id: 's2-crossbeam', title: 'crossbeam Channels', difficulty: 'intermediate', readingMinutes: 20, description: 'Advanced channel types from crossbeam.', buildsOn: '07-concurrency/c3-channels/s1-mpsc' },
        ], },
      { id: 'c4-rayon', title: 'Rayon — Data Parallelism', description: 'Easy parallel computation with par_iter().', difficulty: 'intermediate', estimatedMinutes: 135, sections: [
          { id: 's1-par-iter', title: 'par_iter() Magic', difficulty: 'intermediate', readingMinutes: 20, description: 'One-line parallelism with Rayon.', buildsOn: '07-concurrency/c3-channels/s2-crossbeam' },
          { id: 's2-parallel-patterns', title: 'Parallel Map/Reduce/Filter', difficulty: 'intermediate', readingMinutes: 25, description: 'Parallel data processing patterns.', buildsOn: '07-concurrency/c4-rayon/s1-par-iter' },
        ], },
      { id: 'c5-async', title: 'Async Rust', description: 'Async/await, futures, and the Tokio runtime.', difficulty: 'advanced', estimatedMinutes: 255, sections: [
          { id: 's1-async-await', title: 'async/await Fundamentals', difficulty: 'advanced', readingMinutes: 30, description: 'Async programming compared to Python asyncio.', buildsOn: '07-concurrency/c4-rayon/s2-parallel-patterns' },
          { id: 's2-tokio', title: 'Tokio Runtime', difficulty: 'advanced', readingMinutes: 30, description: 'The most popular async runtime for Rust.', buildsOn: '07-concurrency/c5-async/s1-async-await' },
          { id: 's3-async-vs-threads', title: 'Async vs Threads', difficulty: 'advanced', readingMinutes: 25, description: 'When to use async vs threads.', buildsOn: '07-concurrency/c5-async/s2-tokio' },
        ], },
    ],
  },
  {
    id: '08-io-serialization', title: 'I/O, Serialization & Files', icon: '📁', colorHex: '#f59e0b',
    description: 'Reading files, parsing data formats, and serialization with serde — essential for data pipelines and ML workflows.',
    prerequisites: ['05-collections'], mlRelevance: 82, estimatedHours: 15, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-file-io', title: 'File I/O', description: 'Reading, writing, and buffered I/O.', difficulty: 'beginner', estimatedMinutes: 180, sections: [
          { id: 's1-reading-writing', title: 'Reading & Writing Files', difficulty: 'beginner', readingMinutes: 20, description: 'File operations compared to Python open().', buildsOn: '05-collections/c4-functional/s3-combinators' },
          { id: 's2-buffered-io', title: 'Buffered I/O', difficulty: 'intermediate', readingMinutes: 20, description: 'BufReader and BufWriter for performance.', buildsOn: '08-io-serialization/c1-file-io/s1-reading-writing' },
          { id: 's3-csv', title: 'CSV Reading', difficulty: 'intermediate', readingMinutes: 20, description: 'Fast CSV parsing with the csv crate.', buildsOn: '08-io-serialization/c1-file-io/s2-buffered-io' },
        ], },
      { id: 'c2-serialization', title: 'Serialization', description: 'serde — the most powerful serialization framework in any language.', difficulty: 'intermediate', estimatedMinutes: 195, sections: [
          { id: 's1-serde', title: 'serde Framework', difficulty: 'intermediate', readingMinutes: 25, description: 'Derive-based serialization and deserialization.', buildsOn: '08-io-serialization/c1-file-io/s3-csv' },
          { id: 's2-json', title: 'JSON with serde_json', difficulty: 'intermediate', readingMinutes: 20, description: 'Working with JSON data in Rust.', buildsOn: '08-io-serialization/c2-serialization/s1-serde' },
          { id: 's3-formats', title: 'TOML, YAML, MessagePack', difficulty: 'intermediate', readingMinutes: 20, description: 'Other serialization formats with serde.', buildsOn: '08-io-serialization/c2-serialization/s2-json' },
        ], },
      { id: 'c3-data-formats', title: 'Working with Data Formats', description: 'Parquet, Arrow, and database access for data science.', difficulty: 'intermediate', estimatedMinutes: 225, sections: [
          { id: 's1-parquet', title: 'Parquet Files', difficulty: 'intermediate', readingMinutes: 25, description: 'Reading and writing columnar Parquet data.', buildsOn: '08-io-serialization/c2-serialization/s3-formats' },
          { id: 's2-arrow', title: 'Arrow Format', difficulty: 'intermediate', readingMinutes: 25, description: 'Apache Arrow in-memory columnar format.', buildsOn: '08-io-serialization/c3-data-formats/s1-parquet' },
          { id: 's3-databases', title: 'Database Access (sqlx)', difficulty: 'intermediate', readingMinutes: 25, description: 'Async database queries with compile-time checking.', buildsOn: '08-io-serialization/c3-data-formats/s2-arrow' },
        ], },
    ],
  },
  {
    id: '09-numerical', title: 'Numerical Computing', icon: '🔢', colorHex: '#14b8a6',
    description: 'ndarray, nalgebra, and statistical computing — Rust equivalents of NumPy and SciPy for data science workloads.',
    prerequisites: ['05-collections'], mlRelevance: 92, estimatedHours: 20, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-numeric-types', title: 'Numeric Types & Precision', description: 'Integer overflow, floating point, and the num crate.', difficulty: 'intermediate', estimatedMinutes: 180, sections: [
          { id: 's1-integer-overflow', title: 'Integer Overflow Handling', difficulty: 'intermediate', readingMinutes: 20, description: 'Checked, wrapping, saturating arithmetic.', buildsOn: '05-collections/c4-functional/s3-combinators' },
          { id: 's2-floating-point', title: 'Floating Point (f32 vs f64)', difficulty: 'intermediate', readingMinutes: 20, description: 'IEEE 754 in Rust and precision considerations.', buildsOn: '09-numerical/c1-numeric-types/s1-integer-overflow' },
          { id: 's3-num-crate', title: 'num Crate', difficulty: 'intermediate', readingMinutes: 20, description: 'BigInt, Complex, Rational numbers.', buildsOn: '09-numerical/c1-numeric-types/s2-floating-point' },
        ], },
      { id: 'c2-ndarray', title: 'ndarray — Rust\'s NumPy', description: 'N-dimensional arrays with familiar NumPy-like operations.', difficulty: 'intermediate', estimatedMinutes: 300, sections: [
          { id: 's1-array-creation', title: 'Array Creation & Indexing', difficulty: 'intermediate', readingMinutes: 25, description: 'Creating and accessing ndarray arrays.', buildsOn: '09-numerical/c1-numeric-types/s3-num-crate' },
          { id: 's2-slicing-views', title: 'Slicing & Views', difficulty: 'intermediate', readingMinutes: 25, description: 'Zero-copy array views and slicing.', buildsOn: '09-numerical/c2-ndarray/s1-array-creation' },
          { id: 's3-broadcasting', title: 'Broadcasting', difficulty: 'intermediate', readingMinutes: 25, description: 'NumPy-style broadcasting in ndarray.', buildsOn: '09-numerical/c2-ndarray/s2-slicing-views' },
          { id: 's4-linalg-ops', title: 'Linear Algebra Operations', difficulty: 'intermediate', readingMinutes: 25, description: 'Matrix operations with ndarray-linalg.', buildsOn: '09-numerical/c2-ndarray/s3-broadcasting' },
        ], },
      { id: 'c3-linear-algebra', title: 'Linear Algebra', description: 'nalgebra for matrices and decompositions.', difficulty: 'intermediate', estimatedMinutes: 165, sections: [
          { id: 's1-nalgebra', title: 'nalgebra Crate', difficulty: 'intermediate', readingMinutes: 25, description: 'Statically-sized linear algebra.', buildsOn: '09-numerical/c2-ndarray/s4-linalg-ops' },
          { id: 's2-decompositions', title: 'Matrix Decompositions', difficulty: 'intermediate', readingMinutes: 30, description: 'LU, QR, SVD, and eigendecomposition.', buildsOn: '09-numerical/c3-linear-algebra/s1-nalgebra' },
        ], },
      { id: 'c4-statistics', title: 'Statistics & Random', description: 'Random number generation and statistical functions.', difficulty: 'intermediate', estimatedMinutes: 135, sections: [
          { id: 's1-rand', title: 'rand & rand_distr', difficulty: 'intermediate', readingMinutes: 20, description: 'Random number generation and distributions.', buildsOn: '09-numerical/c3-linear-algebra/s2-decompositions' },
          { id: 's2-statistical-functions', title: 'Statistical Functions', difficulty: 'intermediate', readingMinutes: 25, description: 'Mean, variance, correlation in Rust.', buildsOn: '09-numerical/c4-statistics/s1-rand' },
        ], },
    ],
  },
  {
    id: '10-dataframes', title: 'DataFrames & Data Wrangling', icon: '📊', colorHex: '#84cc16',
    description: 'Polars internals, data transformations, and performance patterns — understanding the Rust engine behind the fastest DataFrame library.',
    prerequisites: ['09-numerical'], mlRelevance: 95, estimatedHours: 20, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-polars-internals', title: 'Polars Internals', description: 'Arrow format, lazy evaluation, and the expression system.', difficulty: 'intermediate', estimatedMinutes: 225, sections: [
          { id: 's1-arrow-columnar', title: 'Arrow Columnar Format', difficulty: 'intermediate', readingMinutes: 25, description: 'The in-memory format behind Polars performance.', buildsOn: '09-numerical/c4-statistics/s2-statistical-functions' },
          { id: 's2-series-dataframe', title: 'Series & DataFrame', difficulty: 'intermediate', readingMinutes: 25, description: 'Core data structures compared to Pandas.', buildsOn: '10-dataframes/c1-polars-internals/s1-arrow-columnar' },
          { id: 's3-lazy-eager', title: 'Lazy vs Eager Evaluation', difficulty: 'intermediate', readingMinutes: 25, description: 'Query optimization through lazy execution.', buildsOn: '10-dataframes/c1-polars-internals/s2-series-dataframe' },
        ], },
      { id: 'c2-transformations', title: 'Data Transformations', description: 'Select, filter, group_by, join, and window functions.', difficulty: 'intermediate', estimatedMinutes: 225, sections: [
          { id: 's1-select-filter', title: 'Select, Filter, Group By', difficulty: 'intermediate', readingMinutes: 25, description: 'Core data manipulation operations.', buildsOn: '10-dataframes/c1-polars-internals/s3-lazy-eager' },
          { id: 's2-joins', title: 'Joins & Window Functions', difficulty: 'intermediate', readingMinutes: 25, description: 'Combining DataFrames and window computations.', buildsOn: '10-dataframes/c2-transformations/s1-select-filter' },
          { id: 's3-string-datetime', title: 'String & DateTime Operations', difficulty: 'intermediate', readingMinutes: 25, description: 'Text and temporal data processing.', buildsOn: '10-dataframes/c2-transformations/s2-joins' },
        ], },
      { id: 'c3-performance', title: 'Performance Patterns', description: 'Query optimization and streaming for large datasets.', difficulty: 'advanced', estimatedMinutes: 150, sections: [
          { id: 's1-query-optimization', title: 'Query Optimization', difficulty: 'advanced', readingMinutes: 25, description: 'Predicate pushdown and projection pruning.', buildsOn: '10-dataframes/c2-transformations/s3-string-datetime' },
          { id: 's2-streaming', title: 'Streaming Large Datasets', difficulty: 'advanced', readingMinutes: 25, description: 'Processing data larger than memory.', buildsOn: '10-dataframes/c3-performance/s1-query-optimization' },
        ], },
      { id: 'c4-pipelines', title: 'Building Data Pipelines', description: 'ETL patterns and data pipeline architecture in Rust.', difficulty: 'advanced', estimatedMinutes: 150, sections: [
          { id: 's1-chaining', title: 'Chaining Operations', difficulty: 'intermediate', readingMinutes: 25, description: 'Building composable data pipelines.', buildsOn: '10-dataframes/c3-performance/s2-streaming' },
          { id: 's2-etl', title: 'ETL Patterns in Rust', difficulty: 'advanced', readingMinutes: 25, description: 'Extract, transform, load patterns.', buildsOn: '10-dataframes/c4-pipelines/s1-chaining' },
        ], },
    ],
  },
  {
    id: '11-visualization', title: 'Visualization & Plotting', icon: '📈', colorHex: '#a855f7',
    description: 'Creating charts and plots with the plotters crate — Rust\'s answer to matplotlib for publication-quality graphics.',
    prerequisites: ['09-numerical'], mlRelevance: 70, estimatedHours: 10, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-plotters', title: 'Plotting with plotters', description: 'Creating publication-quality charts in Rust.', difficulty: 'intermediate', estimatedMinutes: 210, sections: [
          { id: 's1-basic-charts', title: 'Basic Charts', difficulty: 'intermediate', readingMinutes: 25, description: 'Line, scatter, and bar charts with plotters.', buildsOn: '09-numerical/c4-statistics/s2-statistical-functions' },
          { id: 's2-customizing', title: 'Customizing Plots', difficulty: 'intermediate', readingMinutes: 25, description: 'Colors, labels, legends, and styling.', buildsOn: '11-visualization/c1-plotters/s1-basic-charts' },
          { id: 's3-saving', title: 'Saving to PNG/SVG', difficulty: 'intermediate', readingMinutes: 20, description: 'Rendering to various output formats.', buildsOn: '11-visualization/c1-plotters/s2-customizing' },
        ], },
      { id: 'c2-interactive', title: 'Interactive Visualization', description: 'Web-based and real-time plotting.', difficulty: 'advanced', estimatedMinutes: 165, sections: [
          { id: 's1-web-plotting', title: 'Web-based Plotting', difficulty: 'advanced', readingMinutes: 25, description: 'Rendering charts for web applications.', buildsOn: '11-visualization/c1-plotters/s3-saving' },
          { id: 's2-realtime', title: 'Real-time Data Visualization', difficulty: 'advanced', readingMinutes: 30, description: 'Live-updating charts for streaming data.', buildsOn: '11-visualization/c2-interactive/s1-web-plotting' },
        ], },
    ],
  },
  {
    id: '12-ml-foundations', title: 'Machine Learning Foundations', icon: '🤖', colorHex: '#f97316',
    description: 'ML algorithms implemented in Rust — linear regression, gradient descent, candle tensors, and the linfa ML library (Rust\'s scikit-learn).',
    prerequisites: ['09-numerical'], mlRelevance: 96, estimatedHours: 25, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-ml-scratch', title: 'ML from Scratch', description: 'Implementing core ML algorithms in pure Rust.', difficulty: 'intermediate', estimatedMinutes: 255, sections: [
          { id: 's1-linear-regression', title: 'Linear Regression in Rust', difficulty: 'intermediate', readingMinutes: 30, description: 'OLS regression from scratch in Rust.', buildsOn: '09-numerical/c4-statistics/s2-statistical-functions' },
          { id: 's2-gradient-descent', title: 'Gradient Descent', difficulty: 'intermediate', readingMinutes: 30, description: 'Optimization from scratch with iterators.', buildsOn: '12-ml-foundations/c1-ml-scratch/s1-linear-regression' },
          { id: 's3-cross-validation', title: 'Cross-Validation', difficulty: 'intermediate', readingMinutes: 25, description: 'k-fold CV with Rust iterators.', buildsOn: '12-ml-foundations/c1-ml-scratch/s2-gradient-descent' },
        ], },
      { id: 'c2-tensors', title: 'Tensor Operations', description: 'The candle framework for tensor computation and autodiff.', difficulty: 'advanced', estimatedMinutes: 255, sections: [
          { id: 's1-candle-overview', title: 'candle Framework', difficulty: 'advanced', readingMinutes: 30, description: 'Hugging Face\'s Rust ML framework overview.', buildsOn: '12-ml-foundations/c1-ml-scratch/s3-cross-validation' },
          { id: 's2-tensor-ops', title: 'Tensor Creation & Operations', difficulty: 'advanced', readingMinutes: 25, description: 'Creating and manipulating tensors.', buildsOn: '12-ml-foundations/c2-tensors/s1-candle-overview' },
          { id: 's3-autodiff', title: 'Automatic Differentiation', difficulty: 'advanced', readingMinutes: 30, description: 'Backpropagation with candle\'s autograd.', buildsOn: '12-ml-foundations/c2-tensors/s2-tensor-ops' },
        ], },
      { id: 'c3-classical-ml', title: 'Classical ML', description: 'The linfa crate — scikit-learn for Rust.', difficulty: 'intermediate', estimatedMinutes: 225, sections: [
          { id: 's1-linfa', title: 'linfa Crate', difficulty: 'intermediate', readingMinutes: 25, description: 'Rust\'s scikit-learn equivalent.', buildsOn: '12-ml-foundations/c2-tensors/s3-autodiff' },
          { id: 's2-trees-knn', title: 'Decision Trees & k-NN', difficulty: 'intermediate', readingMinutes: 25, description: 'Tree-based models and nearest neighbors.', buildsOn: '12-ml-foundations/c3-classical-ml/s1-linfa' },
          { id: 's3-evaluation', title: 'Model Evaluation & Metrics', difficulty: 'intermediate', readingMinutes: 25, description: 'Accuracy, precision, recall, and ROC.', buildsOn: '12-ml-foundations/c3-classical-ml/s2-trees-knn' },
        ], },
      { id: 'c4-feature-engineering', title: 'Feature Engineering', description: 'Text tokenization and data transformations.', difficulty: 'intermediate', estimatedMinutes: 150, sections: [
          { id: 's1-tokenization', title: 'Text Tokenization', difficulty: 'intermediate', readingMinutes: 25, description: 'Fast text processing in Rust.', buildsOn: '12-ml-foundations/c3-classical-ml/s3-evaluation' },
          { id: 's2-encoding', title: 'Encoding & Transformations', difficulty: 'intermediate', readingMinutes: 25, description: 'One-hot, label encoding, and normalization.', buildsOn: '12-ml-foundations/c4-feature-engineering/s1-tokenization' },
        ], },
    ],
  },
  {
    id: '13-deep-learning', title: 'Deep Learning with Rust', icon: '🧬', colorHex: '#6366f1',
    description: 'Neural networks in Rust — from scratch implementations to candle and burn frameworks, plus ONNX runtime integration.',
    prerequisites: ['12-ml-foundations'], mlRelevance: 98, estimatedHours: 25, difficulty: 'advanced',
    chapters: [
      { id: 'c1-nn-scratch', title: 'Neural Networks from Scratch', description: 'Building a neural network from first principles in Rust.', difficulty: 'advanced', estimatedMinutes: 285, sections: [
          { id: 's1-forward-backprop', title: 'Forward Pass & Backprop', difficulty: 'advanced', readingMinutes: 35, description: 'Implementing forward and backward passes.', buildsOn: '12-ml-foundations/c4-feature-engineering/s2-encoding' },
          { id: 's2-layer-abstractions', title: 'Layer Abstractions', difficulty: 'advanced', readingMinutes: 30, description: 'Trait-based layer design.', buildsOn: '13-deep-learning/c1-nn-scratch/s1-forward-backprop' },
          { id: 's3-mnist', title: 'MNIST Example', difficulty: 'advanced', readingMinutes: 30, description: 'End-to-end MNIST digit recognition.', buildsOn: '13-deep-learning/c1-nn-scratch/s2-layer-abstractions' },
        ], },
      { id: 'c2-candle', title: 'Candle Deep Dive', description: 'Building and running models with HuggingFace candle.', difficulty: 'advanced', estimatedMinutes: 255, sections: [
          { id: 's1-model-building', title: 'Model Building with candle', difficulty: 'advanced', readingMinutes: 30, description: 'Defining neural network architectures.', buildsOn: '13-deep-learning/c1-nn-scratch/s3-mnist' },
          { id: 's2-pretrained', title: 'Loading Pretrained Weights', difficulty: 'advanced', readingMinutes: 25, description: 'Using HuggingFace model weights.', buildsOn: '13-deep-learning/c2-candle/s1-model-building' },
          { id: 's3-quantization', title: 'Quantization', difficulty: 'advanced', readingMinutes: 30, description: 'Model compression for faster inference.', buildsOn: '13-deep-learning/c2-candle/s2-pretrained' },
        ], },
      { id: 'c3-burn', title: 'Burn Framework', description: 'Backend-agnostic deep learning with Burn.', difficulty: 'advanced', estimatedMinutes: 165, sections: [
          { id: 's1-burn-design', title: "Burn's Backend-Agnostic Design", difficulty: 'advanced', readingMinutes: 25, description: 'Write once, run on any backend.', buildsOn: '13-deep-learning/c2-candle/s3-quantization' },
          { id: 's2-training', title: 'Training & Inference', difficulty: 'advanced', readingMinutes: 30, description: 'Training loops and inference with Burn.', buildsOn: '13-deep-learning/c3-burn/s1-burn-design' },
        ], },
      { id: 'c4-onnx', title: 'ONNX Runtime', description: 'Running ONNX models for production inference.', difficulty: 'advanced', estimatedMinutes: 150, sections: [
          { id: 's1-loading-onnx', title: 'Loading ONNX Models', difficulty: 'advanced', readingMinutes: 25, description: 'Using the ort crate for ONNX inference.', buildsOn: '13-deep-learning/c3-burn/s2-training' },
          { id: 's2-inference-serving', title: 'Inference Serving', difficulty: 'advanced', readingMinutes: 25, description: 'High-performance model serving.', buildsOn: '13-deep-learning/c4-onnx/s1-loading-onnx' },
        ], },
    ],
  },
  {
    id: '14-llm-ai', title: 'LLM & AI Engineering', icon: '💬', colorHex: '#0ea5e9',
    description: 'Tokenizers, embeddings, LLM inference, and AI infrastructure — building production AI systems in Rust.',
    prerequisites: ['13-deep-learning'], mlRelevance: 100, estimatedHours: 25, difficulty: 'advanced',
    chapters: [
      { id: 'c1-tokenizers', title: 'Tokenizers', description: 'HuggingFace tokenizers — the Rust-powered core.', difficulty: 'advanced', estimatedMinutes: 255, sections: [
          { id: 's1-hf-tokenizers', title: 'HuggingFace Tokenizers', difficulty: 'advanced', readingMinutes: 30, description: 'The Rust core behind HuggingFace tokenizers.', buildsOn: '13-deep-learning/c4-onnx/s2-inference-serving' },
          { id: 's2-bpe', title: 'BPE & WordPiece', difficulty: 'advanced', readingMinutes: 25, description: 'Implementing tokenization algorithms.', buildsOn: '14-llm-ai/c1-tokenizers/s1-hf-tokenizers' },
          { id: 's3-custom-tokenizers', title: 'Building Custom Tokenizers', difficulty: 'advanced', readingMinutes: 30, description: 'Creating domain-specific tokenizers.', buildsOn: '14-llm-ai/c1-tokenizers/s2-bpe' },
        ], },
      { id: 'c2-embeddings', title: 'Embedding & Vector Search', description: 'Vector similarity and ANN index construction.', difficulty: 'advanced', estimatedMinutes: 165, sections: [
          { id: 's1-vector-similarity', title: 'Vector Similarity in Rust', difficulty: 'advanced', readingMinutes: 25, description: 'Cosine similarity and distance functions.', buildsOn: '14-llm-ai/c1-tokenizers/s3-custom-tokenizers' },
          { id: 's2-ann-index', title: 'Building an ANN Index', difficulty: 'advanced', readingMinutes: 30, description: 'Approximate nearest neighbor search.', buildsOn: '14-llm-ai/c2-embeddings/s1-vector-similarity' },
        ], },
      { id: 'c3-llm-inference', title: 'LLM Inference', description: 'Running large language models efficiently in Rust.', difficulty: 'research', estimatedMinutes: 270, sections: [
          { id: 's1-running-llms', title: 'Running LLMs with candle', difficulty: 'research', readingMinutes: 35, description: 'Loading and running LLMs in Rust.', buildsOn: '14-llm-ai/c2-embeddings/s2-ann-index' },
          { id: 's2-kv-cache', title: 'KV-Cache Implementation', difficulty: 'research', readingMinutes: 30, description: 'Efficient key-value caching for autoregressive models.', buildsOn: '14-llm-ai/c3-llm-inference/s1-running-llms' },
          { id: 's3-sampling', title: 'Sampling Strategies', difficulty: 'advanced', readingMinutes: 25, description: 'Temperature, top-k, top-p sampling.', buildsOn: '14-llm-ai/c3-llm-inference/s2-kv-cache' },
        ], },
      { id: 'c4-ai-infrastructure', title: 'AI Infrastructure', description: 'Building production AI services with Rust.', difficulty: 'advanced', estimatedMinutes: 240, sections: [
          { id: 's1-api-servers', title: 'Building API Servers (axum)', difficulty: 'advanced', readingMinutes: 30, description: 'REST APIs with axum — compare to FastAPI.', buildsOn: '14-llm-ai/c3-llm-inference/s3-sampling' },
          { id: 's2-streaming', title: 'Streaming Responses', difficulty: 'advanced', readingMinutes: 25, description: 'SSE and streaming for LLM output.', buildsOn: '14-llm-ai/c4-ai-infrastructure/s1-api-servers' },
          { id: 's3-monitoring', title: 'Monitoring & Observability', difficulty: 'advanced', readingMinutes: 25, description: 'Tracing, metrics, and logging.', buildsOn: '14-llm-ai/c4-ai-infrastructure/s2-streaming' },
        ], },
    ],
  },
  {
    id: '15-pyo3-fundamentals', title: 'PyO3 Fundamentals', icon: '🐍', colorHex: '#eab308',
    description: 'Bridge Python and Rust with PyO3 — create Python modules in Rust, just like Polars, tokenizers, and ruff do.',
    prerequisites: ['03-type-system'], mlRelevance: 90, estimatedHours: 20, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-pyo3-basics', title: 'PyO3 Basics', description: 'Setting up a mixed Python/Rust project with maturin.', difficulty: 'intermediate', estimatedMinutes: 195, sections: [
          { id: 's1-what-is-pyo3', title: 'What Is PyO3', difficulty: 'intermediate', readingMinutes: 20, description: 'The Rust-Python bridge that powers the ecosystem.', buildsOn: '03-type-system/c5-advanced-types/s3-newtype' },
          { id: 's2-pyfunction', title: '#[pyfunction] & #[pyclass]', difficulty: 'intermediate', readingMinutes: 25, description: 'Exposing Rust functions and classes to Python.', buildsOn: '15-pyo3-fundamentals/c1-pyo3-basics/s1-what-is-pyo3' },
          { id: 's3-maturin', title: 'maturin Build Tool', difficulty: 'intermediate', readingMinutes: 20, description: 'Building and distributing Python packages with Rust.', buildsOn: '15-pyo3-fundamentals/c1-pyo3-basics/s2-pyfunction' },
        ], },
      { id: 'c2-type-conversions', title: 'Type Conversions', description: 'Mapping types between Python and Rust worlds.', difficulty: 'intermediate', estimatedMinutes: 225, sections: [
          { id: 's1-type-mapping', title: 'Python ↔ Rust Type Mapping', difficulty: 'intermediate', readingMinutes: 25, description: 'How Python types map to Rust types and vice versa.', buildsOn: '15-pyo3-fundamentals/c1-pyo3-basics/s3-maturin' },
          { id: 's2-collections', title: 'Converting Collections', difficulty: 'intermediate', readingMinutes: 25, description: 'Lists, dicts, and sets across the boundary.', buildsOn: '15-pyo3-fundamentals/c2-type-conversions/s1-type-mapping' },
          { id: 's3-error-handling', title: 'Error Handling Across Boundary', difficulty: 'intermediate', readingMinutes: 25, description: 'Converting Rust errors to Python exceptions.', buildsOn: '15-pyo3-fundamentals/c2-type-conversions/s2-collections' },
        ], },
      { id: 'c3-python-classes', title: 'Python Classes in Rust', description: 'Implementing Python class behavior in Rust.', difficulty: 'intermediate', estimatedMinutes: 150, sections: [
          { id: 's1-pymethods', title: '#[pymethods]', difficulty: 'intermediate', readingMinutes: 25, description: 'Adding methods to PyO3 classes.', buildsOn: '15-pyo3-fundamentals/c2-type-conversions/s3-error-handling' },
          { id: 's2-magic-methods', title: 'Magic Methods', difficulty: 'intermediate', readingMinutes: 25, description: '__repr__, __len__, __iter__ in Rust.', buildsOn: '15-pyo3-fundamentals/c3-python-classes/s1-pymethods' },
        ], },
      { id: 'c4-gil', title: 'GIL & Performance', description: 'Understanding and working around the GIL.', difficulty: 'advanced', estimatedMinutes: 225, sections: [
          { id: 's1-understanding-gil', title: 'Understanding the GIL', difficulty: 'advanced', readingMinutes: 25, description: 'What the GIL means for Rust extensions.', buildsOn: '15-pyo3-fundamentals/c3-python-classes/s2-magic-methods' },
          { id: 's2-releasing-gil', title: 'Releasing GIL for Rust', difficulty: 'advanced', readingMinutes: 25, description: 'Running Rust code without holding the GIL.', buildsOn: '15-pyo3-fundamentals/c4-gil/s1-understanding-gil' },
          { id: 's3-benchmarking', title: 'Benchmarking', difficulty: 'advanced', readingMinutes: 25, description: 'Measuring Python vs Rust performance.', buildsOn: '15-pyo3-fundamentals/c4-gil/s2-releasing-gil' },
        ], },
    ],
  },
  {
    id: '16-python-packages', title: 'Building Python Packages with Rust', icon: '📦', colorHex: '#22c55e',
    description: 'Ship Rust performance as pip-installable Python packages — the Polars, ruff, and tiktoken approach.',
    prerequisites: ['15-pyo3-fundamentals'], mlRelevance: 92, estimatedHours: 20, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-project-structure', title: 'Project Structure', description: 'Cargo workspaces and maturin project layout.', difficulty: 'intermediate', estimatedMinutes: 225, sections: [
          { id: 's1-workspace', title: 'Cargo Workspace + Python Package', difficulty: 'intermediate', readingMinutes: 25, description: 'Organizing mixed Rust/Python projects.', buildsOn: '15-pyo3-fundamentals/c4-gil/s3-benchmarking' },
          { id: 's2-maturin-layout', title: 'maturin Project Layout', difficulty: 'intermediate', readingMinutes: 25, description: 'pyproject.toml and Cargo.toml setup.', buildsOn: '16-python-packages/c1-project-structure/s1-workspace' },
          { id: 's3-ci-cd', title: 'CI/CD with GitHub Actions', difficulty: 'intermediate', readingMinutes: 25, description: 'Automated building and testing.', buildsOn: '16-python-packages/c1-project-structure/s2-maturin-layout' },
        ], },
      { id: 'c2-data-structures', title: 'Exposing Data Structures', description: 'Wrapping Rust structs and NumPy integration.', difficulty: 'advanced', estimatedMinutes: 255, sections: [
          { id: 's1-wrapping-structs', title: 'Wrapping Rust Structs', difficulty: 'advanced', readingMinutes: 25, description: 'Making Rust data structures available in Python.', buildsOn: '16-python-packages/c1-project-structure/s3-ci-cd' },
          { id: 's2-numpy-integration', title: 'NumPy Integration (rust-numpy)', difficulty: 'advanced', readingMinutes: 30, description: 'Zero-copy NumPy array access from Rust.', buildsOn: '16-python-packages/c2-data-structures/s1-wrapping-structs' },
          { id: 's3-zero-copy', title: 'Zero-Copy Data Sharing', difficulty: 'advanced', readingMinutes: 30, description: 'Sharing data without copying across the boundary.', buildsOn: '16-python-packages/c2-data-structures/s2-numpy-integration' },
        ], },
      { id: 'c3-polars-style', title: 'Building a Polars-Style Library', description: 'Designing fluent APIs exposed to Python.', difficulty: 'advanced', estimatedMinutes: 270, sections: [
          { id: 's1-fluent-api', title: 'Designing a Fluent API', difficulty: 'advanced', readingMinutes: 30, description: 'Method chaining patterns for Python APIs.', buildsOn: '16-python-packages/c2-data-structures/s3-zero-copy' },
          { id: 's2-lazy-evaluation', title: 'Lazy Evaluation Exposed to Python', difficulty: 'advanced', readingMinutes: 30, description: 'Deferred execution across the FFI boundary.', buildsOn: '16-python-packages/c3-polars-style/s1-fluent-api' },
          { id: 's3-expression-system', title: 'Expression System Design', difficulty: 'advanced', readingMinutes: 30, description: 'Building a Polars-like expression engine.', buildsOn: '16-python-packages/c3-polars-style/s2-lazy-evaluation' },
        ], },
      { id: 'c4-publishing', title: 'Publishing & Distribution', description: 'Building wheels and publishing to PyPI.', difficulty: 'intermediate', estimatedMinutes: 135, sections: [
          { id: 's1-wheels', title: 'Building Wheels', difficulty: 'intermediate', readingMinutes: 25, description: 'Cross-platform wheel building with maturin.', buildsOn: '16-python-packages/c3-polars-style/s3-expression-system' },
          { id: 's2-pypi', title: 'Publishing to PyPI', difficulty: 'intermediate', readingMinutes: 20, description: 'Distributing your Rust-powered Python package.', buildsOn: '16-python-packages/c4-publishing/s1-wheels' },
        ], },
    ],
  },
  {
    id: '17-integration-patterns', title: 'Real-World Integration Patterns', icon: '🔗', colorHex: '#ec4899',
    description: 'Production patterns for Python-Rust integration — accelerating bottlenecks, extending pandas/NumPy, and lessons from Polars.',
    prerequisites: ['16-python-packages'], mlRelevance: 94, estimatedHours: 20, difficulty: 'intermediate',
    chapters: [
      { id: 'c1-accelerating', title: 'Accelerating Python Code', description: 'Identifying and replacing Python bottlenecks with Rust.', difficulty: 'intermediate', estimatedMinutes: 240, sections: [
          { id: 's1-bottlenecks', title: 'Identifying Bottlenecks', difficulty: 'intermediate', readingMinutes: 25, description: 'Profiling Python to find Rust opportunities.', buildsOn: '16-python-packages/c4-publishing/s2-pypi' },
          { id: 's2-hot-loops', title: 'Replacing Hot Loops with Rust', difficulty: 'intermediate', readingMinutes: 30, description: 'Surgical Rust replacement for performance.', buildsOn: '17-integration-patterns/c1-accelerating/s1-bottlenecks' },
          { id: 's3-case-study', title: 'Case Study: 100x Speedups', difficulty: 'intermediate', readingMinutes: 25, description: 'Real-world performance transformation examples.', buildsOn: '17-integration-patterns/c1-accelerating/s2-hot-loops' },
        ], },
      { id: 'c2-extensions', title: 'Rust Extensions for pandas/NumPy', description: 'Extending Python\'s data science stack with Rust.', difficulty: 'advanced', estimatedMinutes: 180, sections: [
          { id: 's1-numpy-ufuncs', title: 'Writing NumPy ufuncs in Rust', difficulty: 'advanced', readingMinutes: 30, description: 'Universal functions powered by Rust.', buildsOn: '17-integration-patterns/c1-accelerating/s3-case-study' },
          { id: 's2-extension-array', title: 'pandas ExtensionArray in Rust', difficulty: 'advanced', readingMinutes: 30, description: 'Custom pandas dtypes backed by Rust.', buildsOn: '17-integration-patterns/c2-extensions/s1-numpy-ufuncs' },
        ], },
      { id: 'c3-ml-pipeline', title: 'ML Pipeline Components', description: 'Rust-powered components for ML pipelines.', difficulty: 'advanced', estimatedMinutes: 240, sections: [
          { id: 's1-rust-tokenizer', title: 'Rust Tokenizer for Python NLP', difficulty: 'advanced', readingMinutes: 30, description: 'Building a fast tokenizer exposed to Python.', buildsOn: '17-integration-patterns/c2-extensions/s2-extension-array' },
          { id: 's2-data-loaders', title: 'Custom Data Loaders', difficulty: 'advanced', readingMinutes: 25, description: 'Fast data loading for training pipelines.', buildsOn: '17-integration-patterns/c3-ml-pipeline/s1-rust-tokenizer' },
          { id: 's3-preprocessing', title: 'Preprocessing at Scale', difficulty: 'advanced', readingMinutes: 25, description: 'Parallel preprocessing with Rayon from Python.', buildsOn: '17-integration-patterns/c3-ml-pipeline/s2-data-loaders' },
        ], },
      { id: 'c4-production', title: 'Production Patterns', description: 'Best practices from production Rust-Python projects.', difficulty: 'advanced', estimatedMinutes: 240, sections: [
          { id: 's1-error-handling', title: 'Error Handling Across Python/Rust', difficulty: 'advanced', readingMinutes: 25, description: 'Robust error handling across the FFI boundary.', buildsOn: '17-integration-patterns/c3-ml-pipeline/s3-preprocessing' },
          { id: 's2-memory-management', title: 'Memory Management Best Practices', difficulty: 'advanced', readingMinutes: 25, description: 'Avoiding leaks and managing shared memory.', buildsOn: '17-integration-patterns/c4-production/s1-error-handling' },
          { id: 's3-polars-case-study', title: 'Case Study: How Polars Does It', difficulty: 'advanced', readingMinutes: 30, description: 'Architecture lessons from the Polars project.', buildsOn: '17-integration-patterns/c4-production/s2-memory-management' },
        ], },
    ],
  },
];

// ── Helper functions ──

export function getCurriculumById(subjectId) {
  return CURRICULUM.find((s) => s.id === subjectId) || null;
}

export function getChapterById(subjectId, chapterId) {
  const subject = getCurriculumById(subjectId);
  if (!subject) return null;
  return subject.chapters.find((c) => c.id === chapterId) || null;
}

export function getSectionById(subjectId, chapterId, sectionId) {
  const chapter = getChapterById(subjectId, chapterId);
  if (!chapter) return null;
  return chapter.sections.find((s) => s.id === sectionId) || null;
}

export function getSubjectSectionCount(subjectId) {
  const subject = getCurriculumById(subjectId);
  if (!subject) return 0;
  return subject.chapters.reduce((acc, ch) => acc + (ch.sections?.length || 0), 0);
}

export function getAdjacentSections(subjectId, chapterId, sectionId) {
  const flat = [];
  for (const subject of CURRICULUM) {
    for (const ch of subject.chapters) {
      for (const sec of ch.sections || []) {
        flat.push({
          title: sec.title,
          subjectId: subject.id,
          subjectTitle: subject.title,
          chapterId: ch.id,
          sectionId: sec.id,
        });
      }
    }
  }

  const idx = flat.findIndex(
    (s) => s.subjectId === subjectId && s.chapterId === chapterId && s.sectionId === sectionId
  );

  if (idx === -1) return { prev: null, next: null };

  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;

  if (prev && prev.subjectId !== subjectId) {
    prev.crossesSubject = true;
  }
  if (next && next.subjectId !== subjectId) {
    next.crossesSubject = true;
  }

  return { prev, next };
}

export function resolveBuildsOn(buildsOnPath) {
  if (!buildsOnPath) return null;
  const parts = buildsOnPath.split('/');
  if (parts.length !== 3) return null;

  const [subjId, chapId, secId] = parts;
  const subject = getCurriculumById(subjId);
  if (!subject) return null;
  const chapter = subject.chapters.find((c) => c.id === chapId);
  if (!chapter) return null;
  const section = chapter.sections?.find((s) => s.id === secId);
  if (!section) return null;

  return {
    title: section.title,
    subjectId: subjId,
    subjectTitle: subject.title,
    chapterId: chapId,
    chapterTitle: chapter.title,
    sectionId: secId,
  };
}

export default CURRICULUM;
