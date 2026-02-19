Intent: Master the event-driven architecture and resource management.
Goal: Master the event-driven architecture and multi-core resource management.


## What is event loop ?
The event loop is a contant process that monitors the call stack and callback queue. If the call stack is empty, it pushes the first task from the queue into call stack allowing JS to perform Non-Blocking I/O operations despite being single threaded.

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

## What is the 'libuv' thread pool, and how does it differ from the Event Loop?
The Event Loop is single-threaded. For blocking tasks like File I/O, DNS, or Crypto, Node delegates to the libuv Thread Pool (default 4 threads). Once finished, the worker signals the Event Loop to run the callback.

## How do you handle 'Backpressure' in a custom stream implementation?
When a Writable stream's buffer exceeds highWaterMark, .write() returns false. I must stop the Readable stream (stream.pause()) and wait for the drain event from the Writable side before resuming.