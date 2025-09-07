import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import { createServer } from "http";
import { connectDB } from "./lib/db.ts";
import { initializeSocket } from "./lib/socket.ts";
import userRoutes from "./routes/user.route.ts";
import authRoutes from "./routes/auth.route.ts";
import adminRoutes from "./routes/admin.route.ts";
import songRoutes from "./routes/song.route.ts";
import albumRoutes from "./routes/album.route.ts";
import statsRoutes from "./routes/stats.route.ts";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;
const __dirname = path.resolve();

const app = express();

const server = createServer(app);

initializeSocket(server);

app.use(express.json({ limit: "10mb" }));
app.use(clerkMiddleware());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statsRoutes);
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
  connectDB();
});
