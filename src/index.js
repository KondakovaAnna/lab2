import {MiniMaple} from "./miniMaple";
//const parse = require('./miniMaple');

document.querySelector('button').onclick = myClick;

function myClick(){
    let a = document.querySelector('.i-1').value;
    let minMap = new MiniMaple()
    minMap.set_expression(input.value)
    console.log(minMap);
    document.querySelector('.out').innerHTML = minMap;
}