import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameState } from "../../types";
import { countVotes, getNumberOfAlivePlayers } from "../../utils";

const voteLeader: PhaseConfig<GameState, Ctx> = {
  onBegin: (G, ctx) => {},
  onEnd(G, ctx) {
    const { leader } = countVotes(G);

    if (leader) {
      G.leaderId = leader;
      G.playerData[leader].influence++;
    }

    G.leaderVotes = {};
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

            if (!G.playerData[ctx.playerID].isAlive) {
              return INVALID_MOVE;
            }

            G.leaderVotes[ctx.playerID] = leaderId;
          },
        },
      },
    },
  },
  next: (G, ctx) => {
    const currentTime = new Date().getTime();
    if (G.endTime && G.endTime < currentTime) {
      return "endGame";
    }
    return "takeAction";
  },
};

export default voteLeader;
