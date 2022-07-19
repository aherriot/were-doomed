import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GAME_NAME, MAX_NUMBER_OF_PLAYERS } from "../../../shared/utils";
import useInterval from "../../../shared/utils/useInterval";

type MatchListProps = {
  lobbyClient: LobbyClient;
  playerName: string;
};

const MatchList = ({ playerName, lobbyClient }: MatchListProps) => {
  const [games, setGames] = useState<LobbyAPI.Match[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const fetchMatches = useCallback(async () => {
    try {
      const games = await lobbyClient.listMatches(GAME_NAME, {
        isGameover: false,
      });

      if (games?.matches) {
        // const match = games?.matches.find((match) => match.matchID === matchId);
        // if (match && playerId != null) {
        //   const player = match.players.find(
        //     (player) => player.id === parseInt(playerId, 10)
        //   );

        //   if (player) {
        //     // navigate(`/games/${matchId}/${playerId}`);
        //     console.log(`navigating to /games/${matchId}/${playerId}`);
        //   } else {
        //     localStorage.removeItem("matchId");
        //     localStorage.removeItem("playerId");
        //     localStorage.removeItem("clientCredentials");
        //   }
        // } else {
        //   localStorage.removeItem("matchId");
        //   localStorage.removeItem("playerId");
        //   localStorage.removeItem("clientCredentials");
        // }

        setGames(games?.matches ?? []);
      } else {
        setGames([]);
        setErrors((errors) => [...errors, "Error fetching games"]);
      }
    } catch (e) {
      console.error(e);
      setErrors((errors) => [
        ...errors,
        (e as { details: string })?.details ?? "Error fetching games",
      ]);
    }
  }, [lobbyClient]);

  const createGame = async () => {
    try {
      const match = await lobbyClient.createMatch(GAME_NAME, {
        numPlayers: MAX_NUMBER_OF_PLAYERS,
      });

      if (match) {
        joinGame(match.matchID);
        setGames((games) => [...games, match as unknown as LobbyAPI.Match]);
      }
    } catch (e) {
      console.error(e);
      setErrors((errors) => [
        ...errors,
        (e as { details: string })?.details ?? "Error creating game",
      ]);
    }
  };

  const joinGame = async (matchId: string) => {
    if (!playerName) {
      return;
    }

    try {
      const resp = await lobbyClient.joinMatch(GAME_NAME, matchId, {
        playerName,
      });

      if (resp) {
        localStorage.setItem("matchId", matchId);
        localStorage.setItem("clientCredentials", resp.playerCredentials);
        localStorage.setItem("playerId", resp.playerID);
        // navigate(`/games/${matchId}/${resp.playerID}`);
        console.log(`Navigate: /games/${matchId}/${resp.playerID}`);
      } else {
        setErrors((errors) => [...errors, "Error joining game"]);
      }
    } catch (e) {
      console.error(e);
      setErrors((errors) => [
        ...errors,
        (e as { details: string })?.details ?? "Error joining game",
      ]);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [setGames, fetchMatches]);

  useInterval(fetchMatches, 5000);

  return (
    <div>
      <h1>Match List</h1>
      {errors.map((error, i) => (
        <p key={i}>{error}</p>
      ))}
      {games?.map((game, i) => {
        const joinedPlayers =
          game.players?.filter((player) => player.name) ?? [];
        return (
          <div key={game.matchID}>
            <div>
              <Link to={`/games/${game.matchID}/0`}>
                Game {i} {game.matchID}
              </Link>
            </div>
            <div>
              Players:{" "}
              {joinedPlayers.map((player) => player.name).join(", ") ||
                "No players yet"}
            </div>
            {joinedPlayers.length !== MAX_NUMBER_OF_PLAYERS &&
              !joinedPlayers.some((player) => player.name === playerName) && (
                <button onClick={() => joinGame(game.matchID)}>Join</button>
              )}
          </div>
        );
      })}
      {games?.length === 0 && <div>No games exist</div>}

      <div>
        <button onClick={createGame}>Create Game</button>
      </div>
    </div>
  );
};

export default MatchList;
