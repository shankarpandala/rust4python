import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function RandDistr() {
  return (
    <div className="prose-rust">
      <h1>rand &amp; rand_distr — Random Numbers &amp; Distributions</h1>

      <p>
        Random number generation is essential for ML: weight initialization,
        data shuffling, Monte Carlo sampling, and stochastic algorithms.
        Rust's <code>rand</code> crate is fast, flexible, and reproducible.
        Combined with <code>rand_distr</code>, it covers the same ground as
        Python's <code>random</code>, <code>numpy.random</code>, and{' '}
        <code>scipy.stats</code>.
      </p>

      <ConceptBlock title="Rust's Random Ecosystem">
        <p>
          <code>rand</code> provides the core RNG traits and basic distributions.{' '}
          <code>rand_distr</code> adds statistical distributions (Normal, Poisson,
          Gamma, etc.). Unlike Python's global random state, Rust makes you
          pass an RNG explicitly, which makes code reproducible and thread-safe
          by design.
        </p>
      </ConceptBlock>

      <h2>Basic Random Numbers</h2>

      <PythonRustCompare
        title="Generating random values"
        description="Both languages provide simple random number generation, but Rust makes the RNG explicit."
        pythonCode={`import random
import numpy as np

# Basic random numbers
x = random.random()           # float in [0, 1)
n = random.randint(1, 100)    # int in [1, 100]
f = random.uniform(-1.0, 1.0) # float in [-1, 1]

# NumPy arrays of random numbers
arr = np.random.rand(5)       # 5 uniform floats
normals = np.random.randn(1000) # 1000 standard normals

# Seeded for reproducibility
rng = np.random.default_rng(42)
data = rng.random(10)

# Shuffle
items = [1, 2, 3, 4, 5]
random.shuffle(items)

# Choice
pick = random.choice(items)`}
        rustCode={`use rand::prelude::*;

fn main() {
    let mut rng = rand::rng();

    // Basic random numbers
    let x: f64 = rng.random();          // [0, 1)
    let n: u32 = rng.random_range(1..=100); // [1, 100]
    let f: f64 = rng.random_range(-1.0..1.0);

    // Array of random floats
    let arr: Vec<f64> = (0..5)
        .map(|_| rng.random())
        .collect();

    // Seeded for reproducibility
    use rand::rngs::StdRng;
    use rand::SeedableRng;
    let mut seeded = StdRng::seed_from_u64(42);
    let data: Vec<f64> = (0..10)
        .map(|_| seeded.random())
        .collect();

    // Shuffle
    let mut items = vec![1, 2, 3, 4, 5];
    items.shuffle(&mut rng);

    // Choice
    let pick = items.choose(&mut rng).unwrap();
    println!("pick: {}", pick);
}`}
      />

      <NoteBlock type="pythonista" title="Explicit RNG = reproducibility">
        Python's <code>random</code> uses a global state, making it hard to
        ensure reproducibility in multi-threaded code. Rust forces you to
        pass the RNG explicitly. This makes it impossible to accidentally
        share random state between threads — each thread can have its own
        seeded RNG.
      </NoteBlock>

      <h2>Statistical Distributions</h2>

      <PythonRustCompare
        title="Sampling from distributions"
        description="rand_distr provides the same distributions as scipy.stats and numpy.random."
        pythonCode={`import numpy as np
from scipy import stats

rng = np.random.default_rng(42)

# Normal / Gaussian
samples = rng.normal(loc=0, scale=1, size=1000)

# Uniform
uniform = rng.uniform(low=-5, high=5, size=100)

# Bernoulli / binomial
flips = rng.binomial(n=1, p=0.7, size=100)

# Poisson
events = rng.poisson(lam=3.0, size=100)

# Exponential
waits = rng.exponential(scale=1/2.0, size=100)

print(f"Normal mean: {samples.mean():.3f}")
print(f"Normal std:  {samples.std():.3f}")`}
        rustCode={`use rand::prelude::*;
use rand_distr::{Normal, Uniform, Bernoulli, Poisson, Exp};

fn main() {
    let mut rng = rand::rng();

    // Normal / Gaussian
    let normal = Normal::new(0.0, 1.0).unwrap();
    let samples: Vec<f64> = (0..1000)
        .map(|_| normal.sample(&mut rng))
        .collect();

    // Uniform
    let uniform = Uniform::new(-5.0_f64, 5.0).unwrap();
    let u_samples: Vec<f64> = (0..100)
        .map(|_| uniform.sample(&mut rng))
        .collect();

    // Bernoulli
    let coin = Bernoulli::new(0.7).unwrap();
    let flips: Vec<bool> = (0..100)
        .map(|_| coin.sample(&mut rng))
        .collect();

    // Poisson
    let pois = Poisson::new(3.0).unwrap();
    let events: Vec<u64> = (0..100)
        .map(|_| pois.sample(&mut rng))
        .collect();

    let mean: f64 = samples.iter().sum::<f64>()
        / samples.len() as f64;
    println!("Normal mean: {:.3}", mean);
}`}
      />

      <h2>Weighted Sampling and Random Matrices</h2>

      <CodeBlock
        language="rust"
        title="Advanced random patterns for ML"
        code={`use rand::prelude::*;
use rand_distr::Normal;

fn main() {
    let mut rng = rand::rng();

    // Xavier/Glorot initialization (common in neural nets)
    let fan_in = 784;
    let fan_out = 256;
    let std_dev = (2.0 / (fan_in + fan_out) as f64).sqrt();
    let xavier = Normal::new(0.0, std_dev).unwrap();

    // Random weight matrix
    let weights: Vec<Vec<f64>> = (0..fan_out)
        .map(|_| {
            (0..fan_in)
                .map(|_| xavier.sample(&mut rng))
                .collect()
        })
        .collect();

    println!("Weight matrix: {} x {}", weights.len(), weights[0].len());
    println!("Sample weight: {:.6}", weights[0][0]);

    // Weighted random choice
    use rand::distr::weighted::WeightedIndex;
    let choices = ["cat", "dog", "bird"];
    let probs = [0.5, 0.3, 0.2];
    let dist = WeightedIndex::new(&probs).unwrap();

    let picks: Vec<&str> = (0..10)
        .map(|_| choices[dist.sample(&mut rng)])
        .collect();
    println!("Picks: {:?}", picks);

    // Train/test split indices
    let n = 1000;
    let mut indices: Vec<usize> = (0..n).collect();
    indices.shuffle(&mut rng);
    let (train_idx, test_idx) = indices.split_at(800);
    println!("Train: {} samples, Test: {} samples",
             train_idx.len(), test_idx.len());
}`}
      />

      <NoteBlock type="tip" title="Cargo.toml setup">
        Add both crates: <code>rand = "0.9"</code> and{' '}
        <code>rand_distr = "0.5"</code>. The <code>rand</code> crate alone
        gives you uniform distributions and shuffling; <code>rand_distr</code>
        adds Normal, Poisson, Exponential, Gamma, and many more.
      </NoteBlock>

      <ExerciseBlock
        title="Monte Carlo Pi Estimation"
        difficulty="intermediate"
        problem={`Estimate Pi using the Monte Carlo method:

1. Generate 1,000,000 random (x, y) points where x, y are in [-1, 1]
2. Count how many fall inside the unit circle (x² + y² <= 1)
3. Pi ≈ 4 × (points inside circle / total points)

Use a seeded RNG (seed 42) for reproducibility. Print your estimate.

Bonus: Use Rayon's par_iter to parallelize the generation.`}
        solution={`use rand::prelude::*;
use rand::rngs::StdRng;
use rand::SeedableRng;
use rand_distr::Uniform;

fn main() {
    let n = 1_000_000;
    let mut rng = StdRng::seed_from_u64(42);
    let dist = Uniform::new(-1.0_f64, 1.0).unwrap();

    let inside = (0..n)
        .filter(|_| {
            let x: f64 = dist.sample(&mut rng);
            let y: f64 = dist.sample(&mut rng);
            x * x + y * y <= 1.0
        })
        .count();

    let pi_estimate = 4.0 * inside as f64 / n as f64;
    println!("Pi estimate: {:.6}", pi_estimate);
    println!("Actual Pi:   {:.6}", std::f64::consts::PI);
    println!("Error:       {:.6}",
             (pi_estimate - std::f64::consts::PI).abs());

    // With Rayon (bonus):
    // use rayon::prelude::*;
    // let inside: usize = (0..n)
    //     .into_par_iter()
    //     .map_init(
    //         || StdRng::seed_from_u64(42),
    //         |rng, _| {
    //             let x: f64 = dist.sample(rng);
    //             let y: f64 = dist.sample(rng);
    //             if x*x + y*y <= 1.0 { 1 } else { 0 }
    //         }
    //     )
    //     .sum();
}`}
      />
    </div>
  );
}
