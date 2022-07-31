import React from "react";
import CountdownTimer from "./CountdownTimer";
import { LobbyClient } from "boardgame.io/client";
import { useNavigate } from "react-router-dom";
import { GAME_NAME } from "../../../../shared/utils";
import Button from "../../components/Button";

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
    <div className="bg-slate-200">
      <div className="flex justify-between items-center m-auto py-5 px-5  max-w-5xl">
        <h1 className="uppercase tracking-wider font-bold text-xl">
          We're&nbsp;&nbsp;Doomed!
        </h1>
        {endTime && <CountdownTimer endTime={endTime} />}
        {playerID != null && credentials && (
          <Button onClick={onLeave}>Leave Game</Button>
        )}
      </div>
      <div className="bg-caution w-full h-3" />
    </div>
  );
};

export default Header;
