const mongoose = require('mongoose');
const { READING_STATUSES } = require('../utils/constants.util');

// Libro salvato nella libreria di un utente, con i dati copiati da Google Books
// (così la libreria si mostra senza richiamare l'API) e lo stato di lettura.
const bookSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    googleId: { type: String, required: true },
    title: { type: String, required: true },
    authors: { type: [String], default: [] },
    description: { type: String, default: '' },
    publishedDate: { type: String, default: null }, // Google la dà incompleta: "2005", "2005-06"...
    pageCount: { type: Number, default: null },
    thumbnail: { type: String, default: null },
    status: { type: String, enum: READING_STATUSES, default: 'to_read' },
  },
  { timestamps: true }
);

// Lo stesso libro può essere salvato una sola volta per utente.
bookSchema.index({ userId: 1, googleId: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);