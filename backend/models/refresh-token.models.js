const mongoose = require('mongoose');

// Refresh token attivi. Si salva solo l'hash SHA-256:
// chi leggesse il database non potrebbe usarli.
const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// MongoDB elimina da solo i refresh token scaduti (indice TTL).
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);