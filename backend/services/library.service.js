
const Book = require('../models/book.model');
const AppError = require('../utils/app-error.util');
const { isDuplicateKeyError } = require('../utils/mongo.util');
const openlibrary = require('./openlibrary.service');

const NOT_FOUND = 'Book not found in your library';
const ALREADY_SAVED = 'Book already in your library';


function list(userId, { status } = {}) {
  const filter = { userId };
  if (status) filter.status = status;
  return Book.find(filter).sort({ updatedAt: -1 });
}

async function getOne(userId, olidId) {
  const book = await Book.findOne({ userId, olidId });
  if (!book) throw new AppError(404, NOT_FOUND);
  return book;
}


async function add(userId, { olidId, status }) {
  if (await Book.exists({ userId, olidId })) throw new AppError(409, ALREADY_SAVED);

  const data = await openlibrary
.getById(olidId);
  try {
    return await Book.create({
      userId,
      olidId,
      title: data.title,
      authors: data.authors,
      description: data.description,
      publishedDate: data.publishedDate,
      pageCount: data.pageCount,
      thumbnail: data.thumbnail,
      status,
    });
  } catch (error) {

    if (isDuplicateKeyError(error)) throw new AppError(409, ALREADY_SAVED);
    throw error;
  }
}

async function updateStatus(userId, olidId, status) {
  const book = await Book.findOneAndUpdate({ userId, olidId }, { status }, { new: true, runValidators: true });
  if (!book) throw new AppError(404, NOT_FOUND);
  return book;
}

async function remove(userId, olidId) {
  const removed = await Book.findOneAndDelete({ userId, olidId });
  if (!removed) throw new AppError(404, NOT_FOUND);
}

module.exports = { list, getOne, add, updateStatus, remove };
