document.addEventListener('DOMContentLoaded',setup)

function setup() {
    document.getElementById('demoButton').onclick = addSomething;
}

function addSomething(){
    const someDummyDiv = document.createElement('div');
    someDummyDiv.classList.add('generated');
    const count = document.getElementsByClassName('generated').length;
    someDummyDiv.innerHTML = `I was created by JS! There are already ${count} of my friends!`;
    const container = document.getElementById('container');
    container.appendChild(someDummyDiv);
}

let message = document.querySelector('.subscription-message');
let form = document.querySelector('.subscription');
let input = document.querySelector('.input');
let minMap = new MiniMaple()
//minMap.set_expression(input.value)
form.onsubmit = function(evt) {
    evt.preventDefault();
    message.textContent = input.value //minMap.dif('x');
};
