'use strict'

const db = require('../lib/db')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema  = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    review: {
        type: String,
        required: true
    },
    createdAt: {type: Date, default: Date.now}
})
db.model('Review', ReviewSchema);
