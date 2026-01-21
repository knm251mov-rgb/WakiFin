import { useState, useRef, useEffect } from "react";

const API = import.meta.env.VITE_API_BASE;

export default function PageCreate() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [user, setUser] = useState(null);

  // premium styles
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const editorRef = useRef(null);

  /* 🔐 USER FROM JWT */
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

  /* ---------- PREMIUM: TEXT COLOR ---------- */
  const applyTextColor = () => {
    if (!isPremium) return;
    document.execCommand("foreColor", false, textColor);
    editorRef.current.focus();
  };

  /* ---------- PREMIUM: BACKGROUND COLOR ---------- */
  const applyBackgroundColor = () => {
    if (!isPremium) return;
    editorRef.current.style.backgroundColor = bgColor;
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

  /* ---------- PREMIUM: BLOCK ---------- */
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
    const styledContent = `
      <div style="background:${bgColor}; color:${textColor}; padding:20px">
        ${content}
      </div>
    `;

    const res = await fetch(`${API}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        summary,
        content: styledContent
      }),
    });

    if (res.ok) location.href = "/pages";
  };

  return (
    <div className="page-container">
      <h1>Create Page</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        placeholder="Summary"
        value={summary}
        onChange={e => setSummary(e.target.value)}
      />

      {/* TOOLBAR */}
      <div className="toolbar">
        <button onClick={() => cmd("bold")}>B</button>
        <button onClick={() => cmd("italic")}>I</button>
        <button onClick={() => cmd("underline")}>U</button>

        {isPremium && (
          <>
            <button onClick={insertTable}>Table</button>
            <button onClick={() => insertBlock("info")}>Info</button>
            <button onClick={() => insertBlock("warning")}>Warning</button>
            <button onClick={() => insertBlock("lore")}>Lore</button>
            <button onClick={() => insertBlock("spoiler")}>Spoiler</button>
            <button onClick={() => setPreview(!preview)}>Preview</button>
          </>
        )}
      </div>

      {/* PREMIUM COLORS */}
      {isPremium && (
        <div className="premium-style-panel">
          <label>
            Text color:
            <input
              type="color"
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
            />
            <button onClick={applyTextColor}>Apply</button>
          </label>

          <label>
            Page background:
            <input
              type="color"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
            />
            <button onClick={applyBackgroundColor}>Apply</button>
          </label>
        </div>
      )}

      {/* EDITOR */}
      {!preview ? (
        <div
          ref={editorRef}
          contentEditable
          className="editor"
          style={{ backgroundColor: bgColor, color: textColor }}
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
