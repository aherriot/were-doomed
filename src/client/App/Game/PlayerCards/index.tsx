import React, { ReactElement } from "react";
import { CommonProps } from "../types";
import PlayerCard from "./PlayerCard";

type PlayerCardsProps = Omit<CommonProps, "moves">;

const PlayerCards = ({
  G,
  ctx,
  playerID,
  playerInfoById,
  selectedTarget,
  setSelectedTarget,
}: PlayerCardsProps): ReactElement => {
  const playerCards = [];

  const showActivePlayers =
    ctx.phase === "takeAction" || ctx.phase === "contribute";

  for (let playerId in G.playerData) {
    const playerData = G.playerData[playerId];
    const playerInfo = playerInfoById[playerId];

    if (playerInfo?.name) {
      playerCards.push(
        <PlayerCard
          key={playerId}
          playerId={playerId}
          playerData={playerData}
          playerInfo={playerInfo}
          phase={ctx.phase}
          isSelf={playerId === playerID}
          isActive={
            showActivePlayers &&
            (!!ctx.activePlayers?.[playerId] || ctx.currentPlayer === playerId)
          }
          isLeader={G.leaderId === playerId}
          isSelected={selectedTarget === playerId}
          onClick={() =>
            setSelectedTarget((selectedTarget) =>
              selectedTarget !== playerId ? playerId : null
            )
          }
        />
      );
    }
  }
  return (
    <div className="shrink-0 grid grid-cols-2 auto-rows-max gap-1 m-2 w-72">
      {playerCards}
    </div>
  );
};
export default PlayerCards;
