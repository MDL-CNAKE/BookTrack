const router = require('express').Router();
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const controller = require('../controllers/library.controller');
const { listLibraryQuery, addBookBody, googleIdParams, updateStatusBody } = require('../validators/library.validator');

router.use(authenticate); // tutta la libreria è privata

router.get('/', validate({ query: listLibraryQuery }), controller.listBooks); // ?status=to_read|read
router.post('/', validate({ body: addBookBody }), controller.addBook);
router.get('/:googleId', validate({ params: googleIdParams }), controller.getBook);
router.patch('/:googleId', validate({ params: googleIdParams, body: updateStatusBody }), controller.updateStatus);
router.delete('/:googleId', validate({ params: googleIdParams }), controller.removeBook);

module.exports = router;