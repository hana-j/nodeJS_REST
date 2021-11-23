const express = require('express');
const router = express.Router();
const User = require('../models/User');

//회원가입페이지
router.get('/users', (req, res)=>{
    const user= req.flash('user')[0] || {};
    const errors = req.flash('errors')[0] || {};
    res.render('users/join', {user:user, errors:errors});
})
//회원가입
router.post('/', (req,res)=>{
    console.log(req.body.nickname, req.body.password);
    User.create(req.body, function(err, user){
        if(err){
            req.flash('user',req.body);
            req.flash('errors', parseError(err));   //error 형식 맞춰주는 함수 이용 => 따로 공부하기 
            return res.redirect('/users/users')
        }
        res.redirect('/login'); //성공시 로그인 페이지로 
    });
});

//parseError 함수
function parseError(errors){
    console.log(errors)
    const parsed = {};
    if(errors.name =='ValidationError'){
        for(let name in errors.errors){
            let ValidationError = errors.errors[name];
            parsed[name] = {message:ValidationError.message};
        }
    }else if(errors.code =='11000' && errors.errmsg.indexOf('nickname') > 0){
        parsed.nickname = {message : '이미 존재하는 아이디 입니다.'};
    }else{
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}

module.exports = router;