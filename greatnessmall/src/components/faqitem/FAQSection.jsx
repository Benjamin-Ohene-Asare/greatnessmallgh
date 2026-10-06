import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./FAQSection.css";

/* =========================================================
   TEMPORARY FAQ DATA

   Later, Django can provide these questions and answers
   dynamically from the admin dashboard.

   SECURITY:
   We render answers as normal React text.
   Do not use dangerouslySetInnerHTML for admin content.
========================================================= */

const faqs = [
  {
    id: 1,
    question: "How do I order a product?",
    answer:
      "Choose the product you are interested in and use the Order Now option to contact us for assistance.",
  },
  {
    id: 2,
    question: "Can I ask questions before ordering?",
    answer:
      "Yes. You can contact us on WhatsApp and we will help you with the information you need.",
  },
  {
    id: 3,
    question: "Where can I learn more about a product?",
    answer:
      "Each product will have more information available, including descriptions and product explanations.",
  },
  {
    id: 4,
    question: "Do you provide product explanations in Twi?",
    answer:
      "Yes. Greatness Mall includes dedicated Twi content to make selected product information easier to understand.",
  },
  {
    id: 5,
    question: "How will I know about new products or offers?",
    answer:
      "You can join Greatness Mall through the opt-in page to receive useful updates, resources and selected offers.",
  },
];

const FAQSection = () => {
  const [openId, setOpenId] = useState(1);

  /* =========================================================
     ACCORDION HANDLER
  ========================================================= */

  const toggleFAQ = (id) => {
    setOpenId((currentId) => (currentId === id ? null : id));
  };

  return (
    <section className="faq-section">

      <div className="faq-container">

        {/* =====================================================
            LEFT INTRO
        ====================================================== */}

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


        {/* =====================================================
            FAQ ACCORDION
        ====================================================== */}

        <div className="faq-list">

          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

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
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
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
                  id={`faq-answer-${faq.id}`}
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