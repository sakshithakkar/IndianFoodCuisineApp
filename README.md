# Indian Dish Finder 🍛

A full-stack web application to browse, search, and discover Indian dishes. Users can filter dishes, get suggestions based on available ingredients, and explore dish details.

Built using:

- ⚛️ React + Fluent UI (v9)
- 🧠 Node.js + Express
- 🐬 MySQL
- 🔐 JWT Authentication

---

## 🚀 Features

### 🔍 Dish Explorer
- Filter by **diet**, **flavor**, **state**
- Sort by **name**, **prep time**, **cook time**
- Pagination with "First", "Previous", "Next", "Last" controls
- Dish details view with breadcrumbs

### 🧠 Dish Suggester
- Select multiple ingredients via ComboBox
- Get dish suggestions using selected ingredients
- Tags for selected ingredients with remove functionality

### 🔐 Authentication
- Register & Login with hashed passwords (`bcrypt`)
- Token-based authentication (`JWT`)
- Protected route for adding new dishes

---

## 📁 Project Structure
```
INDIANFOODCUISINEAPP/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── app.js
│   ├── db.js
│   ├── swagger.yaml
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── .gitignore
```


---

## ⚙️ Environment Setup

### 🗂️ Database Setup
You can set up the database in two ways:

✅ Option 1: Using Provided SQL Dump
Import the prebuilt indian_cuisine.sql file from into your MySQL server:

✅ Option 2: Convert from CSV
Follow instructions in csv_to_sql.sql to convert the given dataset into SQL and populate your database manually.

### 🔧 Backend (`/backend`)

Create a `.env` file inside `/backend` with:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=indian_cuisine
PORT=3001
JWT_SECRET=jwt_secret
```
Install dependencies and start server:

```cd backend
npm install
npm start
```

Server runs on http://localhost:3001

### 🔧 Frontend (`/frontend`)

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:3001
```

```
cd frontend
npm install
npm run dev
```
App will run at: http://localhost:5173

---

### 📄 Swagger Docs
Visit: http://localhost:3001/api-docs

## 🧪 Setup & Run Locally

### ✅ Prerequisites
- Node.js
- MySQL


### 🧠 Future Improvements
Image upload for dishes

CRUD operations for admin users

Profile management

Internationalization (i18n)

Save Favorite Dishes For Users

Add Dishes by Users 

Like/Comment Feature On Dish 

### 🧠 Features
Search dishes by flavor, state, diet

Get dish suggestions from selected ingredients

View detailed dish info with breadcrumbs

Register/Login functionality

JWT-secured "Add Dish" page

Modern Fluent UI v9 styling

Debounced search & paginated grid
