import React from "react";

import {
  useNavigate,
} from "react-router-dom";

import EventForm from "./EventForm";

import {
  createAdminEvent,
} from "../../../../services/backend";


const AddEvent = () => {
  const navigate =
    useNavigate();


  const handleAddEvent =
    async (
      eventData
    ) => {
      const formData =
        new FormData();

      formData.append(
        "title",
        eventData.title
      );

      formData.append(
        "category",
        eventData.category
      );

      formData.append(
        "short_summary",
        eventData.summary
      );

      formData.append(
        "full_details",
        eventData.details
      );

      formData.append(
        "event_date",
        eventData.date
      );

      formData.append(
        "event_time",
        eventData.time
      );

      formData.append(
        "venue",
        eventData.venue
      );

      formData.append(
        "event_format",
        eventData.format
      );

      formData.append(
        "host_name",
        eventData.host
      );

      formData.append(
        "meeting_platform",
        eventData.meetingPlatform
      );

      formData.append(
        "meeting_link",
        eventData.meetingLink
      );

      formData.append(
        "meeting_code",
        eventData.meetingCode
      );

      formData.append(
        "is_published",
        String(
          eventData.published
        )
      );

      formData.append(
        "display_order",
        String(
          eventData.displayOrder ||
          0
        )
      );


      if (
        eventData.flyer
      ) {
        formData.append(
          "flyer",
          eventData.flyer
        );
      }


      await createAdminEvent(
        formData
      );


      navigate(
        "/admin/events",
        {
          replace: true,
        }
      );
    };


  return (
    <EventForm
      mode="add"
      onSubmit={
        handleAddEvent
      }
    />
  );
};


export default AddEvent;