import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

import "./Cart.css";


const Cart = () => {
  const {
    items,
    totalItems,
    totalQuantity,
    isLoading,
    isUpdating,
    error,
    updateItemQuantity,
    removeItem,
  } = useCart();


  const handleDecrease = async (
    item
  ) => {
    if (item.quantity <= 1) {
      return;
    }

    await updateItemQuantity(
      item.id,
      item.quantity - 1
    );
  };


  const handleIncrease = async (
    item
  ) => {
    await updateItemQuantity(
      item.id,
      item.quantity + 1
    );
  };


  const handleRemove = async (
    itemId
  ) => {
    await removeItem(itemId);
  };


  if (isLoading) {
    return (
      <section className="cart-page">
        <div className="cart-container">
          <div className="cart-loading">
            <div className="cart-loading-spinner" />

            <p>
              Loading your cart...
            </p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <div>
            <span className="cart-eyebrow">
              YOUR CART
            </span>

            <h1>
              Shopping Cart
            </h1>

            <p>
              Review your selected products
              and quantities before continuing.
            </p>
          </div>

          {items.length > 0 && (
            <Link
              to="/products"
              className="cart-continue-shopping"
            >
              Continue Shopping
            </Link>
          )}
        </div>


        {error && (
          <div
            className="cart-error"
            role="alert"
          >
            {error}
          </div>
        )}


        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag
                size={34}
                strokeWidth={1.7}
              />
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Browse Greatness Mall products
              and add the items you would like
              to order.
            </p>

            <Link
              to="/products"
              className="cart-empty-button"
            >
              Explore Products

              <ArrowRight
                size={18}
                strokeWidth={2}
              />
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            <div className="cart-items">
              {items.map((item) => {
                const product =
                  item.product || {};

                return (
                  <article
                    className="cart-item"
                    key={item.id}
                  >
                    <div className="cart-product-icon">
                      <ShoppingBag
                        size={24}
                        strokeWidth={1.8}
                      />
                    </div>


                    <div className="cart-product-info">
                      <Link
                        to={`/products/${product.slug}`}
                        className="cart-product-name"
                      >
                        {product.name ||
                          "Product"}
                      </Link>

                      {product.short_description && (
                        <p>
                          {
                            product.short_description
                          }
                        </p>
                      )}

                      <button
                        type="button"
                        className="cart-remove-mobile"
                        disabled={isUpdating}
                        onClick={() =>
                          handleRemove(item.id)
                        }
                      >
                        <Trash2
                          size={15}
                          strokeWidth={1.8}
                        />

                        Remove
                      </button>
                    </div>


                    <div className="cart-quantity">
                      <span>
                        Quantity
                      </span>

                      <div className="cart-quantity-control">
                        <button
                          type="button"
                          aria-label={`Decrease ${product.name || "product"} quantity`}
                          disabled={
                            isUpdating ||
                            item.quantity <= 1
                          }
                          onClick={() =>
                            handleDecrease(item)
                          }
                        >
                          <Minus
                            size={16}
                            strokeWidth={2}
                          />
                        </button>

                        <strong>
                          {item.quantity}
                        </strong>

                        <button
                          type="button"
                          aria-label={`Increase ${product.name || "product"} quantity`}
                          disabled={isUpdating}
                          onClick={() =>
                            handleIncrease(item)
                          }
                        >
                          <Plus
                            size={16}
                            strokeWidth={2}
                          />
                        </button>
                      </div>
                    </div>


                    <button
                      type="button"
                      className="cart-remove-button"
                      aria-label={`Remove ${product.name || "product"} from cart`}
                      title="Remove from cart"
                      disabled={isUpdating}
                      onClick={() =>
                        handleRemove(item.id)
                      }
                    >
                      <Trash2
                        size={18}
                        strokeWidth={1.8}
                      />
                    </button>
                  </article>
                );
              })}
            </div>


            <aside className="cart-summary">
              <span className="cart-summary-eyebrow">
                ORDER SUMMARY
              </span>

              <h2>
                Your selection
              </h2>

              <div className="cart-summary-row">
                <span>
                  Products
                </span>

                <strong>
                  {totalItems}
                </strong>
              </div>

              <div className="cart-summary-row">
                <span>
                  Total quantity
                </span>

                <strong>
                  {totalQuantity}
                </strong>
              </div>

              <div className="cart-summary-divider" />

              <p className="cart-summary-note">
                Product pricing, delivery and
                payment details will be discussed
                with Greatness Mall when you
                continue your order on WhatsApp.
              </p>
<Link
  to="/checkout"
  className="cart-checkout-button"
>
  Continue to Checkout
</Link>

            
            </aside>

          </div>
        )}

      </div>
    </section>
  );
};


export default Cart;