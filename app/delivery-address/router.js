const router = require('express').Router();
const controller = require('./controller');
const multer = require('multer');

router.post('/delivery-address', multer().none(), controller.store);
router.put('/delivery-address/:id', multer().none(), controller.update);
router.delete('/delivery-address/:id', multer().none(), controller.destroy);
router.get('/delivery-address', multer().none(), controller.index);

module.exports = router;