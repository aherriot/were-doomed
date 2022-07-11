import { ReactElement, useState } from "react";
import BroadcastIcon from "../icons/BroadcastIcon";
import BullhornIcon from "../icons/BullhornIcon";
import GunIcon from "../icons/GunIcon";
import SkullIcon from "../icons/SkullIcon";
import WrenchIcon from "../icons/WrenchIcon";
import { CommonProps } from "../types";
import SelectTarget from "./SelectTarget";

const PhaseAction = ({
  G,
  ctx,
  moves,
  selectedTarget,
  setSelectedTarget,
}: CommonProps): ReactElement => {
  const [confirmNuke, setConfirmNuke] = useState<boolean>(false);

  if (confirmNuke) {
    return (
      <div>
        <p>Are you sure you want to nuke {selectedTarget}?</p>
        <button onClick={() => moves.nuke(selectedTarget)}>Confirm</button>
        <button onClick={() => setConfirmNuke(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="PhaseAction">
      <h1>Action</h1>
      <SelectTarget
        G={G}
        ctx={ctx}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
      />
      <div className="actions">
        <button className="action produce" onClick={() => moves.contribute()}>
          <WrenchIcon />
          <div className="description">
            <div className="title">Produce</div>
            <div className="details">Gain 2 resources</div>
          </div>
        </button>
        <button
          className="action indoctrinate"
          onClick={() => moves.indoctrinate()}
        >
          <BroadcastIcon />
          <div className="description">
            <div className="title">Indoctrinate</div>
            <div className="details">Gain 1 influence</div>
          </div>
        </button>
        <button
          className="action propagandize"
          onClick={() => moves.propagandize()}
        >
          <BullhornIcon />
          <div className="description">
            <div className="title">Propagandize</div>
            <div className="details">
              Spend 1 resource to steal 1 influence from another player
            </div>
          </div>
        </button>
        <button className="action invade" onClick={() => moves.invade()}>
          <GunIcon />
          <div className="description ">
            <div className="title">Invade</div>
            <div className="details">
              Spend 2 influence to steal 1 resource from another player.
            </div>
          </div>
        </button>
        <button className="action nuke" onClick={() => setConfirmNuke(true)}>
          <SkullIcon />
          <div className="description nuke">
            <div className="title">Nuke</div>
            <div className="details">
              Spend 8 resources to eleminate another player from the game
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PhaseAction;
