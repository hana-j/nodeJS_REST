const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const methodOverride = require('method-override');
const flash = require('connect-flash');//일회성 메세지를 웹 브라우저에 나타낼때 보통 사용
const session = require('express-session')
const passport = require('./auth/passport');
const bodyPaser = require('body-parser');
const Post = require('./models/Post');
const app = express();
//DB
//mongoose.connect("mongodb://localhost:27017/board1");
mongoose.connect("mongodb://hana:hana@13.209.85.96:27017/board1?authSource=admin&authMechanism=SCRAM-SHA-1");

const db = mongoose.connection;
db.once('open', function(){
    console.log('DB Connected');
});
db.on('error', function(err){
    console.log('DB ERROR : ', err);
});

//미들웨어 설정들
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret:'hana', resave:true, saveUninitialized:true}))
app.use(passport.initialize());//passport초기화
app.use(passport.session());//passport와 session연결

app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.isAuthenticated(); //res.locals에 담겨진 변수는 ejs파일에서 바로 사용가능, 로그인했는지 안했는지 확인
    res.locals.currentUser = req.user;   //로그인한 유저 확인
    next();
})

//Routes ( 라우팅 미들웨어 )
app.use('/', require('./routes'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

//비밀번호 확인(수정)
app.post('/pwCheck', function(req,res){
    console.log(req.body.password);
        Post.findOne({password:req.body.password},  function(err, post){
            if(err) return res.json(err);
            res.render('posts/edit', {post:post});
            console.log('here')
        });
    
    
});
  
//비밀번호 확인(삭제)
app.post('/pwCheck1', function(req,res){
    console.log(req.body.password);
        Post.deleteOne({password:req.body.password}, function(err, result){
            if(err) return res.json(err);
            if(result) return res.send(result);
            console.log('here222')
        });
    
});



//Port 연결s
const port = 3000;
app.listen(port, function(){
    console.log('server on 3000');
});

