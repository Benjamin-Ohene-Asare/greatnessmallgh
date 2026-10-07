import {
  useEffect,
  useState,
} from "react";

import {
  ChevronDown,
} from "lucide-react";

import {
  getFaqs,
} from "../../services/backend";

import "./FAQSection.css";


const FAQSection = () => {
  const [
    faqs,
    setFaqs,
  ] = useState([]);

  const [
    openId,
    setOpenId,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // Load featured FAQs from Django
  useEffect(() => {
    let cancelled = false;

    const loadFaqs = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getFaqs({
            featured: true,
          });

        if (cancelled) {
          return;
        }

        const faqList =
          Array.isArray(data)
            ? data
            : [];

        setFaqs(faqList);

        if (faqList.length > 0) {
          setOpenId(
            faqList[0].id
          );
        }
      } catch (err) {
        console.error(
          "Failed to load FAQs:",
          err
        );

        if (!cancelled) {
          setError(
            "FAQs are temporarily unavailable."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFaqs();

    return () => {
      cancelled = true;
    };
  }, []);


  // Open or close an FAQ item
  const toggleFAQ = (id) => {
    setOpenId(
      (currentId) =>
        currentId === id
          ? null
          : id
    );
  };


  return (
    <section className="faq-section">

      <div className="faq-container">

        <div className="faq-intro">

          <span className="faq-label">
            FAQ
          </span>

          <h2>
            Questions?
            <br />
            We’ve Got Answers.
          </h2>

          <p>
            Find quick answers to some of the questions customers ask most.
          </p>

        </div>


        <div className="faq-list">

          {loading && (
            <div className="faq-status">
              Loading questions...
            </div>
          )}


          {!loading && error && (
            <div
              className="faq-status faq-status-error"
              role="alert"
            >
              {error}
            </div>
          )}


          {!loading &&
            !error &&
            faqs.length === 0 && (
              <div className="faq-status">
                No frequently asked questions are available yet.
              </div>
            )}


          {!loading &&
            !error &&
            faqs.map((faq) => {
              const isOpen =
                openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={
                    isOpen
                      ? "faq-item faq-item-open"
                      : "faq-item"
                  }
                >

                  <button
                    type="button"
                    className="faq-question"
                    onClick={() =>
                      toggleFAQ(
                        faq.id
                      )
                    }
                    aria-expanded={
                      isOpen
                    }
                    aria-controls={
                      `faq-answer-${faq.id}`
                    }
                  >

                    <span>
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      strokeWidth={1.8}
                      className={
                        isOpen
                          ? "faq-chevron faq-chevron-open"
                          : "faq-chevron"
                      }
                      aria-hidden="true"
                    />

                  </button>


                  <div
                    id={
                      `faq-answer-${faq.id}`
                    }
                    className={
                      isOpen
                        ? "faq-answer faq-answer-open"
                        : "faq-answer"
                    }
                  >

                    <div className="faq-answer-inner">

                      <p>
                        {faq.answer}
                      </p>

                    </div>

                  </div>

                </div>
              );
            })}

        </div>

      </div>

    </section>
  );
};


export default FAQSection;