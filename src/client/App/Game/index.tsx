import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Link, useNavigate, useParams } from "react-router-dom";

import Board from "./Board";
import WereDoomed from "../../../WereDoomed";

import "./index.css";

const GameClient = Client({
  game: WereDoomed,
  board: Board,
  debug: true,
  multiplayer: SocketIO({
    server: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
  }),
});

const Game = () => {
  const { matchId, playerId } = useParams();
  const credentials = localStorage.getItem("clientCredentials");
  const playerName = localStorage.getItem("playerName");

  if (!credentials || !matchId || !playerId || !playerName) {
    return (
      <div>
        <p>
          You do not have a valid session for this game. Please go back to the
          lobby to try again
        </p>
        <Link to="/lobby">Back to lobby</Link>
      </div>
    );
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
