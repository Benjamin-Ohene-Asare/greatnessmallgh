import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  MessageSquareText,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  requestPasswordResetSMS,
  confirmPasswordResetSMS,
} from "../../../../services/backend";

import "./AdminForgotPassword.css";

const AdminForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();

    const cleanPhone = phone.trim();

    if (!cleanPhone) {
      setError("Enter your recovery phone number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFeedback("");

      const result =
        await requestPasswordResetSMS(cleanPhone);

      setFeedback(
        result.detail ||
          "Verification code sent."
      );

      setStep("reset");
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to send verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();

    const cleanCode = code.trim();

    if (!cleanCode) {
      setError(
        "Enter the verification code."
      );
      return;
    }

    if (cleanCode.length !== 6) {
      setError(
        "Enter the 6-digit verification code."
      );
      return;
    }

    if (!newPassword) {
      setError(
        "Enter your new password."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Confirm your new password."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "The passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFeedback("");

      await confirmPasswordResetSMS(
        phone.trim(),
        cleanCode,
        newPassword
      );

      navigate(
        "/admin/login",
        {
          replace: true,
          state: {
            passwordReset: true,
          },
        }
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-forgot-page">
      <div className="admin-forgot-card">

        <Link
          to="/admin/login"
          className="admin-forgot-back"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="admin-forgot-icon">
          {step === "phone" ? (
            <MessageSquareText size={24} />
          ) : (
            <KeyRound size={24} />
          )}
        </div>

        <span className="admin-forgot-label">
          ACCOUNT RECOVERY
        </span>

        <h1>
          {step === "phone"
            ? "Forgot Password?"
            : "Reset Password"}
        </h1>

        <p className="admin-forgot-description">
          {step === "phone"
            ? "Enter the recovery phone number linked to your administrator account."
            : `Enter the verification code sent to ${phone} and create a new password.`}
        </p>

        {feedback && (
          <div className="admin-forgot-feedback">
            {feedback}
          </div>
        )}

        {error && (
          <div
            className="admin-forgot-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={requestCode}>
            <label>
              Recovery Phone Number

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="0541234567"
                autoComplete="tel"
                required
              />
            </label>

            <button
              type="submit"
              className="admin-forgot-primary"
              disabled={loading}
            >
              <MessageSquareText size={17} />

              {loading
                ? "Sending..."
                : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <label>
              Verification Code

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="000000"
                autoComplete="one-time-code"
                required
              />
            </label>

            <label>
              New Password

              <div className="admin-forgot-password-field">
                <LockKeyhole size={16} />

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="admin-forgot-password-toggle"
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

              <small className="admin-forgot-password-hint">
                Use at least 8 characters.
              </small>
            </label>

            <label>
              Confirm New Password

              <div className="admin-forgot-password-field">
                <LockKeyhole size={16} />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="admin-forgot-password-toggle"
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

            <button
              type="submit"
              className="admin-forgot-primary"
              disabled={loading}
            >
              <KeyRound size={17} />

              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>

            <button
              type="button"
              className="admin-forgot-resend"
              disabled={loading}
              onClick={() => {
                setStep("phone");
                setCode("");
                setNewPassword("");
                setConfirmPassword("");
                setShowNewPassword(false);
                setShowConfirmPassword(false);
                setError("");
                setFeedback("");
              }}
            >
              Request another code
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AdminForgotPassword;