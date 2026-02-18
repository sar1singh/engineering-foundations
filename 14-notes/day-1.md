## What is Javascript?
Javascript is a High-Level, single threaded, interpreted language. While it started for web interactivity, but its Non-Blocking I/O nature makes it a powerhouse for scalable backend systems via NodeJS.


## What is an execution context?
Execution context is a JS environment or container where the code is evaluated and executed, consisting of memory phase and code phase. Execution contexts are created in two main types - Global Execution Context (GEC) and Functional Execution Context (FEC).

## What is "Hoisting" in JavaScript?
Hoisting is a behaviour where the JS engine moves variable and function declaration to the top of their scope during memory creation phase. Hoisting is implemented through reserved keywords like - 'var' and 'function', whereas let and const are hoisted in a 'temporal dead zone`.

## Explain the call stack?
Call Stack is a LIFO (Last-In,First-Out) data structure that tracks the execution of the program. When a function is invoked, a new execution context is pushed to the call stack, when the function finishes, it is popped off.

## What are closures/ Why Do closures matter?
A closure is a function bundled together with references to its surrounding state (lexical environment). It allows an inner function to access the scope of an outer function even after the outer execution has finished executing. Its the backbone of data privacy and factory patterns.

## What is event loop ?
The event loop is a contant process that monitors the call stack and callback queue. If the call stack is empty, it pushes the first task from the queue into call stack allowing JS to perform Non-Blocking I/O operations despite being single threaded.

## How does the V8 Engine optimize Javascript at runtime ?
V8 optimize Javascript through a speculative, multi-tiered JIT (Just-in Time) compilation pipeline that balances fast startup with peak runtime performance. Its works by transitioning code through four main stages:
1. **Baseline Execution**:  The *Ignition* interpreter quickly converts source code to byte code for immediate execution.

2.  **Tiered Optimizaiton**: As code 'warms-up', V8 uses the SparkPlug (non-optimizing) and maglev (mid-tier) compilers to generate faster machine code without the heavy overhead of full optimization.

3. **Hot Path Optimization**: For 'hot' functions, the TurboFan compiler performs aggressive, high-level optimizations - Such as function inlining and escape analysis based on collected type feedback.

4. **Speculative Guarding**: V8 assumes dynamic types will remain stable. It uses Hidden Classes (Shapes) and Inline Caching (IC) to bypass expensive property lookups. If a type assumption is violated, the engine performs a *__de-optimization__*(bailout), reverting to bytecode to ensure correctness.

## What is the difference between microtasks and macrotasks?
This is about the Event Loop's priority. macrotasks include things like `setTimeout`, `I/O`, `UI Rendering`. Microtasks include `promise`, `callbacks`, and `process.nextTick`. The rule is: all microtakss are executed immediately after the current script or before the next macrotask. If we infinetly queue microtasks, we will starve the I/O and freeze the process.

## How does Node.js handle CPU-intensive tasks, and what are the architectural trade-offs?
Node.js is traditionally optimized for I/O, but for CPU-bound tasks, we have three distinct architectural layers:

1. **The Cluster Module**: This is the first line of defense for multi-core utilization. It uses a `Master-Worker` pattern to fork multiple instances of the same application, sharing the same server port and distributing load via Round-Robin.

_Note: Round-Robin method is a fair and simple scheduling algorithm that assigns a fixes time unit(a "quantum") to each process or task in a rotating, circular order._

2. **Worker Threads**: Unlike cluster which creates seperate processes with seperate memory, Workers run in the same process, sharing memory via `ArrayBuffer`. This is ideal ideal of heavy data processing or mathematical computations within a single service instance.

_Note: An `ArrayBuffer` is a JS object representing a generic,fixed length, contiguous block of raw binary data in memory. It acts as a low-level container that cannot be directly manipulated, requiring `Views` to read or write the data it holds._

3. **External Offloading**" For truly massive CPU tasks like video transconding, Its a good practice to offload to a queue system and a seperate worker service or lambda. This prevents `event loops starvation` where the main thread is blocked, causing health check to fail and causing container to kill the pod.

## What is the relationship between the event loop, microtakss, and callback hell in terms of process stability?
Beyond the LIFO or FIFO mechanics, the critical concern is Execution Priority.

1. **Microtasks**(Promises,callbacks, process.nextTick): These have the highest priority. If a developer recursively use `process.netxTick`, it creates a `microtask starvation` scenario where the macrotask queue (I/O. timers) is never reached.

2. **Callback Hell & Process Freezing**: 'Callback Hell' is not simply a readability issue, it was a risk factor for blocking the loop.
Deeply nested, synchronous operations inside callback prevent the event loop from turning.

