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
    isPasswordConfirm : (pwd, pwdConfirm) =>{
        for(let i = 0; i<pwd.length; i++){
            if(pwd[i] !== pwdConfirm[i] || pwd.length !== pwdConfirm.length){
                return false;
            } 
        }
        return true;
    }
};