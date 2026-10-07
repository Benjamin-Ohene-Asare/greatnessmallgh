import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
  CalendarDays,
  MapPin,
  Clock3,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  deleteAdminEvent,
  getAdminEvents,
  updateAdminEvent,
} from "../../../../services/backend";

import "./AdminEvents.css";


const formatDate = (
  value
) => {
  if (!value) {
    return "Date not set";
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
};


const formatTime = (
  value
) => {
  if (!value) {
    return "Time not set";
  }

  const [
    hours,
    minutes,
  ] = value.split(":");

  const date =
    new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date);
};


const formatUpdatedDate = (
  value
) => {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
};


const AdminEvents = () => {
  const [
    events,
    setEvents,
  ] = useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    openMenu,
    setOpenMenu,
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
    actionLoadingId,
    setActionLoadingId,
  ] = useState(null);


  // Load events from Django
  useEffect(() => {
    let cancelled = false;

    const loadEvents =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getAdminEvents();

          if (cancelled) {
            return;
          }

          setEvents(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load events:",
            err
          );

          if (!cancelled) {
            setError(
              err.message ||
                "Events could not be loaded."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);


  const filteredEvents =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return events.filter(
        (event) => {
          const status =
            event.is_published
              ? "Published"
              : "Draft";

          const matchesSearch =
            !search ||
            event.title
              ?.toLowerCase()
              .includes(search) ||
            event.venue
              ?.toLowerCase()
              .includes(search) ||
            event.category_label
              ?.toLowerCase()
              .includes(search);

          const matchesStatus =
            statusFilter ===
              "All" ||
            status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      events,
      searchTerm,
      statusFilter,
    ]);


  // Publish or move event to draft
  const togglePublish =
    async (
      event
    ) => {
      try {
        setActionLoadingId(
          event.id
        );

        const formData =
          new FormData();

        formData.append(
          "is_published",
          String(
            !event.is_published
          )
        );

        const updated =
          await updateAdminEvent(
            event.id,
            formData
          );

        setEvents(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                event.id
                  ? {
                      ...item,
                      ...updated,
                    }
                  : item
            )
        );

        setOpenMenu(null);
      } catch (err) {
        console.error(
          "Failed to update event status:",
          err
        );

        window.alert(
          err.message ||
            "Could not update the event."
        );
      } finally {
        setActionLoadingId(
          null
        );
      }
    };


  // Delete an event
  const deleteEvent =
    async (
      event
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${event.title}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoadingId(
          event.id
        );

        await deleteAdminEvent(
          event.id
        );

        setEvents(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                event.id
            )
        );

        setOpenMenu(null);
      } catch (err) {
        console.error(
          "Failed to delete event:",
          err
        );

        window.alert(
          err.message ||
            "Could not delete the event."
        );
      } finally {
        setActionLoadingId(
          null
        );
      }
    };


  return (
    <div className="admin-events-page">

      <div className="admin-events-header">

        <div>

          <span className="admin-events-eyebrow">
            EVENT MANAGEMENT
          </span>

          <h1>
            Events
          </h1>

          <p>
            Manage upcoming programs, training sessions and events.
          </p>

        </div>


        <NavLink
          to="/admin/events/add"
          className="admin-add-event-button"
        >
          <Plus
            size={17}
            strokeWidth={1.8}
          />

          Add Event
        </NavLink>

      </div>


      <div className="admin-events-summary">

        <div className="admin-event-summary-card">

          <div className="admin-event-summary-icon">
            <CalendarDays
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Total Events
            </span>

            <strong>
              {events.length}
            </strong>
          </div>

        </div>


        <div className="admin-event-summary-card">

          <div className="admin-event-summary-icon published">
            <Eye
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Published
            </span>

            <strong>
              {
                events.filter(
                  (event) =>
                    event.is_published
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="admin-event-summary-card">

          <div className="admin-event-summary-icon draft">
            <CalendarDays
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Drafts
            </span>

            <strong>
              {
                events.filter(
                  (event) =>
                    !event.is_published
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      <div className="admin-events-toolbar">

        <div className="admin-events-search">

          <Search
            size={17}
            strokeWidth={1.7}
          />

          <input
            type="search"
            placeholder="Search events..."
            value={
              searchTerm
            }
            onChange={(
              event
            ) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <select
          className="admin-events-status-filter"
          value={
            statusFilter
          }
          onChange={(
            event
          ) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Published">
            Published
          </option>

          <option value="Draft">
            Draft
          </option>
        </select>

      </div>


      {loading ? (

        <div className="admin-events-empty">

          <CalendarDays
            size={35}
            strokeWidth={1.5}
          />

          <h2>
            Loading events...
          </h2>

        </div>

      ) : error ? (

        <div
          className="admin-events-empty"
          role="alert"
        >

          <CalendarDays
            size={35}
            strokeWidth={1.5}
          />

          <h2>
            Events unavailable
          </h2>

          <p>
            {error}
          </p>

        </div>

      ) : (

        <>
          <div className="admin-events-grid">

            {filteredEvents.map(
              (event) => {
                const status =
                  event.is_published
                    ? "Published"
                    : "Draft";

                const isWorking =
                  actionLoadingId ===
                  event.id;

                return (
                  <article
                    key={
                      event.id
                    }
                    className="admin-event-card"
                  >

                    <div className="admin-event-flyer">

                      {event.flyer ? (

                        <img
                          src={
                            event.flyer
                          }
                          alt={
                            event.title
                          }
                          loading="lazy"
                        />

                      ) : (

                        <div className="admin-event-flyer-empty">

                          <CalendarDays
                            size={30}
                            strokeWidth={1.5}
                          />

                          <span>
                            Event Flyer
                          </span>

                        </div>

                      )}


                      <span
                        className={
                          status ===
                          "Published"
                            ? "admin-event-status published"
                            : "admin-event-status draft"
                        }
                      >
                        {status}
                      </span>

                    </div>


                    <div className="admin-event-card-content">

                      <span className="admin-event-format">
                        {
                          event.format_label ||
                          event.event_format
                        }
                      </span>


                      <h2>
                        {event.title}
                      </h2>


                      <div className="admin-event-meta">

                        <div>
                          <CalendarDays
                            size={15}
                            strokeWidth={1.7}
                          />

                          <span>
                            {
                              formatDate(
                                event.event_date
                              )
                            }
                          </span>
                        </div>


                        <div>
                          <Clock3
                            size={15}
                            strokeWidth={1.7}
                          />

                          <span>
                            {
                              formatTime(
                                event.event_time
                              )
                            }
                          </span>
                        </div>


                        <div>
                          <MapPin
                            size={15}
                            strokeWidth={1.7}
                          />

                          <span>
                            {event.venue ||
                              event.format_label ||
                              "Venue not set"}
                          </span>
                        </div>

                      </div>


                      <div className="admin-event-footer">

                        <span>
                          Updated{" "}
                          {
                            formatUpdatedDate(
                              event.updated_at
                            )
                          }
                        </span>


                        <div className="admin-event-actions">


                          <NavLink
                            to={
                              `/events/${event.slug}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-event-action-button"
                            aria-label={
                              `Preview ${event.title}`
                            }
                          >
                            <Eye
                              size={15}
                              strokeWidth={1.7}
                            />
                          </NavLink>


                          <NavLink
                            to={
                              `/admin/events/${event.id}/edit`
                            }
                            className="admin-event-action-button"
                            aria-label={
                              `Edit ${event.title}`
                            }
                          >
                            <Pencil
                              size={15}
                              strokeWidth={1.7}
                            />
                          </NavLink>


                          <div className="admin-event-more-wrapper">

                            <button
                              type="button"
                              className="admin-event-action-button"
                              disabled={
                                isWorking
                              }
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    event.id
                                    ? null
                                    : event.id
                                )
                              }
                              aria-label={
                                `More actions for ${event.title}`
                              }
                            >
                              <MoreVertical
                                size={16}
                                strokeWidth={1.7}
                              />
                            </button>


                            {openMenu ===
                              event.id && (

                              <div className="admin-event-action-menu">

                                <button
                                  type="button"
                                  disabled={
                                    isWorking
                                  }
                                  onClick={() =>
                                    togglePublish(
                                      event
                                    )
                                  }
                                >
                                  {isWorking
                                    ? "Updating..."
                                    : status ===
                                        "Published"
                                      ? "Move to Draft"
                                      : "Publish Event"}
                                </button>


                                <button
                                  type="button"
                                  className="danger"
                                  disabled={
                                    isWorking
                                  }
                                  onClick={() =>
                                    deleteEvent(
                                      event
                                    )
                                  }
                                >
                                  <Trash2
                                    size={14}
                                    strokeWidth={1.7}
                                  />

                                  Delete Event
                                </button>

                              </div>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>


          {filteredEvents.length ===
            0 && (

            <div className="admin-events-empty">

              <CalendarDays
                size={35}
                strokeWidth={1.5}
              />

              <h2>
                No events found
              </h2>

              <p>
                Try another search or create a new event.
              </p>

            </div>

          )}
        </>

      )}

    </div>
  );
};


export default AdminEvents;