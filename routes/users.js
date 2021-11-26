const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuthToken = require('../controller/AuthTokenController');
const router = express.Router();
const util = require('../util');

//authToken
router.post('/auth/tokens', AuthToken.create);
//회원가입페이지
router.get('/users', (req, res) => {
    const user = req.flash('user')[0] || {};
    const errors = req.flash('errors')[0] || {};
    res.render('users/join', { user: user, errors: errors });
});
//회원가입
router.post('/join', (req, res) => {
    console.log(req.body.nickname, req.body.password);
    User.create(req.body, function (err, user) {
        if (err) {
            req.flash('user', req.body);
            req.flash('errors', util.parseError(err)); //error 형식 맞춰주는 함수 이용 => 따로 공부하기
            return res.redirect('/users/users');
        }
        res.redirect('/users/login'); //성공시 로그인 페이지로
    });
});
// 로그인페이지
router.get('/login', function (req, res) {
    const nickname = req.flash('nickname')[0];
    const errors = req.flash('errors')[0] || {};
    res.render('users/login', {
        nickname: nickname,
        errors: errors,
    });
});

//로그인 로직  => passport-jwt 사용으로 변경하기
router.post(
    '/auth',
    function (req, res, next) {
        var errors = {};
        var isValid = true;

        if (!req.body.nickname) {
            isValid = false;
            errors.username = 'Username is required!';
        }
        if (!req.body.password) {
            isValid = false;
            errors.password = 'Password is required!';
        }

        if (isValid) {
            next();
        } else {
            req.flash('errors', errors);
            res.redirect('/users/login');
        }
    },
    passport.authenticate('local', {
        //여기에서 localStrategy가 있는 파일을 찾아감 => config/passport.js
        successRedirect: '/posts',
        failureRedirect: '/users/login',
    })
);
//로그아웃
router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/posts');
});

module.exports = router;