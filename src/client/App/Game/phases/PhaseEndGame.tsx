import { ReactElement } from "react";
import { getPlayersToVoteOn, getVotesPerPlayer } from "src/shared/utils";
import { CommonProps } from "../types";

const PhaseEndGame = ({
  G,
  playerID,
  moves,
  playerInfoById,
}: CommonProps): ReactElement => {
  const { winners, seatsRemaining, candidates } = G.endGame;

  const winnerNames = winners
    .map((playerId) => playerInfoById[playerId]?.name)
    .join(", ");
  const candidateNames = candidates
    .map((playerId) => playerInfoById[playerId]?.name)
    .join(", ");

  const votesPerPlayer = getVotesPerPlayer(
    winners,
    candidates,
    G.endGame.votes
  );

  return (
    <div>
      <div className="text-2xl font-semibold text-center mb-4">Vote</div>
      {winners.length > 0 && (
        <div>{winnerNames} have secured seats based on their influence.</div>
      )}
      {candidates.length > 0 && (
        <div>
          <div>
            <span className="font-semibold">{candidateNames}</span> have tied
            for influence and we must vote on who gets on the space ship. There
            {seatsRemaining === 1
              ? ` is ${seatsRemaining} seat available, so each winner and candidate gets to vote once.`
              : ` are ${seatsRemaining} seats available, so each winner and candidate gets to vote ${seatsRemaining} times`}
          </div>
          <div className="mt-3">
            You may continue to vote until an agreement is reached. Otherwise,
            no candidates will get on the space ship.
          </div>
        </div>
      )}
      {playerID &&
        (winners.includes(playerID) || candidates.includes(playerID)) && (
          <div className="text-center">
            {candidates.map((playerId) => (
              <button
                className="bg-slate-200 rounded hover:bg-yellow-500 px-2 py-1 mx-1"
                key={playerId}
                onClick={() => {
                  moves.vote(playerId);
                }}
              >
                {playerInfoById[playerId]?.name} (Votes:{" "}
                {votesPerPlayer[playerId] ?? 0})
              </button>
            ))}
          </div>
        )}
    </div>
  );
};

export default PhaseEndGame;
