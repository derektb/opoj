import React, { Component } from "react";
import Opo from "../opo/";
import OpoSkribita from "../opoSkribita";
import "./styles.css";

const NumEO = [
  "Nul",
  "Unu",
  "Du",
  "Tri",
  "Kvar",
  "Kvin",
  "Ses",
  "Sep",
  "Ok",
  "Naŭ",
];

class OpoModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedForm: props.genus.grandForm,
    };
  }

  genusName(genus) {
    const { grandForm } = genus;
    const familyName = NumEO[genus.grandForm.arr.length] + "ara";
    const genName = NumEO[genus.count()] + "opa";

    return familyName + " " + genName;
  }

  speciesName(opo) {
    return opo.name() + "-uja";
  }

  genusData(genus) {
    let data = [];
    let symmetry = null;
    let chirality = null;
    let tilings = null;
    if (genus.majorForms.length === 1)
      symmetry = <span key="symmetry">Full Symmetry; </span>;
    if (genus.majorForms.length === 2)
      symmetry = <span key="symmetry">Partial Symmetry; </span>;
    if (genus.majorForms.length === 4)
      symmetry = <span key="symmetry">Asymmetric; </span>;
    chirality = (
      <span key="chirality">
        {genus.minorForms.length ? "Chiral" : "Non-Chiral"};{" "}
      </span>
    );
    const tilingsAmt =
      genus.grandForm.tilings().length *
      (genus.majorForms.length + genus.minorForms.length);
    tilings = (
      <span key="tilings">
        Tiles {genus.grandForm.tilings().length}:{tilingsAmt}
      </span>
    );
    data = [symmetry, chirality, tilings];
    return <p>{data}</p>;
  }

  handleSelectForm = (form) => {
    this.setState({ selectedForm: form });
  };

  render() {
    const { genus } = this.props;
    const { grandForm, majorForms, minorForms } = genus;
    const { selectedForm } = this.state;
    const pfx = "opo-inspector-";

    const formCount = majorForms.length + minorForms.length;
    const formHeader = `${formCount} Form${formCount > 1 ? "s" : ""}`;

    return (
      <div className="opo-modal">
        <h2>
          <em>{this.genusName(genus)}</em>{" "}
          <strong>{this.speciesName(grandForm)}</strong>
        </h2>
        {this.genusData(genus)}
        <hr />
        <div className="form-info">
          <section className="grand-form">
            <h3>Grand Form</h3>
            <Opo opo={grandForm} />
          </section>
          <section className="all-forms">
            <section className="selected-form">
              <h4>{formHeader}</h4>
              <Opo opo={selectedForm} />
            </section>
            <section className="form-listings">
              <ul className="form-listing major-forms">
                <li>
                  <h5>Major</h5>
                </li>
                {majorForms.map((form) => (
                  <li
                    className={`form-listing-item ${
                      form === selectedForm ? "selected" : ""
                    }`}
                    onClick={() => this.handleSelectForm(form)}
                    key={pfx + "mjfm-" + form.name()}
                  >
                    <Opo opo={form} />
                  </li>
                ))}
              </ul>
              {!!minorForms.length && (
                <ul className="form-listing minor-forms">
                  <li>
                    <h5>Minor</h5>
                  </li>
                  {minorForms.map((form) => (
                    <li
                      className={`form-listing-item ${
                        form === selectedForm ? "selected" : ""
                      }`}
                      onClick={() => this.handleSelectForm(form)}
                      key={pfx + "mnfm-" + form.name()}
                    >
                      <Opo opo={form} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </section>
        </div>
        <hr />
        <div className="tiling-info">
          <h3>
            {selectedForm.tilings().length} Tiling
            {selectedForm.tilings().length > 1 ? "s" : ""} for Form{" "}
            <Opo opo={selectedForm} />
          </h3>
          <div className="all-tilings">
            {selectedForm.tilings().map((tiling) => (
              <div
                className="tiling"
                key={pfx + selectedForm.name() + "-" + tiling.join("")}
              >
                <OpoSkribita tiling={tiling} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default OpoModal;
