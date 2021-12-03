import React from "react";
import "./pingo.scss";

function Pingo({ user }) {
  const ws = new WebSocket("ws://localhost:9090/");

  const [dt, setDt] = React.useState({
    clientId: user._id,
    gameId: null,
    playerColor: null,
  });

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        method: "connect",
        clientId: dt.clientId,
      })
    );
  };

  const [input, setInput] = React.useState("");

  ws.onmessage = (message) => {
    const response = JSON.parse(message.data);
    //connect
    if (response.method === "connect") {
      console.log("Client id Set successfully " + dt.clientId);
    }
  };

  return (
    <>
      <div className="pingo">
        <div>
          <input type="text" placeholder="game code" />
          <div className="button-group">
            <div
              onClick={() => {
                if (dt.gameId === null) dt.gameId = input;

                const payLoad = {
                  method: "join",
                  clientId: dt.clientId,
                  gameId: dt.gameId,
                };

                ws.send(JSON.stringify(payLoad));
              }}
            >
              Join
            </div>
            <div
              onClick={() => {
                const payLoad = {
                  method: "create",
                  clientId: dt.clientId,
                };

                ws.send(JSON.stringify(payLoad));
              }}
            >
              Create
            </div>
          </div>
        </div>

        <div className="gameboard"></div>
      </div>
    </>
  );
}

export default Pingo;
