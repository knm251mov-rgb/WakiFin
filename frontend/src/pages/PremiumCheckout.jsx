import { useState } from "react";

export default function PremiumCheckout({ onSuccess }) {
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");

  const validate = () => {
    if (!/^\d{16}$/.test(card.number)) return "Невірний номер картки";
    if (!card.name) return "Вкажіть імʼя";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return "MM/YY";
    if (!/^\d{3}$/.test(card.cvv)) return "CVV 3 цифри";
    return null;
  };

  const handlePay = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    // 🟢 ІМІТАЦІЯ УСПІХУ
    localStorage.setItem("premium", "true");
    localStorage.setItem("premiumLevel", "pro");

    onSuccess();
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Покупка Premium</h2>

      <input placeholder="0000 0000 0000 0000"
        onChange={e => setCard({ ...card, number: e.target.value.replace(/\s/g, "") })}
      />

      <input placeholder="Імʼя власника"
        onChange={e => setCard({ ...card, name: e.target.value })}
      />

      <input placeholder="MM/YY"
        onChange={e => setCard({ ...card, expiry: e.target.value })}
      />

      <input placeholder="CVV"
        onChange={e => setCard({ ...card, cvv: e.target.value })}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handlePay}>Оплатити</button>
    </div>
  );
}
