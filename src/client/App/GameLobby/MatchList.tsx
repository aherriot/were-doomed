import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GAME_NAME, MAX_NUMBER_OF_PLAYERS } from "../../../shared/utils";
import Button from "../components/Button";

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
        navigate(`/play/${matchId}`);
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

  if (isLoading) {
    return <div>Loading games...</div>;
  }

  if (isError) {
    return <div>Error loading matches</div>;
  }

  return (
    <div className=" bg-slate-200 rounded p-5">
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
        <div className="text-slate-800">No games exist</div>
      )}

      <div className="mt-4">
        <Button className="" onClick={() => createMatch()}>
          Create Game
        </Button>
      </div>
    </div>
  );
};

export default MatchList;
