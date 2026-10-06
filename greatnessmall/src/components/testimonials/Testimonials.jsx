import React, { useState } from "react";
import {
    Play,
    Pause,
    Volume2,
    Quote,
    PlayCircle,
} from "lucide-react";

import Modal from "../modal/Modal";
import "./Testimonials.css";

/* =========================================================
   TEMPORARY TESTIMONIAL DATA

   Later Django/Admin will provide:
   - screenshot / thumbnail
   - video
   - audio
   - customer name
   - short description
   - published status

   SECURITY:
   Media paths are application-controlled for now.
   Later Django must validate uploaded media files.
========================================================= */

const videoTestimonials = [
    {
        id: 1,
        name: "Customer Testimonial",
        quote: "A customer shares their experience with Greatness Mall.",
        video: "/testimonials/testimonial-1.mp4",
        thumbnail: "/testimonials/testimonial-1.jpg",
    },

    {
        id: 2,
        name: "Customer Testimonial",
        quote: "Hear directly from another Greatness Mall customer.",
        video: "/testimonials/testimonial-2.mp4",
        thumbnail: "/testimonials/testimonial-2.jpg",
    },
];

const imageTestimonials = [
    {
        id: 1,
        name: "Customer Feedback",
        image: "/testimonials/image-1.jpg",
        quote: "A screenshot shared by one of our customers.",
    },
    {
        id: 2,
        name: "Customer Feedback",
        image: "/testimonials/image-2.jpg",
        quote: "Another customer experience shared with Greatness Mall.",
    },
];

const audioTestimonials = [
    {
        id: 1,
        name: "Customer Voice",
        quote: "Listen to this customer's experience.",
        audio: "/testimonials/testimonial-1.mp3",
    },

    {
        id: 2,
        name: "Customer Voice",
        quote: "Another customer shares their experience.",
        audio: "/testimonials/testimonial-2.mp3",
    },
];

