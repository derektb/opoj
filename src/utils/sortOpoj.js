function sortOpoj(family) {
    // possibly the family should be a smarter object and just know stuff about itself, but in lieu of that:
    const size = family[Object.keys(family)[0]].opo.length;

    const sortedGenuses = [];
    for (let i = 0; i <= size; i++) {
        sortedGenuses[i] = []
    }

    for (let gen in family) {
            sortedGenuses[family[gen].count].push(family[gen])
    }

    return sortedGenuses;
}

export default sortOpoj