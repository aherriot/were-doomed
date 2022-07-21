import { Ctx, PhaseConfig } from "boardgame.io";
import { GameState } from "../../../types";
import { INVALID_MOVE } from "boardgame.io/core";

const takeAction: PhaseConfig<GameState, Ctx> = {
  onEnd: (G, ctx) => {
    for (let playerId in G.playerData) {
      G.playerData[playerId].contributions = 0;
      G.playerData[playerId].hasSkipped = false;
    }
  },
  turn: {
    order: {
      first: (G, ctx) => {
        console.log("first", G.leaderId);
        return G.leaderId != null ? parseInt(G.leaderId, 10) : 0;
      },
      next: (G, ctx) => {
        console.log("next", ctx.playOrderPos);
        return (ctx.playOrderPos + 1) % ctx.numPlayers;
      },
    },
  },
  moves: {
    produce: (G, ctx) => {
      if (G.bank.resources < 2) {
        return INVALID_MOVE;
      }

      G.playerData[ctx.currentPlayer].resources += 2;
      G.bank.resources -= 2;
      ctx.events?.endTurn();
    },
    indoctrinate: (G, ctx) => {
      if (G.bank.influence < 1) {
        return INVALID_MOVE;
      }

      G.playerData[ctx.currentPlayer].influence += 1;
      G.bank.influence -= 1;
      ctx.events?.endTurn();
    },
    propagandize: (G, ctx, target: string) => {
      const playerData = G.playerData[ctx.currentPlayer];
      const targetData = G.playerData[target];

      playerData.influence += 1;
      targetData.influence -= 1;

      playerData.resources -= 1;
      G.bank.resources += 1;

      ctx.events?.endTurn();
    },
    invade: (G, ctx, target: string) => {
      const playerData = G.playerData[ctx.currentPlayer];
      const targetData = G.playerData[target];

      playerData.resources += 2;
      targetData.resources -= 2;

      playerData.influence -= 1;
      G.bank.influence += 1;

      ctx.events?.endTurn();
    },
    nuke: (G, ctx, target) => {
      if (G.playerData[ctx.currentPlayer].resources < 8) {
        return INVALID_MOVE;
      }

      const targetData = G.playerData[target];
      if (!targetData || !targetData.isAlive) {
        return INVALID_MOVE;
      }

      targetData.isAlive = false;
      G.bank.influence += targetData.influence;
      targetData.influence = 0;

      G.bank.resources += targetData.resources;
      targetData.resources = 0;

      G.playerData[ctx.currentPlayer].resources -= 8;

      ctx.events?.endTurn();
    },
  },
  next: "contribute",
};

export default takeAction;
