import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function Home() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch(`${API}/pages`)
      .then(res => res.json())
      .then(data => setPages(data))
      .finally(() => setLoading(false));
  }, []);

  /* -------- TYPES FOR FILTER -------- */
  const pageTypes = useMemo(() => {
    const types = pages.map(p => p.type).filter(Boolean);
    return ["all", ...new Set(types)];
  }, [pages]);

  /* -------- FILTER + SORT -------- */
  const filteredPages = useMemo(() => {
    let result = [...pages];

    if (search) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      result = result.filter(p => p.type === typeFilter);
    }

    switch (sort) {
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [pages, search, sort, typeFilter]);

  return (
    <div className="page-container">
      <h1 className="page-title">Wiki Pages</h1>
      <p className="page-summary">
        Browse, search and filter wiki pages.
      </p>

      {/* 🔥 CONTROL BAR */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-field"
          style={{ padding: "6px 10px" }}
        />

        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          {pageTypes.map(type => (
            <option key={type} value={type}>
              {type === "all" ? "All types" : type}
            </option>
          ))}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">Title A–Z</option>
          <option value="za">Title Z–A</option>
        </select>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p style={{ opacity: 0.7 }}>Loading pages...</p>
      ) : filteredPages.length === 0 ? (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
            background: "#fff5f5",
            border: "1px solid #fecaca",
            borderRadius: "10px",
          }}
        >
          <h3>No pages found</h3>
          <p>Try changing filters or search query.</p>
        </div>
      ) : (
        <div className="pages-grid">
          {filteredPages.map(page => (
            <Link
              to={`/pages/${page._id}`}
              key={page._id}
              className="page-card"
            >
              <h3>{page.title}</h3>
              <p>{page.summary || "No summary available"}</p>

              {page.type && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "6px",
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    background: "#fee2e2",
                    borderRadius: "999px",
                  }}
                >
                  {page.type}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
