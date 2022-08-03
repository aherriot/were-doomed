import { ReactElement } from "react";
import clsx from "clsx";
import Button from "../../components/Button";
import WrenchIcon from "../../components/icons/WrenchIcon";
import { CommonProps } from "../types";
import { getNextSeat, getNumberOfSeats } from "src/shared/utils";

const PhaseContribute = ({
  moves,
  G,
  ctx,
  playerID,
  playerInfoById,
}: CommonProps): ReactElement => {
  const isActive =
    playerID && ctx.activePlayers?.[playerID] && G.playerData[playerID].isAlive;
  const canContribute = isActive && G.playerData[playerID].resources > 0;

  const rankedContributors: { id: string; name: string; amount: number }[] = [];
  for (let id in G.playerData) {
    const playerData = G.playerData[id];
    if (playerData.isAlive) {
      rankedContributors.push({
        id,
        name: playerInfoById[id].name ?? "Unknown",
        amount: playerData.contributions,
      });
    }
  }
  rankedContributors.sort((a, b) => b.amount - a.amount);
  let previousAmount = Number.MAX_SAFE_INTEGER;
  let place = 0;
  let totalThisRound = 0;
  const ranking = rankedContributors.map((contributor) => {
    totalThisRound += contributor.amount;
    if (contributor.amount < previousAmount) {
      place++;
      previousAmount = contributor.amount;
    }
    return (
      <div key={contributor.id} className="bg-slate-100 rounded mb-1 px-2 py-2">
        <span
          className={clsx("inline-block font-semibold text-xl w-8 mr-2", {
            "text-transparent": contributor.amount === 0,
          })}
        >
          #{place}
        </span>
        {contributor.name}: {contributor.amount}
      </div>
    );
  });

  const seatCount = getNumberOfSeats(G.projectResources);
  const nextSeat = getNextSeat(G.projectResources);

  return (
    <div>
      <div className="text-center">
        <div>
          <div className="text-2xl font-semibold my-5">Project Status</div>
          <div className="flex justify-center gap-4">
            <div className="bg-slate-200 rounded p-3 w-32">
              <div className="font-bold text-4xl">{G.projectResources}</div>
              {G.projectResources === 1 ? "resource" : "resources"}
            </div>
            <div className="bg-slate-200 rounded p-3 w-32">
              <div className="font-bold text-4xl">{seatCount}</div>
              {seatCount === 1 ? "seat" : "seats"}
            </div>
          </div>
        </div>
        <div className="text-sm mt-2">
          {nextSeat === -1
            ? "10 is the maximum number of seats"
            : `The next seat will be added at ${nextSeat} resources`}
        </div>
      </div>
      <div className="text-center mt-10">
        Total contributions this round: {totalThisRound}
      </div>
      {ranking}

      {isActive && (
        <div className="mt-4 flex justify-center">
          <Button isPrimary={false} onClick={() => moves.skip()}>
            Pass
          </Button>
          {canContribute && (
            <Button
              className="flex items-center ml-3"
              onClick={() => moves.contribute()}
            >
              <WrenchIcon className="fill-white mr-2 w-4 h-4" /> Contribute
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhaseContribute;
