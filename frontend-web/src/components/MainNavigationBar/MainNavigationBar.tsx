import { Link } from "react-router-dom";
import scoped_style from "./MainNavigationBar.module.css";

export function MainNavigationBar() {
  return (
    <nav className={scoped_style["nav"]}>
      <div className={scoped_style["nav-logo"]}>Home Server</div>

      <ul className={scoped_style["nav-links"]}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cards">Cards</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/games">Games</Link></li>
      </ul>
    </nav>
  );
}
