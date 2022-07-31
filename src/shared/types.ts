type Token = "resources" | "influence";
type Target = "player" | "bank";

type Action = "produce" | "indoctrinate" | "propagandize" | "invade" | "nuke";

export type Move = {
  name: string;
  gain?: Token;
  gainAmount?: number;
  lose?: Token;
  loseAmount?: number;
  target: Target;
};

export type PlayerData = {
  resources: number;
  influence: number;
  contributions: number;
  isAlive: boolean;
  hasSkipped: boolean;
};

export type ActionEvent = {
  action: Action;
  playerId: string;
} & (
  | {
      action: Exclude<Action, "produce" | "indoctrinate">;
      targetId: string;
    }
  | {
      action: "produce" | "indoctrinate";
    }
);

export type GameState = {
  endTime: null | number;
  projectResources: number;
  leaderId: string | null;
  leaderVotes: Record<string, string>;
  actionHistory: ActionEvent[];
  bank: {
    resources: number;
    influence: number;
  };
  playerData: Record<string, PlayerData>;
};
