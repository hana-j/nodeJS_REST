const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const methodOverride = require('method-override');
const flash = require('connect-flash');//일회성 메세지를 웹 브라우저에 나타낼때 보통 사용
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const bodyPaser = require('body-parser');
const Post = require('./models/Post');
const config = require('./config/key')
const app = express();
//DB
//mongoose.connect("mongodb://localhost:27017/board1");
mongoose.connect(config.mongoURI);

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
app.use(session({
    secret:'hana',
    resave:true,
    saveUninitialized:true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.isAuthenticated(); //res.locals에 담겨진 변수는 ejs파일에서 바로 사용가능, 로그인했는지 안했는지 확인
    res.locals.currentUser = req.user;   //로그인한 유저 확인
    next();
})

//Routes ( 라우팅 미들웨어 )
app.use('/', require('./routes'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));
app.use('/comments', require('./routes/comment'));



//Port 연결s
const port = 3000;
app.listen(port, function(){
    console.log('server on 3000');
});

