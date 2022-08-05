import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameState, Government } from "../../types";
import { computeEndDate } from "../../utils";

const pregame: PhaseConfig<GameState, Ctx> = {
  start: true,
  next: "takeAction",
  moves: {},
  turn: {
    onBegin: (G, ctx) => {
      ctx.events?.setActivePlayers({
        all: { stage: "pregame" },
      });
    },
    stages: {
      pregame: {
        moves: {
          startGame: (G, ctx, gameLengthInMinutes = 15) => {
            if (ctx.playerID !== "0") {
              return INVALID_MOVE;
            }
            G.playerData["0"].isAlive = true;
            G.endGame.time = computeEndDate(gameLengthInMinutes);
            ctx.events?.endPhase();
          },
          chooseGovernment: (G, ctx, government: Government) => {
            if (ctx.playerID == null) {
              return INVALID_MOVE;
            }

            const governmentMap: Record<Government, number> = {
              democracy: 0,
              corporatocracy: 0,
              theocracy: 0,
              autocracy: 0,
              technocracy: 0,
            };

            let total = 0;
            for (let playerId in G.playerData) {
              const playerData = G.playerData[playerId];
              if (playerData.government) {
                governmentMap[playerData.government] =
                  (governmentMap[playerData.government] ?? 0) + 1;
                total++;
              }
            }

            if (governmentMap[government] > 0 && total < 5) {
              return INVALID_MOVE;
            }

            G.playerData[ctx.playerID].isAlive = true;
            G.playerData[ctx.playerID].government = government;
          },
        },
      },
    },
  },
};
export default pregame;
