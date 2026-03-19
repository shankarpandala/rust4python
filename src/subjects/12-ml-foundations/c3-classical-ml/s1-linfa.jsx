import CodeBlock from '../../../components/content/CodeBlock.jsx';
import ConceptBlock from '../../../components/content/ConceptBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import ExerciseBlock from '../../../components/content/ExerciseBlock.jsx';
import PythonRustCompare from '../../../components/content/PythonRustCompare.jsx';

export default function LinfaCrate() {
  return (
    <div className="prose-rust">
      <h1>linfa — Rust's scikit-learn</h1>

      <p>
        If scikit-learn is your go-to for classical ML in Python,{' '}
        <code>linfa</code> is the Rust equivalent. It provides a familiar
        fit/predict API for algorithms like k-means, linear regression, PCA,
        decision trees, and more. Built on <code>ndarray</code>, it integrates
        naturally with Rust's numerical ecosystem.
      </p>

      <ConceptBlock title="linfa's Design">
        <p>
          linfa follows scikit-learn's design philosophy: datasets, estimators,
          and transformers. You create a <code>Dataset</code> from features
          and targets, fit a model, then predict. Each algorithm lives in its
          own sub-crate (e.g., <code>linfa-clustering</code>,{' '}
          <code>linfa-linear</code>), so you only include what you need.
        </p>
      </ConceptBlock>

      <h2>K-Means Clustering</h2>

      <PythonRustCompare
        title="K-Means clustering"
        description="The workflow is the same: create data, fit model, predict clusters."
        pythonCode={`from sklearn.cluster import KMeans
import numpy as np

# Generate sample data
np.random.seed(42)
cluster1 = np.random.randn(50, 2) + [2, 2]
cluster2 = np.random.randn(50, 2) + [-2, -2]
cluster3 = np.random.randn(50, 2) + [2, -2]
X = np.vstack([cluster1, cluster2, cluster3])

# Fit K-Means
model = KMeans(n_clusters=3, random_state=42)
model.fit(X)

# Predict
labels = model.labels_
centers = model.cluster_centers_

print(f"Labels: {labels[:10]}")
print(f"Centers:\\n{centers}")
print(f"Inertia: {model.inertia_:.2f}")`}
        rustCode={`use linfa::prelude::*;
use linfa_clustering::KMeans;
use ndarray::{array, Array2, Axis};

fn main() {
    // Generate sample data (3 clusters)
    let mut data = Vec::new();
    for i in 0..50 {
        let t = i as f64 * 0.1;
        data.push([2.0 + t.sin()*0.5, 2.0 + t.cos()*0.5]);
        data.push([-2.0 + t.cos()*0.5, -2.0 + t.sin()*0.5]);
        data.push([2.0 + t.sin()*0.5, -2.0 + t.cos()*0.5]);
    }
    let features = Array2::from_shape_vec(
        (150, 2),
        data.into_iter().flatten().collect()
    ).unwrap();

    let dataset = DatasetBase::from(features);

    // Fit K-Means
    let model = KMeans::params(3)
        .max_n_iterations(100)
        .fit(&dataset)
        .unwrap();

    // Predict cluster labels
    let predictions = model.predict(&dataset);
    let labels = predictions.targets();

    println!("First 10 labels: {:?}", &labels[..10]);
    println!("Centroids:\\n{:.2}", model.centroids());
}`}
      />

      <NoteBlock type="pythonista" title="Sub-crate per algorithm">
        Unlike scikit-learn which ships everything in one package, linfa splits
        algorithms into sub-crates. This is the Rust way — you only compile
        and include the algorithms you actually use, keeping binary size small
        and build times short.
      </NoteBlock>

      <h2>Linear Regression with linfa</h2>

      <CodeBlock
        language="rust"
        title="Ordinary Least Squares regression"
        code={`use linfa::prelude::*;
use linfa_linear::LinearRegression;
use ndarray::{array, Array1, Array2};

fn main() {
    // Features: 2D (e.g., size and rooms)
    let features = array![
        [1.0, 1.0],
        [2.0, 1.5],
        [3.0, 2.0],
        [4.0, 2.5],
        [5.0, 3.0],
        [6.0, 3.5],
        [7.0, 4.0],
        [8.0, 4.5],
    ];

    // Target: price
    let targets = array![150.0, 200.0, 250.0, 300.0,
                         350.0, 400.0, 450.0, 500.0];

    let dataset = Dataset::new(features, targets);

    // Fit linear regression
    let model = LinearRegression::default()
        .fit(&dataset)
        .unwrap();

    // Predict
    let new_data = array![[9.0, 5.0], [10.0, 5.5]];
    let predictions = model.predict(&new_data);

    println!("Predictions: {:.1}", predictions);
    // Should predict values around 550 and 600

    // Model parameters
    println!("Coefficients: {:.4}", model.params());
    println!("Intercept: {:.4}", model.intercept());
}`}
      />

      <h2>PCA Dimensionality Reduction</h2>

      <CodeBlock
        language="rust"
        title="PCA for feature reduction"
        code={`use linfa::prelude::*;
use linfa_reduction::Pca;
use ndarray::Array2;

fn main() {
    // 100 samples, 5 features
    let n = 100;
    let features: Vec<f64> = (0..n * 5)
        .map(|i| {
            let row = i / 5;
            let col = i % 5;
            // Features are correlated — PCA will find structure
            (row as f64 * 0.1) + (col as f64 * 0.5)
                + ((i as f64) * 0.3).sin() * 0.1
        })
        .collect();

    let data = Array2::from_shape_vec((n, 5), features).unwrap();
    let dataset = DatasetBase::from(data);

    // Reduce to 2 dimensions
    let pca = Pca::params(2)
        .fit(&dataset)
        .unwrap();

    let reduced = pca.predict(&dataset);
    println!("Original shape: ({}, 5)", n);
    println!("Reduced shape:  {:?}", reduced.targets().shape());
    println!("Explained variance ratio: {:.4}",
             pca.explained_variance_ratio());
}`}
      />

      <h2>Cargo.toml Setup</h2>

      <CodeBlock
        language="toml"
        title="Adding linfa to your project"
        code={`[dependencies]
linfa = "0.7"
ndarray = "0.16"

# Pick the algorithms you need:
linfa-clustering = "0.7"   # K-Means, DBSCAN, Gaussian Mixture
linfa-linear = "0.7"       # Linear & Ridge Regression
linfa-reduction = "0.7"    # PCA, SVD
linfa-trees = "0.7"        # Decision Trees, Random Forest
linfa-logistic = "0.7"     # Logistic Regression
linfa-svm = "0.7"          # Support Vector Machines
linfa-preprocessing = "0.7" # StandardScaler, MinMaxScaler`}
      />

      <NoteBlock type="tip" title="When to use linfa vs other options">
        Use linfa for classical ML when you want a pure Rust solution with
        no Python or C++ dependency. For deep learning, use candle or burn.
        For production serving of scikit-learn models, consider exporting
        to ONNX and using the <code>ort</code> crate for inference.
      </NoteBlock>

      <ExerciseBlock
        title="Complete ML Pipeline"
        difficulty="advanced"
        problem={`Build a mini ML pipeline in Rust:

1. Generate a synthetic classification dataset (2 features, 2 classes)
   - Class 0: points centered around (1, 1)
   - Class 1: points centered around (3, 3)
   - 50 points per class
2. Split into training (80%) and test (20%) sets
3. Fit a model using linfa (K-Means with k=2 works as a simple classifier here)
4. Evaluate accuracy on the test set

This mimics the scikit-learn workflow:
  X_train, X_test, y_train, y_test = train_test_split(X, y)`}
        solution={`use linfa::prelude::*;
use linfa_clustering::KMeans;
use ndarray::{Array2, Array1, s};

fn main() {
    // Generate synthetic 2-class data
    let n_per_class = 50;
    let mut features = Vec::new();
    let mut labels = Vec::new();

    for i in 0..n_per_class {
        let t = i as f64 * 0.1;
        // Class 0: centered at (1, 1)
        features.push(1.0 + t.sin() * 0.3);
        features.push(1.0 + t.cos() * 0.3);
        labels.push(0_usize);

        // Class 1: centered at (3, 3)
        features.push(3.0 + t.cos() * 0.3);
        features.push(3.0 + t.sin() * 0.3);
        labels.push(1_usize);
    }

    let n_total = n_per_class * 2;
    let x = Array2::from_shape_vec((n_total, 2), features).unwrap();
    let y = Array1::from_vec(labels);

    // Split 80/20
    let split = (n_total as f64 * 0.8) as usize;
    let x_train = x.slice(s![..split, ..]).to_owned();
    let x_test = x.slice(s![split.., ..]).to_owned();
    let y_test = y.slice(s![split..]).to_owned();

    // Fit K-Means (k=2)
    let dataset = DatasetBase::from(x_train);
    let model = KMeans::params(2)
        .max_n_iterations(100)
        .fit(&dataset)
        .unwrap();

    // Predict on test set
    let test_dataset = DatasetBase::from(x_test);
    let predictions = model.predict(&test_dataset);
    let pred_labels = predictions.targets();

    // Compute accuracy (labels may be swapped)
    let correct: usize = pred_labels.iter()
        .zip(y_test.iter())
        .filter(|(&p, &y)| p == y)
        .count();
    let accuracy = correct as f64 / y_test.len() as f64;

    // K-Means may swap label assignments, check both ways
    let accuracy = accuracy.max(1.0 - accuracy);
    println!("Test accuracy: {:.1}%", accuracy * 100.0);
}`}
      />
    </div>
  );
}
