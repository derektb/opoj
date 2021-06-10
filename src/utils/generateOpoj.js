// generate all possible nauoj

function generateOpoj(degree = 3) {
    let DEBUG_WORK = 0;

    const opoSize = degree ** 2
    const seenOpoj = {};
    const family = {};
    const empty = [];
    while (empty.length < opoSize) empty.push(0)
    
    function recurGenerate(opo, place, depth, maxDepth) {
        if (place >= opo.length) return null;
        if (depth === maxDepth) return null;

        DEBUG_WORK++;
        const off = [...opo];
        generateGenus(off,family,seenOpoj)
        recurGenerate(off,place+1,depth,maxDepth);

        const on = [...opo];
        on[place] = 1;
        generateGenus(on,family,seenOpoj)
        recurGenerate(on,place+1,depth+1,maxDepth)
    }
    
    // Partial:
    // recurGenerate(empty, 0, 0, 1)
    
    // Full:
    recurGenerate(empty, 0, 0, Math.floor(opoSize/2))
    console.log(DEBUG_WORK)
    let fullFamily = generateInverseGenuses(family)

    for (let gen in fullFamily) {
        fullFamily[gen] = fixGenusOrder(fullFamily[gen]);
    }
    return fullFamily
}

function generateGenus(opo,family,seen) {
    if(seen[opo.join("")]) return null;
    // note: directly mutates family and seen objects

    // add genus referant to seen
    seen[opo.join("")] = true
    let opoCount = 0;
    for (let i of opo) opoCount += i;


    const genus = {
        name: opo.join(""),
        opo: [...opo], // genus referent
        count: opoCount,
        rotations: [],
        rotReflect: []
    }

    //generate all rotations and reflections
    // this code is bad and mostly does not check for stuff already generated
    genus.rotations = generateRotations(opo,[opo])

    // WARNING: this implementation only works for degrees 2 and 3
    const refl = [...opo];
    for (let i = 0; i < opo.length; i+=Math.sqrt(opo.length)) {
        const shift = Math.sqrt(opo.length)-1;
        refl[i] = opo[i+shift]
        refl[i+shift] = opo[i]
    }
    if (refl.join("") !== opo.join("")) {
        genus.rotReflect = generateRotations(refl,[opo].concat(genus.rotations))
    }


    function generateRotations(opo, prune=[]) {
        // generate rotations
        // this one will definitely only work for nines
        const rotR = [...opo]
        for (let i = 0; i < opo.length; i++) {
            // I have no idea why this works mathematically, but it does
            rotR[i] = opo[(i+(2*(i+1)))%10]
        }
        const rotRR = [...opo];
        for (let i = 0; i < opo.length; i++) {
            rotRR[i] = rotR[(i+(2*(i+1)))%10]
        }
        const rotRRR = [...opo];
        for (let i = 0; i < opo.length; i++) {
            rotRRR[i] = rotRR[(i+(2*(i+1)))%10]
        }

        let arr = []
        for (let o of [opo,rotR,rotRR,rotRRR]) {
            if (!seen[o.join("")]) {
                arr.push(o)
                seen[o.join("")] = true
            }
        } 

        return arr.filter(i=> !prune.find(o=>o.join("")===i.join("")))
    }

    family[opo.join("")] = genus;
}

function fixGenusOrder(genus) {
    if (!genus.rotations.length) return genus;
    let headValue = calcOpoSortingValue(genus.opo)
    // check rotations to see if any of them are worth more
    for (let i = 0; i < genus.rotations.length; i++) {
        if (calcOpoSortingValue(genus.rotations[i]) > headValue) {
            const index = genus.opo;
            const higher = genus.rotations[i];
            headValue = calcOpoSortingValue(higher)
            genus.name = higher.join("")
            genus.opo = higher;
            genus.rotations[i] = index;
        }
    }
    // if reflections contain a higher version, swap rotations and reflections
    if (!genus.rotReflect.length) return genus;
    let highestReflect = 0;
    for (let ref of genus.rotReflect) {
        const val = calcOpoSortingValue(ref)
        if (val > highestReflect) highestReflect = val;
    }
    if (highestReflect > headValue) {
        const newHead = genus.rotReflect.find(o=> calcOpoSortingValue(o) === highestReflect);
        const newRefs = genus.rotations.concat([genus.opo]);
        const newRots = genus.rotReflect.filter(o=> o!=newHead);
        debugger
        genus.name = newHead.join("")
        genus.opo = newHead;
        genus.rotations = newRots;
        genus.rotReflect = newRefs;
    }

    return genus
}

function calcOpoSortingValue(opo) {
    // opo size agnostic
    let sortSum = 0;
    for (let i = 0; i < opo.length; i += Math.sqrt(opo.length)) {
        sortSum += opo[i]*(10*(opo.length-i))
    }

    return sortSum;
}

function generateInverseGenuses(family) {
    const fullFamily = {...family}

    for (let gen in family) {
        let genus = family[gen];
        let inv = invertGenus(genus);
        fullFamily[inv.name] = inv;
    }

    return fullFamily
}

function invertGenus(genus) {
    const inv = invertOpo(genus.opo)
    const inverted = {
        name: inv.join(""),
        opo: inv,
        count: inv.length - genus.count,
        rotations: genus.rotations.map(o=>invertOpo(o)),
        rotReflect: genus.rotReflect.map(o=>invertOpo(o))
    }

    return inverted
}

function invertOpo(opo) {
    return opo.map(n=> n ? 0 : 1)
}

export default generateOpoj