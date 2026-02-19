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
Output: undefined,20,10
Reason: On running the script, variable definition will move to the top (Hoisting), `a` will be initialized with value undefined, then new value 10 will be assigned initally. Similarly, Function will be initialized and move to the top (Hosting), This function intial definition will be a object containing its own attributes. Inside function `test()`, `a` is again defined as a var, it will be hoisted again inside `test()` execution context, intial value will be undefined, and then new value 20 will be assinged.

Execution Order: First `test()` execution context(EC) will be executed, in which, first console.log will give `undefined` because inside function EC, `a` is initialized with undefined value due to hoisting, by this time `a` inside function EC is undefined.
Next, Inside `test()`, a will be assigned new value 20, and then 2nd console will print the same value i.e. 20. 
Next, Once `test()` EC will complete its task, control will be given to the GEC where we again have 3rd console.log, which will print value of `a` as 10, as the GEC context had that value during initalization.

---

### Task:
#### 1.  List the output in the correct order.
#### 2.  Principal Challenge: Explain why process.nextTick behaves differently than a standard Promise in Node.js, even though both are often called "microtasks."