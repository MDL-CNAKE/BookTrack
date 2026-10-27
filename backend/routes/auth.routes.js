const router = require('express').Router();
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const controller = require('../controllers/auth.controller');
const { registerBody, loginBody, refreshBody, logoutBody } = require('../validators/auth.validator');

router.post('/register', validate({ body: registerBody }), controller.register);
router.post('/login', validate({ body: loginBody }), controller.login);
router.post('/refresh', validate({ body: refreshBody }), controller.refresh);
router.post('/logout', validate({ body: logoutBody }), controller.logout); // volutamente senza authenticate: non deve mai fallire
router.get('/profile', authenticate, controller.getProfile);

module.exports = router;
