import React, { Component } from "react";

import Opo from "../opo";
import OpoSkribita from "../opoSkribita";

import "./styles.css";

class OpoGenus extends Component {
  constructor(props) {
    super(props);

    const { grandForm } = this.props.genus;

    this.state = {
      selectedForm: grandForm,
      showTilings: false,
    };
  }

  handleSelectForm = (opo) => {
    this.setState({ selectedForm: opo });
  };

  handleShowTilings = () => {
    this.setState({ showTilings: !this.state.showTilings });
  };

  render() {
    const { grandForm, majorForms, minorForms } = this.props.genus;
    const { selectedForm, showTilings } = this.state;
    const tilings = grandForm.tilings();
    const totalTilings =
      tilings.length * (majorForms.length + minorForms.length);

    return (
      <div className="opo-genus">
        <h3>
          {grandForm.name()}
          <button onClick={this.handleShowTilings}>🖌</button>
        </h3>
        <p>
          {totalTilings === tilings.length
            ? "One form with "
            : "Each form has "}
          <strong>
            {tilings.length} tiling{tilings.length > 1 ? "s" : ""}
          </strong>{" "}
          <em>({totalTilings} total)</em>
        </p>
        <div className="genus-data">
          <div className="genus-formal-data">
            <section className="genus-selected-form">
              <Opo display={"large"} opo={selectedForm} />
            </section>
            <section className="genus-forms genus-major-forms">
              {majorForms.map((opo) => (
                <section
                  key={"majforms-" + opo.name()}
                  className={opoClasses(opo, selectedForm, grandForm)}
                  onClick={() => this.handleSelectForm(opo)}
                >
                  <Opo display={"mini"} opo={opo} />
                </section>
              ))}
            </section>
            <section className="genus-forms genus-minor-forms">
              {minorForms.map((opo) => (
                <section
                  key={"minforms-" + opo.name()}
                  className={opoClasses(opo, selectedForm)}
                  onClick={() => this.handleSelectForm(opo)}
                >
                  <Opo display={"mini"} opo={opo} />
                </section>
              ))}
            </section>
          </div>
          <div className="genus-tiling-data">
            {showTilings &&
              selectedForm.tilings().map((tiling) => (
                <section
                  key={selectedForm.name() + tiling.join("-")}
                  className="tiling"
                >
                  <OpoSkribita tiling={tiling} />
                </section>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

function opoClasses(opo, selectedOpo, grandForm) {
  const classes = ["opo-form"];
  if (opo.name() === selectedOpo.name()) classes.push("selected");

  if (grandForm && opo.name() === grandForm.name()) classes.push("grand-form");

  return classes.join(" ");
}

export default OpoGenus;
