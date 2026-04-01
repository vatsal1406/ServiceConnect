# 🚀 ServiceConnect

A full-stack MERN application that connects users with local service providers like cleaners, plumbers, electricians, and more.

---

## 📌 Overview

ServiceConnect allows customers to easily find and book services, while vendors can register, list their services, and manage their work through a dedicated dashboard.

---

## ✨ Features

### 👤 User (Customer)

* Signup & Login authentication
* Browse available services
* View service details
* Location-based service access *(in progress)*

### 🛠️ Vendor

* Vendor registration with service selection
* Add multiple services (cleaning, plumbing, etc.)
* Location-based availability
* Vendor dashboard

### 🔐 Authentication

* JWT-based authentication
* Role-based access (Customer / Vendor / Admin)
* Secure password hashing (bcrypt)

---

## 🧱 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Framer Motion (animations)

### Backend

* Node.js
* Express.js

### Database

* MongoDB (with GeoJSON for location)

---

## 📂 Project Structure

```
service-connect/
│
├── backend/        # Express server & APIs
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── config/
│
├── src/            # React frontend
├── public/
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/service-connect.git
cd service-connect
```

---

### 2️⃣ Install dependencies

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd ..
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Run the project

#### Start backend:

```bash
cd backend
npm run dev
```

#### Start frontend:

```bash
cd ..
npm start
```

---

## 🌍 API Endpoints (Sample)

* `POST /api/auth/signup` → Register user/vendor
* `POST /api/auth/login` → Login
* `GET /api/services` → Get services
* `GET /api/vendors` → Get vendors

---

## 🧠 Future Enhancements

* 📍 Nearby vendor search (Geo queries)
* 📅 Booking & scheduling system
* 💳 Payment integration
* ⭐ Reviews & ratings
* 📱 Mobile responsiveness improvements

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📧 Contact

Developed by **Vatsal Bhindora**
Feel free to reach out for collaboration 🚀

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
