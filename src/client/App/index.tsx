import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Game from "./Game";
import GameLobby from "./GameLobby";

import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="lobby" element={<GameLobby />} />
        <Route path="/play/:matchId" element={<Game />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
