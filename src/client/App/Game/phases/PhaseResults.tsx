import { Link } from "react-router-dom";
import { CommonProps } from "../types";

const PhaseResults = ({ G }: CommonProps) => {
  return (
    <div className="">
      <div className="text-4xl">Game Over</div>
      <div className="mt-4">Congratulations to </div>
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
