class OpoGenus {
    constructor(opo) {
        const forms = generateForms(opo)

        let highestForm = {val: -Infinity, form: null};

        for (let o of forms) {
            if (o.sortValue() > highestForm.val) {
                highestForm.val = o.sortValue();
                highestForm.form = o;
            }
        }

        if (forms.find(o=> o.reflect().name() === forms[0].name())) {
            // non chiral
            this.majorForms = [...forms];
            this.minorForms = [];
            this.grandForm = highestForm.form;
        } else {
            const antiForms = generateForms(opo.reflect());

            let highestAnti = {val: -Infinity, form: null};

            for (let o of antiForms) {
                if (o.sortValue() > highestAnti.val) {
                    highestAnti.val = o.sortValue();
                    highestAnti.form = o;
                }
            }

            if (highestForm.val > highestAnti.val) {
                this.majorForms = [...forms];
                this.minorForms = [...antiForms];
                this.grandForm = highestForm.form;
            } else {
                this.majorForms = [...antiForms];
                this.minorForms = [...forms];
                this.grandForm = highestAnti.form;
            }
        }
    }

    count() {
        return this.grandForm.count();
    }
}

function generateForms(opo) {
    const first = opo.clone();
    const rot90 = first.rotate();

    if (first.name() === rot90.name()) return [first];

    const rot180 = rot90.rotate();

    if (first.name() === rot180.name()) return sortedForms([first,rot90]);

    return sortedForms([first, rot90, rot180, rot180.rotate()])
}

function sortedForms(forms) {
    const arr = [...forms]
    arr.sort((a,b) => b.sortValue() - a.sortValue())
    return arr;
}

export default OpoGenus;