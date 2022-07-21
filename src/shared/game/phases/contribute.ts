import { Ctx, PhaseConfig } from "boardgame.io";
import { GameState, PlayerData } from "../../../types";
import { forEachAlivePlayer } from "../../utils";

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
    let maxContributions = 0;
    let maxContributorList: string[] = [];
    forEachAlivePlayer(G, (playerData, playerId) => {
      console.log(playerId, playerData.contributions, maxContributions);
      if (playerData.contributions > maxContributions) {
        maxContributions = playerData.contributions;
        maxContributorList = [playerId];
      } else if (playerData.contributions === maxContributions) {
        maxContributorList.push(playerId);
      }
    });

    // if the list is of length 0, keep the same leader from previous round
    if (maxContributorList.length === 1) {
      G.leaderId = maxContributorList[0];
    } else if (maxContributorList.length > 1) {
      G.leaderId = null;
    }
  },
  next: (G, ctx) => {
    if (G.leaderId === null) {
      return "voteLeader";
    }
    return "event";
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
            if (ctx.playerID) {
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
