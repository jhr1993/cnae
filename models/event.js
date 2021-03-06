const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    lat: { type: 'decimal128', required: true },
    lng: { type: 'decimal128', required: true },
    user: { type: String, required: true },
    users: { type: Array },
    title_img: { type: String, default: "img/noImg.png"},
    content: { type: String, default: "No contents" },
    published_date: { type: Date, default: Date.now },
    edited_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
