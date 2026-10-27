// Client dell'API Google Books: non conosce Express né il database.
// Documentazione: https://developers.google.com/books/docs/v1/using
const env = require('../../config/env.config');
const AppError = require('../utils/app-error.util');

const BASE = 'https://www.googleapis.com/books/v1';
const PAGE_SIZE = 10;

// Chiama Google Books e traduce gli errori in AppError (404 se non esiste, 503 se la quota è finita,
// 502 per tutto il resto).
async function googleFetch(path, params = {}) {
  const qs = new URLSearchParams(params);
  if (env.googleBooksApiKey) qs.set('key', env.googleBooksApiKey);

  let res;
  try {
    res = await fetch(`${BASE}${path}?${qs}`, { headers: { accept: 'application/json' } });
  } catch (error) {
    console.error('Google Books unreachable:', error.message);
    throw new AppError(502, 'Google Books service unavailable');
  }

  if (res.status === 404) throw new AppError(404, 'Book not found on Google Books');
  // Senza chiave la quota gratuita è condivisa e spesso esaurita: 429 "Quota exceeded"
  if (res.status === 429) {
    console.error('Google Books quota exceeded: set GOOGLE_BOOKS_API_KEY in .env');
    throw new AppError(503, 'Google Books quota exceeded, try again later');
  }
  if (!res.ok) {
    console.error(`Google Books error: HTTP ${res.status} on ${path}`);
    throw new AppError(502, 'Google Books service error');
  }
  return res.json();
}

// Converte un "volume" di Google Books nel formato, più semplice, usato dalla nostra API.
function toBook(volume) {
  const info = volume.volumeInfo || {};
  const thumbnail = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null;
  return {
    googleId: volume.id,
    title: info.title || 'Untitled',
    authors: info.authors || [],
    description: info.description || '',
    publishedDate: info.publishedDate || null,
    pageCount: info.pageCount ?? null,
    categories: info.categories || [],
    language: info.language || null,
    // Google restituisce spesso le immagini in http: le forziamo in https
    thumbnail: thumbnail ? thumbnail.replace(/^http:/, 'https:') : null,
  };
}

async function search(query, page = 1) {
  const data = await googleFetch('/volumes', {
    q: query,
    startIndex: (page - 1) * PAGE_SIZE,
    maxResults: PAGE_SIZE,
    printType: 'books',
  });
  return {
    page,
    totalItems: data.totalItems || 0,
    results: (data.items || []).map(toBook),
  };
}

async function getById(googleId) {
  return toBook(await googleFetch(`/volumes/${encodeURIComponent(googleId)}`));
}

module.exports = { search, getById, toBook, PAGE_SIZE };
