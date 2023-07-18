const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const productSchema = Schema({
    name : {
        type: String,
        minLength : [3, 'Panjang nama product minimal 3 karakter'],
        maxLength : [255, 'Panjang nama product maksimal 255 karakter'],
        required: [true, 'Nama product harus diisi']
    },
    description : {
        type: String,
        maxLength : [1000, 'Panjang nama product maksimal 1000 karakter'],
        minLength : [3, 'Panjang deskripsi minimal 3 karakter'],
        required: [true, 'deskripsi harus diisi'],
    },
    price : {
        type: Number,
        default: 0
    },
    image_url : {
        type: String,
        required: [true, 'gambar harus diisi dengan extensi png, jpg, jpeg']
    },
    category : {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    tags : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tag'
        }
    ]
},
{
    timestamps: true
});

const Product = model('Product', productSchema);
module.exports = Product;