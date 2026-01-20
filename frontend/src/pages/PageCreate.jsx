import { useState, useRef } from "react";

const API = import.meta.env.VITE_API_BASE || "https://wakifin-api.knm251-mov.workers.dev";

export default function PageCreate() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  const editorRef = useRef(null);

  const format = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current.focus();
  };

  const createPage = async () => {
    try {
      const response = await fetch(`${API}/pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ title, summary, content }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Page saved:", data);
        window.location.href = "/pages";
      } else {
        console.error("❌ Error:", data.message);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
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

        <button onClick={() => format("insertUnorderedList")}>• List</button>
        <button onClick={() => format("insertOrderedList")}>1. List</button>

        <button onClick={() => format("justifyLeft")}>Left</button>
        <button onClick={() => format("justifyCenter")}>Center</button>
        <button onClick={() => format("justifyRight")}>Right</button>

        <button onClick={() => {
          const url = prompt("URL:");
          if (url) format("createLink", url);
        }}>Link</button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="editor"
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
      ></div>

      <button className="primary-btn" onClick={createPage}>
        Create
      </button>
    </div>
  );
}
