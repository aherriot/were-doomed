import { FilteredMetadata } from "boardgame.io";
import { BoardProps } from "boardgame.io/react";
import { GameState } from "src/shared/types";

export type CommonProps = Pick<
  BoardProps<GameState>,
  "G" | "ctx" | "moves" | "playerID"
> & {
  selectedTarget: string | null;
  setSelectedTarget: (
    target: string | null | ((target: string | null) => string | null)
  ) => void;
  playerInfoById: Record<string, FilteredMetadata[number]>;
};
