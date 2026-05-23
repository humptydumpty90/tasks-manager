#  Tasks Manager

A full-stack task management application built with React and Node.js.

🔗 **[Live Demo](https://tasks-manager-plum.vercel.app/)** · **[GitHub Repository](https://github.com/humptydumpty90/tasks-manager)**

---

## Features

- **Authentication** — Registration, login, logout with JWT + session support
- **Boards** — Create and delete project boards
- **Tasks** — Create and delete tasks within boards
- **User Management** — Full account lifecycle (sign up, sign in, delete)
- **Repository Pattern** — Clean architecture with abstracted data layer via Mongoose

---

## Tech Stack

**Frontend**
- React
- React Router
- AntD
- Redux Toolkit

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose (Repository Pattern)
- JWT + Cookie-based sessions

**Infrastructure**
- Docker
- Render (backend deployment)
- Vercel (frontend deployment)

---

##  Getting Started

### Prerequisites

- Node.js 
- MongoDB (Atlas)


### Installation

```bash
git clone https://github.com/humptydumpty90/tasks-manager.git
cd tasks-manager
```

### Backend

```bash
cd backend
npm install
npm run build
npm run start
```

Create a `.env` file in `/backend`:

```env
PORT=3000

# Database
DB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/
DB_PORT=27017
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=tasks-manager

# Auth
JWT_SECRET_KEY=your_jwt_secret
COOKIE_SECRET_KEY=your_cookie_secret

# CORS
CLIENT_URLS=http://localhost:3000,http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

```bash
npm run start
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

```bash
npm run dev
```

---

## 📁 Project Structure

```
tasks-manager/
├── frontend/          
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── layouts/
│   │   ├── store/        
│   │   ├── interfaces/
│   │   ├── context/
│   │   └── utils/
│   └── Dockerfile
│
└── backend/
    ├── src/
    │   ├── api/
    │   │   └── v1/
    │   │       ├── controllers/
    │   │       └── routes/
    │   ├── repositories/    
    │   ├── services/
    │   ├── models/        
    │   ├── middlewares/
    │   ├── modules/
    │   ├── interfaces/
    │   ├── config/
    │   └── utils/
    └── Dockerfile
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/sign-up` | Register |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/me` | Get your user |
| GET | `/api/v1/auth/google` | OAuth initiation |
| GET | `/api/v1/auth/google/callback` | Google OAuth callback |

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/boards` | Get all boards |
| GET | `/api/v1/boards/:boardId` | Get board by ID |
| GET | `/api/v1/boards/:boardId/tasks` | Get all tasks for a board |
| POST | `/api/v1/boards` | Create a board |
| PUT | `/api/v1/boards/:boardId` | Update a board |
| DELETE | `/api/v1/boards/:boardId` | Delete a board |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks?boardId=:boardId` | Get all tasks for a board |
| GET | `/api/v1/tasks/:taskId` | Get task by ID |
| POST | `/api/v1/tasks` | Create a task |
| PUT | `/api/v1/tasks/:taskId` | Update a task |
| PUT | `/api/v1/tasks/:taskId/workflow` | Update task workflow status |
| DELETE | `/api/v1/tasks/:taskId` | Delete a task |
---

- **Workflows** — Tasks support three stages: `todo`, `in progress`, `done`