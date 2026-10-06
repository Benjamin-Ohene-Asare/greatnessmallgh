import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  /* =========================================================
     MOBILE NAVIGATION STATE
     Controls only the visual opening/closing of the menu.

     SECURITY:
     This state does not control authorization.
     Protected pages must still be secured by Django later.
  ========================================================= */
  const [menuOpen, setMenuOpen] = useState(false);

  /* =========================================================
     CLOSE MOBILE MENU
     Used after a visitor selects a navigation item.
  ========================================================= */
  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =========================================================
     ACTIVE NAV LINK CLASS
     Keeps NavLink styling consistent across navigation items.
  ========================================================= */
  const getNavLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink
          to="/home"
          className="navbar-brand"
          onClick={closeMenu}
        >
          <div
            className="navbar-logo"
            aria-hidden="true"
          >
            G
          </div>

          <div className="navbar-brand-text">
            <h2>Greatness Mall</h2>
            <span>Quality. Value. Convenience.</span>
          </div>
        </NavLink>


       
        <nav
          className={
            menuOpen
              ? "navbar-links navbar-links-open"
              : "navbar-links"
          }
          aria-label="Main navigation"
        >
          <NavLink
            to="/home"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Products
          </NavLink>

          <NavLink
            to="/faq"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            FAQ
          </NavLink>

          <NavLink
            to="/twi"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Twi
          </NavLink>
        </nav>


        <div className="navbar-actions">

          <NavLink
            to="/products"
            className="navbar-button"
            onClick={closeMenu}
          >
            Explore Products
          </NavLink>
          <button
            type="button"
            className={
              menuOpen
                ? "mobile-menu-button menu-open"
                : "mobile-menu-button"
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </div>
    </header>
  );
};

export default NavBar;