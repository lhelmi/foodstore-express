const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const categorySchema = Schema({
    name : {
        type: String,
        minLength : [3, 'Panjang nama kategori minimal 3 karakter'],
        maxLength : [30, 'Panjang nama kategori maksimal 255 karakter'],
        required: [true, 'Nama kategori harus diisi']
    }
},
{
    timestamps: true
});

const Category = model('Category', categorySchema);
module.exports = Category;