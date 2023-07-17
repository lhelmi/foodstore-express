const Product = require('./model');
const config = require('../config');
const fs = require('fs');
const path = require('path');

async function update(req, res, next){
    try {
        let product = await Product.findOne({_id: req.params.id})
        if(!product) return res.status(404).send({ message: 'Data tidak ditemukan', data: null });
        let payload = req.body;
        if(req.file){
            let tmpPath = req.file.path;
            let originalExt = req.file.originalname.split('.') [req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let targetPath = path.resolve(config.rootPath, `public/upload/${filename}`);

            const src = fs.createReadStream(tmpPath); // (1) baca file yang masih di lokasi sementara 
            const dest = fs.createWriteStream(targetPath); // (2) pindahkan file ke lokasi permanen/tujuan
            src.pipe(dest); // (3) file mulai dipindahkan dari `src` ke `dest`
            
            src.on('end', async () => {
                // (2) dapatkan absolut path ke gambar dari produk yang akan diupdate
                let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
                // (3) cek apakah absolute path memang ada di file system
                if(fs.existsSync(currentImage)){
                    // (4) jika ada hapus dari file system
                    fs.unlinkSync(currentImage)
                }
                product = await Product.findOneAndUpdate(
                    {_id: req.params.id},
                    {...payload, image_url: filename},
                    {new: true, runValidators: true}
                );
                return res.json(product);
            });

            src.on('error', async() => {
                next(err);
            });

        }else{
            let product = await Product.findOneAndUpdate(
                {_id: req.params.id},
                payload,
                {new: true, runValidators: true}
            );
            return res.json(product);
        }
    } catch (error) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1, 
                message: err.message, 
                fields: err.errors
            });
        }
        next(err);
    }
}

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

            src.on('end', async () => {
                let product = new Product(
                    {...payload, image_url:filename}
                );
                await product.save();
                return res.json(product);
            });
            
            //naon boa
            src.on('error', async() => {
                console.log(err);
                return next(err);
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

async function destroy(req, res, next){
    try {
        let product = await Product.findOneAndDelete({
            _id : req.params.id
        })
        if(!product) return res.json({ 'message' : 'Data gagal dihapus' });
        let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
        
        if(fs.existsSync(currentImage)) fs.unlinkSync(currentImage)
        return res.json(product);
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

async function index(req, res, next){
    try {
        let { limit = 10, skip = 0 } = req.query;
        let products = await Product.find().limit(limit).skip(skip);

        return res.json(products);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

module.exports = {
    store,
    index,
    update,
    destroy
};