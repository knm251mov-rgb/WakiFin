import { useNavigate } from "react-router-dom";

export default function Premium() {
  const navigate = useNavigate();

  const isPremium = localStorage.getItem("premium") === "true";

  return (
    <div style={{ paddingTop: 80 }}>
      <h1>Premium доступ</h1>

      {isPremium ? (
        <>
          <p>✅ У вас вже є Premium</p>
          <button onClick={() => navigate("/premium/content")}>
            Перейти до контенту
          </button>
        </>
      ) : (
        <>
          <p>🔒 Цей контент доступний лише Premium</p>
          <button onClick={() => navigate("/premium/checkout")}>
            Купити Premium
          </button>
        </>
      )}
    </div>
  );
}
