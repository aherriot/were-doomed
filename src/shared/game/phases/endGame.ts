import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameState } from "../../types";

const endGame: PhaseConfig<GameState, Ctx> = {
  turn: {
    onBegin: (G, ctx) => {
      ctx.events?.setActivePlayers({ all: "voteSeat" });
    },
    stages: {
      voteSeat: {
        moves: {
          vote: (G, ctx, leaderId: string) => {
            if (!ctx.playerID) {
              return INVALID_MOVE;
            }

            if (!G.playerData[ctx.playerID].isAlive) {
              return INVALID_MOVE;
            }
          },
        },
      },
    },
  },
  onEnd: (G, ctx) => {},
  next: "results",
};

export default endGame;
