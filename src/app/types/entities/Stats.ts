export class Stats {
    public done: number;
    public remaining: number;
    public total: number;

    public constructor(total: number, done: number) {
        this.total = total;
        this.done = done;
        this.remaining = this.total - this.done;

        this.remaining = Math.max(this.remaining, 0);
    }
}