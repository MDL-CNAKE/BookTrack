const { z } = require('zod');
const { READING_STATUSES } = require('../utils/constants.util');

// Messaggio d'errore per un campo di testo: distingue "mancante" da "tipo sbagliato".
const requiredMessage = (label) => (issue) =>
  issue.input === undefined ? `${label} is required` : `${label} must be a string`;

// Stringa obbligatoria con messaggi chiari
const text = (label) => z.string({ error: requiredMessage(label) });

// Stato di lettura di un libro nella libreria
const readingStatus = z.enum(READING_STATUSES, { error: 'status must be "to_read" or "read"' });

// Id di un volume Google Books, es. "zyTCAlFPjgYC": lettere, numeri, "_" e "-".
const googleId = text('googleId')
  .trim()
  .regex(/^[A-Za-z0-9_-]{4,40}$/, 'googleId is not valid');

// Numero di pagina dei risultati: dall'URL arriva come stringa, z.coerce lo converte.
const page = z.coerce.number({ error: 'page must be a positive integer' }).int().positive().max(100);

module.exports = { text, readingStatus, googleId, page };
