1. The Architecture: Keep it in the Frontend (TypeScript)
While it is tempting to use FastAPI (Python) to handle the "heavy lifting" of the algorithms, for this specific project, keep the algorithms in the Frontend (TypeScript).

Here is why:

The "Interactivity" Requirement: Step 3 requires "Pause," "Resume," and "Step Forward." If the algorithm is running on a backend, the backend has to finish the whole sort and send you a massive list of events, or you have to manage complex WebSocket connections to "pause" a running process on a server.

The "Latency" Problem: If you want to animate 1,000 elements, you might generate 10,000 "compare" events. Sending 10,000 JSON objects over HTTP from a Python backend to a Vue frontend is actually quite slow and heavy.

The "Generator" Pattern: The challenge specifically suggests using Generators (a feature of TypeScript/JavaScript). Generators allow you to "yield" control back to the UI. This is incredibly easy to do in the browser but very difficult to coordinate between a Client and a Server.

The ideal architecture:
- Logic Layer (TypeScript): An Algorithm class that uses yield to emit events (Compare, Swap, Write).
- State Layer (Vue/TypeScript): A store (like Pinia or just a reactive object) that holds the current array and the current statistics.
- Rendering Layer (HTML5 Canvas): A component that listens to the state and draws the bars.


2. Managing Graphics

In the web world, for a visualizer, you don't want to move a "turtle"; you want to paint pixels on a board. 
You should use the **HTML5 Canvas API**. It is much more performant than using standard HTML <div> elements for hundreds of bars.

The "Turtle-to-Canvas" translation:

Turtle: turtle.forward(50) 
→
→ Canvas: ctx.fillRect(x, y, width, height)
Turtle: turtle.color("red") 
→
→ Canvas: ctx.fillStyle = "red"
A tiny preview of how your Vue component might look

```ts
// Inside your Vue component
const canvasRef = ref<HTMLCanvasElement | null>(null);

const draw = (array: number[]) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Clear the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Draw the bars
  const barWidth = canvas.width / array.length;
  
  array.forEach((value, i) => {
    const barHeight = (value / maxValue) * canvas.height;
    ctx.fillStyle = 'skyblue'; // The "resting" color
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
  });
};
```

3. Your "Secret Weapon": TypeScript Generators
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
### yeld and emit

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

✅ Created App.vue with a simple sort visualizer UI scaffold.

What it includes:

Header with title and description
Algorithm selector
Start / Reset buttons
Placeholder area for visualization
