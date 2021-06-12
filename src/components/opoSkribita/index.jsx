import "./styles.css";
import masonita from "../../data/faces/masonita";

const faces = { masonita };

const OpoSkribita = ({ tiling, face = "masonita" }) => {
  return (
    <div
      className="skribado"
      onClick={() => {
        console.log(tiling);
      }}
    >
      {tiling.map((stroke, i) => (
        <img
          key={tiling.join("-") + "--" + i}
          className="streko"
          src={faces[face][stroke]}
        />
      ))}
    </div>
  );
};

export default OpoSkribita;
