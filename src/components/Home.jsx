import { Link } from "react-router-dom";

export default function Home() {
  const links = [

    { to: "/sample2", label: "Configure Feedback" },

     { to: "/sample6", label: "Submit/Skip Button Feedback" },
          { to: "/sample7", label: "Dashboard" },
  ];

  return (
    <main style={{ padding: 24 }}>
      <h1>Prototype Hub</h1>
      <p>Select a sample to open its prototype screen.</p>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
        {links.map(({ to, label }) => (
          <li key={to} style={{ marginBottom: 12 }}>
            <Link to={to} style={{ textDecoration: "none" }}>
              <div style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 16
              }}>
                {label} →
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}