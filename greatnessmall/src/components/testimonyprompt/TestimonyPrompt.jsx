import React, {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  Quote,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./TestimonyPrompt.css";

const TestimonyPrompt = () => {
  const [isVisible, setIsVisible] =
    useState(false);

  const [isClosed, setIsClosed] =
    useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    /* Hide completely on the testimony page */
    if (
      location.pathname ===
      "/testimony"
    ) {
      setIsVisible(false);
      return;
    }

    /* Show after 10 seconds */
    const timer = window.setTimeout(
      () => {
        if (!isClosed) {
          setIsVisible(true);
        }
      },
      10000
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    location.pathname,
    isClosed,
  ]);

  /* Go to testimony page */
  const handleOpenTestimonials = () => {
    setIsVisible(false);

    navigate("/testimony");
  };

  /* Close floating prompt */
  const handleClose = (
    event
  ) => {
    event.stopPropagation();

    setIsVisible(false);
    setIsClosed(true);
  };

  /* Do not render on testimony page */
  if (
    location.pathname ===
      "/testimony" ||
    !isVisible
  ) {
    return null;
  }

  return (
    <div
      className="testimony-prompt"
      role="complementary"
      aria-label="Customer testimonies"
    >
      <button
        type="button"
        className="testimony-prompt-main"
        onClick={
          handleOpenTestimonials
        }
        aria-label="See customer testimonies"
      >
        <span className="testimony-prompt-icon">
          <Quote
            size={17}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>

        <span className="testimony-prompt-text">
          See Testimonies
        </span>

        <span className="testimony-prompt-arrow">
          <ChevronLeft
            size={17}
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </span>
      </button>

      <button
        type="button"
        className="testimony-prompt-close"
        onClick={handleClose}
        aria-label="Close testimony prompt"
      >
        <X
          size={13}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default TestimonyPrompt;