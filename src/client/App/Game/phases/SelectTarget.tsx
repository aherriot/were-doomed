import React from "react";
import { getOtherAlivePlayers } from "../../../../shared/utils";
import { CommonProps } from "../types";

type SelectTargetProps = Omit<CommonProps, "moves">;

const SelectTarget = ({
  G,
  ctx,
  selectedTarget,
  setSelectedTarget,
}: SelectTargetProps) => {
  return (
    <div>
      <p>Select a target</p>
      <select
        value={selectedTarget ?? ""}
        onChange={(e) => setSelectedTarget(e.target.value)}
      >
        {getOtherAlivePlayers(G, ctx).map((playerId) => (
          <option key={playerId} value={playerId}>
            {playerId}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectTarget;
