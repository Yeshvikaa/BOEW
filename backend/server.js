const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const connectDB = async () => {
  try {
    const mongoose = require('mongoose')

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/boew_db'
    )

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Connect Database
connectDB()

// API Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/images', require('./routes/images'))
app.use('/api/users', require('./routes/users'))

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))

  // Express 5 compatible catch-all route
  app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('BOEW Secure Cloud Retrieval API is running...')
  })
}

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || 'development'
    } mode`
  )
})
