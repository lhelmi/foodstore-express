const Product = require('./model');

async function store(req, res, next){
    let payload = req.body;
    let product = new Product(payload);
    try {
        await product.save();
        return res.json(product);
    } catch (error) {
        if(error && $error.name === 'ValidationError'){
            return res.join({
                error: 1, 
                message: err.message, 
                fields: err.errors
            });
        }
        console.log(error.message);
        next(error);
    }
}

module.exports = {
    store
};