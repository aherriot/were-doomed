import { Ctx, PhaseConfig } from "boardgame.io";
import { GameState } from "../../types";
import { INVALID_MOVE } from "boardgame.io/core";
import { MAX_NUMBER_OF_PLAYERS } from "../../../shared/utils";

const first = (G: GameState, ctx: Ctx) => {
  // return leader playOrderPos if there is a leader or 0 if it can't be found
  if (G.leaderId != null) {
    return Math.max(
      ctx.playOrder.findIndex((playerId) => playerId === G.leaderId),
      0
    );
  }

  // return the playOrderPos of the first alive player or 0 if none are alive
  return Math.max(
    ctx.playOrder.findIndex((playerId) => G.playerData[playerId].isAlive),
    0
  );
};

const next = (G: GameState, ctx: Ctx) => {
  const leaderPos = ctx.playOrder.findIndex(
    (playerId) => playerId === G.leaderId
  );
  const firstPlayOrderPos = leaderPos >= 0 ? leaderPos : 0;

  let next = ctx.playOrderPos + 1;

  for (let i = 0; i < MAX_NUMBER_OF_PLAYERS; i++) {
    // if the next player is the player that just went,
    // then return undefined to end the round
    if (ctx.playOrderPos === next) {
      return undefined;
    }

    const nextPlayerId = ctx.playOrder[next];
    if (G.playerData[nextPlayerId].isAlive) {
      // everyone has completed a turn
      if (next === firstPlayOrderPos) {
        return undefined;
      }

      return next;
    }
    next = (next + 1) % MAX_NUMBER_OF_PLAYERS;
  }

  // if we have looped through all players and none are alive,
  // then return undefined to end the round
  return undefined;
};

// Gain 2 resources from the bank
const produce = (G: GameState, ctx: Ctx) => {
  if (G.bank.resources < 2) {
    return INVALID_MOVE;
  }

  G.playerData[ctx.currentPlayer].resources += 2;
  G.bank.resources -= 2;
  G.actionHistory.push({
    action: "produce",
    playerId: ctx.currentPlayer,
  });
  ctx.events?.endTurn();
};

// Gain 1 influence from the bank
const indoctrinate = (G: GameState, ctx: Ctx) => {
  if (G.bank.influence < 1) {
    return INVALID_MOVE;
  }

  G.playerData[ctx.currentPlayer].influence += 1;
  G.bank.influence -= 1;
  G.actionHistory.push({
    action: "indoctrinate",
    playerId: ctx.currentPlayer,
  });
  ctx.events?.endTurn();
};

// Steal 1 influence from another player by spending 1 resource
const propagandize = (G: GameState, ctx: Ctx, targetId: string) => {
  if (!targetId) {
    return INVALID_MOVE;
  }
  const playerData = G.playerData[ctx.currentPlayer];
  const targetData = G.playerData[targetId];

  if (playerData.resources < 1 || targetData.influence < 1) {
    return INVALID_MOVE;
  }

  playerData.influence += 1;
  targetData.influence -= 1;

  playerData.resources -= 1;
  G.bank.resources += 1;
  G.actionHistory.push({
    action: "propagandize",
    playerId: ctx.currentPlayer,
    targetId,
  });
  ctx.events?.endTurn();
};

// Steal 2 resource from another player by spending 1 influence
const invade = (G: GameState, ctx: Ctx, targetId: string) => {
  if (!targetId) {
    return INVALID_MOVE;
  }

  const playerData = G.playerData[ctx.currentPlayer];
  const targetData = G.playerData[targetId];

  if (playerData.influence < 1) {
    return INVALID_MOVE;
  }

  if (targetData.resources < 2) {
    return INVALID_MOVE;
  }

  playerData.resources += 2;
  targetData.resources -= 2;

  playerData.influence -= 1;
  G.bank.influence += 1;

  G.actionHistory.push({
    action: "invade",
    playerId: ctx.currentPlayer,
    targetId,
  });

  ctx.events?.endTurn();
};

// Spend 8 resources to eliminate a player from the game permanently
const nuke = (G: GameState, ctx: Ctx, targetId: string) => {
  if (!targetId) {
    return INVALID_MOVE;
  }

  if (G.playerData[ctx.currentPlayer].resources < 8) {
    return INVALID_MOVE;
  }

  const targetData = G.playerData[targetId];
  if (!targetData || !targetData.isAlive) {
    return INVALID_MOVE;
  }

  targetData.isAlive = false;
  G.bank.influence += targetData.influence;
  targetData.influence = 0;

  G.bank.resources += targetData.resources;
  targetData.resources = 0;

  G.playerData[ctx.currentPlayer].resources -= 8;

  G.actionHistory.push({
    action: "nuke",
    playerId: ctx.currentPlayer,
    targetId,
  });

  ctx.events?.endTurn();
};

const takeAction: PhaseConfig<GameState, Ctx> = {
  onBegin: (G, ctx) => {
    G.actionHistory = [];
  },
  onEnd: (G, ctx) => {
    for (let playerId in G.playerData) {
      G.playerData[playerId].contributions = 0;
      G.playerData[playerId].hasSkipped = false;
    }
  },
  turn: {
    order: {
      first,
      next: next,
    },
  },
  moves: {
    produce,
    indoctrinate,
    propagandize,
    invade,
    nuke,
  },
  next: (G, ctx) => {
    const currentTime = new Date().getTime();
    if (G.endTime && G.endTime < currentTime) {
      return "endGame";
    }
    return "contribute";
  },
};

export default takeAction;
export { first, next, produce, indoctrinate, propagandize, invade, nuke };
