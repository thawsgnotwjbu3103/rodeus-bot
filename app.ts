import dotenv from "dotenv";
import express from "express";
import RodeusClient from "./src/Client";
import { Intents } from "discord.js";

dotenv.config();
const app = express();

const client = new RodeusClient({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
        Intents.FLAGS.GUILD_INTEGRATIONS
    ]
})

client.start();

app.listen(3000)