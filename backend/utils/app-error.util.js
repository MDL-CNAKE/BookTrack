// Errore applicativo con codice HTTP. Services e controller lo lanciano,
// il middleware degli errori lo trasforma nella risposta JSON { message }.
class AppError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors; // opzionale: dettagli per campo (validazione)
  }
}

module.exports = AppError;
