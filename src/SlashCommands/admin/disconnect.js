const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  // تعريف بنية الأمر
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDescription("Use the command to disconnect the user from the voice")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Select member to disconnect him.")
        .setRequired(true)
    ),

  /**
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */

  // تنفيذ الأمر
  async execute(interaction, client) {
    // دالة لإرسال الرسائل
    async function sendMessage(message) {
      // إنشاء Embed
      let messagesEmbed = new EmbedBuilder().setDescription(`**${message}**`);

      // إرسال الرد
      await interaction.reply({ embeds: [messagesEmbed] });
    }

    // تجربة الامر قبل التنفيذ
    try {
      // اختصار كتابة (interaction.user.id || interaction.options.get)
      const { options, user } = interaction;

      // الحصول على العضو المحدد
      const memberOption = options.getMember("member") || user;

      // التحقق مما إذا كان العضو موجوداً وفي قناة صوتية
      if (!memberOption || !memberOption.voice.channel) {
        return await sendMessage(
          "⚠️ | Member not found or Member not in a voice channel!"
        );
      }

      // لا يمكن للمشرف لمستخدم الامر طرد نفسه من الروم (اذا تبي تشيلها عادي مو اجباري تحطها)
      else if (memberOption.id === user.id) {
        return await sendMessage("⚠️ | You cannot disconnect yourself");
      }

      // فصل العضو عن القناة الصوتية
      await memberOption.voice.disconnect().then(async () => {
        await sendMessage(
          `✅ | ${memberOption.user.username} has been disconnected successfully`
        );
      });
    } catch (error) {
      // معالجة الأخطاء وإرسال رسالة الخطأ
      await sendMessage(`❌ | Error: ${error.message}`);
    }
  },
};
