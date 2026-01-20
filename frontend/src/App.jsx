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


export const API_URL = "https://api-service-287260546677.us-central1.run.app/users";

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (u, token) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", token);
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      {/* 🔥 ВАЖЛИВО: відступ під fixed navbar */}
      <div className="app-content">
        <Routes>
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

  {/* 🔥 PREMIUM */}
  <Route path="/premium" element={<Premium />} />

  <Route
    path="/premium/checkout"
    element={
      <PremiumCheckout
        onSuccess={() => navigate("/premium/content")}
      />
    }
  />

  <Route
    path="/premium/content"
    element={
      <RequirePremium>
        <PremiumContent />
      </RequirePremium>
    }
  />
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
