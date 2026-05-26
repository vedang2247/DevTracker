# 🚀 DevTracker

**Live Demo:** https://dev-tracker-sigma-snowy.vercel.app/


DevTracker is a full-stack developer productivity tool designed to track algorithmic problem-solving progress and document technical notes. Built with the MERN stack, it features secure cross-origin authentication and a real-time Markdown rendering engine.

---

## 🏗️ Technical Architecture & Engineering Highlights
Rather than a simple monolithic application, DevTracker is built as a decoupled system handling production-level deployment complexities:
* **Cross-Origin Authentication:** Implemented strict HTTP-only, secure JWT cookies spanning across different cloud providers (Vercel frontend to Render backend) using `sameSite: 'none'` and `secure: true` protocols.
* **RESTful API Design:** Clean, scalable backend routing using Express.js to handle secure CRUD operations.
* **Client-Side Routing Management:** Configured custom universal rewrite rules (`vercel.json`) to allow React Router to seamlessly handle SPA navigation and prevent 404 errors on a static Vercel host.

---

## ✨ Key Features
* **🔐 Secure Authentication Flow:** Full registration and login system utilizing encrypted passwords (bcrypt) and secure, expiration-based JSON Web Tokens (JWT).
* **📝 Live Markdown Engine:** A custom split-screen workspace allowing users to write algorithmic notes in Markdown and instantly see the compiled HTML preview, complete with an `.md` export feature.
* **📊 Dynamic Problem Dashboard:** A central hub to log coding problems, featuring bookmarking toggles and algorithmic difficulty badges with dynamic Tailwind CSS styling based on data state (e.g., Easy, Medium, Hard, Damn Hard!).
* **🛡️ Protected Routes:** Frontend route guards that seamlessly redirect unauthenticated users, driven by backend session validation.

---

## 💻 Tech Stack
**Frontend:**
* React.js (via Vite)
* Tailwind CSS v4
* React Router DOM

**Backend:**
* Node.js & Express.js
* JSON Web Tokens (JWT) for secure session management
* CORS configured for strict cross-origin requests

**Database & DevOps:**
* MongoDB Atlas (Cloud Database)
* Vercel (Frontend Global CDN)
* Render (Backend API Hosting)

---

## ⚙️ Local Setup & Installation

To run this project locally, you will need Node.js installed on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/devtracker.git](https://github.com/yourusername/devtracker.git)
cd devtracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a .env file in the backend directory:
```
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devtracker
JWT_SECRET=your_super_secret_jwt_string
FRONTEND_URL=http://localhost:5173
```
Start the backend server:
```
npm start
```
### 3. Frontend Setup
Open a new terminal window and navigate to the frontend folder.
```bash
cd frontend
npm install
```
Create a .env file in the frontend directory:
```
VITE_BACKEND_URL=http://localhost:8000
```
Start the Vite development server:
```
npm run dev
```
### 🚀 Deployment
* The frontend is continuously deployed via Vercel, utilizing a vercel.json file for routing rewrites.

* The backend API is hosted on Render, configured with environment variables to accept secure cross-origin requests.

* The database is fully managed by MongoDB Atlas.
