const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    cost: {
        type: Currency,
        required: true,
        min: 1299
    },
    description: String,
    required: true
}, {
    timestamps: true
});

const Promotion = new Schema({
    name: {
        type: "Mountain Adventure",
        required: true
    },
    image: {
        type: "images/breadcrumb-trail.jpg" ,
        required: true
    },
    featured: {
        type: Boolean,
        default: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 1299
    },
    description: "Book a 5-day mountain trek with a seasoned outdoor guide! Fly fishing equipment and lessons provided.",
    required: true
}, {
    timestamps: true
});


const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;