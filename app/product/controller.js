const Product = require('./model');
const config = require('../config');
const fs = require('fs');
const path = require('path');

async function store(req, res, next){
    try {
        let payload = req.body;
        if(req.file){
            let tmpPath = req.file.path;
            let originalExt = req.file.originalname.split('.') [req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let targetPath = path.resolve(config.rootPath, `public/upload/${filename}`);

            const src = fs.createReadStream(tmpPath); // (1) baca file yang masih di lokasi sementara 
            const dest = fs.createWriteStream(targetPath); // (2) pindahkan file ke lokasi permanen/tujuan
            src.pipe(dest); // (3) file mulai dipindahkan dari `src` ke `dest`

            //naon boa
            src.on('error', async() => {
                console.log(err);
                return next(err);
            });

            src.on('end', async () => {
                let product = new Product(
                    {...payload, image_url:filename}
                );
                await product.save();
                return res.json(product);
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