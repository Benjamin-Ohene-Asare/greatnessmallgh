import React, {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
} from "lucide-react";

import {
  getEvents,
} from "../../services/backend";

import "./UpcomingEvent.css";


const UpcomingEvent = () => {
  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================================================
     LOAD UPCOMING EVENTS FROM DJANGO

     For now, we show the first published event returned
     by the API.

     Later Django can return:
     - nearest upcoming event first
     - recurring events
     - featured event flag
     - multiple event cards
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getEvents();

        if (cancelled) {
          return;
        }

        if (
          Array.isArray(data) &&
          data.length > 0
        ) {
          setEvent(data[0]);
        } else {
          setEvent(null);
        }
      } catch (err) {
        console.error(
          "Failed to load upcoming event:",
          err
        );

        if (!cancelled) {
          setError(
            "Upcoming event could not be loaded."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, []);


  /* =========================================================
     LOADING

     Keep this subtle on the homepage.
  ========================================================= */

  if (loading) {
    return null;
  }


  /* =========================================================
     ERROR / NO EVENT

     Do not leave an empty homepage section.
  ========================================================= */

  if (
    error ||
    !event
  ) {
    return null;
  }


  return (
    <section className="upcoming-event">

      <div className="upcoming-event-container">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="upcoming-event-header">

          <span className="upcoming-event-eyebrow">
            EVENTS & TRAINING
          </span>

          <h2>
            Upcoming Programs
          </h2>

          <p>
            Stay informed about upcoming Greatness Mall training,
            presentations and community programs.
          </p>

        </div>


        {/* =====================================================
            EVENT CARD
        ====================================================== */}

        <article className="upcoming-event-card">

          {/* FLYER */}

          <div className="upcoming-event-flyer">

            {event.flyer ? (

              <img
                src={event.flyer}
                alt={`${event.title} flyer`}
                loading="lazy"
              />

            ) : (

              <div className="upcoming-event-flyer-placeholder">

                <CalendarDays
                  size={34}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <span>
                  Event Flyer
                </span>

              </div>

            )}

          </div>


          {/* CONTENT */}

          <div className="upcoming-event-content">

            <div className="upcoming-event-badges">

              <span className="upcoming-event-status">
                Upcoming Event
              </span>

              <span className="upcoming-event-category">
                {event.category_label}
              </span>

            </div>


            <h3>
              {event.title}
            </h3>


            <p className="upcoming-event-summary">
              {event.short_summary}
            </p>


            {/* META */}

            <div className="upcoming-event-meta">

              {event.event_date && (

                <div className="upcoming-event-meta-item">

                  <CalendarDays
                    size={17}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <div>
                    <span>
                      Date
                    </span>

                    <strong>
                      {event.event_date}
                    </strong>
                  </div>

                </div>

              )}


              {event.event_time && (

                <div className="upcoming-event-meta-item">

                  <Clock3
                    size={17}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <div>
                    <span>
                      Time
                    </span>

                    <strong>
                      {event.event_time}
                    </strong>
                  </div>

                </div>

              )}


              {(event.venue ||
                event.format_label) && (

                <div className="upcoming-event-meta-item">

                  <MapPin
                    size={17}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <div>
                    <span>
                      Location
                    </span>

                    <strong>
                      {event.venue ||
                        event.format_label}
                    </strong>
                  </div>

                </div>

              )}

            </div>


            {/* FUTURE DETAILS PAGE */}

            <button
              type="button"
              className="upcoming-event-details-button"
            >
              View Event Details

              <ArrowRight
                size={16}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </button>

          </div>

        </article>

      </div>

    </section>
  );
};

export default UpcomingEvent;