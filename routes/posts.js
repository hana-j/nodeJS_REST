const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const util = require('../util')
//list
router.get('/', function (req, res) {
    Post.find({})
        .populate('author')
        .sort('-createdAt')
        .exec(function (err, posts) {
            if (err) return res.json(err)
            res.render('posts/list', { posts: posts })
        })
})
//New post
router.get('/new', util.isLoggedin,function (req, res) {
    res.render('posts/new')
})

//write
router.post('/', util.isLoggedin, function (req, res) {


    req.body.author = req.user._id
    Post.create(req.body, function (err, post) {
        if (err) return res.json(err)
        res.redirect('/posts')
    })

})

//상세페이지
router.get('/:id', function (req, res) {
    const commentForm = req.flash('commentForm')[0] || { _id: null, form: {} }
    const commentError = req.flash('commentError')[0] || {
        _id: null,
        errors: {},
    }
    Promise.all([
        Post.findOne({ _id: req.params.id }).populate({
            path: 'author',
            select: 'nickname',
        }),
        Comment.find({ post: req.params.id })
            .sort('createdAt')
            .populate({ path: 'author', select: 'nickname' }),
    ])
        .then(([post, comments]) => {
            res.render('posts/detail', {
                post: post,
                comments: comments,
                commentForm: commentForm,
                commentError: commentError,
            })
        })
        .catch((err) => {
            console.log('err: ', err)
            return res.json(err)
        })
})

//수정페이지 연결
router.get('/:id/edit', function (req, res) {
    Post.findOne({ _id: req.params.id }, req.body, function (err, post) {
        if (err) return res.json(err)
        res.render('posts/edit', { post: post })
    })
})
//수정
router.put('/:id', util.isLoggedin, function (req, res) {
    req.body.updatedAt = Date.now()
    Post.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        function (err, post) {
            if (err) return res.json(err)
            res.redirect('/posts/' + req.params.id)
        }
    )
})
//delete
router.delete('/:id', util.isLoggedin, function (req, res) {
    Post.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.json(err)
        res.redirect('/posts')
    })
})

module.exports = router
