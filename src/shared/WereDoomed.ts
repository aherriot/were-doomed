import { Ctx, Game } from "boardgame.io";
import { INVALID_MOVE, TurnOrder } from "boardgame.io/core";
import { GameState, PlayerData } from "../types";
import {
  computeEndDate,
  countVotes,
  forEachAlivePlayer,
  GAME_NAME,
  getNumberOfAlivePlayers,
  MAX_NUMBER_OF_PLAYERS,
  MIN_NUMBER_OF_PLAYERS,
  TOTAL_INFLUENCE_TOKENS,
  TOTAL_RESOURCES_TOKENS,
} from "./utils";

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

const WereDoomed: Game<GameState> = {
  name: GAME_NAME,
  minPlayers: MIN_NUMBER_OF_PLAYERS,
  maxPlayers: MAX_NUMBER_OF_PLAYERS,
  setup: (ctx) => {
    const playerData: Record<string, PlayerData> = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
      playerData[i] = {
        resources: 0,
        influence: 0,
        contributions: 0,
        isAlive: true,
        hasSkipped: false,
      };
    }

    return {
      endTime: null,
      projectResources: 0,
      leaderId: null,
      leaderVotes: {},
      bank: {
        resources: TOTAL_RESOURCES_TOKENS,
        influence: TOTAL_INFLUENCE_TOKENS,
      },
      playerData,
    };
  },

  moves: {},

  phases: {
    pregame: {
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
    },
    action: {
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
    },
    contribute: {
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
    },
    voteLeader: {
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
    },
    // leader takes an event card.
    event: {
      moves: {
        skip: (G, ctx) => {
          ctx.events?.endTurn();
        },
      },
      turn: {
        onBegin: (G, ctx) => {
          console.log(`TODO: Leader ${G.leaderId} plays an event card`);
        },
        order: {
          first: () => 0,
          next: () => undefined,
          playOrder: (G) => {
            if (!G.leaderId) {
              throw new Error("LeaderId is not defined.");
            }
            return [G.leaderId];
          },
        },
      },
      next: "action",
    },
    endGame: {
      onEnd: (G, ctx) => {
        ctx.events?.endGame();
      },
    },
  },
};
export default WereDoomed;
