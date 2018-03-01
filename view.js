document.addEventListener("DOMContentLoaded", function(){

    const socket = io.connect("http://localhost:8080");
    let client = {
        nickname: null
    };
   

    $("#chat_form").submit(function(){
        socket.emit("messages", this.children[0].value);
        this.children[0].value = "";
        return false;
    });   

    socket.on('connect', data => {
        while (client.nickname === null){
            client.nickname = prompt("What is your nickname?");
            if (client.nickname !== null){
                socket.emit("join", client.nickname);
            }
        }
    });

    socket.on("messages", data => {
        let output = document.getElementById("output");
        let p = document.createElement("p");
        let textNode = document.createTextNode(`${data.name}: ${data.message}`);

        p.className = "post";

        if (data.name === client.nickname) {
            p.className += " own";
        }

        p.appendChild(textNode);
        output.appendChild(p);
    }); 
});
