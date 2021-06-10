function transformOpoMatrix() {
    const opts = [...arguments];
    const transform = {};
    transform[opts[0][0]] = opts[0][1];
    transform[opts[1][0]] = opts[1][1];
    const config = this.config();
  
    return function(which){
      let newArr = Array(9);
  
      for (let i = 0; i < 9; i++) {
        newArr[i] = config[ transform[which][i] ];
      }
  
      return new Opo(newArr);
    }
  }
  
  class Opo {
     constructor(arr) {
       let config = Array(9);
       if (arr) {
         for (let i = 0; i < 9; i++) {
           config[i] = arr[i] != undefined ? arr[i] : 0;
         }
       } else config = [0,0,0,
                        0,0,0,
                        0,0,0];
       
       this.config = function() {
         return [].concat(config);
       }
    }
    
    count(){
      const name = this.config().join("");
      let sum = 0;
      for (let i of name) {
        sum += i === "1" ? 1 : 0;
      }
      return sum;
    }
    
    name(asGrid) {
      const config = this.config();
      
      if (!asGrid) {
        return config.join("");
      }
      return `${config.slice(0,3).join("")}\n${config.slice(3,6).join("")}\n${config.slice(6).join("")}`
    }
    
    transformOpoMatrix() {
      const opts = [...arguments];
      const transform = {};
      transform[opts[0][0]] = opts[0][1];
      transform[opts[1][0]] = opts[1][1];
      
      const config = this.config();
      return function doTransform(which) {
        let newArr = Array(9);
  
        for (let i = 0; i < 9; i++) {
          newArr[i] = config[ transform[which][i] ];
        }
  
        return new Opo(newArr);
      }
    }
    
    rotate(which = "R") {
      // this is not how I wanted to do this but I couldn't figure out how to compose methods in a JavaScript class.
      const transform = this.transformOpoMatrix(
        ["L", [2,5,8,
               1,4,7,
               0,3,6]
        ],
        ["R", [6,3,0,
               7,4,1,
               8,5,2]
        ],
      )
      return transform(which);
    }
  
    mirror(which = "H") {
      // see note on rotate
      const transform = this.transformOpoMatrix(
        ["H", [2,1,0,
               5,4,3,
               8,7,6]
        ],
        ["V", [6,7,8,
               3,4,5,
               0,1,2],
        ]
      )
      return transform(which);
    }
  
    invert() {
      let newArr = Array(9);
      const config = this.config();
      for (let i = 0; i < 9; i++) {
        newArr[i] = config[i] ? 0 : 1;
      }
      
      return new Opo(newArr);
    }
  }
  
  class OpoCorpus {
    constructor() {
      this.genera = {}
    }
    
    add(opo) {
      if (!this.findGenus(opo)) {
        this.genera[opo.name()] = new OpoGenus(opo);
      }
    }
    
    remove(genus) {
      delete this.genera[genus.root.name()];
    }
    
    findGenus(opo) {
      // look to see if that's a root shape:
      const root = this.genera[opo.name()];
      if (root) {
        return root;
      }
      // look to see if that's a rotation of a root shape:
      const R = opo.rotate("R");
      const RR = opo.rotate("R").rotate("R");
      const RRR = opo.rotate("R").rotate("R").rotate("R");
  
      if (this.genera[R.name()] || this.genera[RR.name()] || this.genera[RRR.name()]) {
        return this.genera[R.name()] ? this.genera[R.name()] : 
               this.genera[RR.name()] ? this.genera[RR.name()] :
               this.genera[RRR.name()];
      }
      
      // look to see if that's a mirror of a root shape:
      const H = opo.mirror("H");
      const V = opo.mirror("V");
      if (this.genera[H.name()] || this.genera[V.name]) {
        // there's a mirror of this shape already found
        return this.genera[H.name()] ? this.genera[H.name()] : this.genera[V.name]
      }
    }
    
    make() {
      this.makeLower();
      this.prune()
      this.makeUpper();
    }
    
    makeLower() {
      const nullOpo = new Opo();
      const OPOJ = this;
      
      OPOJ.add(nullOpo);
  
      function append(opo,i) {
        OPOJ.add(opo);
  
        i++
        if (i < 9) {
          diverge(opo,i)
        }
      }
  
      function diverge(opo,i) {
        if (opo.count() < 4) {
          // skip opoj larger than 4; 5 and above are inversions of 4 and below
          let onBit = opo.config();
          onBit[i] = 1;
          const onOpo = new Opo(onBit);
          append(onOpo, i);
        }
        
        let offBit = opo.config();
        offBit[i] = 0;
        const offOpo = new Opo(offBit);
        append(offOpo, i);
      }
  
      diverge(nullOpo,0)
    }
    
    makeUpper() {
      for (let genus in this.genera) {
        const invertedGenus = this.genera[genus].root.invert();
        this.add(invertedGenus);
      }
    }
    
    prune() {
      // I'm seeing a couple mistakes in the output, so 
      // this is a brute force checker for it that kind of sucks.
      // const corpus = this.getOrderedCorpus();
      
      for (let order of this.getOrderedCorpus()) {
        let removed = [];
        
        for (let genus of order) {
          if (removed.indexOf(genus.root.name()) > -1) {
            continue;
          }
          
          for (var i = 0; i < order.length; i++) {
            const checked = order[i];
            if (checked.root.name() != genus.root.name()) {
              const perms = checked.permutations();
              if (opoIsInArray(genus.root, perms)) {
                this.remove(order[i]);
                removed.push(order[i].root.name()); // skip over the offender in this loop
              }
            }
          }
        }
      }
    }
    
    getOrderedCorpus() {
      const genera = this.genera;
      var corpus = [];
      
      while(corpus.length < 10) {
        corpus.push([]);
      }
  
      for (let n in genera) {
        const genus = genera[n];
        const count = genus.count;
        corpus[count].push(genus);
      }
      return corpus;
    }
  }
  
  class OpoGenus {
    constructor(opo) {
      this.root = opo;
      this.rotations = this.findRotations([opo]);
      const rots = [].concat(this.rotations.all());
      rots.push(opo);
      this.mirrors = this.findMirrors(rots);
      
      this.count = opo.count();
    }
    
    findRotations(set) {
      let uniques = [];
      for (let compare of set) {
        const R = compare.rotate("R");
        const RR = compare.rotate("R").rotate("R");
        const RRR = compare.rotate("R").rotate("R").rotate("R");
  
        if (!opoIsInArray(R,set) && !opoIsInArray(R,uniques)) uniques.push(R);
        if (!opoIsInArray(RR,set) && !opoIsInArray(RR,uniques)) uniques.push(RR);
        if (!opoIsInArray(RRR,set) && !opoIsInArray(RRR,uniques)) uniques.push(RRR);
      }
      
      console.log(uniques)
      return {
        all: function() {
          return uniques;
        }
      };
    }
    
    findMirrors(set) {
      let uniques = [];
      for (let compare of set) {
        const H = compare.mirror("H")
        const V = compare.mirror("V")
  
        if (!opoIsInArray(H,set) && !opoIsInArray(H,uniques)) uniques.push(H);
        if (!opoIsInArray(V,set) && !opoIsInArray(V,uniques)) uniques.push(V);
      }
      
      return {
        all: function(){
          return uniques;
        }
      }
    }
    
    permutations() {
      return [].concat(this.rotations.all()).concat(this.mirrors.all());
    }
  }
  
  function opoIsInArray(opo, array) {
    for (let arrOpo of array) {
      if (arrOpo.name() === opo.name()) {
        return true;
      }
    }
    return false;
  }
  
  // ----- ----- ----- -----
  
  class Renderer {
    constructor() {
      this.totalOpojRendered = 0;
    }
    
    output(input, stringify) {
      if (input === undefined) input = "UNDEFINED";
      const outpText = stringify ? JSON.stringify(input) : input;
      document.getElementById("output").innerText += outpText + "\n---\n";
    }
    
    displayCorpus() {
      this.prepOpoDisplay();
  
      const orderedCorpus = OPOJ.getOrderedCorpus();
  
      for (let set of orderedCorpus) {
        const setNumber = set[0].count;
        let opoRow = document.getElementById(`opo-row-${setNumber}`);
        for (let g of set) {
          const opGen = this.createOpoGenus(g)
          opoRow.append(opGen);
        }
      }
    }
    
    prepOpoDisplay() {
      const opoDisplay = document.getElementById("opoDisplay");
      opoDisplay.innerHTML = "";
      let i = 0;
      while (i < 10) {
        opoDisplay.innerHTML += `<div id="opo-row-${i}" class="opo-row"></div>`
        i++
      }
    }
    
    createOpoGenus(g) {
      // const opEl = this.createOpo(g.root)
      // return opEl;
      
      // new stuff, delete old stuff when it's done
      
      const nOG = document.querySelector("#components .opo-genus").cloneNode(true);
      
      nOG.querySelector(".root").append( this.createOpo(g.root) );
      const cRotations = nOG.querySelector(".rotations");
      
      g.rotations.all().forEach(opo=>{
        if (opo) {
          cRotations.append( this.createOpo(opo) )
        }
      });
      
      const cMirrors = nOG.querySelector(".mirrors");
      
      g.mirrors.all().forEach(opo=>{
        if (opo) {
          cMirrors.append( this.createOpo(opo) )
        }
      });
      
      return nOG;
    }
    
    createOpo(opo) {
      const nOC = document.querySelector("#components .opo").cloneNode(true);
      nOC.querySelectorAll(".opo-cell").forEach((cell, i)=>{
        if (opo.config()[i]) cell.classList.add("dark");
      });
      this.totalOpojRendered++;
      return nOC;
    }
  }
  // ----- ----- ----- -----
  
  const OPOJ = new OpoCorpus();
  
  function test(msg) {
    console.log(msg)
    let i = 0;
    const tests = 100;
    const times = [];
    while (i<tests) {
      const start = Date.now();
      new OpoCorpus().make();
      const elapsed = Date.now() - start;
      times.push(elapsed);
      i++
    }
    const total = times.reduce((a,b)=>a+b)
    return console.log(`Average time: ${total / tests}ms in total ${total}ms`);
  }
  
  // test("TESTING: Build half of corpus and invert it");
  
  console.time("Build Corpus: ")
  OPOJ.make();
  console.timeEnd("Build Corpus: ")
  
  // console.time("Prune Corpus: ")
  // OPOJ.prune();
  // console.timeEnd("Prune Corpus: ")
  
  const renderer = new Renderer();
  
  console.time("Render Corpus: ")
  renderer.displayCorpus()
  console.timeEnd("Render Corpus: ")
  
  console.log(renderer.totalOpojRendered);
  