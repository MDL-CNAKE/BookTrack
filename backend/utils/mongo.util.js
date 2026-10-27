// Codice di errore MongoDB per violazione di un indice univoco.
const isDuplicateKeyError = (error) => error?.code === 11000;

module.exports = { isDuplicateKeyError };