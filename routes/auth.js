const express = require('express')
const router = express.Router()
let {User, userValidation} = require('../models/user')
let Token = require('../models/token')
let {authenticatedUserValidation} = require('../models/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const sgMail = require('@sendgrid/mail')

//user login
router.post('/login', async(req, res) => {
    let {error} = authenticatedUserValidation(req.body)
    if(error) return res.json({error: error.details[0].message});  
    
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.json({error: 'Wrong Email Or Password'}); 

    if(!user.isVerified) return res.json({error: 'Not Verified'});

    let checkPwd = await bcrypt.compare(req.body.password, user.password);
    if(!checkPwd) return res.json({error: 'Wrong Email Or Password'});

    let jwtToken = await user.generateJwtToken();
    
    res.status(200).cookie('secretkey', jwtToken, {httpOnly:true, secure: true, maxAge: 1000*60*60}).json({success: true}).end()
})

//user logout
router.get('/logout',async(req, res) => { 
    try{
        res.cookie('secretkey','',{maxAge:1}).json({message:'logout scuuessfully'})
    }catch(err){
        res.json({error: err.message})
    }
})

//reset password function
router.post('/reset', async(req, res) => {
    const Schema = Joi.object({
        resetpwd: Joi.string().required(),
        newpwd: Joi.string().min(6).required(),
        repwd: Joi.string().min(6).required()
    })
    const {error} = Schema.validate(req.body)
    if(error) return res.json({error: error.details[0].message});
    
    let user = await User.findOne({resetpwdtoken: req.body.resetpwd});
    if(!user) return res.json({error: 'This token is not valid'});

    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(req.body.repwd, salt);
    user.password = hashed;
    user.resetpwdtoken = '';
    await user.save();

    res.status(200).json({message: `Your new password has been successfully changed, Go back to log in page`})
})

//forgot pwd function
router.post('/forgot', async(req, res) => {
    const Schema = Joi.object({
        email: Joi.string().required().email()
    })
    const {error} = Schema.validate(req.body)
    if(error) return res.json({error: error.details[0].message});  

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.json({error: 'This account is not registered'});

    sendMailForForgotPassword(user, req, res);
})

//register user
router.post('/register', async(req, res) => {
    const {error} = await userValidation(req.body);
    if(error) return res.json({error: error.details[0].message});  

    
    let mail = await User.findOne({email: req.body.email});
    if(mail) return res.json({
        error: 'This acc has been already registered'
    })

    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashed;
    
    try{
        let new_user = new User({...req.body});
        await sendMail(new_user, req, res);
        await new_user.save();
    }catch(err){
        res.status(401).json({error: err.message})
    }
})

//verify token to access log in
router.get('/verify/:token', async(req, res) => {
    if(!req.params.token) return res.json({error: 'Token needed'})

    let token = await Token.findOne({token: req.params.token});
    if(!token) return res.json({error: 'Token is not valid'});

    let user = await User.findOne({_id: token.user_id});
    if(!user) return res.json({error: 'User does not exist'}).render('/home');

    user.isVerified = true;
    await user.save()
    res.json({message: 'Vertification Success'})
})

// sending email token to reset password
async function sendMailForForgotPassword(user, req, res) {
    let resetCode = await user.generateResetPasswordToken();
    user.resetpwdtoken = resetCode;
    user.save();

    let to = user.email
    let from = process.env.FROM_EMAIL
    let subject = 'RWB\'S RESET PASSWORD'
    let html = `<strong>Hi ${user.username}, We received a request to reset your RWB acount password. Enter the following password reset code</strong>
    <p><i> Notice that: this token is one time use if you want to change new password again, you need to go back to forgot email page and get a new token<i></p>
    <h1>${resetCode}</h1>`
    try{
        await sgMail.send({to,from,subject,html});
        res.json({message: 'Reset password code has been send to your email, Please check in email box'})
    }catch(err){
        return res.json({error: err.message})
    }
}

//sending email link to verify user
async function sendMail(user, req, res) {

    let token = await user.generateVertificationToken();
    await token.save();

    let to = user.email
    let from = process.env.FROM_EMAIL
    let subject = 'RWB\'S ACCOUNT VERTIFICATION EMAIL'
    let link = `http://${req.headers.host}/#/user/verify/${token.token}`
    let html = `<strong>Hi ${user.username}, please click on the following link to verify your account
                <a href="${link}">Click Here</a> if you did not request this, please ignore this email</strong>`


    try{
        await sgMail.send({to,from,subject,html});
        res.json({message: 'A Vertification Email has been send to your email, Please check in email box to verify your account'})
    }catch(err){
        return res.json({error: err.message})
    }
}
module.exports = router;