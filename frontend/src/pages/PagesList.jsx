import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "https://wakifin-api.knm251-mov.workers.dev";

export default function PagesList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🔐 дістаємо юзера з JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      console.log("Loading pages from:", API);
      const res = await fetch(`${API}/pages`);
      const data = await res.json();
      console.log("✅ Pages loaded:", data);
      setPages(data);
    } catch (err) {
      console.error("❌ Error loading pages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Видалити цю сторінку?")) return;

    try {
      await fetch(`${API}/pages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      loadPages();
    } catch (err) {
      console.error("Error deleting page:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ paddingTop: "80px" }}>
      <h1>Pages</h1>

      <Link className="primary-btn" to="/pages/create">
        Create Page
      </Link>

      <table
        className="users-table"
        style={{ marginTop: "1.5rem", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Summary</th>
            <th>Author</th>
            <th style={{ width: "200px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {pages.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                No pages yet.
              </td>
            </tr>
          )}

          {pages.map((p) => {
            const isAuthor =
              user && p.author && p.author._id === user.id;

            const isAdmin = user && user.role === "admin";

            return (
              <tr key={p._id}>
                <td>
                  <Link to={`/pages/${p._id}`}>{p.title}</Link>
                </td>

                <td>{p.summary || "—"}</td>

                <td>
                  {p.author
                    ? `${p.author.firstName} ${p.author.lastName}`
                    : "—"}
                </td>

                <td>
                  {(isAuthor || isAdmin) && (
                    <>
                      <Link
                        className="edit-btn"
                        to={`/pages/${p._id}/edit`}
                      >
                        Edit
                      </Link>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(p._id)}
                        style={{ marginLeft: "0.5rem" }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
