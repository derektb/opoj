import React, { Component } from "react";
import generateOpoj from "./utils/generateOpoj";
// import sortOpoj from "./utils/sortOpoj";
import "./App.css";
import OpoGenus from "./components/opoGenus";
import NAŬOPOJ from "./data/naŭopoj.json";

import Opo from "./data/opo";

class App extends Component {
  state = {};

  testOpoClasses() {
    let arr = [0, 1, 1, 0, 0, 1, 1, 1, 0];

    const opo = new Opo(arr);
    console.log("OPO TEST");
    console.log(opo.name(), opo.count());
    console.log(opo, "clone", opo.clone());
    const inv = opo.inverse();
    console.log(opo, "inverse", inv.name(), inv.count());
  }

  render() {
    const degree = 3;
    const naŭopoj = generateOpoj(degree);
    // const sortedNaŭopoj = sortOpoj(naŭopoj);
    // const sortedNaŭopoj = NAŬOPOJ.set;

    const totalGenera = naŭopoj.genera.length;
    let totalForms = 0;
    let totalTilings = 0;
    naŭopoj.genera.forEach((set) =>
      set.forEach((genus) => {
        totalForms += genus.majorForms.length + genus.minorForms.length;
        genus.majorForms.forEach((form) => {
          totalTilings += form.tilings().length;
        });
        genus.minorForms.forEach((form) => {
          totalTilings += form.tilings().length;
        });
      })
    );

    return (
      <div className="App">
        <a href="https://codepen.io/derektimmbrock/pen/gOaEvqx">Convert This</a>
        <hr />
        <div id="simple-output">
          <div className="info">
            <h1>
              {degree}
              <sup>a</sup> Degree Opoj
            </h1>
            <p>
              <em>(A Grid of {degree ** 2})</em>
            </p>
            <p>
              The {degree}
              <sup>a</sup> Opoj have {degree} Genera containing {totalForms}{" "}
              forms and {totalTilings} tilings.
            </p>
          </div>
          {naŭopoj.genera.map((set, i) => (
            <div key={"set" + i}>
              <h2>— {i} —</h2>
              <h3>{set.length > 1 ? `${set.length} Genera` : `1 Genus`}</h3>
              <section>
                {set.map((naŭopo, j) => (
                  <OpoGenus genus={naŭopo} key={"opogenus" + i + "-" + j} />
                ))}
              </section>
            </div>
          ))}
        </div>
        {/* <pre>{JSON.stringify(sortedNaŭopoj)}</pre> */}
      </div>
    );
  }
}

export default App;
