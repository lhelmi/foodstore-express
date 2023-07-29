const router = require('express').Router();
const controller = require('./controller');
const multer = require('multer');

router.put('/carts', multer().none(), controller.update);
router.get('/carts', controller.index);

module.exports = router;