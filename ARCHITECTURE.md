1. Frontend only architecture

The "Interactivity" Requirement: Step 3 requires "Pause," "Resume," and "Step Forward." If the algorithm is running on a backend, the backend has to finish the whole sort and send you a massive list of events, or you have to manage complex WebSocket connections to "pause" a running process on a server.

The "Latency" Problem: If you want to animate 1,000 elements, you might generate 10,000 "compare" events. Sending 10,000 JSON objects over HTTP from a Python backend to a Vue frontend is actually quite slow and heavy.

The "Generator" Pattern: The challenge specifically suggests using Generators (a feature of TypeScript/JavaScript). Generators allow you to "yield" control back to the UI. This is incredibly easy to do in the browser but very difficult to coordinate between a Client and a Server.

The ideal architecture:
- Logic Layer (TypeScript): An Algorithm class that uses yield to emit events (Compare, Swap, Write).
- State Layer (Vue/TypeScript): A store (like Pinia or just a reactive object) that holds the current array and the current statistics.
- Rendering Layer (HTML5 Canvas): A component that listens to the state and draws the bars.


2. Managing Graphics

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

You do this:
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

How the Vue component uses it:
You can now "loop" through the algorithm, and after every yield, you await a small delay (the animation speed) and then redraw the canvas.

```ts
// The "Animation Loop"
const runSort = async () => {
  const sorter = bubbleSortGenerator(myArray);
  
  for await (const event of sorter) {
    // 1. Update the UI state based on the event (e.g., highlight indices)
    // 2. Wait for the user-defined speed (e.g., 50ms)
    await new Promise(resolve => setTimeout(resolve, speed));
    // 3. Redraw the canvas
    draw(myArray);
  }
};
```
### yeld with generator (ko emit)

1. yield (The "Pull" Mechanism)
yield is a feature of the JavaScript/TypeScript language itself (specifically, it's used in Generator Functions).

When you use yield, you are literally pausing the execution of the function. The function doesn't just send a message; it "freezes" in time at that exact line. It stays frozen until the person calling it says, "Okay, give me the next piece of data."

Who is in control? The Caller (the loop/the UI).
Analogy: A vending machine. You press a button, the machine gives you a snack (yield), and then it stops and waits for you to press the button again. It cannot give you a second snack until you interact with it.
In your project:
The Algorithm is the vending machine. The UI is the person pressing the button. The UI decides when to press the button (this is how you implement Speed Control and Pause).

```ts
// The Algorithm (The Vending Machine)
function* bubbleSort(arr) {
  yield "START"; // Pauses here
  // ... logic ...
  yield "SWAP";  // Pauses here
}

// The UI (The Person)
const sorter = bubbleSort(myArray);

// The UI decides the pace:
const step = async () => {
  const result = sorter.next(); // "Pressing the button"
  if (!result.done) {
    console.log(result.value); // "Got the snack"
    await sleep(speed);       // The UI controls the delay!
  }
};
```

2. emit (The "Push" Mechanism)
emit is a feature of the Vue Framework. It is an "Event-Driven" pattern.

When you emit, the component is "shouting" into the void. It says, "Hey! Something happened!" and then it immediately continues running its own code. It doesn't wait for anyone to listen; it just fires the signal and moves on.

Who is in control? The Sender (the component emitting).
Analogy: A doorbell. You press the button (emit), and a sound is made. You don't stop your life to wait for the person inside to hear it; you just keep walking. The person inside hears it and reacts, but the doorbell doesn't "pause" you.
In your project:
If you used emit for the algorithm, the algorithm would be "shouting" swaps and comparisons as fast as the CPU can possibly go. You would have a very hard time telling the algorithm to "slow down" because the algorithm isn't listening to you—it's just shouting.


This is a massive hint to use yield.

If you use yield, your algorithm remains "Pure Logic." It doesn't know Vue exists. It doesn't know about buttons or canvases. It just knows how to sort and how to yield events. This makes your code incredibly easy to test and, as the challenge says, easy to add new algorithms to.

If you used emit, your algorithm would be "coupled" to Vue, making it much harder to move or reuse.

### Project structure
```text
130_sort_visualizer/
├── src/
│   ├── main.ts          <-- This mounts the Vue app
│   ├── App.vue          <-- This is your main Visualizer component
│   ├── algorithms/      <-- Put your Sort Generators here
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
