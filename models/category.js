const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// category Schema
const categorySchema = new Schema({
    title: { type:String, required: true },
    parent: { type:String, default: false }
});

module.exports = mongoose.model('Category', categorySchema);