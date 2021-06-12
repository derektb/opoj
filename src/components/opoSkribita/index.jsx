import "./styles.css";
import masonita from "../../data/faces/masonita";

const OpoSkribita = ({ tiling, face = "masonita" }) => {
  return (
    <div className="skribado">
      {tiling.map((stroke) => (
        <img
          key={tiling.join("-") + stroke}
          className="streko"
          src={masonita[stroke]}
        />
      ))}
    </div>
  );
};

export default OpoSkribita;
