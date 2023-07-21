const Product = require('./model');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const Category = require('../category/model');
const Tag = require('../tag/model');
const { policyFor } = require('../policy/index');

async function show(req, res, next){
    try {
        let product = await Product.findOne({_id: req.params.id})
        if(!product) return res.status(404).send({ message: 'Data tidak ditemukan', data: null });
        return res.json(product);
        
    } catch (error) {
        next(error);
    }
}

async function showWithCategory(req, res, next){
    try {
        let product = await Product.findOne({_id: req.params.id}).populate('category');
        if(!product) return res.status(404).send({ message: 'Data tidak ditemukan', data: null });
        return res.json(product);
        
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('update', 'Product')){
            return res.json({
                error: 1, 
                message: `Anda tidak memiliki akses untuk membuat produk`
            });
        }
        let product = await Product.findOne({_id: req.params.id})
        if(!product) return res.status(404).send({ message: 'Data tidak ditemukan', data: null });
        let payload = req.body;
        if(payload.category){
            let category = await Category.findOne({
                name: {
                    $regex: payload.category, $options: 'i'
                }
            });
            if(category){
                payload = {...payload, category : category._id};
            }else{
                delete payload.category;
            }
        }

        if(payload.tags){
            let tags = await Tag.find({
                name : {
                    $in : payload.tags
                }
            });

            if(tags.length){
               payload = {...payload, tags: tags.map(tag=> tag._id)} 
            }
        }

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
                next(error);
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
        if(error && error.name === 'ValidationError'){
            return res.json({
                error: 1, 
                message: error.message, 
                fields: error.errors
            });
        }
        next(error);
    }
}


async function store(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('create', 'Product')){
            return res.json({
                error: 1, 
                message: `Anda tidak memiliki akses untuk membuat produk`
            });
        }

        let payload = req.body;
        if(payload.category){
            let category = await Category.findOne({
                name : {
                    $regex: payload.category, $options: 'i'
                }
            });
            if(category){
                payload = {...payload, category:category._id};
            }else{
                delete payload.category;
            }
        }

        if(payload.tags && payload.tags.length){
            let tags = await Tag.find({
                name: {
                    $in: payload.tags
                }
            })

            if(tags.length){
                payload = {...payload, tags: tags.map(tag => tag._id)};
            }
        }

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
                return next(error);
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
        let policy = policyFor(req.user);
        if(!policy.can('delete', 'Product')){
            return res.json({
                error: 1, 
                message: `Anda tidak memiliki akses untuk membuat produk`
            });
        }
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
        let { limit = 10, skip = 0, q = '', category = '', tags = [] } = req.query;
        let criteria = {};
        if(q.length){
            criteria = {
                ...criteria, 
                name: {$regex: `${q}`, $options: 'i'}
            }
        }
        
        if(category.length){
            category = await Category.findOne({name: {$regex:`${category}`, $options: 'i'}});
            
            if(category) {
                criteria = {...criteria, category: category._id}
            }
        }

        if(tags.length){
            tags = await Tag.find({
                name: {
                    $in : tags
                }
            });
            
            if(tags.length){
                criteria = {
                    ...criteria,
                    tags: {
                        $in : tags.map(tag => tag._id)
                    }
                }
            }
        }

        let products = await Product.find(criteria).limit(parseInt(limit)).skip(parseInt(skip))
        .populate('category')
        .populate('tags');

        if(!products.length) return res.json({'message' : 'data tidak ditemukan'});

        let count = await Product.find(criteria).countDocuments();

        return res.json({'data' : products, 'count' : count});
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

module.exports = {
    store,
    index,
    update,
    destroy,
    show,
    showWithCategory
};