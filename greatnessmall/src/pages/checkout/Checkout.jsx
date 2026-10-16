import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import {
  checkoutCustomerOrder,
  markOrderWhatsAppStarted,
} from "../../services/backend";

import "./Checkout.css";

const WHATSAPP_NUMBER = "233578622158";


const Checkout = () => {
  const {
    items,
    totalItems,
    totalQuantity,
    isLoading,
    resetCart,
  } = useCart();

  const {
    customer,
  } = useCustomerAuth();

  const [
    formData,
    setFormData,
  ] = useState({
    phone_number: "",
    location: "",
  });

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isOpeningWhatsApp,
    setIsOpeningWhatsApp,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    createdOrder,
    setCreatedOrder,
  ] = useState(null);


  const accountName =
    customer?.full_name?.trim() || "";

  const accountPhone =
    customer?.phone_number?.trim() || "";


  const orderItems = useMemo(() => {
    if (!createdOrder?.items) {
      return [];
    }

    return Array.isArray(
      createdOrder.items
    )
      ? createdOrder.items
      : [];
  }, [createdOrder]);


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setErrorMessage("");

    const phoneNumber =
      accountPhone ||
      formData.phone_number.trim();

    const location =
      formData.location.trim();


    if (!accountName) {
      setErrorMessage(
        "Please complete your account name before placing an order."
      );

      return;
    }


    if (!phoneNumber) {
      setErrorMessage(
        "Please enter a phone number for this order."
      );

      return;
    }


    if (!location) {
      setErrorMessage(
        "Please enter your location."
      );

      return;
    }


    try {
      setIsSubmitting(true);

      const payload = {
        location,
      };


      if (!accountPhone) {
        payload.phone_number =
          phoneNumber;
      }


      const order =
        await checkoutCustomerOrder(
          payload
        );

      setCreatedOrder(order);

      resetCart();
    } catch (error) {
      setErrorMessage(
        error?.message ||
        "We could not place your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const buildWhatsAppMessage =
    () => {
      if (!createdOrder) {
        return "";
      }

      const itemLines =
        orderItems
          .map(
            (item) =>
              `${item.product_name} × ${item.quantity}`
          )
          .join("\n");

      return (
        `Hello Greatness Mall,\n\n` +
        `I have placed an order on your website.\n\n` +
        `Order: ${createdOrder.reference}\n\n` +
        `Items:\n${itemLines}\n\n` +
        `Name: ${createdOrder.full_name}\n` +
        `Phone: ${createdOrder.phone_number}\n` +
        `Location: ${createdOrder.location}\n\n` +
        `I would like to continue with my order.`
      );
    };


  const handleContinueWhatsApp =
    async () => {
      if (
        !createdOrder ||
        isOpeningWhatsApp
      ) {
        return;
      }

      setErrorMessage("");

      setIsOpeningWhatsApp(true);

      const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(
          buildWhatsAppMessage()
        );

      const newWindow =
        window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer"
        );

      try {
        await markOrderWhatsAppStarted(
          createdOrder.reference
        );

        setCreatedOrder(
          (current) => ({
            ...current,
            status:
              "whatsapp_started",
          })
        );
      } catch {
        // The order is already saved.
        // WhatsApp should still open.
      } finally {
        setIsOpeningWhatsApp(
          false
        );
      }

      if (!newWindow) {
        window.location.href =
          whatsappUrl;
      }
    };


  if (createdOrder) {
    return (
      <main className="checkout-page">

        <section className="checkout-success-card">

          <div className="checkout-success-icon">
            <CheckCircle2
              size={36}
            />
          </div>


          <p className="checkout-eyebrow">
            Order saved successfully
          </p>


          <h1>
            Your order is ready for WhatsApp
          </h1>


          <p className="checkout-success-copy">
            Your order has been saved
            to your account. Continue
            on WhatsApp to discuss
            price, delivery and payment
            with Greatness Mall.
          </p>


          <div className="checkout-reference">

            <span>
              Order reference
            </span>

            <strong>
              {
                createdOrder.reference
              }
            </strong>

          </div>


          <div className="checkout-success-items">

            {orderItems.map(
              (item) => (

                <div
                  className="checkout-success-item"
                  key={item.id}
                >
                  <span>
                    {
                      item.product_name
                    }
                  </span>

                  <strong>
                    × {item.quantity}
                  </strong>
                </div>

              )
            )}

          </div>


          <button
            type="button"
            className="checkout-whatsapp-button"
            onClick={
              handleContinueWhatsApp
            }
            disabled={
              isOpeningWhatsApp
            }
          >

            {isOpeningWhatsApp ? (
              <LoaderCircle
                size={20}
                className="checkout-spin"
              />
            ) : (
              <MessageCircle
                size={20}
              />
            )}


            <span>
              {
                isOpeningWhatsApp
                  ? "Opening WhatsApp..."
                  : "Continue on WhatsApp"
              }
            </span>

          </button>


          <Link
            to="/account/orders"
            className="checkout-orders-link"
          >
            View My Orders
          </Link>

        </section>

      </main>
    );
  }


  if (isLoading) {
    return (
      <main className="checkout-page">

        <div className="checkout-loading">

          <LoaderCircle
            size={30}
            className="checkout-spin"
          />

          <span>
            Loading your cart...
          </span>

        </div>

      </main>
    );
  }


  if (!items?.length) {
    return (
      <main className="checkout-page">

        <section className="checkout-empty">

          <ShoppingBag
            size={44}
          />


          <h1>
            Your cart is empty
          </h1>


          <p>
            Add at least one product
            before proceeding to
            checkout.
          </p>


          <Link to="/products">
            Browse Products
          </Link>

        </section>

      </main>
    );
  }


  return (
    <main className="checkout-page">

      <div className="checkout-container">

        <Link
          to="/cart"
          className="checkout-back-link"
        >
          <ArrowLeft
            size={18}
          />

          <span>
            Back to Cart
          </span>
        </Link>


        <div className="checkout-heading">

          <p className="checkout-eyebrow">
            Complete your order
          </p>


          <h1>
            Checkout
          </h1>


          <p>
            Confirm your delivery
            location below. Your
            signed-in account details
            will be attached to the
            order automatically.
          </p>

        </div>


        <div className="checkout-layout">

          <form
            className="checkout-form-card"
            onSubmit={
              handleSubmit
            }
          >

            <div className="checkout-section-heading">

              <UserRound
                size={22}
              />


              <div>

                <h2>
                  Ordering As
                </h2>

                <p>
                  Your account details
                  are used automatically.
                </p>

              </div>

            </div>


            <div className="checkout-pricing-note">

              <strong>
                {
                  accountName ||
                  "Customer account"
                }
              </strong>

              {accountPhone && (
                <>
                  <br />
                  {accountPhone}
                </>
              )}

            </div>


            {errorMessage && (
              <div className="checkout-error">
                {errorMessage}
              </div>
            )}


            {!accountPhone && (

              <label className="checkout-field">

                <span>
                  <Phone
                    size={17}
                  />

                  Phone number
                </span>


                <input
                  type="tel"
                  name="phone_number"
                  value={
                    formData.phone_number
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. 024 000 0000"
                  autoComplete="tel"
                  maxLength={20}
                  required
                />

              </label>

            )}


            <label className="checkout-field">

              <span>
                <MapPin
                  size={17}
                />

                Delivery location
              </span>


              <input
                type="text"
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. East Legon, Accra"
                autoComplete="street-address"
                maxLength={255}
                required
              />

            </label>


            <button
              type="submit"
              className="checkout-submit-button"
              disabled={
                isSubmitting
              }
            >

              {isSubmitting ? (
                <LoaderCircle
                  size={20}
                  className="checkout-spin"
                />
              ) : (
                <CheckCircle2
                  size={20}
                />
              )}


              <span>
                {
                  isSubmitting
                    ? "Saving Order..."
                    : "Place Order"
                }
              </span>

            </button>

          </form>


          <aside className="checkout-summary-card">

            <div className="checkout-summary-heading">

              <ShoppingBag
                size={21}
              />

              <h2>
                Order Summary
              </h2>

            </div>


            <div className="checkout-summary-items">

              {items.map(
                (item) => (

                  <div
                    className="checkout-summary-item"
                    key={item.id}
                  >

                    <div>

                      <strong>
                        {
                          item.product?.name ||
                          "Product"
                        }
                      </strong>


                      {
                        item.product
                          ?.short_description &&
                        (
                          <p>
                            {
                              item.product
                                .short_description
                            }
                          </p>
                        )
                      }

                    </div>


                    <span>
                      × {item.quantity}
                    </span>

                  </div>

                )
              )}

            </div>


            <div className="checkout-summary-stats">

              <div>
                <span>
                  Products
                </span>

                <strong>
                  {totalItems}
                </strong>
              </div>


              <div>
                <span>
                  Total quantity
                </span>

                <strong>
                  {
                    totalQuantity
                  }
                </strong>
              </div>

            </div>


            <p className="checkout-pricing-note">
              No price is charged on
              this page. Product
              pricing, delivery and
              payment are completed
              directly with Greatness
              Mall on WhatsApp.
            </p>

          </aside>

        </div>

      </div>

    </main>
  );
};


export default Checkout;
