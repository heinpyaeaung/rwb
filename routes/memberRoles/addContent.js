const express = require('express');
const router = express.Router();
const { Content,contentValidation } = require('../../models/content.js');
const jwt = require('jsonwebtoken')
const multer = require('multer')
const upload = multer()
const deleteClImg = require('../../cloudinary.js')

//adding content to web
router.post('/member/addcontent', upload.none(), async(req, res) => { 
    let imageInfos = JSON.parse(req.body.cloudinary_img_url)  
    if(!req.cookies.secretkey){
        deleteClImg(res, imageInfos.public_id)
        return res.json({error: 'Not Member'})
    }

    let decoded = await jwt.verify(req.cookies.secretkey, process.env.SECRET_KEY)
    if(!decoded) return res.json({error: 'Access denied'});
    if(!decoded.member){
        deleteClImg(res, imageInfos.public_id)
        return res.json({error: 'Not Member'})
    }

    let {error} = contentValidation(req.body);
    if(error) return res.json({ error: error.details[0].message});
   
    try{
        let new_content = new Content({
            header: req.body.header,
            author: req.body.author,
            image: imageInfos,
            contentType: req.body.contentType,
            permission: req.body.permission,
            contentBody: JSON.parse(req.body.contentBody)
        });
        await new_content.save();
        res.send('success')
    }catch(err){ 
        deleteClImg(res,imageInfos.public_id)
        return res.json({ error: err.message })
    }
})
module.exports = router;
