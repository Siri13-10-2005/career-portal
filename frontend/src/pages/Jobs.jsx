import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [resumeLink, setResumeLink] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");

      setJobs(response.data);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const searchJobs = async () => {
    try {
      if (!keyword.trim()) {
        fetchJobs();
        return;
      }

      const response = await api.get(
        `/jobs/search?keyword=${keyword}`
      );

      setJobs(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const applyJob = async (jobId) => {
    try {

      if (!resumeLink.trim()) {
        toast.error(
          "Please enter your resume link before applying"
        );
        return;
      }

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/apply",
        {
          job_id: jobId,
          resume_link: resumeLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
        "Application Failed"
      );
    }
  };

  const saveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        `/save-job/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
        "Save Failed"
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
          💼 Available Jobs
        </h1>

        <p className="text-muted">
          Discover opportunities and apply for your dream role
        </p>

      </div>

      {/* SEARCH */}

      <div className="row mb-4">

        <div className="col-md-8">

          <input
            type="text"
            className="form-control"
            placeholder="Search jobs by title..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
          />

        </div>

        <div className="col-md-4">

          <button
            className="btn btn-primary w-100"
            onClick={searchJobs}
          >
            Search
          </button>

        </div>

      </div>

      {/* RESUME LINK */}

      <div className="mb-4">

        <label className="form-label fw-bold">
          Resume Link
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Paste Google Drive Resume Link"
          value={resumeLink}
          onChange={(e) =>
            setResumeLink(e.target.value)
          }
        />

      </div>

      {jobs.length === 0 ? (

        <div className="card shadow border-0">

          <div className="card-body text-center p-5">

            <h3>No Jobs Found</h3>

            <p className="text-muted">
              Try a different search keyword.
            </p>

          </div>

        </div>

      ) : (

        <div className="row">

          {jobs.map((job) => (

            <div
              className="col-md-6 mb-4"
              key={job._id}
            >

              <div className="card shadow-lg border-0 h-100">

                <div className="card-body p-4">

                  <h3 className="fw-bold">

                    <Link
                      to={`/job/${job._id}`}
                      className="text-decoration-none"
                    >
                      {job.title}
                    </Link>

                  </h3>

                  <p>
                    <strong>🏢 Company:</strong>{" "}
                    {job.company}
                  </p>

                  <p>
                    <strong>📍 Location:</strong>{" "}
                    {job.location}
                  </p>

                  <p>
                    <strong>💰 Salary:</strong>{" "}
                    ₹{job.salary}
                  </p>

                  <p className="text-muted">
                    {job.description}
                  </p>

                  <div className="mt-3">

                    <button
                      className="btn btn-primary me-2"
                      onClick={() =>
                        applyJob(job._id)
                      }
                    >
                      Apply
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={() =>
                        saveJob(job._id)
                      }
                    >
                      Save Job
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

export default Jobs;