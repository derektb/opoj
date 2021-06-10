import "./styles.css";

const Opo = ({ opo, display }) => {
  let classNames = ["opo"];
  if (display) classNames.push("opo-" + display);
  return (
    <div className={classNames.join(" ")}>
      {opo.map((cell, i) => (
        <section
          className={`opo-cell opo-cell-${cell ? "on" : "off"}`}
          key={"cell" + i}
        ></section>
      ))}
    </div>
  );
};

export default Opo;
