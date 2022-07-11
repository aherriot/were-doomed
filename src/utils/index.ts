import { Ctx } from "boardgame.io";
import { GameState, Move, PlayerData } from "../types";

export const TOTAL_RESOURCES_TOKENS = 130;
export const TOTAL_INFLUENCE_TOKENS = 100;

type Action = "produce" | "indoctrinate" | "propagandize" | "invade" | "nuke";

const MOVES: Record<Action, Move> = {
  produce: {
    name: "Produce",
    gain: "resources",
    gainAmount: 2,
    target: "bank",
  },
  indoctrinate: {
    name: "Indoctrinate",
    gain: "influence",
    gainAmount: 1,
    target: "bank",
  },
  propagandize: {
    name: "Propagandize",
    gain: "influence",
    gainAmount: 1,
    lose: "resources",
    loseAmount: 1,
    target: "player",
  },
  invade: {
    name: "Invade",
    gain: "resources",
    gainAmount: 2,
    lose: "influence",
    loseAmount: 1,
    target: "player",
  },
  nuke: {
    name: "Nuke",
    lose: "resources",
    loseAmount: 8,
    target: "player",
  },
};

export const RESOURCES_TO_SEAT = [
  { resources: 40, seats: 1 },
  { resources: 50, seats: 2 },
  { resources: 60, seats: 3 },
  { resources: 70, seats: 4 },
  { resources: 80, seats: 5 },
  { resources: 90, seats: 6 },
  { resources: 100, seats: 7 },
  { resources: 110, seats: 8 },
  { resources: 120, seats: 9 },
  { resources: 130, seats: 10 },
];

export function computeEndDate(): number {
  const second = 1000;
  const minutes = second * 60;
  return new Date().getTime() + 15 * minutes + second;
}

export function setAlivePlayersToStage(G: GameState, ctx: Ctx, stage: string) {
  const stageMapping: { [key: string]: string } = {};

  forEachAlivePlayer(G, (playerData, playerId) => {
    stageMapping[playerId] = stage;
  });

  ctx.events?.setActivePlayers({ value: stageMapping });
}

export function countVotes(G: GameState): {
  leader: string | null;
  voteCount: number;
} {
  let maxVotes = 0;
  let voteCount = 0;

  let leadingLeaders: string[] = [];
  const voteMap: Record<string, number> = {};

  for (let voterId in G.leaderVotes) {
    const leaderId = G.leaderVotes[voterId];
    if (voteMap[leaderId]) {
      voteMap[leaderId]++;
    } else {
      voteMap[leaderId] = 1;
    }
    if (voteMap[leaderId] > maxVotes) {
      maxVotes = voteMap[leaderId];
      leadingLeaders = [leaderId];
    } else if (voteMap[leaderId] === maxVotes) {
      leadingLeaders.push(leaderId);
    }
    voteCount++;
  }

  if (leadingLeaders.length === 1) {
    return { leader: leadingLeaders[0], voteCount };
  }
  return { leader: null, voteCount };
}

export function getNumberOfSeats(resourceCount: number): number {
  for (let i = RESOURCES_TO_SEAT.length - 1; i >= 0; i--) {
    if (resourceCount >= RESOURCES_TO_SEAT[i].resources) {
      return RESOURCES_TO_SEAT[i].seats;
    }
  }
  return 0;
}

export function getOtherAlivePlayers(G: GameState, ctx: Ctx): string[] {
  const alivePlayers: string[] = [];
  forEachAlivePlayer(G, (playerData, playerId) => {
    if (playerId !== ctx.playerID) {
      alivePlayers.push(playerId);
    }
  });
  return alivePlayers;
}

export function getNumberOfAlivePlayers(G: GameState) {
  let count = 0;
  forEachAlivePlayer(G, () => {
    count++;
  });
  return count;
}

export function forEachAlivePlayer(
  G: GameState,
  callback: (playerData: PlayerData, playerId: string) => void
): void {
  for (let playerId in G.playerData) {
    const playerData = G.playerData[playerId];
    if (playerData.isAlive) {
      callback(playerData, playerId);
    }
  }
}
