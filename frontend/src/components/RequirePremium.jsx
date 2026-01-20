import { Navigate } from "react-router-dom";

export default function RequirePremium({ children }) {
  const isPremium = localStorage.getItem("premium") === "true";

  if (!isPremium) {
    return <Navigate to="/premium" />;
  }

  return children;
}
