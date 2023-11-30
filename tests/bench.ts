import FIFO from "../lib/fifo.ts";

const AMOUNT = 10000;

Deno.bench("Array push", { group: "push", baseline: true }, () => {
  const array = [];

  for (let i = 0; i < AMOUNT; i++) {
    array.push(i);
  }
});

Deno.bench("Array shift", { group: "shift", baseline: true }, (ctx) => {
  const array = [];

  for (let i = 0; i < AMOUNT; i++) {
    array.push(i);
  }

  ctx.start();
  for (let i = 0; i < AMOUNT; i++) {
    array.shift();
  }
  ctx.end();
});

Deno.bench("FIFO push", { group: "push" }, () => {
  const fifo = new FIFO<number>();

  for (let i = 0; i < AMOUNT; i++) {
    fifo.push(i);
  }
});

Deno.bench("FIFO shift", { group: "shift" }, (ctx) => {
  const fifo = new FIFO<number>();

  for (let i = 0; i < AMOUNT; i++) {
    fifo.push(i);
  }

  ctx.start();
  for (let i = 0; i < AMOUNT; i++) {
    fifo.shift();
  }
  ctx.end();
});
