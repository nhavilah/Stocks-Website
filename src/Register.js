import React, { useState } from "react";
export function Register() {
    const [userName, setUsername] = useState(``);
    const [password, setPassword] = useState(``);
    const [registrationResult, setRegistrationResult] = useState(null);
    function login(username, password) {
        const url = `https://172.22.25.101/user/register`;
        return fetch(url, {
            method: "POST",
            headers: { accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ email: username, password: password })
        })
            .then((res) => res.json())
            .then((res) => {
                setRegistrationResult(res.message);
            }
            )
    }
    return (
        <div className="loginForm">
            <br />
            <br />
            <h2>Register</h2>
            <h3>Username</h3>
            <input
                id="uname"
                onChange={e => setUsername(e.target.value)}
                type="text"
                placeholder="Email"
                name="email"
            />
            <h3>Password</h3>
            <input
                id="pword"
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
            />
            <br />
            <br />
            <button onClick={() => {
                login(userName, password);
                document.getElementById("uname").value = "";
                document.getElementById("pword").value = "";
            }}
            >
                Register
                    </button>
            <div>{registrationResult ? <h4>{registrationResult}!</h4> : null}</div>
        </div>
    );
}