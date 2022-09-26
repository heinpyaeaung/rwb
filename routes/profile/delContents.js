const express = require('express');
const router = express.Router();
const { Content,contentValidation } = require('../../models/content.js');
const AuthMember = require('../../middlewares/authMember.js')
const deleteClImg = require('../../cloudinary.js');
router.delete('/profile/deletecontent/:id', AuthMember, async(req, res) => {
    let filtered_content = await Content.findByIdAndDelete({_id: req.params.id})
    if(!filtered_content){
        res.json({error: 'content not found'})
    }
    deleteClImg(res, filtered_content.image.public_id)
    res.status(204).end()
})

module.exports = router;