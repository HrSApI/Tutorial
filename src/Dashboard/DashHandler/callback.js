const client = require("../../index").Client;
const passport = require("passport");

module.exports = {
  name: "/callback",
  run: async (req, res, next) => {
    if (client) {
      passport.authenticate(
        "discord",
        { failureRedirect: "/" },
        (err, user) => {
          if (err) {
            console.error(err);
            return;
          }

          if (!user) {
            return res.redirect("/");
          }

          req.logIn(user, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            // User is authenticated
            res.redirect("/dash");
          });
        }
      )(req, res, next);
    } else {
      console.error("Client object is null");
    }
  },
};
