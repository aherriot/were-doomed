import { Game } from "boardgame.io";
import { GameState, PlayerData } from "../types";

import contribute from "./phases/contribute";
import endGame from "./phases/endGame";
import event from "./phases/event";
import pregame from "./phases/pregame";
import takeAction from "./phases/takeAction";
import voteLeader from "./phases/voteLeader";

import {
  GAME_NAME,
  MAX_NUMBER_OF_PLAYERS,
  MIN_NUMBER_OF_PLAYERS,
  TOTAL_INFLUENCE_TOKENS,
  TOTAL_RESOURCES_TOKENS,
} from "../utils";
import results from "./phases/results";

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
        isAlive: false,
        hasSkipped: false,
        government: null,
      };
    }

    return {
      projectResources: 0,
      leaderId: null,
      leaderVotes: {},
      actionHistory: [],
      bank: {
        resources: TOTAL_RESOURCES_TOKENS,
        influence: TOTAL_INFLUENCE_TOKENS,
      },
      playerData,
      endGame: {
        votes: {},
        winners: [],
        candidates: [],
        seatsRemaining: 0,
        time: null,
      },
    };
  },

  moves: {},

  phases: {
    pregame,
    takeAction,
    contribute,
    voteLeader,
    event,
    endGame,
    results,
  },
};
export default WereDoomed;
