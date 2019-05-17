require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

var player = require("play-sound")((opts = {}));

// Creates express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let cheers = [
  "Great job! :tada:",
  "Very cool and awesome! :cooldoge:",
  "Keep up the good work! :muscle:",
  "Nice work! You're amazing! :partyparrot:"
];

// route
app.post("/gong", (req, res) => {
  console.log(req.body);
  const { user_id, text } = req.body;

  if (text.match(/NEW_CHEER/)) {
    const newCheer = text.replace("NEW_CHEER", "").trim();
    cheers.push(newCheer);

    const response = {
      response_type: "ephemeral",
      text: `Thanks for the suggestion <@${user_id}>! Your cheer was added to the list.`,
      attachments: [
        {
          text: newCheer
        }
      ]
    };

    res.send(response);
  } else {
    const randomIndex = Math.floor(Math.random() * cheers.length);
    const randomCheer = cheers[randomIndex];

    const response = {
      response_type: "in_channel",
      text: `<@${user_id}>! ${randomCheer}`
    };

    res.send(response);
    player.play("gong.mp3");
  }
});

// The port used for Express server
const PORT = process.env.PORT || 3030;

// Starts server
app.listen(PORT, function() {
  console.log("Bot is listening on port " + PORT);
});
