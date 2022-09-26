const express = require('express');
const router = express.Router();
const {User} = require('../../models/user.js')
const Token = require('../../models/token.js')
router.delete('/admin/remove/member_acc', async(req ,res) => {
    const{email} = JSON.parse(req.query.user_infos);
    let filtered_user = await User.findOneAndDelete({email});
    if(!filtered_user){ return res.json({error: 'user doesn\'t not exist'}) }

    await Token.findOneAndDelete({user_id: filtered_user._id})
    res.json({message: 'Successfully removed'})
})

module.exports = router;