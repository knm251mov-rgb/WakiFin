import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "https://wakifin-api.knm251-mov.workers.dev";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("\n========== LOGIN START ==========");
    console.log("Email:", email);
    console.log("onLogin type:", typeof onLogin);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("Status:", res.status);
      console.log("Data:", data);

      if (!res.ok) {
        console.error("Login failed");
        return setError(JSON.stringify(data, null, 2));
      }

      console.log("\n✅ LOGIN SUCCESSFUL");
      console.log("Token:", data.token?.substring(0, 40) + "...");
      console.log("User:", data.user);

      // ✅ STEP 1: Store in localStorage
      console.log("\n📝 STORING IN LOCALSTORAGE...");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ STEP 2: Verify stored
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      console.log("Stored token:", storedToken ? `${storedToken.substring(0, 40)}...` : "❌ NULL");
      console.log("Stored user:", storedUser ? "✅" : "❌ NULL");

      // ✅ STEP 3: Call callback
      console.log("\n📞 CALLING onLogin callback...");
      if (onLogin) {
        console.log("Calling with:", { user: data.user, token: data.token?.substring(0, 40) + "..." });
        onLogin(data.user, data.token);
        console.log("✅ onLogin callback completed");
      } else {
        console.error("❌ onLogin is NOT a function!");
      }

      console.log("\n🔄 NAVIGATING TO /");
      navigate("/");
      console.log("========== LOGIN END ==========\n");
    } catch (err) {
      console.error("❌ EXCEPTION:", err);
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
