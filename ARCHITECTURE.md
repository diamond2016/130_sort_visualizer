## Frontend 
1. Frontend only architecture

The "Interactivity" Requirement: Step 3 requires "Pause," "Resume," and "Step Forward." If the algorithm is running on a backend, the backend has to finish the whole sort and send you a massive list of events, or you have to manage complex WebSocket connections to "pause" a running process on a server.

The "Latency" Problem: If you want to animate 1,000 elements, you might generate 10,000 "compare" events. Sending 10,000 JSON objects over HTTP from a Python backend to a Vue frontend is actually quite slow and heavy.

The "Generator" Pattern: The challenge specifically suggests using Generators (a feature of TypeScript/JavaScript). Generators allow you to "yield" control back to the UI. This is incredibly easy to do in the browser but very difficult to coordinate between a Client and a Server.

The ideal architecture:
- Logic Layer (TypeScript): An Algorithm class that uses yield to emit events (Compare, Swap, Write).
- State Layer (Vue/TypeScript): A store (like Pinia or just a reactive object) that holds the current array and the current statistics.
- Rendering Layer (HTML5 Canvas): A component that listens to the state and draws the bars.


1. Managing Graphics

 **HTML5 Canvas API**.

→ Canvas: ctx.fillRect(x, y, width, height)
Turtle: turtle.color("red") 
→
→ Canvas: ctx.fillStyle = "red"
A tiny preview of how your Vue component might look

```

3. TypeScript Generators
To satisfy Step 4 of the challenge, you shouldn't just write a function that sorts. You should write a Generator Function. This is the "magic" that makes the animation possible.

Instead of this:
```ts
function bubbleSort(arr) {
  // ... logic ...
  // Problem: How does the UI know when a swap happened?
}
```

## Sorting and stepping 

1. sorter as a Generator 
You do this The Benefit: The function is now a stream of events. It doesn't just return a result; it returns a sequence of "moments".
```ts
// This is a Generator!
async function* bubbleSortGenerator(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Emit a "Compare" event
      yield { type: 'COMPARE', indices: [j, j + 1] };

      if (arr[j] > arr[j + 1]) {
        // Swap logic
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        // Emit a "Swap" event
        yield { type: 'SWAP', indices: [j, j + 1], values: [...arr] };
      }
    }
  }
}
```

1. Managing Iterator (Generator) object
How the Vue component uses it:

To understand how the caller manages a yield, you have to stop thinking of a function as a "task that runs to completion" and start thinking of it as a "state machine" that you can step through.

When you call a generator function, it doesn't actually run the code inside. Instead, it returns a Generator Object (also called an Iterator). This object is the "remote control" for the function.

The only way to interact with that remote control is through one specific method: .next().

The Mechanics of .next()
Every time the caller calls .next(), two things happen:
- The generator "wakes up" and runs until it hits the next yield statement.
- The generator "freezes" and returns an object to the caller that looks exactly like this:

```ts
{
  value: any,  // The data you passed to the yield keyword
  done: boolean // True if the function reached the end or a 'return' statement
}
```

The Step-by-Step Flow
Let's trace a simplified version:
The Generator (bubbleSort.ts):


```ts
function* bubbleSort(arr) {
  yield "START";           // Yield 1
  yield "SWAP_OCCURRED";   // Yield 2
  return "FINISHED";       // End of function
}


// The Caller
// Step A: Initialization

const sorter = bubbleSort([3, 1, 2]); 
// Nothing has printed yet. The function is "frozen" at the very beginning.

//Step B: The First "Pull"
const result = sorter.next(); 
// The generator runs until it hits the first yield.
// result is now: { value: "START", done: false }

//Step C: The Second "Pull"
const result2 = sorter.next();
// The generator resumes from where it left off and runs until the next yield.
// result2 is now: { value: "SWAP_OCCURRED", done: false }

