const { MiniMaple } = require("../src/miniMaple");

test('getting standard value is 0 😶', () => {
    let minMap = new MiniMaple()
    let exp = minMap.get_expression()
    expect(exp).toBe('0')

    minMap.set_expression('')
    exp = minMap.get_expression()
    expect(exp).toBe('0')
});

test('dif standard value with x variable is 0 🤗', () => {
    let minMap = new MiniMaple()
    minMap.dif('x')
    let exp = minMap.get_expression()
    expect(exp).toBe('0')
});

test('dif without variable 🤭', () => {
    let minMap = new MiniMaple()
    minMap.dif('')
    let exp = minMap.get_expression()
    expect(exp).toBe('0')

    let expected = '4*x^3'
    minMap.set_expression('4*x^3')
    minMap.dif('')
    exp = minMap.get_expression()
    expect(exp).toEqual(expected);
});
test('just x return 1 🤫', () => {
    let minMap = new MiniMaple()
    minMap.set_expression('x')
    minMap.dif('x')
    let expected = '1';
    let exp = minMap.get_expression()
    expect(exp).toEqual(expected);
})
test('dif with non-existent variable 🧐', () => {
    let minMap = new MiniMaple()
    minMap.dif('y')
    let exp = minMap.get_expression()
    expect(exp).toBe('0')

    minMap.set_expression('4*x^3')
    minMap.dif('y')
    exp = minMap.get_expression()
    expect(exp).toBe('0')
});

test('4*x^3, x //=> 12*x^2 🤯', () => {
    let minMap = new MiniMaple()
    minMap.set_expression('4*x^3');
    minMap.dif('x');
    let expected = '12*x^2';
    let exp = minMap.get_expression();
    expect(exp).toEqual(expected);
});

test('4*x^3-x^2, x //=> 12*x^2 - 2*x 😲', () => {
    let minMap = new MiniMaple()
    minMap.set_expression('4*x^3-x^2');
    minMap.dif('x');
    let expected = '12*x^2-2*x';
    let exp = minMap.get_expression();
    expect(exp).toEqual(expected);
});

test('+ or - at first char 🤗', () => {
    let minMap = new MiniMaple()
    minMap.set_expression('-x^2+x^3')
    minMap.dif('x')
    let expected = '-2*x+3*x^2';
    let exp = minMap.get_expression()
    expect(exp).toEqual(expected);

    minMap.set_expression('+x^2+x^3')
    minMap.dif('x')
    exp = minMap.get_expression()
    expected = '2*x+3*x^2';
    expect(exp).toEqual(expected);

    let parseRes = minMap.set_expression('-$x^2+x^3')
    expect(parseRes).toBe(false)
})

test('4*y^3, x //=> 0 🧐', () => {
    let minMap = new MiniMaple()
    minMap.set_expression('4*y^3+y')
    minMap.dif('x')
    let exp = minMap.get_expression()
    expect(exp).toBe('0')
});

test('failed to parse x^awe3 😶', () => {
    let minMap = new MiniMaple()
    let parseRes = minMap.set_expression('x^awe3')
    expect(parseRes).toBe(false)
});

test('variables with digits 😶', () => {
    let minMap = new MiniMaple()
    let parseRes = minMap.set_expression('123x')
    expect(parseRes).toBe(false)

    parseRes = minMap.set_expression('x152')
    expect(parseRes).toBe(true)

    parseRes = minMap.set_expression('x1v')
    expect(parseRes).toBe(true)

    parseRes = minMap.set_expression('x&!')
    expect(parseRes).toBe(false)
});

test('zero multiplier removes term 😶', () => {
    let minMap = new MiniMaple()
    minMap.set_expression('0*x+1*x^2')
    let exp = minMap.get_expression()
    expect(exp).toBe('x^2')
});

test('5*x*y to string 😶', () => {
    let minMap = new MiniMaple()
    minMap.set_expression('5*x*y')
    let exp = minMap.get_expression()
    expect(exp).toBe('5*x*y')
});

test('safe parse float test 😶', () => {
    let minMap = new MiniMaple()

    let parseRes = minMap.set_expression('.5*x')
    expect(parseRes).toBe(false)

    parseRes = minMap.set_expression('0.*x')
    expect(parseRes).toBe(false)

    parseRes = minMap.set_expression('2.5.5*x')
    expect(parseRes).toBe(false)
});