import React, { useEffect } from "react";
import "./loader.scss";

function Loader({ inline }) {
  useEffect(() => {
    if (inline) document.getElementById("loader").classList.add("inline");
  }, [inline]);

  return (
    <div className="loader" id="loader">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