3. **Architectural Fix for callback hell**: We use `setImmediate()` to break up long running synchronous blocks. This pushes the remaining work to the 'check' phase of the next event loop iteration, allowing the engine to handle pending I/O in between and keeping the processes responsive.

## Explain the "buffer" vs "stream" trade-off in the context of memory management?
A `Buffer` is a fixed size chunk of memory allocated outside of the V8 heap. Using `fs.readFile()` loads the entire file into a buffer.
At scale, if 100 users request a 100MB file simultaneously, we need 10GB of RAM, leading to `ERR_BUFFER_OUT_OF_MEMORY`. In this scenario, we can use `Streams` (fs.createStream). Streams Implement 'Backpressure'- a signaling mechanism where the 'writable' stream tells a 'Readable' stream to slow down if the buffer is full. This ensures constant memory usage regardless of wether the file is 1MB or 1TB.


## How does the Garabase Collector(GC) works in the V8, how do you prevent memory leaks?
V8 uses a Generation GC strategy. It divides the heap into `Young Generation` (short-lived objects) and `Old Generation` (survivors).
1. **Scavenge (Minor GC)**: Fast and frequent, clears the Young Generation.
2. **Mark-Sweep-Compact (Major GC)**: Slower, clears the Old Generation. To prevent leaks in a production Node.js Environment, 

To Prevent Memory Leaks, I monitor for
- **Global Variables**: Accidental globals never get GC'd.
- **Forgotten Timers**: `setInterval` keeping references to large objects
- **Closures**: Inner functions holding on to large scopes unnecessarily
- **Event Listeners**: Not calling `.removeListeners()` on a long-lived objects like `process` 

## What happens to the call stack step-by-step?
The Call Stack is a LIFO data structure managed by the JS engine to track 'where we are' in the program.
1. **Global Initialization**: When the script starts, the `Global Execution Context (GEC)` is created and pushed to the bottom of the stack.

2. **Function Invocation**: Every time a function is called, a new `Function Execution Context(FEC)` is created. This context contains the function's local variables, arguements, and `this` binding. It is pushed onto the top of the stack.

3. **Nested Execution**: If Function A calls Function B, Function B's context is pushed on top of A. The CPU pauses A and begins executing B.

4. **Completion and Popping**: When a function returns a value or reaches the end of its block, its execution context is poppep (removed) from the stack, and the engine resumes execution where is left off in the context below it.

5. **Termination**: Once the script finishes and no asynchronous callbacks are pending, the GEC is popped and the stack becomes empty.


## Why does recursion overflow the stack?
Recursion overflows the stack because the Call Stack has a finite, engine-defined memory limit (typically 1MB to a few MBs depending on environment).
1. **The Mechanism**: In a recursive function without a base case, or with a base case that is never reached, the engine continues to push new Execution Contexts onto the stack indefinitely.

2. **Memory Exhaustion**: Each 'frame' on the stack consumes a small amount of memory to store local variables and the return address. When the total size of these frames exceeds the allocated stack limit, the engine throws a `RangeError: Maximum callstack size exceeded`.

3. **Architectural Implications**: I avoid deep recursions in a Node.js production code because it is blocking and risky.
    - **The Fix**: I prefer iterative solutions (using loops) which maintain a constant stack height (O(1) stack space). or I use `Tail Call Optimization` where supported.
    - **The Async Workaround**: If the recursion is necessary, wrapping the recursive call in `setImmediate()` or `process.nextTick()` moves the next execution to the Event Loop, effectively clearing the call stack and preventing an overflow.

## What is Tail Call Optimization (TCO)?
TCO is a performance feature where the JS engine avoids adding a new stack frame to the Call Stack if the final action of a function is to return the result of another function call (a tail call).

In standard Execution, every function call creates a new `Execution Context` on the stack. In a recursive operation, this leads to O(n) space complexity and eventually a `Stack Overflow`. With TCO, the engine recognizes that the current frame is no longer needed because there is no remianing code to execute after the sub-call. It simply overwrites/reuses the current stack frame for the next function, keeping the stack height O(1).

### What Contstitutes as a "Tail Call"?
For TCO to trigger, the call must be in the tail position. This means the function call must be the very last thing the function evaluates before returning.
Example:

**NOT Optimized (Standard Recursion)**
```
function factorial(n) {
    if (n==1) return 1;
    return n*(n-1); // not a tail call. The engine must wait for factorial (n-1) to finish before multiplying it by 'n'. 
    //Therefore, it MUST keep the current frame alive.
}
```
**Optimized (TCO)**
```
function factorial(n,total=1){
    if(n==1) return 1;
    return factorial(n-1, n*total); // Pure Tail Call.
    //The result of the sub-call is returned directly. No local state is needed after this line.
}
```