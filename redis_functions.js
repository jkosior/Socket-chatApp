const redis = require("redis");
const redis_client = redis.createClient();

const helpers = {

    store_message: function (data) {
        let message = JSON.stringify(data);
        redis_client.lpush("messages", message, (err, response) => {
            redis_client.ltrim("messages", 0, 9);
        });
    },

    store_users: function(name){
        redis_client.ssad("users", name);
    },

    fetch_messages: function(client){
        redis_client.lrange("messages", 0, -1, (err, messages) => {
            messages = messages.reverse();

            messages.forEach(message => {
                message = JSON.parse(message);
                client.emit("messages", message);
            });

        });
    },

    fetch_users: function(client){
        redis_client.smembers("names", (err, names) => {
            names.forEach(name => {
                client.emit('add user');
            });
        });
    },

    remove_user: function(name){
        redis_client.srem("users", name);
    }
    
};

export default = helpers;