const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  const result = await authService.register(req.valid.body);
  res.status(201).json({ message: 'User registered successfully', ...result });
};

exports.login = async (req, res) => {
  const result = await authService.login(req.valid.body);
  res.status(200).json({ message: 'Login successful', ...result });
};

exports.refresh = async (req, res) => {
  const tokens = await authService.refresh(req.valid.body.refreshToken);
  res.status(200).json({ message: 'Token refreshed', ...tokens });
};

// Risponde sempre 200, anche senza token o con token scaduti (vedi authService.logout).
exports.logout = async (req, res) => {
  await authService.logout({ refreshToken: req.valid.body.refreshToken });
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getProfile = (req, res) => {
  res.status(200).json({
    message: 'Profile retrieved successfully',
    user: authService.toPublicUser(req.user),
  });
};