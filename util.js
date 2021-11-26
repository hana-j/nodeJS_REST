const util = {};

//functions 몽구스와 몽고디비에서 나는 에러의 형ㅌ태가 다르기 때문에 에러의 형태를 통일시켜준다 {항목이름 : {message : "에러메세지"}}
util.parseError = function (errors) {
    const parsed = {};
    if (errors.name == 'ValidationError') {
        for (let name in errors.errors) {
            let ValidationError = errors.errors[name];
            parsed[name] = { message: ValidationError.message };
        }
    } else if (
        errors.code == '11000' &&
        errors.errmsg.indexOf('nickname') > 0
    ) {
        parsed.nickname = { message: '이미 존재하는 아이디 입니다.' };
    } else {
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
};

// util.isLoggedin = function(req, res, next){
//     if(!req.isAuthenticated()){
//         //req.flash('errors', {login :'로그인 먼저 해주세요'});
//         res.status(403).send('로그인필요').redirect('/users/login');
//         //res.redirect('/users/login');

//     }else{
//         next();
//     }
// }
util.isLoggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('errors', { login: '로그인 먼저 해주세요' });
        res.redirect('/users/login');
        //res.send('<script type="text/javascript">alert("로그인 먼저해주세요"); </script>');
    }
};
util.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};
util.noPermission = function (req, res) {
    req.flash('errors', { login: '권한이 없습니다.' });
    req.logout();
    res.redirect('/login');
};

module.exports = util;
