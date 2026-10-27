// Legge e controlla le variabili d'ambiente. Va caricato dopo dotenv.
// Se manca qualcosa di indispensabile il server si ferma subito con un messaggio chiaro.
const REQUIRED = ['MONGODB_URI', 'JWT_SECRET'];

const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Copy .env.example to .env and fill in the values.');
  process.exit(1);
}

if (!process.env.GOOGLE_BOOKS_API_KEY && process.env.NODE_ENV !== 'test') {
  console.warn('Warning: GOOGLE_BOOKS_API_KEY is not set, Google Books may answer "quota exceeded".');
}

module.exports = {
  isTest: process.env.NODE_ENV === 'test',
  port: Number(process.env.PORT) || 3000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  // Access token: breve, così un token rubato vale poco
  jwtExpire: process.env.JWT_EXPIRE || '15m',
  // Refresh token: lungo, serve solo a chiedere nuovi access token
  refreshTokenDays: Number(process.env.REFRESH_TOKEN_EXPIRE_DAYS) || 7,
  // Consigliata: senza chiave Google Books usa una quota condivisa, spesso esaurita
  googleBooksApiKey: process.env.GOOGLE_BOOKS_API_KEY || '',
};