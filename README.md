# Student Resource Exchange (SRE)

![CI](https://github.com/chevaleshreya04-ship-it/student-resource-exchange/actions/workflows/ci.yml/badge.svg)

A full-stack MERN application where students can upload, browse, search, and download academic materials — question papers, textbooks, research papers, and notes — all in one searchable, organized place.

**Live demo:** _https://student-resource-exchange.vercel.app/_
**Backend API:** _https://student-resource-exchange-33kp.onrender.com_

> ⏳ The backend runs on a free tier, so the first request after inactivity can take up to a minute to wake up.
 
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
- ✅ **Tested** — Vitest suites on both client and server (API routes, auth middleware, ownership checks), run automatically on every push via GitHub Actions

## Tech stack

**Frontend:** React + TypeScript (Vite), React Router, Context API for auth state, `react-hot-toast` for notifications, plain CSS with design tokens

**Backend:** Node.js, Express, TypeScript, MongoDB Atlas with Mongoose, JWT (`jsonwebtoken`) + `bcryptjs` for auth, Cloudinary + `multer` / `multer-storage-cloudinary` for file storage

**Testing & CI:** Vitest, React Testing Library, Supertest, `mongodb-memory-server`, GitHub Actions

## Project structure

```
student-resource-exchange/
├── .github/workflows/ci.yml
├── client/                   # React frontend (Vite). Tests sit next to their components as *.test.tsx
│   └── src/
│       ├── components/       # NavBar, Footer, BrowseList, BrowseItem, FilterBar, FilterChips, Sorting, SearchBar, Hero, ProtectedRoute
│       ├── context/          # AuthContext
│       ├── pages/            # Home, Browse, Upload, Dashboard, Login, Register, About, NotFound
│       └── types/            # index.ts
└── server/                   # Express backend
    ├── app.ts                # Express app (no listen), imported by server.ts and tests
    ├── server.ts             # DB connection + app.listen
    ├── config/               # db.ts, cloudinary.ts, multer.ts
    ├── models/               # User.ts, Resource.ts
    ├── routes/               # authRoutes.ts, resourceRoutes.ts
    ├── middleware/           # auth.ts (JWT protect middleware)
    ├── types/                # express.d.ts, multer-storage-cloudinary.d.ts
    ├── utils/                # getErrorMessage.ts
    ├── tests/                # setup.ts, helpers.ts, auth/resources/middleware tests
    ├── dummyResources.ts     # sample resources
    └── seed.ts               # seeds sample users + resources
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
- Node.js (v20+; CI runs on v22)
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
npm run dev          # development (auto-restart)
# or: npm run build && npm start   # production-style
```

Optionally seed sample data: (⚠️ This deletes all existing users and resources first, so only run it against a dev database)
```bash
npm run seed
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

## Testing

Both halves of the app have automated tests, and CI runs them on every push and pull request.

```bash
# backend
cd server
npm test                      # watch mode
npx vitest run --coverage     # single run + coverage report

# frontend
cd client
npm test
```

**Backend:** integration tests use Supertest against the Express app, with an in-memory MongoDB (`mongodb-memory-server`), so no real database is needed. Cloudinary and multer are mocked, so tests never touch external services. Covered: register/login, the JWT middleware (invalid, expired, and malformed tokens), owner-only delete, download counting, malformed IDs, and 500 error paths. Server coverage is around 90%+ lines.

**Frontend:** component and page tests with React Testing Library covering search, filtering, sorting, protected routes, and helper utilities.

The first backend run downloads a MongoDB binary, so it's slow once.

## Future improvements

- Ratings/upvoting system as an additional quality signal alongside download counts
- Pagination for large result sets
- File previews before download

## Author

Built solo by [Shreya](https://github.com/chevaleshreya04-ship-it) as a full-stack MERN portfolio project.
