
export default class SgpjNumberGenerator {
    
    private listLength: number;
    private randomList: number[];
    private counter: number;
    
    constructor(listLength?: number) {
        this.randomList = [];
        this.counter = 0;
        this.listLength = 0;
        if (listLength !== undefined) {
            this.listLength = listLength;
            this.generate();
        }
    }
    
    generate(listLength?: number, resetCounter: boolean = true): void {
        if (listLength !== undefined) {
            this.listLength = listLength;
        }
        if (this.listLength === 0) {
            this.randomList = [];
            return;
        }
        const numberList = [...Array(this.listLength)].map((_, i) => i);
        const randomList = numberList.sort((_a, _b) => 0.5 - Math.random());
        this.randomList = randomList;
        if (resetCounter) {
            this.counter = 0;
        }
    }
    
    getNextNumber(doAutoGenerate: boolean = false): number {
        const thisNumber = this.randomList[this.counter];
        this.counter++;
        if (this.counter >= this.listLength) {
            this.counter = 0;
            if (doAutoGenerate) {
                this.generate();
            }
        }
        return thisNumber;
    }
    
    getListLength(): number {
        return this.listLength;
    }
    
    getList(): number[] {
        return this.randomList;
    }
    
    getCounter(): number {
        return this.counter;
    }
    
    clear(): void {
        this.randomList = [];
        this.counter = 0;
        this.listLength = 0;
    }
    
}
