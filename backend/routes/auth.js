const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'boew_jwt_secret_key_2024', { expiresIn: '7d' })
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'User already exists' })

    // Auto-promote first user to admin for testing
    const count = await User.countDocuments()
    const role = (count === 0 || email === 'admin@boew.com') ? 'admin' : 'user'

    const user = await User.create({ name, email, password, role })
    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.comparePassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
