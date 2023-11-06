import {MiniMaple} from "./miniMaple";

document.addEventListener('DOMContentLoaded', setup);
let miniMaple = new MiniMaple()
function setup() {
    document.getElementById('action').onclick = myClick;
}

function myClick(){
    document.querySelector('.out').innerHTML ='...';
    const polynom = document.querySelector('.in').value;
    const variable = document.querySelector('.variable').value;
    let res = miniMaple.set_expression(polynom)
    if(!res) {
        alert("Incorrect input")
        return;
    }
    miniMaple.dif(variable)
    document.querySelector('.out').innerHTML = miniMaple.get_expression();
}