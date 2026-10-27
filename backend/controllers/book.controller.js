// Catalogo Open library: il controller passa i dati validati al service e restituisce il risultato.
const googleBooks = require('../services/googlebooks.service');

exports.search = async (req, res) => {
  const { q, page } = req.valid.query;
  res.json(await googleBooks.search(q, page));
};

exports.getDetails = async (req, res) => {
  res.json(await googleBooks.getById(req.valid.params.googleId));
};