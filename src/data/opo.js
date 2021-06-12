class Opo {
    constructor(arr = []) {
        this.arr = [...arr];
    }

    name() {
        return this.arr.join("")
    }

    count() {
        let sum = 0;

        for (let c of this.arr) {
            sum += c;
        }

        return sum;
    }

    sortValue() {
        let value = 0;
        const len = this.arr.length;
        const sqrt = Math.sqrt(len);

        for (let i = 0; i < len; i++) {
            const o = i+1;
            value += (this.arr[i]*(len-i))/(1+(i%sqrt));
        }
        return value;
    }

    tilings() {
        // just returning the simplest tiling, write something real in the future
        let paprika = [];

        for (let i = 0; i < this.arr.length; i++) {
            const o = i+1;
            if (this.arr[i]) paprika.push(`P${o}`);
        }

        return [paprika]
    }

    clone() {
        return new Opo(this.arr);
    }

    inverse() {
        let inv = [];
        for (let c of this.arr) {
            inv.push(c ? 0 : 1);
        }
        return new Opo(inv);
    }

    reflect() {
        const arr = this.arr;
        const ref = [...arr];
        const len = ref.length;
        const sqrt = Math.sqrt(len);

        for (let i = 0; i < len; i += sqrt) {
            const shift = sqrt-1;
            ref[i] = arr[i+shift]
            ref[i+shift] = arr[i]
        }
        return new Opo(ref);
    }

    rotate() {
        const arr = this.arr;
        const rot = [...arr];
        const len = rot.length;

        for (let i = 0; i < len; i++) {
            // I have no idea why this works mathematically, but it does
            rot[i] = arr[(i+(2*(i+1)))%10]
        }

        return new Opo(rot);
    }
}

export default Opo;