const Testimonials = () => {
    const [activeTab, setActiveTab] = useState("video");

    const [selectedVideo, setSelectedVideo] = useState(null);

    const [playingAudio, setPlayingAudio] = useState(null);
const [selectedImage, setSelectedImage] = useState(null);


    /* =========================================================
       VIDEO MODAL
    ========================================================= */

    const openVideo = (testimonial) => {
        setSelectedVideo(testimonial);
    };

    const closeVideo = () => {
        setSelectedVideo(null);
    };

    /* =========================================================
       AUDIO CONTROL
    ========================================================= */

    const handleAudioToggle = (id) => {
        const audio = document.getElementById(
            `testimonial-audio-${id}`
        );

        if (!audio) {
            return;
        }

        document
            .querySelectorAll(".testimonial-audio-element")
            .forEach((item) => {
                if (item !== audio) {
                    item.pause();
                    item.currentTime = 0;
                }
            });

        if (audio.paused) {
            audio.play();
            setPlayingAudio(id);
        } else {
            audio.pause();
            setPlayingAudio(null);
        }
    };

    return (
        <>
            <section className="testimonials-section">

                <div className="testimonials-container">

                    {/* HEADER */}

                    <div className="testimonials-header">

                        <span className="testimonials-label">
                            TESTIMONIALS
                        </span>

                        <h2>
                            Hear From Our Customers
                        </h2>

                        <p>
                            Real experiences shared by our customers.
                        </p>

                    </div>


                    {/* TESTIMONIAL SWITCHER */}

                    <div className="testimonial-tabs">

                        <button
                            type="button"
                            className={
                                activeTab === "video"
                                    ? "testimonial-tab active"
                                    : "testimonial-tab"
                            }
                            onClick={() => setActiveTab("video")}
                        >
                            Video
                        </button>

                        <button
                            type="button"
                            className={
                                activeTab === "image"
                                    ? "testimonial-tab active"
                                    : "testimonial-tab"
                            }
                            onClick={() => setActiveTab("image")}
                        >
                            Images
                        </button>

                        <button
                            type="button"
                            className={
                                activeTab === "audio"
                                    ? "testimonial-tab active"
                                    : "testimonial-tab"
                            }
                            onClick={() => setActiveTab("audio")}
                        >
                            Audio
                        </button>

                    </div>


                    {/* =============================================
              VIDEO TESTIMONIALS
          ============================================== */}

                    {activeTab === "video" && (
                        <div className="video-testimonial-grid">

                            {videoTestimonials.map((testimonial) => (

                                <article
                                    key={testimonial.id}
                                    className="video-testimonial-card"
                                >

                                    {/* SCREENSHOT / THUMBNAIL */}

                                    <button
                                        type="button"
                                        className="testimonial-thumbnail-button"
                                        onClick={() => openVideo(testimonial)}
                                        aria-label={`View ${testimonial.name}`}
                                    >

                                        <img
                                            src={testimonial.thumbnail}
                                            alt={testimonial.name}
                                            className="testimonial-thumbnail"
                                            loading="lazy"
                                        />

                                        <span className="testimonial-thumbnail-overlay">

                                            <span className="testimonial-play-icon">

                                                <PlayCircle
                                                    size={38}
                                                    strokeWidth={1.6}
                                                    aria-hidden="true"
                                                />

                                            </span>

                                        </span>

                                    </button>


                                    {/* TESTIMONIAL DETAILS */}

                                    <div className="testimonial-card-content">

                                        <Quote
                                            size={18}
                                            strokeWidth={1.7}
                                            className="testimonial-quote-icon"
                                            aria-hidden="true"
                                        />

                                        <p>
                                            {testimonial.quote}
                                        </p>

                                        <div className="testimonial-card-footer">

                                            <span>
                                                {testimonial.name}
                                            </span>

                                            <button
                                                type="button"
                                                className="view-testimonial-button"
                                                onClick={() => openVideo(testimonial)}
                                            >
                                                View Testimonial
                                            </button>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>
                    )}

                    {/* =============================================
    IMAGE TESTIMONIALS
============================================== */}

                    {activeTab === "image" && (
                        <div className="image-testimonial-grid">

                            {imageTestimonials.map((testimonial) => (

                                <article
                                    key={testimonial.id}
                                    className="image-testimonial-card"
                                >

                                    <button
                                        type="button"
                                        className="image-testimonial-preview"
                                        onClick={() => setSelectedImage(testimonial)}
                                        aria-label={`View ${testimonial.name}`}
                                    >

                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            loading="lazy"
                                        />

                                    </button>

                                    <div className="image-testimonial-content">

                                        <h3>
                                            {testimonial.name}
                                        </h3>

                                        <p>
                                            {testimonial.quote}
                                        </p>

                                        <button
                                            type="button"
                                            className="view-testimonial-button"
                                            onClick={() => setSelectedImage(testimonial)}
                                        >
                                            View
                                        </button>

                                    </div>

                                </article>

                            ))}

                        </div>
                    )}



                    {/* =============================================
              AUDIO TESTIMONIALS
          ============================================== */}

                    {activeTab === "audio" && (
                        <div className="audio-testimonial-list">

                            {audioTestimonials.map((testimonial) => (

                                <article
                                    key={testimonial.id}
                                    className="audio-testimonial-card"
                                >

                                    <button
                                        type="button"
                                        className="audio-play-button"
                                        onClick={() =>
                                            handleAudioToggle(testimonial.id)
                                        }
                                        aria-label={
                                            playingAudio === testimonial.id
                                                ? "Pause testimonial"
                                                : "Play testimonial"
                                        }
                                    >

                                        {playingAudio === testimonial.id ? (
                                            <Pause size={18} />
                                        ) : (
                                            <Play size={18} />
                                        )}

                                    </button>


                                    <div className="audio-testimonial-content">

                                        <span>
                                            {testimonial.name}
                                        </span>

                                        <p>
                                            {testimonial.quote}
                                        </p>

                                    </div>


                                    <Volume2
                                        size={18}
                                        className="audio-volume-icon"
                                        aria-hidden="true"
                                    />


                                    <audio
                                        id={`testimonial-audio-${testimonial.id}`}
                                        className="testimonial-audio-element"
                                        src={testimonial.audio}
                                        preload="metadata"
                                        onEnded={() => setPlayingAudio(null)}
                                    />

                                </article>

                            ))}

                        </div>
                    )}

                </div>

            </section>


            {/* ===============================================
          VIDEO MODAL
      ================================================ */}

            {selectedVideo && (
                <Modal
                    isOpen={Boolean(selectedVideo)}
                    onClose={closeVideo}
                >

                    <div className="testimonial-modal-content">

                        <video
                            className="testimonial-modal-video"
                            controls
                            autoPlay
                            preload="metadata"
                        >
                            <source
                                src={selectedVideo.video}
                                type="video/mp4"
                            />

                            Your browser does not support video playback.
                        </video>

                        <div className="testimonial-modal-details">

                            <span>
                                TESTIMONIAL
                            </span>

                            <h3>
                                {selectedVideo.name}
                            </h3>

                            <p>
                                {selectedVideo.quote}
                            </p>

                        </div>

                    </div>

                </Modal>
            )}


            {selectedImage && (
  <Modal
    isOpen={Boolean(selectedImage)}
    onClose={() => setSelectedImage(null)}
  >

    <div className="testimonial-image-modal">

      <img
        src={selectedImage.image}
        alt={selectedImage.name}
      />

      <div className="testimonial-modal-details">

        <span>
          TESTIMONIAL
        </span>

        <h3>
          {selectedImage.name}
        </h3>

        <p>
          {selectedImage.quote}
        </p>

      </div>

    </div>

  </Modal>
)}

        </>
    );
};

export default Testimonials;