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
import Twi from "./pages/twi/Twi";
import FAQ from "./pages/faq/FAQ";


import NavBar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/scrolltotop/ScrollToTop";
import Whatsapp from "./components/whatsapp/Whatsapp";


import RequireAdmin from "./pages/dashboard/component/RequireAdmin";

import AdminLayout from "./pages/dashboard/layout/AdminLayout";

import AdminLogin from "./pages/dashboard/pages/login/AdminLogin";

import AdminDashboard from "./pages/dashboard/pages/dashboard/AdminDashboard";

import AdminProducts from "./pages/dashboard/pages/product/AdminProducts";
import AddProduct from "./pages/dashboard/pages/product/AddProduct";
import EditProduct from "./pages/dashboard/pages/product/EditProduct";

import AdminCategories from "./pages/dashboard/pages/categories/AdminCategories";

import AdminEvents from "./pages/dashboard/pages/events/AdminEvents";
import AddEvent from "./pages/dashboard/pages/events/AddEvent";
import EditEvent from "./pages/dashboard/pages/events/EditEvent";

import AdminOptIn from "./pages/dashboard/pages/optin/AdminOptIn";

import AdminContacts from "./pages/dashboard/pages/contacts/AdminContacts";

import AdminSms from "./pages/dashboard/pages/sms/AdminSms";

import AdminFAQ from "./pages/dashboard/pages/faq/AdminFAQ";

import AdminTestimonials from "./pages/dashboard/pages/testimonials/AdminTestimonials";

import AdminTwi from "./pages/dashboard/pages/twi/AdminTwi";


/* Public website layout */

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

      <ScrollToTop />


      <Routes>

        {/* Public funnel */}

        <Route
          path="/"
          element={<OptInPage />}
        />

        <Route
          path="/thank-you"
          element={<ThankYou />}
        />


        {/* Public website */}

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


        {/* Admin login */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* Protected admin dashboard */}

        <Route
          element={<RequireAdmin />}
        >

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            <Route
              index
              element={<AdminDashboard />}
            />


            {/* Products */}

            <Route
              path="products"
              element={<AdminProducts />}
            />

            <Route
              path="products/add"
              element={<AddProduct />}
            />

            <Route
              path="products/:id/edit"
              element={<EditProduct />}
            />


            {/* Categories */}

            <Route
              path="categories"
              element={<AdminCategories />}
            />


            {/* Events */}

            <Route
              path="events"
              element={<AdminEvents />}
            />

            <Route
              path="events/add"
              element={<AddEvent />}
            />

            <Route
              path="events/:id/edit"
              element={<EditEvent />}
            />


            {/* Opt-in */}

            <Route
              path="optin"
              element={<AdminOptIn />}
            />


            {/* Contacts */}

            <Route
              path="contacts"
              element={<AdminContacts />}
            />


            {/* SMS */}

            <Route
              path="sms"
              element={<AdminSms />}
            />


            {/* FAQ */}

            <Route
              path="faq"
              element={<AdminFAQ />}
            />


            {/* Testimonials */}

            <Route
              path="testimonials"
              element={<AdminTestimonials />}
            />


            {/* Twi */}

            <Route
              path="twi"
              element={<AdminTwi />}
            />

          </Route>

        </Route>

      </Routes>

    </Router>
  );
};


export default App;