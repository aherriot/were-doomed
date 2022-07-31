import { ReactElement } from "react";
import Button from "../../components/Button";
import { CommonProps } from "../types";

const PhasePreGame = ({
  G,
  ctx,
  playerInfoById,
  playerID,
  moves,
}: CommonProps): ReactElement => {
  const waitingForPlayers = [];
  for (let id in playerInfoById) {
    const playerInfo = playerInfoById[id];
    if (id !== "0" && playerInfo.name && !G.playerData[id].isAlive) {
      waitingForPlayers.push(playerInfo.name);
    }
  }

  return (
    <div className="mt-10 text-center">
      {waitingForPlayers.length > 0 ? (
        <div>
          Waiting for the following players to confirm:{" "}
          {waitingForPlayers.join(", ")}
        </div>
      ) : (
        <div>
          Waiting for{" "}
          <span className="font-semibold">{playerInfoById["0"].name}</span> to
          start the game
        </div>
      )}
      {playerID === "0" && (
        <Button className="mt-4" onClick={() => moves.startGame()}>
          Start Game
        </Button>
      )}
      {playerID && playerID !== "0" && !G.playerData[playerID].isAlive && (
        <Button onClick={() => moves.markReady()}>Ready!</Button>
      )}
    </div>
  );
};

export default PhasePreGame;
