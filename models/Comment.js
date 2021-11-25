const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    post:{type:mongoose.Schema.Types.ObjectId, ref:'post', required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
    comment:{type:mongoose.Schema.Types.ObjectId, ref:'comment'},
    text:{type:String, required:[true, '댓글을 달아주세요']},
    createdAt:{type:Date, default:Date.now}
})

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;