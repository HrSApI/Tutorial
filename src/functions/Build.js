const {
  REST,
  Collection,
  ApplicationCommandType,
  Events,
  Routes,
} = require("discord.js");
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const { readdirSync } = require("node:fs");
const ascii = require("ascii-table");
const SlashTable = new ascii("SlashCommands").setJustify();
const EventsTable = new ascii("Events").setJustify();
const path = require("path");
const { connect, set } = require("mongoose");
const MongoDBURL = process.env.MONGO_URL;

// =======-> Database
async function connectToDatabase() {
  try {
    await connect(MongoDBURL).then(async (connection) => {
      await console.log(
        `🟢 | MongoDB connected as ${connection.connections[0].name}`
      );
    });
  } catch (error) {
    console.log(`🔴 | Unable to connect to MongoDB!`);
    console.error(error);
  }
}

// =======-> Slash Commands
async function SlashCommandEvent(client) {
  const commands = [];
  client.commands = new Collection();
  const commandsDir = path.join(__dirname, "../SlashCommands");

  readdirSync(commandsDir).forEach((folder) => {
    const commandFile = readdirSync(path.join(commandsDir, folder)).filter(
      (file) => file.endsWith(".js")
    );
    for (const file of commandFile) {
      const command = require(path.join(commandsDir, folder, file));
      if (command.name && command.description) {
        commands.push({
          type: ApplicationCommandType.ChatInput,
          name: command.name,
          description: command.description,
          options: command.options || [],
        });
        client.commands.set(command.name, command);
        SlashTable.addRow(`/${command.name}`, "🟢 Working");
      } else if (command.data?.name && command.data?.description) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
        SlashTable.addRow(`/${command.data.name}`, "🟢 Working");
      } else {
        SlashTable.addRow(file, "🔴 Not Working");
      }
    }
  });
  console.log(SlashTable.toString());

  client.once(Events.ClientReady, async (c) => {
    try {
      const data = await rest.put(Routes.applicationCommands(c.user.id), {
        body: commands,
      });
      await console.log(
        `🟢 | Started refreshing ${commands.length} application (/) commands.`
      );
      await console.log(
        `🟢 | Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  });
}

// =======-> Events
async function EventsHandler(client) {
  const eventDir = path.join(__dirname, "../events");
  readdirSync(eventDir).forEach((folder) => {
    const eventFiles = readdirSync(path.join(eventDir, folder)).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of eventFiles) {
      const event = require(path.join(eventDir, folder, file));
      if (event.name) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
        EventsTable.addRow(event.name, "🟢 Working");
      } else {
        EventsTable.addRow(file, "🔴 Not working");
      }
    }
  });
  console.log(EventsTable.toString());
}

// =======-> Express
async function Express(client) {
  const express = require("express");
  const app = express();
  const cookieParser = require("cookie-parser");
  const bodyParser = require("body-parser");
  const WebTable = new ascii("Website").setJustify();
  // Login
  const session = require("express-session");
  const passport = require("passport");
  var DiscordStrategy = require("passport-discord").Strategy;

  app.enable("trust proxy");
  app.set("etag", false);
  app.set("views", __dirname);
  app.set("view engine", "ejs");
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "../Dashboard")));
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(bodyParser.json());

  // passport Config
  app.use(
    session({
      secret:
        "Tutorial#asjdkasassa1!##@!#!#$#@!#(*#(@!#!@HSJJJJAAAAAAASKJDKLSJAJLDLKAL",
      resave: false,
      saveUninitialized: false,
      name: "Tutorial2023Website",
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/callback",
        scope: ["identify", "guilds"],
      },
      async (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  const dashDir = path.join(__dirname, "../Dashboard");
  const files = readdirSync(path.join(dashDir, "DashHandler")).filter((f) =>
    f.endsWith(".js")
  );
  files.forEach((f) => {
    try {
      const file = require(path.join(dashDir, "DashHandler", f));
      if (file && file.name && file.run) {
        app.get(file.name, file.run);
        if (file.run2) {
          app.post(file.name, file.run2);
        }
        WebTable.addRow(file.name, "🟢 Working");
      } else {
        WebTable.addRow(file.name, "🔴 Not working");
      }
    } catch (error) {
      console.error(`Failed to load file ${f}:`, error);
      WebTable.addRow(f, "🔴 Not working");
    }
  });
  console.log(WebTable.toString());

  app.listen(3000, () => {
    console.log(`Connected To Link: http://localhost:3000`);
  });
}

// =======-> Run to Build the environment
async function Run(client) {
  connectToDatabase();
  SlashCommandEvent(client);
  EventsHandler(client);
  Express(client);
}

module.exports = { EventsHandler, SlashCommandEvent, connectToDatabase, Run };
