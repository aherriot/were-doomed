import { Link, useNavigate } from "react-router-dom";
import { LobbyClient } from "boardgame.io/client";
import { GAME_NAME } from "../../../shared/utils";
import { useQuery } from "@tanstack/react-query";

type JoinExistingGameProps = {
  matchId: string;
  playerId: string;
  lobbyClient: LobbyClient;
  clientCredentials: string;
  clearAllExceptPlayerName: () => void;
};

const JoinExistingGame = ({
  matchId,
  playerId,
  lobbyClient,
  clientCredentials,
  clearAllExceptPlayerName,
}: JoinExistingGameProps) => {
  const navigate = useNavigate();
  const { isError, isLoading } = useQuery(
    [matchId, playerId, clientCredentials],
    () => {
      return lobbyClient
        .updatePlayer(GAME_NAME, matchId, {
          playerID: playerId,
          credentials: clientCredentials,
          data: null,
        })
        .then(() => {
          return true;
        });
    },
    {
      enabled: !!clientCredentials,
      onError: (e: { message: string }) => {
        if (e.message === "HTTP status 404") {
          navigate("/lobby");
        }
        clearAllExceptPlayerName();
      },
    }
  );

  if (isLoading) {
    return <div>Attempting to join existing game...</div>;
  }

  if (isError) {
    return (
      <div>
        There was an error joining the existing game you were a part of. Please
        return to lobby <Link to="/lobby">here</Link>.
      </div>
    );
  }

  return (
    <div>
      <h2>Join Existing Game</h2>
      <p>You are already part of a game.</p>
      <Link to={`/play/${matchId}/${playerId}`}>Go to game</Link>
      <button onClick={clearAllExceptPlayerName}>Leave Game</button>
    </div>
  );
};

export default JoinExistingGame;
