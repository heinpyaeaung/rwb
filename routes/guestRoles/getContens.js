const express = require('express');
const router = express.Router();
const { Content,contentValidation } = require('../../models/content.js');
// router.get('/allcontents', async(req, res) => {
//     let allContents = await Content.find()
//     return res.json({'message': allContents})
// })

module.exports = router