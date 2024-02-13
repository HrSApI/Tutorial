module.exports = {
  name: "/login",
  async run(req, res) {
    await res.redirect("/callback");
  },
};
