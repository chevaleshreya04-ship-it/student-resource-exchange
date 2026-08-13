import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Resource from "./models/Resource.js";
import User from "./models/User.js";
import { dummyResources } from "./dummyResources.js"; // adjust path as needed

dotenv.config();

// seed users - unique uploadedBy usernames from your dummy data
const seedUsernames = [...new Set(dummyResources.map((r) => r.uploadedBy))];

const seed = async () => {
  await connectDB();

  try {
    await Resource.deleteMany();
    await User.deleteMany();

    // create a user per unique uploadedBy username, all sharing one test password
    const hashedPassword = await bcrypt.hash("password123", 10);

    const userDocs = await User.insertMany(
      seedUsernames.map((username) => ({ username, password: hashedPassword }))
    );

    // map username -> real Mongo _id
    const userMap = {};
    userDocs.forEach((u) => {
      userMap[u.username] = u._id;
    });

    // swap each dummy resource's uploadedBy string for the matching user's _id
    const resourcesWithRealIds = dummyResources.map((r) => ({
      ...r,
      uploadedBy: userMap[r.uploadedBy],
      publicId: `placeholder-${r.title.replace(/\s+/g, "-").toLowerCase()}`,
      resourceType: "raw",
    }));

    await Resource.insertMany(resourcesWithRealIds);

    console.log(`Seeded ${userDocs.length} users and ${resourcesWithRealIds.length} resources`);
    console.log("All seeded users share the password: password123");
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

seed();