

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../../config/env.config');
const RefreshToken = require('../models/refresh-token.model');

const ALGORITHM = 'HS256';
const DAY_MS = 24 * 60 * 60 * 1000;


const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// ---------- Access token ----------

const signAccessToken = (user) =>
  jwt.sign({ id: user._id }, env.jwtSecret, {
    algorithm: ALGORITHM,
    expiresIn: env.jwtExpire,
  });

// ---------- Refresh token ----------

async function createRefreshToken(user) {
  const token = crypto.randomBytes(48).toString('hex'); // 96 caratteri casuali, non indovinabili
  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + env.refreshTokenDays * DAY_MS),
  });
  return token;
}


async function consumeRefreshToken(token) {
  const stored = await RefreshToken.findOneAndDelete({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() }, // il TTL di MongoDB non è istantaneo: controlliamo noi la scadenza
  });
  return stored ? stored.userId : null;
}

const revokeRefreshToken = (token) => RefreshToken.deleteOne({ tokenHash: hashToken(token) });

// Coppia di token restituita da registrazione, login e refresh.
async function issueTokens(user) {
  return {
    accessToken: signAccessToken(user),
    refreshToken: await createRefreshToken(user),
  };
}

module.exports = {
  consumeRefreshToken,
  revokeRefreshToken,
  issueTokens,
};
