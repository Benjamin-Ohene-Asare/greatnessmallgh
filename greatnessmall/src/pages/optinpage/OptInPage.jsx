import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Optin.css";

const OptInPage = () => {
  const navigate = useNavigate();

  /* =========================================================
     FORM STATE
     Stores only the temporary form values needed on this page.
     These values are NOT considered trusted data.
     Django will validate and store them securely later.
  ========================================================= */
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  /* =========================================================
     RESOURCE ACCESS STATE
     Frontend-only state for the current prototype.

     IMPORTANT:
     This does NOT provide real security.
     When Django is added, the backend must decide whether a
     visitor is allowed to access protected resources.
  ========================================================= */
  const [unlocked, setUnlocked] = useState(false);

  /* =========================================================
     FORM INPUT HANDLER
     Updates only known form fields.

     React automatically escapes normal text rendered through JSX,
     which helps reduce XSS risk as long as we avoid unsafe HTML.
  ========================================================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!["name", "phone", "email"].includes(name)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     FORM SUBMISSION
     Frontend validation only for now.

     When Django is connected later:
     - Send the data to the Django API.
     - Validate everything again on the backend.
     - Add rate limiting / spam protection.
     - Store the opt-in securely.
     - Trigger SMS from Django, never from React.
     - Unlock the resource only after successful submission.
  ========================================================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanName = formData.name.trim();
    const cleanPhone = formData.phone.trim();
    const cleanEmail = formData.email.trim();

    if (!cleanName || !cleanPhone) {
      return;
    }

    setFormData({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
    });

    // Frontend prototype only.
    setUnlocked(true);
  };

  /* =========================================================
     RESOURCE DOWNLOAD
     Downloads only a fixed application-controlled file.

     SECURITY:
     We do not accept a filename or URL from the visitor.
     This prevents user-controlled download paths.

     Later, Django can serve protected resources after confirming
     that the opt-in submission was successful.
  ========================================================= */
  const handleDownload = () => {
    if (!unlocked) {
      return;
    }

    const resourcePath = "/resources/greatness-mall-guide.pdf";

    const link = document.createElement("a");

    link.href = resourcePath;
    link.download = "Greatness-Mall-Guide.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Allow the browser to start the download before navigating.
    window.setTimeout(() => {
      navigate("/thank-you");
    }, 800);
  };

  return (
    <main className="optin-page">
      <section className="optin-container">

        {/* =====================================================
            LEFT SECTION
            Brand introduction and short value proposition.
        ====================================================== */}
        <div className="optin-content">

          {/* BRAND */}
          <div className="optin-brand">
            <div className="brand-mark" aria-hidden="true">
              G
            </div>

            <div>
              <h2>Greatness Mall</h2>
              <p>Quality. Value. Convenience.</p>
            </div>
          </div>

          {/* MAIN MESSAGE */}
          <div className="optin-message">
            <span className="section-label">
              FREE ACCESS
            </span>

            <h1>
              Unlock Something Valuable.
            </h1>

            <p className="optin-description">
              Enter your details and get instant access to a free resource.
            </p>

            {/* SHORT BENEFIT TAGS */}
            <div className="mini-points">
              <span>Useful Information</span>
              <span>Special Offers</span>
              <span>Free Resource</span>
            </div>
          </div>

        </div>


        {/* =====================================================
            RIGHT SECTION
            Opt-in form and resource preview.
        ====================================================== */}
        <div className="optin-form-section">

          <div className="optin-form-container">

            {/* =================================================
                FORM
                Hidden after successful frontend submission.

                No sensitive credentials or API keys should ever
                be placed inside this React component.
            ================================================== */}
            {!unlocked ? (
              <>
                <div className="form-header">
                  <span className="section-label">
                    GET STARTED
                  </span>

                  <h2>Get Your Free Resource</h2>

                  <p>
                    Fill in your details below to unlock access.
                  </p>
                </div>

                <form
                  className="optin-form"
                  onSubmit={handleSubmit}
                  noValidate={false}
                >

                  {/* FULL NAME */}
                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      minLength={2}
                      maxLength={100}
                      required
                    />
                  </div>


                  {/* PHONE NUMBER */}
                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <div className="phone-field">
                      <span className="country-code">
                        +233
                      </span>

                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="24 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        inputMode="tel"
                        maxLength={20}
                        required
                      />
                    </div>
                  </div>


                  {/* EMAIL */}
                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address

                      <span className="optional-text">
                        Optional
                      </span>
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      maxLength={254}
                    />
                  </div>


                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="optin-submit-button"
                  >
                    Unlock Free Resource
                  </button>

                </form>


                {/* PRIVACY MESSAGE */}
                <div className="privacy-message">
                  <p>
                    Your details are kept private.
                  </p>
                </div>
              </>
            ) : (

              /* ===============================================
                 SUCCESS / UNLOCKED MESSAGE
              ================================================ */
              <div className="unlocked-message">
                <span className="section-label">
                  ACCESS GRANTED
                </span>

                <h2>Your Resource Is Ready</h2>

                <p>
                  You can now download your free resource.
                </p>
              </div>
            )}


            {/* =================================================
                RESOURCE CARD

                The resource remains visually locked until the
                frontend form has been completed.

                Django will enforce the real access rule later.
            ================================================== */}
            <div
              className={
                unlocked
                  ? "resource-card unlocked"
                  : "resource-card locked"
              }
            >

              {/* RESOURCE HEADING */}
              <div className="resource-card-header">
                <span className="resource-label">
                  FREE RESOURCE
                </span>

                <h3>
                  Your Exclusive Resource
                </h3>
              </div>


              {/* RESOURCE PREVIEW */}
              <div className="resource-preview">

                <div
                  className="resource-placeholder"
                  aria-hidden="true"
                >
                  <div className="resource-line resource-line-large"></div>
                  <div className="resource-line resource-line-medium"></div>
                  <div className="resource-line resource-line-small"></div>
                </div>


                {/* LOCKED OVERLAY */}
                {!unlocked && (
                  <div className="resource-overlay">

                    <span className="resource-status">
                      LOCKED
                    </span>

                    <p>
                      Complete the form to unlock
                    </p>

                  </div>
                )}

              </div>


              {/* DOWNLOAD BUTTON */}
              {unlocked && (
                <button
                  type="button"
                  className="download-resource-button"
                  onClick={handleDownload}
                >
                  Download Resource
                </button>
              )}

            </div>

          </div>

        </div>

      </section>
    </main>
  );
};

export default OptInPage;