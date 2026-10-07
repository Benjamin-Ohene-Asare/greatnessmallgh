import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Play,
  Volume2,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

import {
  getTwiContent,
} from "../../services/backend";

import "./Twi.css";


const getYouTubeVideoId = (
  url = ""
) => {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl =
      new URL(url);

    const hostname =
      parsedUrl.hostname
        .replace(
          /^www\./,
          ""
        )
        .toLowerCase();

    if (
      hostname === "youtu.be"
    ) {
      return (
        parsedUrl.pathname
          .split("/")
          .filter(Boolean)[0] ||
        null
      );
    }

    if (
      hostname ===
        "youtube.com" ||
      hostname ===
        "m.youtube.com"
    ) {
      const watchId =
        parsedUrl.searchParams.get(
          "v"
        );

      if (watchId) {
        return watchId;
      }

      if (
        parsedUrl.pathname.startsWith(
          "/embed/"
        )
      ) {
        return (
          parsedUrl.pathname
            .split("/embed/")[1]
            ?.split("/")[0] ||
          null
        );
      }

      if (
        parsedUrl.pathname.startsWith(
          "/shorts/"
        )
      ) {
        return (
          parsedUrl.pathname
            .split("/shorts/")[1]
            ?.split("/")[0] ||
          null
        );
      }
    }

    return null;
  } catch {
    return null;
  }
};


const Twi = () => {
  const [
    twiContent,
    setTwiContent,
  ] = useState([]);

  const [
    activeType,
    setActiveType,
  ] = useState("video");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  const filters = [
    {
      value: "video",
      label: "Videos",
      icon: Play,
    },

    {
      value: "audio",
      label: "Audio",
      icon: Volume2,
    },

    {
      value: "image",
      label: "Images",
      icon: ImageIcon,
    },
  ];


  // Load published Twi content from Django
  useEffect(() => {
    let cancelled = false;

    const loadContent =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getTwiContent();

          if (cancelled) {
            return;
          }

          setTwiContent(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load Twi content:",
            err
          );

          if (!cancelled) {
            setError(
              "Twi content is temporarily unavailable."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadContent();

    return () => {
      cancelled = true;
    };
  }, []);


  const filteredContent =
    useMemo(
      () =>
        twiContent.filter(
          (item) =>
            item.content_type ===
            activeType
        ),
      [
        activeType,
        twiContent,
      ]
    );


  return (
    <main className="twi-page">

      <section className="twi-hero">

        <div className="twi-hero-container">

          <h1>
            Learn About Our Products in Twi
          </h1>

          <p>
            Watch, listen and explore helpful product
            information explained in Twi.
          </p>

        </div>

      </section>


      <section className="twi-content-section">

        <div className="twi-container">


          {/* Content header */}

          <div className="twi-content-header">

            <span>
              LEARN YOUR WAY
            </span>

            <h2>
              Product Information Made Easier
            </h2>

            <p>
              Choose the format that works best for you.
            </p>

          </div>


          {/* Content filters */}

          <div
            className="twi-filter"
            role="tablist"
            aria-label="Twi content types"
          >

            {filters.map(
              (filter) => {
                const Icon =
                  filter.icon;

                const isActive =
                  activeType ===
                  filter.value;

                return (
                  <button
                    key={
                      filter.value
                    }
                    type="button"
                    role="tab"
                    aria-selected={
                      isActive
                    }
                    className={
                      isActive
                        ? "twi-filter-button active"
                        : "twi-filter-button"
                    }
                    onClick={() =>
                      setActiveType(
                        filter.value
                      )
                    }
                  >

                    <Icon
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    {filter.label}

                  </button>
                );
              }
            )}

          </div>


          {/* Loading */}

          {loading && (

            <div className="twi-status">
              Loading content...
            </div>

          )}


          {/* Error */}

          {!loading &&
            error && (

              <div
                className="twi-status twi-status-error"
                role="alert"
              >
                {error}
              </div>

            )}


          {/* Empty state */}

          {!loading &&
            !error &&
            filteredContent.length ===
              0 && (

              <div className="twi-status">
                No {activeType} content is available yet.
              </div>

            )}


          {/* Content grid */}

          {!loading &&
            !error &&
            filteredContent.length >
              0 && (

              <div className="twi-content-grid">

                {filteredContent.map(
                  (item) => {


                    /* Video */

                    if (
                      item.content_type ===
                      "video"
                    ) {
                      const videoId =
                        getYouTubeVideoId(
                          item.video_url
                        );

                      return (
                        <article
                          key={
                            item.id
                          }
                          className="twi-card"
                        >

                          <div className="twi-video-area">

                            {videoId ? (

                              <iframe
                                src={
                                  `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
                                    videoId
                                  )}`
                                }
                                title={
                                  item.title
                                }
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                              />

                            ) : (

                              <div className="twi-media-placeholder">

                                <Play
                                  size={30}
                                  strokeWidth={1.6}
                                  aria-hidden="true"
                                />

                                <span>
                                  YouTube Video
                                </span>

                              </div>

                            )}

                          </div>


                          <div className="twi-card-content">

                            <span className="twi-card-type">
                              VIDEO
                            </span>

                            <h3>
                              {
                                item.title
                              }
                            </h3>

                            {item.short_description && (
                              <p>
                                {
                                  item.short_description
                                }
                              </p>
                            )}


                            {videoId && (

                              <a
                                href={
                                  item.video_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="twi-youtube-link"
                              >

                                Watch on YouTube

                                <ExternalLink
                                  size={15}
                                  strokeWidth={1.8}
                                  aria-hidden="true"
                                />

                              </a>

                            )}

                          </div>

                        </article>
                      );
                    }


                    /* Audio */

                    if (
                      item.content_type ===
                      "audio"
                    ) {
                      return (
                        <article
                          key={
                            item.id
                          }
                          className="twi-card twi-audio-card"
                        >

                          <div className="twi-audio-icon">

                            <Volume2
                              size={25}
                              strokeWidth={1.7}
                              aria-hidden="true"
                            />

                          </div>


                          <div className="twi-card-content">

                            <span className="twi-card-type">
                              AUDIO
                            </span>

                            <h3>
                              {
                                item.title
                              }
                            </h3>

                            {item.short_description && (
                              <p>
                                {
                                  item.short_description
                                }
                              </p>
                            )}


                            {item.audio_file ? (

                              <audio
                                controls
                                preload="metadata"
                                className="twi-audio-player"
                              >

                                <source
                                  src={
                                    item.audio_file
                                  }
                                />

                                Your browser does not support audio playback.

                              </audio>

                            ) : (

                              <p className="twi-coming-soon">
                                Audio is temporarily unavailable.
                              </p>

                            )}

                          </div>

                        </article>
                      );
                    }


                    /* Image */

                    return (
                      <article
                        key={
                          item.id
                        }
                        className="twi-card"
                      >

                        <div className="twi-image-area">

                          {item.image ? (

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.title
                              }
                              loading="lazy"
                            />

                          ) : (

                            <div className="twi-media-placeholder">

                              <ImageIcon
                                size={30}
                                strokeWidth={1.6}
                                aria-hidden="true"
                              />

                              <span>
                                Twi Information Image
                              </span>

                            </div>

                          )}

                        </div>


                        <div className="twi-card-content">

                          <span className="twi-card-type">
                            IMAGE
                          </span>

                          <h3>
                            {
                              item.title
                            }
                          </h3>

                          {item.short_description && (
                            <p>
                              {
                                item.short_description
                              }
                            </p>
                          )}

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            )}

        </div>

      </section>

    </main>
  );
};


export default Twi;