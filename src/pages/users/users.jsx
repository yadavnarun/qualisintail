import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./users.scss";
import Searchbar from "../../components/searchbar/searchbar";

const Users = () => {
  const [usrs, setUsrs] = useState([]);
  const [orgUsers, setOrgusers] = useState([]);

  useEffect(() => {
    const usr = () => {
      axios
        .get("/api/users")
        .then((res) => {
          if (res.data) {
            setUsrs([...res.data]);
            setOrgusers([...res.data]);
          } else {
            console.log("error");
          }
        })
        .catch((err) => console.log(err));
    };

    usr();
  }, []);

  return (
    <>
      <div className="users-page">
        <Searchbar data={orgUsers} set={setUsrs} name="name" />
        <div className="users">
          {usrs.map((elem) => {
            return (
              <div className="user-box" key={elem._id}>
                <Link to={{ pathname: "/boards", state: { user: elem._id } }}>
                  <div>{elem.name}</div>
                  <div>{elem.email}</div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Users;
