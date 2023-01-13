import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client, Intents, Collection } from "discord.js";

export default class RodeusClient extends Client {
  commands: Collection<unknown, any>;
  constructor(options: any) {
    super(options);
    this.commands = new Collection();
  }

  start() {

  }

  registerCommands() {
    const commands = [
        {
          name: "ping",
          description: "Replies with Pong!",
        },
      ];

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    (async () => {
      try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
          body: commands,
        });
        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    })();
  }

  loadClient() {
    this.on("ready", () => {
      console.log(`Logged in as ${this.user.tag}!`);
    });
    
    this.on("interactionCreate", async (interaction: any) => {
      if (!interaction.isCommand()) return;
    
      if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
      }
    });
    
    this.login(process.env.TOKEN);
  }
};


