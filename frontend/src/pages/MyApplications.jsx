import { useEffect, useState } from "react";
import api from "../services/api";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(response.data);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <p className="mt-3">
          Loading Applications...
        </p>

      </div>
    );
  }

  return (
    <div className="container mt-5">

      <div className="text-center mb-5">

        <h1 className="fw-bold">
          📄 My Applications
        </h1>

        <p className="text-muted">
          Track all jobs you've applied for
        </p>

      </div>

      {applications.length > 0 ? (

        <div className="row">

          {applications.map((app) => (

            <div
              className="col-md-6 mb-4"
              key={app._id}
            >

              <div className="card shadow-lg border-0 h-100">

                <div className="card-body p-4">

                  <h5 className="fw-bold">
                    Application Details
                  </h5>

                  <hr />

                  <p>
                    <strong>Job ID:</strong>
                    <br />
                    {app.job_id}
                  </p>

                  <p>
                    <strong>Resume:</strong>
                  </p>

                  <a
                    href={app.resume_link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Resume
                  </a>

                  <div className="mt-4">

                    <strong>Status:</strong>

                    <span
                      className={`badge ms-2 ${
                        app.status === "Shortlisted"
                          ? "bg-success"
                          : app.status === "Rejected"
                          ? "bg-danger"
                          : "bg-primary"
                      }`}
                    >
                      {app.status}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="card shadow border-0">

          <div className="card-body text-center p-5">

            <h3 className="text-muted">
              No Applications Yet
            </h3>

            <p>
              Start applying to jobs to track them here.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default MyApplications;