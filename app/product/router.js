const router = require('express').Router();
const productController = require('./controller');
const multer = require('multer');
const os = require('os');
const imageFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(null, false);
    }
    cb(null, true);
}

const upload = multer({
    dest: os.tmpdir(),
    fileFilter:imageFilter
});

router.post('/products', upload.single('image'), productController.store)

module.exports = router;