// Punto di avvio: carica il .env, si collega a MongoDB e mette in ascolto l'app.
// Le variabili d'ambiente vanno caricate prima di tutto il resto.
require('dotenv').config({ quiet: true });

const env = require('./config/env.config');
const connectDB = require('./config/db.config');
const app = require('./app');

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
    console.log(`Visit http://localhost:${env.port} to test`);
  });
};

startServer();