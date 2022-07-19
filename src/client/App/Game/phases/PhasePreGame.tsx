import { ReactElement } from "react";
import { CommonProps } from "../types";

const PhasePreGame = ({ G, ctx, moves }: CommonProps): ReactElement => {
  return (
    <div>
      <h1>PreGame</h1>

      <button onClick={() => moves.startGame()}>Start Game</button>
    </div>
  );
};

export default PhasePreGame;
