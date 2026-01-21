import { useState, useRef, useEffect } from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function PageCreate() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  // premium
  const [isPremium, setIsPremium] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const editorRef = useRef(null);

  useEffect(() => {
    setIsPremium(localStorage.getItem("premium") === "true");
  }, []);

  const format = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current.focus();
  };

  const applyTextColor = (color) => {
    format("foreColor", color);
    setTextColor(color);
  };

  const createPage = async () => {
    await fetch(`${API}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        title,
        summary,
        content,
        styles: isPremium
          ? { textColor, bgColor }
          : null
      }),
    });

    window.location.href = "/pages";
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      <h1>Create Page</h1>

      <div className="form-field">
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="form-field">
        <label>Short Summary</label>
        <input value={summary} onChange={e => setSummary(e.target.value)} />
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => format("bold")}>B</button>
        <button onClick={() => format("italic")}>I</button>
        <button onClick={() => format("underline")}>U</button>
        <button onClick={() => format("strikeThrough")}>S</button>

        <button onClick={() => format("insertUnorderedList")}>List</button>
        <button onClick={() => format("insertOrderedList")}>1. List</button>

        <button onClick={() => format("justifyLeft")}>Left</button>
        <button onClick={() => format("justifyCenter")}>Center</button>
        <button onClick={() => format("justifyRight")}>Right</button>

        <button onClick={() => {
          const url = prompt("URL:");
          if (url) format("createLink", url);
        }}>
          Link
        </button>

        {/* PREMIUM */}
        {isPremium && (
          <>
            <label style={{ marginLeft: 10 }}>
              Text color:
              <input
                type="color"
                value={textColor}
                onChange={(e) => applyTextColor(e.target.value)}
              />
            </label>
          </>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="editor"
        style={{
          minHeight: 200,
          padding: 10,
          border: "1px solid #ccc",
          backgroundColor: isPremium ? bgColor : "#ffffff",
          color: textColor
        }}
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
      />

      {/* PREMIUM background */}
      {isPremium && (
        <div style={{ marginTop: 15 }}>
          <label>
            Page background:
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </label>
        </div>
      )}

      <button className="primary-btn" onClick={createPage}>
        Create
      </button>
    </div>
  );
}
