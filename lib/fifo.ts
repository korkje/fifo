import StaticFIFO from "./static.ts";

/**
 * First-in-first-out queue.
 */
export class FIFO<T> {
    private head: StaticFIFO<T>;
    private tail: StaticFIFO<T>;
    private resolve?: (value: T) => void;

    /**
     * The length of the queue.
     */
    public length: number;

    /**
     * Creates a new FIFO queue with the given (initial) capacity.
     *
     * @param capacity - Initial capacity (power of two).
     */
    constructor(capacity: number = 16) {
        this.head = new StaticFIFO<T>(capacity);
        this.tail = this.head;
        this.length = 0;
    }

    /**
     * Clears the queue.
     */
    public clear() {
        this.head = this.tail;
        this.head.clear();
        this.length = 0;
    }

    /**
     * Pushes a new value to the queue.
     *
     * @param value - The value to push.
     */
    public push(value: T) {
        if (this.resolve) {
            this.resolve(value);
            this.resolve = undefined;
            return;
        }

        ++this.length;

        if (!this.head.push(value)) {
            const prev = this.head;
            this.head = new StaticFIFO<T>(2 * prev.buffer.length);
            prev.next = this.head;
            this.head.push(value);
        }
    }

    /**
     * Shifts a value from the queue.
     *
     * @returns The shifted value or `undefined` if the queue is empty.
     */
    public shift(): T | undefined {
        if (this.length !== 0) {
            --this.length;
        }

        const value = this.tail.shift();

        if (value === undefined && this.tail.next) {
            const next = this.tail.next;
            this.tail.next = undefined;
            this.tail = next;

            return this.tail.shift();
        }

        return value;
    }

    /**
     * Peeks at the next value in the queue.
     *
     * @returns The next value or `undefined` if the queue is empty.
     */
    public peek(): T | undefined {
        const value = this.tail.peek();

        if (value === undefined && this.tail.next) {
            return this.tail.next.peek();
        }

        return value;
    }

    /**
     * Returns an iterator for the queue.
     */
    public *[Symbol.iterator](): Generator<T> {
        while (this.length) {
            yield this.shift()!;
        }
    }

    /**
     * Returns an async iterator for the queue.
     */
    public async *[Symbol.asyncIterator](): AsyncGenerator<T> {
        while (true) {
            if (this.length) {
                yield this.shift()!;
                continue;
            }

            yield await new Promise<T>(resolve => this.resolve = resolve);
        }
    }
}

export default FIFO;
