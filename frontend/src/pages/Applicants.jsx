import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Applicants() {
  const { jobId } = useParams();

  const [applicants, setApplicants] =
    useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `/job-applicants/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/application-status/${applicationId}?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Applicant ${status}`);

      fetchApplicants();

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
        "Status Update Failed"
      );
    }
  };

  return (
    <div className="container mt-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold">
          👨‍💼 Job Applicants
        </h1>

        <p className="text-muted">
          Review candidate applications
        </p>
      </div>

      <div className="row">

        {applicants.length > 0 ? (

          applicants.map((app) => (

            <div
              key={app._id}
              className="col-md-6 mb-4"
            >

              <div className="card shadow-lg border-0 h-100">

                <div className="card-body p-4">

                  <h4 className="fw-bold">
                    {app.student_email}
                  </h4>

                  <p className="mb-3">
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

                  <div className="mt-4">

                    <button
                      className="btn btn-success me-2"
                      disabled={
                        app.status === "Shortlisted"
                      }
                      onClick={() =>
                        updateStatus(
                          app._id,
                          "Shortlisted"
                        )
                      }
                    >
                      Shortlist
                    </button>

                    <button
                      className="btn btn-danger"
                      disabled={
                        app.status === "Rejected"
                      }
                      onClick={() =>
                        updateStatus(
                          app._id,
                          "Rejected"
                        )
                      }
                    >
                      Reject
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="text-center">

            <h4>📭 No Applicants Yet</h4>
            <p className="text-muted">
              Applications will appear here when students apply.
            </p>

          </div>
          
        )}

      </div>

    </div>
  );
}

export default Applicants;