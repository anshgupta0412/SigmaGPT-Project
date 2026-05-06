import { useState } from "react";
import "./SignUpForm.css";

function SignupForm({ setShowSignup, setLoggedInUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("https://sigmagpt-mern.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      // Auto-login after successful signup
      const loginRes = await fetch("https://sigmagpt-mern.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        setLoggedInUser(loginData.user);
      }

      setShowSignup(false);
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="authOverlay">
      <div className="authModalBox">
        <h2>Create Account</h2>

        <form className="authForm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>

        <p className="switchAuth" onClick={() => setShowSignup(false)}>
          Cancel
        </p>
      </div>
    </div>
  );
}

export default SignupForm;