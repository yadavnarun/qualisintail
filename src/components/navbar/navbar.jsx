import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./navbar.scss";

import { MdOutlineAccountCircle, MdMenu } from "react-icons/md";

const Navbar = ({ user, setLoginUser }) => {
  const history = useHistory();

  const [userpopup, setUserpopup] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.getElementById("details").style.display = userpopup
      ? "block"
      : "none";
  }, [userpopup]);

  useEffect(() => {
    if (menu)
      document.getElementById("user-menu").classList.add("user-menu-sm");
    else document.getElementById("user-menu").classList.remove("user-menu-sm");
  }, [menu]);

  return (
    <>
      <div className="navbar">
        <img src={require("../../assets/logo192.png").default} alt="user" />

        <div className="user-menu" id="user-menu">
          <div className="menu-options">
            <div onClick={() => setMenu(false)}>
              <Link to="/">Home</Link>
            </div>
            <div onClick={() => setMenu(false)}>
              <Link to="/users">Users</Link>
            </div>
            <div onClick={() => setMenu(false)}>
              <Link to="/boards">Boards</Link>
            </div>
            <div onClick={() => setMenu(false)}>
              <Link to="/pastew">Pastew</Link>
            </div>
            <div onClick={() => setMenu(false)}>
              <Link to="/pingo">Pingo</Link>
            </div>
          </div>
        </div>

        <div className="user-options">
          <div onClick={() => setUserpopup(!userpopup)}>
            <MdOutlineAccountCircle />
          </div>

          <div className="menu" onClick={() => setMenu(!menu)}>
            <MdMenu />
          </div>
        </div>
      </div>

      <div
        className="user-popup"
        id="details"
        onMouseLeave={() => setUserpopup(false)}
      >
        <div>
          <MdOutlineAccountCircle />
          <div>{user.name}</div>
          <div>{user.email}</div>
        </div>

        <div className="button manage">
          <Link to="/account">manage</Link>
        </div>

        <div
          className="button"
          onClick={() => {
            sessionStorage.clear();
            setLoginUser({});
            history.push("/");
          }}
        >
          logout
        </div>
      </div>
    </>
  );
};
export default Navbar;
