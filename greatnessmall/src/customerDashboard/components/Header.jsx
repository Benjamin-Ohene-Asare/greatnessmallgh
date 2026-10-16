import {
  Menu,
  UserRound,
} from "lucide-react";

import {
  useCustomerAuth,
} from "../../context/CustomerAuthContext";


const Header = ({
  onMenuClick,
}) => {
  const {
    customer,
  } = useCustomerAuth();

  const name =
    customer?.full_name ||
    "Customer";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");


  return (
    <header className="customer-dashboard-header">
      <button
        type="button"
        className="customer-dashboard-menu-button"
        onClick={onMenuClick}
        aria-label="Open account menu"
      >
        <Menu size={21} />
      </button>

      <div className="customer-dashboard-header-title">
        <span>
          Greatness Mall
        </span>

        <strong>
          Customer Account
        </strong>
      </div>

      <div className="customer-dashboard-user">
        <div className="customer-dashboard-user-text">
          <strong>
            {name}
          </strong>

          <span>
            {customer?.email}
          </span>
        </div>

        <div
          className="customer-dashboard-avatar"
          aria-label={`${name} profile`}
        >
          {initials || (
            <UserRound size={19} />
          )}
        </div>
      </div>
    </header>
  );
};


export default Header;