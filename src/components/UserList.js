import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/apibase";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [apiConfig, setApiConfig] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch column config
    axios.get("http://localhost:3000/api/config/user")
      .then((res) => setColumns(res.data))
      .catch((err) => console.error("Field config error", err));

    // Fetch endpoint config
    axios.get("http://localhost:3000/api/config/table/user")
      .then((res) => {
        const map = {};
        res.data.forEach(item => {
          map[item.action] = { method: item.method, url: item.endpoint_url };
        });
        setApiConfig(map);
      })
      .catch((err) => console.error("API config error", err));
  }, []);

  useEffect(() => {
    // Once apiConfig is ready, call list API
    if (apiConfig.list?.url) {
      axios.get("http://localhost:3000" + apiConfig.list.url)
        .then(res => setUsers(res.data))
        .catch(err => console.error("User fetch failed", err));
    }
  }, [apiConfig]);

  const handleEdit = (id) => {
    const url = apiConfig.edit?.url?.replace(":id", id);
    if (url) navigate(`/edit-user/${id}`);
  };

  const handleView = (id) => {
    const url = apiConfig.view?.url?.replace(":id", id);
    if (url) navigate(`/view-user/${id}`);
  };

  const handleDelete = async (id) => {
    const config = apiConfig.delete;
    if (config?.url && config?.method === "DELETE") {
      const url = "http://localhost:3000" + config.url.replace(":id", id);
      if (window.confirm("Are you sure to delete?")) {
        await axios.delete(url);
        setUsers(users.filter((u) => u.id !== id)); // Optimistic update
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>User List</h3>
      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={index}>
              {columns.map((col, i) => (
                <td key={i}>
                  {col.type === "date" && u[col.field_name]
                    ? new Date(u[col.field_name]).toLocaleDateString()
                    : u[col.field_name]}
                </td>
              ))}
              <td>
                {apiConfig.view && <button className="btn btn-sm btn-info me-1" onClick={() => handleView(u.id)}>View</button>}
                {apiConfig.edit && <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(u.id)}>Edit</button>}
                {apiConfig.delete && <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
