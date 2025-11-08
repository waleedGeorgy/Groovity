import express, { type NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import { createServer } from "http";
import cron from "node-cron";
import fs from "fs";
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

const tempFilesFolder = path.join(process.cwd(), "tmp");

cron.schedule("4 * * * *", () => {
  if (fs.existsSync(tempFilesFolder)) {
    fs.readdir(tempFilesFolder, (err, files) => {
      if (err) {
        console.log(err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempFilesFolder, file), (err) => {
          console.log(err);
        });
      }
    });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statsRoutes);

app.use((err: Error, req: any, res: any, next: NextFunction) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
  connectDB();
});
