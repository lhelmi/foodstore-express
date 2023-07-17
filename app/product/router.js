const router = require('express').Router();
const productController = require('./controller');
const multer = require('multer');
const os = require('os');

router.post('/products', multer({dest: os.tmpdir()}).single('image'), productController.store)

module.exports = router;