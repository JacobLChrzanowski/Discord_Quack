// ##############################################################
// ##                                 /##` ###` ###`     ##  ## #
// ##  Jacob L. Chrzanowski           #  #  #    #      #  ## ##
// ##    Discord Bot and Quacker      ###   #    #       ##  #
// ##                                 #  \ ###   #      # ## 
// ########################################################
//
// voiceServer: class that handles joining and playing audio streams in discord channels
//
//  Should only be instantiated once! (A bot cannot be in two channels on the same server at the same time.)
//
//  Has been tested to not cause errors no matter the order of commands you give it (if it is quacking
//  during a channel invade, and it's told to play another audio file, it will not crash)
//
class voiceServer{
    constructor(client){
        var dispatcher
    }

    // quack
    // Joins and plays speicifed audio file into a channel, and leaves when the file is done playing
    //
    //  channel: channel ID to join
    //  audiofile: name of audiofile to play from specified folder 
    async quack(channel, audiofile){
        channel.join()
            .then(connection =>{
                this.dispatcher = connection.playFile("./Sounds/UGG-Honk/" + audiofile)
                this.dispatcher.on("end", end =>{
                    channel.leave();
                    // channel.voiceConnection.disconnect();
                    // channel.disconnect();
                })
            })
            .catch(err => console.log(err))
    }

    // _joinAndPlay
    // Joins a channel and immediately begins to play a given audio file, Snippet.mp3 was a bit of copyright music that I did not include
    //
    //  channel: channel ID to join
    //  audiofile: name of audiofile to play from specified folder 
    async _joinAndPlay(message, sound){
        message.member.voiceChannel.join()
            .then(connection =>{
                // message.reply("Successfully joined!")
                if (sound == null){
                    this.dispatcher = connection.playFile('./Sounds/Snippet.mp3')
                } else{
                    this.dispatcher = connection.playFile('./' + sound)
                }
                this._reactTUP(message)
            })
    }

    // _reactTUP
    // Reacts to a given message with an emoji 'thumbs up'
    async _reactTUP(message){
        message.react('👍')
    }
    // _reactTDN
    // Reacts to a given message with an emoji 'thumbs down'
    async _reactTDN(message){
        message.react('👎')
    }

    // join
    // Handles joining a voice channel/passing audio filename to _joinAndPlay
    //
    //  channel: channel ID to join
    //  audiofile: (optional) name of audiofile to play from specified folder 
    async join(message, sound = null){
        // console.log(message.member.voiceChannel)
        if(typeof this.dispatcher !== 'undefined'){
            if (!this.dispatcher.destroyed){
                this.dispatcher.resume()
                this._reactTUP(message)
            } else{
                this._joinAndPlay(message, sound)
            }
        } else if (message.member.voiceChannel){
            this._joinAndPlay(message, sound)
        }else{
            // message.reply("You're not in a voice channel!")
            this._reactTDN(message)
        }
    }

    // pause
    // Pauses audio if it's playing in a voice channel
    //
    //  message: chat message to confirm/deny action
    async pause(message){
        if(typeof this.dispatcher !== 'undefined'){
            if(this.dispatcher.paused){
                this._reactTDN(message)
            } else{
                this.dispatcher.pause()
                this._reactTUP(message)
            }
            
        } else{
            this._reactTDN(message)
        }
    }

    // leave
    // If in a voice channel, leaves it
    //
    //  message: chat message to confirm/deny action
    async leave(message){
        if(typeof this.dispatcher !== 'undefined'){
            if (!this.dispatcher.destroyed){
                this.dispatcher.pause()
                this._reactTUP(message)
            } else{
                // this._joinAndPlay(message)
            }
        }
        
        if(message.guild.voiceConnection){
            message.guild.voiceConnection.disconnect()
            this._reactTUP(message)
        } else{
            // message.reply("Not currently in a voice chat!")
            this._reactTDN(message)
        }
    }
}

module.exports = voiceServer