import Opo from "../opo";

const OpoGenus = ({ genus }) => {
  const { opo } = genus;

  return (
    <div className="opo-genus">
      <h3>{genus.name}</h3>
      <section>
        <Opo display={"large"} opo={opo} />
      </section>
      <section style={{ backgroundColor: "yellow" }}>
        {genus.rotations.map((opo) => (
          <Opo display={"mini"} opo={opo} key={opo.join("")} />
        ))}
      </section>
      <section style={{ backgroundColor: "green" }}>
        {genus.rotReflect.map((opo) => (
          <Opo display={"mini"} opo={opo} key={opo.join("")} />
        ))}
      </section>

      {/* <button onClick={() => console.log(genus)}>Genus</button> */}
    </div>
  );
};

export default OpoGenus;
