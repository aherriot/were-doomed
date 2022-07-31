import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameState } from "../../types";
import { computeEndDate } from "../../utils";

const pregame: PhaseConfig<GameState, Ctx> = {
  start: true,
  next: "takeAction",
  moves: {},
  turn: {
    onBegin: (G, ctx) => {
      ctx.events?.setActivePlayers({
        all: { stage: "pregame", maxMoves: 2 },
      });
    },
    onEnd: (G, ctx) => {
      // for (let id in G.playerData) {
      // G.playerData[id].isAlive = false;
      // }
      G.endTime = computeEndDate();
    },
    stages: {
      pregame: {
        moves: {
          startGame: (G, ctx) => {
            if (ctx.playerID !== "0") {
              return INVALID_MOVE;
            }
            G.playerData["0"].isAlive = true;
            ctx.events?.endPhase();
          },
          markReady: (G, ctx) => {
            if (ctx.playerID == null) {
              return INVALID_MOVE;
            }

            G.playerData[ctx.playerID].isAlive = true;
            ctx.events?.endStage();
          },
        },
      },
    },
  },
};
export default pregame;
