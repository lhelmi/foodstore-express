const CartItem = require('../cart-item/model');
const Product = require('../product/model');
const { policyFor } = require('../policy/index');

async function update(req, res, next){
    let policy = policyFor(req.user);
    if(!policy.can('update', 'cart')){
        return res.json({
            error: 1, 
            message: `Anda tidak memiliki akses`
        });   
    }
    
    try {
        const { items } = req.body;
        const productIds = items.map(itm => items._id);
        const products = await Product.find({
            _id : { $in : productIds}
        });
        
        let cartItems = items.map(item => {
            let relatedProduct = products.find(product => product._id.toString() === item._id);
            return {
                _id : relatedProduct._id,
                product : relatedProduct._id,
                price : relatedProduct.price,
                image_url : relatedProduct.image_url,
                name : relatedProduct.name,
                user : req.user._id,
                qty : item.qty
            }
        });
        await CartItem.bulkWrite(cartItems.map(item => {
            return {
                updateOne: {
                    filter: {user: req.user._id, product: item.product}, 
                    update: item, 
                    upsert: true
                }
            }
        }));
            

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
    let policy = policyFor(req.user);
    if(!policy.can('update', 'cart')){
        return res.json({
            error: 1, 
            message: `Anda tidak memiliki akses`
        });   
    }

    try {
        let items = await CartItem
        .find({user: req.user._id})
        .populate('product');

        return res.json({'data' : items});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    update,
    index
}