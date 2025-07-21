import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../api/userApi";
import "../styles/LoginForm.css"; // Assuming you have some styles for the login form
function LoginForm() {
  const [formConfig, setFormConfig] = useState([]);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/config/login")
      .then((res) => setFormConfig(res.data))
      .catch((err) => console.error("Login config load failed", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      if (res.data.success) {
        navigate("/users");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };
 const goToCreateUser = () => {
    navigate("/create"); // ✅ Existing route to create user
  };
  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4 text-center">Login</h3>
      {error && <p className="text-danger text-center">{error}</p>}
      <form onSubmit={handleLogin}>
        {formConfig.map((field, idx) => (
          <div className="mb-3" key={idx}>
            <label className="form-label">{field.label}</label>
            <input
              type={field.type}
              name={field.field_name}
              required={field.required}
              value={form[field.field_name] || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        ))}
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <p className="create-link">
            Don't have an account?{" "}
            <button type="button" className="link-button" onClick={goToCreateUser}>
              Create one
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
