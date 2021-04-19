require("dotenv").config();
const Discord = require("discord.js");
const {OpusEncoder} = require('@discordjs/opus')

const client = new Discord.Client();
const guild = client.guild;
//const member = guild.members.cache.get("UserID");

var user = [];
var botTextChannel;

client.on("ready", () => {
  //once its ready it will call the callback function
  console.log(`logged in as ${client.user.tag}!`);
});

//hide the token
client.login(process.env.TOKEN);

client.on("message", async (msg) => {
  //once we receive a message we will reply wiht pong
  if (msg.content === "!guild") {
    msg.reply(`guild is ${msg.guild}`);
  }

  if (msg.author.bot) return;

  if (msg.content === "!assit") {
    msg.reply(
      "Yes Hello I am a bot that will play an intro song for you \n" +
      "$set: will include you one my stalker list \n" +
      "$settc: will set the text channel where I will send messages to"
    );
  }

  if (msg.content === "your a bot") {
    if (msg.member.voice.channel) {
      const conneection = await msg.member.voice.channel.join();
      msg.reply(`STFU I am not a bot I am ${msg.member.user}`);
    } else {
      msg.reply("You need to join a voice channel first!");
    }
  }

  if(msg.content === "$set"){
    let curUser = msg.member.user
    if(!user.includes(curUser))
      user.push(curUser)
    else
      user.forEach(element => {
        msg.reply(`${element} is in the DB`)
        
      });
  }

  if(msg.content === '$settc'){
    botTextChannel = msg.channel;
    msg.reply(`Channel ID set to ${botTextChannel}`);
   // console.log(botTextChannel);
  }
});

// client.on('voiceStateUpdate', async (oldState, newState) => {
//   let newUserChannel = newState.voiceChannel;
//   let oldUserChannel = oldState.voiceChannel;
//   console.log(`${newUserChannel}  ${oldUserChannel}`);

//   if (oldUserChannel === undefined && newUserChannel !== undefined) {
//     //user joines  a voice channel
//     const conneection = newUserChannel.join(); //msg.member.voice.channel.join()
//     client.reply("someone joined");
//   } else if (newUserChannel === undefined) {
//     //user leavesa a voice channel
//   }
// });

client.on('voiceStateUpdate', (oldMember, newMember) => {
  let newchannelID = newMember.channelID
  let oldChannelID = oldMember.channelID
  let newUserChannel = client.channels.cache.get(newchannelID)// newMember.channelID;
  let oldUserChannel = client.channels.cache.get(oldChannelID)// newMember.channelID;

  //console.log(`NewMember: ${newUserChannel} oldMember: ${oldUserChannel}`);
 // console.log(newMember);

  
  if(oldUserChannel === undefined && newUserChannel !== undefined) //don't remove ""
  { 
    // User Joins a voice channel
    //console.clear();
    //console.log("Joined vc with id "+newUserChannel);
    console.log(`${newUserChannel}  ${oldUserChannel}`);
    const connection = newUserChannel.join();
    if(botTextChannel !== '' || botTextChannel !== undefined){
      if(botTextChannel != null){
        client.channels.cache.get(botTextChannel.id).send(`${newMember.member.user} has joned: ${newUserChannel}`);
      }
      else
      {
        console.log("No Voice Channel is set");
      }
    }
      
  }
  else if(newUserChannel === undefined){
      // User leaves a voice channel
      console.log("Left vc");
      client.channels.cache.get(botTextChannel.id).send(`${oldMember.member.user} has left: ${oldUserChannel}`);
  }
});
