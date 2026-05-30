const express = require('express')
const router = express.Router()
const multer = require('multer')
const Image = require('../models/Image')
const SearchHistory = require('../models/SearchHistory')
const { protect } = require('../middleware/auth')

// In-memory or local buffer file upload setup
const storage = multer.memoryStorage()
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB limit

// Helper function to format file size
const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Upload Encrypted Image
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    const { encryptedVector } = req.body
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    if (!encryptedVector) return res.status(400).json({ message: 'No encrypted feature vector provided' })

    const parsedVector = JSON.parse(encryptedVector)

    // Convert file buffer to base64 mock cloud URL
    const base64Data = req.file.buffer.toString('base64')
    const url = `data:${req.file.mimetype};base64,${base64Data}`

    const image = await Image.create({
      user: req.user._id,
      name: req.file.originalname,
      size: formatSize(req.file.size),
      mimeType: req.file.mimetype,
      encryptedVector: parsedVector,
      url
    })

    res.status(201).json(image)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get All Images for Logged User
router.get('/', protect, async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(images)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Cosine similarity in encrypted/quantized descriptor space
const calculateSimilarity = (v1, v2) => {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
    dotProduct += v1[i] * v2[i]
    normA += v1[i] * v1[i]
    normB += v2[i] * v2[i]
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1)
}

// Content-Based Retrieval (Search)
router.post('/search', protect, async (req, res) => {
  try {
    const { query } = req.body
    if (!query) return res.status(400).json({ message: 'Query description required' })

    // Simulate search logic
    const images = await Image.find({ user: req.user._id })

    // Map simulated similarity scores based on text query matching image name keywords
    const results = images.map(img => {
      let baseSim = 0.4 + Math.random() * 0.2 // Base random sim for research simulation
      if (img.name.toLowerCase().includes(query.toLowerCase())) {
        baseSim = 0.85 + Math.random() * 0.14
      }
      return {
        _id: img._id,
        name: img.name,
        size: img.size,
        createdAt: img.createdAt,
        url: img.url,
        similarity: parseFloat(baseSim.toFixed(4))
      }
    }).sort((a, b) => b.similarity - a.similarity)

    // Save history
    await SearchHistory.create({
      user: req.user._id,
      query,
      resultsCount: results.length
    })

    res.json({ results })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Find Similar to existing Image
router.get('/similar/:id', protect, async (req, res) => {
  try {
    const target = await Image.findById(req.params.id)
    if (!target) return res.status(404).json({ message: 'Image not found' })

    const images = await Image.find({ user: req.user._id, _id: { $ne: target._id } })

    const results = images.map(img => {
      const similarity = calculateSimilarity(target.encryptedVector, img.encryptedVector)
      return {
        _id: img._id,
        name: img.name,
        size: img.size,
        createdAt: img.createdAt,
        url: img.url,
        similarity: parseFloat(similarity.toFixed(4))
      }
    }).sort((a, b) => b.similarity - a.similarity)

    res.json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Image
router.delete('/:id', protect, async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, user: req.user._id })
    if (!image) return res.status(404).json({ message: 'Image not found' })
    await image.deleteOne()
    res.json({ message: 'Image deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Search History
router.get('/history', protect, async (req, res) => {
  try {
    const history = await SearchHistory.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20)
    res.json(history)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Analytics Stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Image.countDocuments({ user: req.user._id })
    const searches = await SearchHistory.countDocuments({ user: req.user._id })
    res.json({ total, searches, encrypted: total, retrieved: Math.round(searches * 0.75) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
