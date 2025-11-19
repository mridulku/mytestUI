import { Link, NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 500,
  background: isActive ? "#f3f4f6" : "transparent"
});

export default function Nav() {
  return (
    <nav style={{
      display: "flex",
      gap: 12,
      alignItems: "center",
      padding: 16,
      borderBottom: "1px solid #e5e7eb"
    }}>
      <Link to="/" style={{ textDecoration: "none", fontWeight: 700 }}>Home</Link>
       <NavLink to="/sample3" style={linkStyle}>3. Main Screen Feedback</NavLink>
     
       <NavLink to="/sample5" style={linkStyle}>5. Workflow Feedback</NavLink>

      <NavLink to="/sample1" style={linkStyle}>1. View Feedback</NavLink>
      <NavLink to="/sample2" style={linkStyle}>2. Configure Feedback</NavLink>
     
         <NavLink to="/sample7" style={linkStyle}>7. Product Dashboard</NavLink>
        <NavLink to="/sample4" style={linkStyle}>4. Per Task Feedback (Deprioritize)</NavLink>
              <NavLink to="/sample6" style={linkStyle}>6. Submit Button Feedback</NavLink>
                                      <NavLink to="/sample8" style={linkStyle}>8. COnfigure 2</NavLink>
  
    </nav>
  );
}