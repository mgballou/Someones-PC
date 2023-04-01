const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: String
}, {
    timestamps: true
})



module.exports = mongoose.model('Item', itemSchema)