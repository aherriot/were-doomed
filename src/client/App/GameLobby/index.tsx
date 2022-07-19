import { useRef, useState } from "react";
import { LobbyClient } from "boardgame.io/client";
import ChooseName from "./ChooseName";
import JoinExistingGame from "./JoinExistingGame";
import MatchList from "./MatchList";

const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;

const GameLobby = () => {
  const lobbyClient = useRef<LobbyClient>();
  if (!lobbyClient.current) {
    lobbyClient.current = new LobbyClient({ server });
  }

  const playerId = localStorage.getItem("playerId");
  const matchId: null | string = localStorage.getItem("matchId");
  const clientCredentials: null | string =
    localStorage.getItem("clientCredentials");

  const [playerName, setPlayerName] = useState<string | null>(
    localStorage.getItem("playerName")
  );
  const [isEditingName, setIsEditingName] = useState(!playerName);

  if (!playerName || isEditingName) {
    return (
      <div>
        <h1>We're Doomed!</h1>
        <ChooseName
          name={playerName}
          setName={setPlayerName}
          setIsEditingName={setIsEditingName}
        />
      </div>
    );
  } else if (playerName && playerId && clientCredentials && matchId) {
    return (
      <JoinExistingGame
        matchId={matchId}
        playerId={playerId}
        lobbyClient={lobbyClient.current}
      />
    );
  } else if (!matchId || !clientCredentials || !playerId) {
    localStorage.removeItem("matchId");
    localStorage.removeItem("clientCredentials");
    localStorage.removeItem("playerId");
    return (
      <div>
        <h1>We're Doomed!</h1>
        <div>
          Your player name is: <strong>{playerName}</strong>{" "}
          <button onClick={() => setIsEditingName(true)}>Edit Name</button>
        </div>
        <MatchList playerName={playerName} lobbyClient={lobbyClient.current} />
      </div>
    );
  }

  return <div>Not sure how we got here.</div>;
};

export default GameLobby;
