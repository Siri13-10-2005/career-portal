import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
function CreateJob() {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/jobs",
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);

      setJobData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
        "Job Creation Failed"
      );
    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-8">

          <div className="card shadow-lg border-0">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                💼 Create New Job
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
                  name="description"
                  className="form-control"
                  rows="4"
                  value={jobData.description}
                  onChange={handleChange}
                />
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={handleCreateJob}
              >
                Create Job
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateJob;