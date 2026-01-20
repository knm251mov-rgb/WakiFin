import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Users from "./pages/Users";
import About from "./pages/About";
import Profile from "./pages/Profile";
import PagesList from "./pages/PagesList";
import PageCreate from "./pages/PageCreate";
import PageView from "./pages/PageView";
import PageEdit from "./pages/PageEdit";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Premium from "./pages/Premium";
import PremiumCheckout from "./pages/PremiumCheckout";
import PremiumContent from "./pages/PremiumContent";
import RequirePremium from "./components/RequirePremium";


export const API_URL = import.meta.env.VITE_API_BASE || "https://wakifin-api.knm251-mov.workers.dev";

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("\n🔍 App.jsx useEffect - Checking localStorage on startup");
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    console.log("  User in localStorage:", savedUser ? "✅" : "❌");
    console.log("  Token in localStorage:", token ? `${token.substring(0, 40)}...` : "❌");
    
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        console.log("  Setting user state:", parsed);
        setUser(parsed);
      } catch (e) {
        console.error("  Parse error:", e);
      }
    }
  }, []);

  const handleLogin = (u, token) => {
    console.log("\n========== handleLogin in App.jsx ==========");
    console.log("User param:", u);
    console.log("Token param:", token?.substring(0, 40) + "...");
    
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", token);
    
    console.log("After setting:");
    console.log("  localStorage.token:", localStorage.getItem("token")?.substring(0, 40) + "...");
    console.log("  localStorage.user:", localStorage.getItem("user")?.substring(0, 50) + "...");
    console.log("========== handleLogin END ==========\n");
    
    navigate("/");
  };

  const handleLogout = () => {
    console.log("🚪 Logout");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      {/* 🔥 ВАЖЛИВО: відступ під fixed navbar */}
      <div className="app-content">
        <Routes>
          <Route path="/premium" element={<Premium />} />
  <Route path="/premium/checkout" element={<PremiumCheckout onSuccess={() => navigate("/premium/content")} />} />

  <Route
    path="/premium/content"
    element={
      <RequirePremium>
        <PremiumContent />
      </RequirePremium>
    }
  />

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about" element={<About />} />
          <Route path="/pages" element={<PagesList />} />
          <Route path="/pages/create" element={<PageCreate />} />
          <Route path="/pages/:id" element={<PageView />} />
          <Route path="/pages/:id/edit" element={<PageEdit />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
