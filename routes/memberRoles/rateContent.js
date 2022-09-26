const express = require('express');
const router = express.Router();
const { Content } = require('../../models/content');
const mongoose = require('mongoose')

router.post('/user/ratecontent/:action/:id', async(req, res) => {  
    const {action, id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.json({error: 'no content such a given name'})
    }
    if(action === 'inc'){
        let content = await Content.findOneAndUpdate({_id: id},{
            $inc:{rating: 1}
        },{new: true});

        return res.json({content: content})
    }
    if(action === 'dec'){
        let content = await Content.findOneAndUpdate({_id: id},{
            $inc: {rating: -1}
        },{new: true});

        return res.json({content: content})
    }
    res.json({error: 'something went wrong'});
})

module.exports = router;