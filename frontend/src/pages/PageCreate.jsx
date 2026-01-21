import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE;

export default function PageCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [user, setUser] = useState(null);

  const editorRef = useRef(null);

  /* ---------- AUTH ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const isPremium = user?.role === "premium" || user?.role === "admin";

  /* ---------- FORMAT ---------- */
  const cmd = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  /* ---------- PREMIUM: TABLE ---------- */
  const insertTable = () => {
    if (!isPremium) return;

    const rows = Number(prompt("Rows:", 2));
    const cols = Number(prompt("Columns:", 2));
    if (!rows || !cols) return;

    let html = "<table border='1'><tbody>";
    for (let r = 0; r < rows; r++) {
      html += "<tr>";
      for (let c = 0; c < cols; c++) {
        html += "<td>Cell</td>";
      }
      html += "</tr>";
    }
    html += "</tbody></table>";

    document.execCommand("insertHTML", false, html);
  };

  /* ---------- PREMIUM: BLOCKS ---------- */
  const insertBlock = (type) => {
    if (!isPremium) return;

    const html = `
      <div class="custom-block ${type}">
        <strong>${type.toUpperCase()}</strong>
        <p>Text...</p>
      </div>
    `;
    document.execCommand("insertHTML", false, html);
  };

  /* ---------- PREMIUM: IMAGE DROP ---------- */
  const onDropImage = (e) => {
    if (!isPremium) return;

    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      document.execCommand(
        "insertHTML",
        false,
        `<img src="${reader.result}" alt="" />`
      );
    };
    reader.readAsDataURL(file);
  };

  /* ---------- SAVE ---------- */
  const createPage = async () => {
    const res = await fetch(`${API}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        summary,
        content,
      }),
    });

    if (res.ok) navigate("/pages");
  };

  return (
    <div className="page-container">
      <h1>Create page</h1>

      {!isPremium && (
        <div className="premium-hint">
          Some editor features are available only for premium users.
        </div>
      )}

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {/* TOOLBAR */}
      <div className="toolbar">
        <button onClick={() => cmd("bold")}>Bold</button>
        <button onClick={() => cmd("italic")}>Italic</button>
        <button onClick={() => cmd("underline")}>Underline</button>

        {isPremium && (
          <>
            <button onClick={insertTable}>Table</button>
            <button onClick={() => insertBlock("info")}>Info</button>
            <button onClick={() => insertBlock("warning")}>Warning</button>
            <button onClick={() => insertBlock("lore")}>Lore</button>
            <button onClick={() => insertBlock("spoiler")}>Spoiler</button>
            <button onClick={() => setPreview((p) => !p)}>
              {preview ? "Edit" : "Preview"}
            </button>
          </>
        )}
      </div>

      {/* EDITOR */}
      {!preview ? (
        <div
          ref={editorRef}
          contentEditable
          className="editor"
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          onDrop={onDropImage}
          onDragOver={(e) => e.preventDefault()}
        />
      ) : (
        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      <button className="primary-btn" onClick={createPage}>
        Create
      </button>
    </div>
  );
}
