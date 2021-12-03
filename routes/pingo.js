var express = require("express");
var router = express.Router();
const ws = require("ws");

const wsServer = new ws.Server({ server: server });
wsServer.on("connection", (socket) => {
  socket.on("message", (message) => console.log(message));
});

module.exports = router;
