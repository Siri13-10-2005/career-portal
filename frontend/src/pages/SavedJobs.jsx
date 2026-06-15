import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/saved-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const unsaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.delete(
        `/unsave-job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);

      fetchSavedJobs();
    } catch (error) {
      console.log(error);

      toast.error("Failed to remove job");
    }
  };

  return (
    <div className="container mt-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold">
          ❤️ Saved Jobs
        </h1>

        <p className="text-muted">
          Jobs you saved for later
        </p>
      </div>

      {savedJobs.length === 0 ? (

        <div className="card shadow border-0">
          <div className="card-body text-center p-5">

            <h3 className="text-muted">
              📭 No Saved Jobs Yet
            </h3>

            <p>
              Save interesting jobs and they'll appear here.
            </p>

          </div>
        </div>

      ) : (

        <div className="row">

          {savedJobs.map((job) => (

            <div
              className="col-md-6 mb-4"
              key={job._id}
            >

              <div
                className="card shadow-lg border-0 h-100"
                style={{
                  borderRadius: "20px",
                }}
              >

                <div className="card-body p-4">

                  <h3 className="fw-bold">
                    {job.title}
                  </h3>

                  <p>
                    <strong>
                      Company:
                    </strong>{" "}
                    {job.company}
                  </p>

                  <p>
                    <strong>
                      Location:
                    </strong>{" "}
                    {job.location}
                  </p>

                  <p>
                    <strong>
                      Salary:
                    </strong>{" "}
                    ₹{job.salary}
                  </p>

                  <p className="text-muted">
                    {job.description}
                  </p>

                  <div className="d-flex gap-2">

                    <Link
                      to={`/job/${job._id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        unsaveJob(job._id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default SavedJobs;