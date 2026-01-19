import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_BASE;

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Якщо сервер поверне помилку (навіть 400), вона буде показана тут.
        // Але помилки "Email is not verified" більше не буде.
        const fullError = JSON.stringify(data, null, 2);
        return setError(fullError);
      }

      localStorage.setItem("token", data.token);
      if (onLogin) onLogin(data.user);
      navigate("/");
    } catch (err) {
      setError(`Client error: ${err.message}`);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "2rem",
        borderRadius: "12px",
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Login</h2>

      {error && (
        <pre
          style={{
            background: "#ffe6e6",
            padding: "10px",
            borderRadius: "6px",
            color: "red",
            marginBottom: "1rem",
            whiteSpace: "pre-wrap",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </pre>
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "6px",
          border: "none",
          background: "#ff0000",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </form>
  );
}
