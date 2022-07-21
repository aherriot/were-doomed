import { Server } from "boardgame.io/server";
import path from "path";
import serve from "koa-static";
import game from "../shared/game";

const server = Server({
  games: [game],
  origins: ["*"],
});
const PORT = Number(process.env.PORT || 8000);

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, "../../build");
server.app.use(serve(frontEndAppBuildPath));

server.run(PORT, () => {
  server.app.use(async (ctx, next) => {
    return await serve(frontEndAppBuildPath)(
      Object.assign(ctx, { path: "index.html" }),
      next
    );
  });
});

// Define clean-up method.
const HOUR = 60 * 60 * 1000;
const cleanStaleMatches = async () => {
  // Retrieve matchIDs for matches unchanged for > 2 hour.
  const staleMatchIDs = await server.db.listMatches({
    where: {
      updatedBefore: Date.now() - 2 * HOUR,
    },
  });

  for (const id of staleMatchIDs) {
    server.db.wipe(id);
  }
};

// Schedule clean-up.
setInterval(cleanStaleMatches, HOUR);
