const {Schema, model, Types} = require('mongoose');


const schema = new Schema({
    eik: {type: String},
    name: {type: String, required: true},
    city: {type: String},
    lat: {type: String, required: true},
    lng: {type: String, required: true},
    employees_count: {type: Number},
    profit: {type: Number},
    profit_formatted: {type: String},
    revenue: {type: String},
    revenue_formatted: {type: String},
    bookmarked_from: [{type: Types.ObjectId, ref: 'User'}]
});


module.exports = model('Company', schema);
