const client = require("../../index").Client;

module.exports = {
  name: "/",
  async run(req, res) {
    delete require.cache[require.resolve("../views/index.ejs")];

    let args = {
      TotalUsers: client.users.cache.size,
      TotalGuilds: client.guilds.cache.size,
    };

    res.render("../Dashboard/views/index.ejs", args);
  },
};
