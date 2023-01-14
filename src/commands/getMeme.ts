import { SlashCommandBuilder } from "@discordjs/builders";
import { getRandomMeme } from "../api/memeApi.js";
import { MessageAttachment } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Get random meme"),
  async execute(interaction: any) {
    const res: any = await getRandomMeme();
    const attachment = new MessageAttachment(res.url);
    await interaction.channel.send({ content: res.title, files: [attachment] });
  },
};
