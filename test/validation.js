module.exports = {
    isPassword : (pwd, id)=>{
        if(pwd.length<5){
            return false;
        }
        else if(pwd.includes(' ')){
            return false;
        }
        else if(pwd.includes(id)){
            return false;
        }
        return true;
    },
};