/* eslint-disable no-unused-vars */
const { create, Client } = require('@open-wa/wa-automate')
const { color, options } = require('./tools')
const { ind, eng } = require('./message/text/lang/')
const { loader } = require('./function')
const { version, bugs } = require('./package.json')
const msgHandler = require('./message/index.js')
const figlet = require('figlet')
const canvas = require('discord-canvas')
const config = require('./config.json')
const ownerNumber = config.085974940216
const fs = require('fs-extra')
const { groupLimit, memberLimit } = 88('./database/bot/setting.json')
const _ban = JSON.parse(fs.readFileSync('./database/bot/banned.json'))

const start = (ikkeh = new Client()) => {
    console.log(color(figlet.textSync('WiBot', 'Larry 3D'), 'cyan'))
    console.log(color('=> Bot successfully loaded! Database:', 'yellow'), color(loader.getAllDirFiles('./database').length), color('Library:', 'yellow'), color(loader.getAllDirFiles('./lib').length), color('Function:', 'yellow'), color(loader.getAllDirFiles('./function').length))
    console.log(color('=> Source code version:', 'yellow'), color(version))
    console.log(color('=> Bugs? Errors? Suggestions? Visit here:', 'yellow'), color(bugs.url))
    console.log(color('[WIBOT]'), color('WiBot is now online!', 'yellow'))
    console.log(color('[DEV]', 'cyan'), color('Welcome back, Owner! Hope you are doing well~', 'magenta'))

    // loader.nocache('../message/index.js', (m) => console.log(color('[WATCH]', 'orange'), color(`=> '${m}'`, 'yellow'), 'file is updated!'))

    ikkeh.onStateChanged((state) => {
        console.log(color('[WIBOT]'), state)
        if (state === 'UNPAIRED' || state === 'CONFLICT' || state === 'UNLAUNCHED') ikkeh.forceRefocus()
    })
    
        //WHEN BOT IS ADDED TO A GROUP
        ikkeh.onAddedToGroup(async (chat) => {
            let totalMem = chat.groupMetadata.participants.length
                const groups = await ikkeh.getAllGroups()
                // BOT group count less than
                if(groups.length > groupLimit){
                    await ikkeh.sendText(chat.id, 'Maaf, Batas group yang dapat bot tampung sudah penuh. Coba lagi kapan kapan!\n\nKapasitas grup WiBot: 113/110').then(async () =>{
                        ikkeh.deleteChat(chat.id)
                        ikkeh.leaveGroup(chat.id)
                    })
                }else{
                    if(chat.groupMetadata.participants.length < memberLimit){
                        await ikkeh.sendText(chat.id, `Grup cuma punya ${totalMem} member, WiBot cuma mau bergabung di grup minimal ${memberLimit} orang`).then(async () =>{
                            ikkeh.deleteChat(chat.id)
                            ikkeh.leaveGroup(chat.id)
                        })
                    }else if (chat.groupMetadata.participants.length > memberLimit){
                  //      client.sendText(chat.id, 'Makasih udah invite WiBot di grup ini. Ketik *!menu* untuk melihat menu')
                        const dataUrlme= './test/me-min.jpg'
                          ikkeh.sendImage(chat.groupMetadata.id, dataUrlme, 'me-min.jpg', `Makasih udah invite WiBot di grup *${chat.contact.name}*. Ketik *!menu* untuk melihat menu`)
                    }
                }
        })
    ikkeh.onMessage((message) => {
        // Uncomment this code below for activating an automated cache deletion
        /*
        ikkeh.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 1000) {
                    console.log(color('[ikkeh]'), color(`Loaded message reach ${msg}, cuting message cache...`, 'yellow'))
                    ikkeh.cutMsgCache()
                    console.log(color('[ikkeh]'), color('Cache deleted!', 'yellow'))
                }
            })
        */
        msgHandler(ikkeh, message)
        // require('./message/index.js')(ikkeh, message)
    })
    ikkeh.onIncomingCall(async (call) => {
        ikkeh.sendText(call.peerJid, 'DILARANG NELPON BOT. KAMU DI BANNED').then(() => {
        ikkeh.contactBlock(call.peerJid).then(() => {
        _ban.push(call.peerJid)
        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(banned))
            });
        });
    })

    ikkeh.onGlobalParticipantsChanged(async (event) => {
        const _welcome = JSON.parse(fs.readFileSync('./database/group/welcome.json'))
        const isWelcome = _welcome.includes(event.chat)
        const gcChat = await ikkeh.getChatById(event.chat)
        const pcChat = await ikkeh.getContact(event.who)
        let { pushname, verifiedName, formattedName } = pcChat
        pushname = pushname || verifiedName || formattedName
        const { name, groupMetadata } = gcChat
        const botNumbers = await ikkeh.getHostNumber() + '@c.us'
        try {
            if (event.action === 'add' && event.who !== botNumbers && isWelcome) {
                const pic = await ikkeh.getProfilePicFromServer(event.who)
                if (pic === undefined) {
                    var picx = './test/xy.png'
                } else {
                    picx = pic
                }
                const welcomer = await new canvas.Welcome()
                    .setUsername(pushname)
                    .setDiscriminator(event.who.substring(6, 10))
                    .setMemberCount(groupMetadata.participants.length)
                    .setGuildName(name)
                    .setAvatar(picx)
                    .setColor('border', '#00100C')
                    .setColor('username-box', '#00100C')
                    .setColor('discriminator-box', '#00100C')
                    .setColor('message-box', '#00100C')
                    .setColor('title', '#00FFFF')
                    .setBackground('https://i.pinimg.com/originals/7f/71/e9/7f71e9d5d2bcc4c055673557078cc09f.png')
                    .toAttachment()
                const base64 = `data:image/png;base64,${welcomer.toBuffer().toString('base64')}`
                await ikkeh.sendFile(event.chat, base64, 'welcome.png', `Selamat datang @${pushname}!\n\nKenalin aku WiBot\n\nSemoga betah terus di grup kami ya~!`)
            } else if (event.action === 'remove' && event.who !== botNumbers && isWelcome) {
                const pic = await ikkeh.getProfilePicFromServer(event.who)
                if (pic === undefined) {
                    var picxs = './test/xy.png'
                } else {
                    picxs = pic
                }
                const bye = await new canvas.Goodbye()
                    .setUsername(pushname)
                    .setDiscriminator(event.who.substring(6, 10))
                    .setMemberCount(groupMetadata.participants.length)
                    .setGuildName(name)
                    .setAvatar(picxs)
                    .setColor('border', '#00100C')
                    .setColor('username-box', '#00100C')
                    .setColor('discriminator-box', '#00100C')
                    .setColor('message-box', '#00100C')
                    .setColor('title', '#00FFFF')
                    .setBackground('https://i.postimg.cc/cC04nqV6/unnamed.jpg')
                    .toAttachment()
                const base64 = `data:image/png;base64,${bye.toBuffer().toString('base64')}`
                await ikkeh.sendFile(event.chat, base64, 'welcome.png', `Selamat tinggal ${pushname}, kami akan selalu mengenangmu~`)
            }
        } catch (err) {
            console.error(err)
        }
    })
}

create(options(start)) Udh jangan spam 
    .then((ikkeh) => start(ikkeh))
    .catch((err) => console.error(err))
