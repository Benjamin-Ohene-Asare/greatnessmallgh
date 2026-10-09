import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Download,
  Eye,
  FileText,
  ImagePlus,
  Save,
  ShieldCheck,
  Upload,
} from "lucide-react";

import {
  getAdminOptInCampaign,
  updateAdminOptInCampaign,
} from "../../../../services/backend";

import "./AdminOptIn.css";


const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const MAX_RESOURCE_SIZE =
  15 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


const getFileNameFromUrl = (
  url
) => {
  if (!url) {
    return "";
  }

  try {
    const pathname =
      new URL(
        url,
        window.location.origin
      ).pathname;

    return decodeURIComponent(
      pathname.split("/").pop() || ""
    );
  } catch {
    return "";
  }
};


const AdminOptIn = () => {
  const imageObjectUrlRef =
    useRef("");



  const [formData, setFormData] =
    useState({
      label: "",
      headline: "",
      supportingText: "",
      resourceTitle: "",
      resourceDescription: "",
      buttonText: "",
      privacyNote: "",
      active: true,
      resourceImage: null,
      resourceFile: null,
    });

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [
    existingImage,
    setExistingImage,
  ] = useState("");

  const [
    resourceFileName,
    setResourceFileName,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  // Load current campaign
  useEffect(() => {
    let active = true;

    const loadCampaign = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminOptInCampaign();

        if (!active) {
          return;
        }

      

        setFormData({
          label:
            data.label || "",
          headline:
            data.headline || "",
          supportingText:
            data.supporting_text || "",
          resourceTitle:
            data.resource_title || "",
          resourceDescription:
            data.resource_description || "",
          buttonText:
            data.button_text || "",
          privacyNote:
            data.privacy_note || "",
          active:
            Boolean(data.is_active),
          resourceImage:
            null,
          resourceFile:
            null,
        });

        setExistingImage(
          data.resource_image || ""
        );

        setImagePreview(
          data.resource_image || ""
        );

        setResourceFileName(
          getFileNameFromUrl(
            data.resource_file
          )
        );
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(
          requestError.message ||
            "Unable to load the opt-in campaign."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCampaign();

    return () => {
      active = false;

      if (
        imageObjectUrlRef.current
      ) {
        URL.revokeObjectURL(
          imageObjectUrlRef.current
        );
      }
    };
  }, []);


  // Normal fields
  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSuccessMessage("");
    setError("");

    setFormData(
      (current) => ({
        ...current,
        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );
  };


  // Resource image
  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccessMessage("");

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      setError(
        "Please select a JPG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setError(
        "The resource image must not exceed 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (
      imageObjectUrlRef.current
    ) {
      URL.revokeObjectURL(
        imageObjectUrlRef.current
      );
    }

    const previewUrl =
      URL.createObjectURL(
        file
      );

    imageObjectUrlRef.current =
      previewUrl;

    setFormData(
      (current) => ({
        ...current,
        resourceImage: file,
      })
    );

    setImagePreview(
      previewUrl
    );
  };


  // PDF resource
  const handleResourceFile = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccessMessage("");

    const isPdf =
      file.type ===
        "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      setError(
        "Please select a PDF resource file."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      MAX_RESOURCE_SIZE
    ) {
      setError(
        "The PDF resource must not exceed 15 MB."
      );

      event.target.value = "";
      return;
    }

    setFormData(
      (current) => ({
        ...current,
        resourceFile: file,
      })
    );

    setResourceFileName(
      file.name
    );
  };


  // Save campaign
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const headline =
      formData.headline.trim();

    const resourceTitle =
      formData.resourceTitle.trim();

    const buttonText =
      formData.buttonText.trim();

    if (
      headline.length < 3
    ) {
      setError(
        "Please enter a valid headline."
      );

      return;
    }

    if (
      resourceTitle.length < 2
    ) {
      setError(
        "Please enter a valid resource title."
      );

      return;
    }

    if (!buttonText) {
      setError(
        "Please enter the button text."
      );

      return;
    }

    const payload =
      new FormData();

    payload.append(
      "label",
      formData.label.trim()
    );

    payload.append(
      "headline",
      headline
    );

    payload.append(
      "supporting_text",
      formData.supportingText.trim()
    );

    payload.append(
      "resource_title",
      resourceTitle
    );

    payload.append(
      "resource_description",
      formData.resourceDescription.trim()
    );

    payload.append(
      "button_text",
      buttonText
    );

    payload.append(
      "privacy_note",
      formData.privacyNote.trim()
    );

    payload.append(
      "is_active",
      String(formData.active)
    );

    if (
      formData.resourceImage
    ) {
      payload.append(
        "resource_image",
        formData.resourceImage
      );
    }

    if (
      formData.resourceFile
    ) {
      payload.append(
        "resource_file",
        formData.resourceFile
      );
    }

    try {
      setSubmitting(true);

      const updated =
        await updateAdminOptInCampaign(
          payload
        );

    

      setExistingImage(
        updated.resource_image || ""
      );

      if (
        imageObjectUrlRef.current
      ) {
        URL.revokeObjectURL(
          imageObjectUrlRef.current
        );

        imageObjectUrlRef.current =
          "";
      }

      setImagePreview(
        updated.resource_image || ""
      );

      setResourceFileName(
        getFileNameFromUrl(
          updated.resource_file
        )
      );

      setFormData(
        (current) => ({
          ...current,

          label:
            updated.label || "",

          headline:
            updated.headline || "",

          supportingText:
            updated.supporting_text || "",

          resourceTitle:
            updated.resource_title || "",

          resourceDescription:
            updated.resource_description || "",

          buttonText:
            updated.button_text || "",

          privacyNote:
            updated.privacy_note || "",

          active:
            Boolean(
              updated.is_active
            ),

          resourceImage:
            null,

          resourceFile:
            null,
        })
      );

      setSuccessMessage(
        "Opt-in campaign saved successfully."
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to save the opt-in campaign."
      );
    } finally {
      setSubmitting(false);
    }
  };


  const handlePreview = () => {
    window.open(
      "/optin",
      "_blank",
      "noopener,noreferrer"
    );
  };


  if (loading) {
    return (
      <div className="admin-optin-page">
        <div className="admin-optin-header">
          <div>
            <span className="admin-optin-eyebrow">
              MARKETING
            </span>

            <h1>
              Opt-In Page
            </h1>

            <p>
              Loading campaign...
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="admin-optin-page">
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
            onClick={handlePreview}
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
            disabled={submitting}
          >
            <Save
              size={17}
              strokeWidth={1.8}
            />

            {submitting
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="admin-optin-message admin-optin-message-error"
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="admin-optin-message admin-optin-message-success"
        >
          {successMessage}
        </div>
      )}

      <form
        id="admin-optin-form"
        className="admin-optin-layout"
        onSubmit={handleSubmit}
      >
        <div className="admin-optin-main">
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
                  maxLength={100}
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
                  maxLength={220}
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
                  value={
                    formData.supportingText
                  }
                  onChange={handleChange}
                  rows="4"
                  maxLength={1000}
                  placeholder="Explain what visitors will receive."
                />
              </div>
            </div>
          </section>


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
                  value={
                    formData.resourceTitle
                  }
                  onChange={handleChange}
                  required
                  maxLength={180}
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
                  value={
                    formData.resourceDescription
                  }
                  onChange={handleChange}
                  rows="5"
                  maxLength={1500}
                  placeholder="Describe the resource visitors will receive."
                />
              </div>
            </div>
          </section>


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
                    PNG, JPG or WEBP · Max 5 MB
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleImageChange
                }
              />
            </label>
          </section>


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
                  Upload the PDF visitors receive after submitting their details.
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
                  PDF only · Max 15 MB
                </span>
              </div>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={
                  handleResourceFile
                }
              />
            </label>

            <div className="admin-optin-security-note">
              <ShieldCheck
                size={17}
                strokeWidth={1.7}
              />

              <p>
                Images and downloadable resources are validated before being saved.
              </p>
            </div>
          </section>


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
                  value={
                    formData.buttonText
                  }
                  onChange={handleChange}
                  maxLength={100}
                  required
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
                  value={
                    formData.privacyNote
                  }
                  onChange={handleChange}
                  rows="3"
                  maxLength={1000}
                  placeholder="Add a short privacy note."
                />
              </div>
            </div>
          </section>
        </div>


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
                  checked={
                    formData.active
                  }
                  onChange={
                    handleChange
                  }
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