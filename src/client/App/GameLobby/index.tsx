import { useRef, useState } from "react";
import { LobbyClient } from "boardgame.io/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChooseName from "./ChooseName";
import JoinExistingGame from "./JoinExistingGame";
import MatchList from "./MatchList";
import useLocalStorage from "./useLocalStorage";

const { protocol, hostname, port } = window.location;
const SERVER = `${protocol}//${hostname}:${port}`;

const queryClient = new QueryClient();

const GameLobby = () => {
  const lobbyClient = useRef<LobbyClient>();
  if (!lobbyClient.current) {
    lobbyClient.current = new LobbyClient({ server: SERVER });
  }

  const [playerName, setPlayerName] = useLocalStorage("playerName");
  const [playerId, setPlayerId, clearPlayerId] = useLocalStorage("playerId");
  const [matchId, setMatchId, clearMatchId] = useLocalStorage("matchId");
  const [clientCredentials, setClientCredentials, clearClientCredentials] =
    useLocalStorage("clientCredentials");

  const clearAllExceptPlayerName = () => {
    clearPlayerId();
    clearMatchId();
    clearClientCredentials();
  };

  const [isEditingName, setIsEditingName] = useState(!playerName);

  let content: JSX.Element;

  if (!playerName || isEditingName) {
    content = (
      <ChooseName
        name={playerName}
        setName={setPlayerName}
        setIsEditingName={setIsEditingName}
      />
    );
  } else if (playerName && playerId != null && clientCredentials && matchId) {
    content = (
      <JoinExistingGame
        matchId={matchId}
        playerId={playerId}
        clientCredentials={clientCredentials}
        lobbyClient={lobbyClient.current}
        clearAllExceptPlayerName={clearAllExceptPlayerName}
      />
    );
  } else if (!matchId || !clientCredentials || !playerId) {
    content = (
      <div className="text-center mx-auto">
        <div>
          Welcome: <strong>{playerName}</strong>{" "}
          <button
            className="text-sm inline text-yellow-500 focus:underline hover:underline hover:text-yellow-600 focus:text-yellow-600 focus:shadow-outline focus:outline-none font-semibold"
            onClick={() => setIsEditingName(true)}
          >
            Edit Name
          </button>
        </div>
        <MatchList
          playerName={playerName}
          lobbyClient={lobbyClient.current}
          setPlayerId={setPlayerId}
          setMatchId={setMatchId}
          setClientCredentials={setClientCredentials}
        />
      </div>
    );
  } else {
    content = <div>Not sure how we got here.</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-3xl mx-auto">
        <div className="mt-5 mb-5 mx-auto max-w-md">
          <div className="bg-caution mx-auto h-5"></div>
          <h1 className="text-center text-4xl font-bold my-5 uppercase tracking-widest">
            We're&nbsp;&nbsp;&nbsp;Doomed!
          </h1>
          <div className="bg-caution mx-auto h-5"></div>
        </div>
        {content}
      </div>
    </QueryClientProvider>
  );
};

export default GameLobby;
