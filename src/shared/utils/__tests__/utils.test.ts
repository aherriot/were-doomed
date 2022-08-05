import {
  getNextSeat,
  getPlayersToVoteOn,
  getTopContributors,
  getVotesPerPlayer,
} from "..";
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
            government: "democracy",
          },
          "1": {
            isAlive: true,
            contributions: 0,
            resources: 0,
            influence: 0,
            hasSkipped: true,
            government: "democracy",
          },
          "2": {
            isAlive: true,
            contributions: 0,
            resources: 0,
            influence: 0,
            hasSkipped: true,
            government: "democracy",
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
            government: "democracy",
          },
          "1": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 0,
            hasSkipped: true,
            government: "democracy",
          },
          "2": {
            isAlive: true,
            contributions: 0,
            resources: 0,
            influence: 0,
            hasSkipped: true,
            government: "democracy",
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
            government: "democracy",
          },
          "1": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 0,
            hasSkipped: true,
            government: "democracy",
          },
          "2": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 0,
            hasSkipped: true,
            government: "democracy",
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
    it("returns list of tied players", () => {
      const G: Pick<GameState, "playerData" | "projectResources"> = {
        projectResources: 55,
        playerData: {
          "0": {
            isAlive: true,
            contributions: 1,
            resources: 0,
            influence: 2,
            hasSkipped: true,
            government: "democracy",
          },
          "1": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 2,
            hasSkipped: true,
            government: "democracy",
          },
          "2": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 3,
            hasSkipped: true,
            government: "democracy",
          },
          "3": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 1,
            hasSkipped: true,
            government: "democracy",
          },
          "4": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 2,
            hasSkipped: true,
            government: "democracy",
          },
        },
      };

      const { winners, candidates, seatsRemaining } = getPlayersToVoteOn(
        G as GameState
      );

      expect(winners).toEqual(["2"]);
      expect(candidates).toEqual(["0", "1", "4"]);
      expect(seatsRemaining).toBe(1);
    });

    it("returns none when there is not enough seats for anyone", () => {
      const G: Pick<GameState, "playerData" | "projectResources"> = {
        projectResources: 0,
        playerData: {
          "0": {
            isAlive: true,
            contributions: 1,
            resources: 0,
            influence: 2,
            hasSkipped: true,
            government: "democracy",
          },
          "1": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 2,
            hasSkipped: true,
            government: "democracy",
          },
        },
      };

      const { winners, candidates, seatsRemaining } = getPlayersToVoteOn(
        G as GameState
      );
      expect(winners).toEqual([]);
      expect(candidates).toEqual([]);
      expect(seatsRemaining).toEqual(0);
    });

    it("returns all three when there is a three way tie for first", () => {
      const G: Pick<GameState, "playerData" | "projectResources"> = {
        projectResources: 55,
        playerData: {
          "0": {
            isAlive: true,
            contributions: 1,
            resources: 0,
            influence: 2,
            hasSkipped: true,
            government: "democracy",
          },
          "1": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 2,
            hasSkipped: true,
            government: "democracy",
          },
          "2": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 2,
            hasSkipped: true,
            government: "democracy",
          },
        },
      };

      const { winners, candidates, seatsRemaining } = getPlayersToVoteOn(
        G as GameState
      );

      expect(winners).toEqual([]);
      expect(candidates).toEqual(["0", "1", "2"]);
      expect(seatsRemaining).toBe(2);
    });

    it("returns empty array when everyone can fit", () => {
      const G: Pick<GameState, "playerData" | "projectResources"> = {
        projectResources: 105,
        playerData: {
          "0": {
            isAlive: true,
            contributions: 1,
            resources: 0,
            influence: 3,
            hasSkipped: true,
            government: "democracy",
          },
          "1": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 2,
            hasSkipped: true,
            government: "democracy",
          },
          "2": {
            isAlive: true,
            contributions: 2,
            resources: 0,
            influence: 1,
            hasSkipped: true,
            government: "democracy",
          },
        },
      };

      const { winners, candidates, seatsRemaining } = getPlayersToVoteOn(
        G as GameState
      );

      expect(winners).toEqual(["0", "1", "2"]);
      expect(candidates).toEqual([]);
      expect(seatsRemaining).toBe(4);
    });
  });

  describe("getVotesPerPlayer", () => {
    it("returns correct number of votes", () => {
      expect(
        getVotesPerPlayer(["1", "2", "3"], ["4", "5", "6"], {
          "1": ["4"],
          "2": ["5", "4"],
          "3": [],
          "4": ["4"],
          "5": ["5", "4"],
          "6": ["6"],
        })
      ).toEqual({ "4": 4, "5": 2, "6": 1 });
    });
  });
});
