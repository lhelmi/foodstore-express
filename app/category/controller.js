const Category = require('./model');

async function store(req, res, next){
    try {
        params = req.body;
        let category = new Category(params);
        await category.save();
        return res.json(category);
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
        let category = await Category.find().limit(limit).skip(skip);
        
        return res.json(category);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function show(req, res, next){
    try {
        let category = await Category.find({
            _id : req.params.id
        });

        if(!category) return res.json({ 'message' : 'Data tidak ditemukan' });
        return res.json(category);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function destroy(req, res, next){
    try {
        let category = await Category.findOneAndDelete({
            _id : req.params.id
        });

        if(!category) return res.json({ 'message' : 'Data tidak ditemukan' });
        return res.json(category);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function update(req, res, next){
    try {
        params = req.body;
        let category = await Category.findOneAndUpdate(
            {_id: req.params.id},
            params,
            {new: true, runValidators: true}
        );
        
        return res.json(category);
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