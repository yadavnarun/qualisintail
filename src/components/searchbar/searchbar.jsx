import React, { useEffect, useState } from "react";
import "./searchbar.scss";

const Searchbar = ({ data, set, name }) => {
  const [term, setTerm] = useState("");

  useEffect(() => {
    set(
      data.filter((element) =>
        element[name].toLowerCase().includes(term.toLowerCase())
      )
    );
  }, [term, data, set, name]);

  return (
    <>
      <div className="searchbar">
        <input
          type="text"
          placeholder="search name"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        ></input>
      </div>
    </>
  );
};
export default Searchbar;
