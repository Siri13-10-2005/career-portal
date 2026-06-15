import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const response = await api.get(
        `/jobs/${id}`
      );

      setJob(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!job) {
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
          Loading Job Details...
        </p>

      </div>
    );
  }

  return (
    <div className="container mt-5">

      <div className="card shadow-lg border-0">

        <div className="card-body p-5">

          <h1 className="fw-bold mb-4">
            {job.title}
          </h1>

          <h4 className="mb-3">
            🏢 {job.company}
          </h4>

          <p>
            <strong>📍 Location:</strong>{" "}
            {job.location}
          </p>

          <p>
            <strong>💰 Salary:</strong>{" "}
            ₹{job.salary}
          </p>

          <hr />

          <h4>📄 Job Description</h4>

          <p className="mt-3">
            {job.description}
          </p>

        </div>

      </div>

    </div>
  );
}

export default JobDetails;