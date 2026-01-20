import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // 🔥 перевірка premium
  const isPremium = localStorage.getItem("premium") === "true";

  // Закриваємо dropdown при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">WakiFin</div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>

        {user?.role === "admin" && (
          <li>
            <Link to="/users">Users</Link>
          </li>
        )}

        <li><Link to="/pages">Pages</Link></li>
        <li><Link to="/about">About</Link></li>

        {/* ⭐ PREMIUM */}
        {user && !isPremium && (
          <li>
            <Link
              to="/premium"
              style={{
                color: "gold",
                fontWeight: "bold"
              }}
            >
              ⭐ Get Premium
            </Link>
          </li>
        )}

        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <li className="account-menu" ref={menuRef}>
            <button
              className="account-btn"
              onClick={() => setOpen(o => !o)}
            >
              {user.email}
              {isPremium && (
                <span
                  style={{
                    marginLeft: "6px",
                    color: "gold",
                    fontWeight: "bold"
                  }}
                >
                  ⭐
                </span>
              )}
            </button>

            {open && (
              <div className="account-dropdown">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>

                {isPremium && (
                  <Link
                    to="/premium/content"
                    className="dropdown-item"
                    onClick={() => setOpen(false)}
                  >
                    Premium Content
                  </Link>
                )}

                <button
                  className="dropdown-item logout"
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
