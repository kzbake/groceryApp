'use strict'

const db = require('../lib/db')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UsersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    timestamp: {type: Date, default: Date.now}
})
db.model('Users', UsersSchema)
