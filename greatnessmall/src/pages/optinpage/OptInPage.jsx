import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CheckCircle2,
  Download,
  ShieldCheck,
} from "lucide-react";

import {
  getOptInCampaign,
  submitOptIn,
} from "../../services/backend";

import "./Optin.css";


/* =========================================================
   INPUT CLEANUP

   These helpers keep obviously unwanted characters out of
   the form before anything is sent to Django.

   Django still performs the real backend validation because
   frontend validation can always be bypassed.
========================================================= */

const removeControlCharacters = (
  value = ""
) => {
  return value
    .replace(
      /[\u0000-\u001F\u007F]/g,
      ""
    )
    .replace(/[<>]/g, "");
};


const sanitizeName = (
  value = ""
) => {
  return removeControlCharacters(
    value
  )
    .replace(/\s+/g, " ")
    .slice(0, 150);
};


const sanitizePhone = (
  value = ""
) => {
  return value
    .replace(
      /[^\d+\s()-]/g,
      ""
    )
    .replace(
      /(?!^)\+/g,
      ""
    )
    .slice(0, 30);
};


const sanitizeEmail = (
  value = ""
) => {
  return removeControlCharacters(
    value
  )
    .replace(/\s/g, "")
    .slice(0, 254);
};


/* =========================================================
   API ADDRESS

   The environment variable is used in production.

   The localhost address remains as a safe development
   fallback while we are still building locally.
========================================================= */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://127.0.0.1:8000";


