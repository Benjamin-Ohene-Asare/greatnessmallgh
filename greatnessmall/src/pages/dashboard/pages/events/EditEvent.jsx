import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import EventForm from "./EventForm";

import {
  getAdminEvent,
  updateAdminEvent,
} from "../../../../services/backend";


const EditEvent = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [
    eventData,
    setEventData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    let cancelled = false;

    const loadEvent =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getAdminEvent(
              id
            );

          if (cancelled) {
            return;
          }

          setEventData({
            id:
              data.id,

            title:
              data.title || "",

            category:
              data.category ||
              "Training",

            summary:
              data.short_summary ||
              "",

            details:
              data.full_details ||
              "",

            date:
              data.event_date ||
              "",

            time:
              data.event_time ||
              "",

            venue:
              data.venue ||
              "",

            format:
              data.event_format ||
              "Both",

            host:
              data.host_name ||
              "",

            meetingPlatform:
              data.meeting_platform ||
              "",

            meetingLink:
              data.meeting_link ||
              "",

            meetingCode:
              data.meeting_code ||
              "",

            flyerPreview:
              data.flyer ||
              "",

            published:
              Boolean(
                data.is_published
              ),

            displayOrder:
              data.display_order ??
              0,
          });
        } catch (err) {
          console.error(
            "Failed to load event:",
            err
          );

          if (!cancelled) {
            setError(
              err.message ||
                "The selected event could not be loaded."
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
  }, [id]);


  const handleUpdateEvent =
    async (
      updatedData
    ) => {
      const formData =
        new FormData();

      formData.append(
        "title",
        updatedData.title
      );

      formData.append(
        "category",
        updatedData.category
      );

      formData.append(
        "short_summary",
        updatedData.summary
      );

      formData.append(
        "full_details",
        updatedData.details
      );

      formData.append(
        "event_date",
        updatedData.date
      );

      formData.append(
        "event_time",
        updatedData.time
      );

      formData.append(
        "venue",
        updatedData.venue
      );

      formData.append(
        "event_format",
        updatedData.format
      );

      formData.append(
        "host_name",
        updatedData.host
      );

      formData.append(
        "meeting_platform",
        updatedData.meetingPlatform
      );

      formData.append(
        "meeting_link",
        updatedData.meetingLink
      );

      formData.append(
        "meeting_code",
        updatedData.meetingCode
      );

      formData.append(
        "is_published",
        String(
          updatedData.published
        )
      );

      formData.append(
        "display_order",
        String(
          updatedData.displayOrder ||
          0
        )
      );


      if (
        updatedData.flyer
      ) {
        formData.append(
          "flyer",
          updatedData.flyer
        );
      }


      await updateAdminEvent(
        id,
        formData
      );

      navigate(
        "/admin/events",
        {
          replace: true,
        }
      );
    };


  if (loading) {
    return (
      <div className="admin-editor-not-found">

        <h1>
          Loading Event
        </h1>

        <p>
          Please wait while the event is being loaded.
        </p>

      </div>
    );
  }


  if (
    error ||
    !eventData
  ) {
    return (
      <div className="admin-editor-not-found">

        <h1>
          Event Not Found
        </h1>

        <p>
          {error ||
            "The selected event could not be found."}
        </p>

      </div>
    );
  }


  return (
    <EventForm
      mode="edit"
      initialData={
        eventData
      }
      onSubmit={
        handleUpdateEvent
      }
    />
  );
};


export default EditEvent;