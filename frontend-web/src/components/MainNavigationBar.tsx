import { Link } from "react-router-dom";
import "./MainNavigationBar.css";

export function MainNavigationBar() {
  return (
    <nav className="nav">
      <div className="nav-logo">Home Server</div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cards">Cards</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/games">Games</Link></li>
      </ul>
    </nav>
  );
}
