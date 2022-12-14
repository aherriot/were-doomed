import React, { useMemo, useState } from "react";
import { BoardProps } from "boardgame.io/react";
import { FilteredMetadata } from "boardgame.io";
import { GameState } from "../../../shared/types";
import PlayerCards from "./PlayerCards";

import {
  PhasePreGame,
  PhaseAction,
  PhaseContribute,
  PhaseVoteLeader,
  PhaseEvent,
  PhaseEndGame,
  PhaseResults,
} from "./phases";
import Header from "./Header";

import { CommonProps } from "./types";
import WindowSizeWarning from "../components/WindowSizeWarning";

const phaseMap: Record<string, React.ComponentType<CommonProps>> = {
  pregame: PhasePreGame,
  takeAction: PhaseAction,
  contribute: PhaseContribute,
  voteLeader: PhaseVoteLeader,
  event: PhaseEvent,
  endGame: PhaseEndGame,
  results: PhaseResults,
};

const Board = ({
  G,
  ctx,
  moves,
  matchData,
  matchID,
  playerID,
  credentials,
}: BoardProps<GameState>) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const playerInfoById = useMemo(() => {
    const result: Record<string, FilteredMetadata[number]> = {};
    matchData?.forEach((data: FilteredMetadata[number]) => {
      // only players with a name have actually joined the game
      if (data.name) {
        result[data.id] = data;
      }
    });
    return result;
  }, [matchData]);

  const PhaseComponent = phaseMap[ctx.phase];

  return (
    <div className="">
      <Header
        endTime={G.endGame.time}
        matchID={matchID}
        playerID={playerID}
        credentials={credentials}
      />
      <WindowSizeWarning />

      <div className="flex max-w-5xl mx-auto">
        <PlayerCards
          G={G}
          ctx={ctx}
          playerID={playerID}
          playerInfoById={playerInfoById}
          selectedTarget={selectedTarget}
          setSelectedTarget={setSelectedTarget}
        />

        <div className="my-2 grow">
          <PhaseComponent
            G={G}
            ctx={ctx}
            playerID={playerID}
            moves={moves}
            playerInfoById={playerInfoById}
            selectedTarget={selectedTarget}
            setSelectedTarget={setSelectedTarget}
          />
        </div>
      </div>
    </div>
  );
};

export default Board;
