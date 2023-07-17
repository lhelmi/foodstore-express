const router = require('express').Router();
const categoryController = require('./controller');
const multer = require('multer');

router.post('/category', multer().none(), categoryController.store);
router.get('/category', multer().none(), categoryController.index);
router.get('/category/:id', multer().none(), categoryController.show);
router.delete('/category/:id', multer().none(), categoryController.destroy);
router.put('/category/:id', multer().none(), categoryController.update);

module.exports = router;