import { Ctx, PhaseConfig } from "boardgame.io";
import { GameState } from "../../types";

const event: PhaseConfig<GameState, Ctx> = {
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
  next: "takeAction",
};

export default event;
