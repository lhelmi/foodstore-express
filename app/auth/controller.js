const User = require('../user/model');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { getToken } = require('../utils/get-token')

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
        payload = {
            ...payload, customer_id: null
        }
        
        if(payload.password !== payload.password_confirmation){
            return res.json({
                error: 1, 
                message: "User validation failed: password tidak sama dengan password konfirmasi", 
                fields: {
                    password : {
                        name: "ValidatorError",
                        message: "Nilai password dan konfirmasi password tidak sama!",
                        properties: {
                            "message": "Nilai password dan konfirmasi password tidak sama!",
                        },
                    }
                }
            });
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

async function localStrategy(email, password, done){
    try {
        const user = await User.findOne({email})
        .select('-__v -createAt -updateAt -token -card_items');
        if(!user) return done();

        if(bcrypt.compareSync(password, user.password)){
            ({ password, ...userWithoutPassword } = user.toJSON() );
            return done(null, userWithoutPassword);
        }
    } catch (error) {
        done(error, null);
    }
    done();
}

async function login(req, res, next){
    passport.authenticate('local', async function(err, user){
        if(err) return next(err);
        if(!user) return res.json({error: 1, message: 'email or password incorrect'});
        let signed = jwt.sign(user, config.secretKey);
        await User.findOneAndUpdate({_id: user._id}, {$push: {token: signed}}, {new: true});
        return res.json({
            message: 'logged in successfully', 
            user: user, 
            token: signed
        });
            
    })(req, res, next);
}


function me(req, res, next){
    if(!req.user){
        return res.json({
            error: 1, 
            message: `Your're not login or token expired`
        });
    }
    return res.json(req.user);
}

async function logout(req, res, next){
    let token = getToken(req);
    console.log(token);
    let user = await User.findOneAndUpdate({
        token : {
            $in : [token]
        }
    }, {
        $pull: {token}
    },{
        useFindAndModify : false
    });

    if(!user || !token){
        return res.json({
            error: 1, 
            message: 'No user found'
        });
    }

    return res.json({
        error: 0,
        message: 'Logout berhasil'
    });
    
}

module.exports = {
    register,
    localStrategy,
    login,
    me,
    logout
}