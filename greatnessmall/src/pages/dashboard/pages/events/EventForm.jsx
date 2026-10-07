import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Upload,
  UserRound,
  Video,
  Save,
  Eye,
  ImagePlus,
  FileText,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import "./EventForm.css";


const EVENT_CATEGORY_LABELS = {
  training: "Training",
  seminar: "Seminar",
  presentation: "Presentation",
  meeting: "Meeting",
  product_education:
    "Product Education",
  other: "Other",
};


const EVENT_FORMAT_LABELS = {
  physical: "Physical",
  online: "Online",
  both: "Physical & Online",
};


const sanitizeSingleLine = (
  value = "",
  maxLength = 255
) => {
  return String(value)
    .replace(
      /[\u0000-\u001F\u007F]/g,
      ""
    )
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .slice(
      0,
      maxLength
    );
};


const sanitizeLongText = (
  value = "",
  maxLength = 10000
) => {
  return String(value)
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ""
    )
    .replace(/[<>]/g, "")
    .slice(
      0,
      maxLength
    );
};


const validateFlyerFile = (
  file
) => {
  const allowedTypes =
    new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);

  const maxSize =
    5 * 1024 * 1024;

  if (
    !allowedTypes.has(
      file.type
    )
  ) {
    return "Only JPG, PNG and WEBP images are allowed.";
  }

  if (
    file.size > maxSize
  ) {
    return "The event flyer must not exceed 5 MB.";
  }

  return "";
};


const sanitizeMeetingUrl = (
  value = ""
) => {
  const cleaned =
    String(value)
      .trim()
      .slice(
        0,
        500
      );

  if (!cleaned) {
    return "";
  }

  try {
    const url =
      new URL(cleaned);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return "";
    }

    return cleaned;
  } catch {
    return "";
  }
};


