import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function UsersList({ refreshKey, onEdit }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({}); // { userId: true/false }

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      loadUsers();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const togglePassword = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!users.length) return <div>No users found.</div>;

  return (
    <table className="users-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Password</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id}>
            <td>{u.firstName || ""}</td>
            <td>{u.lastName || ""}</td>
            <td>{u.email}</td>
            <td>{u.role || "user"}</td>
            <td>
              {showPasswords[u._id] ? u.password : "••••••"}
              <button
  className="password-toggle-btn"
  onClick={() => togglePassword(u._id)}
>
  {showPasswords[u._id] ? "Hide" : "Show"}
</button>

            </td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(u)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(u._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
