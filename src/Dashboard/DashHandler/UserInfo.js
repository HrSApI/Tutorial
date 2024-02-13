module.exports = {
  name: "/us",
  async run(req, res) {
    if (req.user) {
      return res.json({ data: req.user });
    } else {
      return res.json({ data: "Not Authenicated" });
    }
  },
};
