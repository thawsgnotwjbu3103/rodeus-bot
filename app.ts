import dotenv from "dotenv";
import express from "express";
import { Client, Collection, Intents } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import fs from "fs";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

export default class RodeusClient extends Client {
  commands: Collection<unknown, any>;
  constructor(options: any) {
    super(options);
    this.commands = new Collection();
  }

  async load() {
    this.login(process.env.TOKEN);
    this.handlingCommands();
    await this.registerCommand();
    this.handlingEvents();
  }

  handlingCommands() {
    const commandsPath = "./src/commands/";
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

    commandFiles.forEach(async (file) => {
      const filePath = commandsPath + file;
      const command = await this.importFile(filePath);
      if ("data" in command && "execute" in command) {
        this.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    });
  }

  handlingEvents() {
    this.once("ready", (c) => {
      console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    this.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;
      const command = this.commands.get(interaction.commandName);
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    });
  }

  async registerCommand() {
    const commands = [];
    const commandFiles = fs
      .readdirSync("./src/commands/")
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const command = await this.importFile(`./src/commands/${file}`);
      commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    try {
        console.log(
          `Started refreshing ${commands.length} application (/) commands.`
        );

        const data:any = await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID),
          { body: commands }
        );

        console.log(
          `Successfully reloaded ${data.length} application (/) commands.`
        );
      } catch (error) {
        console.error(error);
      }
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }
}

const client = new RodeusClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
  ],
});

client.load();
app.listen(port);
