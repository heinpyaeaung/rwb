const jwt = require('jsonwebtoken')
// const deleteClImg = require('../cloudinary.js')
async function AuthMember(req, res, next){
    if(!req.cookies.secretkey){
        return res.json({error: 'Not Member'});
    }
    let decoded = await jwt.verify(req.cookies.secretkey, process.env.SECRET_KEY);
    if(!decoded) return res.json({error: 'Access denied'});
    if(!decoded.member){
        return res.json({error: 'Not Member'});
    }
    next()
}
module.exports = AuthMember;