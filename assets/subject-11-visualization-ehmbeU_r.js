import{j as e}from"./vendor-Dh_dlHsl.js";import{C as r,P as s,N as a,a as t,E as i}from"./subject-01-getting-started-DoSDK0Fn.js";function o(){return e.jsxs("div",{className:"prose-rust",children:[e.jsx("h1",{children:"Basic Charts with Plotters"}),e.jsxs("p",{children:["Python's matplotlib is the gold standard for data visualization. Rust's ",e.jsx("code",{children:"plotters"})," crate provides similar charting capabilities with a builder-pattern API. While not as mature as matplotlib, plotters can generate publication-quality charts as PNG, SVG, or even render to a WebAssembly canvas."]}),e.jsx(r,{title:"Plotters Overview",children:e.jsxs("p",{children:[e.jsx("code",{children:"plotters"})," uses a layered approach: you create a drawing backend (PNG, SVG, or HTML canvas), then build a chart context on top, then draw series onto it. The API favors method chaining and Rust's type system ensures you cannot draw incompatible data types on the same axis."]})}),e.jsx("h2",{children:"Line Chart: matplotlib vs plotters"}),e.jsx(s,{title:"Drawing a simple line chart",description:"Both libraries follow a similar workflow: create figure, set up axes, plot data, save.",pythonCode:`import matplotlib.pyplot as plt
import numpy as np

# Generate data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Create chart
plt.figure(figsize=(8, 5))
plt.plot(x, y, label="sin(x)", color="blue")
plt.title("Sine Wave")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid(True)
plt.savefig("sine.png", dpi=150)
plt.show()`,rustCode:`use plotters::prelude::*;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Generate data
    let x: Vec<f64> = (0..100)
        .map(|i| i as f64 * 0.1)
        .collect();
    let y: Vec<f64> = x.iter()
        .map(|&xi| xi.sin())
        .collect();

    // Create PNG backend
    let root = BitMapBackend::new("sine.png", (800, 500))
        .into_drawing_area();
    root.fill(&WHITE)?;

    // Build chart
    let mut chart = ChartBuilder::on(&root)
        .caption("Sine Wave", ("sans-serif", 30))
        .margin(10)
        .x_label_area_size(40)
        .y_label_area_size(50)
        .build_cartesian_2d(0.0..10.0, -1.5..1.5)?;

    // Draw grid and axes
    chart.configure_mesh()
        .x_desc("x")
        .y_desc("y")
        .draw()?;

    // Plot the line
    chart.draw_series(
        LineSeries::new(
            x.iter().zip(y.iter()).map(|(&xi, &yi)| (xi, yi)),
            &BLUE,
        )
    )?.label("sin(x)")
      .legend(|(x, y)| {
          PathElement::new(vec![(x, y), (x + 20, y)], &BLUE)
      });

    chart.configure_series_labels()
        .draw()?;

    root.present()?;
    Ok(())
}`}),e.jsxs(a,{type:"pythonista",title:"Builder pattern instead of pyplot",children:["matplotlib uses a stateful API (",e.jsx("code",{children:"plt.plot()"}),","," ",e.jsx("code",{children:"plt.title()"}),"). Plotters uses the builder pattern: you chain method calls to configure the chart, then draw data onto it. This is more verbose but less error-prone — the compiler catches type mismatches between your data and axis configuration."]}),e.jsx("h2",{children:"Scatter Plot"}),e.jsx(t,{language:"rust",title:"Scatter plot with colored points",code:`use plotters::prelude::*;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let root = BitMapBackend::new("scatter.png", (800, 600))
        .into_drawing_area();
    root.fill(&WHITE)?;

    // Generate sample data (two clusters)
    let cluster_a: Vec<(f64, f64)> = (0..50)
        .map(|i| {
            let t = i as f64 * 0.1;
            (2.0 + t.sin() * 0.5, 3.0 + t.cos() * 0.5)
        })
        .collect();

    let cluster_b: Vec<(f64, f64)> = (0..50)
        .map(|i| {
            let t = i as f64 * 0.1;
            (5.0 + t.cos() * 0.8, 6.0 + t.sin() * 0.8)
        })
        .collect();

    let mut chart = ChartBuilder::on(&root)
        .caption("Cluster Scatter Plot", ("sans-serif", 28))
        .margin(15)
        .x_label_area_size(40)
        .y_label_area_size(50)
        .build_cartesian_2d(0.0..8.0, 0.0..8.0)?;

    chart.configure_mesh().draw()?;

    // Draw cluster A (blue circles)
    chart.draw_series(
        cluster_a.iter().map(|&(x, y)| {
            Circle::new((x, y), 4, BLUE.mix(0.7).filled())
        })
    )?.label("Cluster A");

    // Draw cluster B (red circles)
    chart.draw_series(
        cluster_b.iter().map(|&(x, y)| {
            Circle::new((x, y), 4, RED.mix(0.7).filled())
        })
    )?.label("Cluster B");

    chart.configure_series_labels()
        .background_style(WHITE.mix(0.8))
        .border_style(BLACK)
        .draw()?;

    root.present()?;
    println!("Saved scatter.png");
    Ok(())
}`}),e.jsx("h2",{children:"Bar Chart"}),e.jsx(t,{language:"rust",title:"Bar chart with labels",code:`use plotters::prelude::*;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let root = BitMapBackend::new("bars.png", (800, 500))
        .into_drawing_area();
    root.fill(&WHITE)?;

    let categories = ["Python", "Rust", "Go", "Java", "C++"];
    let values = [85.0, 92.0, 78.0, 70.0, 65.0];
    let colors = [BLUE, RED, GREEN, YELLOW, CYAN];

    let mut chart = ChartBuilder::on(&root)
        .caption("Performance Scores", ("sans-serif", 28))
        .margin(15)
        .x_label_area_size(50)
        .y_label_area_size(50)
        .build_cartesian_2d(
            // Segmented axis for categories
            (0..categories.len()).into_segmented(),
            0.0..100.0,
        )?;

    chart.configure_mesh()
        .x_labels(categories.len())
        .x_label_formatter(&|idx| {
            match idx {
                SegmentValue::CenterOf(i) => {
                    categories.get(*i)
                        .unwrap_or(&"")
                        .to_string()
                }
                _ => String::new(),
            }
        })
        .y_desc("Score")
        .draw()?;

    chart.draw_series(
        values.iter().enumerate().map(|(i, &val)| {
            let color = colors[i].mix(0.8);
            Rectangle::new(
                [
                    (SegmentValue::Exact(i), 0.0),
                    (SegmentValue::Exact(i + 1), val),
                ],
                color.filled(),
            )
        })
    )?;

    root.present()?;
    println!("Saved bars.png");
    Ok(())
}`}),e.jsxs(a,{type:"tip",title:"SVG for vector output",children:["Replace ",e.jsx("code",{children:"BitMapBackend::new"})," with"," ",e.jsx("code",{children:'SVGBackend::new("chart.svg", (800, 600))'})," for scalable vector graphics — perfect for papers and presentations. The API is identical; only the backend changes."]}),e.jsx(t,{language:"toml",title:"Cargo.toml",code:`[dependencies]
plotters = "0.3"`}),e.jsx(i,{title:"Training Loss Curve",difficulty:"intermediate",problem:`Create a line chart showing a simulated training loss curve:

1. Generate 100 "epochs" (x-axis: 0 to 99)
2. Simulate training loss: 2.0 * exp(-x/30) + 0.1 (exponential decay)
3. Simulate validation loss: 2.0 * exp(-x/30) + 0.2 + sin(x/5)*0.05 (slightly higher, noisy)
4. Plot both curves (training in blue, validation in red)
5. Add a title "Training Progress", axis labels, and legend
6. Save as "training_loss.png"

Use f64::exp() for the exponential.`,solution:`use plotters::prelude::*;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let epochs: Vec<f64> = (0..100).map(|i| i as f64).collect();

    let train_loss: Vec<f64> = epochs.iter()
        .map(|&e| 2.0 * (-e / 30.0).exp() + 0.1)
        .collect();

    let val_loss: Vec<f64> = epochs.iter()
        .map(|&e| 2.0 * (-e / 30.0).exp() + 0.2 + (e / 5.0).sin() * 0.05)
        .collect();

    let root = BitMapBackend::new("training_loss.png", (800, 500))
        .into_drawing_area();
    root.fill(&WHITE)?;

    let mut chart = ChartBuilder::on(&root)
        .caption("Training Progress", ("sans-serif", 28))
        .margin(10)
        .x_label_area_size(40)
        .y_label_area_size(50)
        .build_cartesian_2d(0.0..100.0, 0.0..2.5)?;

    chart.configure_mesh()
        .x_desc("Epoch")
        .y_desc("Loss")
        .draw()?;

    chart.draw_series(LineSeries::new(
        epochs.iter().zip(train_loss.iter()).map(|(&x, &y)| (x, y)),
        &BLUE,
    ))?.label("Train Loss")
      .legend(|(x, y)| PathElement::new(vec![(x, y), (x + 20, y)], &BLUE));

    chart.draw_series(LineSeries::new(
        epochs.iter().zip(val_loss.iter()).map(|(&x, &y)| (x, y)),
        &RED,
    ))?.label("Val Loss")
      .legend(|(x, y)| PathElement::new(vec![(x, y), (x + 20, y)], &RED));

    chart.configure_series_labels()
        .background_style(WHITE.mix(0.8))
        .border_style(BLACK)
        .draw()?;

    root.present()?;
    println!("Saved training_loss.png");
    Ok(())
}`})]})}export{o as default};
