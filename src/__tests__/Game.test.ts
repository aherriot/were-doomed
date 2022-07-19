import { getNumberOfSeats } from "../shared/utils";

describe("getNumberOfSeats", () => {
  it("should return 0 for 10", () => {
    expect(getNumberOfSeats(10)).toBe(0);
  });

  it("should return 1 for 40", () => {
    expect(getNumberOfSeats(40)).toBe(1);
  });

  it("should return 2 for 50", () => {
    expect(getNumberOfSeats(50)).toBe(2);
  });

  it("should return 9 for 125", () => {
    expect(getNumberOfSeats(125)).toBe(9);
  });

  it("should return 10 for 130 or more", () => {
    expect(getNumberOfSeats(200)).toBe(10);
  });
});
