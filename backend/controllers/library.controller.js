const libraryService = require('../services/library.service');

exports.listBooks = async (req, res) => {
  res.json(await libraryService.list(req.user._id, req.valid.query));
};

exports.addBook = async (req, res) => {
  res.status(201).json(await libraryService.add(req.user._id, req.valid.body));
};

exports.getBook = async (req, res) => {
  res.json(await libraryService.getOne(req.user._id, req.valid.params.googleId));
};

exports.updateStatus = async (req, res) => {
  const book = await libraryService.updateStatus(req.user._id, req.valid.params.googleId, req.valid.body.status);
  res.json(book);
};

exports.removeBook = async (req, res) => {
  await libraryService.remove(req.user._id, req.valid.params.googleId);
  res.json({ message: 'Book removed from library' });
};
