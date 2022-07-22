import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div>
      <div className="grayscale blur-sm bg-home-lg bg-cover fixed top-0 bottom-0 left-0 right-0 z-[-1]"></div>
      <div className="w-screen h-screen flex">
        <div className="m-auto bg-slate-100/40">
          <div className="bg-caution w-full h-3"></div>
          <div className="px-5">
            <h1 className="my-5 text-7xl font-semibold text-black drop-shadow">
              We're Doomed!
            </h1>
            <p className="text-black text-xl font-semibold max-w-md">
              An online party game where you race against others to save
              yourself from certain doom.
            </p>
            <div className="text-right">
              <Link
                className="my-5 text-black rounded border-black border-4 text-xl bg-yellow-500 font-bold px-10 py-2 inline-block hover:bg-yellow-600 focus:bg-yellow-600"
                to="/lobby"
              >
                Jump in!
              </Link>
            </div>
          </div>
          <div className="bg-caution w-full h-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
