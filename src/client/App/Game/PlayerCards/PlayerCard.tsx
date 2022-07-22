import { FilteredMetadata } from "boardgame.io";
import { PlayerData } from "../../../../types";

type PlayerCardProps = {
  playerId: string;
  playerData: PlayerData;
  playerInfo: FilteredMetadata[number];
};
const PlayerCard = ({ playerData, playerId, playerInfo }: PlayerCardProps) => {
  return (
    <div className="border-2 border-black">
      <div title={playerId}>Name: {playerInfo?.name}</div>
      <div>Resources: {playerData.resources}</div>
      <div>Influence: {playerData.influence}</div>
      <div>Connected?: {playerInfo?.isConnected ? "true" : "false"}</div>
    </div>
  );
};

export default PlayerCard;
