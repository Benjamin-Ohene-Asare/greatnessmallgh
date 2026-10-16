import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ShoppingCart,
  UserRound,
} from "lucide-react";

import {
  useCustomerAuth,
} from "../../context/CustomerAuthContext";

import {
  useCart,
} from "../../context/CartContext";

import "./NavBar.css";


const NavBar = () => {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const {
    customer,
    loading,
  } = useCustomerAuth();

  const {
    totalQuantity,
  } = useCart();


  const closeMenu = () => {
    setMenuOpen(false);
  };


  const getNavLinkClass = ({
    isActive,
  }) =>
    isActive
      ? "nav-link active"
      : "nav-link";


  const cartCount =
    Number(totalQuantity) || 0;

  const cartBadgeText =
    cartCount > 99
      ? "99+"
      : cartCount;


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
            <h2>
              Greatness Mall
            </h2>

            <span>
              Quality. Value. Convenience.
            </span>
          </div>
        </NavLink>


        <nav
          id="main-navigation"
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


          {!loading && (
            <NavLink
              to={
                customer
                  ? "/cart"
                  : "/account/auth"
              }
              className="navbar-cart-button"
              onClick={closeMenu}
              aria-label={
                customer
                  ? `Open cart with ${cartCount} item${
                      cartCount === 1
                        ? ""
                        : "s"
                    }`
                  : "Sign in to view your cart"
              }
              title={
                customer
                  ? "My Cart"
                  : "Sign in to use your cart"
              }
            >
              <ShoppingCart
                size={20}
                strokeWidth={2}
              />

              {customer &&
                cartCount > 0 && (
                  <span
                    className="navbar-cart-badge"
                    aria-hidden="true"
                  >
                    {cartBadgeText}
                  </span>
                )}
            </NavLink>
          )}


          {!loading && (
            <>
              {customer ? (
                <NavLink
                  to="/account"
                  className="navbar-account-button"
                  onClick={closeMenu}
                  aria-label="Open my account"
                  title="My Account"
                >
                  <UserRound
                    size={20}
                    strokeWidth={2}
                  />
                </NavLink>
              ) : (
                <NavLink
                  to="/account/auth"
                  className="navbar-signin-button"
                  onClick={closeMenu}
                >
                  Sign In
                </NavLink>
              )}
            </>
          )}


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
            onClick={() =>
              setMenuOpen(
                (previous) =>
                  !previous
              )
            }
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