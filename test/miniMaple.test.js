import {MiniMaple} from "../src/miniMaple";

test('getting standard value', () => {
    let minMap = new MiniMaple()
    let exp = minMap.get_expression()
    expect(exp).toBe('')

    minMap.set_expression('')
    exp = minMap.get_expression()
    expect(exp).toBe('')
});

test('dif standard value with x variable', () => {
    let minMap = new MiniMaple()
    minMap.dif('x')
    let exp = minMap.get_expression()
    expect(exp).toBe('')
});

test('dif without variable', () => {
    let minMap = new MiniMaple()
    minMap.dif('')
    let exp = minMap.get_expression()
    expect(exp).toBe('')

    minMap.set_expression('4*x^3')
    minMap.dif('')
    exp = minMap.get_expression()
    expect(exp).toBe('4*x^3')
});

test('dif with non-existent variable', () => {
    let minMap = new MiniMaple()
    minMap.dif('y')
    let exp = minMap.get_expression()
    expect(exp).toBe('')

    minMap.set_expression('4*x^3')
    minMap.dif('y')
    exp = minMap.get_expression()
    expect(exp).toBe('0')
});

test('4*x^3, x //=> 12*x^2', () => {
    let minMap = new MiniMaple()
    minMap.set_expression('4*x^3')
    minMap.dif('x')
    let exp = minMap.get_expression()
    expect(exp).toBe('12*x^2')
});

test('4*x^3-x^2, x //=> 12*x^2 - 2*x ', () => {
    let minMap = new MiniMaple()
    minMap.set_expression('4*x^3-x^2')
    minMap.dif('x')
    let exp = minMap.get_expression()
    expect(exp).toBe('12*x^2 - 2*x')
});

