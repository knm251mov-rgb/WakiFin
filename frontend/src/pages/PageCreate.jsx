import { useState, useRef, useEffect } from "react";

const API = import.meta.env.VITE_API_BASE;

export default function PageCreate() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [user, setUser] = useState(null);

  const editorRef = useRef(null);

  /* 🔐 Отримуємо користувача з JWT */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {}
  }, []);

  const isPremium = user?.role === "premium" || user?.role === "admin";

  /* ---------- FORMAT ---------- */
  const cmd = (c, v = null) => {
    document.execCommand(c, false, v);
    editorRef.current.focus();
  };

  /* ---------- PREMIUM: TABLE ---------- */
  const insertTable = () => {
    if (!isPremium) return alert("Premium only");

    const rows = +prompt("Rows:", 2);
    const cols = +prompt("Cols:", 2);

    let html = "<table border='1'><tbody>";
    for (let r = 0; r < rows; r++) {
      html += "<tr>";
      for (let c = 0; c < cols; c++) {
        html += "<td>...</td>";
      }
      html += "</tr>";
    }
    html += "</tbody></table>";

    document.execCommand("insertHTML", false, html);
  };

  /* ---------- PREMIUM: CUSTOM BLOCK ---------- */
  const insertBlock = (type) => {
    if (!isPremium) return alert("Premium only");

    const html = `
      <div class="block ${type}">
        <strong>${type.toUpperCase()}:</strong>
        <p>Text...</p>
      </div>
    `;
    document.execCommand("insertHTML", false, html);
  };

  /* ---------- PREMIUM: IMAGE DRAG ---------- */
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
        `<img src="${reader.result}" />`
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
      body: JSON.stringify({ title, summary, content }),
    });

    if (res.ok) location.href = "/pages";
  };

  return (
    <div className="page-container">
      <h1>Create Page</h1>

      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} />

      {/* TOOLBAR */}
      <div className="toolbar">
        <button onClick={() => cmd("bold")}>B</button>
        <button onClick={() => cmd("italic")}>I</button>
        <button onClick={() => cmd("underline")}>U</button>

        {isPremium && (
          <>
            <button onClick={insertTable}>📊 Table</button>
            <button onClick={() => insertBlock("info")}>ℹ Info</button>
            <button onClick={() => insertBlock("warning")}>⚠ Warning</button>
            <button onClick={() => insertBlock("lore")}>📜 Lore</button>
            <button onClick={() => insertBlock("spoiler")}>👁 Spoiler</button>
            <button onClick={() => setPreview(!preview)}>👁 Preview</button>
          </>
        )}
      </div>

      {/* EDITOR */}
      {!preview ? (
        <div
          ref={editorRef}
          contentEditable
          className="editor"
          onInput={e => setContent(e.currentTarget.innerHTML)}
          onDrop={onDropImage}
          onDragOver={e => e.preventDefault()}
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
