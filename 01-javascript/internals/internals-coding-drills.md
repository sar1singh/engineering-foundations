### Task:
#### 1. Write down the output.
#### 2. Explain exactly what happens in the Memory Creation Phase for the test() function's execution context.

```
var a = 10;
function test() {
    console.log(a); 
    var a = 20;
    console.log(a); 
}
test();
console.log(a);
```

### Answer:
**Output:** 
`undefined,20,10`

**Reason:** 
On running the script, variable definition will move to the top (Hoisting), `a` will be initialized with value undefined, then new value 10 will be assigned initally. Similarly, Function will be initialized and move to the top (Hosting), This function intial definition will be a object containing its own attributes. Inside function `test()`, `a` is again defined as a var, it will be hoisted again inside `test()` execution context, intial value will be undefined, and then new value 20 will be assinged.

**Execution Order:** 
First `test()` execution context(EC) will be executed, in which, first console.log will give `undefined` because inside function EC, `a` is initialized with undefined value due to hoisting, by this time `a` inside function EC is undefined.
Next, Inside `test()`, a will be assigned new value 20, and then 2nd console will print the same value i.e. 20. 
Next, Once `test()` EC will complete its task, control will be given to the GEC where we again have 3rd console.log, which will print value of `a` as 10, as the GEC context had that value during initalization.

---

### Task:
#### 1.  List the output in the correct order.
#### 2.  Principal Challenge: Explain why process.nextTick behaves differently than a standard Promise in Node.js, even though both are often called "microtasks."

```
console.log("Start");

setTimeout(() => {
    console.log("Timeout 1");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise 1");
});

process.nextTick(() => {
    console.log("Next Tick 1");
});

console.log("End");

```

### Answer:

**Outut:** 
`Start,End, "Next Tick 1", "Promise 1", Timeout 1`

**Reasoning: Event Loop & Task Priority**

1. Synchronous Execution Phase:

- The JS Engine executes the script line-by-line.
- `console.log("Start")` and `console.log("End")` are pushed to the Call Stack and executed immediately.
- Asynchronous calls (setTimeout, Promise, process.nextTick) are identified and their callbacks are handed over to the Node.js runtime/web APIs.

2. The Microtask Check (Immediate Priority):

- Before the Event Loop moves to the next phase, it must drain the Microtask Queues.
- The nextTick Queue: Node.js checks process.nextTick first. It has a dedicated queue that is processed before any other microtask. Thus, `Next Tick 1` is printed.
- The Promise Queue: Once the nextTick queue is empty, the engine moves to the Promise (.then) microtask queue. "Promise 1" is printed.

3. The Event Loop Phase (Timers):

- Only after the Call Stack and all Microtask queues are empty does the Event Loop enter its first phase: Timers.
- It checks for expired timers. Since the setTimeout was set to 0ms, it is ready. Its callback is pushed to the Call Stack. "Timeout 1" is printed.

_Architectural Note: process.nextTick is not technically part of the Event Loop; it is a way to "interrupt" the loop and execute a callback immediately after the current operation, before the loop continues._


---

### **Question:** Analyze the code below. If you run this in a Chrome browser tab or a Node.js process, what will happen to the "End" log and any other subsequent tasks (like UI clicks or other timers)?
### Task:
1. Predict the output sequence.
2. The "Internal" Why: Explain what happens to the Microtask Queue and why the setTimeout callback behaves differently here than in our previous exercise.
3. Architectural Impact: If this was a production Node.js API, how would it affect other users trying to connect to the server?

```
console.log("Start");

function starve() {
    Promise.resolve().then(() => {
        // Recursive microtask
        starve();
    });
}

starve();

setTimeout(() => {
    console.log("Timeout: Am I ever going to run?");
}, 0);

console.log("End");

```

### Answer:
**1. Output:** "start", "End",
(The process then hangs indefinitely; "Timeout" is never printed)

**2. The "Internal" Why:**
- **Synchronous Block:** Start and End execute and are popped from the Call Stack.
- **Microtask Priority:** The engine sees the starve() call. Each time a Promise resolves, it adds a new task to the Microtask Queue.
- **The Loop Hole:** The Event Loop is designed to completely drain the Microtask Queue before moving to the next phase (Timers). Because starve() recursively adds a new microtask before the current one finishes, the Microtask Queue never becomes empty.

**The Result:** The Event Loop is "starved." It can never reach the Timer Phase to execute the setTimeout, nor can it reach the Render Phase (in browsers), causing the UI to freeze.

**3. Architectural Impact (The Principal Perspective):**
- In a production Node.js environment, this results in Event Loop Blockage.
- **Single Thread Consequences:** Since Node.js uses a single thread for the Event Loop, this recursive loop will prevent the heart of the application from beating.
- **System Failure:** New incoming TCP connections cannot be accepted, I/O operations cannot complete, and health checks will fail. The server becomes a "zombie" process—it's running and consuming 100% CPU, but it's effectively dead to the outside world.