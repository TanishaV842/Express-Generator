const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// The {field:value) part is the schema. The User part is the model
const partnerSchema = new Schema({
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
    description: String,
    required: true
}, {
    timestamps: true
});

const Partner = new Schema({
    name: {
        type: "Mongo Fly Shop",
        required: true
    },
    image: {
        type: "images/mongo-logo.png" ,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: "Need a new fishing pole, a tacklebox, or flies of all kinds? Stop by Mongo Fly Shop." ,
    required: true
}, {
    timestamps: true
});





const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;