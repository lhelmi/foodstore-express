const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema({
    name : {
        type : String,
        required : [true, 'Nama alamat harus diisi'],
        maxLength : [255, 'Panjang Maksimal nama alamat adalah 255 karakter']
    },
    province : {
        type : String,
        required : [true, 'Provinsi harus diisi'],
        maxLength : [255, 'Panjang Maksimal Provinsi adalah 255 karakter']
    },
    regency : {
        type : String,
        required : [true, 'Kota harus diisi'],
        maxLength : [255, 'Panjang Maksimal kota adalah 255 karakter']
    },
    district : {
        type : String,
        required : [true, 'Kecamatan alamat harus diisi'],
        maxLength : [255, 'Panjang Maksimal kecamatan adalah 255 karakter']
    },
    village : {
        type : String,
        required : [true, 'Desa/Kelurahan alamat harus diisi'],
        maxLength : [255, 'Panjang Maksimal Desa/Kelurahan adalah 255 karakter']
    },
    detail : {
        type : String,
        required : [true, 'Detail alamat harus diisi'],
        maxLength : [1000, 'Panjang maksimal detail adalah 1000 karakter']
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    }
},{
    timestamps : true
});

const DeliveryAddress = model('DeliveryAddress', deliveryAddressSchema);
module.exports = DeliveryAddress;