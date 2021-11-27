const {isNickname} = require('../test/validation1');
const {isPassword} = require('../test/validation');
const {isPasswordConfirm} = require('../test/validation');
const {isExistNickname} = require('../test/validation1');

test('닉네임은 최소 3자 이상이어야 합니다.',()=>{
    expect(isNickname('hana1212')).toEqual(true);
    expect(isNickname('aa')).toEqual(false);
});

test('알파벳 대문자, 소문자, 숫자로만 만들수 있습니다.',()=>{
    expect(isNickname('HaN123')).toEqual(true);
    expect(isNickname('1_')).toEqual(false);
    expect(isNickname('12N**e')).toEqual(false);    
});

test('비밀번호는 최소 4자 이상이여야 한다.',()=>{
    expect(isPassword('hana1234')).toEqual(true);
    expect(isPassword('ha1')).toEqual(false);
});

test('비밀번호는 닉네임을 포함하지 않는 문자로 이루어져야한다.',()=>{
    expect(isPassword('hana88', 'user123')).toEqual(true);
    expect(isPassword('hana1234','hana1234')).toEqual(false);
});

test('비밀번호는 비밀번호 확인과 정확하게 일치해야한다.',()=>{
    expect(isPasswordConfirm('hana88', 'hana88')).toEqual(true);
    expect(isPasswordConfirm('hana88','hana888')).toEqual(false);
});
test('db에 존재하는 닉네임을 입력하면 회원가입을 할 수 없다.',()=>{
    expect(isExistNickname('user1234', 'hana11')).toEqual(true);
    expect(isExistNickname('hana1234', 'hana12345')).toEqual(true);
    expect(isExistNickname('user1234', 'user1234')).toEqual(false);
})
