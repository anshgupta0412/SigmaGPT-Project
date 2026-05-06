import { useState } from "react";
import "./LoginForm.css";

function LoginForm({ setShowLogin, setLoggedInUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://sigmagpt-mern.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      setLoggedInUser(data.user);
      setShowLogin(false);
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="authOverlay">
      <div className="authModalBox">
        <h2>Welcome Back!!</h2>

        <form className="authForm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="switchAuth" onClick={() => setShowLogin(false)}>
          Cancel
        </p>
      </div>
    </div>
  );
}

export default LoginForm;