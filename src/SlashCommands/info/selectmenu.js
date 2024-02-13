const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("selectmenu")
    .setDescription("selectmenu"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      const selectmenu = new StringSelectMenuBuilder()
      .setCustomId('select')
      .setPlaceholder('Nothing Selected')
      .setMinValues(0)
      .setMaxValues(2)
      .addOptions(
        { label: "op1", value: "op1", description: "Desc for op1", emoji: "1️⃣" },
        { label: "op2", value: "op2", description: "Desc for op2", emoji: "2️⃣" },
        { label: "op3", value: "op3", description: "Desc for op3", emoji: "3️⃣" },
      )

      const Row = new ActionRowBuilder().addComponents(selectmenu)

      await interaction.reply({ components: [Row] }).then(async() => {

        const Collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000,
        })

        Collector.on('collect', async(collected) => {
            const value = collected.values;
            let selected = [];

            if(value.includes('op1')) {
                const content = 'op1'
                selected.push(content);
            } if(value.includes('op2')) {
                const content = 'op2'
                selected.push(content);
            } if(value.includes('op3')) {
                const content = 'op3'
                selected.push(content);
            }

            try {
                if(selected.length > 0) {
                    await interaction.reply({ content: `Selected ${selected.map(op => op.name).join(", ")}` })
                }
            } catch (error) {
                return;
            }
        })
      })
    } catch (error) {
      console.error(error);
    }
  },
};