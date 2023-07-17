const router = require('express').Router();
const tagController = require('./controller');
const multer = require('multer');

router.post('/tag', multer().none(), tagController.store);
router.get('/tag', multer().none(), tagController.index);
router.get('/tag/:id', multer().none(), tagController.show);
router.delete('/tag/:id', multer().none(), tagController.destroy);
router.put('/tag/:id', multer().none(), tagController.update);

module.exports = router;