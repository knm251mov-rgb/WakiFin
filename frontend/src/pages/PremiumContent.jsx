import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function PremiumContent() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const premiumStatus = localStorage.getItem("premium") === "true";
    setIsPremium(premiumStatus);
    setLoading(false);

    if (!premiumStatus) {
      // якщо не premium — редірект через 2 секунди
      setTimeout(() => {
        navigate("/premium");
      }, 2000);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ paddingTop: 80, textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div style={{ paddingTop: 80, textAlign: "center" }}>
        <h2>Access denied</h2>
        <p>This page is available only for premium users.</p>
        <p>You will be redirected to the premium page.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        paddingTop: 80,
        maxWidth: 900,
        margin: "0 auto"
      }}
    >
      <h1>Premium content</h1>

      <p>
        This section is available only to users with an active premium
        subscription.
      </p>

      <hr />

      <section>
        <h3>Exclusive features</h3>
        <ul>
          <li>Advanced page editor</li>
          <li>Extended analytics</li>
          <li>Private content visibility</li>
          <li>Priority access to new features</li>
        </ul>
      </section>

      <section style={{ marginTop: 30 }}>
        <h3>Premium tools</h3>
        <p>
          Here you can manage advanced tools that are unavailable for regular
          users.
        </p>
      </section>
    </div>
  );
}
