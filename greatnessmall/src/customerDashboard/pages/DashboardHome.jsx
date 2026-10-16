import {
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import {
  useCustomerAuth,
} from "../../context/CustomerAuthContext";


const DashboardHome = () => {
  const {
    customer,
  } = useCustomerAuth();


  return (
    <section className="customer-dashboard-home">
      <div className="customer-dashboard-welcome">
        <span>
          My Account
        </span>

        <h1>
          Welcome,{" "}
          {customer?.full_name ||
            "Customer"}
        </h1>

        <p>
          Manage your profile,
          orders and shopping
          activity from your
          Greatness Mall account.
        </p>
      </div>


      <div className="customer-dashboard-cards">
        <article>
          <div className="customer-dashboard-icon">
            <ShoppingBag size={20} />
          </div>

          <div>
            <span>Orders</span>
            <strong>0</strong>
            <p>
              Your orders will
              appear here.
            </p>
          </div>
        </article>


        <article>
          <div className="customer-dashboard-icon">
            <Package size={20} />
          </div>

          <div>
            <span>Current Orders</span>
            <strong>0</strong>
            <p>
              Track active orders
              and their status.
            </p>
          </div>
        </article>


        <article>
          <div className="customer-dashboard-icon">
            <UserRound size={20} />
          </div>

          <div>
            <span>Profile</span>

            <strong>
              {customer?.phone_number
                ? "Complete"
                : "Phone missing"}
            </strong>

            <p>
              Review and update
              your account details.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};


export default DashboardHome;