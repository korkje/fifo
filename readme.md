# fifo [![JSR](https://jsr.io/badges/@korkje/fifo)](https://jsr.io/@korkje/fifo)

Simple and fast first-in-first-out queue.

```ts
import FIFO from "jsr:@korkje/fifo";

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

Supports both sync and async iteration.

```ts
// Consumes queue
for (const item of queue) {
  console.log(item);
}

// Consumes queue, waits for new items
for await (const item of queue) {
  console.log(item);
}
```
