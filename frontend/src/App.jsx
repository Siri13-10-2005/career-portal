import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import SavedJobs from "./pages/SavedJobs";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import MyApplications from "./pages/MyApplications";
import CreateJob from "./pages/CreateJob";
import MyJobs from "./pages/MyJobs";
import Applicants from "./pages/Applicants";
import Notifications from "./pages/Notifications";
import JobDetails from "./pages/JobDetails";
import EditJob from "./pages/EditJob";

import { ToastContainer } from "react-toastify";

function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/saved-jobs"
          element={<SavedJobs />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/recruiter-dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/my-applications"
          element={<MyApplications />}
        />

        <Route
          path="/create-job"
          element={<CreateJob />}
        />

        <Route
          path="/my-jobs"
          element={<MyJobs />}
        />

        <Route
          path="/applicants/:jobId"
          element={<Applicants />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/job/:id"
          element={<JobDetails />}
        />

        <Route
          path="/edit-job/:jobId"
          element={<EditJob />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <Layout />

    </BrowserRouter>
  );
}

export default App;