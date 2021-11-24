if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod'); //배포상태일때
}else{
    module.exports = require('./dev');  //로컬개발환경일때
}