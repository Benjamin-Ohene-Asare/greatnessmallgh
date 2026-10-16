import {
  CalendarDays,
  LoaderCircle,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  getCustomerOrders,
} from "../../services/backend";

import "./MyOrders.css";


const statusLabels = {
  pending_whatsapp:
    "Waiting for WhatsApp",

  whatsapp_started:
    "WhatsApp Started",

  confirmed:
    "Confirmed",

  completed:
    "Completed",

  cancelled:
    "Cancelled",
};


const formatOrderDate = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GH",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(dateValue)
  );
};


const MyOrders = () => {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;


    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCustomerOrders();

        if (!cancelled) {
          setOrders(
            Array.isArray(data)
              ? data
              : []
          );
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError?.message ||
            "We could not load your orders."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };


    loadOrders();


    return () => {
      cancelled = true;
    };
  }, []);


  return (
    <section className="customer-orders-page">

      <div className="customer-orders-heading">
        <span>
          Order History
        </span>

        <h1>
          My Orders
        </h1>

        <p>
          View your Greatness Mall
          orders and their current
          status.
        </p>
      </div>


      {loading && (
        <div className="customer-orders-loading">

          <LoaderCircle
            size={28}
            className="customer-orders-loader"
          />

          <span>
            Loading your orders...
          </span>

        </div>
      )}


      {!loading && error && (
        <div className="customer-orders-error">
          {error}
        </div>
      )}


      {!loading &&
        !error &&
        orders.length === 0 && (

        <div className="customer-orders-empty">

          <div className="customer-orders-empty-icon">
            <Package size={30} />
          </div>

          <h2>
            No orders yet
          </h2>

          <p>
            When you place an order,
            you will be able to view
            its status and details here.
          </p>

          <Link
            to="/products"
            className="customer-orders-shop"
          >
            <ShoppingBag size={18} />

            <span>
              Shop Products
            </span>
          </Link>

        </div>
      )}


      {!loading &&
        !error &&
        orders.length > 0 && (

        <div className="customer-orders-list">

          {orders.map((order) => (

            <article
              key={order.id}
              className="customer-order-card"
            >

              <div className="customer-order-card-header">

                <div>
                  <span className="customer-order-reference-label">
                    Order Reference
                  </span>

                  <strong className="customer-order-reference">
                    {order.reference}
                  </strong>
                </div>


                <span
                  className={`customer-order-status customer-order-status-${order.status}`}
                >
                  {
                    statusLabels[
                      order.status
                    ] ||
                    order.status
                  }
                </span>

              </div>


              <div className="customer-order-meta">

                <div>
                  <CalendarDays
                    size={16}
                  />

                  <span>
                    {
                      formatOrderDate(
                        order.created_at
                      )
                    }
                  </span>
                </div>


                <div>
                  <MapPin
                    size={16}
                  />

                  <span>
                    {order.location}
                  </span>
                </div>

              </div>


              <div className="customer-order-items">

                {order.items?.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="customer-order-item"
                    >

                      <div>
                        <Package
                          size={17}
                        />

                        <span>
                          {
                            item.product_name
                          }
                        </span>
                      </div>


                      <strong>
                        × {item.quantity}
                      </strong>

                    </div>

                  )
                )}

              </div>


              <div className="customer-order-footer">

                <span>
                  Products
                </span>

                <strong>
                  {order.total_items}
                </strong>

                <span>
                  Total Quantity
                </span>

                <strong>
                  {order.total_quantity}
                </strong>

              </div>

            </article>

          ))}

        </div>
      )}

    </section>
  );
};


export default MyOrders;