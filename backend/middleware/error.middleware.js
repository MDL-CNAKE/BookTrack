const AppError = require('../utils/app-error.util');
const { isDuplicateKeyError } = require('../utils/mongo.util');

// Risposta per le rotte che non esistono.
const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

// Unico punto in cui gli errori diventano risposte JSON { message }.
// Express 5 inoltra qui anche gli errori delle funzioni async.
const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    const body = { message: error.message };
    if (error.errors) body.errors = error.errors;
    return res.status(error.status).json(body);
  }

  // Gestisce i json malformato nel body della richiesta
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body too large' });
  }

  // Errori di validazione dello schema Mongoose (ultima difesa dopo Zod)
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(({ path, message }) => ({ field: path, message }));
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  if (isDuplicateKeyError(error)) {
    return res.status(409).json({ message: 'Resource already exists' });
  }

  console.error('Unexpected error:', error);
  return res.status(500).json({ message: 'Server error' });
};

module.exports = { notFoundHandler, errorHandler };
