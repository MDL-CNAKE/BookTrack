const { z } = require('zod');
const { googleId, readingStatus } = require('./common.validator');

const listLibraryQuery = z.object({ status: readingStatus.optional() });

// Aggiunta in libreria: l'id Google Books è obbligatorio, lo stato facoltativo (default "to_read").
const addBookBody = z.object({ googleId, status: readingStatus.optional() });

const googleIdParams = z.object({ googleId });

const updateStatusBody = z.object({ status: readingStatus });

module.exports = { listLibraryQuery, addBookBody, googleIdParams, updateStatusBody };
