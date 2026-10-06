import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Home from "./pages/home/Home";
import OptInPage from "./pages/optinpage/OptInPage";
import ThankYou from "./pages/thanku/ThankYou";
import Product from "./pages/product/Product";
import ProductDetails from "./pages/productDetails/ProductDetails";

import NavBar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/scrolltotop/ScrollToTop";
import Whatsapp from "./components/whatsapp/Whatsapp";

/* =========================================================
   TEMPORARY PAGES

   These will later be replaced with proper page components.
========================================================= */

const FAQ = () => {
  return <h1>soon......</h1>;
};

const Twi = () => {
  return <h1>soon......</h1>;
};


/* =========================================================
   MAIN WEBSITE LAYOUT

   Navbar and footer belong only to the main website.

   SECURITY NOTE:
   This is presentation routing only.
   Django will enforce actual authorization later.
========================================================= */

const MainLayout = () => {
  return (
    <>
      <NavBar />

      <main>
        <Outlet />
      </main>

      <Footer />
      <Whatsapp />
    </>
  );
};


const App = () => {
  return (
    <Router>

      {/* =====================================================
          SCROLL RESET

          Every time the route changes, the new page starts
          from the top instead of keeping the previous page's
          scroll position.
      ====================================================== */}

      <ScrollToTop />

      <Routes>

        {/* =====================================================
            PUBLIC FUNNEL
        ====================================================== */}

        <Route
          path="/"
          element={<OptInPage />}
        />

        <Route
          path="/thank-you"
          element={<ThankYou />}
        />


        {/* =====================================================
            MAIN GREATNESS MALL WEBSITE
        ====================================================== */}

        <Route element={<MainLayout />}>

          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Product />}
          />

          <Route
            path="/products/:slug"
            element={<ProductDetails />}
          />

          <Route
            path="/faq"
            element={<FAQ />}
          />

          <Route
            path="/twi"
            element={<Twi />}
          />

        </Route>

      </Routes>

    </Router>
  );
};

export default App;