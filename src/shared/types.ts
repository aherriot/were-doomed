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
  /** The number of resources this player has collected */
  resources: number;
  /** The amount of influence this player has generated */
  influence: number;
  /** The number of resources the player has contributed to the project in the current round only */
  contributions: number;
  /** Whether the player is still alive */
  isAlive: boolean;
  /** Whether the player has skipped their turn */
  hasSkipped: boolean;
  /** The government type this player has selected at the start of the game */
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
  /** The number of resources contributed to the project */
  projectResources: number;
  /** The id of the elected leader, or null if there is none */
  leaderId: string | null;
  /** A map from playerId to playerId for when players are voting for a leader */
  leaderVotes: Record<string, string>;
  /** State related to the end of the game. */
  endGame: {
    /** Votes for who gets on the space ship if there is a tie.
     * Players may be able to vote more than once if there is more than 1 seat available
     * */
    votes: Record<string, string[]>;
    /** The id of the player who made it in the space ship */
    winners: string[];
    /** If there is a tie in influence, this represents a list of candidates eligible for the remaing seats. */
    candidates: string[];
    /** The number of seats available for tied players to compete over in a vote. */
    seatsRemaining: number;
    /** The time in ms when the game timer will run out and the game ends. */
    time: null | number;
  };
  /** A list of actions that were performed in the action phase of the gam e. */
  actionHistory: ActionEvent[];
  /** The resources and influence tokens remaining in the bank. */
  bank: {
    resources: number;
    influence: number;
  };
  /** A map of playerId to data associated with that specific player */
  playerData: Record<string, PlayerData>;
};
