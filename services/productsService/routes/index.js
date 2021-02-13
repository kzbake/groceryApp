const express = require('express');
const router = express.Router();
const {StatusCodes} = require('http-status-codes');
const db = require('../lib/db');
const ProductsModel = db.model('Products');
const ReviewModel = db.model('Review');

router.post('/', async (req, res) => {
    const {name, barcode, brand, description, price, available} = req.body;

    if (!name)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:'Name is required'});

    if (!barcode)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:'Barcode is required'});

    if (!brand)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:'Brand is required'})

    if (!price)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:'Price is required'})

    try {
        const newProduct = new ProductsModel({name, barcode, brand, description, price, available});

        await newProduct.save();

        return res.status(StatusCodes.OK).json({success: true, msg:'Product successfully added'});
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:'Product creation failed'});
    }

});

router.post('/review', async (req, res) => {
    const {userId, review, barcode} = req.body;

    if (!userId)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:'userId is required'})

    if (!review)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: 'review is required'})

    if (!barcode)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: 'barcode is required'});


    const product = await ProductsModel.findOne({barcode: barcode}).exec();
    const existingReview = await ReviewModel.findOne({userId: userId, productId: product._id}).exec();

    if(existingReview)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:'User already left review for this product'});

    try {
        const newReview = new ReviewModel({
            userId:  userId,
            productId: product._id,
            review
        });
        await newReview.save();

        return res.status(StatusCodes.OK).json({success: true, msg:'Review successfully created'});
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:'Review creation failed'});
    }
});

router.post('/search', async (req, res) => {

    const {searchText='', page} = req.body;
    const perPage =1;
    const result = await ProductsModel.aggregate([
        { '$facet': {
            'products': [
                { '$match': {
                    '$or': [
                        { brand: { '$regex': searchText, '$options': 'i' } },
                        { name: { '$regex': searchText, '$options': 'i' } }
                    ]
                }},
                { '$skip': perPage*page },
                { '$limit': perPage },
                { '$lookup': {
                    from: 'reviews',
                    as: 'reviews',
                    let: { prod_id: '$_id' },
                    pipeline: [
                        { $match: {
                            $expr: { $eq: [ '$productId', '$$prod_id' ] }
                        } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 2 }
                    ]
                }
                }
            ],
            'totalCount': [
                { '$count': 'count' }
            ]
        }}
    ]);
    const data = {
        totalCount: result[0].totalCount[0].count,
        products: result[0].products
    }

    return res.json(data)
})

module.exports = router;
