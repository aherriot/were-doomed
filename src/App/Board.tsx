import React, { useState } from "react";
import { BoardProps } from "boardgame.io/react";
import { GameState } from "../types";
import PlayerCards from "./PlayerCards";

import {
  PhasePreGame,
  PhaseAction,
  PhaseContribute,
  PhaseVoteLeader,
  PhaseEvent,
  PhaseEndGame,
} from "./phases";
import Header from "./Header";

import { CommonProps } from "./types";

const phaseMap: Record<string, React.ComponentType<CommonProps>> = {
  pregame: PhasePreGame,
  action: PhaseAction,
  contribute: PhaseContribute,
  voteLeader: PhaseVoteLeader,
  event: PhaseEvent,
  endgame: PhaseEndGame,
};

const Board = ({ G, ctx, moves }: BoardProps<GameState>) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const PhaseComponent = phaseMap[ctx.phase];

  return (
    <div className="Board">
      <Header endTime={G.endTime} />
      {/* <div>Leader: {G.leaderId}</div> */}
      <PlayerCards
        G={G}
        ctx={ctx}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
      />
      {/* <div>
        Active Players:&nbsp;
        {ctx.activePlayers
          ? Object.entries(ctx.activePlayers).map(([key, value]) => (
              <div key={key}>
                {key} phase: {value}
              </div>
            ))
          : "None"}
      </div> */}
      <div className="Phase">
        <PhaseComponent
          G={G}
          ctx={ctx}
          moves={moves}
          selectedTarget={selectedTarget}
          setSelectedTarget={setSelectedTarget}
        />
      </div>
    </div>
  );
};

export default Board;
