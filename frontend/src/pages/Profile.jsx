import { useState, useEffect } from "react";

export default function Profile({ user, onLogout }) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const premium = localStorage.getItem("premium") === "true";
    setIsPremium(premium);
  }, []);

  const cancelPremium = () => {
    localStorage.removeItem("premium");
    localStorage.removeItem("premiumLevel");
    setIsPremium(false);
  };

  if (!user) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Access Denied</h2>
        <p>You must be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2>User Profile</h2>
      <p>Here you can manage your account settings.</p>

      {/* USER INFO */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "1.5rem",
          borderRadius: "8px",
          marginTop: "1.5rem",
        }}
      >
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Role:</strong>{" "}
          <span
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              color: user.role === "admin" ? "darkred" : "inherit",
            }}
          >
            {user.role}
          </span>
        </p>
      </div>

      {/* PREMIUM INFO */}
      <div
        style={{
          border: "1px solid",
          borderColor: isPremium ? "#16a34a" : "#ddd",
          padding: "1.5rem",
          borderRadius: "8px",
          marginTop: "1.5rem",
          background: isPremium ? "#f0fdf4" : "#fafafa",
        }}
      >
        <h3>Subscription</h3>

        {isPremium ? (
          <>
            <p style={{ color: "#166534", fontWeight: 600 }}>
              Premium account is active
            </p>
            <ul style={{ paddingLeft: "1.2rem" }}>
              <li>Access to exclusive content</li>
              <li>Advanced filters and sorting</li>
              <li>Custom themes</li>
            </ul>

            <button
              onClick={cancelPremium}
              style={{
                marginTop: "1rem",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "#dc2626",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel Premium
            </button>
          </>
        ) : (
          <>
            <p>You are using a free account.</p>
            <a
              href="/premium"
              style={{
                display: "inline-block",
                marginTop: "0.8rem",
                padding: "8px 16px",
                borderRadius: "6px",
                background: "#2563eb",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Upgrade to Premium
            </a>
          </>
        )}
      </div>

      {/* LOGOUT */}
      <button
        onClick={onLogout}
        style={{
          marginTop: "2rem",
          padding: "10px 20px",
          borderRadius: "6px",
          border: "none",
          background: "#ff0000",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Logout
      </button>
    </div>
  );
}
