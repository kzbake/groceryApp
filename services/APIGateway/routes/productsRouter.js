const express = require('express');
const axios = require('axios');
const {StatusCodes} = require('http-status-codes');
const router = express.Router();

router.post('/', async (req, res) => {

    try {
        res.send(req.userData)

    } catch (e) {
        res.status(StatusCodes.BAD_REQUEST).send(e.response.data)
    }
});

router.post('/review', async (req, res) => {

    try {
        res.json('review api');

    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
});

router.post('/search', async (req, res) => {

    try {
        res.json('search api');

    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
});


module.exports = router
