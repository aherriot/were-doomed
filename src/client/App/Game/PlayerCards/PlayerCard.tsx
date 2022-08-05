import { FilteredMetadata } from "boardgame.io";
import clsx from "clsx";
import { PlayerData } from "src/shared/types";
import CrownIcon from "../../components/icons/CrownIcon";
import SkullIcon from "../../components/icons/SkullIcon";

type PlayerCardProps = {
  playerId: string;
  playerData: PlayerData;
  playerInfo: FilteredMetadata[number];
  phase: string;
  isSelf: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  isLeader?: boolean;
  onClick?: () => void;
};

const PlayerCard = ({
  playerData,
  playerId,
  playerInfo,
  phase,
  isSelf = false,
  isActive = false,
  isSelected = false,
  isLeader = false,
  onClick,
}: PlayerCardProps) => {
  const isTargetable = !isSelf && playerData.isAlive;
  const showIsDead = !playerData.isAlive && phase !== "pregame";
  const showIsActive =
    (isActive && playerData.isAlive) ||
    (phase === "pregame" && playerData.isAlive);
  return (
    <button
      className={clsx("bg-slate-200 p-1 rounded relative border-4 text-left", {
        "bg-red-200 text-black/60": showIsDead,
        "cursor-pointer": isTargetable,
        "bg-green-200": showIsActive,
        "border-blue-300": isSelected,
        "border-transparent": !isSelected,
      })}
      disabled={!isTargetable}
      onClick={onClick}
    >
      <div title={playerId} className="font-semibold">
        {playerInfo?.name}

        {isSelf && (
          <span className="text-gray-500/75 font-normal text-sm"> (you)</span>
        )}
      </div>
      <div className="text-sm capitalize -mx-2 px-2 py-1  border-b-2 border-slate-300/50 flex justify-between items-center">
        <span>{playerData.government ?? "\u00a0"}</span>
        {isLeader && (
          <CrownIcon
            className="fill-yellow-500 w-4 h-4"
            title="The leader goes first in the action phase."
          />
        )}
      </div>
      <div className="text-sm">Resources: {playerData.resources}</div>
      <div className="text-sm">Influence: {playerData.influence}</div>
      {showIsDead && (
        <div className="absolute top-0 left-0 right-0 bottom-0 grid items-center justify-center">
          <SkullIcon className="w-12 h-12 fill-black/50" />
        </div>
      )}
      {!playerInfo?.isConnected && !showIsDead && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-300 text-black/70 text-center -m-1 text-sm">
          Disconnected
        </div>
      )}
    </button>
  );
};

export default PlayerCard;
