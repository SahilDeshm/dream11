import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';
import { userRouter } from "./routes/users.js";
import { team_router } from "./routes/team.js";
import { LeaderboardRouter } from "./routes/leaderboard.js";
import dotenv from 'dotenv'

dotenv.config();
const PORT  = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

const db_url = process.env.DATABASE_URL;

mongoose.connect(db_url)
    .then(() => {
        console.log(`DB connected`);
    }).catch((err) =>
        console.log(`DB connection failed${err}`));

app.use("/auth", userRouter);
app.use("/team_page", team_router);
app.use("/my_teams", LeaderboardRouter);

app.listen(PORT, () => console.log("SERVER STARTED!"));