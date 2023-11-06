class ParseFloatResult {
    constructor(suc, value) {
        this.suc = suc
        this.value = value
    }
}
class IndexOfResult {
    constructor(ind = -1, char = ''){
        this.ind = ind
        this.char = char
    }
}

function safeParseFloat(input) {
    if (input.length == 0 || input.at(0) == '.' || input.at(input.length - 1)  == '.') {
        return new ParseFloatResult(false, 0)
    }
    let from = 0
    if(input.at(0) == '-' || input.at(0) == '+'){
        from = 1
    }
    let containsDot = false;
    for (let i = from; i < input.length; i++) {
        if (!isDigit(input.at(i))){
            if(!containsDot && input.at(i) == '.'){
                containsDot = true;
            } else{
                return new ParseFloatResult(false, 0)
            }
        }  
    }
    let value = parseFloat(input)
    return new ParseFloatResult(true, value)
}
function isDigit(c) {
    return c >= '0' && c <= '9'
}
function isLetter(c) {
    return c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z'
}
function indexOf(input, chars, searchFrom) {
    console.log(input.length)
    for(let i = searchFrom; i < input.length; i++){
        for(let j = 0; j < chars.length; j++){
            if(input.at(i) == chars.at(j)){
                return new IndexOfResult(i, chars.at(j))
            }
        }
    }
    return new IndexOfResult()
}

class Term {
    constructor() {
        this.reInit()
    }
    copy() {
        const copyTerm = new this.constructor();

        copyTerm.vars = this.vars.map(variable => variable.copy());
        copyTerm.nums = this.nums.map(number => number.copy());

        return copyTerm;
    }
    reInit() {
        this.vars = []
        this.nums = []
    }
    parse(input) {
        console.log('term ', input)
        let processing = true
        while (processing) {

            let ind = input.indexOf('*')
            if (ind == -1) {
                ind = input.length
                processing = false
            }
            console.log('ind', ind)
            let unknownVal = input.substring(0, ind)
            let num = new Num()
            let parseRes = num.parse(unknownVal)
            console.log('num parse res', parseRes)
            if (parseRes) {
                console.log('num', num.toString())
                if (num.num == 0) {
                    this.reInit();
                    return true;
                }
                if(num.num != 1){
                    this.nums.push(num.copy())
                }
            } else {
                if (input[0] == '-') {
                    num.num = -1;
                    num.pow = 1;
                    this.nums.push(num.copy())
                    console.log('num pushed')
                    unknownVal = input.substring(1, ind)
                } else if (input[0] == '+') {
                    unknownVal = input.substring(1, ind)
                }
                let variable = new Variable()
                if (!variable.parse(unknownVal)) {
                    console.log('var parse res', false)
                    this.reInit()
                    return false
                }
                console.log('var parse res', true)
                this.vars.push(variable.copy())
            }
            input = input.substring(ind + 1, input.length)
        }
        console.log('TERM RETURNED')
        return true
    }
    dif(difVar) {
        if (this.vars.length == 0) {
            return false
        }
        for (let i = 0; i < this.vars.length; i++) {
            if (this.vars[i].dif(difVar)) {
                if (this.nums.length == 0) {
                    this.nums.push(Num.constructorNumPow(1, 1))
                }
                this.nums[0].num *= this.vars[i].pow + 1
                if (this.vars[i].pow == 0) {
                    this.vars.splice(i, 1)
                    console.log(this.toString())
                }
                return true
            }
        }
        return false
    }
    empty(){
        return this.vars.length == 0 && this.nums.length == 0
    }
    toString() {
        let res = ''
        for (let i = 0; i < this.nums.length; i++) {
            res += this.nums[i].toString() + '*'
        }
        if (this.vars.length == 0) {
            return res.substring(0, res.length - 1)
        }
        for (let i = 0; i < this.vars.length - 1; i++) {
            res += this.vars[i].toString() + '*'
        }
        res += this.vars[this.vars.length - 1].toString()
        return res
    }
}

class Powerable {
    constructor() {
        this.reInit()
    }
    copy() {
        const copyObj = new this.constructor();
        copyObj.pow = this.pow;
        return copyObj;
    }
    reInit(){
        this.pow = null
    }
    parse(input) {
        console.log("Powerable", input)
        let sv = safeParseFloat(input)
        if(!sv.suc || sv.value < 1){
            return false
        }
        this.pow = sv.value
        return true
    }
    toString(){
        return this.pow.toString()
    }
}

