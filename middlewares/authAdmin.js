const jwt = require('jsonwebtoken')
async function AuthAdmin(req, res, next){
   try{
          if(!req.cookies.secretkey) return res.json({error: 'session expired'});
          let decoded = await jwt.verify(req.cookies.secretkey,  process.env.SECRET_KEY);
          if(!decoded) return res.json({error: 'Access denied'});
          
          if(!decoded.admin) return res.json({error: 'Not Allowed'})
   }catch(err){return res.json({error: err.message})}

    next();
}

module.exports = AuthAdmin;


