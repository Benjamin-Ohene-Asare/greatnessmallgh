import {
  useEffect,
  useState,
} from "react";

import {
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import {
  useCustomerAuth,
} from "../../context/CustomerAuthContext";

import "./Profile.css";


const Profile = () => {
  const {
    customer,
    updateProfile,
  } = useCustomerAuth();

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  useEffect(() => {
    setForm({
      fullName:
        customer?.full_name || "",
      phoneNumber:
        customer?.phone_number || "",
    });
  }, [customer]);


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateProfile({
        fullName:
          form.fullName.trim(),

        phoneNumber:
          form.phoneNumber.trim(),
      });

      setSuccess(
        "Profile updated successfully."
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };


  return (
    <section className="customer-profile-page">
      <div className="customer-profile-heading">
        <span>
          Account Settings
        </span>

        <h1>
          My Profile
        </h1>

        <p>
          Review and update your
          Greatness Mall account details.
        </p>
      </div>


      <div className="customer-profile-card">
        <div className="customer-profile-summary">
          <div className="customer-profile-avatar-large">
            <UserRound size={28} />
          </div>

          <div>
            <strong>
              {customer?.full_name ||
                "Customer"}
            </strong>

            <span>
              {customer?.email}
            </span>
          </div>
        </div>


        {error && (
          <div
            className="customer-profile-message error"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="customer-profile-message success"
            role="status"
          >
            {success}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="customer-profile-form"
        >
          <label>
            <span>
              Full Name
            </span>

            <div className="customer-profile-input">
              <UserRound size={18} />

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </label>


          <label>
            <span>
              Email Address
            </span>

            <div className="customer-profile-input read-only">
              <Mail size={18} />

              <input
                type="email"
                value={
                  customer?.email || ""
                }
                readOnly
                aria-readonly="true"
              />
            </div>

            <small>
              Your email is used for account identity
              and cannot be changed here.
            </small>
          </label>


          <label>
            <span>
              Phone Number
            </span>

            <div className="customer-profile-input">
              <Phone size={18} />

              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="0501234567"
                autoComplete="tel"
              />
            </div>

            {!customer?.phone_number && (
              <small>
                You can add a phone number now or
                provide one during checkout.
              </small>
            )}
          </label>


          <button
            type="submit"
            className="customer-profile-save"
            disabled={saving}
          >
            <Save size={18} />

            <span>
              {saving
                ? "Saving..."
                : "Save Changes"}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};


export default Profile;