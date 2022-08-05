import { Link } from "react-router-dom";
import NameList from "../../components/NameList";
import { CommonProps } from "../types";

const PhaseResults = ({ G, playerInfoById }: CommonProps) => {
  const winners = G.endGame.winners.map(
    (playerId) => playerInfoById[playerId].name ?? ""
  );
  return (
    <div className="text-center">
      <div className="text-4xl mt-5">Game Over</div>
      {winners.length > 0 && (
        <div className="mt-4">
          Congratulations to <NameList>{winners}</NameList> for escaping the
          planet.
        </div>
      )}
      {winners.length === 0 && (
        <div className="mt-4">No one escaped the planet.</div>
      )}
      <div className="mt-5">
        <Link
          className="focus:shadow-outline focus:outline-none shadow py-2 px-4 text-white rounded bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 font-bold"
          to="/lobby"
        >
          Return to Lobby
        </Link>
      </div>
    </div>
  );
};

export default PhaseResults;
