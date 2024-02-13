const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js");
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require("@discordjs/voice");
var pathToFfmpeg = require('ffmpeg-static');
console.log(pathToFfmpeg);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Voice Settings")
    .addSubcommand((subcommand) => subcommand.setName('join').setDescription('Join Voice Channel'))
    .addSubcommand((subcommand) => subcommand.setName('play').setDescription('Play Any Sound'))
    .addSubcommand((subcommand) => subcommand.setName('pause').setDescription('Pause Sound'))
    .addSubcommand((subcommand) => subcommand.setName('stop').setDescription('Stop the sound'))
    .addSubcommand((subcommand) => subcommand.setName('leave').setDescription('Leave Voice Channel')),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      const { options } = interaction;

      if (options.getSubcommand() === 'join') {
        if (!interaction.member.voice.channel) {
          return await interaction.reply({ content: `**❌ You must be in a voice channel to use this command!**`, ephemeral: true });
        }

        const existingConnection = getVoiceConnection(interaction.guildId);
        if (existingConnection) {
          return await interaction.reply({ content: `**🤔 The bot is already in a voice channel.**`, ephemeral: true });
        }

        const connection = joinVoiceChannel({
          channelId: interaction.member.voice.channel.id,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        await interaction.reply({ content: `**📲 Joined: ${interaction.member.voice.channel.toString()}**`, ephemeral: true });
      } else if (options.getSubcommand() === 'play') {
        const url = 'رابط الصوت حقك';

        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
          return await interaction.reply({ content: `**🤔 The bot is not in a voice channel.**`, ephemeral: true });
        }

        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
          },
        });

        const resource = createAudioResource(url);
        player.play(resource);

        connection.subscribe(player);
        await interaction.reply({ content: `**▶️ Playing Audio**`, ephemeral: true });
      } else if (options.getSubcommand() === 'pause') {
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
          return await interaction.reply({ content: `**🤔 The bot is not in a voice channel.**`, ephemeral: true });
        }

        const player = connection.state.subscription.player;
        player.pause();

        await interaction.reply({ content: `**⏸️ Audio Paused**`, ephemeral: true });
      } else if (options.getSubcommand() === 'stop') {
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
          return await interaction.reply({ content: `**🤔 The bot is not in a voice channel.**`, ephemeral: true });
        }

        const player = connection.state.subscription.player;
        player.stop();

        await interaction.reply({ content: `**⏹️ Audio Stopped**`, ephemeral: true });
      } else if (options.getSubcommand() === 'leave') {
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
          return await interaction.reply({ content: `**❌ The bot is not in a voice channel.**`, ephemeral: true });
        }

        await interaction.reply({ content: `**📞 Left the voice channel**`, ephemeral: true });
        connection.destroy();
      }
    } catch (error) {
      console.error(error);
    }
  },
};
