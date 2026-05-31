const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const mongoose = require('mongoose')

dotenv.config()

const app = express()

// ✅ CORS FIX (IMPORTANT FOR RENDER FRONTEND)
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://boew-1.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Root route
app.get("/", (req, res) => {
  res.send("BOEW API is running 🚀")
})

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/boew_db'
    )

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`MongoDB Error: ${err.message}`)
    process.exit(1)
  }
}

// Connect DB
connectDB()

// API Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/images', require('./routes/images'))
app.use('/api/users', require('./routes/users'))

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
})

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || 'development'
    } mode`
  )
})
