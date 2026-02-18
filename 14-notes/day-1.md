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


What happens to the call stack step-by-step?

Why does recursion overflow the stack?
