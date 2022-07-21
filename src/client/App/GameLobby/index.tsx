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
      <div>
        <div>
          Your player name is: <strong>{playerName}</strong>{" "}
          <button onClick={() => setIsEditingName(true)}>Edit Name</button>
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
      <h1>We're Doomed!!</h1>
      {content}
    </QueryClientProvider>
  );
};

export default GameLobby;
