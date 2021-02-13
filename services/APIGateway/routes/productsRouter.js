const express = require('express');
const axios = require('axios');
const {StatusCodes} = require('http-status-codes');
const router = express.Router();

router.post('/', async (req, res) => {

    try {
        const files  = req.files;

        if(!files || !files.product)
            return res.status(StatusCodes.BAD_REQUEST).send({success: false, msg:'Product File is Required'});


        const productDetails = JSON.parse(files.product.data);

        const resp = await axios.post(process.env.PRODUCT_SERVICE_API, productDetails);

        return res.send(resp.data)

    } catch (e) {
        if(e.response && e.response.data)
            return res.status(StatusCodes.BAD_REQUEST).send(e.response.data)

        return res.status(StatusCodes.BAD_REQUEST).send({success: false, msg:'Service temporary  unavailable, please try later'})
    }
});

router.post('/review', async (req, res) => {

    try {
        const {_id: userId } = req.userData;
        const response = await axios.post(`${process.env.PRODUCT_SERVICE_API}/review`, {userId, ...req.body});

        return res.send(response.data);


    } catch (e) {
        if(e.response && e.response.data)
            return res.status(StatusCodes.BAD_REQUEST).send(e.response.data)

        return res.status(StatusCodes.BAD_REQUEST).send({success:false, msg: 'Service temporary  unavailable, please try later'})
    }
});

router.post('/search', async (req, res) => {

    try {
        res.json('search api');

    } catch (e) {
        res.status(StatusCodes.BAD_REQUEST).send(e)
    }
});


module.exports = router;
