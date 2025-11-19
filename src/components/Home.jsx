import { Link } from "react-router-dom";

export default function Home() {
  const links = [
    { to: "/sample1", label: "View Feedback" },
    { to: "/sample2", label: "Configure Feedback" },
    { to: "/sample3", label: "Main Screen General Feedback" },
    { to: "/sample4", label: "Per Task Feedback" },
   { to: "/sample5", label: "Workflow Feedback" },
     { to: "/sample6", label: "Submit Button Feedback" },
          { to: "/sample7", label: "Product Dashboard" },
                    { to: "/sample8", label: "Configure 2" },
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