import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  ChevronDown,
  Package,
  ShoppingBag,
  MessageCircle,
  CircleHelp,
  HeartPulse,
  Truck,
} from "lucide-react";

import {
  getFaqCategories,
  getFaqs,
} from "../../services/backend";

import "./FAQ.css";


const FAQ = () => {
  const [
    faqItems,
    setFaqItems,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    openFaq,
    setOpenFaq,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // Load FAQs and categories from Django
  useEffect(() => {
    let cancelled = false;

    const loadFaqData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          faqData,
          categoryData,
        ] = await Promise.all([
          getFaqs(),
          getFaqCategories(),
        ]);

        if (cancelled) {
          return;
        }

        const safeFaqs =
          Array.isArray(faqData)
            ? faqData
            : [];

        const safeCategories =
          Array.isArray(categoryData)
            ? categoryData
            : [];

        setFaqItems(
          safeFaqs
        );

        setCategories(
          safeCategories
        );
      } catch (err) {
        console.error(
          "Failed to load FAQ data:",
          err
        );

        if (!cancelled) {
          setError(
            "Frequently asked questions are temporarily unavailable."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFaqData();

    return () => {
      cancelled = true;
    };
  }, []);


  // Give each category a suitable icon
  const getCategoryIcon = (
    categoryName
  ) => {
    const normalizedName =
      categoryName
        ?.trim()
        .toLowerCase();

    switch (normalizedName) {
      case "products":
        return Package;

      case "orders":
        return ShoppingBag;

      case "support":
        return MessageCircle;

      case "delivery":
        return Truck;

      case "wellness":
        return HeartPulse;

      default:
        return CircleHelp;
    }
  };


  // Search and category filtering
  const filteredFaqs =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return faqItems.filter(
        (faq) => {
          const categoryName =
            faq.category?.name ||
            "";

          const matchesCategory =
            activeCategory ===
              "All" ||
            categoryName ===
              activeCategory;

          const matchesSearch =
            !normalizedSearch ||
            faq.question
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            faq.answer
              ?.toLowerCase()
              .includes(
                normalizedSearch
              );

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      activeCategory,
      searchTerm,
      faqItems,
    ]);


  return (
    <main className="faq-page">

      <section className="faq-page-hero">

        <div className="faq-page-hero-container">

          <h1>
            Frequently Asked Questions
          </h1>

          <p>
            Find quick answers about our products,
            orders, support and services.
          </p>


          <div className="faq-search">

            <Search
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(
                  event.target.value
                );

                setOpenFaq(null);
              }}
              placeholder="Search questions..."
              aria-label="Search frequently asked questions"
            />

          </div>

        </div>

      </section>


      <section className="faq-page-content">

        <div className="faq-page-container">


          {/* Category filters */}

          {!loading &&
            !error &&
            categories.length > 0 && (

              <div
                className="faq-category-filters"
                aria-label="FAQ categories"
              >

                <button
                  type="button"
                  className={
                    activeCategory ===
                    "All"
                      ? "faq-category-button active"
                      : "faq-category-button"
                  }
                  onClick={() => {
                    setActiveCategory(
                      "All"
                    );

                    setOpenFaq(null);
                  }}
                >

                  <CircleHelp
                    size={16}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  All

                </button>


                {categories.map(
                  (category) => {
                    const Icon =
                      getCategoryIcon(
                        category.name
                      );

                    const isActive =
                      activeCategory ===
                      category.name;

                    return (
                      <button
                        key={
                          category.id
                        }
                        type="button"
                        className={
                          isActive
                            ? "faq-category-button active"
                            : "faq-category-button"
                        }
                        onClick={() => {
                          setActiveCategory(
                            category.name
                          );

                          setOpenFaq(
                            null
                          );
                        }}
                      >

                        <Icon
                          size={16}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />

                        {category.name}

                      </button>
                    );
                  }
                )}

              </div>

            )}


          {/* FAQ list */}

          <div className="faq-page-list">

            {loading && (
              <div className="faq-empty-state">

                <CircleHelp
                  size={30}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />

                <h3>
                  Loading questions...
                </h3>

                <p>
                  Please wait while we load the latest information.
                </p>

              </div>
            )}


            {!loading &&
              error && (

                <div
                  className="faq-empty-state"
                  role="alert"
                >

                  <CircleHelp
                    size={30}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />

                  <h3>
                    Questions unavailable
                  </h3>

                  <p>
                    {error}
                  </p>

                </div>

              )}


            {!loading &&
            !error &&
            filteredFaqs.length >
              0 ? (

              filteredFaqs.map(
                (faq) => {
                  const isOpen =
                    openFaq ===
                    faq.id;

                  return (
                    <article
                      key={faq.id}
                      className={
                        isOpen
                          ? "faq-page-item open"
                          : "faq-page-item"
                      }
                    >

                      <button
                        type="button"
                        className="faq-page-question"
                        onClick={() =>
                          setOpenFaq(
                            isOpen
                              ? null
                              : faq.id
                          )
                        }
                        aria-expanded={
                          isOpen
                        }
                        aria-controls={
                          `faq-answer-${faq.id}`
                        }
                      >

                        <div>

                          <span className="faq-item-category">
                            {
                              faq
                                .category
                                ?.name ||
                              "General"
                            }
                          </span>

                          <h2>
                            {
                              faq.question
                            }
                          </h2>

                        </div>


                        <span
                          className="faq-chevron"
                          aria-hidden="true"
                        >

                          <ChevronDown
                            size={20}
                            strokeWidth={1.8}
                          />

                        </span>

                      </button>


                      <div
                        id={
                          `faq-answer-${faq.id}`
                        }
                        className="faq-page-answer"
                      >

                        <div className="faq-page-answer-inner">

                          <p>
                            {
                              faq.answer
                            }
                          </p>

                        </div>

                      </div>

                    </article>
                  );
                }
              )

            ) : (

              !loading &&
              !error && (

                <div className="faq-empty-state">

                  <CircleHelp
                    size={30}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />

                  <h3>
                    No questions found
                  </h3>

                  <p>
                    Try another search or
                    choose a different category.
                  </p>

                </div>

              )

            )}

          </div>


          {/* Support */}

          <div className="faq-support-box">

            <div>

              <span>
                STILL NEED HELP?
              </span>

              <h2>
                Talk to Greatness Mall
              </h2>

              <p>
                If you cannot find the answer you need,
                contact us directly and we will assist you.
              </p>

            </div>


            <a
              href="https://wa.me/233578622158?text=Hello%20Greatness%20Mall%2C%20I%20need%20help%20with%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="faq-support-button"
            >

              <MessageCircle
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              Chat on WhatsApp

            </a>

          </div>

        </div>

      </section>

    </main>
  );
};


export default FAQ;