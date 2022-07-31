import { getNextSeat, getPlayersToVoteOn, getTopContributors } from "..";
import { GameState } from "../../../shared/types";

describe("utils", () => {
  describe("getTopContributors", () => {
    it("returns empty when there are no contributors", () => {
      const G: Pick<GameState, "playerData"> = {
        playerData: {
          "0": {
            isAlive: true,
            contributions: 0,
            resources: 0,
            influence: 0,
            hasSkipped: true,
          },
          "1": {
            isAlive: true,
            contributions: 0,
            resources: 0,
            influence: 0,
            hasSkipped: true,
          },
          "2": {
            isAlive: true,
            contributions: 0,
            resources: 0,
            influence: 0,
            hasSkipped: true,
          },
        },
      };
      expect(getTopContributors(G as GameState)).toEqual([]);
    });

    it("returns top contributor when there is one top", () => {
      const G: Pick<GameState, "playerData"> = {
        playerData: {
          "0": {
            isAlive: true,
            contributions: 1,
            resources: 0,
            influence: 0,
            hasSkipped: true,
          },
          "1": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 0,
            hasSkipped: true,
          },
          "2": {
            isAlive: true,
            contributions: 0,
            resources: 0,
            influence: 0,
            hasSkipped: true,
          },
        },
      };
      expect(getTopContributors(G as GameState)).toEqual(["1"]);
    });

    it("returns both top contributors when there are two", () => {
      const G: Pick<GameState, "playerData"> = {
        playerData: {
          "0": {
            isAlive: true,
            contributions: 1,
            resources: 0,
            influence: 0,
            hasSkipped: true,
          },
          "1": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 0,
            hasSkipped: true,
          },
          "2": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 0,
            hasSkipped: true,
          },
        },
      };
      expect(getTopContributors(G as GameState)).toEqual(["1", "2"]);
    });
  });

  describe("getNextSeat", () => {
    it("returns correct number of seats", () => {
      expect(getNextSeat(0)).toBe(40);
      expect(getNextSeat(39)).toBe(40);
      expect(getNextSeat(49)).toBe(50);
      expect(getNextSeat(50)).toBe(60);
      expect(getNextSeat(59)).toBe(60);
      expect(getNextSeat(129)).toBe(130);
      expect(getNextSeat(130)).toBe(-1);
    });
  });

  describe("getPlayersToVoteOn", () => {
    it("returns correct number of players", () => {
      const G: Pick<GameState, "playerData" | "projectResources"> = {
        projectResources: 45,
        playerData: {
          "0": {
            isAlive: true,
            contributions: 1,
            resources: 0,
            influence: 2,
            hasSkipped: true,
          },
          "1": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 2,
            hasSkipped: true,
          },
          "2": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 3,
            hasSkipped: true,
          },
          "3": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 1,
            hasSkipped: true,
          },
          "4": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 2,
            hasSkipped: true,
          },
        },
      };

      expect(getPlayersToVoteOn(G as GameState)).toEqual(["0", "1", "4"]);
    });
  });
});
