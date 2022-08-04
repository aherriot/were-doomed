import { ReactElement, useState } from "react";
import clsx from "clsx";
import { FilteredMetadata } from "boardgame.io";
import { GameState } from "src/shared/types";
import Button from "../../components/Button";
import BroadcastIcon from "../../components/icons/BroadcastIcon";
import BullhornIcon from "../../components/icons/BullhornIcon";
import GunIcon from "../../components/icons/GunIcon";
import SkullIcon from "../../components/icons/SkullIcon";
import WrenchIcon from "../../components/icons/WrenchIcon";
import { CommonProps } from "../types";

type ActionButtonProps = {
  className: string;
  icon: ReactElement;
  title: string;
  description: string;
  disabled: boolean;
  onClick: () => void;
};

const ActionButton = ({
  className,
  onClick,
  icon,
  title,
  description,
  disabled = true,
}: ActionButtonProps) => {
  return (
    <button
      className={clsx(`w-full items-center flex py-2 my-1`, {
        "bg-slate-200": disabled,
        [className]: !disabled,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="mx-3">{icon}</div>
      <div className="text-left">
        <div className="font-semibold">{title}</div>
        <div className="">{description}</div>
      </div>
    </button>
  );
};

const ActionHistory = ({
  G,
  playerInfoById,
}: {
  G: GameState;
  playerInfoById: Record<string, FilteredMetadata[number]>;
}) => {
  const history = G.actionHistory.map((action) => {
    let content: React.ReactNode = "";
    switch (action.action) {
      case "produce":
        content = (
          <span>
            <span className="font-semibold">
              {playerInfoById[action.playerId]?.name}
            </span>{" "}
            produced 2 resources
          </span>
        );
        break;
      case "indoctrinate":
        content = (
          <span>
            <span className="font-semibold">
              {playerInfoById[action.playerId]?.name}
            </span>{" "}
            indoctrinated and gains 1 influence
          </span>
        );
        break;
      case "propagandize":
        content = (
          <span>
            <span className="font-semibold">
              {playerInfoById[action.playerId]?.name}
            </span>{" "}
            propagandized by stealing 1 influence from{" "}
            <span className="font-semibold">
              {playerInfoById[action.targetId].name}
            </span>
          </span>
        );
        break;
      case "invade":
        content = (
          <span>
            <span className="font-semibold">
              {playerInfoById[action.playerId]?.name}
            </span>{" "}
            invaded{" "}
            <span className="font-semibold">
              {playerInfoById[action.targetId].name}
            </span>{" "}
            and stole 2 resources.
          </span>
        );
        break;
      case "nuke":
        content = (
          <span>
            <span className="font-semibold">
              {playerInfoById[action.playerId]?.name}
            </span>{" "}
            nuked{" "}
            <span className="font-semibold">
              {playerInfoById[action.targetId].name}
            </span>
          </span>
        );
        break;

      default:
        console.error("unkown action type");
    }

    return <div key={action.playerId}>{content}</div>;
  });

  return <div className="mt-1 w-80 text-sm">{history}</div>;
};

const PhaseAction = ({
  G,
  ctx,
  moves,
  playerID,
  playerInfoById,
  selectedTarget,
  setSelectedTarget,
}: CommonProps): ReactElement => {
  const [confirmNuke, setConfirmNuke] = useState<boolean>(false);
  const isCurrentPlayerTurn = ctx.currentPlayer === playerID;

  if (confirmNuke && selectedTarget != null) {
    return (
      <div className="text-center">
        <p>
          Are you sure you want to nuke{" "}
          <span className="font-semibold">
            {playerInfoById[selectedTarget].name}
          </span>
          ?
        </p>
        <Button isPrimary={false} onClick={() => setConfirmNuke(false)}>
          Cancel
        </Button>
        <Button
          className="ml-2"
          onClick={() => {
            moves.nuke(selectedTarget);
            setSelectedTarget(null);
          }}
        >
          Confirm
        </Button>
      </div>
    );
  }

  const turnIndicator = (
    <div
      className={clsx("py-1 px-4 text-center rounded mb-1", {
        "bg-green-200": isCurrentPlayerTurn,
        "bg-slate-200/50": !isCurrentPlayerTurn,
      })}
    >
      It is{" "}
      <span className="font-semibold">
        {isCurrentPlayerTurn
          ? "your"
          : `${playerInfoById[ctx.currentPlayer]?.name}'s`}
      </span>{" "}
      turn.
    </div>
  );

  return (
    <div className="mr-2">
      {turnIndicator}
      <div className="w-full flex">
        <ActionHistory G={G} playerInfoById={playerInfoById} />
        <div className="grow">
          <div className="">
            <ActionButton
              title="Produce"
              description="Gain 2 resources"
              className="bg-purple-200/50 hover:bg-purple-200"
              icon={<WrenchIcon />}
              onClick={() => moves.produce()}
              disabled={!isCurrentPlayerTurn && G.bank.resources >= 2}
            />
            <ActionButton
              title="Indoctrinate"
              description="Gain 1 influence"
              className="bg-blue-200/50 hover:bg-blue-200"
              icon={<BroadcastIcon />}
              onClick={() => moves.indoctrinate()}
              disabled={!isCurrentPlayerTurn && G.bank.influence >= 1}
            />
            {!selectedTarget &&
              isCurrentPlayerTurn &&
              (G.playerData[playerID].contributions > 0 ||
                G.playerData[playerID].influence > 0) && (
                <div className="text-red-500 mt-4 text-center text-sm">
                  Select a player on the left to enable the following actions:
                </div>
              )}
            <ActionButton
              title="Propagandize"
              description="Steal 1 influence from another player by spending 1 resource"
              className="bg-green-200/50 hover:bg-green-200"
              icon={<BullhornIcon />}
              onClick={() => {
                moves.propagandize(selectedTarget);
                setSelectedTarget(null);
              }}
              disabled={
                !isCurrentPlayerTurn ||
                selectedTarget == null ||
                G.playerData[playerID].resources < 1 ||
                G.playerData[selectedTarget].influence < 1
              }
            />
            <ActionButton
              title="Invade"
              description="Steal 2 resources from another player by spending 1 influence"
              className="bg-yellow-200/50 hover:bg-yellow-200"
              icon={<GunIcon />}
              onClick={() => {
                moves.invade(selectedTarget);
                setSelectedTarget(null);
              }}
              disabled={
                !isCurrentPlayerTurn ||
                selectedTarget == null ||
                G.playerData[playerID].influence < 1 ||
                G.playerData[selectedTarget].resources < 2
              }
            />
            <ActionButton
              title="Nuke"
              description="Spend 8 resources to eliminate a player from the game permanently"
              className="bg-red-200/50 hover:bg-red-200"
              icon={<SkullIcon />}
              onClick={() => setConfirmNuke(true)}
              disabled={
                !isCurrentPlayerTurn ||
                selectedTarget == null ||
                G.playerData[playerID].resources < 8
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseAction;
