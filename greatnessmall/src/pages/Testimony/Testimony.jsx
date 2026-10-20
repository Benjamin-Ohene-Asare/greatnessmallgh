import React from "react";
import Testimonials from "../../components/testimonials/Testimonials";
import SEO from "../../components/SEO/SEO";
import testimonyHero from "../../assets/testHero.png";
import "./Testimony.css";

const Testimony = () => {
  const scrollToTestimonials = () => {
    const section = document.getElementById("testimony-content");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <SEO
        title="Customer Testimonials | Greatness Mall"
        description="Watch and explore customer testimonials and personal experiences shared by Greatness Mall customers."
      />

      <main className="testimony-page">
        {/* =========================
            PAGE HERO
        ========================= */}
        <section
          className="testimony-page-hero"
          style={{
            backgroundImage: `url(${testimonyHero})`,
          }}
        >
          <div className="testimony-page-hero-overlay" />
          <div className="testimony-page-hero-glow" />

          <div className="testimony-page-hero-container">
            <div className="testimony-page-hero-content">
              {/* <span className="testimony-page-label">
                CUSTOMER STORIES
              </span> */}

              <h1>
                Real Experiences.
                <br />
                Real Testimonials.
              </h1>

              <p>
                Hear directly from customers sharing their personal
                experiences with Greatness Mall products.
              </p>

              <button
                type="button"
                className="testimony-page-button"
                onClick={scrollToTestimonials}
              >
                Explore Testimonials
              </button>
            </div>
          </div>
        </section>

        {/* =========================
            TESTIMONIALS
        ========================= */}
        <section
          id="testimony-content"
          className="testimony-content-section"
        >
          <Testimonials />
        </section>
      </main>
    </>
  );
};

export default Testimony;