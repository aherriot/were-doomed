import { ReactElement } from "react";
import { getVotesPerPlayer } from "src/shared/utils";
import NameList from "../../components/NameList";
import { CommonProps } from "../types";

const PhaseEndGame = ({
  G,
  playerID,
  moves,
  playerInfoById,
}: CommonProps): ReactElement => {
  const { winners, seatsRemaining, candidates } = G.endGame;

  const winnerNames = winners.map(
    (playerId) => playerInfoById[playerId]?.name ?? ""
  );
  const candidateNames = candidates.map(
    (playerId) => playerInfoById[playerId]?.name ?? ""
  );

  const voterNames = [...winnerNames, ...candidateNames];

  const votesPerPlayer = getVotesPerPlayer(
    winners,
    candidates,
    G.endGame.votes
  );

  return (
    <div>
      <div className="text-2xl font-semibold text-center mb-4">End Vote</div>
      {winners.length > 0 && (
        <div>
          <NameList>{winnerNames}</NameList> have secured seats based on their
          influence.
        </div>
      )}
      {winners.length === 0 && (
        <div>Currently no one has secured a seat on the space ship.</div>
      )}
      {candidates.length > 0 && (
        <div className="mt-3">
          <div>
            <NameList>{candidateNames}</NameList> have tied for influence and we
            must vote on who gets on the space ship. There{" "}
            {seatsRemaining === 1 ? (
              <span>
                is {seatsRemaining} seat available, so{" "}
                <NameList>{voterNames}</NameList> get to vote once.
              </span>
            ) : (
              <span>
                are {seatsRemaining} seats available, so{" "}
                <NameList>{voterNames}</NameList> get to vote {seatsRemaining}{" "}
                times.
              </span>
            )}
          </div>
          <div className="mt-3">
            You may continue to vote until an agreement is reached. Otherwise,
            no candidates will get on the space ship.
          </div>
        </div>
      )}
      {playerID &&
        (winners.includes(playerID) || candidates.includes(playerID)) && (
          <div className="mt-4 text-center">
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
