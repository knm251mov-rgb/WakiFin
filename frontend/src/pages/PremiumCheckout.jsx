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
    if (!card.name) return "Вкажіть імʼя власника";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return "Формат MM/YY";
    if (!/^\d{3}$/.test(card.cvv)) return "CVV має містити 3 цифри";
    return null;
  };

  const handlePay = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    localStorage.setItem("premium", "true");
    localStorage.setItem("premiumLevel", "pro");
    onSuccess();
  };

  return (
    <div className="premium-checkout">
      <h2 className="premium-title">Premium доступ</h2>
      <p className="premium-subtitle">
        Отримайте розширені можливості та кастомізацію
      </p>

      <div className="form-field">
        <label>Номер картки</label>
        <input
          placeholder="0000 0000 0000 0000"
          maxLength={16}
          onChange={e =>
            setCard({ ...card, number: e.target.value.replace(/\D/g, "") })
          }
        />
      </div>

      <div className="form-field">
        <label>Імʼя власника</label>
        <input
          placeholder="CARD HOLDER"
          onChange={e => setCard({ ...card, name: e.target.value })}
        />
      </div>

      <div className="checkout-row">
        <div className="form-field">
          <label>Термін дії</label>
          <input
            placeholder="MM/YY"
            maxLength={5}
            onChange={e => setCard({ ...card, expiry: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label>CVV</label>
          <input
            placeholder="123"
            maxLength={3}
            onChange={e => setCard({ ...card, cvv: e.target.value })}
          />
        </div>
      </div>

      {error && <div className="checkout-error">{error}</div>}

      <button className="primary-btn checkout-btn" onClick={handlePay}>
        Оплатити Premium
      </button>
    </div>
  );
}
