const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", client =>{

    client.on("join", name =>{
        client.nickname = name;
        console.log(`${name} joined`);
    });

    client.on("messages", data => {
        let emitedData = {
            name: client.nickname,
            message: data
        };
        client.broadcast.emit("messages", emitedData);
        client.emit("messages", emitedData);
    });

});

app.use("/static", express.static(`${__dirname}`));

app.get("/", (req,res) => {
    res.sendFile(`${__dirname}/html/view.html`);
});

server.listen(8080);