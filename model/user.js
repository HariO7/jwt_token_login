const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: String,
    password: String,
    token: String,
});


module.exports = mongoose.model("user", userSchema)