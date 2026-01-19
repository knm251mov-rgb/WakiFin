import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function UserForm({ onCreated, editingUser, onFinishEdit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingUser) {
      setFirstName(editingUser.firstName || "");
      setLastName(editingUser.lastName || "");
      setEmail(editingUser.email || "");
      setRole(editingUser.role || "user");
      setPassword("");
    }
  }, [editingUser]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { firstName, lastName, email, role };
    if (!editingUser || password) {
      payload.password = password;
    }

    try {
      let url = `${API_BASE}/users`;
      let method = "POST";

      if (editingUser) {
        url = `${API_BASE}/users/${editingUser._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Request failed");

      if (!editingUser) onCreated?.();
      else onFinishEdit?.();

      setFirstName("");
      setLastName("");
      setEmail("");
      setRole("user");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: "1rem" }}>
      <h3>{editingUser ? "Edit User" : "Create User"}</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className="form-row">
        <div className="form-field">
          <label>First Name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Last Name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="premium">Premium</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-field">
          <label>Password {editingUser ? "(leave empty to keep)" : ""}</label>
          <input
            type="password"
            placeholder={editingUser ? "New password (optional)" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="primary-btn" type="submit">
          {loading ? "..." : editingUser ? "Save" : "Add"}
        </button>
        {editingUser && (
          <button type="button" onClick={onFinishEdit} style={{ marginLeft: "1rem" }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
