import { SlashCommandBuilder } from "@discordjs/builders";
import { getRandomMemeBySubReddit } from "../api/memeApi.js";
import { MessageAttachment } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("get_meme")
    .setDescription("Get random meme by subreddit")
    .addStringOption((option) =>
      option
        .setName("subreddit")
        .setDescription("Enter subreddit")
        .setRequired(true)
    ),
  async execute(interaction: any) {
    const input = interaction.options.getString("subreddit");
    const res: any = await getRandomMemeBySubReddit(input);
    const attachment = new MessageAttachment(res.url);
    await interaction.channel.send({ content: res.title, files: [attachment] });
  },
};