const EventForm = ({
  mode = "add",
  initialData = null,
  onSubmit,
}) => {
  const isEditMode =
    mode === "edit";


  const [
    formData,
    setFormData,
  ] = useState({
    title:
      initialData?.title ||
      "",

    category:
      initialData?.category ||
      "training",

    summary:
      initialData?.summary ||
      "",

    details:
      initialData?.details ||
      "",

    date:
      initialData?.date ||
      "",

    time:
      initialData?.time ||
      "",

    venue:
      initialData?.venue ||
      "",

    format:
      initialData?.format ||
      "both",

    host:
      initialData?.host ||
      "",

    meetingPlatform:
      initialData?.meetingPlatform ||
      "",

    meetingLink:
      initialData?.meetingLink ||
      "",

    meetingCode:
      initialData?.meetingCode ||
      "",

    published:
      initialData?.published ??
      true,

    displayOrder:
      initialData?.displayOrder ??
      0,

    flyer: null,
  });


  const [
    flyerPreview,
    setFlyerPreview,
  ] = useState(
    initialData?.flyerPreview ||
    ""
  );


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    formError,
    setFormError,
  ] = useState("");


  useEffect(() => {
    return () => {
      if (
        flyerPreview?.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          flyerPreview
        );
      }
    };
  }, [
    flyerPreview,
  ]);


  // Handle event fields
  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;


    if (
      type === "checkbox"
    ) {
      setFormData(
        (current) => ({
          ...current,
          [name]:
            checked,
        })
      );

      return;
    }


    let cleanedValue =
      value;


    switch (name) {
      case "title":
        cleanedValue =
          sanitizeSingleLine(
            value,
            160
          );
        break;

      case "summary":
        cleanedValue =
          sanitizeLongText(
            value,
            220
          );
        break;

      case "details":
        cleanedValue =
          sanitizeLongText(
            value,
            10000
          );
        break;

      case "venue":
        cleanedValue =
          sanitizeSingleLine(
            value,
            250
          );
        break;

      case "host":
        cleanedValue =
          sanitizeSingleLine(
            value,
            180
          );
        break;

      case "meetingPlatform":
        cleanedValue =
          sanitizeSingleLine(
            value,
            100
          );
        break;

      case "meetingCode":
        cleanedValue =
          sanitizeSingleLine(
            value,
            120
          );
        break;

      case "meetingLink":
        cleanedValue =
          String(value)
            .replace(
              /[\u0000-\u001F\u007F]/g,
              ""
            )
            .slice(
              0,
              500
            );
        break;

      case "displayOrder":
        cleanedValue =
          String(value)
            .replace(
              /\D/g,
              ""
            )
            .slice(
              0,
              6
            );
        break;

      default:
        break;
    }


    setFormData(
      (current) => ({
        ...current,
        [name]:
          cleanedValue,
      })
    );


    if (formError) {
      setFormError("");
    }
  };


  // Validate and preview flyer
  const handleFlyer = (
    event
  ) => {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }


    const fileError =
      validateFlyerFile(
        file
      );


    if (fileError) {
      setFormError(
        fileError
      );

      event.target.value =
        "";

      return;
    }


    setFormError("");


    setFormData(
      (current) => ({
        ...current,
        flyer:
          file,
      })
    );


    setFlyerPreview(
      URL.createObjectURL(
        file
      )
    );
  };


  const slugPreview =
    useMemo(() => {
      return formData.title
        .trim()
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        );
    }, [
      formData.title,
    ]);


  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      if (submitting) {
        return;
      }


      const cleanTitle =
        sanitizeSingleLine(
          formData.title,
          180
        ).trim();


      const cleanSummary =
        sanitizeLongText(
          formData.summary,
          260
        ).trim();


      const cleanDetails =
        sanitizeLongText(
          formData.details,
          10000
        ).trim();


      const cleanVenue =
        sanitizeSingleLine(
          formData.venue,
          250
        ).trim();


      const cleanHost =
        sanitizeSingleLine(
          formData.host,
          180
        ).trim();


      const cleanMeetingPlatform =
        sanitizeSingleLine(
          formData.meetingPlatform,
          100
        ).trim();


      const cleanMeetingCode =
        sanitizeSingleLine(
          formData.meetingCode,
          120
        ).trim();


      if (
        cleanTitle.length < 3
      ) {
        setFormError(
          "Enter a valid event title."
        );

        return;
      }


      if (
        cleanSummary.length < 5
      ) {
        setFormError(
          "Enter a valid short event summary."
        );

        return;
      }


      if (!formData.date) {
        setFormError(
          "Select the event date."
        );

        return;
      }


      if (!formData.time) {
        setFormError(
          "Select the event time."
        );

        return;
      }


      if (
        formData.format !==
          "online" &&
        !cleanVenue
      ) {
        setFormError(
          "Enter the event venue."
        );

        return;
      }


      let cleanMeetingLink =
        "";


      if (
        formData.meetingLink
          .trim()
      ) {
        cleanMeetingLink =
          sanitizeMeetingUrl(
            formData.meetingLink
          );

        if (
          !cleanMeetingLink
        ) {
          setFormError(
            "Enter a valid meeting link beginning with http:// or https://."
          );

          return;
        }
      }


      if (
        (
          formData.format ===
            "online" ||
          formData.format ===
            "both"
        ) &&
        !cleanMeetingPlatform &&
        !cleanMeetingLink
      ) {
        setFormError(
          "Add the online meeting platform or meeting link."
        );

        return;
      }


      if (
        !isEditMode &&
        !formData.flyer
      ) {
        setFormError(
          "Please upload an event flyer."
        );

        return;
      }


      const finalEvent = {
        ...formData,

        title:
          cleanTitle,

        summary:
          cleanSummary,

        details:
          cleanDetails,

        venue:
          cleanVenue,

        host:
          cleanHost,

        meetingPlatform:
          cleanMeetingPlatform,

        meetingLink:
          cleanMeetingLink,

        meetingCode:
          cleanMeetingCode,

        displayOrder:
          Math.max(
            0,
            Number.parseInt(
              formData.displayOrder,
              10
            ) || 0
          ),
      };


      try {
        setSubmitting(true);
        setFormError("");

        await onSubmit?.(
          finalEvent
        );
      } catch (error) {
        console.error(
          "Event save failed:",
          error
        );

        setFormError(
          error.message ||
            "The event could not be saved."
        );
      } finally {
        setSubmitting(false);
      }
    };


  return (
    <div className="admin-event-editor">


      <div className="admin-event-editor-header">

        <div>

          <NavLink
            to="/admin/events"
            className="admin-event-editor-back"
          >
            <ArrowLeft
              size={16}
            />

            Events
          </NavLink>


          <span className="admin-event-editor-eyebrow">
            EVENT MANAGEMENT
          </span>


          <h1>
            {isEditMode
              ? "Edit Event"
              : "Add Event"}
          </h1>


          <p>
            {isEditMode
              ? "Update the event card and full program information."
              : "Create the event card and full program information."}
          </p>

        </div>


        <div className="admin-event-editor-actions">

          <button
            type="button"
            className="admin-event-preview-button"
            disabled={
              !slugPreview
            }
            onClick={() => {
              if (
                !slugPreview
              ) {
                return;
              }

              window.open(
                `/events/${slugPreview}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            <Eye
              size={17}
            />

            Preview
          </button>


          <button
            type="submit"
            form="admin-event-form"
            className="admin-event-save-button"
            disabled={
              submitting
            }
          >
            <Save
              size={17}
            />

            {submitting
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Save Event"}
          </button>

        </div>

      </div>


      <form
        id="admin-event-form"
        className="admin-event-editor-layout"
        onSubmit={
          handleSubmit
        }
      >

        {formError && (
          <div
            className="admin-event-form-error"
            role="alert"
          >
            {formError}
          </div>
        )}


        <div className="admin-event-editor-main">


          <section className="admin-event-form-card">

            <div className="admin-event-form-heading">

              <div className="admin-event-form-icon">
                <CalendarDays
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Basic Event Information
                </h2>

                <p>
                  Information shown on the homepage event card.
                </p>
              </div>

            </div>


            <div className="admin-event-form-grid">


              <div className="admin-event-field admin-event-full">

                <label htmlFor="event-title">
                  Event Title
                  <span>*</span>
                </label>

                <input
                  id="event-title"
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. The Art of Invitation & Presentation Skills"
                  required
                  maxLength={180}
                  autoComplete="off"
                />

              </div>


              <div className="admin-event-field">

                <label htmlFor="event-category">
                  Event Category
                </label>

                <select
                  id="event-category"
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="training">
                    Training
                  </option>

                  <option value="seminar">
                    Seminar
                  </option>

                  <option value="presentation">
                    Presentation
                  </option>

                  <option value="meeting">
                    Meeting
                  </option>

                  <option value="product_education">
                    Product Education
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>

              </div>


              <div className="admin-event-field">

                <label htmlFor="event-format">
                  Event Format
                </label>

                <select
                  id="event-format"
                  name="format"
                  value={
                    formData.format
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="physical">
                    Physical
                  </option>

                  <option value="online">
                    Online
                  </option>

                  <option value="both">
                    Physical & Online
                  </option>
                </select>

              </div>


              <div className="admin-event-field admin-event-full">

                <label htmlFor="event-summary">
                  Short Summary
                  <span>*</span>
                </label>

                <textarea
                  id="event-summary"
                  name="summary"
                  value={
                    formData.summary
                  }
                  onChange={
                    handleChange
                  }
                  rows="4"
                  maxLength={260}
                  required
                  placeholder="Short event description displayed on the homepage."
                />

                <div className="admin-event-helper">

                  <span>
                    Keep this concise for the homepage card.
                  </span>

                  <span>
                    {
                      formData
                        .summary
                        .length
                    }
                    /260
                  </span>

                </div>

              </div>


              <div className="admin-event-field">

                <label htmlFor="event-display-order">
                  Display Order
                </label>

                <input
                  id="event-display-order"
                  type="number"
                  name="displayOrder"
                  min="0"
                  step="1"
                  value={
                    formData.displayOrder
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

          </section>


          <section className="admin-event-form-card">

            <div className="admin-event-form-heading">

              <div className="admin-event-form-icon">
                <ImagePlus
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Event Flyer
                </h2>

                <p>
                  Upload the flyer that appears on the homepage event card.
                </p>
              </div>

            </div>


            <label className="admin-event-flyer-upload">

              {flyerPreview ? (

                <img
                  src={
                    flyerPreview
                  }
                  alt="Event flyer preview"
                />

              ) : (

                <>
                  <Upload
                    size={25}
                  />

                  <strong>
                    Upload Event Flyer
                  </strong>

                  <span>
                    PNG, JPG or WEBP — maximum 5 MB
                  </span>
                </>

              )}


              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleFlyer
                }
              />

            </label>

          </section>


          <section className="admin-event-form-card">

            <div className="admin-event-form-heading">

              <div className="admin-event-form-icon">
                <Clock3
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Schedule & Location
                </h2>

                <p>
                  Set when and where the event will take place.
                </p>
              </div>

            </div>


            <div className="admin-event-form-grid">


              <div className="admin-event-field">

                <label htmlFor="event-date">
                  Date
                </label>

                <input
                  id="event-date"
                  type="date"
                  name="date"
                  value={
                    formData.date
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              <div className="admin-event-field">

                <label htmlFor="event-time">
                  Time
                </label>

                <input
                  id="event-time"
                  type="time"
                  name="time"
                  value={
                    formData.time
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              <div className="admin-event-field admin-event-full">

                <label htmlFor="event-venue">
                  Venue
                </label>

                <input
                  id="event-venue"
                  type="text"
                  name="venue"
                  value={
                    formData.venue
                  }
                  onChange={
                    handleChange
                  }
                  maxLength={250}
                  placeholder="e.g. Tema-Gbetsile GB Plaza, Accra"
                />

              </div>

            </div>

          </section>


          <section className="admin-event-form-card">

            <div className="admin-event-form-heading">

              <div className="admin-event-form-icon">
                <UserRound
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Host Information
                </h2>

                <p>
                  Add the host or facilitator if applicable.
                </p>
              </div>

            </div>


            <div className="admin-event-field">

              <label htmlFor="event-host">
                Host / Facilitator
              </label>

              <input
                id="event-host"
                type="text"
                name="host"
                value={
                  formData.host
                }
                onChange={
                  handleChange
                }
                maxLength={180}
                placeholder="e.g. Sey Regina – Team Leader"
              />

            </div>

          </section>


          {(formData.format ===
            "online" ||
            formData.format ===
              "both") && (

            <section className="admin-event-form-card">

              <div className="admin-event-form-heading">

                <div className="admin-event-form-icon">
                  <Video
                    size={19}
                  />
                </div>

                <div>
                  <h2>
                    Online Meeting Details
                  </h2>

                  <p>
                    Add online access details for participants.
                  </p>
                </div>

              </div>


              <div className="admin-event-form-grid">


                <div className="admin-event-field">

                  <label htmlFor="meeting-platform">
                    Platform
                  </label>

                  <select
                    id="meeting-platform"
                    name="meetingPlatform"
                    value={
                      formData.meetingPlatform
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select platform
                    </option>

                    <option value="Google Meet">
                      Google Meet
                    </option>

                    <option value="Zoom">
                      Zoom
                    </option>

                    <option value="Microsoft Teams">
                      Microsoft Teams
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>


                <div className="admin-event-field">

                  <label htmlFor="meeting-code">
                    Meeting Code
                  </label>

                  <input
                    id="meeting-code"
                    type="text"
                    name="meetingCode"
                    value={
                      formData.meetingCode
                    }
                    onChange={
                      handleChange
                    }
                    maxLength={120}
                    placeholder="e.g. vdq-moqd-rbb"
                  />

                </div>


                <div className="admin-event-field admin-event-full">

                  <label htmlFor="meeting-link">
                    Meeting Link
                  </label>

                  <input
                    id="meeting-link"
                    type="url"
                    name="meetingLink"
                    value={
                      formData.meetingLink
                    }
                    onChange={
                      handleChange
                    }
                    maxLength={500}
                    placeholder="https://meet.google.com/..."
                  />

                  <small>
                    Use a valid HTTPS meeting link.
                  </small>

                </div>

              </div>

            </section>

          )}


          <section className="admin-event-form-card">

            <div className="admin-event-form-heading">

              <div className="admin-event-form-icon">
                <FileText
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Full Event Details
                </h2>

                <p>
                  Full information displayed on the event details page.
                </p>
              </div>

            </div>


            <div className="admin-event-field">

              <textarea
                name="details"
                value={
                  formData.details
                }
                onChange={
                  handleChange
                }
                rows="10"
                maxLength={10000}
                placeholder="Enter full event details, learning points, instructions, requirements and other information..."
              />

            </div>

          </section>

        </div>


        <aside className="admin-event-editor-sidebar">

          <div className="admin-event-live-preview">

            <div className="admin-event-preview-heading">

              <div>
                <span>
                  LIVE PREVIEW
                </span>

                <h2>
                  Homepage Card
                </h2>
              </div>

              <Eye
                size={18}
              />

            </div>


            <article className="admin-event-public-card">

              <div className="admin-event-public-flyer">

                {flyerPreview ? (

                  <img
                    src={
                      flyerPreview
                    }
                    alt=""
                  />

                ) : (

                  <div>
                    <ImagePlus
                      size={25}
                    />

                    <span>
                      Event Flyer
                    </span>
                  </div>

                )}

              </div>


              <div className="admin-event-public-content">

                <div className="admin-event-public-badges">

                  <span>
                    {
                      EVENT_CATEGORY_LABELS[
                        formData.category
                      ] ||
                      "Event"
                    }
                  </span>

                  <span>
                    Upcoming Event
                  </span>

                </div>


                <h3>
                  {formData.title ||
                    "Event Title"}
                </h3>


                <p>
                  {formData.summary ||
                    "Your short event summary will appear here."}
                </p>


                <div className="admin-event-preview-meta">

                  <div>
                    <CalendarDays
                      size={14}
                    />

                    <span>
                      {formData.date ||
                        "Event date"}
                    </span>
                  </div>


                  <div>
                    <Clock3
                      size={14}
                    />

                    <span>
                      {formData.time ||
                        "Event time"}
                    </span>
                  </div>


                  <div>
                    <MapPin
                      size={14}
                    />

                    <span>
                      {formData.venue ||
                        EVENT_FORMAT_LABELS[
                          formData.format
                        ] ||
                        "Event location"}
                    </span>
                  </div>

                </div>


                <div className="admin-event-public-button">
                  View Event Details
                </div>

              </div>

            </article>


            <div className="admin-event-url-preview">

              <span>
                Event URL
              </span>

              <code>
                /events/
                {slugPreview ||
                  "event-title"}
              </code>

            </div>


            <div className="admin-event-publish-row">

              <div>
                <strong>
                  Publish Event
                </strong>

                <span>
                  Display this event publicly.
                </span>
              </div>


              <label className="admin-event-switch">

                <input
                  type="checkbox"
                  name="published"
                  checked={
                    formData.published
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


export default EventForm;