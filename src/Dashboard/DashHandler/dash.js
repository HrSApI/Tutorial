const client = require("../../index").Client;

module.exports = {
  name: "/dash",
  async run(req, res, next) {
    delete require.cache[require.resolve("../views/dash.ejs")];

    let args = {
      TotalUsers: client.users.cache.size,
      TotalGuilds: client.guilds.cache.size,
    };

    res.render("../Dashboard/views/dash.ejs", args);
  },
};
