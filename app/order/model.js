const mongoose = require('mongoose');
const { model, Schema } = mongoose; 
const Invoice = require('../invoice/model');

const orderSchema = Schema({
    order_number: Number,
    status: {
        type: String, 
        enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
        default: 'waiting_payment'
    },
    delivery_fee: {
        type: Number, 
        default: 0
    },
    delivery_address: {
        provinsi: { type: String, required: [true, 'provinsi harus diisi.']},
        kabupaten: { type: String, required: [true, 'kabupaten harus diisi.']},
        kecamatan: { type: String, required: [true, 'kecamatan harus diisi.']},
        kelurahan: { type: String, required: [true, 'kelurahan harus diisi.']},
        detail: {type: String}
    }, 
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    order_items: [{type: Schema.Types.ObjectId, ref: 'OrderItem'}]
},
{
    timestamps: true
});

orderSchema.virtual('items_count').get(function(){
    return this.order_items.reduce((total, item) => {
        return total + parseInt(item.qty)
    }, 0)
});

orderSchema.pre('save', async function(next){
    try {
        const count = await this.model('Order').find()
        .sort({ order_number: -1 })
        .limit(1);
        if (count.length > 0){
            let number = parseInt(count[0].order_number) + 1;
            this.order_number = number
        }else{
            this.order_number = 1;
        }
    } catch (error) {
        throw error;
    }
    next();
});

orderSchema.post('save', async function(next){
    let sub_total = this.order_items.reduce((sum, item) => sum += ( item.price * item,qty ), 0);

    let invoice = new Invoice({
        user : this.user,
        order : this._id,
        sub_total : sub_total,
        delivery_fee : parseInt(this.delivery_fee),
        total : parseInt(sub_total + this.delivery_fee),
        delivery_address : this.delivery_address
    });

    await invoice.save();
});


const Order = model('Order', orderSchema);
module.exports = Order;
