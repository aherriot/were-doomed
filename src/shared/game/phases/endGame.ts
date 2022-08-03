import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { getPlayersToVoteOn, getVotesPerPlayer } from "../../../shared/utils";
import { GameState } from "../../types";

const endGame: PhaseConfig<GameState, Ctx> = {
  onBegin: (G, ctx) => {
    const { winners, candidates, seatsRemaining } = getPlayersToVoteOn(G);
    G.endGame.winners = winners;
    G.endGame.candidates = candidates;
    G.endGame.seatsRemaining = seatsRemaining;
  },
  onEnd: (G, ctx) => {
    // TODO: set the winners
  },
  endIf: (G, ctx) => {
    const { winners, candidates, seatsRemaining } = G.endGame;

    const requiredVotes = (winners.length + candidates.length) * seatsRemaining;

    if (candidates.length === 0 || seatsRemaining === 0) {
      return true;
    }

    const votesPerPlayer = getVotesPerPlayer(
      winners,
      candidates,
      G.endGame.votes
    );

    let totalVotes = 0;
    const votes: { id: string; votes: number }[] = [];
    for (let id in votesPerPlayer) {
      votes.push({ id, votes: votesPerPlayer[id] });
      totalVotes += votesPerPlayer[id];
    }

    votes.sort((a, b) => b.votes - a.votes);

    // We have found the winning candidates if the candidate "on the bubble"
    // has more votes than the next candidate
    if (
      requiredVotes === totalVotes &&
      votes[seatsRemaining - 1]?.votes > (votes[seatsRemaining]?.votes ?? 0)
    ) {
      votes.forEach((vote, i) => {
        if (i < seatsRemaining) {
          G.endGame.winners.push(vote.id);
        }
      });
      return true;
    }

    // otherwise, we need more votes or we need people to change their votes
    return false;
  },
  turn: {
    onBegin: (G, ctx) => {
      ctx.events?.setActivePlayers({ all: "voteSeat" });
    },
    stages: {
      voteSeat: {
        moves: {
          vote: (G, ctx, candidateId: string) => {
            if (!ctx.playerID) {
              return INVALID_MOVE;
            }

            if (!G.playerData[ctx.playerID].isAlive) {
              return INVALID_MOVE;
            }

            const { winners, candidates, seatsRemaining } =
              getPlayersToVoteOn(G);

            if (
              !winners.includes(ctx.playerID) &&
              !candidates.includes(ctx.playerID)
            ) {
              return INVALID_MOVE;
            }

            if (candidates.includes(candidateId)) {
              if (G.endGame.votes[ctx.playerID]) {
                G.endGame.votes[ctx.playerID].push(candidateId);

                if (G.endGame.votes[ctx.playerID].length > seatsRemaining) {
                  G.endGame.votes[ctx.playerID].shift();
                }
              } else {
                G.endGame.votes[ctx.playerID] = [candidateId];
              }
            }
          },
        },
      },
    },
  },
  next: "results",
};

export default endGame;
