import React, { useState } from "react";
import {
  FileText,
  ImagePlus,
  Upload,
  Save,
  Eye,
  Download,
  ShieldCheck,
} from "lucide-react";

import "./AdminOptIn.css";

const AdminOptIn = () => {
  /* =========================================================
     FRONTEND-ONLY OPT-IN CONTENT

     Later Django will:
     - store this content
     - store the resource file
     - validate uploads
     - control active campaign
     - provide this data to the public opt-in page
  ========================================================= */

  const [formData, setFormData] = useState({
    label: "FREE RESOURCE",

    headline:
      "Unlock Your Free Greatness Mall Wellness Guide",

    supportingText:
      "Enter your details below to access the resource and continue to Greatness Mall.",

    resourceTitle:
      "Greatness Mall Wellness Guide",

    resourceDescription:
      "A simple guide designed to help you learn more about wellness products and how Greatness Mall can support your lifestyle.",

    buttonText:
      "Unlock Free Resource",

    privacyNote:
      "Your information will only be used to provide the resource and relevant Greatness Mall updates.",

    active: true,

    resourceImage: null,
    resourceFile: null,
  });

  const [imagePreview, setImagePreview] =
    useState("");

  const [resourceFileName, setResourceFileName] =
    useState("");


  /* =========================================================
     BASIC CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  /* =========================================================
     RESOURCE IMAGE
  ========================================================= */

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setFormData((current) => ({
      ...current,
      resourceImage: file,
    }));

    setImagePreview(
      URL.createObjectURL(file)
    );
  };


  /* =========================================================
     RESOURCE FILE
  ========================================================= */

  const handleResourceFile = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setFormData((current) => ({
      ...current,
      resourceFile: file,
    }));

    setResourceFileName(file.name);
  };


  /* =========================================================
     SAVE

     Frontend simulation only.
  ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(
      "Opt-in page content:",
      formData
    );

    alert(
      "Frontend only: these changes will be saved when Django is connected."
    );
  };


  return (
    <div className="admin-optin-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="admin-optin-header">

        <div>

          <span className="admin-optin-eyebrow">
            MARKETING
          </span>

          <h1>
            Opt-In Page
          </h1>

          <p>
            Update the lead capture page and the free resource visitors receive.
          </p>

        </div>


        <div className="admin-optin-header-actions">

          <button
            type="button"
            className="admin-optin-preview-button"
          >
            <Eye
              size={17}
              strokeWidth={1.8}
            />

            Preview
          </button>


          <button
            type="submit"
            form="admin-optin-form"
            className="admin-optin-save-button"
          >
            <Save
              size={17}
              strokeWidth={1.8}
            />

            Save Changes
          </button>

        </div>

      </div>


      <form
        id="admin-optin-form"
        className="admin-optin-layout"
        onSubmit={handleSubmit}
      >

        {/* =====================================================
            MAIN FORM
        ====================================================== */}

        <div className="admin-optin-main">

          {/* PAGE CONTENT */}

          <section className="admin-optin-card">

            <div className="admin-optin-card-heading">

              <div className="admin-optin-card-icon">
                <FileText
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2>
                  Opt-In Page Content
                </h2>

                <p>
                  Main text displayed before visitors submit their details.
                </p>
              </div>

            </div>


            <div className="admin-optin-form-grid">

              <div className="admin-optin-field">

                <label htmlFor="optin-label">
                  Page Label
                </label>

                <input
                  id="optin-label"
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  maxLength={80}
                  placeholder="e.g. FREE RESOURCE"
                />

              </div>


              <div className="admin-optin-field admin-optin-full">

                <label htmlFor="optin-headline">
                  Main Headline
                  <span>*</span>
                </label>

                <input
                  id="optin-headline"
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  maxLength={180}
                  required
                  placeholder="Main opt-in headline"
                />

              </div>


              <div className="admin-optin-field admin-optin-full">

                <label htmlFor="optin-supporting-text">
                  Supporting Text
                </label>

                <textarea
                  id="optin-supporting-text"
                  name="supportingText"
                  value={formData.supportingText}
                  onChange={handleChange}
                  rows="4"
                  maxLength={400}
                  placeholder="Explain what visitors will receive."
                />

              </div>

            </div>

          </section>


          {/* RESOURCE INFORMATION */}

          <section className="admin-optin-card">

            <div className="admin-optin-card-heading">

              <div className="admin-optin-card-icon">
                <Download
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2>
                  Resource Information
                </h2>

                <p>
                  Manage the resource visitors unlock after submitting the form.
                </p>
              </div>

            </div>


            <div className="admin-optin-form-grid">

              <div className="admin-optin-field admin-optin-full">

                <label htmlFor="resource-title">
                  Resource Title
                  <span>*</span>
                </label>

                <input
                  id="resource-title"
                  type="text"
                  name="resourceTitle"
                  value={formData.resourceTitle}
                  onChange={handleChange}
                  required
                  maxLength={160}
                  placeholder="e.g. Greatness Mall Wellness Guide"
                />

              </div>


              <div className="admin-optin-field admin-optin-full">

                <label htmlFor="resource-description">
                  Resource Description
                </label>

                <textarea
                  id="resource-description"
                  name="resourceDescription"
                  value={formData.resourceDescription}
                  onChange={handleChange}
                  rows="5"
                  maxLength={500}
                  placeholder="Describe the resource visitors will receive."
                />

              </div>

            </div>

          </section>


          {/* IMAGE */}

          <section className="admin-optin-card">

            <div className="admin-optin-card-heading">

              <div className="admin-optin-card-icon">
                <ImagePlus
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2>
                  Resource Image
                </h2>

                <p>
                  Upload the image or cover shown beside the opt-in form.
                </p>
              </div>

            </div>


            <label className="admin-optin-image-upload">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Resource preview"
                />
              ) : (
                <>
                  <ImagePlus
                    size={28}
                    strokeWidth={1.6}
                  />

                  <strong>
                    Upload Resource Image
                  </strong>

                  <span>
                    PNG, JPG or WEBP
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
              />

            </label>

          </section>


          {/* DOWNLOAD FILE */}

          <section className="admin-optin-card">

            <div className="admin-optin-card-heading">

              <div className="admin-optin-card-icon">
                <Upload
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2>
                  Downloadable Resource
                </h2>

                <p>
                  Upload the file visitors receive after submitting their details.
                </p>
              </div>

            </div>


            <label className="admin-optin-file-upload">

              <Upload
                size={23}
                strokeWidth={1.7}
              />

              <div>

                <strong>
                  {resourceFileName ||
                    "Choose Resource File"}
                </strong>

                <span>
                  PDF recommended
                </span>

              </div>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResourceFile}
              />

            </label>


            <div className="admin-optin-security-note">

              <ShieldCheck
                size={17}
                strokeWidth={1.7}
              />

              <p>
                Django will later validate the real file type, size and storage location before allowing downloads.
              </p>

            </div>

          </section>


          {/* BUTTON / PRIVACY */}

          <section className="admin-optin-card">

            <div className="admin-optin-card-heading">

              <div className="admin-optin-card-icon">
                <FileText
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2>
                  Form Settings
                </h2>

                <p>
                  Control the call-to-action and privacy message.
                </p>
              </div>

            </div>


            <div className="admin-optin-form-grid">

              <div className="admin-optin-field">

                <label htmlFor="optin-button-text">
                  Button Text
                </label>

                <input
                  id="optin-button-text"
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  maxLength={80}
                  placeholder="Unlock Free Resource"
                />

              </div>


              <div className="admin-optin-field admin-optin-full">

                <label htmlFor="privacy-note">
                  Privacy Note
                </label>

                <textarea
                  id="privacy-note"
                  name="privacyNote"
                  value={formData.privacyNote}
                  onChange={handleChange}
                  rows="3"
                  maxLength={350}
                  placeholder="Add a short privacy note."
                />

              </div>

            </div>

          </section>

        </div>


        {/* =====================================================
            LIVE PREVIEW
        ====================================================== */}

        <aside className="admin-optin-sidebar">

          <div className="admin-optin-preview">

            <div className="admin-optin-preview-heading">

              <div>
                <span>
                  LIVE PREVIEW
                </span>

                <h2>
                  Opt-In Page
                </h2>
              </div>

              <Eye
                size={18}
                strokeWidth={1.7}
              />

            </div>


            <div className="admin-optin-public-preview">

              {imagePreview && (
                <div className="admin-optin-preview-image">

                  <img
                    src={imagePreview}
                    alt=""
                  />

                </div>
              )}


              <div className="admin-optin-preview-content">

                <span className="admin-optin-preview-label">
                  {formData.label ||
                    "FREE RESOURCE"}
                </span>

                <h3>
                  {formData.headline ||
                    "Opt-In Headline"}
                </h3>

                <p>
                  {formData.supportingText ||
                    "Supporting text will appear here."}
                </p>


                <div className="admin-optin-preview-resource">

                  <span>
                    RESOURCE
                  </span>

                  <strong>
                    {formData.resourceTitle ||
                      "Resource Title"}
                  </strong>

                  <p>
                    {formData.resourceDescription ||
                      "Resource description will appear here."}
                  </p>

                </div>


                <div className="admin-optin-preview-fields">

                  <div>
                    Full Name
                  </div>

                  <div>
                    Phone Number
                  </div>

                  <div>
                    Email Address
                  </div>

                </div>


                <div className="admin-optin-preview-button">
                  {formData.buttonText ||
                    "Unlock Resource"}
                </div>


                <small>
                  {formData.privacyNote}
                </small>

              </div>

            </div>


            {/* ACTIVE */}

            <div className="admin-optin-active-row">

              <div>
                <strong>
                  Opt-In Campaign Active
                </strong>

                <span>
                  Show this campaign to visitors.
                </span>
              </div>


              <label className="admin-optin-switch">

                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />

                <span></span>

              </label>

            </div>

          </div>

        </aside>

      </form>

    </div>
  );
};

export default AdminOptIn;