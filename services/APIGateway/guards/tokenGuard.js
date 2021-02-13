const jwt =require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes')

const permissionedAPIs = [
    {url: '/api/v1/products', mode: 'strict', role: 'admin'},
    {url: '/api/v1/products/review', mode: 'strict', role: 'client'},
    {url: '/api/v1/products/search', mode: 'loose', role: 'client'}
];

module.exports = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const permissionedAPI = permissionedAPIs.find(api => api.mode === 'strict' ? api.url === req.originalUrl : req.originalUrl.indexOf(api.url)>-1);

    if(permissionedAPI) {
        if(token) {
            try {
                const {_id, name, role, email} = await jwt.verify(token, process.env.SECRET)

                if(role !== permissionedAPI.role)
                    return res.status(StatusCodes.FORBIDDEN).json('Forbidden')

                req.userData = {_id, name, role, email};

                return next();
            } catch (err) {
                if (err instanceof jwt.TokenExpiredError)
                    return res.status(StatusCodes.FORBIDDEN).json('Session expired')


                return res.status(StatusCodes.FORBIDDEN).send(err)
            }
        } else
            return res.status(StatusCodes.FORBIDDEN).json('Forbidden')
    }

    next()
}