//Step D: The Final "Pull"
const result3 = sorter.next();
// The generator runs until it hits the 'return' or the end.
// result3 is now: { value: "FINISHED", done: true }
```

1. How this manages your "Interactivity"
This is the most important part. Because the Caller is the one deciding when to call .next(), the Caller has total control over the Timing and Flow.

Scenario 1: Implementing "Speed Control"
The caller doesn't just call .next() as fast as possible. It uses a delay.


Apply
// The "Animation Loop"
async function run() {
  const sorter = bubbleSort(myArray);
  
  while (true) {
    const { value, done } = sorter.next(); // Pull the next event
    if (done) break;                       // Stop if finished

    handleEvent(value);                    // Update the UI/Canvas
    
    // THE SPEED CONTROL:
    // We force the caller to wait before it's allowed to "press the button" again.
    await new Promise(r => setTimeout(r, speedValue)); 
  }
}
Scenario 2: Implementing "Pause"
The caller simply checks a variable before deciding to call .next().


Apply
async function run() {
  const sorter = bubbleSort(myArray);

  while (true) {
    if (isPaused) {
      // If paused, we just wait in this loop without calling .next()
      await new Promise(r => setTimeout(r, 100));
      continue; 
    }

    const { value, done } = sorter.next();
    if (done) break;

    handleEvent(value);
    await new Promise(r => setTimeout(r, speedValue));
  }
}


Summary
The Generator is the Producer: It produces events but has no idea how fast they are being consumed.
The Caller is the Consumer: It "pulls" events using .next(). Because it is the one pulling, it can decide to wait (Speed), decide to stop (Pause), or decide to do just one (Step).


### Project structure
```text
130_sort_visualizer/
├── src/
│   ├── main.ts          <-- This mounts the Vue app
│   ├── App.vue          <-- This is your main Visualizer component
|   |__ views/           <-- Vue views, Main.view is the container
│   ├── utils/      <-- Put your Sort Generators here
│   │   └── bubbleSort.ts
│   └── components/      <-- Your Canvas/Renderer components
├── index.html           <-- THE ENTRY POINT (Vite needs this!)
├── package.json
├── tsconfig.json
└── vite.config.ts       <-- Tells Vite how to handle Vue
```

### The main view
A minimal App.vue scaffold with a sort control panel and visualization container.

Since you are building a **Dashboard-style application** (a main view with controls and a visualization area), here is a breakdown of the semantic elements you should use.

#### step1 creating Structural Elements (The "Skeleton")
These define the high-level layout of your application.

*   **`<header>`**: Use this for the top of your app. It should contain the title of the project (e.g., `<h1>Sort Visualizer</h1>`).
*   **`<main>`**: This is the most important tag. It should wrap the **primary content** of your application (the actual visualization and the main controls). There should only be one `<main>` per page.
*   **`<nav>`**: Use this for your navigation or primary selection area. In your case, the **Algorithm Selector** (Bubble Sort, Quick Sort, etc.) is a navigation element.
*   **`<section>`**: Use this to group related content. For example, a "Controls Section," a "Statistics Section," or a "Configuration Section." 
    *   *Rule of thumb:* A `<section>` should almost always have a heading (`<h2>`-`<h6>`) inside it.
*   **`<aside>`**: Perfect for "secondary" information that sits next to the main content. This is the ideal place for your **Live Statistics Overlay** (Comparisons, Swaps, Time).
*   **`<footer>`**: Use this for a bottom bar that might show status messages (e.g., "Sorting Complete!" or "Error: Array out of bounds").

---

####  (The "Body")
These help organize the data inside your sections.

*   **`<figure>`**: Since your visualization is essentially a "graphic" or a "diagram," wrap your `<canvas>` element inside a `<figure>`.
*   **`<figcaption>`**: Use this inside a `<figure>` to provide a caption (e.g., "Current Algorithm: Quick Sort").
*   **`<fieldset>` and `<legend>`**: These are used to group related form controls. For example, you might have a group of inputs for "Sample Size" and "Order," wrapped in a `<fieldset>` with a `<legend>` called "Data Configuration."

---

#### (The "Controls")
Since you need to let the user pick settings, you will use these "Form" elements:

*   **`<label>`**: **Crucial.** Every input must have a label. It tells the user (and screen readers) what the input is for.
*   **`<select>`**: The dropdown menu for choosing the algorithm.
*   **`<input type="range">`**: The perfect "slider" widget for **Speed Control** or **Sample Size**.
*   **`<button>`**: For "Start," "Pause," "Resume," and "Step."
*   **`<input type="number">`**: If you want the user to type in a specific sample size instead of using a slider.

---

#### Semantic layout

We have a "Main.vue" containing: Sort algorithm, Playback controls, visualization area
We have a "VisualizationControl.vue": a panel side dx from "Main.vue", containing the visualization controls
We have a "Statistics.vue". a section bottom of "Main.vue", in the footer,  to show statistics and a message area
