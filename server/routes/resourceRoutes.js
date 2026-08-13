import express from "express";
import Resource from "../models/Resource.js";
import protect from "../middleware/auth.js";
import upload from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// GET /api/resources - all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("uploadedBy", "username")
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resources", error: err.message });
  }
});

// GET /api/resources/:id - single resource
router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate("uploadedBy", "username");
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resource", error: err.message });
  }
});

// POST /api/resources - create a new resource (protected)
router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    const { title, subject, university, branch, type, semester } = req.body;

    if (!title || !subject || !university || !branch || !type || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const resource = await Resource.create({
      title,
      subject,
      university,
      branch,
      type,
      semester: Number(semester),
      uploadedBy: req.userId, // from the protect middleware, not the client
      fileURL: req.file.secure_url, // Cloudinary URL
      publicId: req.file.public_id,
      resourceType: req.file.resource_type, // "image" or "raw", whatever Cloudinary decided
      downloads: 0,
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error("Resource creation error:", err); 
    res.status(500).json({ message: "Failed to create resource", error: err.message });
  }
});

// DELETE /api/resources/:id - delete a resource (protected, owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // ownership check - only the uploader can delete their own resource
    if (resource.uploadedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own resources" });
    }

    await cloudinary.uploader.destroy(resource.publicId, { resource_type: resource.resourceType }); // delete from cloudinary

    await resource.deleteOne();

    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Resource deletion error:", err);
    res.status(500).json({ message: "Failed to delete resource", error: err.message });
  }
});

// PATCH /api/resources/:id/download - increment download count
router.patch("/:id/download", async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ downloads: resource.downloads });
  } catch (err) {
    console.error("Download increment error:", err);
    res.status(500).json({ message: "Failed to update download count", error: err.message });
  }
});

export default router;
