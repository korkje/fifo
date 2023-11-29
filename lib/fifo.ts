import StaticFIFO from "./static.ts";

export type Resolver<T> = (value: T) => void;

export class FIFO<T> {
    private head: StaticFIFO<T>;
    private tail: StaticFIFO<T>;
    public length: number;
    private resolve: null | Resolver<T> = null;

    constructor(capacity: number = 16) {
        this.head = new StaticFIFO<T>(capacity);
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
        
        if (this.resolve) {
            this.resolve(value); 
            this.resolve = null;
            return;
        }

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
    
      async *[Symbol.asyncIterator]() {
        while (true) {
            const shifted = this.shift();
            
            if (shifted !== undefined) {
                yield shifted;
                continue;
            }
    
            const next = await new Promise<T>((res) => {
                this.resolve = res;
            });
            
            yield next;
        }
      }
}

export default FIFO;
