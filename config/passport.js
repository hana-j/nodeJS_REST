const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
/*
const passportConfig = {usernameField:'nickname',passwordField:'password'};
const passportVerify = async(req, nickname,done)=>{
    try{
        //유저아이디로 일치하는 유저검색
        const user = await User.findOne({nickname:nickname}).select({password:1});
        if(!user){
            req.flash('nickname', nickname);
            req.flash('errors', {login: '아이디 또는 비밀번호가 일치하지 않습니다.'});
            return;
        }

    }catch(error){
        console.log(error);
        done(error);
    }
};
const JWTConfig = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'jwt-secret-key',
  };
  
  const JWTVerify = async (jwtPayload, done) => {
    try {
          // payload의 id값으로 유저의 데이터 조회
      const user = await User.findOne({ nickname: jwtPayload.nickname } );
          // 유저 데이터가 있다면 유저 데이터 객체 전송
      if (user) {
        done(null, user);
        return;
      }
          // 유저 데이터가 없을 경우 에러 표시
      done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
    } catch (error) {
      console.error(error);
      done(error);
    }
  };
module.exports = () =>{
    passport.use('local', new LocalStrategy(passportConfig, passportVerify));
    //passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
}

*/
//serialize && deserialize =>패스포트가 세션을 사용하기 위해 필요한 코드 
passport.serializeUser((user, done)=>{
    done(null, user.id);     //userid만 담아서 session에 값을 담아준다.
});
passport.deserializeUser((id, done)=>{
    User.findOne({_id:id}, (err, user)=>{
        done(err, user);
    });
});

//패스포트 사용자 지정
passport.use('local',
    new LocalStrategy({
        usernameField:'nickname', //req.body.nickname의 이름과 같게 설정해주어야한다.
        passwordField:'password',
        passReqToCallback:true
    },
    function(req, nickname, password, done){
        console.log(nickname, password);
        User.findOne({nickname:nickname})
        .select({password:1})
        .exec((err, user)=>{
            if(err) return done(err);
            if(user && password ==user.authenticate(password)){
                return done(null, user);                  //성공시 done(null, 유저객체)
            }
            else{
                req.flash('nickname', nickname);
                req.flash('errors', {login: '아이디 또는 비밀번호가 일치하지 않습니다.'});
                return done(null, false);
            }
        })
    }
    )
);
module.exports = passport;