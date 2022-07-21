import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameState } from "../../../types";
import { countVotes, getNumberOfAlivePlayers } from "../../utils";

const voteLeader: PhaseConfig<GameState, Ctx> = {
  onBegin: (G, ctx) => {},
  onEnd(G, ctx) {
    const { leader } = countVotes(G);

    if (!leader) {
      throw new Error("election ended with no leader", G.leaderVotes);
    }

    G.leaderId = leader;
    G.playerData[leader].influence++;
  },
  endIf: (G, ctx) => {
    const { leader, voteCount } = countVotes(G);

    return !!leader && voteCount === getNumberOfAlivePlayers(G);
  },
  turn: {
    onBegin: (G, ctx) => {
      ctx.events?.setActivePlayers({ all: "voteLeader" });
    },
    stages: {
      voteLeader: {
        moves: {
          vote: (G, ctx, leaderId: string) => {
            if (!ctx.playerID) {
              return INVALID_MOVE;
            }
            G.leaderVotes[ctx.playerID] = leaderId;
          },
        },
      },
    },
  },
  next: "event",
};

export default voteLeader;
