import React from "react";
import PlayerList from "../../components/ui/playerList";
import StartGameButton from "../../components/ui/startGameButton";
import WebSocketHandler from "@/app/components/websockethandler";

export default async function GamePage(request: Request) {
  const requestData = JSON.parse(JSON.stringify(request));
  const sessionID: string = requestData.params.sessionID;

  return (
    <div>
      <PlayerList sessionID={sessionID} />
      <StartGameButton sessionID={sessionID} />
      <WebSocketHandler sessionID={sessionID} />
    </div>
  );
}
