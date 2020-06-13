import React, { useState } from "react";
import { Route, Switch, Link, BrowserRouter as Router, useParams, useHistory } from "react-router-dom";
import { Home } from "./Home.js";
import { Register } from "./Register.js";
import { Stocks } from "./Stocks.js";
import { Quote } from "./Quote.js";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import "./styles.css";

function Routing() {
  return (
    <Router>
      <div className="row">
        <div className="column-left">
          <nav>
            <div>
              <Link to="/">
                <button>Home</button>
              </Link>
            </div>
            <div>
              <Link to="/stocks/null">
                <button>Stocks By Industry</button>
              </Link>
            </div>
            <br />
            <br />
            <br />
            <div>
              <Link to="/login">
                <button>Authorisation</button>
              </Link>
            </div>
            <div>
              <Link to="/register">
                <button>Registration</button>
              </Link>
            </div>
          </nav>
        </div>
        {/* use :id to pass parameters through the url */}
        <div className="column-right">
          <Switch>
            <Route path="/stocks/:id">
              <Stocks />
            </Route>
            <Route path="/quote/:id">
              <Quote />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

function Login() {
  const [userName, setUsername] = useState(``);
  const [password, setPassword] = useState(``);
  const [error, setError] = useState(null);
  const [loginResult, setLoginResult] = useState(null);
  let token = sessionStorage.getItem("token");
  //sends the POST request
  function login(username, password) {
    const url = `http://131.181.190.87:3000/user/login`;
    return fetch(url, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password: password })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res.error)
        } else {
          sessionStorage.setItem("token", res.token);
          setLoginResult(res.message);
          alert("Logged In!");
        }
      }
      )
  }

  //use this for when the user is logged in and wants to log out
  function logout() {
    sessionStorage.removeItem("token");
  }

  if (token) {
    return (
      <div>
        <br />
        <br />
        <h2>You Are Logged In!</h2>
        <br />
        <Link to="/">
          <button onClick={() => logout()}>Logout</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="loginForm">
      <br />
      <br />
      <h2>Login</h2>
      <h3>Username</h3>
      <input
        value={userName}
        onChange={e => setUsername(e.target.value)}
        type="text"
        placeholder="Email"
        name="email"
      />
      <h3>Password</h3>
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <br />
      <br />
      <button onClick={() => login(userName, password)}>Login</button>
      <div
        className="errorMessage">
        {loginResult ?
          <p>{loginResult}!</p>
          : null}
      </div>
      <div
        className="errorMessage">
        {error ?
          <p>Unauthorised Access! <br />Check Your Username And/Or Password!</p>
          : null}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <div className="Heading">
        <div className="HeadingInner">
          <h1><b>STOCK ANALYST PORTAL</b></h1>
        </div>
      </div>
      <Routing />
    </div>
  );
}