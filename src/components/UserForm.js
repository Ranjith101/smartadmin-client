import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { createUser, updateUser, getUserById } from "../api/userApi";
import API_BASE_URL from "../api/apibase";

const UserForm = ({ onUserCreated }) => {
  const [formConfig, setFormConfig] = useState([]);
  const [formData, setFormData] = useState({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [apiConfig, setApiConfig] = useState({});

  const { id } = useParams();
  const location = useLocation();
  const isEdit = location.pathname.includes("edit-user");
  const isView = location.pathname.includes("view-user");



  useEffect(() => {
  const loadConfigsAndData = async () => {
    try {
      const [formRes, tableRes] = await Promise.all([
        axios.get("http://localhost:3000/api/config/user"),
        axios.get("http://localhost:3000/api/config/table/user"),
      ]);
      setFormConfig(formRes.data);

      // ✅ Convert array to object
      const structuredApiConfig = {};
      tableRes.data.forEach((item) => {
        structuredApiConfig[item.action] = {
          method: item.method,
          url: item.endpoint_url,
        };
      });
      setApiConfig(structuredApiConfig);

      // ✅ Load user only if editing or viewing
      if ((isEdit || isView) && id && structuredApiConfig.view?.url) {
        const viewUrl = `${API_BASE_URL}${structuredApiConfig.view.url.replace(":id", id)}`;
        const userRes = await axios.get(viewUrl);
        setFormData(userRes.data);
        if (isView) setIsReadOnly(true);
      }
    } catch (error) {
      console.error("Error loading form or config", error);
    }
  };

  loadConfigsAndData();
}, [id, isEdit, isView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!isReadOnly) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (isEdit && apiConfig.update?.url) {
      //   await updateUser(id, formData, apiConfig.update.url);
      // } else {
      //   await createUser(formData);
      //   if (onUserCreated) onUserCreated();
      // }
      const actionKey = isEdit ? "edit" : "create"; // or whatever create maps to
      const config = apiConfig[actionKey];

      if (isEdit && config?.url) {
        await updateUser(id, formData, config.url);
      }else{
        await createUser(formData);
        if (onUserCreated) onUserCreated();
      }

      alert("User saved");
    } catch (error) {
      alert("Error saving user");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">
        {isView ? "View" : isEdit ? "Edit" : "Create"} User
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {formConfig.map((field, idx) => (
            <div className="col-md-6 mb-3" key={idx}>
              <label className="form-label">{field.label}</label>
              {field.type === "select" ? (
                <select
                  className="form-select"
                  name={field.field_name}
                  required={field.required}
                  value={formData[field.field_name] || ""}
                  onChange={handleChange}
                  disabled={isReadOnly}
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
                  name={field.field_name}
                  value={formData[field.field_name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  disabled={isReadOnly}
                />
              )}
            </div>
          ))}
        </div>
        {!isView && (
          <button type="submit" className="btn btn-primary mt-2">
            {isEdit ? "Update" : "Create"}
          </button>
        )}
      </form>
    </div>
  );
};

export default UserForm;
