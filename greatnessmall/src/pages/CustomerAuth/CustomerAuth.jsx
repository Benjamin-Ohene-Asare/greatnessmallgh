import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import {
  GoogleLogin,
} from "@react-oauth/google";

import {
  useCustomerAuth,
} from "../../context/CustomerAuthContext";

import "./CustomerAuth.css";


const initialRegisterForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};


export default function CustomerAuth() {
  const {
  customer,
  register,
  signIn,
  signInWithGoogle,
} = useCustomerAuth();

const navigate = useNavigate();
const location = useLocation();

const redirectTo =
  typeof location.state?.from === "string" &&
  location.state.from.startsWith("/account")
    ? location.state.from
    : "/account";

  const [mode, setMode] =
    useState("login");

  const [identifier, setIdentifier] =
    useState("");

  const [loginPassword, setLoginPassword] =
    useState("");

  const [registerForm, setRegisterForm] =
    useState(initialRegisterForm);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [
    googleSubmitting,
    setGoogleSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const clearMessages = () => {
    setError("");
    setSuccess("");
  };


  const switchMode = (nextMode) => {
    setMode(nextMode);
    clearMessages();

    setShowPassword(false);
    setShowConfirmPassword(false);
  };


  useEffect(() => {
  if (customer) {
    navigate(
      redirectTo,
      {
        replace: true,
      }
    );
  }
}, [
  customer,
  navigate,
  redirectTo,
]);






  const handleRegisterChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setRegisterForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };


  const handleLogin = async (
    event
  ) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    clearMessages();
    setSubmitting(true);

    try {
     await signIn(
  identifier.trim(),
  loginPassword
);

navigate(
  redirectTo,
  {
    replace: true,
  }
);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to sign in."
      );
    } finally {
      setSubmitting(false);
    }
  };


  const handleRegister = async (
    event
  ) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    clearMessages();

    if (
      registerForm.password !==
      registerForm.confirmPassword
    ) {
      setError(
        "The passwords do not match."
      );

      return;
    }

    setSubmitting(true);

    try {
      await register({
        fullName:
          registerForm.fullName.trim(),

        email:
          registerForm.email.trim(),

        phoneNumber:
          registerForm.phoneNumber.trim(),

        password:
          registerForm.password,

        confirmPassword:
          registerForm.confirmPassword,
      });

      navigate(
  redirectTo,
  {
    replace: true,
  }
);

      setRegisterForm(
        initialRegisterForm
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to create your account."
      );
    } finally {
      setSubmitting(false);
    }
  };


  const handleGoogleSuccess =
    async (credentialResponse) => {
      if (
        googleSubmitting ||
        !credentialResponse?.credential
      ) {
        return;
      }

      clearMessages();
      setGoogleSubmitting(true);

      try {
        const data =
          await signInWithGoogle(
            credentialResponse.credential
          );

   await signInWithGoogle(
  credentialResponse.credential
);

navigate(
  redirectTo,
  {
    replace: true,
  }
);      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to sign in with Google."
        );
      } finally {
        setGoogleSubmitting(false);
      }
    };


  const handleGoogleError = () => {
    setError(
      "Google sign-in could not be completed."
    );
  };


  return (
    <main className="customer-auth-page">
      <section className="customer-auth-shell">
        <div className="customer-auth-intro">
          <span className="customer-auth-eyebrow">
            Greatness Mall
          </span>

          <h1>
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p>
            {mode === "login"
              ? "Sign in to manage your cart, orders and account."
              : "Create an account to save your cart and place orders securely."}
          </p>
        </div>

        <div className="customer-auth-card">
          <div className="customer-auth-tabs">
            <button
              type="button"
              className={
                mode === "login"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchMode("login")
              }
            >
              Sign In
            </button>

            <button
              type="button"
              className={
                mode === "register"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchMode("register")
              }
            >
              Create Account
            </button>
          </div>

          <div className="customer-google-area">
            <GoogleLogin
              onSuccess={
                handleGoogleSuccess
              }
              onError={
                handleGoogleError
              }
              text={
                mode === "login"
                  ? "signin_with"
                  : "signup_with"
              }
              shape="rectangular"
              theme="outline"
              size="large"
              width="320"
            />

            {googleSubmitting && (
              <p className="customer-auth-working">
                Verifying your Google account...
              </p>
            )}
          </div>

          <div className="customer-auth-divider">
            <span>or</span>
          </div>

          {error && (
            <div
              className="customer-auth-message error"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="customer-auth-message success"
              role="status"
            >
              {success}
            </div>
          )}

          {mode === "login" ? (
            <form
              onSubmit={handleLogin}
              className="customer-auth-form"
            >
              <label>
                <span>
                  Email or Phone Number
                </span>

                <div className="customer-auth-input">
                  <Mail size={18} />

                  <input
                    type="text"
                    value={identifier}
                    onChange={(event) =>
                      setIdentifier(
                        event.target.value
                      )
                    }
                    placeholder="Email or phone number"
                    autoComplete="username"
                    required
                  />
                </div>
              </label>

              <label>
                <span>Password</span>

                <div className="customer-auth-input">
                  <LockKeyhole
                    size={18}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      loginPassword
                    }
                    onChange={(event) =>
                      setLoginPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="customer-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="customer-auth-submit"
                disabled={
                  submitting ||
                  googleSubmitting
                }
              >
                {submitting
                  ? "Signing in..."
                  : "Sign In"}
              </button>

              <button
                type="button"
                className="customer-auth-switch"
                onClick={() =>
                  switchMode("register")
                }
              >
                Don't have an account?
                <strong>
                  Create Account
                </strong>
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegister}
              className="customer-auth-form"
            >
              <label>
                <span>Full Name</span>

                <div className="customer-auth-input">
                  <UserRound size={18} />

                  <input
                    type="text"
                    name="fullName"
                    value={
                      registerForm.fullName
                    }
                    onChange={
                      handleRegisterChange
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </div>
              </label>

              <label>
                <span>Email</span>

                <div className="customer-auth-input">
                  <Mail size={18} />

                  <input
                    type="email"
                    name="email"
                    value={
                      registerForm.email
                    }
                    onChange={
                      handleRegisterChange
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label>
                <span>Phone Number</span>

                <div className="customer-auth-input">
                  <Phone size={18} />

                  <input
                    type="tel"
                    name="phoneNumber"
                    value={
                      registerForm.phoneNumber
                    }
                    onChange={
                      handleRegisterChange
                    }
                    placeholder="0501234567"
                    autoComplete="tel"
                    required
                  />
                </div>
              </label>

              <label>
                <span>Password</span>

                <div className="customer-auth-input">
                  <LockKeyhole
                    size={18}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      registerForm.password
                    }
                    onChange={
                      handleRegisterChange
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="customer-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <label>
                <span>
                  Confirm Password
                </span>

                <div className="customer-auth-input">
                  <LockKeyhole
                    size={18}
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      registerForm.confirmPassword
                    }
                    onChange={
                      handleRegisterChange
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="customer-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="customer-auth-submit"
                disabled={
                  submitting ||
                  googleSubmitting
                }
              >
                {submitting
                  ? "Creating account..."
                  : "Create Account"}
              </button>

              <button
                type="button"
                className="customer-auth-switch"
                onClick={() =>
                  switchMode("login")
                }
              >
                Already have an account?
                <strong>
                  Sign In
                </strong>
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}