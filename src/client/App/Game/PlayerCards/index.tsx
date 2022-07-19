import React, { ReactElement } from "react";
import { CommonProps } from "../types";
import PlayerCard from "./PlayerCard";

type PlayerCardsProps = Omit<CommonProps, "moves">;

const PlayerCards = ({
  G,
  ctx,
  playerInfoById,
}: PlayerCardsProps): ReactElement => {
  const playerCards = [];
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
        />
      );
    }
  }
  return <div className="PlayerCards">{playerCards}</div>;
};
export default PlayerCards;
