const User = require('../user/model');

async function countCustumer(){
    try {
        const count = await User.find()
        .sort({ customer_id: -1 })
        .limit(1);
        return count.length > 0 ? number = parseInt(count[0].customer_id) + 1 : 1;
    } catch (error) {
        return null;
    }
}

async function register(req, res, next){
    try {
        
        let payload = req.body;
        let customer_id = await countCustumer();

        if(!customer_id) return res.json({ error: 1, message: "error count customer id" });
        payload = {
            ...payload, customer_id: customer_id
        }
        
        let user = new User(payload);
        await user.save();

        return res.json(user);
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

module.exports = {
    register
}