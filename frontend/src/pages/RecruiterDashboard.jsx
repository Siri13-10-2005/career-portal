import { useEffect, useState } from "react";
import api from "../services/api";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);
function RecruiterDashboard() {
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/dashboard/recruiter",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(response.data);
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
        Loading Recruiter Dashboard...
      </p>

    </div>
  );
}
  const chartData = {
  labels: [
    "Applications",
    "Shortlisted",
    "Rejected",
  ],

  datasets: [
    {
      label: "Recruitment Analytics",

      data: [
        dashboard.total_applications || 0,
        dashboard.shortlisted || 0,
        dashboard.rejected || 0,
      ],

      backgroundColor: [
        "#3b82f6",
        "#10b981",
        "#ef4444",
      ],
    },
  ],
};

  return (
    <div className="container mt-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold">
          💼 Recruiter Dashboard
        </h1>

        <p className="text-muted">
          Manage hiring and track recruitment activity
        </p>
      </div>

      <div className="row g-4">

        <div className="col-md-3">
          <div
            className="card border-0 shadow-lg text-white"
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)",
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center py-4">
              <h5>Total Jobs</h5>
              <h1 className="display-4 fw-bold">
                {dashboard.total_jobs || 0}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card border-0 shadow-lg text-white"
            style={{
              background:
                "linear-gradient(135deg,#7c3aed,#8b5cf6)",
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center py-4">
              <h5>Total Applications</h5>
              <h1 className="display-4 fw-bold">
                {dashboard.total_applications || 0}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card border-0 shadow-lg text-white"
            style={{
              background:
                "linear-gradient(135deg,#059669,#10b981)",
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center py-4">
              <h5>Shortlisted</h5>
              <h1 className="display-4 fw-bold">
                {dashboard.shortlisted || 0}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card border-0 shadow-lg text-white"
            style={{
              background:
                "linear-gradient(135deg,#dc2626,#ef4444)",
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center py-4">
              <h5>Rejected</h5>
              <h1 className="display-4 fw-bold">
                {dashboard.rejected || 0}
              </h1>
            </div>
          </div>
        </div>

      </div>

      {/* HIRING INSIGHTS */}

      <div className="card border-0 shadow-lg mt-5">
        <div className="card-body p-4">

          <h3 className="fw-bold mb-3">
            📈 Hiring Insights
          </h3>

          <p className="text-muted">
            Track hiring performance and monitor candidate progress.
          </p>

          <div
            className="progress mb-3"
            style={{ height: "12px" }}
          >
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{
                width: `${
                  dashboard.total_applications
                    ? (
                        (dashboard.shortlisted /
                          dashboard.total_applications) *
                        100
                      )
                    : 0
                }%`,
              }}
            ></div>
          </div>

          <small className="text-muted">
            Shortlist Conversion Rate
          </small>

        </div>
      </div>

      {/* RECRUITMENT ANALYTICS */}

<div className="card border-0 shadow-lg mt-5">

  <div className="card-body p-4">

    <h3 className="fw-bold mb-4">
      📊 Recruitment Analytics
    </h3>

    <Bar data={chartData} />

  </div>

</div>

      {/* RECENT APPLICANTS */}

      <div className="card border-0 shadow-lg mt-5">
        <div className="card-body p-4">

          <h3 className="fw-bold mb-4">
            👨‍💼 Recent Applicants
          </h3>

          {dashboard.recent_applications?.length > 0 ? (

            dashboard.recent_applications.map(
              (app, index) => (
                <div
                  key={index}
                  className="border-bottom py-3"
                >

                  <h5>
                    {app.student_email}
                  </h5>

                  <p className="text-muted mb-2">
                    Applied for: {app.job_title}
                  </p>

                  <span
                    className={`badge ${
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
              )
            )

          ) : (

            <p className="text-muted">
              No applicants yet
            </p>

          )}

        </div>
      </div>

    </div>
  );
}

export default RecruiterDashboard;