import { BoardProps } from "boardgame.io/react";
import { GameState } from "../types";

export type CommonProps = Pick<BoardProps<GameState>, "G" | "ctx" | "moves"> & {
  selectedTarget: string | null;
  setSelectedTarget: (target: string | null) => void;
};
