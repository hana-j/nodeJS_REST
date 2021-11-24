const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const isLoggedin = (req,res, next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('errors', {login:'로그인해주세요'})
        res.redirect('/login')
    }
}
const noPermission = (req,res)=>{
    req.flash('errors', {login:"권한이 없습니다."});
    req.logout();
    res.redirect('/login');
}

//list
router.get('/', function(req, res){
    Post.find({})
    .populate('author')
    .sort('-createdAt')
    .exec(function(err, posts){
        if(err) return res.json(err);
        res.render('posts/list', {posts:posts});
    })
})
//New post
router.get('/new', function(req, res){
    res.render('posts/new');
});

//write
router.post('/', function(req, res){
    req.body.author = req.user._id;
    Post.create(req.body, function(err, post){
        if(err) return res.json(err);
        res.redirect('/posts');
    });
});

//상세페이지
router.get('/:id',function(req, res){
    Post.findOne({_id:req.params.id})
        .populate('author')
        .exec((err,post)=>{
            if(err) return res.json(err);
        res.render('posts/detail', {post:post});
        })
        
});

//수정페이지 연결
router.get('/:id/edit', function(req, res){
    Post.findOne({_id:req.params.id}, req.body, function(err, post){
        if(err) return res.json(err);
        res.render('posts/edit', {post:post});
    });
});
//수정
router.put('/:id', isLoggedin, function(req, res){
    req.body.updatedAt = Date.now();
    Post.findByIdAndUpdate({_id:req.params.id}, req.body, function(err, post){
        if(err) return res.json(err);
        res.redirect("/posts/"+req.params.id);
    
    });
});
//delete
router.delete('/:id', isLoggedin, function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect('/posts');
    });
});

function checkPermission(req, res,next){
    Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        if(post.author != req.user.id) return noPermission(req, res);

        next();       //본인이 작성한 post인 경우에만 계속 해당 route를 사용할 수 있습니다.
    });
}

module.exports = router;