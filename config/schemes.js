const mongoose = require("mongoose");

module.exports.Task = new mongoose.Schema({
    content: String,
    done: Boolean,
    date: Date
});