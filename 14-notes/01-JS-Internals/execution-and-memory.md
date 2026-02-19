Goal: Master how the engine evaluates code and manages the heap/stack.

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


## How does the V8 Engine optimize Javascript at runtime ?
V8 optimize Javascript through a speculative, multi-tiered JIT (Just-in Time) compilation pipeline that balances fast startup with peak runtime performance. Its works by transitioning code through four main stages:
1. **Baseline Execution**:  The *Ignition* interpreter quickly converts source code to byte code for immediate execution.

2.  **Tiered Optimizaiton**: As code 'warms-up', V8 uses the SparkPlug (non-optimizing) and maglev (mid-tier) compilers to generate faster machine code without the heavy overhead of full optimization.

3. **Hot Path Optimization**: For 'hot' functions, the TurboFan compiler performs aggressive, high-level optimizations - Such as function inlining and escape analysis based on collected type feedback.

4. **Speculative Guarding**: V8 assumes dynamic types will remain stable. It uses Hidden Classes (Shapes) and Inline Caching (IC) to bypass expensive property lookups. If a type assumption is violated, the engine performs a *__de-optimization__*(bailout), reverting to bytecode to ensure correctness.

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
    if(n==1) return total;
    return factorial(n-1, n*total); // Pure Tail Call.
    //The result of the sub-call is returned directly. No local state is needed after this line.
}
```

## What are "Hidden Classes" and "Inline Caching" in V8?
Since JS is dynamic, V8 creates "Hidden Classes" (Shapes) at runtime to track property offsets. Inline Caching (IC) remembers these offsets. If you change object shapes (by adding properties in different orders), you break IC, forcing V8 into slow property lookups.


## Explain the "Temporal Dead Zone" (TDZ) in terms of Engine Memory.
TDZ is the gap between scope entry and variable declaration for let/const. Internally, the engine allocates memory during the "Creation Phase" but marks the variable as "uninitialized," throwing a ReferenceError if accessed before the "Execution Phase" reaches that line.

## Explain Prototypes and Prototypal Inheritance.