import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile({ user, onLogout }) {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const premium = localStorage.getItem("premium");
    setIsPremium(premium === "true");
  }, []);

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
      <p>Manage your account and subscription settings.</p>

      {/* USER INFO */}
      <div
        style={{
          border: "1px solid #ccc",
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

      {/* PREMIUM BLOCK */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          borderRadius: "8px",
          border: isPremium ? "1px solid #16a34a" : "1px solid #dc2626",
          background: isPremium ? "#f0fdf4" : "#fff5f5",
        }}
      >
        <h3>Subscription</h3>

        {isPremium ? (
          <>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "#16a34a", fontWeight: 600 }}>
                Premium active
              </span>
            </p>
            <p>You have access to all premium features.</p>
          </>
        ) : (
          <>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "#dc2626", fontWeight: 600 }}>
                Free account
              </span>
            </p>
            <p>Upgrade to Premium to unlock advanced features.</p>

            <button
              onClick={() => router.push("/premium")}
              style={{
                marginTop: "1rem",
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                background: "#dc2626",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Get Premium
            </button>
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
          background: "#7f1d1d",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
        }}
      >
        Logout
      </button>
    </div>
  );
}
