import React, { useEffect, useState } from "react";

import "./AdminTour.css";

const steps = [
  {
    target: "dashboard",
    title: "Dashboard",
    text: "View an overview of the Greatness Mall website and admin activity.",
  },
  {
    target: "products",
    title: "Products",
    text: "Add, edit and manage products displayed on the website.",
  },
  {
    target: "categories",
    title: "Categories",
    text: "Organise products into categories for easier browsing.",
  },
  {
    target: "events",
    title: "Events",
    text: "Create and manage upcoming events, seminars and training sessions.",
  },
  {
    target: "twi",
    title: "Twi Content",
    text: "Manage Twi videos, audio and image content.",
  },
  {
    target: "faqs",
    title: "FAQs",
    text: "Manage frequently asked questions shown to visitors.",
  },
  {
    target: "testimonials",
    title: "Testimonials",
    text: "Manage customer video, image and audio testimonials.",
  },
  {
    target: "optin",
    title: "Opt-In Page",
    text: "Manage the page visitors use to unlock your free resource.",
  },
  {
    target: "contacts",
    title: "Contacts",
    text: "View people who submitted their details through the opt-in page.",
  },
  {
    target: "sms",
    title: "SMS Broadcast",
    text: "Send SMS updates to selected contacts.",
  },
  {
    target: "whatsapp",
    title: "WhatsApp",
    text: "Manage WhatsApp contact and communication settings.",
  },
  {
    target: "settings",
    title: "Website Settings",
    text: "Manage general Greatness Mall website settings.",
  },
];

const AdminTour = () => {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem("greatnessMallAdminTour");

    if (!completed) {
      setActive(true);
    }
  }, []);

  useEffect(() => {
    if (!active) return;

    document
      .querySelectorAll(".admin-tour-highlight")
      .forEach((element) => {
        element.classList.remove("admin-tour-highlight");
      });

    const target = document.querySelector(
      `[data-tour="${steps[step].target}"]`
    );

    if (target) {
      target.classList.add("admin-tour-highlight");

      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return () => {
      target?.classList.remove("admin-tour-highlight");
    };
  }, [active, step]);

  const finishTour = () => {
    localStorage.setItem("greatnessMallAdminTour", "completed");
    setActive(false);
  };

  if (!active) return null;

  const current = steps[step];
  const lastStep = step === steps.length - 1;

  return (
    <>
      <div className="admin-tour-overlay" />

      <div className="admin-tour-card">
        <button
          type="button"
          className="admin-tour-skip"
          onClick={finishTour}
        >
          Skip Tour
        </button>

        <span className="admin-tour-step">
          STEP {step + 1} OF {steps.length}
        </span>

        <h2>{current.title}</h2>

        <p>{current.text}</p>

        <div className="admin-tour-actions">
          <button
            type="button"
            className="admin-tour-back"
            onClick={() => setStep((currentStep) => currentStep - 1)}
            disabled={step === 0}
          >
            Back
          </button>

          <button
            type="button"
            className="admin-tour-next"
            onClick={() =>
              lastStep
                ? finishTour()
                : setStep((currentStep) => currentStep + 1)
            }
          >
            {lastStep ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminTour;