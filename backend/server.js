import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const port = process.env.PORT || 5000;
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://gamitar-peach.vercel.app"],
    credentials: true,
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static("backend/public"));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Server is ready"));

app.use(notFound);
app.use(errorHandler);

let onlineUsers = 0;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("userLoggedIn", ({ userId }) => {
    onlineUsers++;
    io.emit("userCountUpdated", onlineUsers);
    console.log(`User ${userId} logged in`);
  });

  socket.on("userLoggedOut", ({ userId }) => {
    onlineUsers--;
    io.emit("userCountUpdated", onlineUsers);
    console.log(`User ${userId} logged out`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

httpServer.listen(port, () => console.log(`Server started on port ${port}`));