class Num extends Powerable {
    constructor() {
        super()
        this.reInit()
    }
    static constructorNumPow(num, pow = 1) {
        let res = new Num()
        res.num = num
        res.pow = pow
        return res
    }
    copy() {
        const copyObj = super.copy();
        copyObj.num = this.num;
        return copyObj;
    }
    reInit(){
        this.num = null
        super.reInit()
    }
    parse(input) {
        let powInd = input.indexOf('^')
        if (powInd == -1) {
            powInd = input.length
            this.pow = 1
        } else if (!super.parse(input.substring(powInd + 1, input.length))) {
            return false
        }

        let sv = safeParseFloat(input.substring(0, powInd))
        this.num = sv.value
        return sv.suc
    }
    toString() {
        return this.num.toString()
    }
}


class Variable extends Powerable {
    constructor() {
        super()
        this.reInit()
    }
    copy() {
        const copyObj = super.copy();
        copyObj.variable = this.variable;
        return copyObj;
    }
    reInit(){
        this.variable = null
        super.reInit()
    }
    parse(input) {
        if (!isLetter(input.at(0))) {
            return false
        }
        let powInd = input.indexOf('^')
        if (powInd == -1) {
            powInd = input.length
            this.pow = 1
        } else if (!super.parse(input.substring(powInd + 1, input.length))) {
            return false
        }
        input = input.substring(0, powInd)
        for (let i = 0; i < input.length; i++) {
            if(!(isLetter(input[i]) || isDigit(input[i]))){
                this.reInit()
                return false
            }
        }
        this.variable = input
        return true
    }
    dif(difVar){
        if(this.variable == difVar){
            this.pow--
            return true
        }
        return false
    }
    toString() {
        let powStr = ''
        if (this.pow > 1){
            powStr = '^' + super.toString()
        }
        return this.variable + powStr
    }
}


class Expression {
    constructor() {
        this.reInit()
    }
    parseHelper(inp_arr, searchFrom) {
        let ioRes = indexOf(inp_arr[0], ['+', '-'], searchFrom)
        if (ioRes.ind === -1) {
            ioRes.ind = inp_arr[0].length
        } else {
            this.sumOps.push(ioRes.char)
        }
        let term = new Term()
        if (!term.parse(inp_arr[0].substring(0, ioRes.ind))) {
            console.log('Term is not parsed')
            this.reInit()
            return false
        }
        if(!term.empty()){
            this.terms.push(term.copy())
        } else{
            this.sumOps.splice(this.sumOps.length-1, 1)
        }
        
        inp_arr[0] = inp_arr[0].substring(ioRes.ind + 1, inp_arr[0].length)
        return true
    }
    parse(input) {
        this.clear()
        input = input.replaceAll(' ', '')
        console.log('input expr', input)
        if(input.length == 0){
            this.reInit()
            return false
        }
        let parseRes = true
        let inp_arr = [input]
        if (input.at(0) == '-' || input.at(0) == '+') {
            parseRes = this.parseHelper(inp_arr, 1);
            if(!parseRes){
                return false
            }
        }
        while (inp_arr[0].length > 0) {
            parseRes = this.parseHelper(inp_arr, 0)
            if(!parseRes){
                return false
            }
        }
        return true
    }
    dif(difVar) {
        for (let i = 0; i < this.terms.length - 1; i++) {
            if (!this.terms[i].dif(difVar)) {
                this.terms.splice(i, 1)
                this.sumOps.splice(i, 1)
            }
        }
        let i = this.terms.length - 1
        if (!this.terms[i].dif(difVar)) {
            this.terms.splice(i, 1)
        }
        if (this.terms.length == 0) {
            this.reInit()
        }
    }
    reInit() {
        this.clear()
        let t = new Term()
        let n = new Num()
        n.num = 0
        t.nums.push(n)
        this.terms.push(t)
    }
    clear() {
        this.terms = []
        this.sumOps = []
    }
    toString() {
        let res = ''
        for (let i = 0; i < this.terms.length - 1; i++) {
            res += this.terms[i].toString() + this.sumOps[i]
        }
        res += this.terms[this.terms.length - 1].toString()
        return res
    }
}

class MiniMaple {
    constructor() {
        this.exp = new Expression()
    }
    set_expression(input) {
        return this.exp.parse(input)
    }
    get_expression() {
        return this.exp.toString()
    }
    dif(variable){
        if (variable.length == 0){
            return
        }
        this.exp.dif(variable)
    }
}
module.exports = { MiniMaple };