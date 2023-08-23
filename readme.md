# fifo
Simple first-in-first-out queue for Deno.

```ts
import FIFO from "https://deno.land/x/fifo/mod.ts";

const queue = new FIFO<number>();

queue.push(1);
queue.push(2);
queue.push(3);

console.log(queue.length); // 3

console.log(queue.shift()); // 1
console.log(queue.shift()); // 2
console.log(queue.shift()); // 3

console.log(queue.shift()); // undefined
```
