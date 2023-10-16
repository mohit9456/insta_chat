const express= require('express');
const port = 8000 || process.env.PORT; 

const http = require("http");
const socketIo = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));


const users = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/join.html');
})

app.get("/chat", (req, res) => {
    let dataQueryString = req.query.name;
    let data = JSON.parse(dataQueryString);
    res.sendFile(__dirname + '/public/chat.html', {data});
})

io.on('connection', socket => {

    socket.on('joined', name => {
        users[socket.id] = name;
        io.emit("user-list", Object.values(users));
        socket.broadcast.emit("user-joined", name);
    })

    socket.on('message', ({msg}) => {
        socket.broadcast.emit('msg-sent', {msg, user : users[socket.id]});
    })


    socket.on('disconnect', message => {
        const userName = users[socket.id];
        delete users [socket.id]
        io.emit("user-list", Object.values(users));
        socket.broadcast.emit('left', userName);
    })
})


server.listen(port, () => {
    console.log(`Server is working on port ${port}`);
})
