const mongoose = require('mongoose');

//스키마
const userSchema = mongoose.Schema(
    {
        nickname: {
            type: String,
            required: [true, '아이디는 필수 입니다.'],
            match: [
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,16}$/,
                '3자이상 문자와 숫자조합으로 입력해주세요',
            ],
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, '비밀번호는 필수입니다.'],
            select: false,
        },
    },
    { toObject: { virtuals: true } }
);

//virtuals : 회원가입, 회원정보 수정을 위해 필요하지만 db에는 저장할 필요없는 값을 확인하고 정의
userSchema
    .virtual('passwordConfirmation')
    .get(function () {
        return this._passwordConfirmation;
    })
    .set(function (value) {
        this._passwordConfirmation = value;
    });

//password 유효성검사
const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,16}$/;
userSchema.path('password').validate(function (v) {
    const user = this; //this는 user model이다.
    
    if(user.password.includes(user.nickname)){
        user.invalidate(
            'password',
            '4자리이상 아이디와 겹치지 않는 숫자와 문자조합으로 작성해주세요'
        )
    }
    if (!passwordValid.test(user.password)) {
        user.invalidate(
            'password',
            '4자리이상 아이디와 겹치지 않는 숫자와 문자조합으로 작성해주세요'
        );
    }
    if (!user.passwordConfirmation) {
        user.invalidate('passwordConfirmation', '비밀번호 확인을 해주세요');
    } else if (user.password !== user.passwordConfirmation) {
        user.invalidate(
            'passwordConfirmation',
            '비밀번호 확인이 비밀번호와 일치하지 않습니다.'
        );
    }
});

userSchema.methods.authenticate = function (password) {
    const user = this;
    return password, user.password;
};
const User = mongoose.model('user', userSchema);
module.exports = User;
