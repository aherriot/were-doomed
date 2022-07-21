import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Game from "./Game";
import GameLobby from "./GameLobby";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="lobby" element={<GameLobby />} />
        <Route path="/play/:matchId/:playerId" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
