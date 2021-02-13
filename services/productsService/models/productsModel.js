'use strict'

const db = require('../lib/db')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    barcode: {
        type: Number,
        required: true,
        unique: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    price: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {type: Date, default: Date.now}
})
db.model('Products', ProductsSchema);
