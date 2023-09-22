"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function WebSocketHandler(props: { sessionID: string }) {
  const router = useRouter();
  // connect to websocket
  const ws = new WebSocket(
    "wss://free.blr2.piesocket.com/v3/1?api_key=fwgAxy5bvnDC4vjweGMQ1etiC57zqC1gmV2yg2bw&notify_self=1"
  );
  // on connection
  ws.onopen = () => {
    // send message
    ws.send(
      JSON.stringify({
        action: "subscribe",
        channel: `${props.sessionID}`,
      })
    );
  };
  // on message
  ws.onmessage = (event) => {
    const eventData = JSON.parse(event.data);
    if (eventData.action === "message") {
      const data = JSON.parse(JSON.stringify(eventData));
      if (data.type === "game_start" && data.channel === `${props.sessionID}`) {
        router.push(`/game/${props.sessionID}/gameInProgress`);
        ws.close();
      }
    }
  };
  return <></>;
}
