const http = require("http");
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"));
// const clients = {};
// const games = {};

const wss = new websocketServer({
  httpServer: httpServer,
});

wss.on("request", (request) => {
  //connect
  const connection = request.accept(null, request.origin);
  // connection.on("open", () => console.log("opened!"));
  // connection.on("close", () => console.log("closed!"));
  connection.on("message", (message) => {
    const result = JSON.parse(message.utf8Data);

    if (result.method === "connect") {
      const clientId = result.clientId;
      console.log(clientId);
    }
  });

  connection.send(JSON.stringify({ message: "connection started" }));
});
