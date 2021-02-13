const db = require('../lib/db');
const express = require('express');
const {StatusCodes} = require('http-status-codes');
const router = express.Router();
const UsersModel = db.model('Users');
const bcrypt = require('bcrypt');


router.post('/register', async(req, res) => {
    const {name, phoneNumber, email, gender, password, role} = req.body;

    if (!name)
        return res.status(StatusCodes.BAD_REQUEST).json('User Name is required')


    if (!phoneNumber)
        return res.status(StatusCodes.BAD_REQUEST).json('Phone Number is required')


    if (!email)
        return res.status(StatusCodes.BAD_REQUEST).json('Email is required')


    if (!gender)
        return res.status(StatusCodes.BAD_REQUEST).json('Gender is required')


    if (!password)
        return res.status(StatusCodes.BAD_REQUEST).json('Password is required')


    if (!role)
        return res.status(StatusCodes.BAD_REQUEST).json('Role is required')


    const existingUser = await UsersModel.findOne({email: email}).exec();

    if(existingUser)
        return res.status(StatusCodes.BAD_REQUEST).send({msg:'Email address already registered'});

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new UsersModel({
            name,
            phoneNumber,
            email,
            gender,
            password: hashPassword,
            role
        });
        await newUser.save();

        return res.status(StatusCodes.OK).json('Successfully registered');

    } catch (e) {
        console.log('Error:', e);

        return res.status(StatusCodes.BAD_REQUEST).json(e)
    }
});

router.post('/getUser', async(req, res) => {
    const {email} = req.body;

    if (!email)
        return res.status(StatusCodes.BAD_REQUEST).json('Email is required');


    const account = await UsersModel.findOne({email: email}).exec();

    if(!account)
        return res.status(StatusCodes.NOT_FOUND).json('User account not found');

    return res.status(StatusCodes.OK).json(account);

});

module.exports = router;

