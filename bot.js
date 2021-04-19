require("dotenv").config();
const Discord = require("discord.js");
const { OpusEncoder } = require("@discordjs/opus");

const client = new Discord.Client();
const guild = client.guild;

var user = []; //storing our users here
var botTextChannel = null; //text channel we will use to write messages too

client.on("ready", () => {
  //once its ready it will call the callback function
  console.log(`logged in as ${client.user.tag}!`);
});

//hide the token
client.login(process.env.TOKEN);

//We handle Messages like commands or we look for a particular pharase
client.on("message", async (msg) => {
  //once we receive a message we will reply wiht pong
  if (msg.content === "!guild") {
    msg.reply(`guild is ${msg.guild}`);
  }

  if (msg.author.bot) return;

  //Helps the user by letting them know of the commands
  if (msg.content === "!assit") {
    msg.reply(
      "Yes Hello I am a bot that will play an intro song for you \n" +
        "$set: will include you one my stalker list \n" +
        "$settc: will set the text channel where I will send messages to"
    );
  }

  //Test Message
  if (msg.content === "your a bot") {
    if (msg.member.voice.channel) {
      const conneection = await msg.member.voice.channel.join();
      msg.reply(`STFU I am not a bot I am ${msg.member.user}`);
    } else {
      msg.reply("You need to join a voice channel first!");
    }
  }

  //Sets the user who initiated the command to be tracked by the bot
  if (msg.content === "$set") {
    let curUser = msg.member.user;
    if (!user.includes(curUser)) user.push(curUser);
    else
      user.forEach((element) => {
        msg.reply(`${element} is in the DB`);
      });
  }
  //sets the text channel for our bot to send messages int
  if (msg.content === "$settc") {
    botTextChannel = msg.channel;
    msg.reply(`Channel ID set to ${botTextChannel}`);
    // console.log(botTextChannel);
  }
});

//function handles users leaving and entering a voice channel
client.on("voiceStateUpdate", (oldMember, newMember) => {
  let newchannelID = newMember.channelID;
  let oldChannelID = oldMember.channelID;
  let newUserChannel = client.channels.cache.get(newchannelID); // newMember.channelID;
  let oldUserChannel = client.channels.cache.get(oldChannelID); // newMember.channelID;

  //console.log(`NewMember: ${newUserChannel} oldMember: ${oldUserChannel}`);
  //console.log(newMember);

  if (oldUserChannel === undefined && newUserChannel !== undefined) {
    //user joined voice channel
    console.log("Joined vc with user " + newMember.member.user.username);

    //join the voice channel
    const connection = newUserChannel.join();

    console.log(
      newMember.member.user.username + " Has Joined " + newMember.channel.name
    );
    if (botTextChannel != null && botTextChannel != "") {
      client.channels.cache
        .get(botTextChannel.id)
        .send(`${newMember.member.user} has joned: ${newUserChannel}`);
    } else {
      console.log("No Text Channel is set");
    }
  } //user left voice channel
  else if (newUserChannel === undefined) {
    // User leaves a voice channel
    console.log(
      oldMember.member.user.username + " Has Left  " + oldMember.channel.name
    );
    if (botTextChannel != null && botTextChannel != "") {
      client.channels.cache
        .get(botTextChannel.id)
        .send(`${oldMember.member.user} has left: ${oldUserChannel}`);
    }
  }
});
