import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { GAME_NAME, MAX_NUMBER_OF_PLAYERS } from "../../../shared/utils";

type MatchListProps = {
  lobbyClient: LobbyClient;
  playerName: string;
  setMatchId: (matchId: string) => void;
  setClientCredentials: (credentials: string) => void;
  setPlayerId: (playerId: string) => void;
};

const MatchList = ({
  playerName,
  lobbyClient,
  setMatchId,
  setClientCredentials,
  setPlayerId,
}: MatchListProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<LobbyAPI.MatchList>(
    ["matches"],
    () =>
      lobbyClient.listMatches(GAME_NAME, {
        isGameover: false,
      }),
    {
      refetchInterval: 5000,
      onSuccess: (data) => {
        data.matches.forEach((match) => {});
      },
    }
  );

  const { mutate: joinMatch } = useMutation<
    LobbyAPI.JoinedMatch,
    unknown,
    { matchId: string }
  >(
    ({ matchId }) =>
      lobbyClient.joinMatch(GAME_NAME, matchId, {
        playerName,
      }),
    {
      onSuccess: ({ playerID, playerCredentials }, { matchId }) => {
        queryClient.invalidateQueries(["matches"]);
        setMatchId(matchId);
        setClientCredentials(playerCredentials);
        setPlayerId(playerID);
        navigate(`/play/${matchId}/${playerID}`);
      },
    }
  );

  const { mutate: createMatch } = useMutation(
    () =>
      lobbyClient.createMatch(GAME_NAME, {
        numPlayers: MAX_NUMBER_OF_PLAYERS,
      }),
    {
      onSuccess: ({ matchID }) => {
        queryClient.invalidateQueries(["matches"]);
        joinMatch({ matchId: matchID });
      },
    }
  );

  // const match = games?.matches.find((match) => match.matchID === matchId);
  // if (match && playerId != null) {
  //   const player = match.players.find(
  //     (player) => player.id === parseInt(playerId, 10)
  //   );

  //   if (player) {
  //     // navigate(`/play/${matchId}/${playerId}`);
  //     console.log(`navigating to /play/${matchId}/${playerId}`);
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

  //   if (!playerName) {
  //     return;
  //   }
  //   const resp = await lobbyClient.joinMatch(GAME_NAME, matchId, {
  //     playerName,
  //   });
  //   if (resp) {
  //     localStorage.setItem("matchId", matchId);
  //     localStorage.setItem("clientCredentials", resp.playerCredentials);
  //     localStorage.setItem("playerId", resp.playerID);
  //     // navigate(`/play/${matchId}/${resp.playerID}`);
  //     console.log(`Navigate: /play/${matchId}/${resp.playerID}`);
  //   }

  if (isLoading) {
    return <div>Loading games...</div>;
  }

  if (isError) {
    return <div>Error loading matches</div>;
  }

  return (
    <div className="border-slate-500 border border-3 p-5">
      {data?.matches.map((game, i) => {
        const joinedPlayers =
          game.players?.filter((player) => player.name) ?? [];
        const isFull = joinedPlayers.length === MAX_NUMBER_OF_PLAYERS;
        const joinedPlayerIsCurrentPlayer = joinedPlayers.some(
          (player) => player.name === playerName
        );

        return (
          <div key={game.matchID} className="mb-5">
            <div className="">
              <span className="font-semibold">Game #{i + 1}</span>
              {!isFull && !joinedPlayerIsCurrentPlayer && (
                <>
                  <span className="mx-2">&rarr;</span>
                  <button
                    className="inline text-yellow-500 focus:underline hover:underline hover:text-yellow-600 focus:text-yellow-600 focus:shadow-outline focus:outline-none font-semibold"
                    onClick={() => joinMatch({ matchId: game.matchID })}
                  >
                    join
                  </button>
                </>
              )}
            </div>
            <div className="text-md">
              Players:{" "}
              {joinedPlayers.map((player) => player.name).join(", ") ||
                "No players yet"}
            </div>
          </div>
        );
      })}
      {data?.matches.length === 0 && (
        <div className="font-semibold text-slate-500">No games exist</div>
      )}

      <div className="mt-4">
        <button
          className="ml-1 shadow bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          onClick={() => createMatch()}
        >
          Create Game
        </button>
      </div>
    </div>
  );
};

export default MatchList;
