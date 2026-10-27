const User = require('../models/user.model');
const AppError = require('../utils/app-error.util');
const { isDuplicateKeyError } = require('../utils/mongo.util');
const tokenService = require('./token.service');

const USER_EXISTS = 'User already exists with this email or username';

// Dati dell'utente che si possono mostrare al client (mai la password).
const toPublicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
});

// Risposta comune a registrazione e login: utente + coppia di token.
const withTokens = async (user) => ({ user: toPublicUser(user), ...(await tokenService.issueTokens(user)) });

async function register({ username, email, password }) {
  const existing = await User.exists({ $or: [{ email }, { username }] });
  if (existing) throw new AppError(409, USER_EXISTS);

  let user;
  try {
    user = await User.create({ username, email, password });
  } catch (error) {
    // Due registrazioni contemporanee: ci pensa l'indice univoco
    if (isDuplicateKeyError(error)) throw new AppError(409, USER_EXISTS);
    throw error;
  }

  return withTokens(user);
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  // Stesso messaggio per email inesistente e password errata: non si rivela quali email sono registrate
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(401, 'Invalid credentials');
  }

  return withTokens(user);
}

// Rotazione: il refresh token usato viene eliminato e se ne crea uno nuovo insieme all'access token.
async function refresh(refreshToken) {
  const userId = await tokenService.consumeRefreshToken(refreshToken);
  const user = userId && (await User.findById(userId));
  if (!user) throw new AppError(401, 'Invalid or expired refresh token');

  return tokenService.issueTokens(user);
}

// Il logout non fallisce mai: cancella il refresh token se presente.
// L'access token non è revocabile: scade da solo (JWT_EXPIRE). Il client elimina comunque i suoi token.
async function logout({ refreshToken }) {
  if (refreshToken) await tokenService.revokeRefreshToken(refreshToken);
}

module.exports = { toPublicUser, register, login, refresh, logout };
