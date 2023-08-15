const express = require('express');
const {join, resolve} = require('path');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 3418;
//////////////////////////////////////////////////////
const http = require('http');
const server = http.createServer(app);
server.listen(port)

const { Server } = require("socket.io");
const io = new Server(server);

// let messages = [];
// let connectedList = [];
// let spectList = [];
// let boardList = [];

let { messages, connectedList, spectList, boardList } = JSON.parse(fs.readFileSync(join(__dirname,'./models/data.json')))

function save() {
    fs.writeFileSync(join(__dirname,'./models/data.json'), JSON.stringify({ messages, connectedList, spectList, boardList }));
}

function filterBoards() {
    boardList = boardList.filter(board => {
        const diffTime = Math.abs(Date.now() - board.time);
        const hours = Math.ceil(diffTime / (1000 * 60 * 60));
        return hours < 2;
    });
}

let connected = 0
io.on('connection', async (socket) => {
    try { 
        // messages = await db.Chat.findAll({include: [{model: db.User, as: "trainer", include: ["avatar"]}]})
    } catch (error) {
        console.log(error);
    }
    connected++
    io.sockets.emit("connected-list", connectedList);
    io.sockets.emit("spect-list", spectList);
    filterBoards();
    io.sockets.emit("board-list", boardList);
    io.sockets.emit("connected", connected);
    io.sockets.emit("messages", messages);

    // socket.on("first-connection", function(){
    //     io.sockets.emit("first-connection-resp", connectedList);
    // })

    // socket.on("ask-connected-list", function(){
    //     io.sockets.emit("connected-list", connectedList);
    // })

    socket.on("new-connected", function (data) {
        filterBoards();
        connectedList.push({
            id: socket.id, 
            name: data,
            role: "spect"
        });
        save()

        console.log(data, "se ha conectado");
        // console.log("Se encuentran conectados:", connectedList);
        io.sockets.emit("connected-list", connectedList);
    });

    socket.on("new-spect", function () {
        filterBoards();
        spectList.push({id: socket.id});
        save()
        console.log("Un nuevo espectador se ha conectado ("+spectList.length+" en total)");
        io.sockets.emit("spect-list", spectList);
    });

    socket.on("new-board", function (data) {
        filterBoards();
        console.log("connected-list", connectedList);
        console.log(data);
        boardList.push({
            id: boardList[0] ? boardList[0].id+1 : 1,
            title: data.title,
            password: data.password || null,
            owner: connectedList.find(c => data.id == c.id),
            mods: [],
            editors: [],
            time: Date.now(),
            code: {
                html: "",
                css: "",
                js: "",
                script: "",
                link: ""
            }
        })
        save()
        console.log(data.name+" ha creado un tablero ("+boardList.length+" en total)");
        io.sockets.emit("board-list", boardList);
    })

    socket.on('board-update', function(body){
        filterBoards();
        let b
        boardList.forEach(function(board){
            if (board.id == body.board) {
                board.code[body.field] = body.data
                b = board
            }
        })
        save()
        io.sockets.emit("board-list", boardList);
        io.sockets.emit("updated", {board: b, editor: body.editor})
    })

    socket.on('delete-board', function (data) {
        filterBoards();
        boardList = boardList.filter(b => b.id != data);
        save()
        io.sockets.emit("board-list", boardList);
    })

    socket.on("board-set-mod", function (data) {
        filterBoards();
        boardList.forEach(function (board) {
            if (board.id == data.boardId) { 
                board.mods = [...board.mods, data.user.id]
            }
        })
        save()
        console.log(`${data.user.name} ahora modera el tablero en ${data.boardId}`)
    })

    socket.on("board-unset-mod", function (data) {
        filterBoards();
        boardList.forEach(function (board) {
            if (board.id == data.boardId) { 
                board.mods = board.mods.filter((mod) => mod != data.user.id)
            }
        })
        save()
        console.log(`${data.user.name} ahora ya no modera el tablero ${data.boardId}`)
    })

    socket.on("board-set-editor", function (data) {
        filterBoards();
        boardList.forEach(function (board) {
            if (board.id == data.boardId) { 
                board.editors = [...board.editors, data.user.id]
            }
        })
        save()
        console.log(`${data.user.name} ahora tiene permisos de editar en ${data.boardId}`)
    })

    socket.on("board-unset-editor", function (data) {
        filterBoards();
        boardList.forEach(function (board) {
            if (board.id == data.boardId) { 
                board.editors = board.editors.filter((editor) => editor != data.user.id)
            }
        })
        save()
        console.log(`${data.user.name} ahora ya no tiene permiso de editar en ${data.boardId}`)
    })

    socket.on("new-message", function (data) {
        filterBoards();
        messages.push(data)
        save()
        io.sockets.emit("messages", messages);
    });

    socket.on("unconnecting", function (data) {
        filterBoards();
        connectedList = connectedList.filter(p => p.name != data);
        save()
        console.log(data, "se ha desconectado");
        console.log("Se encuentran conectados:", connectedList);
        // io.sockets.emit('unconnect', data);
        io.sockets.emit("connected-list", connectedList);
    });

    socket.on('disconnect', function() {
        filterBoards();
        connectedList = connectedList.filter(p => p.id != socket.id);
        spectList = spectList.filter(p => p.id != socket.id);
        save()
        io.sockets.emit("connected-list", connectedList);
        io.sockets.emit("spect-list", spectList);
        console.log("alguien se ha ido");
        connected--
        io.sockets.emit("connected", connected);
    });
});
/////////////////////////////////////////////////
console.log("Servidor corriendo en el puerto " + port);

app.use(express.urlencoded({extended:false})); 
app.use(express.json())

const public = resolve(__dirname, '../public');
const static = express.static(public);
app.use(static);

app.set ('views', resolve(__dirname, 'views'));
app.set("view engine", "ejs");

const indexRoutes = require('./routes/indexRoutes');
app.use(indexRoutes);