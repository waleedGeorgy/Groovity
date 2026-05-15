import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import { createServer } from "http";
import cron from "node-cron";
import fs from "fs";
import rateLimit from "express-rate-limit";
import { connectDB } from "./lib/db.ts";
import { initializeSocket } from "./lib/socket.ts";
import userRoutes from "./routes/user.route.ts";
import authRoutes from "./routes/auth.route.ts";
import adminRoutes from "./routes/admin.route.ts";
import songRoutes from "./routes/song.route.ts";
import albumRoutes from "./routes/album.route.ts";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;
const __dirname = path.resolve();

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const server = createServer(app);
initializeSocket(server);

app.use(express.json({ limit: "15mb" }));
app.use(clerkMiddleware());
app.use(limiter);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 15 * 1024 * 1024,
    },
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
  }),
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const tempFilesFolder = path.join(process.cwd(), "tmp");

cron.schedule("2 * * * *", () => {
  if (fs.existsSync(tempFilesFolder)) {
    fs.readdir(tempFilesFolder, (err, files) => {
      if (err) {
        console.log(err);
        throw new Error(err.message);
      }
      for (const file of files) {
        fs.unlink(path.join(tempFilesFolder, file), (err) => {
          throw new Error(err?.message);
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
  connectDB();
});
