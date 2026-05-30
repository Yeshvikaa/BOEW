# BOEW Project — Content-Based Image Retrieval with Encrypted Words

A secure, privacy-preserving Content-Based Image Retrieval (CBIR) scheme using the Bag-of-Encrypted-Words (BoEW) architecture. This full-stack application allows users to securely upload images, extract localized visual feature descriptors, encrypt the visual words using high-entropy client-side keys, and perform exact visual queries over an encrypted database without revealing the original images to the server.

---

## 🚀 Key Features
- **Client-Side Image Encryption**: Local AES-like encryption and bag-of-words quantization prior to transmission.
- **Privacy-Preserving Retrieval**: Compares encrypted histograms on the server using high-speed cosine similarity.
- **Glassmorphic Analytics Console**: Responsive dark glassmorphism dashboard featuring real-time image analysis charts and search latency statistics.
- **Roster & User Control**: Secure user profile space, history logs, and administrative controls.

---

## 💻 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS (Dark Glassmorphic design), Recharts (Analytics), Axios, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Multer.
- **Security**: Local client-side AES-XOR encryption, JWT-authenticated API endpoints.

---

## 🛠️ Port Setup
- **Frontend URL**: `http://localhost:3000`
- **Backend URL**: `http://localhost:5000`

---

## ⚙️ Environment Configuration

### Frontend Config (`BOEW_Project/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend Config (`BOEW_Project/backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/boew_db
JWT_SECRET=boew_jwt_secret_key_2024
```

---

## 🏁 How to Get Started

### Prerequisites
- Node.js installed locally.
- MongoDB service running at `mongodb://127.0.0.1:27017`.

### Setup & Run Commands

1. **Backend Server Setup**
   ```bash
   cd BOEW_Project/backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd BOEW_Project
   npm install
   npm run dev
   ```

---

## 🔑 Administrative Demo Credentials
- **Admin Email**: `admin@boew.com`
- **Password**: `admin123`
*(Alternatively, registering the first user on the application automatically elevates them to admin status).*
