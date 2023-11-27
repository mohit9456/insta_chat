const socket = io();
const msgInput = document.getElementById("msgInp");
const msgButton = document.getElementById("send-container");
const messageContainer = document.querySelector('.chatBox');
const audio = new Audio('tone.mp3');


let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let dataString = urlParams.get('name');
let name = JSON.parse(dataString);

const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("msg");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    $('.chatBox').scrollTop($('.chatBox')[0].scrollHeight);
    if (position == 'left') {
        audio.play();
    }
}

socket.on('user-list', (userList) => {
    append(`${userList} are available for chat !`, "left");
})

window.addEventListener("load", function() {
    var scrollableDiv = document.querySelector(".chatBox");
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
});


append(`Welcome to the Chat ! ${name}`, "right");
socket.emit('joined', name);

socket.on("user-joined", (name) => {
    name = name.toUpperCase();
    append(`${name} has joined !`, "left");
})

msgInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        submitForm();
    }
})

msgButton.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm();
})

function submitForm() {
    if (msgInput.value.length != 0) {
        const msg = msgInput.value;
        append(`You : ${msg}`, "right");
        socket.emit("message", { msg });
        msgInput.value = '';
    }
}

socket.on('msg-sent', (data) => {
    const p = document.createElement('p');
    let mes = data.msg;
    let use = data.user;
    append(`${use} : ${mes}`, "left");
})

socket.on('left', (name) => {
    name = name.toUpperCase();
    append(`${name} left the chat !`, 'left');
})