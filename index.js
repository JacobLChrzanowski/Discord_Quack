// ##############################################################
// ##                                 /##` ###` ###`     ##  ## #
// ##  Jacob L. Chrzanowski           #  #  #    #      #  ## ##
// ##    Discord Bot and Quacker      ###   #    #       ##  #
// ##                                 #  \ ###   #      # ## 
// ########################################################

console.log("Starting...\n")

// ###############################################################
// User-set variables. VOICECHANNELS and TOKEN need to be changed.
//
// INTERVAL
//   the interval in milliseconds between attempts to invade a voice channel
const INTERVAL = 600000 // INTERVAL/1000/60 = Minutes ... 600000 ms = 10 minutes
// CHANCE
//   Every INTERVAL there is a 1/CHANCE chance of this bot invading a channel
const CHANCE = 5
// VOICECHANNELS
//   Predefined list of voice channels this bot is allowed to invade and quack into
const VOICECHANNELS = ["xxx", "xxx", "xxx"]
// TOKEN
//   Discord bot token
const TOKEN = 'xxx.xx.xxx'
// BOTID
//   Discord Bot ID
const BOTID = 'xxx'
// ###############################################################

const Discord = require('discord.js')
const Util = require('util')
const bot = new Discord.Client()
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
const vs = require('./voiceServer.js')
const fs = require('fs');

// vc instantiates a Discord voice-channel handling class
// vs() should only be called once, but it is not declared singleton -- because it's a bad practice?
//  https://softwareengineering.stackexchange.com/questions/40373/so-singletons-are-bad-then-what/218322#218322
//  I trust myself not to instantiate it twice.
let vc = new vs()
let channel





// deleteMsg
// Deletes a specified number of messages from a channel except from the list of passed usernames (helpful when testing commands and you spam a channel)
//
//  numToDel: number of messages to delete
//  channel: channel name to delete messages from
//  exclusions: (opt) string of name or list of names of 'authors' to ignore in delete operation
function deleteMsg(numToDel, channel, exclusions = []){
    // channel = bot.channels.find("name", channel)         // deprecated
    channel = bot.channels.find(x => x.name === channel)    // same thing
    if (typeof exclusions === 'string' || exclusions instanceof String){ // encapsulates string in a list if it's just a string
        exclusions = [exclusions]
    }

    channel.fetchMessages({limit: numToDel}).then(messages => {
        var lastMsg = 0
        messages.forEach(function(value, key) {
            // console.log(messages.get(key).author.username == 'Lukec436_Ziemniak')
            if (lastMsg == key){    // in case channel.fetchmessages fetches duplicate messages
                return              // because this is a function passed into forEach
            } else{
                lastMsg = key
            }

            for(var i = 0; i < exclusions.length; i++){
                // console.log(messages.get(key).author.username + " : " + exclusions[i])
                if (messages.get(key).author.username == exclusions[i]){
                    return  // stop looking at this message
                }
            }
            messages.get(key).delete(1000)
                .catch(console.error);
            // console.log("deleting " + messages.get(key).author.username + " : " + messages.get(key).content)
        })
        // messages[1].delete(1000)
    })
}

// random
// Returns a random float between low (inclusive) and high (exclusive)
//
//  low: minimum random float to return inclusive
//  high: maximum random float to return exclusive
function random(low, high) {
    return Math.random() * (high - low) + low
}

// timeString
// Returns date and time in format of "Mm/Dd/YYYY, Hh:Mm:Ss (A/P)M" and right-pads until it is 23 characters wide
//
function timeString(){
    var date = new Date()
    var current_hour = date.toLocaleString()
    current_hour = pad(current_hour, 23, 1, " ")
    return current_hour
}

// pad
// Pads a string to len length with char characters, direction customizable
//
//  string: variable to pad
//  len: length to pad string to
//  side: 0 for left, 1 for right (side to add padding on)
//  char: character to pad withj
function pad(string, len, direction, char = " "){
	if (direction) {
        while (string.length < len){
            string = string + char
        }
    }
    else {
    	while (string.length < len){
            string = char + string
        }
    }
    return string
}


