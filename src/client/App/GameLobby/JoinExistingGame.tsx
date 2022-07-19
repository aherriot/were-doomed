import { Link } from "react-router-dom";
import { LobbyClient } from "boardgame.io/client";
import { GAME_NAME } from "../../../shared/utils";
import { useEffect, useState } from "react";

type JoinExistingGameProps = {
  matchId: string;
  playerId: string;
  lobbyClient: LobbyClient;
};

const JoinExistingGame = ({
  matchId,
  playerId,
  lobbyClient,
}: JoinExistingGameProps) => {
  const [isValid, setIsValid] = useState<boolean | null>(false);
  useEffect(() => {
    const isUserValid = async (
      matchId: string,
      playerId: string,
      credentials: string
    ) => {
      try {
        await lobbyClient.updatePlayer(GAME_NAME, matchId, {
          playerID: playerId,
          credentials,
          data: null,
        });

        return setIsValid(true);
      } catch (e) {}

      return setIsValid(false);
    };

    const clientCredentials = localStorage.getItem("clientCredentials");

    if (matchId && playerId && clientCredentials) {
      isUserValid(matchId, playerId, clientCredentials);
    } else {
      setIsValid(false);
    }
  }, [matchId, playerId, lobbyClient]);

  if (isValid === null) {
    return <div>Loading...</div>;
  } else if (!isValid) {
    return <div>Your game is not valid. Please return to the lobby.</div>;
  }
  return (
    <div>
      <h1>We're Doomed!</h1>
      <h2>Join Existing Game</h2>
      <p>You are already part of a game.</p>
      <Link to={`/games/${matchId}/${playerId}`}>Go to game</Link>
      <button
        onClick={() => {
          localStorage.removeItem("clientCredentials");
          localStorage.removeItem("matchId");
          localStorage.removeItem("playerId");
        }}
      >
        Leave Game
      </button>
    </div>
  );
};

export default JoinExistingGame;
