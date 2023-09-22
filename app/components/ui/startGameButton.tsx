"use client";
import { Button } from "@/components/ui/button"
import { startNewGame } from "@/app/actions/startGame"

export default function StartGame(props: { sessionID: string }) {
    const { sessionID } = props;

    function handleClick() {
        startNewGame(sessionID);
    }

    return (
        <Button onClick={handleClick}>Start Game</Button>
    )
}