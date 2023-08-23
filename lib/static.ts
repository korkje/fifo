export class StaticFIFO<T> {
    private mask: number;
    private top: number;
    private bottom: number;
    public buffer: (T | undefined)[];
    public next: StaticFIFO<T> | null;

    constructor(capacity: number) {
        if (!(capacity > 0) || ((capacity - 1) & capacity) !== 0) {
            throw new Error("FIFO 'capacity' should be a power of two");
        }

        this.mask = capacity - 1;
        this.top = 0;
        this.bottom = 0;
        this.buffer = new Array<T>(capacity);
        this.next = null;
    }

    public clear() {
        this.top = 0;
        this.bottom = 0;
        this.next = null;
        this.buffer.fill(undefined);
    }

    public push(value: T) {
        if (this.buffer[this.top] !== undefined) {
            return false;
        }

        this.buffer[this.top] = value;
        this.top = (this.top + 1) & this.mask;

        return true;
    }

    public shift() {
        const last = this.buffer[this.bottom];

        if (last === undefined) {
            return undefined;
        }

        this.buffer[this.bottom] = undefined;
        this.bottom = (this.bottom + 1) & this.mask;

        return last;
    }

    public peek() {
        return this.buffer[this.bottom];
    }
}

export default StaticFIFO;
