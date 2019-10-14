const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    lat: { type: 'decimal128', required: true },
    lng: { type: 'decimal128', required: true },
    team: { type: String, required: true }, 
    published_date: { type: Date, default: Date.now },
    edited_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);