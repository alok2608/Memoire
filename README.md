# 🧠 Memoire — Personal Notes & Bookmark Manager

Memoire is a full-stack web app for organizing personal notes and saving useful bookmarks. It features a clean, responsive interface built with React and Tailwind CSS, backed by a powerful Express + MongoDB API for managing notes and bookmarks with support for tagging, search, favorites, and metadata auto-fetching.

---

## ✨ Features

- 📝 Create, edit, delete notes
- 🔖 Save bookmarks with title, URL, description
- 🔍 Search and filter by tags or text
- ⭐ Mark notes and bookmarks as favorites
- 🧠 Auto-fetch bookmark title from URL (bonus)
- 📱 Responsive UI with Tailwind CSS
- 🚫 No login required — stores all data centrally (or for single user)

---

## 🧰 Tech Stack

| Layer     | Stack                                   |
|-----------|------------------------------------------|
| Frontend  | React (Vite) + Tailwind + React Router   |
| Backend   | Node.js + Express + MongoDB + Mongoose   |
| Styling   | Tailwind CSS + shadcn/ui + Lucide Icons  |
| Metadata  | Axios + Cheerio for bookmark previews    |

---

## ⚙️ Setup Instructions

### 🔹 1. Clone the Project

```bash
git clone https://github.com/yourusername/memoire.git
cd memoire
```

### 🔹 2. Setup Backend (`/notes-bookmark-backend`)

```bash
cd notes-bookmark-backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://alokpatel2608:Alok123@cluster0.6f9dfti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

Start the server:

```bash
npm run dev
```

Server will run at `http://localhost:5000/api`

---

### 🔹 3. Setup Frontend (`/frontend`)

```bash
cd ../frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

---

## 🔌 API Documentation

### 📝 Notes API

| Method | Route              | Description         |
|--------|--------------------|---------------------|
| GET    | `/api/notes`       | Get all notes       |
| POST   | `/api/notes`       | Create new note     |
| GET    | `/api/notes/:id`   | Get single note     |
| PUT    | `/api/notes/:id`   | Update note         |
| DELETE | `/api/notes/:id`   | Delete note         |

#### ✅ Example Payload (POST / PUT)

```json
{
  "title": "Meeting Notes",
  "content": "Talked about roadmap.",
  "tags": ["work", "planning"],
  "favorite": false
}
```

---

### 🔖 Bookmarks API

| Method | Route                  | Description             |
|--------|------------------------|-------------------------|
| GET    | `/api/bookmarks`       | Get all bookmarks       |
| POST   | `/api/bookmarks`       | Create new bookmark     |
| GET    | `/api/bookmarks/:id`   | Get single bookmark     |
| PUT    | `/api/bookmarks/:id`   | Update bookmark         |
| DELETE | `/api/bookmarks/:id`   | Delete bookmark         |

#### ✅ Example Payload (POST / PUT)

```json
{
  "title": "Tailwind Docs",
  "url": "https://tailwindcss.com",
  "description": "CSS utility framework",
  "tags": ["frontend", "css"],
  "favorite": true
}
```

---

## 📬 Sample cURL Requests

```bash
# Create a note
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Example content","tags":["demo"]}'

# Fetch all bookmarks
curl http://localhost:5000/api/bookmarks
```

---

## 🧪 Skills This Demonstrates

✅ REST API Design  
✅ Data Validation & Error Handling  
✅ Real-world Data Modeling  
✅ React (Vite) Routing & State Management  
✅ Tailwind CSS & UI Components  
✅ Component Reusability & Clean Architecture  

---

## 📁 Folder Structure

```
memoire/
├── frontend/
│   ├── public/                 # Favicon, robots.txt, placeholder.svg
│   └── src/
│       ├── components/         # UI components (buttons, cards, dialogs, etc.)
│       ├── hooks/              # Custom React hooks (e.g., toast)
│       ├── lib/                # Utility functions (e.g., class name merging)
│       ├── pages/              # Route pages (Notes, Bookmarks, Index, NotFound)
│       ├── App.tsx             # Main app component
│       ├── App.css             # App-level styles
│       ├── index.css           # Tailwind base styles
│       ├── main.tsx            # React entry point
│       └── vite-env.d.ts       # Vite type definitions
│
│   ├── index.html              # HTML template
│   ├── .env                    # Frontend environment variables (VITE_API_URL)
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS config
│   ├── tsconfig.*              # TypeScript configuration
│   └── package.json            # Frontend dependencies and scripts
│
├── backend/
│   ├── routes/                 # Express routes (notes.js, bookmarks.js)
│   ├── controllers/            # Route logic and business rules
│   ├── models/                 # Mongoose schemas for Note and Bookmark
│   ├── utils/                  # Utilities like metadata scraping
│   ├── .env                    # Backend environment variables (PORT, MONGO_URI)
│   ├── server.js               # Main Express app entry point
│   └── package.json            # Backend dependencies and scripts
│
└── README.md                   # Project documentation
```

---




