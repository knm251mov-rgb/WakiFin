import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About WakiFin</h1>
        <p>
          WakiFin is a web-oriented information system designed for managing
          users, pages, and structured content with a focus on simplicity,
          scalability, and modern technologies.
        </p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h3>🎯 Project Purpose</h3>
          <p>
            The project was created as part of a master's program to demonstrate
            practical skills in full-stack web development, containerization,
            and cloud deployment.
          </p>
        </div>

        <div className="about-card">
          <h3>⚙️ Technologies Used</h3>
          <ul>
            <li>React 18 + Vite 4</li>
            <li>Node.js + Express</li>
            <li>MongoDB Atlas</li>
            <li>Docker & Docker Compose</li>
            <li>Azure Cloud (Container Instances + App Service)</li>
            <li>Cloudflare Workers (API Proxy)</li>
            <li>GitHub Actions (CI/CD)</li>
          </ul>
        </div>

        <div className="about-card">
          <h3>🔐 User Roles</h3>
          <p>
            The system supports role-based access control with three roles:
          </p>
          <ul>
            <li>
              <strong>User</strong> - Basic access to pages
            </li>
            <li>
              <strong>Premium</strong> - Extended features
            </li>
            <li>
              <strong>Admin</strong> - Full system management
            </li>
          </ul>
        </div>

        <div className="about-card">
          <h3>📝 Features</h3>
          <ul>
            <li>✅ User authentication & authorization</li>
            <li>✅ Create, read, update, delete pages</li>
            <li>✅ Role-based access control</li>
            <li>✅ MongoDB persistence</li>
            <li>✅ Cloud deployment with CI/CD</li>
          </ul>
        </div>

        <div className="about-card">
          <h3>🚀 Deployment</h3>
          <ul>
            <li>Frontend: Azure App Service</li>
            <li>Backend: Azure Container Instances</li>
            <li>Database: MongoDB Atlas</li>
            <li>API Proxy: Cloudflare Workers</li>
            <li>CI/CD: GitHub Actions</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
