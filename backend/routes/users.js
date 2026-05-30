const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Image = require('../models/Image')
const { protect, adminOnly } = require('../middleware/auth')

// Get User Profile
router.get('/profile', protect, (req, res) => {
  res.json(req.user)
})

// Update User Profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get All Users (Admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    const usersWithStats = await Promise.all(users.map(async (u) => {
      const imagesCount = await Image.countDocuments({ user: u._id })
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        images: imagesCount,
        createdAt: u.createdAt.toISOString().split('T')[0]
      }
    }))
    res.json(usersWithStats)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update User Role (Admin)
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.role = req.body.role || user.role
    await user.save()
    res.json({ message: 'User role updated successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete User (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.email === 'admin@boew.com') return res.status(400).json({ message: 'Cannot delete main admin user' })

    await user.deleteOne()
    await Image.deleteMany({ user: req.params.id })
    res.json({ message: 'User and their images deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
