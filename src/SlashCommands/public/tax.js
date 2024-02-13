const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tax")
    .setDescription("Calculate Tax")
    .addNumberOption((option) =>
      option.setName("tax").setDescription("Calculate Tax").setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const tax = options.getNumber("tax");
    const int = parseInt(tax);

    if (isNaN(int)) {
      return interaction.reply({ content: `❌ Error: It Must be a number` });
    }

    if (int < 1) {
      return interaction.reply({
        content: `❌ Error: The Number must be larger than 1`,
      });
    }

    if (int === 1) {
      return interaction.reply({ content: `🧮 The Final Cost Is: 1` });
    }

    const finalcost = Math.floor((int * 20) / 19 + 1);

    return interaction.reply({
      content: `** 🧮 The Final Cost Is: __${finalcost}__ **`,
    });
  },
};
