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
       <NavLink to="/sample3" style={linkStyle}>Main Screen Feedback (3)</NavLink>
                     <NavLink to="/sample6" style={linkStyle}>Submit Button Feedback (6)</NavLink>
       <NavLink to="/sample1" style={linkStyle}>Post Submit Feedback (1)</NavLink>

     
     
      <NavLink to="/sample2" style={linkStyle}>Configure Feedback (2)</NavLink>
     
         <NavLink to="/sample7" style={linkStyle}>Product Dashboard (7)</NavLink>
   
  
    </nav>
  );
}