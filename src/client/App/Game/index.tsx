import { useEffect, useState } from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { LobbyClient } from "boardgame.io/client";
import { Link, useParams } from "react-router-dom";

import Board from "./Board";
import game from "../../../shared/game";
import { GAME_NAME } from "src/shared/utils";

const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

const GameClient = Client({
  game,
  board: Board,
  debug: {
    collapseOnLoad: true,
  },
  multiplayer: SocketIO({
    server: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
  }),
});

const Game = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { matchId } = useParams();
  const playerId = localStorage.getItem("playerId");
  const credentials = localStorage.getItem("clientCredentials");
  const playerName = localStorage.getItem("playerName");

  useEffect(() => {
    const lobbyClient = new LobbyClient({ server: SERVER });

    if (credentials && matchId && playerId && playerName) {
      Promise.all([
        lobbyClient.getMatch(GAME_NAME, matchId),
        lobbyClient.updatePlayer(GAME_NAME, matchId, {
          playerID: playerId,
          credentials,
          data: null,
        }),
      ])
        .then(([match]) => {
          console.log("match", match);
          setIsValid(match.gameover !== true);
        })
        .catch(() => {
          setIsValid(false);
        });
    }
  }, []);

  if (
    !credentials ||
    !matchId ||
    !playerId ||
    !playerName ||
    isValid === false
  ) {
    return (
      <div className="mt-10 max-w-2xl mx-auto text-center">
        <p>You do not have a valid session for this game.</p>
        <Link
          className="mt-4 inline-block shadow bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          to="/lobby"
          state={{ matchId: matchId }}
        >
          Back to lobby
        </Link>
      </div>
    );
  }

  if (isValid === null) {
    return <div>Loading game...</div>;
  }

  return (
    <GameClient
      matchID={matchId}
      playerID={playerId}
      credentials={credentials}
    />
  );
};

export default Game;
