import { Ctx } from "boardgame.io";
import { GameState, Move, PlayerData } from "../types";

export const GAME_NAME = "WereDoomed";
export const MIN_NUMBER_OF_PLAYERS = 4;
export const MAX_NUMBER_OF_PLAYERS = 10;
export const TOTAL_RESOURCES_TOKENS = 140;
export const TOTAL_INFLUENCE_TOKENS = 70;

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
  { resources: 2, seats: 1 },
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

export function getTopContributors(G: GameState): string[] {
  let topContributions = 0;
  let topContributorList: string[] = [];

  for (let id in G.playerData) {
    const playerData = G.playerData[id];
    if (playerData.isAlive) {
      if (playerData.contributions > topContributions) {
        topContributions = playerData.contributions;
        topContributorList = [id];
      } else if (
        playerData.contributions === topContributions &&
        playerData.contributions !== 0
      ) {
        topContributorList.push(id);
      }
    }
  }
  return topContributorList;
}

export function computeEndDate(gameLengthInMinutes = 15): number {
  const second = 1000;
  const minutes = second * 60;
  return new Date().getTime() + gameLengthInMinutes * minutes + second;
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

export function getNextSeat(resourceCount: number): number {
  for (let i = RESOURCES_TO_SEAT.length - 1; i >= 0; i--) {
    if (resourceCount >= RESOURCES_TO_SEAT[i].resources) {
      if (i === RESOURCES_TO_SEAT.length - 1) {
        return -1;
      }
      return RESOURCES_TO_SEAT[i + 1].resources;
    }
  }
  return RESOURCES_TO_SEAT[0].resources;
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

export function getPlayersToVoteOn(G: GameState): {
  winners: string[];
  candidates: string[];
  seatsRemaining: number;
} {
  let seatsRemaining = getNumberOfSeats(G.projectResources);
  const players: { id: string; influence: number }[] = [];
  const influenceToIdsMap: Record<number, string[]> = {};
  const winners: string[] = [];

  // generate a list of living players and map their influence to their ids
  for (let id in G.playerData) {
    if (G.playerData[id].isAlive) {
      const influence = G.playerData[id].influence;
      players.push({ id, influence });
      if (influenceToIdsMap[influence]) {
        influenceToIdsMap[influence].push(id);
      } else {
        influenceToIdsMap[influence] = [id];
      }
    }
  }

  // sort players by influence
  players.sort((a, b) => b.influence - a.influence);

  for (let i = 0; i < players.length; ) {
    const ids = influenceToIdsMap[players[i].influence];
    if (seatsRemaining === 0) {
      break;
    }
    if (ids.length > seatsRemaining) {
      return { winners, candidates: ids, seatsRemaining };
    } else {
      winners.push(...ids);
      i += ids.length;
      seatsRemaining -= ids.length;
    }
  }

  return { winners, candidates: [], seatsRemaining };
}

export function getVotesPerPlayer(
  winners: string[],
  candidates: string[],
  endGameVotes: Record<string, string[]>
): Record<string, number> {
  const votesPerPlayer: Record<string, number> = {};

  winners.forEach((playerId) => {
    const votes = endGameVotes[playerId];
    votes?.forEach((vote) => {
      votesPerPlayer[vote] = (votesPerPlayer[vote] ?? 0) + 1;
    });
  });

  candidates.forEach((playerId) => {
    const votes = endGameVotes[playerId];
    votes?.forEach((vote) => {
      votesPerPlayer[vote] = (votesPerPlayer[vote] ?? 0) + 1;
    });
  });

  return votesPerPlayer;
}
