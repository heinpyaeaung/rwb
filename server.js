const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const path = __dirname+'/views/'

const Auth = require('./routes/auth')
const AdminUserPermission = require('./routes/adminRoles/permissionMember.js')
const AdminDelContent = require('./routes/adminRoles/delContent')

const MemberAddContent = require('./routes/memberRoles/addContent')
const MemberGetContent = require('./routes/memberRoles/getContent')
const MemberRateContent = require('./routes/memberRoles/rateContent')

const GuestGetContent = require('./routes/guestRoles/getContens.js')

mongoose.connect(process.env.DATABASE)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err.message))
 
const corsOptions = {
    origin: "http://localhost:8080"
    // origin: "*"
};    
app.use(cors(corsOptions));

app.use(express.static(path))
app.get('/', (req, res) => {
    res.sendFile(path+'/index.html')
})
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/', Auth);
app.use('/api/', AdminUserPermission);
app.use('/api/', AdminDelContent)

app.use('/api/', MemberAddContent);
app.use('/api/', MemberGetContent);
app.use('/api/', MemberRateContent);

app.use('/api/', GuestGetContent);

let port  = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listen at ${port}`));