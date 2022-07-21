import { Ctx, PhaseConfig } from "boardgame.io";
import { GameState } from "../../../types";

const endGame: PhaseConfig<GameState, Ctx> = {
  onEnd: (G, ctx) => {
    ctx.events?.endGame();
  },
};

export default endGame;
