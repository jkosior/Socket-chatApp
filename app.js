const express = require("express");
const http = require("http");
const redis_func = require('./redis_functions');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);


io.on("connection", client => {

    client.on("join", name => {
        client.nickname = name;
        client.broadcast.emit("add user", name);
        console.log(`${name} joined`);
        redis_func.fetch_users(client);
        redis_func.store_users(name);
        redis_func.fetch_messages(client);
    });

    client.on("messages", data => {
        let emitedData = {
            name: client.nickname,
            message: data
        };
        client.broadcast.emit("messages", emitedData);
        client.emit("messages", emitedData);
        redis_func.store_messages(data);
    });

    client.on("disconnect", () => {
        client.broadcast.emit("remove user", client.nickname);
        redis_func.remove_user(client.nickname);
    });

});

app.use("/static", express.static(`${__dirname}`));

app.get("/", (req,res) => {
    res.sendFile(`${__dirname}/html/view.html`);
});

server.listen(8080);