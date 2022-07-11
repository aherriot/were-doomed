type Token = "resources" | "influence";
type Target = "player" | "bank";

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

export type GameState = {
  endTime: null | number;
  projectResources: number;
  leaderId: string | null;
  leaderVotes: Record<string, string>;
  bank: {
    resources: number;
    influence: number;
  };
  playerData: Record<string, PlayerData>;
};
