import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./style.scss";

const Register = () => {
  const history = useHistory();

  const [output, setOutput] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const validate = (type, text) => {
    const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    let res = false;

    switch (type) {
      case "email":
        if (text.match(mailformat)) res = true;
        break;

      default:
        res = false;
    }

    return res;
  };

  //register function
  const submit = () => {
    const { name, email, password } = user;

    if (name && email && password) {
      if (validate("email", email)) {
        axios
          .post("/api/register", user)
          .then((res) => {
            if (res.data.message === "exist")
              setOutput("user is already registered");
            else history.push("/Login");
          })
          .catch((err) => setOutput(JSON.stringify(err.message)));
      } else {
        setOutput("please enter valid details");
      }
    } else {
      setOutput("invalid input");
    }
  };

  return (
    <>
      <div className="login-block">
        <div>Create new account</div>
        <br />
        <div>
          <form action="#">
            <div>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <div className="button-group">
              <span onClick={() => history.push("/Login")}>Login</span>
              <span className="button" onClick={submit}>
                Signup
              </span>
            </div>
          </form>

          <div className="error">{output}</div>
        </div>
      </div>
    </>
  );
};

export default Register;
