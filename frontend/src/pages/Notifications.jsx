import { useEffect, useState } from "react";
import api from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data);
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
          Loading Notifications...
        </p>

      </div>
    );
  }

  return (
    <div className="container mt-5">

      <div className="text-center mb-5">

        <h1 className="fw-bold">
          🔔 Notifications
        </h1>

        <p className="text-muted">
          Stay updated with your application status
        </p>

      </div>

      {notifications.length === 0 ? (

        <div className="card shadow border-0">

          <div className="card-body text-center p-5">

            <h3 className="text-muted">
              No Notifications Yet
            </h3>

            <p>
              Updates from recruiters will appear here.
            </p>

          </div>

        </div>

      ) : (

        <div className="row">

          {notifications.map((notification) => (

            <div
              key={notification._id}
              className="col-md-6 mb-4"
            >

              <div className="card shadow-lg border-0 h-100">

                <div className="card-body p-4">

                  <h5 className="fw-bold">
                    🔔 New Update
                  </h5>

                  <hr />

                  <p className="mb-0">
                    {notification.message}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Notifications;