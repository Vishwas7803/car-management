# 🚗 CarVault — Car Management Application

A full-stack car management app with authentication, CRUD operations, image uploads, and search.

## Project Structure

```
car-management/
├── server.js          # Express backend (all APIs)
├── package.json
├── data/              # JSON data files (auto-created)
├── uploads/           # Uploaded images (auto-created)
└── public/
    ├── index.html     # Single Page Application
    ├── css/style.css
    └── js/app.js
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the server
npm start

# 3. Open in browser
# http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | No | Register user |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/cars` | Yes | List user's cars (supports `?search=`) |
| POST | `/api/cars` | Yes | Create car (multipart/form-data) |
| GET | `/api/cars/:id` | Yes | Get car details |
| PUT | `/api/cars/:id` | Yes | Update car |
| DELETE | `/api/cars/:id` | Yes | Delete car |
| GET | `/api/docs` | No | Swagger UI docs |
| GET | `/api/docs-json` | No | OpenAPI JSON spec |

### Authentication
All protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Create/Update Car — Form Fields
- `title` (required)
- `description`
- `car_type` (tag)
- `company` (tag)
- `dealer` (tag)
- `images[]` — up to 10 image files (JPEG, PNG, GIF, WebP, max 5MB each)
- `remove_images[]` — (update only) paths of images to remove

## Features

- ✅ User signup / login with JWT authentication
- ✅ Add cars with up to 10 images
- ✅ Full-text search across title, description, tags
- ✅ View, edit, delete cars
- ✅ Swagger docs at `/api/docs`
- ✅ Dark-themed responsive SPA

## Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `JWT_SECRET` | (built-in) | Change in production! |

## Tech Stack
- **Backend**: Node.js, Express
- **Auth**: JWT + bcryptjs
- **Storage**: JSON files + local disk (easy to swap for MongoDB/PostgreSQL)
- **Docs**: Swagger UI
- **Frontend**: Vanilla HTML/CSS/JS (no framework needed)
