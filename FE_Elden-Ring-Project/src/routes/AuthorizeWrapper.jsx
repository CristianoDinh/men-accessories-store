import { Navigate } from "react-router-dom";

export const LoggedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (token && user) {
    return <Navigate to="/" />;
  }
  return children;
};
export const GuestWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token && !user) {
    return <Navigate to="/login" />;
  }
  return children;
};
export const RoleWrapper = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token && allowedRoles && allowedRoles.length > 0) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

export const NonAdminWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || user?.role === "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
};
