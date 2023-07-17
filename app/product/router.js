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
router.get('/products', productController.index);
router.put('/products/:id', upload.single('image'), productController.update)
router.delete('/products/:id', productController.destroy)

module.exports = router;