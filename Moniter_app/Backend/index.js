require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Load routes
app.use("/api/stats", require("./routes/stats"));
app.use("/api/service-events", require("./routes/serviceEvents"));
app.use("/api/events", require("./routes/event"));
app.use("/api/logs", require("./routes/logs"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// WebSocket setup
require("./websockets/socket")(io);

// Redis subscription to push to WebSocket
require("./redis/subscriber")(io);

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
