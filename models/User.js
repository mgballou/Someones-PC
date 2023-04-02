const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    googleId: {
        type: String,
        require: true
    },
    email: String,
    avatar: String,
    favorite: {type: Object}
}, {
    timestamps: true

})

module.exports = mongoose.model('User', userSchema)