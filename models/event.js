const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    title_img: { type: String, default: "/img/noImg.png"},
    summary: { type: String, required: true },
    content: { type: String, required: true },
    category:{ type:Array, required: true },
    artists: { type: Array, default:[] },
    date:{ type:Array, required: true },
    place:{ type:Array, required: true },
    ticket_type:{ type:String, required: true },
    place:{ type:Array, default:[] },
    contact:{ type:Array, required: true },
    lat: { type: 'decimal128', required: true },
    lng: { type: 'decimal128', required: true },
    user: { type: String, required: true },
    published_date: { type: Date, default: Date.now },
    edited_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
