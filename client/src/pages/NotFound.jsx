import React from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div>
      <NavBar />
      <main className="not-found-container">
        <img src="/404-error.png" alt="" />
        <h1>Oops! Looks like this page skipped class.</h1>
        <h3>
          The page you're looking for either wandered off or never existed.
          Let's get you back on track.
        </h3>
        <div className="btn-container">
          <Link className="btn-primary" to="/browse">
            Browse Resources
          </Link>
          <Link className="btn-secondary" to="/">
            Go to Home Page
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
