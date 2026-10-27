// Catalogo OpenLibrary: rotte pubbliche di sola lettura.
// Il salvataggio dei libri nella libreria dell'utente è in library.routes.js.
const router = require('express').Router();
const validate = require('../middleware/validate.middleware');
const controller = require('../controllers/book.controller');
const { searchQuery, googleIdParams } = require('../validators/book.validator');

router.get('/search', validate({ query: searchQuery }), controller.search); // ?q=...&page=
router.get('/:googleId', validate({ params: googleIdParams }), controller.getDetails);

module.exports = router;