# TFC Invite Logger

### Installation⭐
```
npm i tfc-invitelogger@latest
```

### Usage✨
```js
const tfcinvitelogger = require('tfc-invitelogger')
const Discord = require('discord.js')
const { Intents } = require('discord.js')
const client = new Discord.Client({ intents: 32767 })
tfcinvitelogger.inviteLogger(client)


client.on("inviteLogger", (member, invite, inviter) => {
    let channelID = 'Channel Id Here!'
    let channel = member.guild.channels.cache.get(channelID)
    if (!channel) return
    channel.send(`The Member **${member.user.tag}** Was Invited By **${inviter.tag}** Using Invite Code **${invite.code}** With Uses Of **${invite.uses}**`)
})
```