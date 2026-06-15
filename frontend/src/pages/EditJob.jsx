import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EditJob() {
  const { jobId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const response = await api.get(
        `/jobs/${jobId}`
      );

      setJobData({
        title: response.data.title,
        company: response.data.company,
        location: response.data.location,
        salary: response.data.salary,
        description: response.data.description,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/jobs/${jobId}`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);

      navigate("/my-jobs");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
        "Update Failed"
      );
    }
  };
  if (loading) {
  return (
    <div className="container mt-5 text-center">

      <div
        className="spinner-border text-warning"
        role="status"
      >
        <span className="visually-hidden">
          Loading...
        </span>
      </div>

      <p className="mt-3">
        Loading Job Details...
      </p>

    </div>
  );
}

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-8">

          <div className="card shadow-lg border-0">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                ✏️ Edit Job
              </h2>

              <div className="mb-3">

                <label className="form-label">
                  Job Title
                </label>

                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={jobData.title}
                  onChange={handleChange}
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  className="form-control"
                  value={jobData.company}
                  onChange={handleChange}
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={jobData.location}
                  onChange={handleChange}
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Salary
                </label>

                <input
                  type="text"
                  name="salary"
                  className="form-control"
                  value={jobData.salary}
                  onChange={handleChange}
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Description
                </label>

                <textarea
                  rows="4"
                  name="description"
                  className="form-control"
                  value={jobData.description}
                  onChange={handleChange}
                />

              </div>

              <button
                className="btn btn-warning w-100"
                onClick={handleUpdateJob}
              >
                Update Job
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EditJob;