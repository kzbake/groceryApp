const express = require('express');
const axios = require('axios');
const {StatusCodes} = require('http-status-codes');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {

    try {
        const response = await axios.post(`${process.env.USER_SERVICE_API}/register`, req.body);

        return res.send(response.data);

    } catch (e) {
        if(e.response && e.response.data)
            return res.status(StatusCodes.BAD_REQUEST).send(e.response.data)

        return res.status(StatusCodes.BAD_REQUEST).send({success: false, msg: 'Service temporary  unavailable, please try later'})
    }
});

router.post('/auth', async (req, res) => {

    try {
        const { email, password } = req.body;

        if(!email)
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Email is required!'});

        if(!password)
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Password is required!'});

        const response = await axios.post(`${process.env.USER_SERVICE_API}/getUser`, { email });

        const { _id, name, password: hashedPassword, role } = response.data;

        const isValid = await bcrypt.compare(password, hashedPassword);

        if(!isValid)
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Password is wrong'});

        const token = jwt.sign({ _id, email, role }, process.env.SECRET, {expiresIn: process.env.EXPIRE_TIME})

        return res.json({ success: true,  name, email, role, token })

    } catch (e) {
        if(e.response && e.response.data)
            return res.status(StatusCodes.BAD_REQUEST).send(e.response.data)

        return res.status(StatusCodes.BAD_REQUEST).send({success: false, msg:'Service temporary  unavailable, please try later'})
    }
});


module.exports = router
