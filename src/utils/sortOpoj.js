function sortOpoj(family) {
        const size = family[Object.keys(family)[0]].grand.length;

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