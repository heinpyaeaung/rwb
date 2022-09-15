const jwt = require('jsonwebtoken')
// const deleteClImg = require('../cloudinary.js')
async function AuthMember(req, res, next){
    // let imageInfos = JSON.parse(req.body.cloudinary_img_url)
    console.log(req.body)
    // console.log(imageInfos)
    if(!req.cookies.secretkey){
        // deleteClImg(res, imageInfos.public_id)
        return res.json({error: 'Not Member'})
    }
    let decoded = await jwt.verify(req.cookies.secretkey, process.env.SECRET_KEY)
    if(!decoded) return res.json({error: 'Access denied'});
    if(!decoded.member){
        return res.json({error: 'Not Member'})
    }
    next()
}

module.exports = AuthMember;