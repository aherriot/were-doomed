import { PlayerData } from "../../types";

type PlayerCardProps = {
  playerId: string;
  playerData: PlayerData;
};
const PlayerCard = ({ playerData, playerId }: PlayerCardProps) => {
  return (
    <div className="PlayerCard">
      <div>Name: {playerId}</div>
      <div>Resources: {playerData.resources}</div>
      <div>Influence: {playerData.influence}</div>
    </div>
  );
};

export default PlayerCard;
