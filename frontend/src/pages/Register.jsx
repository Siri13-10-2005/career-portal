import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await api.post(
        "/register",
        formData
      );

      toast.success(response.data.message);

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(
  error.response?.data?.detail ||
  "Registration Failed"
);
    }
  };

  return (
    <div className="login-page">
      <div className="container">

        <div className="row align-items-center min-vh-100">

          {/* LEFT SIDE */}

          <div className="col-md-6">

            <div className="left-section">

              <div className="welcome-badge">
                🚀 Join Us Today
              </div>

              <h1>
                Start Your
                <br />
                <span className="highlight">
                  Career Journey
                </span>
              </h1>

              <p className="mt-4 fs-5 text-muted">
                Create your account and
                connect with recruiters,
                internships and dream jobs.
              </p>

              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="register"
                width="300"
              />

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="col-md-6">

            <div className="card login-card">

              <div className="card-body p-5">

                <h2 className="text-center mb-4">
                  Create Account
                </h2>

                <div className="mb-3">

                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    value={formData.password}
                    onChange={handleChange}
                  />

                </div>

                <div className="mb-4">

                  <label className="form-label">
                    Role
                  </label>

                  <select
                    name="role"
                    className="form-select form-select-lg"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">
                      Student
                    </option>

                    <option value="recruiter">
                      Recruiter
                    </option>
                  </select>

                </div>

                <button
                  className="btn btn-success w-100"
                  onClick={handleRegister}
                >
                  Register
                </button>

                <p className="text-center mt-4">

                  Already have an account?

                  <Link
                    to="/"
                    className="ms-2"
                  >
                    Login Here
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

export default Register;