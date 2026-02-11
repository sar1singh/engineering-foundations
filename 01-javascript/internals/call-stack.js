/**
- What is an execution context? - An execution context (EC) is the environment where JavaScript code runs, acting as a container that holds all the information needed for execution
- Key Components:
    - Memory Component: Stores variables and functions (variables get undefined initially, functions are fully stored).
    - Code Component (Thread of Execution): Executes the code line by line.
    - Call Stack: A LIFO (Last-In, First-Out) Data structure that manages contexts, pushing new ones on top for function calls and popping them off when done
- Types of Execution Contexts : 
    - Global Execution Context (GEC): The base context, created when a script loads, holding global variables, functions, and this (usually the window object in browsers).
    - Function Execution Context (FEC): Created every time a function is called, with its own scope, variables, and this
 */


function third() {
  console.log("Inside third");
}

function second() {
  third();
  console.log("Inside second");
}

function first() {
  second();
  console.log("Inside first");
}

first();
