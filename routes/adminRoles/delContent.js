const express = require('express');
const router = express.Router();
const { Content,contentValidation } = require('../../models/content.js');
const AuthAdmin = require('../../middlewares/authAdmin.js')
//delete content
router.delete('/admin/deletecontent/:id', AuthAdmin, async(req, res) => {
    let content_id = req.params.id;
    try{
        let filtered_content = await Content.findByIdAndDelete({_id: content_id})
        if(!filtered_content){
            res.json({message: 'content not found'})
        }
        deleteClImg(res, filtered_content.image.public_id)
        res.status(204).end()
    }catch(err){
        res.json({error: err.message})
    }
})
module.exports = router;