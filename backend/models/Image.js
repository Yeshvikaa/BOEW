const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  mimeType: { type: String, required: true },
  encryptedVector: { type: [Number], required: true }, // Encrypted BoW histogram
  encryptedData: { type: String }, // Base64 simulated encrypted image data
  url: { type: String }, // Simulated cloud URL or fallback
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Image', imageSchema)
