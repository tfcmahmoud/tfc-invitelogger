let wait = require('./sleep')
let invites = new Map()

async function inviteLogger(client) {
    client.on('ready', async() => {
        await wait(2000);


            client.guilds.cache.forEach(async g => {
                const fInvite = await g.invites.fetch().catch(err => {
                    if (err !== 50013) return
                })
                try {
                    invites.set(g.id, new Map(fInvite.map(invite => [invite.code, invite.uses])))
                } catch (err) {
                    if (err) return
                }
            })
    })
    
    client.on('inviteDelete', invite => {
        invites.get(invite.guild.id).delete(invite.code)
    })

    client.on('inviteCreate', invite => {
        invites.get(invite.guild.id).set(invite.code, invite.uses)
    })

    client.on('guildCreate', guild => {
        guild.invites.fetch().then(guildInvites => {
            invites.set(guild.id, new Map(guildInvites.map(invite => [invite.code, invite.uses])))
        }).catch(err => {
            if (err !== 50013) return
        })
    })

    client.on('guildDelete', guild => {
        invites.delete(guild.id)
    })

    client.on('guildMemberAdd', async member => {
        if (member.user.bot) return
        const { guild, user } = member
        guild.invites.fetch().then(async newInvites => {
            const oldInvites = invites.get(guild.id)
            const invite = newInvites.find(i => i.uses > oldInvites.get(i.code))
            if (!invite) return
            let inviter = client.users.cache.get(invite.inviter.id)
            if (!inviter) inviter = 'Vanity URL'
            client.emit("inviteLogger", member, invite, inviter)
        }).catch(err => {
            if (err !== 50013) return
        })
     })
    }

module.exports = inviteLogger;
