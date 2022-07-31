import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div>
      {/* <div className="grayscale bg-transparent blur-sm bg-cover fixed top-0 bottom-0 left-0 right-0 z-[-1]"></div> */}
      <div className="w-screen h-screen flex">
        <div className="m-auto bg-slate-100">
          <div className="bg-caution w-full h-2"></div>
          <div className="px-5 text-center">
            <h1 className="my-5 text-6xl font-semibold uppercase tracking-wider ">
              We're&nbsp;&nbsp;Doomed!
            </h1>
            <p className="text-xl max-w-md m-auto">
              An browser-based party game where you race against others to save
              yourself from certain doom.
            </p>
            <p className="mt-4">Based off the board game</p>
            <div className="my-8 text-center">
              <Link
                className="focus:shadow-outline focus:outline-none shadow py-2 px-4 text-white rounded bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 font-bold"
                to="/lobby"
              >
                Jump in!
              </Link>
            </div>
          </div>
          <div className="bg-caution w-full h-2 mt-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
