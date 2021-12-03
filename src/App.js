import { React, useState, Suspense, lazy } from "react";
import "./App.scss";
import {
  Route,
  Switch,
  Redirect,
  useLocation,
  HashRouter,
} from "react-router-dom";
import Loader from "./components/loader/loader";

const Login = lazy(() => import("./pages/userStaging/login"));
const Register = lazy(() => import("./pages/userStaging/register"));
const Navbar = lazy(() => import("./components/navbar/navbar"));
const Homepage = lazy(() => import("./pages/home/homepage"));
const Boards = lazy(() => import("./pages/boards/boards"));
const Users = lazy(() => import("./pages/users/users"));
const Pastew = lazy(() => import("./pages/pastew/pastew"));
const Pingo = lazy(() => import("./pages/pingo/pingo"));

function App() {
  const [user, setLoginUser] = useState({
    name: sessionStorage.getItem("name"),
    email: sessionStorage.getItem("email"),
    _id: sessionStorage.getItem("id"),
    token: sessionStorage.getItem("token"),
  });

  return (
    <div className="App">
      <HashRouter>
        <div>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route exact path="/login">
                <Login setLoginUser={setLoginUser} />
              </Route>

              <Route exact path="/register">
                <Register />
              </Route>

              <Route exact path="/pastew/:id">
                <Pastew user={user} />
              </Route>

              <>
                <Navbar user={user} setLoginUser={setLoginUser} />

                <Suspense fallback={<div>Loading...</div>}>
                  <Switch>
                    {user.name && user._id && user.token ? null : (
                      <Redirect to="/login" />
                    )}

                    <Route exact path="/">
                      <Homepage />
                    </Route>

                    <Route exact path="/users">
                      <Users />
                    </Route>

                    <Route exact path="/boards">
                      <Boards user={user} />
                    </Route>

                    <Route exact path="/pastew">
                      <Pastew />
                    </Route>

                    <Route exact path="/pingo">
                      <Pingo user={user} />
                    </Route>

                    <Route path="*">
                      <NoMatch />
                    </Route>
                  </Switch>
                </Suspense>
              </>
            </Switch>
          </Suspense>
        </div>
      </HashRouter>
    </div>
  );
}

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <h3>
        No match for <code>{location.pathname}</code>
        <br />
        404 page here
      </h3>
    </div>
  );
}

export default App;
