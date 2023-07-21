const Tag = require('./model');

async function store(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('create', 'Tag')){
            return res.json({
                error: 1, 
                message: `Anda tidak memiliki akses untuk membuat produk`
            });
        }
        params = req.body;
        let tag = new Tag(params);
        await tag.save();
        return res.json(tag);
    } catch (error) {
        if(error && error.name === 'ValidationError'){
            return res.json({
                error: 1, 
                message: error.message, 
                fields: error.errors
            });
        }
        console.log(error);
        next(error);
    }
}

async function index(req, res, next){
    try {
        let { limit = 10, skip = 0 } = req.query;
        let tag = await Tag.find().limit(limit).skip(skip);
        
        return res.json(tag);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function show(req, res, next){
    try {
        let tag = await Tag.find({
            _id : req.params.id
        });

        if(!tag) return res.json({ 'message' : 'Data tidak ditemukan' });
        return res.json(tag);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function destroy(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('delete', 'Tag')){
            return res.json({
                error: 1, 
                message: `Anda tidak memiliki akses untuk membuat produk`
            });
        }
        let tag = await Tag.findOneAndDelete({
            _id : req.params.id
        });

        if(!tag) return res.json({ 'message' : 'Data tidak ditemukan' });
        return res.json(tag);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function update(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('update', 'Tag')){
            return res.json({
                error: 1, 
                message: `Anda tidak memiliki akses untuk membuat produk`
            });
        }
        params = req.body;
        let tag = await Tag.findOneAndUpdate(
            {_id: req.params.id},
            params,
            {new: true, runValidators: true}
        );
        
        return res.json(tag);
    } catch (error) {
        if(error && error.name === 'ValidationError'){
            return res.json({
                error: 1, 
                message: error.message, 
                fields: error.errors
            });
        }
        console.log(error);
        next(error);
    }
}

module.exports = {
    store,
    index,
    show,
    destroy,
    update
}