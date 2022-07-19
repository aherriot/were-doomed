import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/lobby">Go to the Lobby</Link>
    </div>
  );
};

export default Home;
