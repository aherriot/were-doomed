// import React, { useState } from "react";
import { Client } from "boardgame.io/react";
import Board from "./Board";
import WereDoomed from "../WereDoomed";

import "./App.css";

const App = Client({ game: WereDoomed, board: Board });

export default App;
