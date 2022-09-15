const { any } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    header: {
        type: String,
        lowercase: true,
        required: true
    },
    author: {
        type: String,
        lowercase: true,
        required: true
    },
    image:{
        type: Object,
        required: true
    },
    contentType: {
        type: String,
        lowercase: true,
        required: true
    },
    permission: {
        type: String,
        lowercase: true,
        required: true
    },
    contentBody: {
        type: Array,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const Content = mongoose.model('Content', ContentSchema);

function contentValidation(content) {
    const Schema = Joi.object({
        header: Joi.string().max(40).required(),
        author: Joi.string().max(20).required(),
        cloudinary_img_url: Joi.required(),
        contentType: Joi.string().required(),
        permission: Joi.string().required(),
        contentBody: Joi.required()
    })

    return Schema.validate(content)
}

module.exports.Content = Content;
module.exports.contentValidation = contentValidation;
