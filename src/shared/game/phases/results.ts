import { Ctx, PhaseConfig } from "boardgame.io";
import { getPlayersToVoteOn } from "../../../shared/utils";
import { GameState } from "../../types";

const endGame: PhaseConfig<GameState, Ctx> = {
  onBegin: (G, ctx) => {
    if (G.endGame.winners.length === 0) {
      const { winners, candidates, seatsRemaining } = getPlayersToVoteOn(G);
      G.endGame.winners = winners;
      G.endGame.candidates = candidates;
      G.endGame.seatsRemaining = seatsRemaining;
    }

    // mark all the players that did not make it as dead
    for (let playerId in G.playerData) {
      if (!G.endGame.winners.includes(playerId)) {
        G.playerData[playerId].isAlive = false;
      }
    }
  },
  onEnd: (G, ctx) => {
    ctx.events?.endGame();
  },
};

export default endGame;
