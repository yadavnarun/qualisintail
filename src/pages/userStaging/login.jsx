import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./style.scss";

const Login = ({ setLoginUser }) => {
  const history = useHistory();

  const [output, setOutput] = useState("");

  const [user, setUser] = useState({
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

  const login = () => {
    if (user.email && user.password) {
      axios
        .post("/api/login", user)
        .then((res) => {
          if (res.data.message !== undefined) {
            setOutput(res.data.message);
          } else {
            setLoginUser({
              name: res.data.name,
              email: res.data.email,
              _id: res.data._id,
              token: res.data.token
            });

            sessionStorage.setItem("name", res.data.name);
            sessionStorage.setItem("email", res.data.email);
            sessionStorage.setItem("id", res.data._id);
            sessionStorage.setItem("token", res.data.token);

            history.push("/");
          }
        })
        .catch((err) => setOutput(JSON.stringify(err.message)));
    } else {
      setOutput("invalid input");
    }
  };

  return (
    <>
      <div className="login-block">
        <div>Sign In</div>
        <br />
        <div>
          <form>
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
            <div className="forgot">
              <a href="_blank">Forgot Your Password?</a>
            </div>
            <div className="button-group">
              <span onClick={() => history.push("/Register")}>Register</span>
              <span className="button" onClick={login}>
                Login
              </span>
            </div>
          </form>
          <div className="error">{output}</div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Login;
