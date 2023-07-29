const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CartItemSchema = Schema({
    name : {
        type : String,
        required : [true, 'Nama harus diisi'],
        minLength : [5, 'Nama minimal memiliki 5 karakter']
    },
    qty : {
        type : Number,
        required : [true, 'Qty harus diisi'],
        min : [1, 'Qty minimal memiliki 1 item']
    },
    price : {
        type : Number,
        default : 0
    },
    image_url : {
        type : String,
        required : [true, 'gambar harus diisi'],
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    product : {
        type : Schema.Types.ObjectId,
        ref : 'Product'
    }
});

const CartItem = model('CartItem', CartItemSchema);
module.exports = CartItem;
