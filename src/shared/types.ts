type Token = "resources" | "influence";
type Target = "player" | "bank";

type Action = "produce" | "indoctrinate" | "propagandize" | "invade" | "nuke";

export type Government =
  | "democracy"
  | "corporatocracy"
  | "theocracy"
  | "autocracy"
  | "technocracy";

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
  government: Government | null;
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
      amount: number;
    }
);

export type GameState = {
  projectResources: number;
  leaderId: string | null;
  leaderVotes: Record<string, string>;
  endGame: {
    votes: Record<string, string[]>;
    winners: string[];
    candidates: string[];
    seatsRemaining: number;
    time: null | number;
  };
  actionHistory: ActionEvent[];
  bank: {
    resources: number;
    influence: number;
  };
  playerData: Record<string, PlayerData>;
};
