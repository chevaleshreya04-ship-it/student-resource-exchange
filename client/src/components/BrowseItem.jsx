import React from "react";
import "./BrowseItem.css";

const BrowseItem = ({ item, onDelete }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(item.fileURL);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = item.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      fetch(`${import.meta.env.VITE_API_URL}/resources/${item._id}/download`, {
        method: "PATCH",
      });
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div className="browse-card">
      <h3>{item.title}</h3>
      <p className="browse-meta">Subject: {item.subject}</p>
      <p className="browse-meta">Resource Type: {item.type}</p>
      <p className="browse-meta">Semester: {item.semester}</p>
      <p className="browse-meta">Uploaded by: {item.uploadedBy?.username}</p>
      <p className="browse-downloads">{item.downloads} downloads</p>
      <div className="btn-container">
        <button
          className="btn-secondary"
          onClick={() => window.open(item.fileURL, "_blank")}
        >
          View
        </button>
        <button className="btn-primary" onClick={handleDownload}>
          Download
        </button>
        {onDelete && (
          <button className="btn-secondary" onClick={() => onDelete(item._id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BrowseItem;
