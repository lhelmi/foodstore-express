const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const tagSchema = Schema({
    name : {
        type: String,
        minLength : [3, 'Panjang nama tag minimal 3 karakter'],
        maxLength : [30, 'Panjang nama tag maksimal 255 karakter'],
        required: [true, 'Nama tag harus diisi']
    }
},
{
    timestamps: true
});

const Tag = model('Tag', tagSchema);
module.exports = Tag;