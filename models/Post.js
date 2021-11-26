//db
const mongoose = require('mongoose');

//스키마
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }, //ref:user를 통해 이항목의 데이터가 userCollection의 id와 연결됨을 몽구스가 알게해준다.
    createdAt: { type: Date, default: Date.now }, //default로 기본값을 지정할 수 있다. 함수명을 넣으면 해당함수의 return이 기본값이된다.
    updatedAt: { type: Date },
});
//model
const Post = mongoose.model('post', postSchema);
module.exports = Post;
