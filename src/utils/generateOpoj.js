// generate all possible nauoj

import Opo from "../data/opo";
import OpoGenus from "../data/opoGenus";

function generateOpoj(degree = 3) {
    let DEBUG_WORK = 0;

    const opoSize = degree ** 2
    const seenOpoj = {};
    const family = {
        genera: [
            []
        ]
    };
    const empty = [];
    while (empty.length < opoSize) {
        empty.push(0)
        family.genera.push([])
    }
    
    
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

    recurGenerate(empty, 0, 0, Math.floor(opoSize/2))
    return family
}

function generateGenus(opo,family,seen) {
    if(seen[opo.join("")]) return null;
    // note: directly mutates family and seen objects

    const index = new Opo(opo);

    const genus = new OpoGenus(index);
    const invGenus = new OpoGenus(index.inverse());

    const toBeSeen = [].concat(genus.majorForms).concat(genus.minorForms).concat(invGenus.majorForms).concat(invGenus.minorForms)

    for (let form of toBeSeen) {
        seen[form.name()] = true;
    }
    
    family.genera[genus.count()].push(genus);
    family.genera[invGenus.count()].push(invGenus);
}

// function fixGenusOrder(genus) {
//     if (!genus.rotations.length) return genus;
//     let headValue = calcOpoSortingValue(genus.opo)
//     // check rotations to see if any of them are worth more
//     for (let i = 0; i < genus.rotations.length; i++) {
//         if (calcOpoSortingValue(genus.rotations[i]) > headValue) {
//             const index = genus.opo;
//             const higher = genus.rotations[i];
//             headValue = calcOpoSortingValue(higher)
//             genus.name = higher.join("")
//             genus.opo = higher;
//             genus.rotations[i] = index;
//         }
//     }
//     // if reflections contain a higher version, swap rotations and reflections
//     if (!genus.rotReflect.length) return genus;
//     let highestReflect = 0;
//     for (let ref of genus.rotReflect) {
//         const val = calcOpoSortingValue(ref)
//         if (val > highestReflect) highestReflect = val;
//     }
//     if (highestReflect > headValue) {
//         const newHead = genus.rotReflect.find(o=> calcOpoSortingValue(o) === highestReflect);
//         const newRefs = genus.rotations.concat([genus.opo]);
//         const newRots = genus.rotReflect.filter(o=> o!=newHead);

//         genus.name = newHead.join("")
//         genus.opo = newHead;
//         genus.rotations = newRots;
//         genus.rotReflect = newRefs;
//     }

//     return genus
// }

// function calcOpoSortingValue(opo) {
//     // opo size agnostic
//     let sortSum = 0;
//     for (let i = 0; i < opo.length; i += Math.sqrt(opo.length)) {
//         sortSum += opo[i]*(10*(opo.length-i))
//     }

//     return sortSum;
// }

// function generateInverseGenuses(family) {
//     const fullFamily = {...family}

//     for (let gen in family) {
//         let genus = family[gen];
//         let inv = invertGenus(genus);
//         fullFamily[inv.name] = inv;
//     }

//     return fullFamily
// }

// function invertGenus(genus) {
//     const inv = invertOpo(genus.opo)
//     const inverted = {
//         name: inv.join(""),
//         opo: inv,
//         count: inv.length - genus.count,
//         rotations: genus.rotations.map(o=>invertOpo(o)),
//         rotReflect: genus.rotReflect.map(o=>invertOpo(o))
//     }

//     return inverted
// }

// function invertOpo(opo) {
//     return opo.map(n=> n ? 0 : 1)
// }

export default generateOpoj