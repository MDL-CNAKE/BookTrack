const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const env = require('./env.config');
const User = require('../backend/models/user.model');

// Opzioni della strategia JWT: token nell'header Authorization (Bearer), solo HS256.
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwtSecret,
  algorithms: ['HS256'],
};

// Dato il payload del JWT, carica l'utente dal database.
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      return done(null, user || false);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
