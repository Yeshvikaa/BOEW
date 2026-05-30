// Simulated encryption utilities for BOEW (Bag of Encrypted Words)
// In production, replace with proper AES-256 or homomorphic encryption

const SALT = 'boew_secret_salt_2024'

// Simple XOR-based encryption simulation
export function encryptData(data, key = SALT) {
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  let encrypted = ''
  for (let i = 0; i < str.length; i++) {
    encrypted += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return btoa(encrypted)
}

export function decryptData(encryptedBase64, key = SALT) {
  try {
    const encrypted = atob(encryptedBase64)
    let decrypted = ''
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return decrypted
  } catch { return null }
}

// Generate a simulated visual feature vector (Bag of Words histogram)
export function generateFeatureVector(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const buffer = new Uint8Array(e.target.result)
      // Simulate 128-bin histogram of byte values
      const histogram = new Array(128).fill(0)
      buffer.forEach(byte => { histogram[byte % 128]++ })
      const total = buffer.length || 1
      const normalized = histogram.map(v => parseFloat((v / total).toFixed(6)))
      resolve(normalized)
    }
    reader.readAsArrayBuffer(file)
  })
}

// Encrypt the feature vector using the user key
export function encryptVector(vector, userKey) {
  const combined = `${userKey}_${SALT}`
  return vector.map((val, i) => {
    const shift = combined.charCodeAt(i % combined.length) / 255
    return parseFloat((val + shift * 0.001).toFixed(6))
  })
}

// Compare two encrypted vectors (cosine similarity on encrypted domain)
export function compareVectors(v1, v2) {
  let dot = 0, mag1 = 0, mag2 = 0
  for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
    dot += v1[i] * v2[i]
    mag1 += v1[i] ** 2
    mag2 += v2[i] ** 2
  }
  const similarity = dot / (Math.sqrt(mag1) * Math.sqrt(mag2) || 1)
  return parseFloat(similarity.toFixed(4))
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
