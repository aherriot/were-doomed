import { ReactElement } from "react";
import { getTopContributors } from "src/shared/utils";
import { CommonProps } from "../types";

const PhaseVoteLeader = ({
  G,
  moves,
  playerID,
  playerInfoById,
}: CommonProps): ReactElement => {
  const voteCountMap: Record<string, number> = {};

  for (let voteId in G.leaderVotes) {
    const leaderId = G.leaderVotes[voteId];
    if (voteCountMap[leaderId]) {
      voteCountMap[leaderId]++;
    } else {
      voteCountMap[leaderId] = 1;
    }
  }

  return (
    <div>
      <p className="text-center mb-2">
        There was a tie for the most contributions
      </p>
      <p className="max-w-lg text-center mx-auto">
        All livings player must vote and the winner receives 1 influence and
        goes first in the next round. Voting continues until there is a winner.
      </p>
      <div className="flex justify-center mt-5">
        {playerID &&
          G.playerData[playerID].isAlive &&
          getTopContributors(G).map((id) => (
            <button
              className="bg-slate-200 rounded hover:bg-yellow-500 px-2 py-1 mx-1"
              key={id}
              onClick={() => moves.vote(id)}
            >
              {playerInfoById[id].name}: (Votes: {voteCountMap[id] ?? 0})
            </button>
          ))}
      </div>
    </div>
  );
};

export default PhaseVoteLeader;