// tempFunc
// Takes an integer chance variable, and may or may not invade a channel and play a honking sound
//
//  chance: upper bound given to a pseudo RNG that determines the odds that, when tempFunc is ran, it will invade a channel
//          i.e. you pass chance = 4, the RNG will run if it picks 0 from the range of integers [0, 4)
function tempFunc(chance, voiceChannels) {
    // console.log('...');
    var randInt = Math.floor(random(0,chance))
    console.log(timeString() + " || Random roll 0," + (chance-1) + ": " + randInt)
    if(randInt != 0){
        return
    }

    var files = [];
    fs.readdir("./Sounds/UGG-Honk", function(err, items) {
        // console.log(items);
     
        // Collects .ogg audio files from the audio file directory
        for (var i=0; i<items.length; i++) {
            // console.log(items[i]);
            if (items[i].slice(-4) == ".ogg")
                files.push(items[i])
            // var testMsg = new bot.Message
            // testMsg.member.voiceChannel = "xxx"
            // vc.join(message)
        }

        // voiceChannels is passed into this function after most recent refactor
        var voiceChannelstoInvade = []
        for (var i = 0; i < voiceChannels.length; i++){
            voiceChannels[i] = bot.channels.get(voiceChannels[i])
            if (voiceChannels[i].members.size > 0){
                voiceChannelstoInvade.push(voiceChannels[i])
            }
            console.log("                        || " + voiceChannels[i].name + " " + voiceChannels[i].members.size)
        }
        if (voiceChannelstoInvade.length == 0){ // Quit/don't attempt to invade if no one is online
            console.log("                        || No users online!")
            return
        }
        var channelNum = Math.floor(random(0, voiceChannelstoInvade.length))
        var fileNum = Math.floor(random(0, files.length))
        // console.log(voiceChannelstoInvade)
        // console.log(channels.get(key)["name"])
        // if ((channels.get(key)["name"]) == "General"){
            
        //     const channel = bot.channels.get(key)
        vc.quack(voiceChannelstoInvade[channelNum], files[fileNum])
        console.log("                        || Quacked " + files[fileNum] + " into " + voiceChannelstoInvade[channelNum].name)
    });
    // console.log(channels.get(key)["name"])
    // if ((channels.get(key)["name"]) == "General"){
        
    //     const channel = bot.channels.get(key)
    // vc.quack(channel, "Honk-glass1.ogg")
    
};




//
// Main purpose of this bot. After authenticating with Discord servers it will start a coroutine that runs every INTERVAL
bot.on('ready', function(){
    console.log("Attempts to honk once every " + INTERVAL/1000/60 + " minutes. 1/" + CHANCE + " chance to honk.")
    setInterval(tempFunc, INTERVAL, CHANCE, VOICECHANNELS)
    // TODO: Make it print how long it's been since a user was last in a voice chat.

})

//
// Optional part of this bot with some music/chat command functionality
// Waits for a message to arrive in any chat the bot has access to, then executes from there
bot.on('message', function(message){
    messageCont = message.content.toLowerCase()
    // console.log(message)

    if(message.author.id != BOTID){  // don't react to the bot's own messages
        // console.log(message.channel.name + " " + message.author.username + " '" + message.content + "'")
        // console.log(bot.guilds.get()) // Lists all discord servers bot is in
        console.log(Util.format("%s %s %s '%s'", message.channel.name.padEnd(20), message.author.username.padEnd(15), message.author.id, message.content))
        

        // This is an awful way to assign commands to functions, but pre-existing command libraries for
        //  Discord do not support voice channels. Using a dictionary with function calls would be better.
        //  Permissions also need implementation. (Should everyone be able to access this bot?)
        // 
        // i.e.
        //
        // dict[messageCont] = vc.join
        // (et al functions that can be referenced by a string, which in the future should be tokenized
        //   and so you can pass parameters)
        //
        // (below assumes error handling for non existent keys in dictionary, but this does work in JS)
        // dict[messageCont](message)
        // 
        if (messageCont == '-play'){
            vc.join(message)
        } else if (messageCont == '-stop'){
            vc.pause(message)
        } else if (messageCont == '-leave'){
            vc.leave(message)
        }
        if (messageCont == '-quack'){
            temp = bot.channels.get("674807894952116254");
            vc.quack(temp, "Honk4.ogg");
        }
        if(messageCont == "info"){
            message.reply("Info string to be implemented")
        }
    }
})

// Authenticates with Dicord's service as a bot and begins listening/invading voice channels
bot.login(TOKEN)