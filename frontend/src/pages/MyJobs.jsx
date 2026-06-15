import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this job?"
      );

      if (!confirmDelete) return;

      await api.delete(
        `/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Job Deleted Successfully"
      );

      fetchJobs();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
        "Delete Failed"
      );
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
        Loading Jobs...
      </p>

    </div>
  );
}

  return (
    <div className="container mt-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold">
          💼 My Posted Jobs
        </h1>

        <p className="text-muted">
          Manage your job postings and applicants
        </p>

        <h4 className="mt-3">
          📊 Total Jobs Posted: {jobs.length}
        </h4>
      </div>

      <div className="row justify-content-center">

        {jobs.length > 0 ? (

          jobs.map((job) => (

            <div
              key={job._id}
              className="col-md-6 mb-4"
            >

              <div className="card shadow-lg border-0 h-100">

                <div className="card-body p-4">

                  <h3 className="fw-bold">
                    {job.title}
                  </h3>

                  <p>
                    <strong>Company:</strong>{" "}
                    {job.company}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {job.location}
                  </p>

                  <p>
                    <strong>Salary:</strong>{" "}
                    ₹{job.salary}
                  </p>

                  <p className="text-muted">
                    {job.description.length > 100
                    ? job.description.substring(0, 100) + "..."
                    : job.description}
                  </p>

                  <div className="mt-3 d-flex gap-2 flex-wrap">

                    <button
                      className="btn btn-primary me-2"
                      onClick={() =>
                        navigate(
                          `/applicants/${job._id}`
                        )
                      }
                    >
                      View Applicants
                    </button>

                    <button
                      className="btn btn-warning me-2"
                      onClick={() =>
                        navigate(
                          `/edit-job/${job._id}`
                        )
                      }
                    >
                      Edit Job
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteJob(job._id)
                      }
                    >
                      Delete Job
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="text-center">

            <h3>📭 No Jobs Posted Yet</h3>

            <p className="text-muted">
              Create your first job posting.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default MyJobs;