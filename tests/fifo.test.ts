import { assertEquals } from "./deps.ts";
import FIFO from "../lib/fifo.ts";

Deno.test("Simple", () => {
    const queue = new FIFO<number>();

    queue.push(1);
    queue.push(2);
    queue.push(3);

    assertEquals(queue.length, 3);
    assertEquals(queue.shift(), 1);
    assertEquals(queue.shift(), 2);
    assertEquals(queue.shift(), 3);
    assertEquals(queue.shift(), undefined);
    assertEquals(queue.length, 0);
});

Deno.test("Big", () => {
    const queue = new FIFO<number>();

    for (let i = 0; i < 1_000_000; ++i) {
        queue.push(i);
    }

    assertEquals(queue.length, 1_000_000);

    for (let i = 0; i < 1_000_000; ++i) {
        if (i % 1_000 === 0) {
            assertEquals(queue.shift(), i);
        }
        else {
            queue.shift();
        }
    }

    assertEquals(queue.length, 0);
});

Deno.test("AsyncIterable", async () => {
    const queue = new FIFO<number>();
    const values: number[] = [];

    (async () => {
        for await (const value of queue) {
            values.push(value);
        }
    })();

    queue.push(1);
    queue.push(2);
    queue.push(3);

    await new Promise(resolve => setTimeout(resolve));

    assertEquals(values, [1, 2, 3]);
    assertEquals(queue.length, 0);
});
