const {isPassword} = require('../test/validation');
const {isNickname} = require('../test/validation1');

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

test('닉네임을 포함하지 않는 문자로 이루어져야한다.',()=>{
    expect(isPassword('hana88', 'user123')).toEqual(true);
    expect(isPassword('hana1234','hana1234')).toEqual(false);
});

