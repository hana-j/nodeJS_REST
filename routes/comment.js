const express = require('express');
const { post } = require('.');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const util = require('../util');

//댓글작성
router.post('/', util.isLoggedin, checkPostId, (req, res) => {
    if (!req.user) {
    } else {
        const post = res.locals.post;
        req.body.author = req.user.nickname;
        req.body.post = post._id;

        Comment.create(req.body, (err) => {
            if (err) {
                req.flash('commentForm', { _id: null, form: req.body });
                // req.flash('commentError', { _id: null, errors: util.parseError(err) })
            }
            return res.redirect('/posts/' + post._id);
        });
    }
});
//수정
router.post('/edit', util.isLoggedin, checkPermission, checkPostId, function(req, res)  {
    Comment.findByIdAndUpdate({ _id: req.body.commentId }, { $set: { post: req.body.post._id, author: req.body.author._id, text: req.body.text, createdAt:Date.now() } },
        function (err) {
            if (err) { return res.send({ errorMessage: "수정중 오류가 발생했습니다." }) }
            
        }
        
    );
    return res.redirect('/posts/'+req.body.post)
}

);
router.delete('/:id', util.isLoggedin, checkPermission, checkPostId,function(req, res){
    const post = res.locals.post;
    Comment.findOneAndRemove({_id:req.params.id}, function(err, comment){
        if(err) return res.json(err);
          return res.redirect('/posts/'+post._id)
        });
    });

    function checkPermission(req, res, next) {
        Comment.findOne({ _id: req.params.id }, (err, comment) => {
            if (err) return res.json(err);
            //if (comment.author != req.user.id) return util.noPermission(req, res);
            next();
        });
    }
    
    function checkPostId(req, res, next) {
        Post.findOne({ _id: req.query.postId }, function (err, post) {
            if (err) return res.json(err);
            res.locals.post = post;
            next();
        });
    }  
module.exports = router;

