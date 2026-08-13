# Student Resource Exchange (SRE)

A full-stack MERN application where students can upload, browse, search, and download academic materials — question papers, textbooks, research papers, and notes — all in one searchable, organized place.

**Live demo:** _https://student-resource-exchange-o6f2hdss5-shreya-chevales-projects.vercel.app/_
**Backend API:** _https://student-resource-exchange-33kp.onrender.com_

---

## The problem

Most academic resource sharing happens informally — WhatsApp groups, random Drive links, forwarded PDFs. It works for a moment, but things get buried, links expire, and there's no way to tell what's actually worth downloading.

SRE fixes this by giving resources a permanent, searchable home, with download counts acting as a built-in quality signal — the most useful materials naturally rise to the top.

## Features

- 🔍 **Browse & search** — filter by subject, university, branch, semester, and resource type; search by title; sort by downloads or upload date
- 📤 **Upload** — authenticated users can upload files (question papers, textbooks, research papers, notes) with metadata, stored on Cloudinary
- 📊 **Download tracking** — every download increments a counter, used as a lightweight quality/popularity signal instead of a ratings system
- 🔐 **Authentication** — JWT-based register/login, with protected routes for uploading and managing resources
- 🗂️ **Personal dashboard** — logged-in users can view everything they've uploaded, see total downloads across their resources, and delete their own uploads
- 🌐 **Public browsing** — anyone can browse and search resources without an account; login is only required to upload

## Tech stack

**Frontend:** React (Vite), React Router, Context API for auth state, `react-hot-toast` for notifications, plain CSS with design tokens

**Backend:** Node.js, Express, MongoDB Atlas with Mongoose, JWT (`jsonwebtoken`) + `bcryptjs` for auth, Cloudinary + `multer` / `multer-storage-cloudinary` for file storage

## Project structure

```
student-resource-exchange/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # NavBar, Footer, BrowseList, BrowseItem, FilterBar, FilterChips, Sorting, SearchBar, Hero, ProtectedRoute
│       ├── context/         # AuthContext
│       ├── pages/           # Home, Browse, Upload, Dashboard, Login, Register, About, NotFound
│       └── data/            # dummyResources.js (seed data only)
└── server/                  # Express backend
    ├── config/               # db.js, cloudinary.js, multer.js
    ├── models/                # User.js, Resource.js
    ├── routes/                # authRoutes.js, resourceRoutes.js
    ├── middleware/            # auth.js (JWT protect middleware)
    └── seed.js                # seeds sample users + resources
```

## API endpoints

| Method | Endpoint                       | Auth required | Description                          |
|--------|---------------------------------|:--------------:|---------------------------------------|
| GET    | `/api/resources`                | No             | Get all resources                     |
| GET    | `/api/resources/:id`            | No             | Get a single resource                 |
| POST   | `/api/resources`                | Yes            | Upload a new resource (multipart)     |
| DELETE | `/api/resources/:id`            | Yes (owner only) | Delete a resource                  |
| PATCH  | `/api/resources/:id/download`   | No             | Increment a resource's download count |
| POST   | `/api/auth/register`            | No             | Register a new user                   |
| POST   | `/api/auth/login`               | No             | Log in an existing user               |

## Getting started locally

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas cluster
- A Cloudinary account (free tier is fine)

### 1. Clone the repo
```bash
git clone https://github.com/chevaleshreya04-ship-it/student-resource-exchange.git
cd student-resource-exchange
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `server/.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

Run the server:
```bash
node server.js
```

Optionally seed sample data:
```bash
node seed.js
```
This creates a few sample users (all with password `password123`) and resources.

### 3. Set up the frontend
```bash
cd ../client
npm install
```

Create a `client/.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```

The app should now be running at `http://localhost:5173` (or whatever port Vite assigns), talking to the backend at `http://localhost:5000`.

## Future improvements

- Ratings/upvoting system as an additional quality signal alongside download counts
- Pagination for large result sets
- File previews before download

## Author

Built solo by [Shreya](https://github.com/chevaleshreya04-ship-it) as a full-stack MERN portfolio project.
