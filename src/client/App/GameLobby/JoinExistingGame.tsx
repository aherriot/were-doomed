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
      retry: false,
      onError: (e: { message: string }) => {
        if (e.message === "HTTP status 404") {
          navigate("/lobby");
        }
        clearAllExceptPlayerName();
      },
    }
  );

  const onLeave = () => {
    if (playerId != null && clientCredentials) {
      lobbyClient.leaveMatch(GAME_NAME, matchId, {
        playerID: playerId,
        credentials: clientCredentials,
      });
    }
    clearAllExceptPlayerName();
    navigate("/lobby");
  };

  if (isLoading) {
    return <div>Attempting to join existing game...</div>;
  }

  if (isError) {
    return (
      <div>
        There was an error joining the existing game you were a part of. Please
        <Link
          className="text-slate-500 hover:underline focus:underline hover:text-yellow-500 focus:text-yellow-500 font-semibold"
          to="/lobby"
        >
          return to the lobby{" "}
        </Link>
        .
      </div>
    );
  }

  return (
    <div>
      <h2>Join Existing Game</h2>
      <p>You are already part of a game.</p>
      <button
        className="mt-7 focus:shadow-outline focus:outline-none text-slate-500 hover:underline focus:underline hover:text-yellow-500 focus:text-yellow-500 font-semibold"
        onClick={onLeave}
      >
        Leave Game
      </button>
      <Link
        className="ml-2 shadow bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        to={`/play/${matchId}/${playerId}`}
      >
        Go to game
      </Link>
    </div>
  );
};

export default JoinExistingGame;
