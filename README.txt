##############################################################
##                                 /##` ###` ###`     ##  ## #
##  Jacob L. Chrzanowski           #  #  #    #      #  ## ##
##    Discord Bot and Quacker      ###   #    #       ##  #
##                                 #  \ ###   #      # ## 
########################################################

This Discord bot's main purpose is to join active channels in your discord server and quack into them, in the
spirit of the acclaimed Indie game, Untitled Goose Game. Included are goose quack samples from the game, and
extra bits of code I used during the testing process and kept around because they can still come in handy.
Some chat commands support playing one pre-assigned .ogg encoded song. This feature was never fleshed out b/c
nobody in my server wanted chat features.

The only bot permissions needed to get the quack feature working are under 'Voice Permissions':
    Connect and Speak (Permissions Integer 3145728)
By not giving this bot any text chat permission, you also hide it from the server roster, meaning people won't
know it's been added to the server... It's great fun when people start asking who (or what) just made that
noise and left. You can't disable Discord's join notification sound, since it's a security feature to prevent
snooping.

All audio files begin and trail with dead air to allow the join sound, and Discord's auto gating to finish
before any audio plays. Most quack noises are so short that without this dead air, they would get cut off or
never be heard in the first place. It also avoids the race condition where if a sound is short enough, your
bot tries to leave a channel before Discord has verified you even joined a channel in the first place.
Also, the discord.js library I used had a broken volume feature, meaning all audio clips had to have their
volume raised in Audacity.

To get the bot working, you need to...
- Provide a Discord bot API key to TOKEN in index.js
- Add channel IDs to VOICECHANNELS in index.js (the bot will try to join these)
- (Optional for chat support) Add ID of bot to BOTID in index.js
- Add the bot to a server with correct permissions (only Admins of servers can do this)
- ffmpeg is required in the root directory to play audio into a Discord voice channel
- Install Node.js libraries:
--- discord.js
--- util
--- fs

index.js is the main runnable Node.js file
voiceServer.js handles connecting/playing sound into voice channels