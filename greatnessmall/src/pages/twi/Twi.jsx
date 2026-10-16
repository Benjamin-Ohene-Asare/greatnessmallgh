import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Play,
  Pause,
  Volume2,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import {
  useAudioPlayer,
} from "../../components/audio/AudioPlayerContext";
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
  const [audioDurations, setAudioDurations] = useState({});
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    toggleTrack,
    seekTo,
  } = useAudioPlayer();
  const [
    twiContent,
    setTwiContent,
  ] = useState([]);

  const [
    activeType,
    setActiveType,
  ] = useState("audio");

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
      value: "audio",
      label: "Audio",
      icon: Volume2,
    },

    {
      value: "video",
      label: "Videos",
      icon: Play,
    },

    {
      value: "image",
      label: "Images",
      icon: ImageIcon,
    },
  ];

  const formatAudioTime = (
    seconds
  ) => {
    if (
      !Number.isFinite(seconds) ||
      seconds < 0
    ) {
      return "0:00";
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      Math.floor(seconds % 60);

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

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

  const handleAudioMetadata = (itemId, event) => {
    const loadedDuration = event.currentTarget.duration;

    if (
      Number.isFinite(loadedDuration) &&
      loadedDuration > 0
    ) {
      setAudioDurations((current) => ({
        ...current,
        [itemId]: loadedDuration,
      }));
    }
  };

  return (
    <main className="twi-page">

      <section className="twi-hero">

        <div className="twi-hero-container">

          <h1>
            Sua Yɛn Nneɛma Ho Adesua wɔ Twi mu
          </h1>
          <p>
            Learn About Our Products in Twi

          </p>

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

              <div
                className={
                  activeType === "audio"
                    ? "twi-content-grid twi-audio-grid"
                    : "twi-content-grid"
                }
              >

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
                      const isCurrent =
                        currentTrack?.id ===
                        item.id;

                      const itemPlaying =
                        isCurrent &&
                        isPlaying;

                      const storedDuration =
                        audioDurations[item.id] || 0;

                      const progressDuration =
                        isCurrent && duration > 0
                          ? duration
                          : storedDuration;

                      const remainingTime =
                        progressDuration > 0
                          ? progressDuration - currentTime
                          : Infinity;

                      const showOrderButton =
                        isCurrent &&
                        currentTime > 0 &&
                        remainingTime <= 10 &&
                        remainingTime >= 0;

                      return (
                        <article
                          key={item.id}
                          className={
                            `twi-card twi-audio-card-rich ${isCurrent
                              ? "is-active"
                              : ""
                            }`
                          }
                        >
                          {/* Media area */}

                          <div className="twi-audio-hero">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                loading="lazy"
                              />
                            ) : (
                              <div className="twi-audio-placeholder">
                                <div className="twi-audio-placeholder-glow" />

                                <div className="twi-audio-placeholder-decoration twi-decoration-one" />
                                <div className="twi-audio-placeholder-decoration twi-decoration-two" />

                                <div className="twi-audio-placeholder-content">
                                  <div className="twi-audio-placeholder-stack">
                                    <span />
                                    <span />
                                    <span />

                                    <div className="twi-audio-placeholder-icon">
                                      <Volume2
                                        size={38}
                                        strokeWidth={1.7}
                                        aria-hidden="true"
                                      />
                                    </div>
                                  </div>

                                  <strong>
                                    Listen in Twi
                                  </strong>

                                  <p>
                                    Audio learning made simple.
                                  </p>

                                  <div
                                    className="twi-audio-wave"
                                    aria-hidden="true"
                                  >
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="twi-audio-hero-shade" />

                            <div className="twi-audio-top-badge">
                              <Volume2
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                              />

                              {/* <span>
                                TWI AUDIO
                              </span> */}
                            </div>
                          </div>


                          {/* Content */}

                          <div className="twi-audio-body">
                            <span className="twi-card-type">
                              AUDIO
                            </span>

                            <div className="twi-audio-title-group">
                              <h3>
                                {item.title}
                              </h3>

                              {item.english_title && (
                                <span className="twi-audio-english-title">
                                  ({item.english_title})
                                </span>
                              )}
                            </div>

                            {item.short_description && (
                              <p>
                                {
                                  item.short_description
                                }
                              </p>
                            )}


                            {/* Player */}
                            {item.audio_file ? (
                              <>
                                <div
                                  className={
                                    `twi-audio-player-shell ${itemPlaying
                                      ? "is-playing"
                                      : ""
                                    }`
                                  }
                                >
                                  <audio
                                    src={item.audio_file}
                                    preload="metadata"
                                    onLoadedMetadata={(event) =>
                                      handleAudioMetadata(item.id, event)
                                    }
                                    className="twi-audio-metadata-loader"
                                    aria-hidden="true"
                                  />

                                  <div
                                    className={
                                      filteredContent[0]?.id === item.id
                                        ? "twi-play-attention"
                                        : ""
                                    }
                                  >
                                    {filteredContent[0]?.id === item.id && (
                                      <>
                                        <span className="twi-play-bubble bubble-one" />
                                        <span className="twi-play-bubble bubble-two" />
                                        <span className="twi-play-bubble bubble-three" />
                                      </>
                                    )}

                                    <button
                                      type="button"
                                      className="twi-audio-play-btn"
                                      onClick={() =>
                                        toggleTrack(item)
                                      }
                                      aria-label={
                                        itemPlaying
                                          ? `Pause ${item.title}`
                                          : `Play ${item.title}`
                                      }
                                    >
                                      {itemPlaying ? (
                                        <Pause
                                          size={22}
                                          strokeWidth={2}
                                        />
                                      ) : (
                                        <Play
                                          size={22}
                                          strokeWidth={2}
                                          fill="currentColor"
                                        />
                                      )}
                                    </button>
                                  </div>

                                  <div className="twi-audio-player-meta">
                                    <div className="twi-audio-time-row">
                                      <span>
                                        {isCurrent
                                          ? formatAudioTime(currentTime)
                                          : "0:00"}
                                      </span>

                                      <span>
                                        {progressDuration > 0
                                          ? formatAudioTime(progressDuration)
                                          : "--:--"}
                                      </span>
                                    </div>

                                    <input
                                      type="range"
                                      min="0"
                                      max={progressDuration || 0}
                                      step="0.1"
                                      value={
                                        isCurrent
                                          ? currentTime
                                          : 0
                                      }
                                      disabled={
                                        !isCurrent ||
                                        !progressDuration
                                      }
                                      onChange={(event) =>
                                        seekTo(
                                          Number(event.target.value)
                                        )
                                      }
                                      className="twi-audio-slider"
                                      aria-label={`Seek ${item.title}`}
                                    />
                                  </div>
                                </div>
{showOrderButton && item.product?.slug && (
  <a
    href={`/products/${encodeURIComponent(
      item.product.slug
    )}`}
    className="twi-audio-order-btn"
  >
    Order {item.product.name || "Product"}
  </a>
)}
                              </>
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