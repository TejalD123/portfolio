# Data Science / ML Portfolio — Backend (MERN)

Node.js + Express + MongoDB backend for a Data Science / Machine Learning portfolio website.
Built for the fields you asked for: **project field/category, case studies, tech stack, project info, and resume**.

## 1. Setup

```bash
cd portfolio-backend
npm install
cp .env.example .env
# edit .env -> set MONGO_URI, JWT_SECRET etc.
npm run dev      # nodemon (auto-restart)
# or
npm start
```

Make sure MongoDB is running locally, or set `MONGO_URI` to your MongoDB Atlas connection string.

## 2. Folder Structure

```
portfolio-backend/
├── config/db.js              # MongoDB connection
├── models/
│   ├── Project.js            # field, info, caseStudy, techStack, images, links
│   ├── Profile.js            # about info, resume, skills, education, social links
│   ├── Contact.js            # contact form messages
│   └── Admin.js              # admin login (for your dashboard, if you build one)
├── controllers/               # business logic
├── routes/                    # API endpoints
├── middleware/
│   ├── auth.js                # JWT protect middleware
│   └── upload.js               # multer file upload (resume PDF + project images)
├── uploads/
│   ├── resume/                 # uploaded resume PDFs
│   └── projects/                # uploaded project images
├── server.js
└── .env
```

## 3. First-time Setup — create your admin login

Since only you (portfolio owner) should add/edit/delete projects, create an admin account once:

```
POST /api/auth/register
Body (JSON): {
  "email": "you@example.com",
  "password": "yourpassword",
  "secretKey": "the ADMIN_REGISTER_SECRET value from your .env"
}
```

This returns a JWT `token`. Use it in the `Authorization: Bearer <token>` header for all protected routes.

**Security note:** registration only works if `secretKey` matches `ADMIN_REGISTER_SECRET` in your `.env`.
Nobody can create an admin account without knowing this secret — so you don't strictly need to remove
the `/register` route, but it's still good practice to disable it after you've created your one admin account.

Then log in any time with:
```
POST /api/auth/login
Body: { "email": "you@example.com", "password": "yourpassword" }
```

## 4. API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public (once) | Create admin account |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Projects
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/projects` | Public | Get all projects. Query params: `?field=Machine Learning`, `?search=covid`, `?featured=true` |
| GET | `/api/projects/fields/all` | Public | Get distinct list of fields/categories (for filter dropdown) |
| GET | `/api/projects/:id` | Public | Get single project |
| POST | `/api/projects` | Private | Create project (multipart/form-data — see below) |
| PUT | `/api/projects/:id` | Private | Update project |
| DELETE | `/api/projects/:id` | Private | Delete project |

**Create/Update project — form-data fields:**
```
title           : "Customer Churn Prediction"
field           : "Machine Learning"
info            : "Predicts customer churn using XGBoost with 92% accuracy."
techStack       : "Python, Pandas, Scikit-learn, XGBoost, Flask"   (comma-separated)
caseStudy       : JSON string, e.g.
                  {"problemStatement":"...","approach":"...","dataset":"...","results":"...","learnings":"..."}
githubLink      : "https://github.com/you/churn-prediction"
liveDemoLink    : "https://your-demo.com"
datasetLink     : "https://kaggle.com/dataset-link"
featured        : true/false
thumbnail       : (file upload, image)
images          : (file upload, up to 5 images)
```

### Profile / About / Resume
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/profile` | Public | Get profile info |
| GET | `/api/profile/resume` | Public | Get resume file URL |
| POST | `/api/profile` | Private | Create profile (first time) |
| PUT | `/api/profile` | Private | Update profile / upload new resume |

**Create/Update profile — form-data fields:**
```
name            : "Your Name"
title           : "Aspiring Data Scientist | ML Enthusiast"
bio             : "Short about-me paragraph..."
email           : "you@example.com"
phone           : "+91xxxxxxxxxx"
location        : "Pune, India"
skills          : "Python, SQL, Machine Learning, Deep Learning, Power BI"  (comma-separated)
socialLinks     : JSON string, e.g. {"github":"...","linkedin":"...","kaggle":"..."}
education       : JSON string array, e.g. [{"degree":"B.Tech CSE","institution":"...","year":"2026"}]
experience      : JSON string array
resume          : (file upload, PDF only)
```

### Contact Form
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/contact` | Public | Visitor submits contact form: `{ name, email, subject, message }` |
| GET | `/api/contact` | Private | Get all messages |
| PATCH | `/api/contact/:id/read` | Private | Mark message as read |
| DELETE | `/api/contact/:id` | Private | Delete message |

## 5. Uploaded files

Uploaded resume/images are served statically at:
```
http://localhost:5000/uploads/resume/<filename>
http://localhost:5000/uploads/projects/<filename>
```

## 6. Connecting to your React (MERN) frontend

Set `CLIENT_URL` in `.env` to your React app's URL (e.g. `http://localhost:3000`) so CORS allows it.
From React, call the API, e.g.:
```js
fetch("http://localhost:5000/api/projects?field=Machine Learning")
  .then(res => res.json())
  .then(data => console.log(data.data));
```

For admin actions (create/update/delete project, update profile), send the JWT token:
```js
fetch("http://localhost:5000/api/projects", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData, // FormData object, since files are involved
});
```

## 7. Suggested next steps
- Build simple React admin panel (protected by the JWT) to add/edit projects & update resume — no need to touch DB manually.
- Deploy: MongoDB Atlas (free tier) + Render/Railway for this backend + Vercel/Netlify for React frontend.
- Add rate-limiting (`express-rate-limit`) on `/api/contact` and `/api/auth/login` before going live.
