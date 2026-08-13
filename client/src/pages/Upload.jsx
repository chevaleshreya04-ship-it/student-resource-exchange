import React, { useRef, useState } from "react";
import "./Upload.css";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from 'react-hot-toast'
import { Link } from "react-router-dom";

const TYPE_OPTIONS = ["question paper", "textbook", "research paper", "notes"];

const Upload = () => {

  // states
  const [formData, setFormData] = useState({})
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // refs
  const fileRef = useRef(null)

  // variables
  const { user, token } = useAuth()

  // functions
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    setError('')
    e.preventDefault()
    let {title, subject, university, branch, type, semester} = formData

    if(!title){ setError('Please enter a title.'); return }
    if(!subject){ setError('Please enter a subject.'); return }
    if(!university){ setError('Please enter a university.'); return }
    if(!branch){ setError('Please enter a branch.'); return }
    if(!type){ setError('Please enter a resource type.'); return }
    if(!semester){ setError('Please enter a semester.'); return }
    if(!file){ setError('Please upload a file.'); return }

    // build multipart form data - required since we're sending a file, not JSON
    const uploadData = new FormData()
    uploadData.append("title", title)
    uploadData.append("subject", subject)
    uploadData.append("university", university)
    uploadData.append("branch", branch)
    uploadData.append("type", type)
    uploadData.append("semester", semester)
    uploadData.append("file", file) // key must match upload.single("file") on the server

    setSubmitting(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/resources`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // no Content-Type here - the browser sets the correct multipart boundary automatically
        },
        body: uploadData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Upload failed. Please try again.")
        setSubmitting(false)
        return
      }

      // clear form
      setFormData({})
      setFile(null)
      fileRef.current.value = ""

      toast.success("Resource uploaded successfully!")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-container">
      <div className="upper-heading">
        <Link to="/dashboard">Back</Link>
        <h1>Upload a Resource</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <h3>Resource Information</h3>

        <div className="input">
          <label htmlFor="title">Title:</label>
          <input value={formData.title || ""} type="text" id="title" name="title" onChange={handleChange} />
        </div>
        <div className="input">
          <label htmlFor="subject">Subject:</label>
          <input value={formData.subject || ""} type="text" id="subject" name="subject" onChange={handleChange} />
        </div>
        <div className="input">
          <label htmlFor="university">University:</label>
          <input value={formData.university || ""} type="text" id="university" name="university" onChange={handleChange} />
        </div>
        <div className="input">
          <label htmlFor="branch">Branch:</label>
          <input value={formData.branch || ""} type="text" id="branch" name="branch" onChange={handleChange} />
        </div>
        <div className="input">
          <label htmlFor="type">Type:</label>
          <select name="type" id="type" value={formData.type || ""} onChange={handleChange}>
            <option value="">Type</option>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="input">
          <label htmlFor="semester">Semester:</label>
          <select name="semester" id="semester" value={formData.semester || ""} onChange={handleChange}>
            <option value="">Semester</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className="input">
          <label htmlFor="file">Upload file:</label>
          <input type="file" name="file" id="file" onChange={handleFileChange} ref={fileRef}/>
        </div>
        <p className="form-error">{error}</p>
        <button type="submit" disabled={submitting}>
          {submitting ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default Upload;