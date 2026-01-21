import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function PageEdit() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  const editorRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/pages/${id}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(p => {
        setTitle(p.title);
        setSummary(p.summary);
        setContent(p.content);

        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = p.content;
          }
        }, 0);
      });
  }, [id]);

  const format = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current.focus();
  };

  const updatePage = async () => {
    await fetch(`${API}/pages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ title, summary, content }),
    });

    window.location.href = `/pages/${id}`;
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      <h1>Edit Page</h1>

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

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="editor"
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
      ></div>

      <button className="primary-btn" onClick={updatePage}>
        Save Changes
      </button>
    </div>
  );
}
