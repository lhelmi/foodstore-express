const router = require('express').Router();
const controller = require('./controller');

router.get('/invoice/:order_id', controller.show);

module.exports = router;