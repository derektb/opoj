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
        if (this.generatedTilings) return this.generatedTilings;

        // let paprika = [];

        // for (let i = 0; i < this.arr.length; i++) {
        //     const o = i+1;
        //     if (this.arr[i]) paprika.push(`P${o}`);
        // }

        // v2 --- {

        let tilings = [];

        workTiling([...this.arr], 0, tilings)

        this.generatedTilings = tilings;

        // console.log(tilings)

        return tilings
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

function workTiling(tiling,i,allTilings) {
    // currently built for naŭopoj only
    const sqrt = 3;
    if (i >= 9) {
        allTilings.push([...tiling]);
        return allTilings
    }
    
    if (tiling[i] === 1) {
        let newTiling = [...tiling];
        newTiling[i] = `P${i+1}`
        workTiling(newTiling, i+1, allTilings);

        if (tiling[i+sqrt] === 1) {
            newTiling = [...tiling];
            const strokeType = ["A","T"][Math.floor(i/sqrt)];
            const strokePos = 1 + i%sqrt
            const stroke = ""+strokeType+strokePos;
            newTiling[i] = stroke;
            newTiling[i+sqrt] = stroke;
            workTiling(newTiling, i+1, allTilings);

            if (tiling[i+sqrt+sqrt] === 1) {
                newTiling = [...tiling];
                const strokePos = 1 + i%sqrt;
                const stroke = "O"+strokePos;
                newTiling[i] = stroke;
                newTiling[i+sqrt] = stroke;
                newTiling[i+sqrt+sqrt] = stroke;
                workTiling(newTiling, i+1, allTilings)
            }
        }

        if (i % sqrt < 2 && tiling[i+1] === 1) {
            newTiling = [...tiling];
            const strokeType = ["F","U"][i%sqrt];
            const strokePos = 1 + Math.floor(i/sqrt);
            const stroke = ""+strokeType+strokePos;
            newTiling[i] = stroke;
            newTiling[i+1] = stroke;
            workTiling(newTiling, i+1, allTilings);

            if (i % sqrt === 0 && tiling[i+2] === 1) {
                newTiling = [...tiling];
                const strokePos = 1 + Math.floor(i/sqrt);
                const stroke = "G"+strokePos;
                newTiling[i] = stroke;
                newTiling[i+1] = stroke;
                newTiling[i+2] = stroke;
                workTiling(newTiling, i+1, allTilings)
            }
        }
    } else {
        const newTiling = [...tiling]
        if (newTiling[i] === 0) newTiling[i] = "X";
        workTiling(newTiling, i+1, allTilings)
    }
}

export default Opo;