import { Ctx, PhaseConfig } from "boardgame.io";
import { GameState, PlayerData } from "../../types";
import { forEachAlivePlayer, getTopContributors } from "../../utils";

function checkContributionAllDone(G: GameState, ctx: Ctx): boolean {
  let allDone = true;

  forEachAlivePlayer(G, (playerData: PlayerData, playerId: string) => {
    if (
      playerData.resources > 0 &&
      !playerData.hasSkipped &&
      ctx.activePlayers?.[playerId]
    ) {
      allDone = false;
    }
  });

  return allDone;
}

const contribute: PhaseConfig<GameState, Ctx> = {
  onBegin: (G, ctx) => {
    for (let playerId in G.playerData) {
      G.playerData[playerId].contributions = 0;
      G.playerData[playerId].hasSkipped = false;
    }
  },
  onEnd: (G, ctx) => {
    const topContributors = getTopContributors(G);

    // if the list is of length 0, keep the same leader from previous round
    if (topContributors.length === 1) {
      G.leaderId = topContributors[0];
      G.playerData[G.leaderId].influence++;
    } else if (topContributors.length > 1) {
      G.leaderId = null;
    }
  },
  next: (G, ctx) => {
    const currentTime = new Date().getTime();
    if (G.endGame.time && G.endGame.time < currentTime) {
      return "endGame";
    }

    if (G.leaderId === null && getTopContributors(G).length !== 0) {
      return "voteLeader";
    }
    return "takeAction";
  },
  turn: {
    onBegin: (G, ctx) => {
      ctx.events?.setActivePlayers({ all: "contribute" });
    },
    onMove: (G, ctx) => {
      if (checkContributionAllDone(G, ctx)) {
        ctx.events?.endPhase();
      }
    },
    stages: {
      contribute: {
        moves: {
          contribute: (G, ctx) => {
            if (ctx.playerID && G.playerData[ctx.playerID].resources > 0) {
              G.projectResources++;
              G.playerData[ctx.playerID].resources--;
              G.playerData[ctx.playerID].contributions++;
            }
          },
          skip: (G, ctx) => {
            if (ctx.playerID != null) {
              G.playerData[ctx.playerID].hasSkipped = true;
            }
            ctx.events?.endStage();
          },
        },
      },
    },
  },
};

export default contribute;
