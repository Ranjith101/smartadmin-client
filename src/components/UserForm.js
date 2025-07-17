import React, { useEffect, useState } from "react";
import axios from "axios";
import { createUser } from "../api/userApi"; // This is your POST API

const UserForm = ({ onUserCreated }) => {
  const [formConfig, setFormConfig] = useState([]);
  const [formData, setFormData] = useState({});

  // Load form config from backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/config/user")
      .then((res) => setFormConfig(res.data))
      .catch((err) => console.error("Config load error", err));
  }, []);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData); // POST API call
      setFormData({});
      onUserCreated(); // Refresh list if needed
    } catch (error) {
      alert("Error creating user");
    }
  };

  return (
    <div className="container mt-4">
  <h3 className="mb-4">User Form</h3>
  <form onSubmit={handleSubmit}>
    <div className="row">
      {formConfig.map((field, idx) => (
        <div className="col-md-6 mb-3" key={idx}>
          <label className="form-label">{field.label}</label>
          {field.type === "select" ? (
            <select
              className="form-select"
              required={field.required}
              value={formData[field.field_name] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.field_name]: e.target.value,
                })
              }
            >
              <option value="">-- Select --</option>
              {field.options?.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              className="form-control"
              required={field.required}
              value={formData[field.field_name] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.field_name]: e.target.value,
                })
              }
            />
          )}
        </div>
      ))}
    </div>
    <button type="submit" className="btn btn-primary mt-2">
      Submit
    </button>
  </form>
</div>

  );
};

export default UserForm;
