module.exports = {
    isNickname : (val)=>{
        // val가  닉네임 형식에 맞으면 true, 형식에 맞지 않으면 false를 return 하도록 구현
        
        if(val.length<4){
            return false;
        }
        else if(val.includes(' ')){
            return false;
        }
        for (const word of val.toLowerCase().split("")){
            if(!["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"].includes(word)) {
                return false;
            }
        }
        return true;
    },
};