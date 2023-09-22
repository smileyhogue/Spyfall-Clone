import react from "react";
import {
  getCookie,
  getLobbyLocation,
  getPlayerRole,
} from "@/app/actions/gameInProgress";

export default async function GameInProgress(request: Request) {
  const requestData = JSON.parse(JSON.stringify(request));
  const sessionID: string = requestData.params.sessionID;
  const cookie = await getCookie();
  const cookieName = cookie?.value;
  if (cookieName === undefined) {
    return <div>Cookie not found</div>;
  }
  const lobbyLocation = await getLobbyLocation(sessionID);
  const playerRole = await getPlayerRole(sessionID, cookieName);
  return (
    <div>
      <p>Game in progress</p>
      <p>Location: {lobbyLocation?.name}</p>
      <p>Role: {playerRole}</p>
    </div>
  );
}
