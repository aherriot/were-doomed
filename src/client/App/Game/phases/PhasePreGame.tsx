import { ReactElement, useState } from "react";
import Button from "../../components/Button";
import { CommonProps } from "../types";

const PhasePreGame = ({
  G,
  ctx,
  playerInfoById,
  playerID,
  moves,
}: CommonProps): ReactElement => {
  const [gameLength, setGameLength] = useState<number>(15);

  const waitingForPlayers = [];
  for (let id in playerInfoById) {
    const playerInfo = playerInfoById[id];
    if (id !== "0" && playerInfo.name && !G.playerData[id].isAlive) {
      waitingForPlayers.push(playerInfo.name);
    }
  }

  return (
    <div className="mt-10 text-center">
      <div>
        The end of the world is upon us. As a world leader, you must help build
        a space ship to escape the planet.
      </div>
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
        <div className="mt-6">
          <div>
            <span className="font-semibold"> Game Length</span>
            <select
              value={gameLength}
              onChange={(e) => setGameLength(parseInt(e.target.value, 10))}
              className="ml-4 text-md bg-slate-200 px-2 pr-4 py-2 rounded focus:outline-none focus:bg-slate-400 cursor-pointer"
            >
              <option value={1}>1 minute</option>
              <option value={4}>4 minutes</option>
              <option value={6}>6 minutes</option>
              <option value={8}>8 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={12}>12 minutes</option>
              <option value={15}>15 minutes</option>
            </select>
          </div>
          <Button className="mt-6" onClick={() => moves.startGame(gameLength)}>
            Start Game
          </Button>
        </div>
      )}
      {playerID && playerID !== "0" && !G.playerData[playerID].isAlive && (
        <Button onClick={() => moves.markReady()}>Ready!</Button>
      )}
    </div>
  );
};

export default PhasePreGame;
