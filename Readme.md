# Social App — Backend

Node.js + Express + MongoDB REST API.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts with nodemon on port 5000
```

## Environment variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `CLOUDINARY_CLOUD_NAME` | From cloudinary.com dashboard |
| `CLOUDINARY_API_KEY` | From cloudinary.com dashboard |
| `CLOUDINARY_API_SECRET` | From cloudinary.com dashboard |
| `CLIENT_URL` | Frontend URL (for CORS) |

## API Endpoints

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Posts
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/posts?page=1&limit=10` | No | Paginated public feed |
| POST | `/api/posts` | Yes | Create post (multipart/form-data) |
| PATCH | `/api/posts/:id/like` | Yes | Toggle like |
| POST | `/api/posts/:id/comment` | Yes | Add comment |
| DELETE | `/api/posts/:id` | Yes | Delete own post |

### Creating a post with an image
Send as `multipart/form-data`:
- `text` (string, optional)
- `image` (file, optional — jpg/png/webp, max 5MB)

## Deployment (Render)

1. Push code to GitHub
2. Create a new **Web Service** on Render
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables in Render dashboard


# Social App — Frontend

React.js + Material UI frontend.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # set your backend URL
npm start              # runs on http://localhost:3000
```

## Environment variables

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Your backend URL e.g. `https://your-app.onrender.com/api` |

## Project structure

```
src/
  api/          → Axios client + all API calls
  components/   → Navbar, CreatePost, PostCard, ProtectedRoute
  context/      → AuthContext (global user state)
  pages/        → Feed, Login, Signup
  theme.js      → MUI theme
  App.js        → Routes
```

## Deployment (Vercel)

1. Push to GitHub
2. Import repo on vercel.com
3. Set root directory to `frontend`
4. Add `REACT_APP_API_URL` environment variable pointing to your Render backend
5. Deploy