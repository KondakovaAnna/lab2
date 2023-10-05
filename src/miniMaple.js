class ParseFloatResult {
    constructor(suc, value) {
        this.suc = suc
        this.value = value
    }
}
function parseFloat(input) {
    let value = input.parseFloat()
    if (value == NaN) {
        value = null
        return new ParseFloatResult(false, value)
    }
    return new ParseFloatResult(true, value)
}

class Powerable {
    constructor() {
        this.pow = null
    }
    constructor(pow) {
        this.pow = pow
    }
    copy() {
        const copyObj = new this.constructor();
        copyObj.pow = this.pow;
        return copyObj;
    }
    parse(input) {
        let sv = parseFloat(input)
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
        this.reInit()
    }
    constructor(num, pow = 1) {
        this.num = num
        super(pow)
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
        let powInd = input.search('^')
        if (powInd == -1) {
            powInd = input.length
            this.pow = 1
        } else if (!super.parse(input.substring(powInd + 1, input.length))) {
            return false
        }
        let sv = parseFloat(input.substring(0, powInd))
        this.num = sv.value
        return sv.suc
    }
    toString() {
        return this.num.toString() + '^' + super.toString()
    }
}

class Variable extends Powerable {
    constructor() {
        this.reIn()
    }
    constructor(variable, pow = 1) {
        this.variable = variable
        super(pow)
    }
    copy() {
        const copyObj = super.copy();
        copyObj.variable = this.variable;
        return copyObj;
    }
    reIn(){
        this.variable = null
        super.reIn()
    }
    parse(input) {
        if (!(c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z')) {
            return false
        }
        let powInd = input.search('^')
        if (powInd == -1) {
            powInd = input.length
            this.pow = 1
        } else if (!super.parse(input.substring(powInd + 1, input.length))) {
            return false
        }
        input = input.substring(0, powInd)
        for (let i = 0; i < input.length; i++) {
            if(!(input[i] >= 'A' && input[i] <= 'Z' || input[i] >= 'a' && input[i] <= 'z')){
                this.reIn()
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
        return this.variable + '^' + super.toString()
    }
}

class Vari {
    constructor() { 
        this.vars = []
        this.nums = []
    }
    copy() {
        const copyTerm = new this.constructor();
        copyTerm.vars = this.vars.map(variable => variable.copy())
        copyTerm.nums = this.nums.map(number => number.copy())
        return copyTerm;
    }
    parse(input) {
        let lastInd = -1
        processing = true
        while (processing) {
            let ind = cur.search('*')
            if (ind == -1) {
                ind = cur.length
                processing = false
            }
            let val = input.substring(lastInd + 1, ind)

            let num = new Num()
            let parseRes = num.parse(val)
            if (parseRes) {
                this.nums.push(num.copy())
            } else {
                let variable = new Variable()
                if (!variable.parse(val)) {
                    this.vars = []
                    this.nums = []
                    return false
                }
                this.vars.push(variable.copy())
            }
        }
        return true
    }
    dif(difVar){
        if(this.vars.length == 0){
            return false
        }
        for(var i = 0; i < this.vars.length; i++){
            if(this.vars[i].dif(difVar)){
                if(this.vars[i].pow == 0){
                    this.vars.splice(i ,1)
                } else {
                    if(this.nums.length == 0) {
                        this.nums.push(new Num(1))
                    }
                    this.nums[0].num *= this.vars[i].pow + 1
                }
                return true
            }
        }
        return false
    }
    toString() {
        let res = ''
        for(var i = 0; i < this.nums.length; i++){
            res += this.nums[i].toString() + '*'
        }
        if(this.vars.length == 0){
            return res.substring(0, res.length - 1)
        }
        for(var i = 0; i < this.vars.length - 1; i++){
            res += this.vars[i].toString() + '*'
        }
        res += this.vars[this.vars.length-1].toString()
        return res
    }
}

class Expression{
    constructor(){
        this.variables = []
        this.sums = []
    }
    parse(input){
        this.variables = []
        this.sums = []
        input = input.replace(' ', '')
        flag = true
        ind = 0
        while (flag){
            for (var i = 0; i < input.length; i++){
                if (input[i] == '+' || input[i] == '-'){
                    ind = i
                    break
                }
            }
            if (ind == 0){
                ind = input.length
                flag = false
            }
            else{
                this.sums.push(input[ind])
            }
            let variable = new Vari()
            if(!variable.parse(input.substring(0, ind))){
                this.variables = []
                this.sums = []
                return false
            }
            this.variables.push(variable.copy())
            input = input.substring(ind + 1, input.length)
        }
        return true
    }
    dif(difVar) {
        if(this.variables.length == 0){
            return
        }
        for(var i = 0; i < this.variables.length - 1; i++){
            if(!this.variables[i].dif(difVar)){
                this.variables.splice(i, 1)
                this.sums.splice(i, 1)
            }
        }
        let i = this.variables.length - 1
        if(!this.variables[i].dif(difVar)){
            this.variables.splice(i, 1)
        }
    }
    toString(){
        let res = ''
        if(this.variables.length == 0){
            return res
        }
        for(var i = 0; i < this.variables.length - 1; i++){
            res += this.variables[i].toString() + this.sums[i]
        }
        res += this.variables[this.variables.length - 1].toString()
        return res
    }
}


class MiniMaple{
    constructor() {
        this.expression = Expression()

    }
    
}

export {MiniMaple}