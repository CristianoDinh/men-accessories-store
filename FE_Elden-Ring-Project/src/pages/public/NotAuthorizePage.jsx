import React from "react";
import { Link } from "react-router-dom";
// import styles
import "../../styles/public/not-authorize/not-authorize.css";
export const NotAuthorizePage = () => {
  return (
    <div className="unauthorize-container">
      <div className="unauthorize">
        <i className="bx bxs-shield-x"></i>
        <strong>Unauthorize Page</strong>
        <p>
          This page was protected, you do not have permission to access this
          page.
        </p>
        <Link to="/">Return to Homepage</Link>
      </div>
    </div>
  );
};
