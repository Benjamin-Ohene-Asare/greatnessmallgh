import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Play,
    Pause,
    Volume2,
    Quote,
    PlayCircle,
} from "lucide-react";

import {
    getTestimonials,
} from "../../services/backend";

import Modal from "../modal/Modal";

import "./Testimonials.css";

const getYouTubeEmbedUrl = (url = "") => {
  try {
    const parsedUrl = new URL(url);

    let videoId = "";

    if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.replace("/", "");
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      videoId = parsedUrl.searchParams.get("v");

      if (
        !videoId &&
        parsedUrl.pathname.startsWith("/embed/")
      ) {
        videoId = parsedUrl.pathname.split("/embed/")[1];
      }

      if (
        !videoId &&
        parsedUrl.pathname.startsWith("/shorts/")
      ) {
        videoId = parsedUrl.pathname.split("/shorts/")[1];
      }
    }

    if (!videoId) {
      return "";
    }

    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
      videoId
    )}?autoplay=1&rel=0`;
  } catch {
    return "";
  }
};


const Testimonials = () => {
    const [
        testimonials,
        setTestimonials,
    ] = useState([]);

    const [
        activeTab,
        setActiveTab,
    ] = useState("video");

    const [
        selectedVideo,
        setSelectedVideo,
    ] = useState(null);

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(null);

    const [
        playingAudio,
        setPlayingAudio,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");


    // Load published testimonials from Django
    useEffect(() => {
        let cancelled = false;

        const loadTestimonials =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const data =
                        await getTestimonials();

                    if (cancelled) {
                        return;
                    }

                    setTestimonials(
                        Array.isArray(data)
                            ? data
                            : []
                    );
                } catch (err) {
                    console.error(
                        "Failed to load testimonials:",
                        err
                    );

                    if (!cancelled) {
                        setError(
                            "Testimonials are temporarily unavailable."
                        );
                    }
                } finally {
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            };

        loadTestimonials();

        return () => {
            cancelled = true;
        };
    }, []);


    const videoTestimonials =
        useMemo(
            () =>
                testimonials.filter(
                    (item) =>
                        item.testimonial_type ===
                        "video"
                ),
            [testimonials]
        );


    const imageTestimonials =
        useMemo(
            () =>
                testimonials.filter(
                    (item) =>
                        item.testimonial_type ===
                        "image"
                ),
            [testimonials]
        );


    const audioTestimonials =
        useMemo(
            () =>
                testimonials.filter(
                    (item) =>
                        item.testimonial_type ===
                        "audio"
                ),
            [testimonials]
        );


    const openVideo = (
        testimonial
    ) => {
        setSelectedVideo(
            testimonial
        );
    };


    const closeVideo = () => {
        setSelectedVideo(null);
    };


    const handleAudioToggle = (
        id
    ) => {
        const audio =
            document.getElementById(
                `testimonial-audio-${id}`
            );

        if (!audio) {
            return;
        }

        document
            .querySelectorAll(
                ".testimonial-audio-element"
            )
            .forEach((item) => {
                if (item !== audio) {
                    item.pause();
                    item.currentTime = 0;
                }
            });

        if (audio.paused) {
            const playPromise =
                audio.play();

            if (
                playPromise &&
                typeof playPromise.catch ===
                "function"
            ) {
                playPromise.catch(
                    (err) => {
                        console.error(
                            "Audio playback failed:",
                            err
                        );

                        setPlayingAudio(
                            null
                        );
                    }
                );
            }

            setPlayingAudio(id);
        } else {
            audio.pause();

            setPlayingAudio(null);
        }
    };


    const getVideoSource = (
        testimonial
    ) => {
        return (
            testimonial.video_file ||
            testimonial.video_url ||
            ""
        );
    };


    const activeTestimonials =
        activeTab === "video"
            ? videoTestimonials
            : activeTab === "image"
                ? imageTestimonials
                : audioTestimonials;


    return (
        <>

            <section className="testimonials-section">

                <div className="testimonials-container">


                    {/* Header */}

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


                    {/* Testimonial switcher */}

                    <div className="testimonial-tabs">

                        <button
                            type="button"
                            className={
                                activeTab === "video"
                                    ? "testimonial-tab active"
                                    : "testimonial-tab"
                            }
                            onClick={() =>
                                setActiveTab("video")
                            }
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
                            onClick={() =>
                                setActiveTab("image")
                            }
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
                            onClick={() =>
                                setActiveTab("audio")
                            }
                        >
                            Audio
                        </button>

                    </div>


                    {loading && (

                        <div className="testimonial-empty-state">
                            Loading testimonials...
                        </div>

                    )}


                    {!loading &&
                        error && (

                            <div
                                className="testimonial-empty-state"
                                role="alert"
                            >
                                {error}
                            </div>

                        )}


                    {!loading &&
                        !error &&
                        activeTestimonials.length ===
                        0 && (

                            <div className="testimonial-empty-state">
                                No {activeTab} testimonials are available yet.
                            </div>

                        )}


                    {/* Video testimonials */}

                    {!loading &&
                        !error &&
                        activeTab === "video" &&
                        videoTestimonials.length >
                        0 && (

                            <div className="video-testimonial-grid">

                                {videoTestimonials.map(
                                    (testimonial) => (

                                        <article
                                            key={
                                                testimonial.id
                                            }
                                            className="video-testimonial-card"
                                        >

                                            <button
                                                type="button"
                                                className="testimonial-thumbnail-button"
                                                onClick={() =>
                                                    openVideo(
                                                        testimonial
                                                    )
                                                }
                                                aria-label={
                                                    `View ${testimonial.customer_name}`
                                                }
                                            >

                                                {testimonial.thumbnail ? (

                                                    <img
                                                        src={
                                                            testimonial.thumbnail
                                                        }
                                                        alt={
                                                            testimonial.customer_name
                                                        }
                                                        className="testimonial-thumbnail"
                                                        loading="lazy"
                                                    />

                                                ) : (

                                                    <div className="testimonial-thumbnail testimonial-thumbnail-placeholder">

                                                        <PlayCircle
                                                            size={42}
                                                            strokeWidth={1.5}
                                                            aria-hidden="true"
                                                        />

                                                    </div>

                                                )}


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


                                            <div className="testimonial-card-content">

                                                <Quote
                                                    size={18}
                                                    strokeWidth={1.7}
                                                    className="testimonial-quote-icon"
                                                    aria-hidden="true"
                                                />

                                                {testimonial.message && (
                                                    <p>
                                                        {
                                                            testimonial.message
                                                        }
                                                    </p>
                                                )}


                                                <div className="testimonial-card-footer">

                                                    <span>
                                                        {
                                                            testimonial.customer_name
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="view-testimonial-button"
                                                        onClick={() =>
                                                            openVideo(
                                                                testimonial
                                                            )
                                                        }
                                                    >
                                                        View Testimonial
                                                    </button>

                                                </div>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        )}


                    {/* Image testimonials */}

                    {!loading &&
                        !error &&
                        activeTab === "image" &&
                        imageTestimonials.length >
                        0 && (

                            <div className="image-testimonial-grid">

                                {imageTestimonials.map(
                                    (testimonial) => (

                                        <article
                                            key={
                                                testimonial.id
                                            }
                                            className="image-testimonial-card"
                                        >

                                            <button
                                                type="button"
                                                className="image-testimonial-preview"
                                                onClick={() =>
                                                    setSelectedImage(
                                                        testimonial
                                                    )
                                                }
                                                aria-label={
                                                    `View ${testimonial.customer_name}`
                                                }
                                            >

                                                <img
                                                    src={
                                                        testimonial.image
                                                    }
                                                    alt={
                                                        testimonial.customer_name
                                                    }
                                                    loading="lazy"
                                                />

                                            </button>


                                            <div className="image-testimonial-content">

                                                <h3>
                                                    {
                                                        testimonial.customer_name
                                                    }
                                                </h3>

                                                {testimonial.message && (
                                                    <p>
                                                        {
                                                            testimonial.message
                                                        }
                                                    </p>
                                                )}

                                                <button
                                                    type="button"
                                                    className="view-testimonial-button"
                                                    onClick={() =>
                                                        setSelectedImage(
                                                            testimonial
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        )}


                    {/* Audio testimonials */}

                    {!loading &&
                        !error &&
                        activeTab === "audio" &&
                        audioTestimonials.length >
                        0 && (

                            <div className="audio-testimonial-list">

                                {audioTestimonials.map(
                                    (testimonial) => (

                                        <article
                                            key={
                                                testimonial.id
                                            }
                                            className="audio-testimonial-card"
                                        >

                                            <button
                                                type="button"
                                                className="audio-play-button"
                                                onClick={() =>
                                                    handleAudioToggle(
                                                        testimonial.id
                                                    )
                                                }
                                                aria-label={
                                                    playingAudio ===
                                                        testimonial.id
                                                        ? "Pause testimonial"
                                                        : "Play testimonial"
                                                }
                                            >

                                                {playingAudio ===
                                                    testimonial.id ? (

                                                    <Pause
                                                        size={18}
                                                        aria-hidden="true"
                                                    />

                                                ) : (

                                                    <Play
                                                        size={18}
                                                        aria-hidden="true"
                                                    />

                                                )}

                                            </button>


                                            <div className="audio-testimonial-content">

                                                <span>
                                                    {
                                                        testimonial.customer_name
                                                    }
                                                </span>

                                                {testimonial.message && (
                                                    <p>
                                                        {
                                                            testimonial.message
                                                        }
                                                    </p>
                                                )}

                                            </div>


                                            <Volume2
                                                size={18}
                                                className="audio-volume-icon"
                                                aria-hidden="true"
                                            />


                                            <audio
                                                id={
                                                    `testimonial-audio-${testimonial.id}`
                                                }
                                                className="testimonial-audio-element"
                                                src={
                                                    testimonial.audio_file
                                                }
                                                preload="metadata"
                                                onEnded={() =>
                                                    setPlayingAudio(
                                                        null
                                                    )
                                                }
                                                onPause={() => {
                                                    if (
                                                        playingAudio ===
                                                        testimonial.id
                                                    ) {
                                                        setPlayingAudio(
                                                            null
                                                        );
                                                    }
                                                }}
                                            />

                                        </article>

                                    )
                                )}

                            </div>

                        )}

                </div>

            </section>


            {/* Video modal */}

            {selectedVideo && (

                <Modal
                    isOpen={
                        Boolean(
                            selectedVideo
                        )
                    }
                    onClose={
                        closeVideo
                    }
                >

                    <div className="testimonial-modal-content">

                        {selectedVideo.video_file ? (

                            <video
                                className="testimonial-modal-video"
                                controls
                                autoPlay
                                preload="metadata"
                                poster={
                                    selectedVideo.thumbnail ||
                                    undefined
                                }
                            >
                                <source
                                    src={
                                        selectedVideo.video_file
                                    }
                                />

                                Your browser does not support video playback.

                            </video>

                        ) : getYouTubeEmbedUrl(
                            selectedVideo.video_url
                        ) ? (

                            <div className="testimonial-youtube-wrapper">

                                <iframe
                                    src={
                                        getYouTubeEmbedUrl(
                                            selectedVideo.video_url
                                        )
                                    }
                                    title={
                                        `${selectedVideo.customer_name} testimonial`
                                    }
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                />

                            </div>

                        ) : (

                            <div className="testimonial-empty-state">
                                Video unavailable.
                            </div>

                        )}


                        <div className="testimonial-modal-details">

                            <span>
                                TESTIMONIAL
                            </span>

                            <h3>
                                {
                                    selectedVideo.customer_name
                                }
                            </h3>

                            {selectedVideo.customer_title && (
                                <strong>
                                    {
                                        selectedVideo.customer_title
                                    }
                                </strong>
                            )}

                            {selectedVideo.message && (
                                <p>
                                    {
                                        selectedVideo.message
                                    }
                                </p>
                            )}

                        </div>

                    </div>

                </Modal>

            )}


            {/* Image modal */}

            {selectedImage && (

                <Modal
                    isOpen={
                        Boolean(
                            selectedImage
                        )
                    }
                    onClose={() =>
                        setSelectedImage(
                            null
                        )
                    }
                >

                    <div className="testimonial-image-modal">

                        <img
                            src={
                                selectedImage.image
                            }
                            alt={
                                selectedImage.customer_name
                            }
                        />


                        <div className="testimonial-modal-details">

                            <span>
                                TESTIMONIAL
                            </span>

                            <h3>
                                {
                                    selectedImage.customer_name
                                }
                            </h3>

                            {selectedImage.customer_title && (
                                <strong>
                                    {
                                        selectedImage.customer_title
                                    }
                                </strong>
                            )}

                            {selectedImage.message && (
                                <p>
                                    {
                                        selectedImage.message
                                    }
                                </p>
                            )}

                        </div>

                    </div>

                </Modal>

            )}

        </>
    );
};


export default Testimonials;