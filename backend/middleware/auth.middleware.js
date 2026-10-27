const passport = require('passport');
const AppError = require('../utils/app-error.util');

// Protegge le rotte private: il JWT deve essere valido e l'utente esistere.
// In caso di successo mette l'utente in req.user.
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) return next(error);
    if (!user) return next(new AppError(401, 'Unauthorized: invalid or missing token'));

    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = { authenticate };
