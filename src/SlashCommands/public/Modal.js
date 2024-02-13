const { SlashCommandBuilder, ChatInputCommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modal")
    .setDescription("Modal Submit"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const NewModal = new ModalBuilder()
    .setCustomId('nmodal')
    .setTitle("New Modal")

    const NewTextField = new TextInputBuilder()
    .setCustomId('favtext')
    .setLabel("What's your favorite color?")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Red, Orange, Blue")
    .setMinLength(1)
    .setMaxLength(4)
    .setRequired(true)

    const NewTextField2 = new TextInputBuilder()
    .setCustomId('hp')
    .setLabel("What's your favorite hoppy?")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("hoppy")
    .setMinLength(1)
    .setMaxLength(10)
    .setRequired(true)

    const row = new ActionRowBuilder().addComponents(NewTextField)
    const row2 = new ActionRowBuilder().addComponents(NewTextField2)

    NewModal.addComponents(row, row2)

    await interaction.showModal(NewModal)
  },
};