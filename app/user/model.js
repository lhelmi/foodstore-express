const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const bcrypt = require('bcrypt');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const HASH_ROUND = 10;

const userSchema = Schema({
    full_name: {
        type: String, 
        required: [true, 'Nama harus diisi'], 
        maxlength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
        minlength: [3, 'Panjang nama harus antara 3 - 255 karakter']
    }, 
    customer_id: {
        type: Number, 
    },
    email: {
        type: String, 
        required: [true, 'Email harus diisi'], 
        maxlength: [255, 'Panjang email maksimal 255 karakter'],
    },
    password: {
        type: String, 
        required: [true, 'Password harus diisi'], 
        maxlength: [255, 'Panjang password maksimal 255 karakter'], 
    }, 
    role: {
        type: String, 
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: [String]
}, {
    timestamps : true
});

userSchema.path('email').validate(function(params) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    
    return EMAIL_RE.test(params);
}, attr => `${attr.value} harus merupakan email yang valid!`);

userSchema.path('email').validate(async function(params){
    try {
        const count = await this.model('User').count({email: params});

        return !count;
    } catch (error) {
        throw error;
    }
}, attr => `Email ${attr.value} sudah terdaftar`);

userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

// userSchema.pre('save', async function(next){
//     const count = await this.model('User').find()
//     .sort({ customer_id: -1 })
//     .limit(1);
//     console.log(count);
//     if (count.length > 0){
//         let number = parseInt(count.customer_id) + 1;
//         this.customer_id = number
//     }else{
//         this.customer_id = 1;
//     }
//     next();
// });

// userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

const User = model('User', userSchema);

module.exports = User;