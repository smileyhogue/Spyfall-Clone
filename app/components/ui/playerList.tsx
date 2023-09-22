import { getSession, getPlayers } from "../../actions/gameLobby";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import getCookie from "@/app/actions/getcookies";

export default async function PlayerList({ sessionID }: any) {
  const cookie = await getCookie();
  const cookieName = cookie?.value;
  const sessionInfo = await getSession(sessionID);
  const players = await getPlayers(sessionID);
  if (sessionInfo === null) {
    return <p>Session not found</p>;
  }
  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{sessionInfo.host}</CardTitle>
          <CardDescription>Game Host</CardDescription>
        </CardHeader>
      </Card>
      {players.length > 0 ? (
        players.map((player: any, index: number) => {
          if (player.player_name === sessionInfo.host) {
            return;
          }
          return (
            <Card key={index} className="w-[350px]">
              <CardHeader>
                <CardTitle>{player.player_name}</CardTitle>
                <CardDescription>Player</CardDescription>
              </CardHeader>
            </Card>
          );
        })
      ) : (
        <p>Waiting for more players</p>
      )}
    </>
  );
}
