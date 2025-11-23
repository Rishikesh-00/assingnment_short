# TinyLink – URL Shortener

TinyLink is a simple URL shortener similar to bit.ly.  
Users can:

- Shorten long URLs
- Optionally choose a custom short code
- View click statistics for each link
- Manage (list & delete) links
- Get a shareable short URL

Backend: **Node.js + Express + Neon (Postgres)**  
Frontend: **React + Vite + Tailwind CSS**

---

## Features

### Backend

- `POST /api/links`  
  - Create a short link from a long URL  
  - Optional custom `code` (must match `[A-Za-z0-9]{6,8}`)  
  - Validates URL format  
  - Prevents duplicate codes (returns `409` if exists)  
  - Auto-generates a random code if not provided  
  - Returns full `shortUrl`

- `GET /api/links`  
  - List all links with clicks and timestamps

- `GET /api/links/:code`  
  - Get stats for a single link

- `DELETE /api/links/:code`  
  - Delete a specific short link

- `GET /:code`  
  - Redirects (HTTP 302) to the original URL  
  - Increments `clicks`  
  - Updates `last_clicked`

- `GET /healthz`  
  - Health check endpoint

### Frontend

- Form to create new short URLs (with optional custom code)
- Table listing all links:
  - Short code
  - Original URL
  - Click count
  - Actions: Copy link, Delete

---

## Project Structure

```bash
.
├─ backend/
│  ├─ .env
│  ├─ server.js
│  ├─ package.json
│  ├─ config/
│  │   └─ db.js
│  ├─ controllers/
│  │   └─ linkController.js
│  ├─ modals/
│  │   └─ linkModal.js
│  └─ routes/
│      └─ linkRoutes.js
└─ tinylink-frontend/
   ├─ src/
   │  ├─ api/
   │  │   └─ index.js
   │  ├─ components/
   │  │   ├─ LinkForm.jsx
   │  │   ├─ LinksTable.jsx
   │  │   └─ Toast.jsx
   │  ├─ App.jsx
   │  ├─ main.jsx
   │  └─ index.css
   ├─ package.json
