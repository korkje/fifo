import StaticFIFO from "./static.ts";

export class FIFO<T> {
    private capacity: number;
    private head: StaticFIFO<T>;
    private tail: StaticFIFO<T>;
    public length: number;

    constructor(capacity: number = 16) {
        this.capacity = capacity;
        this.head = new StaticFIFO<T>(this.capacity);
        this.tail = this.head;
        this.length = 0;
    }

    public clear() {
        this.head = this.tail;
        this.head.clear();
        this.length = 0;
    }

    public push(value: T) {
        ++this.length;

        if (!this.head.push(value)) {
            const prev = this.head;
            this.head = new StaticFIFO<T>(2 * prev.buffer.length);
            prev.next = this.head;
            this.head.push(value);
        }
    }

    public shift() {
        if (this.length !== 0) {
            --this.length;
        }

        const value = this.tail.shift();

        if (value === undefined && this.tail.next) {
            const next = this.tail.next;
            this.tail.next = null;
            this.tail = next;

            return this.tail.shift();
        }

        return value;
    }

    public peek() {
        const value = this.tail.peek();

        if (value === undefined && this.tail.next) {
            return this.tail.next.peek();
        }

        return value;
    }
}

export default FIFO;
