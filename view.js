document.addEventListener("DOMContentLoaded", function(){

    const socket = io.connect("http://localhost:8080");
    let form = document.getElementById("chat_form");
    let nickname;
   

    $("#chat_form").submit(function(){
        socket.emit("messages", this.children[0].value);
        this.children[0].value = "";
        return false;
    });   

    socket.on('connect', data => {
        nickname = prompt("What is your nickname?");
        socket.emit("join", nickname);
    });

    socket.on("messages", data => {
        console.log(data)
        let output = document.getElementById("output");
        let p = document.createElement("p");
        let textNode = document.createTextNode(`${data.name}: ${data.message}`);
        p.className = "post";
        if (data.name === nickname) {
            p.className += " own";
        }
        p.appendChild(textNode);
        output.appendChild(p);
    }); 
});
