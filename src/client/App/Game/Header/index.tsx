import React from "react";
import CountdownTimer from "./CountdownTimer";
import { LobbyClient } from "boardgame.io/client";
import { useNavigate } from "react-router-dom";
import { GAME_NAME } from "../../../../shared/utils";

const { protocol, hostname, port } = window.location;
const SERVER = `${protocol}//${hostname}:${port}`;

const lobbyClient = new LobbyClient({ server: SERVER });

type HeaderProps = {
  endTime: number | null;
  matchID: string;
  playerID: string | null;
  credentials?: string;
};

const Header = ({ endTime, matchID, playerID, credentials }: HeaderProps) => {
  const navigate = useNavigate();

  const onLeave = () => {
    if (playerID != null && credentials) {
      lobbyClient.leaveMatch(GAME_NAME, matchID, {
        playerID,
        credentials,
      });
    }
    localStorage.removeItem("matchId");
    localStorage.removeItem("playerId");
    localStorage.removeItem("clientCredentials");
    navigate("/lobby");
  };

  return (
    <div className="Header">
      <h1 className="Title">We're Doomed</h1>
      {playerID != null && credentials && (
        <button onClick={onLeave}>Leave Game</button>
      )}
      {endTime && <CountdownTimer endTime={endTime} />}
    </div>
  );
};

export default Header;
