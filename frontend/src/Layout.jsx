import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "1.5rem" }}>
        <Outlet />
      </main>
    </>
  );
}
