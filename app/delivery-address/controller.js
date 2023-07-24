const DeliveryAddress = require('./model');
const { policyFor } = require('../policy/index');
const { subject } = require('@casl/ability');

async function store(req, res, next){
    let policy = policyFor(req.user);
    if(!policy.can('create', 'DeliveryAddress')){
        res.json({
            error: 1, 
            message: `Anda tidak memiliki akses untuk membuat alamat user`
        });
    }

    try {
        let payload = req.body;
        let user = req.user;

        let address = new DeliveryAddress({...payload, user: user._id});
        await address.save();
        return res.json({'data' : address});
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

async function update(req, res, next){
    let policy = policyFor(req.user);
    try {
        let { id } = req.params;
        let { _id, ...payload } = req.body;
        let address = await DeliveryAddress.findOne({_id : id});
        let subjectAddress = subject('DeliveryAddress', {...address, user_id : address.user});

        if(!policy.can('update', subjectAddress)){
            res.json({
                error: 1, 
                message: `Anda tidak memiliki akses untuk merubah alamat user ini`
            });
        }
        address = await DeliveryAddress.findOneAndUpdate({_id : id},payload,{ new :true });
        return res.json({'data' : address});
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

async function destroy(req, res, next){
    let policy = policyFor(req.user);
    try {
        let { id } = req.params;
        let address = await DeliveryAddress.findOne({_id : id});
        let subjectAddress = subject('DeliveryAddress', {...address, user_id : address.user});

        if(!policy.can('update', subjectAddress)){
            res.json({
                error: 1, 
                message: `Anda tidak memiliki akses untuk menghapus alamat user ini`
            });
        }
        address = await DeliveryAddress.findOneAndDelete({_id : id});
        return res.json({'data' : address});
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
    const policy = policyFor(req.user);

    if(!policy.can('view', 'DeliveryAddress')){
        res.json({
            error: 1, 
            message: `Anda tidak memiliki akses untuk halaman ini`
        });
    }

    try {
        let { limit = 10, skip = 0 } = req.query;
        const count = await DeliveryAddress.find({user : req.user._id}).countDocuments();
        const data = await DeliveryAddress.find({user : req.user._id})
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .sort('-createAt');
        return res.json({'data': data, 'count': count});
            
    } catch (error) {
        next(error);
    }
}

module.exports = {
    store,
    update,
    destroy,
    index
}