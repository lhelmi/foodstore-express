const Product = require('./model');
const config = require('../config');
const fs = require('fs');
const path = require('path');

async function store(req, res, next){
    let payload = req.body;
    try {
        if(req.file){
            let tmpPath = req.file.path;
            let originalExt = req.file.originalname.split('.') [req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let targetPath = path.resolve(config.rootPath, `public/upload/${filename}`);

            const src = fs.createReadStream(tmpPath);
            const dest = fs.createWriteStream(targetPath);
            src.pipe(dest);

            src.on('end', async () => {
                let product = new Product(
                    {...payload, image_url:filename}
                );
                await product.save();
                return res.json(product);
            });

            src.on('error', async() => {
                next(err);
            });
               
        }else{
            let product = new Product(payload);
            await product.save();
            return res.json(product);
        }
    } catch (error) {
        if(error && error.name === 'ValidationError'){
            return res.json({
                error: 1, 
                message: error.message, 
                fields: error.errors
            });
        }
        console.log(error.message);
        next(error);
    }
}

module.exports = {
    store
};