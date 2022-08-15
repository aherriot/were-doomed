import { ReactElement, useState } from "react";
import { Government } from "src/shared/types";
import Button from "../../components/Button";
import BroadcastIcon from "../../components/icons/BroadcastIcon";
import BullhornIcon from "../../components/icons/BullhornIcon";
import GunIcon from "../../components/icons/GunIcon";
import WrenchIcon from "../../components/icons/WrenchIcon";
import SkullIcon from "../../components/icons/SkullIcon";
import NameList from "../../components/NameList";
import { CommonProps } from "../types";
import ActionButton from "./ActionButton";

const PhasePreGame = ({
  G,
  ctx,
  playerInfoById,
  playerID,
  moves,
}: CommonProps): ReactElement => {
  const [gameLength, setGameLength] = useState<number>(15);

  const waitingForPlayers = [];
  for (let id in playerInfoById) {
    const playerInfo = playerInfoById[id];
    if (playerInfo.name && !G.playerData[id].government) {
      waitingForPlayers.push(playerInfo.name);
    }
  }

  const governmentMap: Record<Government, number> = {
    democracy: 0,
    corporatocracy: 0,
    theocracy: 0,
    autocracy: 0,
    technocracy: 0,
  };

  let total = 0;
  for (let playerId in G.playerData) {
    const playerData = G.playerData[playerId];
    if (playerData.government) {
      governmentMap[playerData.government] =
        (governmentMap[playerData.government] ?? 0) + 1;
      total++;
    }
  }

  const selectedGovernment = playerID
    ? G.playerData[playerID].government
    : null;

  return (
    <div className="mt-10 text-center">
      <div className="max-w-lg mx-auto text-left mb-4">
        The end of the world is upon us. As a world leader, you must help build
        a space ship to escape the planet. The more you contribute to the
        project the more seats are available to world leaders. However, world
        leaders will board the ship in order of most influence.
      </div>
      {waitingForPlayers.length > 0 ? (
        <div>
          Waiting for the following players to choose their government type:{" "}
          <NameList>{waitingForPlayers}</NameList>
        </div>
      ) : (
        <div>
          Waiting for{" "}
          <span className="font-semibold">{playerInfoById["0"].name}</span> to
          start the game
        </div>
      )}
      {playerID === "0" && (
        <div className="mt-6">
          <div>
            <span className="font-semibold"> Game Length</span>
            <select
              value={gameLength}
              onChange={(e) => setGameLength(parseFloat(e.target.value))}
              className="ml-4 text-md bg-slate-200 px-2 pr-4 py-2 rounded focus:outline-none focus:bg-slate-400 cursor-pointer"
            >
              <option value={0.3}>1 minute</option>
              <option value={4}>4 minutes</option>
              <option value={6}>6 minutes</option>
              <option value={8}>8 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={12}>12 minutes</option>
              <option value={15}>15 minutes</option>
            </select>
          </div>
          {waitingForPlayers.length === 0 && (
            <Button
              className="mt-6"
              onClick={() => moves.startGame(gameLength)}
            >
              Start Game
            </Button>
          )}
        </div>
      )}

      {playerID && (
        <div className="flex flex-col mx-auto max-w-xl">
          <ActionButton
            onClick={() => moves.chooseGovernment("technocracy")}
            title="Technocracy"
            icon={<WrenchIcon className="w6 h-6" />}
            description="Produce 3 resources instead of 2"
            className={"bg-purple-200/50 hover:bg-purple-200"}
            selected={
              selectedGovernment ? selectedGovernment === "technocracy" : false
            }
            disabled={governmentMap.technocracy > 0 && total < 5}
          />
          <ActionButton
            onClick={() => moves.chooseGovernment("theocracy")}
            title="Theocracy"
            icon={<BroadcastIcon />}
            description="Indoctrinate to gain 2 influence instead of 1"
            className={"bg-blue-200/50 hover:bg-blue-200"}
            selected={
              selectedGovernment ? selectedGovernment === "theocracy" : false
            }
            disabled={governmentMap.theocracy > 0 && total < 5}
          />
          <ActionButton
            onClick={() => moves.chooseGovernment("corporatocracy")}
            title="Corporatocracy"
            icon={<BullhornIcon />}
            description="Propagandize to steal 1 influence for free"
            className={"bg-green-200/50 hover:bg-green-200"}
            selected={
              selectedGovernment
                ? selectedGovernment === "corporatocracy"
                : false
            }
            disabled={governmentMap.corporatocracy > 0 && total < 5}
          />
          <ActionButton
            onClick={() => moves.chooseGovernment("democracy")}
            title="Democracy"
            icon={<GunIcon />}
            description="Invade to steal 2 resources for free"
            className={"bg-yellow-200/50 hover:bg-yellow-200"}
            selected={
              selectedGovernment ? selectedGovernment === "democracy" : false
            }
            disabled={governmentMap.democracy > 0 && total < 5}
          />
          <ActionButton
            onClick={() => moves.chooseGovernment("autocracy")}
            title="Autocracy"
            icon={<SkullIcon className="w6 h-6" />}
            description="Nukes cost 5 resources instead of 8"
            className={"bg-red-200/50 hover:bg-red-200"}
            selected={
              selectedGovernment ? selectedGovernment === "autocracy" : false
            }
            disabled={governmentMap.autocracy > 0 && total < 5}
          />
        </div>
      )}
    </div>
  );
};

export default PhasePreGame;
