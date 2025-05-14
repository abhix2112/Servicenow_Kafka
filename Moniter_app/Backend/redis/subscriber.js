const redis = require("redis");
const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect();

module.exports = (io) => {
  client.subscribe("new_event", (message) => {
    const event = JSON.parse(message);
    io.emit("new_event", event); // Broadcast to all clients
  });
};
