const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buttons")
    .setDescription("buttons"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      const buttons = new ButtonBuilder()
      .setCustomId('1234')
      .setLabel('button1')
      .setEmoji('1️⃣')
      .setStyle(ButtonStyle.Primary)
      const button2 = new ButtonBuilder()
      .setCustomId('12345')
      .setLabel('button2')
      .setEmoji('2️⃣')
      .setStyle(ButtonStyle.Success)

      const actionRow = new ActionRowBuilder()
      .addComponents(buttons, button2)

      await interaction.reply({ components: [actionRow] })
    } catch (error) {
      console.error(error);
    }
  },
};