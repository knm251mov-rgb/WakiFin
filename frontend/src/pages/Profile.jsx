import { useState, useEffect } from "react";

export default function Profile({ user, onLogout }) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setIsPremium(localStorage.getItem("premium") === "true");
  }, []);

  const cancelPremium = () => {
    localStorage.removeItem("premium");
    localStorage.removeItem("premiumLevel");
    setIsPremium(false);
  };

  if (!user) {
    return (
      <div className="app-container">
        <h2 className="error">Access Denied</h2>
        <p>You must be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>User Profile</h1>
      <p>Here you can manage your account settings.</p>

      {/* USER INFO */}
      <div className="block">
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Role:</strong>{" "}
          <span style={{
            textTransform: "uppercase",
            fontWeight: 700,
            color: user.role === "admin" ? "#7f1d1d" : "inherit"
          }}>
            {user.role}
          </span>
        </p>
      </div>

      {/* PREMIUM */}
      <div
        className="block"
        style={{
          background: isPremium ? "var(--red-50)" : "#fff",
          borderLeft: `4px solid ${isPremium ? "var(--red-600)" : "var(--red-300)"}`
        }}
      >
        <h3>Subscription</h3>

        {isPremium ? (
          <>
            <p style={{ fontWeight: 600, color: "var(--red-700)" }}>
              Premium account is active
            </p>

            <ul>
              <li>Access to exclusive content</li>
              <li>Advanced filters and sorting</li>
              <li>Custom themes</li>
            </ul>

            <button
              className="primary-btn"
              style={{ background: "#991b1b", marginTop: "1rem" }}
              onClick={cancelPremium}
            >
              Cancel Premium
            </button>
          </>
        ) : (
          <>
            <p>You are using a free account.</p>
            <a href="/premium" className="wiki-btn" style={{ marginTop: "0.5rem" }}>
              Upgrade to Premium
            </a>
          </>
        )}
      </div>

      {/* LOGOUT */}
      <button
        onClick={onLogout}
        className="primary-btn"
        style={{
          width: "100%",
          marginTop: "2rem",
          background: "linear-gradient(180deg, #dc2626, #991b1b)"
        }}
      >
        Logout
      </button>
    </div>
  );
}
