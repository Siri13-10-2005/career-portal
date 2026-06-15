import { useEffect, useState } from "react";
import api from "../services/api";
import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function StudentDashboard() {
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/dashboard/student",
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
        Loading Dashboard...
      </p>

    </div>
  );
}

  const chartData = {
  labels: [
    "Applied",
    "Shortlisted",
    "Rejected",
  ],

  datasets: [
    {
      data: [
        dashboard.applied || 0,
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
          🎓 Student Dashboard
        </h1>

        <p className="text-muted">
          Track your placement journey
        </p>
      </div>

      <div className="row g-4">

        {/* TOTAL APPLICATIONS */}

        <div className="col-md-3">
          <div
            className="card shadow-lg border-0 text-white h-100"
            style={{
              background:
                "linear-gradient(135deg,#4f46e5,#6366f1)",
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

        {/* APPLIED */}

        <div className="col-md-3">
          <div
            className="card shadow-lg border-0 text-white h-100"
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)",
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center py-4">

              <h5>Applied</h5>

              <h1 className="display-4 fw-bold">
                {dashboard.applied || 0}
              </h1>

            </div>
          </div>
        </div>

        {/* SHORTLISTED */}

        <div className="col-md-3">
          <div
            className="card shadow-lg border-0 text-white h-100"
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

        {/* REJECTED */}

        <div className="col-md-3">
          <div
            className="card shadow-lg border-0 text-white h-100"
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

      {/* PLACEMENT PROGRESS */}

      <div className="card shadow-lg border-0 mt-5">
        <div className="card-body p-4">

          <h3 className="fw-bold mb-3">
            🚀 Placement Progress
          </h3>

          <p className="text-muted">
            Keep applying consistently.
            Every application increases your
            chances of landing your dream job.
          </p>

          <div
            className="progress"
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

        </div>
      </div>

            {/* RECENT APPLICATIONS */}

      <div className="card shadow-lg border-0 mt-5">
        <div className="card-body p-4">

          <h3 className="fw-bold mb-4">
            📋 Recent Applications
          </h3>

          {dashboard.recent_applications?.length > 0 ? (

            dashboard.recent_applications.map(
              (app, index) => (
                <div
                  key={index}
                  className="border-bottom py-3"
                >

                  <h5>{app.job_title}</h5>

                  <p className="text-muted mb-2">
                    {app.company}
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
              No recent applications found
            </p>

          )}

        </div>
      </div>

      {/* APPLICATION ANALYTICS */}

      <div className="card shadow-lg border-0 mt-5">

        <div className="card-body">

          <h3 className="fw-bold mb-4">
            📊 Application Analytics
          </h3>

          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <Pie data={chartData} />
          </div>

        </div>

      </div>

    </div> 
    );
}

export default StudentDashboard;
 