import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post(
        "/login",
        {
          email,
          password,
        }
      );
      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.access_token
      );
      localStorage.setItem(
        "role",
        response.data.user.role
      );

      toast.success(response.data.message);

      navigate("/jobs");
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="login-page">

      <div className="container">

        <div className="row align-items-center min-vh-100">

          {/* LEFT SECTION */}

          <div className="col-md-6">

            <div className="left-section">

              <div className="welcome-badge">
                👋 Welcome Back
              </div>

              <h1>
                Your Dream Job
                <br />
                <span className="highlight">
                  Awaits You
                </span>
              </h1>

              <p className="mt-4 fs-5 text-muted">
                Explore opportunities,
                apply with ease and
                build your future.
              </p>

              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="career"
                width="300"
              />

            </div>

          </div>

          {/* RIGHT SECTION */}

          <div className="col-md-6">

            <div className="card login-card">

              <div className="card-body p-5">

                <h1 className="text-center mb-4">
                  Welcome Back!
                </h1>

                <p className="text-center text-muted">
                  Login to continue
                </p>

                <div className="mb-3">

                  <label className="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />

                </div>

                <button
                  className="btn btn-primary login-btn w-100"
                  onClick={handleLogin}
                >
                  Login
                </button>

                <p className="text-center mt-4">

                  Don't have an account?

                  <Link
                    to="/register"
                    className="ms-2"
                  >
                    Register Here
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;