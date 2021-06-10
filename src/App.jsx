import React, { Component } from "react";
import generateOpoj from "./utils/generateOpoj";
import sortOpoj from "./utils/sortOpoj";
import "./App.css";
import OpoGenus from "./components/opoGenus";
import NAŬOPOJ from "./data/naŭopoj.json";

class App extends Component {
  state = {};
  render() {
    const naŭopoj = generateOpoj(3);
    const sortedNaŭopoj = sortOpoj(naŭopoj);
    // const sortedNaŭopoj = NAŬOPOJ.set;

    return (
      <div className="App">
        <a href="https://codepen.io/derektimmbrock/pen/gOaEvqx">Convert This</a>
        <hr />
        <div id="simple-output">
          {sortedNaŭopoj.map((set, i) => (
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
