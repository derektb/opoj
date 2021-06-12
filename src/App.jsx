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
    const naŭopoj = generateOpoj(3);
    // const sortedNaŭopoj = sortOpoj(naŭopoj);
    // const sortedNaŭopoj = NAŬOPOJ.set;

    this.testOpoClasses();

    return (
      <div className="App">
        <a href="https://codepen.io/derektimmbrock/pen/gOaEvqx">Convert This</a>
        <hr />
        <div id="simple-output">
          {naŭopoj.genera.map((set, i) => (
            <div key={"set" + i}>
              <h2>— {i} —</h2>
              <h3>{set.length > 1 ? `${set.length} Genera` : `1 Genus`}</h3>
              <section>
                {set.map((naŭopo, j) => (
                  <OpoGenus genus={naŭopo} key={"opogenus" + j} />
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
