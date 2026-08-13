import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { login } = useAuth();

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username) {
      setError("Please enter your username.");
      return;
    }
    if (!formData.password) {
      setError("Please enter password.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      login(data.user, data.token);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1 className="form-heading">Log In</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="input">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="submit-btn">
          Submit
        </button>
        <p className="login-link">
          Don't have an account?{" "}
          <Link className="nav-link" to="/register">
            Sign up
          </Link>
        </p>
      </form>
      <Link className="back-btn" to="/">
        Back to Home
      </Link>
    </div>
  );
};

export default Login;
