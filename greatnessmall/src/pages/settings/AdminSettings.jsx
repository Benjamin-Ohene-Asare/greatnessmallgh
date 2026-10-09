import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Share2,
  ShieldCheck,
  Compass,
  Save,
  MessageSquareText,
  KeyRound,
  X,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import {
  getAdminRecoveryPhone,
  saveAdminRecoveryPhone,
  changeAdminPassword,
}  from "../../services/backend";

import "./AdminSettings.css";

const AdminSettings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
  });

  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryFeedback, setRecoveryFeedback] = useState("");
  const [savingRecovery, setSavingRecovery] = useState(false);
  const [loadingRecovery, setLoadingRecovery] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    let active = true;

    const loadRecoveryPhone = async () => {
      try {
        const data = await getAdminRecoveryPhone();

        if (!active) return;

        setRecoveryPhone(data.phone || "");
      } catch (error) {
        if (!active) return;

        console.error(
          "Unable to load recovery phone:",
          error
        );
      } finally {
        if (active) {
          setLoadingRecovery(false);
        }
      }
    };

    loadRecoveryPhone();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(
      "Website settings:",
      settings
    );
  };

  const handleRecoverySave = async (event) => {
    event.preventDefault();

    const phone = recoveryPhone.trim();

    if (!phone) {
      setRecoveryFeedback(
        "Enter a recovery phone number."
      );
      return;
    }

    try {
      setSavingRecovery(true);
      setRecoveryFeedback("");

      const result =
        await saveAdminRecoveryPhone(phone);

      setRecoveryPhone(
        result.phone || phone
      );

      setRecoveryFeedback(
        "Recovery phone number saved successfully."
      );
    } catch (error) {
      setRecoveryFeedback(
        error.message ||
          "Unable to save recovery phone number."
      );
    } finally {
      setSavingRecovery(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordFeedback("");
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (!currentPassword) {
      setPasswordFeedback(
        "Enter your current password."
      );
      return;
    }

    if (!newPassword) {
      setPasswordFeedback(
        "Enter your new password."
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordFeedback(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setPasswordFeedback(
        "Confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback(
        "The passwords do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordFeedback("");

      await changeAdminPassword(
        currentPassword,
        newPassword
      );

      navigate("/admin/login", {
        replace: true,
        state: {
          passwordChanged: true,
        },
      });
    } catch (error) {
      setPasswordFeedback(
        error.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const restartTour = () => {
    localStorage.removeItem(
      "greatnessMallAdminTour"
    );

    window.location.href = "/admin";
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-settings-header">
        <div>
          <span>SETTINGS</span>

          <h1>Website Settings</h1>

          <p>
            Manage website contact information,
            social media links and administrator
            security.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="admin-settings-form"
      >
        {/* <section className="admin-settings-card">
          <div className="admin-settings-card-header">
            <Share2 size={20} />

            <div>
              <h2>Contact & Social Media</h2>

              <p>
                Manage the contact information and
                social links displayed across the
                website.
              </p>
            </div>
          </div>

          <div className="admin-settings-grid">
            <label>
              Contact Email
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="Email address"
              />
            </label>

            <label>
              Phone Number
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                placeholder="+233..."
              />
            </label>

            <label>
              WhatsApp Number
              <input
                type="tel"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                placeholder="+233..."
              />
            </label>

            <label>
              Facebook
              <input
                type="url"
                name="facebook"
                value={settings.facebook}
                onChange={handleChange}
                placeholder="Facebook page URL"
              />
            </label>

            <label>
              Instagram
              <input
                type="url"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                placeholder="Instagram profile URL"
              />
            </label>

            <label>
              YouTube
              <input
                type="url"
                name="youtube"
                value={settings.youtube}
                onChange={handleChange}
                placeholder="YouTube channel URL"
              />
            </label>

            <label>
              TikTok
              <input
                type="url"
                name="tiktok"
                value={settings.tiktok}
                onChange={handleChange}
                placeholder="TikTok profile URL"
              />
            </label>
          </div>
        </section> */}

        <section className="admin-settings-card">
          <div className="admin-settings-card-header">
            <ShieldCheck size={20} />

            <div>
              <h2>Account Security</h2>

              <p>
                Manage password and recovery options
                for the administrator account.
              </p>
            </div>
          </div>

          <div className="admin-settings-action-row">
            <div className="admin-settings-action-info">
              <div className="admin-settings-action-icon">
                <KeyRound size={18} />
              </div>

              <div>
                <strong>Change Password</strong>

                <span>
                  Update the administrator account
                  password.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="admin-settings-secondary"
              onClick={() => {
                setPasswordFeedback("");
                setShowPasswordModal(true);
              }}
            >
              Change Password
            </button>
          </div>

          <div className="admin-settings-action-row">
            <div className="admin-settings-action-info">
              <div className="admin-settings-action-icon">
                <MessageSquareText size={18} />
              </div>

              <div>
                <strong>
                  SMS Password Recovery
                </strong>

                <span>
                  {loadingRecovery
                    ? "Loading recovery information..."
                    : recoveryPhone
                      ? `Recovery number: ${recoveryPhone}`
                      : "No recovery phone number has been set."}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="admin-settings-secondary"
              onClick={() => {
                setRecoveryFeedback("");
                setShowRecoveryModal(true);
              }}
            >
              {recoveryPhone
                ? "Update Recovery"
                : "Set Up Recovery"}
            </button>
          </div>
        </section>

        <section className="admin-settings-card">
          <div className="admin-settings-card-header">
            <Compass size={20} />

            <div>
              <h2>Dashboard Help</h2>

              <p>
                Replay the dashboard guide whenever
                you need help.
              </p>
            </div>
          </div>

          <div className="admin-settings-action-row">
            <div className="admin-settings-action-info">
              <div className="admin-settings-action-icon">
                <Compass size={18} />
              </div>

              <div>
                <strong>Dashboard Tour</strong>

                <span>
                  Restart the guided tour of the
                  admin dashboard.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="admin-settings-secondary"
              onClick={restartTour}
            >
              Restart Tour
            </button>
          </div>
        </section>

        <div className="admin-settings-save-row">
          <button
            type="submit"
            className="admin-settings-save"
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </form>

      {showPasswordModal && (
        <div
          className="admin-settings-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePasswordModal();
            }
          }}
        >
          <div
            className="admin-settings-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-title"
          >
            <button
              type="button"
              className="admin-settings-modal-close"
              onClick={closePasswordModal}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="admin-settings-modal-icon">
              <KeyRound size={22} />
            </div>

            <span className="admin-settings-modal-label">
              ACCOUNT SECURITY
            </span>

            <h2 id="password-title">
              Change Password
            </h2>

            <p>
              Enter your current password and choose
              a new password for your administrator
              account.
            </p>

            <form onSubmit={handlePasswordChange}>
              <label className="admin-settings-password-label">
                Current Password

                <div className="admin-settings-password-field">
                  <LockKeyhole size={16} />

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                    placeholder="Enter current password"
                    required
                  />

                  <button
                    type="button"
                    className="admin-settings-password-toggle"
                    onClick={() =>
                      setShowCurrentPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </label>

              <label className="admin-settings-password-label">
                New Password

                <div className="admin-settings-password-field">
                  <LockKeyhole size={16} />

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="admin-settings-password-toggle"
                    onClick={() =>
                      setShowNewPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                <small className="admin-settings-password-hint">
                  Use at least 8 characters.
                </small>
              </label>

              <label className="admin-settings-password-label">
                Confirm New Password

                <div className="admin-settings-password-field">
                  <LockKeyhole size={16} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="admin-settings-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </label>

              {passwordFeedback && (
                <p className="admin-settings-password-feedback">
                  {passwordFeedback}
                </p>
              )}

              <div className="admin-settings-modal-actions">
                <button
                  type="button"
                  className="admin-settings-modal-cancel"
                  onClick={closePasswordModal}
                  disabled={changingPassword}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-settings-modal-save"
                  disabled={changingPassword}
                >
                  <KeyRound size={16} />

                  {changingPassword
                    ? "Changing..."
                    : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRecoveryModal && (
        <div
          className="admin-settings-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowRecoveryModal(false);
            }
          }}
        >
          <div
            className="admin-settings-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recovery-title"
          >
            <button
              type="button"
              className="admin-settings-modal-close"
              onClick={() =>
                setShowRecoveryModal(false)
              }
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="admin-settings-modal-icon">
              <MessageSquareText size={22} />
            </div>

            <span className="admin-settings-modal-label">
              ACCOUNT RECOVERY
            </span>

            <h2 id="recovery-title">
              SMS Password Recovery
            </h2>

            <p>
              Enter the phone number that should
              receive password reset verification
              codes.
            </p>

            <form onSubmit={handleRecoverySave}>
              <label className="admin-settings-recovery-field">
                Recovery Phone Number

                <input
                  type="tel"
                  value={recoveryPhone}
                  onChange={(event) =>
                    setRecoveryPhone(
                      event.target.value
                    )
                  }
                  placeholder="0541234567"
                  required
                />
              </label>

              {recoveryFeedback && (
                <p className="admin-settings-recovery-feedback">
                  {recoveryFeedback}
                </p>
              )}

              <div className="admin-settings-modal-actions">
                <button
                  type="button"
                  className="admin-settings-modal-cancel"
                  onClick={() =>
                    setShowRecoveryModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-settings-modal-save"
                  disabled={savingRecovery}
                >
                  <Save size={16} />

                  {savingRecovery
                    ? "Saving..."
                    : "Save Recovery Number"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;