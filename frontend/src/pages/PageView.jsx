import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function PageView() {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API}/pages/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setPage(data));

    // ⬇️ дістаємо юзера з JWT
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (e) {
        console.error("Invalid token");
      }
    }
  }, [id]);

  if (!page) return <div className="loading">Loading...</div>;

  const isAuthor =
    user && page.author && page.author._id === user.id;

  const isAdmin = user && user.role === "admin";

  return (
    <div className="page-container">
      <h1 className="page-title">{page.title}</h1>

      <p className="page-author">
        Author: {page.author?.firstName} {page.author?.lastName}
      </p>

      {page.summary && (
        <p className="page-summary">{page.summary}</p>
      )}

      <div
        className="page-content"
        dangerouslySetInnerHTML={{ __html: page.content }}
      ></div>

      {(isAuthor || isAdmin) && (
        <Link className="edit-btn" to={`/pages/${id}/edit`}>
          Edit Page
        </Link>
      )}
    </div>
  );
}
