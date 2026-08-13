import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import BrowseList from "../components/BrowseList";
import toast from "react-hot-toast";
import "./Dashboard.css";

const Dashboard = () => {
  //TODO: add a delete functionality
  const { user, token } = useAuth();

  const displayName = user ? user.username : "Guest";

  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this resource? This can't be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/resources/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete resource.");
        return;
      }

      setFilteredResources((prev) => prev.filter((item) => item._id !== id));
      toast.success("Resource deleted.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const fetchMyResources = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/resources`);
        if (!res.ok) throw new Error("Failed to fetch resources");
        const data = await res.json();

        const mine = data.filter((item) => item.uploadedBy?._id === user?.id);
        setFilteredResources(mine);
      } catch (err) {
        console.error(err);
        toast.error("Couldn't load your resources.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyResources();
  }, [user]);

  const uploadCount = filteredResources.length;
  const totalDownloads = filteredResources.reduce(
    (sum, item) => sum + item.downloads,
    0,
  );

  return (
    <div>
      <NavBar />
      <main className="dashboard-container">
        <h1>Welcome, {displayName}!</h1>
        <div className="summary-bar">
          <div className="bar">
            <img src="/file-upload.png" alt="Upload icon" />
            <p>
              You have uploaded {uploadCount}{" "}
              {uploadCount === 1 ? "resource" : "resources"}.
            </p>
          </div>
          <div className="bar">
            <img
              id="download-icon"
              src="/file-download.png"
              alt="Download icon"
            />
            <p>{totalDownloads} downloads.</p>
          </div>
        </div>
        <Link to="/upload">Upload</Link>
        {loading ? (
          "Loading..."
        ) : uploadCount === 0 ? (
          <div className="no-resources">
            <img src="/shrug.png" alt="Resources not found" />
            <p>No resources found. Start uploading today!</p>
          </div>
        ) : (
          <BrowseList resources={filteredResources} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
