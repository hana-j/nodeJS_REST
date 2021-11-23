const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

//serialize && deserialize =>패스포트가 세션을 사용하기 위해 필요한 코드 
passport.serializeUser((user, done)=>{
    done(null, user.id);
});
passport.deserializeUser((id, done)=>{
    User.findOne({_id:id}, (err, user)=>{
        done(err, user);
    });
});

//패스포트 사용자 지정
passport.use('local-login',
    new LocalStrategy({
        usernameField:'nickname',
        passwordField:'password',
        passReqToCallback:true
    },
    function(req, nickname, password, done){
        console.log(nickname, password);
        User.findOne({nickname:nickname})
        .select({password:1})
        .exec((err, user)=>{
            if(err) return done(err);
            if(user && user.authenticate(password)){
                return done(null, user);
            }
            else{
                req.flash('nickname', nickname);
                req.flash('errors', {login: '아이디 또는 비밀번호가 일치하지 않습니다.'});
            }
        })
    }
    )
);
module.exports = passport;