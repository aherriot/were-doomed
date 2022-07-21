import { Ctx, PhaseConfig } from "boardgame.io";
import { GameState } from "../../../types";
import { computeEndDate } from "../../utils";

const pregame: PhaseConfig<GameState, Ctx> = {
  start: true,
  next: "action",
  turn: {
    onBegin: (G, ctx) => {
      ctx.events?.setActivePlayers({ all: "pregame" });
    },
    onEnd: (G, ctx) => {
      G.endTime = computeEndDate();
    },
    stages: {
      pregame: {
        moves: {
          startGame: (G, ctx) => {
            ctx.events?.endPhase();
          },
        },
      },
    },
  },
};
export default pregame;