const OptInPage = () => {
  const navigate =
    useNavigate();


  /* =======================================================
     PAGE STATE

     campaign:
     The active campaign returned by Django.

     unlocked:
     Becomes true only after Django successfully saves
     the visitor's opt-in submission.
  ======================================================= */

  const [
    campaign,
    setCampaign,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    unlocked,
    setUnlocked,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({
    full_name: "",
    phone: "",
    email: "",
  });


  /* =======================================================
     LOAD THE ACTIVE OPT-IN CAMPAIGN

     This makes the page dynamic. The headline, resource,
     image and other content can now come from Django.
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadCampaign =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getOptInCampaign();

          if (!cancelled) {
            setCampaign(data);
          }
        } catch (err) {
          console.error(
            "Failed to load opt-in campaign:",
            err
          );

          if (!cancelled) {
            setError(
              "The free resource is temporarily unavailable."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadCampaign();

    return () => {
      cancelled = true;
    };
  }, []);


  /* =======================================================
     FORM INPUT HANDLER

     Only the three expected form fields are allowed to
     update state.

     Each field gets the cleanup rules that make sense for
     that particular type of information.
  ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    if (
      ![
        "full_name",
        "phone",
        "email",
      ].includes(name)
    ) {
      return;
    }

    let cleanedValue = value;

    if (
      name === "full_name"
    ) {
      cleanedValue =
        sanitizeName(value);
    }

    if (
      name === "phone"
    ) {
      cleanedValue =
        sanitizePhone(value);
    }

    if (
      name === "email"
    ) {
      cleanedValue =
        sanitizeEmail(value);
    }

    setFormData(
      (current) => ({
        ...current,
        [name]: cleanedValue,
      })
    );
  };


  /* =======================================================
     SUBMIT THE OPT-IN FORM

     The visitor stays on this same page after submission.

     Correct flow:
     1. Validate the values.
     2. Send them to Django.
     3. Django saves the submission.
     4. Unlock the resource.
     5. Show the download popup.

     We do NOT redirect from this function.
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !campaign ||
      submitting ||
      unlocked
    ) {
      return;
    }

    const cleanName =
      sanitizeName(
        formData.full_name
      ).trim();

    const cleanPhone =
      sanitizePhone(
        formData.phone
      ).trim();

    const cleanEmail =
      sanitizeEmail(
        formData.email
      )
        .trim()
        .toLowerCase();


    /* Basic name check */

    if (
      cleanName.length < 2
    ) {
      setError(
        "Please enter a valid full name."
      );

      return;
    }


    /* Basic phone check */

    const phoneDigits =
      cleanPhone.replace(
        /\D/g,
        ""
      );

    if (
      phoneDigits.length < 9 ||
      phoneDigits.length > 15
    ) {
      setError(
        "Please enter a valid phone number."
      );

      return;
    }


    /* Email is optional, but validate it when supplied */

    if (
      cleanEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }


    try {
      setSubmitting(true);
      setError("");
const submission =
  await submitOptIn({
    campaign:
      campaign.id,

    full_name:
      cleanName,

    phone:
      cleanPhone,

    email:
      cleanEmail,
  });


/*
  Keep only a temporary flag for the Thank You page.

  We are not storing the visitor's phone, email or name
  in browser storage.
*/

sessionStorage.setItem(
  "greatnessMallReturningVisitor",
  submission.already_exists
    ? "true"
    : "false"
);

      setFormData({
        full_name:
          cleanName,

        phone:
          cleanPhone,

        email:
          cleanEmail,
      });

      /*
        Django accepted and stored the submission.

        We can now reveal the download popup.
      */

      setUnlocked(true);

    } catch (err) {
      console.error(
        "Opt-in submission failed:",
        err
      );

      setError(
        "We could not submit your details. Please check the information and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };


  /* =======================================================
     DOWNLOAD THE RESOURCE

     The dedicated Django endpoint sends the resource as an
     attachment instead of allowing the browser to preview it.

     After the browser starts the download, the visitor is
     taken directly to the Thank You page.
  ======================================================= */

const handleDownload = () => {
  if (
    !unlocked ||
    !campaign?.id ||
    !campaign?.resource_file
  ) {
    return;
  }

  const downloadUrl =
    `${BACKEND_URL}/leads/resource/${campaign.id}/download/`;

  const link =
    document.createElement("a");

  link.href = downloadUrl;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    navigate("/thank-you");
  }, 800);
};

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <main className="optin-page">

        <div className="optin-status">
          Loading...
        </div>

      </main>
    );
  }


  /* =======================================================
     CAMPAIGN LOAD ERROR

     This is shown only when no usable campaign could be
     loaded from Django.
  ======================================================= */

  if (
    error &&
    !campaign
  ) {
    return (
      <main className="optin-page">

        <div
          className="
            optin-status
            optin-status-error
          "
          role="alert"
        >
          {error}
        </div>

      </main>
    );
  }


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="optin-page">

      <section className="optin-container">


        {/* ===================================================
            RESOURCE VISUAL

            The uploaded campaign image appears here.

            If no image exists yet, a branded placeholder is
            displayed instead of leaving an empty area.
        =================================================== */}

        <div className="optin-resource-side">

          {campaign?.resource_image ? (

            <img
              src={
                campaign
                  .resource_image
              }
              alt={
                campaign
                  .resource_title ||
                "Greatness Mall free resource"
              }
              className="optin-resource-image"
              loading="eager"
            />

          ) : (

            <div className="optin-resource-placeholder">

              <Download
                size={34}
                strokeWidth={1.6}
                aria-hidden="true"
              />

              <span>
                Free Resource
              </span>

            </div>

          )}

        </div>


        {/* ===================================================
            OPT-IN CONTENT

            The visitor sees the campaign information and
            form here.

            Once the submission succeeds, the form disappears
            and the success popup becomes the primary action.
        =================================================== */}

        <div className="optin-content-side">


          {/* Campaign label */}

          {campaign?.label && (

            <span className="optin-eyebrow">
              {campaign.label}
            </span>

          )}


          {/* Campaign headline */}

          <h1>
            {campaign?.headline}
          </h1>


          {/* Short supporting copy */}

          {campaign?.supporting_text && (

            <p className="optin-supporting-text">
              {
                campaign
                  .supporting_text
              }
            </p>

          )}


          {/* Resource preview */}

          <div className="optin-resource-summary">

            <span>
              RESOURCE
            </span>

            <h2>
              {
                campaign
                  ?.resource_title
              }
            </h2>

            {campaign?.resource_description && (

              <p>
                {
                  campaign
                    .resource_description
                }
              </p>

            )}

          </div>


          {/* =================================================
              OPT-IN FORM

              Hide the form after a successful submission.
          ================================================= */}

          {!unlocked && (

            <form
              className="optin-form"
              onSubmit={
                handleSubmit
              }
              noValidate
            >


              {/* Full name */}

              <div className="optin-field">

                <label
                  htmlFor="full_name"
                >
                  Full Name
                </label>

                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={
                    formData
                      .full_name
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="name"
                  minLength={2}
                  maxLength={150}
                  required
                  placeholder="Enter your full name"
                />

              </div>


              {/* Phone number */}

              <div className="optin-field">

                <label
                  htmlFor="phone"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={
                    formData
                      .phone
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={30}
                  required
                  placeholder="e.g. 024 123 4567"
                />

              </div>


              {/* Email address */}

              <div className="optin-field">

                <label
                  htmlFor="email"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={
                    formData
                      .email
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  placeholder="Enter your email"
                />

              </div>


              {/* Validation/API error */}

              {error && (

                <div
                  className="optin-form-error"
                  role="alert"
                >
                  {error}
                </div>

              )}


              {/* Main form action */}

              <button
                type="submit"
                className="optin-submit-button"
                disabled={
                  submitting
                }
              >
                {submitting
                  ? "Submitting..."
                  : campaign
                      ?.button_text ||
                    "Unlock Free Resource"
                }
              </button>


              {/* Privacy reassurance */}

              {campaign?.privacy_note && (

                <div className="optin-privacy-note">

                  <ShieldCheck
                    size={15}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <span>
                    {
                      campaign
                        .privacy_note
                    }
                  </span>

                </div>

              )}

            </form>

          )}

        </div>

      </section>


      {/* =====================================================
          RESOURCE READY POPUP

          This appears only after Django successfully saves
          the visitor's details.

          It intentionally has one clear action:
          Download Resource.

          Clicking that button starts the file download and
          then redirects the visitor to the Thank You page.
      ===================================================== */}

      {unlocked && campaign && (

        <div
          className="optin-success-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resource-ready-title"
          aria-describedby="resource-ready-description"
        >

          <div className="optin-success-modal">


            {/* Soft animated background glows */}

            <div
              className="
                optin-modal-blur
                optin-modal-blur-one
              "
              aria-hidden="true"
            />

            <div
              className="
                optin-modal-blur
                optin-modal-blur-two
              "
              aria-hidden="true"
            />


            <div className="optin-success-modal-content">


              {/* Success mark */}

              <div className="optin-success-icon">

                <CheckCircle2
                  size={26}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

              </div>


              <span className="optin-unlocked-label">
                ACCESS UNLOCKED
              </span>


              <h2 id="resource-ready-title">
                Your Free Guide Is Ready
              </h2>


              <p id="resource-ready-description">
                Download your free wellness guide now.
              </p>


              {/* Resource name */}

              <div className="optin-modal-resource">

                <span>
                  RESOURCE
                </span>

                <strong>
                  {
                    campaign
                      .resource_title
                  }
                </strong>

              </div>


              {/* Download action */}

              {campaign.resource_file ? (

                <button
                  type="button"
                  className="optin-download-button"
                  onClick={
                    handleDownload
                  }
                >

                  <Download
                    size={17}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  Download Resource

                </button>

              ) : (

                <div
                  className="optin-form-error"
                  role="alert"
                >
                  The resource file is temporarily unavailable.
                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </main>
  );
};


export default OptInPage;