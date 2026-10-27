const { z } = require('zod');
const { text } = require('./common.validator');

const registerBody = z.object({
  username: text('username').trim().min(3, 'username must be at least 3 characters').max(30, 'username must be at most 30 characters'),
  email: text('email').trim().toLowerCase().pipe(z.email({ error: 'email is not valid' })),
  // 72 è il limite di bcrypt: oltre quel valore i caratteri verrebbero ignorati
  password: text('password').min(6, 'password must be at least 6 characters').max(72, 'password must be at most 72 characters'),
});

const loginBody = z.object({
  email: text('email').trim().toLowerCase().min(1, 'email is required'),
  password: text('password').min(1, 'password is required'),
});

const refreshBody = z.object({
  refreshToken: text('refreshToken').min(1, 'refreshToken is required'),
});

// Al logout il refresh token è facoltativo (il logout non deve mai fallire per un body vuoto).
const logoutBody = z.object({
  refreshToken: z.string({ error: 'refreshToken must be a string' }).optional(),
});

module.exports = { registerBody, loginBody, refreshBody, logoutBody };
