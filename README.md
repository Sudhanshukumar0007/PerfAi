# PerfAI - Employee Performance Analytics

PerfAI is a comprehensive, full-stack AI-powered HR application designed to manage personnel directories, track employee performance, and generate actionable, data-driven AI performance reviews.

## The Aesthetic: Editorial Data Studio
PerfAI is designed with a premium, information-dense aesthetic inspired by financial research publications and modern SaaS platforms. 
- **Typography:** Uses IBM Plex Sans for body, IBM Plex Mono for data, and Playfair Display for elegant headers.
- **Theme System:** Ships with fully integrated Light and Dark modes (`localStorage` persisted), avoiding generic dashboards and embracing a refined, monochromatic interface with sharp 0-4px border radii.
- **Split-View Editor:** The employee addition and editing interfaces utilize a real-time split-view layout for optimal user experience.

---

## Tech Stack
- **Frontend**: React (Vite), React Router v6, Axios, Lucide React (Iconography), React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Atlas), Mongoose
- **Security**: JWT Authentication, Route Protection, Scoped Data Access (Multi-Tenancy)
- **AI Integration**: OpenRouter API (utilizing Google Gemini models) for intelligent performance ranking and personalized feedback.

---

## Core Features

- **Secure Authentication & Multi-Tenancy**: 
  - JWT-based login/signup system. 
  - All employee records are scoped to the `createdBy` user ID, ensuring isolated, secure workspaces for different HR managers.
- **Employee Directory**: 
  - Add, View, Search, Filter, and Delete employees in a high-density table view.
  - Custom tag-based skill entry system.
- **AI Performance Reports**: 
  - Automatically assesses employee performance scores, tenure, and department.
  - Generates promotion eligibility, peer comparison rankings, and actionable training recommendations.

---

## Local Setup Instructions

### 1. Clone & Install Dependencies
You need Node.js installed. Open your terminal and run:

```bash
# Clone the repository (if applicable)
# git clone <repo_url>
# cd perfai

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file in `perfai/server/` and add the following variables:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0...
JWT_SECRET=supersecretjwtkey123
OPENROUTER_API_KEY=sk-or-v1-...
PORT=5000
```
*Note: You must have an active OpenRouter API key and MongoDB Atlas instance.*

### 3. Run the Application Locally

**Run the Backend Server:**
```bash
cd server
npm run dev
```

**Run the Frontend Development Server:**
Open a new terminal tab/window:
```bash
cd client
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## Deployment Audit & Guide (Render)

PerfAI is fully prepared for deployment on [Render](https://render.com/).

### Backend Deployment (Web Service)
1. In Render, create a new **Web Service** connected to your repository (or deploy from a public repo).
2. Set the Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. **Environment Variables**: Add your `MONGO_URI`, `JWT_SECRET`, and `OPENROUTER_API_KEY`.
6. Once deployed, copy your backend URL (e.g., `https://perfai-backend.onrender.com`).

### Frontend Deployment (Static Site)
1. In Render, create a new **Static Site**.
2. Set the Root Directory to `client`.
3. Build Command: `npm install && npm run build`
4. Publish Directory: `client/dist` (or just `dist` if root is `client`)
5. **Environment Variables**: Add `VITE_API_URL` and set it to your deployed backend API URL (e.g., `https://perfai-backend.onrender.com/api`).
6. **Routing/Redirects**: Under "Redirects/Rewrites", add a rule to catch all frontend routes so React Router works:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Status:** `200 Rewrite`

---

## API Documentation

### Authentication (`/api/auth`)
- `POST /signup` - Register a new user account
- `POST /login` - Login to receive a JWT access token

### Employee Management (`/api/employees`) - *Requires Bearer Token*
- `GET /` - Fetch all employees belonging to the logged-in user
- `POST /` - Create a new employee record
- `GET /:id` - Retrieve a single employee's details
- `PUT /:id` - Update an employee's data
- `DELETE /:id` - Remove an employee from the directory

### AI Recommendations (`/api/ai`) - *Requires Bearer Token*
- `POST /recommend` - Generates a detailed AI performance review. Requires `{ "employeeId": "<id>" }` in the request body.

---
*Developed for the Employe Performance Analytics platform.*
