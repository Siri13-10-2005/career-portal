import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container">

        <Link
          className="navbar-brand"
          to="/jobs"
        >
          Career Portal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <ul className="navbar-nav ms-auto">

            {/* STUDENT MENU */}

            {role === "student" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/jobs"
                  >
                    Jobs
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/saved-jobs"
                  >
                    Saved Jobs
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/my-applications"
                  >
                    My Applications
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/notifications"
                  >
                    Notifications
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/student-dashboard"
                  >
                    Student Dashboard
                  </Link>
                </li>
              </>
            )}

            {/* RECRUITER MENU */}

            {role === "recruiter" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/create-job"
                  >
                    Create Job
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/my-jobs"
                  >
                    My Jobs
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/recruiter-dashboard"
                  >
                    Recruiter Dashboard
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item ms-3">
              <button
                className="btn btn-danger"
                onClick={logout}
              >
                Logout
              </button>
            </li>

          </ul>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;