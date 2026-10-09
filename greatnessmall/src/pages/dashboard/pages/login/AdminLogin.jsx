import {
  useEffect,
  useState,
} from "react";

import {
  LockKeyhole,
  User,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  adminLogin,
  getAdminSession,
} from "../../../../services/backend";

import "./AdminLogin.css";


const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    formData,
    setFormData,
  ] = useState({
    username: "",
    password: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // Skip the login screen when an admin session already exists
  useEffect(() => {
    let cancelled = false;

    const checkSession =
      async () => {
        try {
          const user =
            await getAdminSession();

          if (
            !cancelled &&
            user?.is_staff
          ) {
            navigate(
              "/admin",
              {
                replace: true,
              }
            );
          }
        } catch {
          // No valid session yet
        } finally {
          if (!cancelled) {
            setCheckingSession(
              false
            );
          }
        }
      };

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [navigate]);


  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    if (
      ![
        "username",
        "password",
      ].includes(name)
    ) {
      return;
    }

    setFormData(
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

    const username =
      formData.username.trim();

    const password =
      formData.password;

    if (
      !username ||
      !password
    ) {
      setError(
        "Enter your username and password."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const user =
        await adminLogin(
          username,
          password
        );

      if (!user?.is_staff) {
        throw new Error(
          "Administrator access is required."
        );
      }

      const destination =
        location.state?.from
          ?.pathname ||
        "/admin";

      navigate(
        destination,
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };


  if (checkingSession) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-status">
          Checking administrator access...
        </div>
      </main>
    );
  }


  return (
    <main className="admin-login-page">

      <section className="admin-login-card">

        <div className="admin-login-heading">

          <span>
            GREATNESS MALL
          </span>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in to manage website content.
          </p>

        </div>


        <form
          className="admin-login-form"
          onSubmit={
            handleSubmit
          }
          noValidate
        >

          <div className="admin-login-field">

            <label htmlFor="username">
              Username
            </label>

            <div className="admin-login-input">

              <User
                size={18}
                strokeWidth={1.7}
                aria-hidden="true"
              />

              <input
                id="username"
                type="text"
                name="username"
                value={
                  formData.username
                }
                onChange={
                  handleChange
                }
                autoComplete="username"
                maxLength={150}
                required
              />

            </div>

          </div>


          <div className="admin-login-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="admin-login-input">

              <LockKeyhole
                size={18}
                strokeWidth={1.7}
                aria-hidden="true"
              />

              <input
                id="password"
                type="password"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                autoComplete="current-password"
                required
              />

              <Link
  to="/admin/forgot-password"
  className="admin-login-forgot"
>
  Forgot password?
</Link>

            </div>

          </div>


          {error && (
            <div
              className="admin-login-error"
              role="alert"
            >
              {error}
            </div>
          )}


          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

      </section>

    </main>
  );
};


export default AdminLogin;