import React, { useEffect, useState } from "react";
import { getAllUsers } from "../api/userApi"; // ✅ Use shared API

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users", err));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>DOB</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.dob ? new Date(u.dob).toLocaleDateString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
