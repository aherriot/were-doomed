import { Ctx } from "boardgame.io";
import { GameState, PlayerData } from "src/shared/types";
import { first, next, produce } from "../takeAction";

const generatePlayerData = (isAlive: boolean): PlayerData => ({
  isAlive,
  resources: 0,
  influence: 0,
  contributions: 0,
  hasSkipped: false,
});

describe("first", () => {
  it("returns the playOrderPos of the leader if there is a leader", () => {
    const G: Pick<GameState, "leaderId"> = {
      leaderId: "1",
    };

    const ctx: Pick<Ctx, "playOrder" | "playOrderPos"> = {
      playOrder: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      playOrderPos: 1,
    };

    expect(first(G as GameState, ctx as Ctx)).toBe(1);

    G.leaderId = "5";
    expect(first(G as GameState, ctx as Ctx)).toBe(5);

    G.leaderId = "10";
    expect(first(G as GameState, ctx as Ctx)).toBe(0);
  });

  it("returns first alive player if there is no leader", () => {
    const G: Pick<GameState, "leaderId" | "playerData"> = {
      leaderId: null,
      playerData: {
        0: generatePlayerData(false),
        1: generatePlayerData(false),
        2: generatePlayerData(false),
        3: generatePlayerData(false),
        4: generatePlayerData(true),
        5: generatePlayerData(false),
        6: generatePlayerData(false),
        7: generatePlayerData(false),
        8: generatePlayerData(true),
        9: generatePlayerData(false),
      },
    };

    const ctx: Pick<Ctx, "playOrder" | "playOrderPos"> = {
      playOrder: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      playOrderPos: 1,
    };

    expect(first(G as GameState, ctx as Ctx)).toBe(4);
  });
});

describe("next", () => {
  it("play order cycles through all living players", () => {
    const G: Pick<GameState, "playerData" | "leaderId"> = {
      leaderId: null,
      playerData: {
        0: generatePlayerData(true),
        1: generatePlayerData(true),
        2: generatePlayerData(false),
        3: generatePlayerData(false),
        4: generatePlayerData(true),
        5: generatePlayerData(false),
        6: generatePlayerData(false),
        7: generatePlayerData(false),
        8: generatePlayerData(true),
        9: generatePlayerData(false),
      },
    };

    const ctx: Pick<Ctx, "playOrder" | "playOrderPos" | "numPlayers"> = {
      numPlayers: 10,
      playOrder: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      playOrderPos: 0,
    };

    expect(next(G as GameState, ctx as Ctx)).toBe(1);

    ctx.playOrderPos = 1;
    expect(next(G as GameState, ctx as Ctx)).toBe(4);

    ctx.playOrderPos = 4;
    expect(next(G as GameState, ctx as Ctx)).toBe(8);

    ctx.playOrderPos = 8;
    expect(next(G as GameState, ctx as Ctx)).toBeUndefined();
  });

  it("returns undefined if only 1 is living", () => {
    const G: Pick<GameState, "playerData"> = {
      playerData: {
        0: generatePlayerData(false),
        1: generatePlayerData(true),
        2: generatePlayerData(false),
        3: generatePlayerData(false),
        4: generatePlayerData(false),
        5: generatePlayerData(false),
        6: generatePlayerData(false),
        7: generatePlayerData(false),
        8: generatePlayerData(false),
        9: generatePlayerData(false),
      },
    };

    const ctx: Partial<Ctx> = {
      playOrderPos: 1,
      numPlayers: 10,
      playOrder: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    };

    expect(next(G as GameState, ctx as Ctx)).toBeUndefined();
  });

  it("cycles around back to 0 if there is a leader", () => {
    const G: Pick<GameState, "playerData" | "leaderId"> = {
      leaderId: "0",
      playerData: {
        0: generatePlayerData(true),
        1: generatePlayerData(true),
        2: generatePlayerData(false),
        3: generatePlayerData(false),
        4: generatePlayerData(false),
        5: generatePlayerData(false),
        6: generatePlayerData(false),
        7: generatePlayerData(false),
        8: generatePlayerData(false),
        9: generatePlayerData(false),
      },
    };

    const ctx: Partial<Ctx> = {
      playOrderPos: 1,
      numPlayers: 10,
      playOrder: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    };

    ctx.playOrderPos = 0;
    expect(next(G as GameState, ctx as Ctx)).toBe(1);

    ctx.playOrderPos = 1;
    expect(next(G as GameState, ctx as Ctx)).toBeUndefined();

    G.leaderId = "1";
    ctx.playOrderPos = 0;
    expect(next(G as GameState, ctx as Ctx)).toBeUndefined();

    ctx.playOrderPos = 1;
    expect(next(G as GameState, ctx as Ctx)).toBe(0);
  });
});

describe("produce", () => {
  it("produces resources", () => {
    const G: Pick<GameState, "playerData" | "bank" | "actionHistory"> = {
      bank: {
        resources: 10,
        influence: 10,
      },
      actionHistory: [],
      playerData: {
        0: {
          isAlive: true,
          resources: 0,
          influence: 0,
          contributions: 0,
          hasSkipped: false,
        },
        1: {
          isAlive: true,
          resources: 0,
          influence: 0,
          contributions: 0,
          hasSkipped: false,
        },
      },
    };

    const ctx: Pick<Ctx, "currentPlayer"> = {
      currentPlayer: "1",
    };

    const playerId = "1";
    produce(G as GameState, ctx as Ctx);
    expect(G?.playerData?.[playerId]?.resources).toBe(2);
    expect(G.bank.resources).toBe(8);
  });
});
