import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About</h1>
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
            <li>React + Vite</li>
            <li>Node.js + Express</li>
            <li>MongoDB</li>
            <li>Docker & Docker Compose</li>
            <li>Cloud deployment (GCP / Azure)</li>
          </ul>
        </div>

        <div className="about-card">
          <h3>🔐 User Roles</h3>
          <p>
            The system supports role-based access control. Administrative
            features such as user management are available only to authorized
            administrators.
          </p>
        </div>
      </section>
    </div>
  );
}
