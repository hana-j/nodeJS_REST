const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportConfig = require('../config/passport');

exports.create = function(req,res){
    passport.authenticate('local', {session:false}, (err, user)=>{
        if(err || !user){
            return res.status(400).json({
                message:'권한이 없습니다.',
                user:user
            });
        }
        req.login(user, {session:false}, (err) =>{
            if(err){
                res.send(err);
            }
            const token = jwt.sign(user.toJSON(), "hana");
            return res.json({user, token});
        });
    })(req, res);
}