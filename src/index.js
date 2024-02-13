async function BuildIndex() {
  const { Client, GatewayIntentBits } = require("discord.js");
  const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
  });
  module.exports.Client = client;

  const { Run } = require('./functions/Build')
  Run(client)

  client.login(process.env.TOKEN);

  process.on("uncaughtException", (error) => {
    return console.error(error);
  });

  process.on("uncaughtExceptionMonitor", (error) => {
    return console.error(error);
  });

  process.on("unhandledRejection", (error) => {
    return console.error(error);
  });

  process.on("rejectionHandled", (error) => {
    return console.error(error);
  });
}

module.exports = { BuildIndex };
