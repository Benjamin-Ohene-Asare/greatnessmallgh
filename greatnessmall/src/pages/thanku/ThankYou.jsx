import { useNavigate } from "react-router-dom";
import "./ThankYou.css";

const ThankYou = () => {
  const navigate = useNavigate();

  /* =========================================================
     CONTINUE TO MAIN WEBSITE

     `replace: true` replaces the current Thank You page entry
     in browser history when the visitor continues.

     This is mainly a navigation/UX improvement, not a security
     control.

     IMPORTANT:
     Frontend routes are never security boundaries.
     Django must enforce access to any protected data later.
  ========================================================= */
  const handleContinue = () => {
    navigate("/home", { replace: true });
  };

  return (
    <main className="thankyou-page">

      <section
        className="thankyou-card"
        aria-labelledby="thankyou-title"
      >

        {/* =====================================================
            BRAND
            Static application-controlled content only.
            No user-generated HTML is rendered here.
        ====================================================== */}
        <div className="thankyou-brand">

          <div
            className="thankyou-brand-mark"
            aria-hidden="true"
          >
            G
          </div>

          <div>
            <h2>Greatness Mall</h2>
            <p>Quality. Value. Convenience.</p>
          </div>

        </div>


        {/* =====================================================
            THANK YOU MESSAGE
            Currently contains trusted static text.

            If this content becomes dynamic through Django later,
            render it as normal React text and avoid
            dangerouslySetInnerHTML unless properly sanitized.
        ====================================================== */}
        <div className="thankyou-content">

          <span className="thankyou-label">
            THANK YOU
          </span>

          <h1 id="thankyou-title">
            You're All Set.
          </h1>

          <p className="thankyou-description">
            Thank you for joining Greatness Mall.
            Your resource download has started.
          </p>


          {/* ===================================================
              NEXT STEP
          ==================================================== */}
          <div className="thankyou-message-box">

            <span>
              WHAT'S NEXT?
            </span>

            <h3>
              Explore Greatness Mall
            </h3>

            <p>
              Discover our products and useful information.
            </p>

          </div>


          {/* ===================================================
              CONTINUE BUTTON
              Uses an internal React route only.
              No user-controlled URL is accepted.
          ==================================================== */}
          <button
            type="button"
            className="continue-button"
            onClick={handleContinue}
          >
            Continue to Greatness Mall
          </button>

        </div>

      </section>

    </main>
  );
};

export default ThankYou;