import React from "react";

import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import "./ThankYou.css";


const ThankYou = () => {
  const navigate =
    useNavigate();


  /* =========================================================
     RETURNING VISITOR STATUS

     The Opt-In page stores only this temporary boolean flag.

     No phone number, email address or name is stored in
     sessionStorage.
  ========================================================= */

  const isReturningVisitor =
    sessionStorage.getItem(
      "greatnessMallReturningVisitor"
    ) === "true";


  /* =========================================================
     CONTINUE TO GREATNESS MALL

     Clear the temporary status after it has served its
     purpose, then move the visitor to the main shop.
  ========================================================= */

  const handleContinue = () => {
    sessionStorage.removeItem(
      "greatnessMallReturningVisitor"
    );

    navigate("/home");
  };


  return (
    <main className="thankyou-page">

      <section className="thankyou-card">


        {/* Success confirmation */}

        <div className="thankyou-icon">

          <CheckCircle2
            size={34}
            strokeWidth={1.7}
            aria-hidden="true"
          />

        </div>


        {/* Message changes for new and returning visitors */}

        <span className="thankyou-eyebrow">
          {isReturningVisitor
            ? "WELCOME BACK"
            : "THANK YOU"}
        </span>


        <h1>
          {isReturningVisitor
            ? "Good To See You Again"
            : "You're All Set"}
        </h1>


        <p>
          {isReturningVisitor
            ? (
              <>
                Your details are already registered with
                Greatness Mall. Your current resource
                download has started, so you can continue
                to the shop.
              </>
            )
            : (
              <>
                Your details have been received and your
                resource download has started. You can now
                continue to Greatness Mall.
              </>
            )
          }
        </p>


        {/* Main action */}

        <button
          type="button"
          className="thankyou-button"
          onClick={handleContinue}
        >
          Continue to Greatness Mall

          <ArrowRight
            size={17}
            strokeWidth={1.7}
            aria-hidden="true"
          />

        </button>

      </section>

    </main>
  );
};


export default ThankYou;