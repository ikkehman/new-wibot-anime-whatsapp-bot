/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable no-irregular-whitespace */

/**
 * This source code below is free, please DO NOT sell this in any form!
 * Source code ini gratis, jadi tolong JANGAN jual dalam bentuk apapun!
 *
 * If you copying one of our source code, please give us CREDITS. Because this is one of our hardwork.
 * Apabila kamu menjiplak salah satu source code ini, tolong berikan kami CREDIT. Karena ini adalah salah satu kerja keras kami.
 *
 * If you want to contributing to this source code, pull requests are always open.
 * Apabila kamu ingin berkontribusi ke source code ini, pull request selalu kami buka.
 *
 * Thanks for the contributions.
 * Terima kasih atas kontribusinya.
 */

/********** MODULES **********/
const { decryptMedia, Client } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const config = require('../config.json')
const Nekos = require('nekos.life')
const neko = new Nekos()
const os = require('os')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const api = new API()
const sagiri = require('sagiri')
const NanaAPI = require('nana-api')
const nana = new NanaAPI()
const bdr = require('rumus-bdr')
const fetch = require('node-fetch')
const isPorn = require('is-porn')
const exec = require('await-exec')
const webp = require('webp-converter')
const sharp = require('sharp')
const saus = sagiri(config.nao, { results: 5 })
const axios = require('axios')
const urlShortener = require('../lib/shortener.js')
const tts = require('node-gtts')
const nekobocc = require('nekobocc')
const ffmpeg = require('fluent-ffmpeg')
const bent = require('bent')
const path = require('path')
const ms = require('parse-ms')
const toMs = require('ms')
const Jimp = require('jimp')
const  request = require('request')
const canvas = require('canvacord')
const mathjs = require('mathjs')
const emojiUnicode = require('emoji-unicode')
const moment = require('moment-timezone')
const translate = require('@vitalets/google-translate-api')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const google = require('google-it')
const cron = require('node-cron')
/********** END OF MODULES **********/

/********** UTILS **********/
const { msgFilter, color, processTime, isUrl, createSerial } = require('../tools')
const { nsfw, weeaboo, downloader, fun, misc, toxic } = require('../lib')
const { uploadImages } = require('../tools/fetcher')
const { fetchJson, getBuffer } = require('../tools/fetcher')
const { ind, eng } = require('./text/lang/')
const { daily, level, register, afk, reminder, premium, limit} = require('../function')
const Exif = require('../tools/exif')
const exif = new Exif()
const cd = 4.32e+7
const limitCount = 25
const errorImg = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const tanggal = moment.tz('Asia/Jakarta').format('DD-MM-YYYY')
/********** END OF UTILS **********/

/********** DATABASES **********/
const _nsfw = JSON.parse(fs.readFileSync('./database/group/nsfw.json'))
const _antilink = JSON.parse(fs.readFileSync('./database/group/antilink.json'))
const _antinsfw = JSON.parse(fs.readFileSync('./database/group/antinsfw.json'))
const _leveling = JSON.parse(fs.readFileSync('./database/group/leveling.json'))
const _welcome = JSON.parse(fs.readFileSync('./database/group/welcome.json'))
const _autosticker = JSON.parse(fs.readFileSync('./database/group/autosticker.json'))
const _ban = JSON.parse(fs.readFileSync('./database/bot/banned.json'))
const _premium = JSON.parse(fs.readFileSync('./database/bot/premium.json'))
const _mute = JSON.parse(fs.readFileSync('./database/bot/mute.json'))
const _registered = JSON.parse(fs.readFileSync('./database/bot/registered.json'))
const _level = JSON.parse(fs.readFileSync('./database/user/level.json'))
let _limit = JSON.parse(fs.readFileSync('./database/user/limit.json'))
const _afk = JSON.parse(fs.readFileSync('./database/user/afk.json'))
const _reminder = JSON.parse(fs.readFileSync('./database/user/reminder.json'))
const _daily = JSON.parse(fs.readFileSync('./database/user/daily.json'))
const _setting = JSON.parse(fs.readFileSync('./database/bot/setting.json'))
let { memberLimit, groupLimit } = _setting
/********** END OF DATABASES **********/

/********** MESSAGE HANDLER **********/
// eslint-disable-next-line no-undef
module.exports = msgHandler = async (ikkeh = new Client(), message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        const author = sender.id
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName
        const botNumber = await ikkeh.getHostNumber() + '@c.us'
        const blockNumber = await ikkeh.getBlockedIds()
        const ownerNumber = config.ownerBot
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await ikkeh.getGroupAdmins(groupId) : ''
        const time = moment(t * 1000).format('DD/MM/YY HH:mm:ss')

        const chats = (type === 'chat') ? body : ((type === 'image' || type === 'video')) ? caption : ''
        const prefix = config.prefix
        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const ask = body.toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const uaOverride = config.uaOverride
        const q = args.join(' ')
        const ar = args.map((v) => v.toLowerCase())
        const url = args.length !== 0 ? args[0] : ''
        const supp = '\nYuk dukung Wibot untuk beli server baru biar ga lag lagi. Donasi ke https://saweria.co/ikkehman'

        /********** VALIDATOR **********/
        const isCmd = body.startsWith(prefix)
        const isBlocked = blockNumber.includes(sender.id)
        const isOwner = sender.id === ownerNumber
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isBanned = _ban.includes(sender.id)
        const isPremium = premium.checkPremiumUser(sender.id, _premium)
        const isRegistered = register.checkRegisteredUser(sender.id, _registered)
        const isNsfw = isGroupMsg ? _nsfw.includes(groupId) : false
        const isWelcomeOn = isGroupMsg ? _welcome.includes(groupId) : false
        const isDetectorOn = isGroupMsg ? _antilink.includes(groupId) : false
        const isLevelingOn = isGroupMsg ? _leveling.includes(groupId) : false
        const isAutoStickerOn = isGroupMsg ? _autosticker.includes(groupId) : false
        const isAntiNsfw = isGroupMsg ? _antinsfw.includes(groupId) : false
        const isMute = isGroupMsg ? _mute.includes(chat.id) : false
        const isAfkOn = afk.checkAfkUser(sender.id, _afk)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
        const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
        const isImage = type === 'image'
        const isVideo = type === 'video'
        /********** END OF VALIDATOR **********/

        // Automate
        premium.expiredCheck(_premium)
        cron.schedule('0 0 * * *', () => {
            const reset = []
            _limit = reset
            console.log('Resetting user limit...')
            fs.writeFileSync('./database/user/limit.json', JSON.stringify(_limit))
            console.log('Success!')
        }, {
            scheduled: true,
            timezone: 'Asia/Jakarta'
        })

        // Anti-group link detector
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isDetectorOn && !isOwner) {
            if (chats.match(new RegExp(/(https:\/\/chat.whatsapp.com)/gi))) {
                const valid = await ikkeh.inviteInfo(chats)
                if (valid) {
                    console.log(color('[KICK]', 'red'), color('Received a group link and it is a valid link!', 'yellow'))
                    await ikkeh.reply(from, ind.linkDetected(), id)
                    await ikkeh.removeParticipant(groupId, sender.id)
                } else {
                    console.log(color('[WARN]', 'yellow'), color('Received a group link but is not a valid link!', 'yellow'))
                }
            }
        }

        // Anti-fake-group link detector
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isDetectorOn && !isOwner) {
            if (chats.match(new RegExp(/(https:\/\/chat.(?!whatsapp.com))/gi))) {
                console.log(color('[KICK]', 'red'), color('Received a fake group link.', 'yellow'))
                await ikkeh.reply(from, 'Fake group link detected!', id)
                await ikkeh.removeParticipant(groupId, sender.id)
            }
        }

        // Anti NSFW link
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiNsfw && !isOwner) {
            if (isUrl(chats)) {
                const classify = new URL(isUrl(chats))
                console.log(color('[FILTER]', 'yellow'), 'Checking link:', classify.hostname)
                isPorn(classify.hostname, async (err, status) => {
                    if (err) return console.error(err)
                    if (status) {
                        console.log(color('[NSFW]', 'red'), color('The link is classified as NSFW!', 'yellow'))
                        await ikkeh.reply(from, ind.linkNsfw(), id)
                        await ikkeh.removeParticipant(groupId, sender.id)
                    } else {
                        console.log(('[NEUTRAL]'), color('The link is safe!'))
                    }
                })
            }
        }

        // Auto-sticker
        if (isGroupMsg && isAutoStickerOn && isMedia && isImage && !isCmd) {
            const mediaData = await decryptMedia(message, uaOverride)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            await ikkeh.sendImageAsSticker(from, imageBase64)
            console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
        }

        // AFK by Slavyan
        if (isGroupMsg) {
            for (let ment of mentionedJidList) {
                if (afk.checkAfkUser(ment, _afk)) {
                    const getId = afk.getAfkId(ment, _afk)
                    const getReason = afk.getAfkReason(getId, _afk)
                    const getTime = afk.getAfkTime(getId, _afk)
                    await ikkeh.reply(from, ind.afkMentioned(getReason, getTime), id)
                }
            }
            if (afk.checkAfkUser(sender.id, _afk) && !isCmd) {
                _afk.splice(afk.getAfkPosition(sender.id, _afk), 1)
                fs.writeFileSync('./database/user/afk.json', JSON.stringify(_afk))
                await ikkeh.sendText(from, ind.afkDone(pushname))
            }
        }
        
        // AUTO REPLY by Piyo >_<
        
        if (chats == 'hai') {
            if (!isGroupMsg) await ikkeh.reply(from, `Halo Kak, Untuk Memulai bot silahkan ketik ${prefix}menu`, id)
        }
        
        if (chats == 'hay') {
            if (!isGroupMsg) await ikkeh.reply(from, `Halo Kak, Untuk Memulai bot silahkan ketik ${prefix}menu`, id)
        }
        
        if (chats == 'halo') {
            if (!isGroupMsg) await ikkeh.reply(from, `Halo Kak, Untuk Memulai bot silahkan ketik ${prefix}menu`, id)
        }
        
        if (chats == '@WiBot by IkkehMan') {
            await ikkeh.reply(from, `Halo Kak, ada yg bisa WiBot bantu? Silahkan ketik ${prefix}menu`, id)
        }

        if (chats == '@+65xxx') {
            await ikkeh.reply(from, `Halo Kak, ada yg bisa WiBot bantu? Silahkan ketik ${prefix}menu`, id)
        }
        
        if (chats == '@65xxx') {
            await ikkeh.reply(from, `Halo Kak, ada yg bisa WiBot bantu? Silahkan ketik ${prefix}menu`, id)
        }

        // Mute
        if (isCmd && isMute && !isGroupAdmins && !isOwner && !isPremium) return
        
        // Ignore banned and blocked users
        if (isCmd && (isBanned || isBlocked) && !isGroupMsg) return console.log(color('[BAN]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && (isBanned || isBlocked) && isGroupMsg) return console.log(color('[BAN]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))

        // Anti-spam
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) return await ikkeh.reply(from, '*[ANTI-SPAM]*\nTunggu 5 detik atau anda akan di BLOK', id)
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) return console.log(color('[SPAM]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))

        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) return await ikkeh.reply(from, '*[ANTI-SPAM]*\nSabar!! Tunggu 5 detik atau anda akan di BLOK', id)
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) return console.log(color('[SPAM]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))

        // Log
        if (isCmd && !isGroupMsg) {
            console.log(color('[CMD]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
            await ikkeh.sendSeen(from)
        }
        if (isCmd && isGroupMsg) {
            console.log(color('[CMD]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))
            await ikkeh.sendSeen(from)
        }
        if (!isCmd && !isGroupMsg) {
            console.log(color('[CHAT]'), color(time, 'yellow'), color(`${ask}`), 'from', color(pushname), 'in', color(name || formattedTitle))
            await ikkeh.sendSeen(from)
        }

        // Anti-spam
        if (isCmd && !isPremium && !isOwner) msgFilter.addFilter(from)

        switch (command) {
            //Menu
            case 'menu':
            case 'help':
                if (isGroupMsg) {
                    await ikkeh.sendText(from, ind.menu(pushname))
                } else {
                    await ikkeh.sendText(from, ind.dewe(pushname))
                }
            break

            //Admin Menu
            case 'adminmenu':
                    await ikkeh.sendText(from, ind.adminmenu(pushname))
            break

            case 'imgmenu':
            case 'imagemenu':
                    await ikkeh.sendText(from, ind.imgmenu(pushname))
            break
            // Register by Slavyan
            case 'registerx':
                if (isRegistered) return await ikkeh.reply(from, ind.registeredAlready(), id)
                if (isGroupMsg) return await ikkeh.reply(from, ind.pcOnly(), id)
                if (!q.includes('|')) return await ikkeh.reply(from, ind.wrongFormat(), id)
                const namaUser = q.substring(0, q.indexOf('|') - 1)
                const umurUser = q.substring(q.lastIndexOf('|') + 2)
                const serialUser = createSerial(20)
                if (Number(umurUser) >= 40) return await ikkeh.reply(from, ind.ageOld(), id)
                register.addRegisteredUser(sender.id, namaUser, umurUser, time, serialUser, _registered)
                await ikkeh.reply(from, ind.registered(namaUser, umurUser, sender.id, time, serialUser), id)
                console.log(color('[REGISTER]'), color(time, 'yellow'), 'Name:', color(namaUser, 'cyan'), 'Age:', color(umurUser, 'cyan'), 'Serial:', color(serialUser, 'cyan'))
            break

            // Bot
            case 'rules':
            case 'rule':
                await ikkeh.sendText(from, ind.rules())
            break
            case 'nsfw':
            const nsfwimg = './test/nsfw-min.jpg'
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                if (ar[0] === 'aktif') {
                    if (isNsfw) return await ikkeh.reply(from, ind.nsfwAlready(), id)
                    _nsfw.push(groupId)
                    fs.writeFileSync('./database/group/nsfw.json', JSON.stringify(_nsfw))
                    ikkeh.sendImage(chat.groupMetadata.id, nsfwimg, 'nsfw-min.jpg', `NSFW mode ON di grup *${chat.contact.name}*. Sekarang kalian bisa akses menu NSFW. Untuk mematikan ketik *!nsfw nonaktif*`, id)
                } else if (ar[0] === 'nonaktif') {
                    _nsfw.splice(groupId, 1)
                    fs.writeFileSync('./database/group/nsfw.json', JSON.stringify(_nsfw))
                    await ikkeh.reply(from, ind.nsfwOff(), id)
                } else {
                    await ikkeh.reply(from, 'Format salah. Gunakan *!nsfw aktif/nonaktif*', id)
                }
            break
            case 'status':
                //await ikkeh.sendText(from, `*RAM*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem / 1024 / 1024)} MB\n*CPU*: ${os.cpus()[0].model}`)
                await ikkeh.sendText(from, `*RAM*: 16 MB / ${Math.round(os.totalmem / 1024 / 1024)} MB\n*CPU*: ${os.cpus()[0].model}`)
            break

            case 'daftar':
            case 'register':
                //await ikkeh.sendText(from, `*RAM*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem / 1024 / 1024)} MB\n*CPU*: ${os.cpus()[0].model}`)
                await ikkeh.reply(from, 'Kamu ga perlu daftar. WiBot bisa langsung dipakai tanpa daftar 😊', id)
            break

            case 'listblock':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                let block = ind.listBlock(blockNumber)
                for (let i of blockNumber) {
                    block += `@${i.replace('@c.us', '')}\n`
                }
                await ikkeh.sendTextWithMentions(from, block)
            break
            case 'runtime': // BY HAFIZH
                const formater = (seconds) => {
                    const pad = (s) => {
                        return (s < 10 ? '0' : '') + s
                    }
                    const hrs = Math.floor(seconds / (60 * 60))
                    const mins = Math.floor(seconds % (60 * 60) / 60)
                    const secs = Math.floor(seconds % 60)
                    return ' ' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs)
                }
                const uptime = process.uptime()
                await ikkeh.reply(from, `── *「 BOT UPTIME 」* ──\n\n ❏${formater(uptime)}`, id)
            break
            case 'delete':
            case 'del':
                if (!quotedMsg) return await ikkeh.reply(from, 'Reply !delete pada pesan yang ingin wibot hapus', id)
                if (!quotedMsgObj.fromMe) return await ikkeh.reply(from, 'Hanya bisa menghapus pesan dari WiBot', id)
                await ikkeh.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
            case 'report':
                if (!q) return await ikkeh.reply(from, ind.emptyMess(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const lastReport = daily.getLimit(sender.id, _daily)
                if (lastReport !== undefined && cd - (Date.now() - lastReport) > 0) {
                    const time = ms(cd - (Date.now() - lastReport))
                    await ikkeh.reply(from, ind.daily(time), id)
                } else {
                    if (isGroupMsg) {
                        await ikkeh.sendText(ownerNumber, `-----[ REPORT ]-----\n\n*From*: ${pushname}\n*ID*: ${sender.id}\n*Group*: ${(name || formattedTitle)}\n*Message*: ${q}`)
                        await ikkeh.reply(from, ind.received(pushname), id)
                    } else {
                        await ikkeh.sendText(ownerNumber, `-----[ REPORT ]-----\n\n*From*: ${pushname}\n*ID*: ${sender.id}\n*Message*: ${q}`)
                        await ikkeh.reply(from, ind.received(pushname), id)
                    }
                    daily.addLimit(sender.id, _daily)
                }
            break
            case 'join':
                if (!isUrl(url) && !url.includes('chat.whatsapp.com')) return await ikkeh.reply(from, ind.wrongFormat(), id)
                const checkInvite = await ikkeh.inviteInfo(url)
                if (isOwner) {
                    await ikkeh.joinGroupViaLink(url)
                    await ikkeh.reply(from, ind.ok(), id)
                    await ikkeh.sendText(checkInvite.id, `Hello!! I was invited by ${pushname}`)
                } else {
                    const getGroupData = await ikkeh.getAllGroups()
                    if (getGroupData.length >= groupLimit) {
                        await ikkeh.reply(from, `Invite refused. Max group is: ${groupLimit}`, id)
                    } else if (getGroupData.size <= memberLimit) {
                        await ikkeh.reply(from, `Invite refused. Minimum member is: ${memberLimit}`, id)
                    } else {
                        if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                        limit.addLimit(sender.id, _limit, isPremium, isOwner)
                        await ikkeh.joinGroupViaLink(url)
                        await ikkeh.reply(from, ind.ok(), id)
                        await ikkeh.sendText(checkInvite.id, `Hello!! I was invited by ${pushname}`)
                    }
                }
            break
            case 'premiumcheck':
            case 'cekpremium':
                if (!isPremium) return await ikkeh.reply(from, ind.notPremium(), id)
                const cekExp = ms(premium.getPremiumExpired(sender.id, _premium) - Date.now())
                await ikkeh.reply(from, `*「 PREMIUM EXPIRE 」*\n\n➸ *ID*: ${sender.id}\n➸ *Premium left*: ${cekExp.days} day(s) ${cekExp.hours} hour(s) ${cekExp.minutes} minute(s)`, id)
            break
            case 'premiumlist':
            case 'listpremium':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                let listPremi = '「 *PREMIUM USER LIST* 」\n\n'
                const deret = premium.getAllPremiumUser(_premium)
                const arrayPremi = []
                for (let i = 0; i < deret.length; i++) {
                    const checkExp = ms(premium.getPremiumExpired(deret[i], _premium) - Date.now())
                    arrayPremi.push(await ikkeh.getContact(premium.getAllPremiumUser(_premium)[i]))
                    listPremi += `${i + 1}. wa.me/${premium.getAllPremiumUser(_premium)[i].replace('@c.us', '')}\n➸ *Name*: ${arrayPremi[i].pushname}\n➸ *Expired*: ${checkExp.days} day(s) ${checkExp.hours} hour(s) ${checkExp.minutes} minute(s)\n\n`
                }
                await ikkeh.reply(from, listPremi, id)
            break
            case 'limit':
                if (isPremium || isOwner) return await ikkeh.reply(from, '⤞ Limit left: ∞ (UNLIMITED)', id)
                await ikkeh.reply(from, `Sisa Penggunaan: ${limit.getLimit(sender.id, _limit, limitCount)} / ${limitCount}\n\n*_Limit direset pada pukul 00:00 WIB_* \n \n Dapatkan UNLIMITED dengan donasi ke https://saweria.co/ikkehman` , id)
            break

            // Weeb zone
            case 'neko':
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await ikkeh.reply(from, ind.wait(), id)
                console.log('Getting neko image...')
                await ikkeh.sendFileFromUrl(from, (await neko.sfw.neko()).url, 'neko.jpg', '', null, null, true)
                    .then(() => console.log('Success sending neko image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await ikkeh.reply(from, 'Error!', id)
                    })
            break
            case 'kemono':
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await ikkeh.reply(from, ind.wait(), id)
                console.log('Getting kemonomimi image...')
                await ikkeh.sendFileFromUrl(from, (await neko.sfw.kemonomimi()).url, 'kemono.jpg', '', null, null, true)
                    .then(() => console.log('Success sending kemonomimi image!'))
                    .catch(async (err) => {
                        console.error(err)
                        await ikkeh.reply(from, 'Error!', id)
                    })
            break
            case 'anibatch':
                if (!q) return await ikkeh.reply(from, 'Format salah! masukan kata pencarian misalnya *!anibatch re zero*', id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await ikkeh.reply(from, ind.wait(), id)
                weeaboo.anime(q)
                    .then(async ({ info, link_dl, sinopsis, thumb, title, error, status }) => {
                        if (status === false) {
                            return await ikkeh.reply(from, error, id)
                        } else {
                            let animek = `${title}\n\n${info}\n\nSinopsis: ${sinopsis}\n\nLink download:\n${link_dl}`
                            await ikkeh.sendFileFromUrl(from, thumb, 'animek.jpg', animek, null, null, true)
                                .then(() => console.log('Success sending anime info!'))
                        }
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await ikkeh.reply(from, 'Dalam perbaikan!!', id)
                    })
            break

//sds
            case 'wait':
            const dataUrlw= './test/tutor.jpeg'
                if (isMedia && isImage || isQuotedImage) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    try {
                        const imageLink = await uploadImages(mediaData, `sauce.${sender.id}`)
                        request('https://api.trace.moe/search?anilistInfo&url='+ imageLink, function (error, response, body) {
const data = JSON.parse(body);

var isi = data.result[0];
if (isi.isAdult == true) {
    var hen = 'Ini Anime Hentai';
} else {
    var hen = 'Ini Bukan Hentai';
}
var teks = `*Judul Anime*: ${isi.anilist.title.native}
*Judul Romaji*: ${isi.anilist.title.romaji} 
*Episode*: ${isi.episode}
*Kemiripan*: ${(isi.similarity * 100).toFixed(1)}%
*Hentai?*:${isi.isAdult}`
var video = isi.image;
ikkeh.sendFileFromUrl(from, video, 'anime.jpg', teks, id).catch(() => {
ikkeh.reply(from, teks, id)})
});
                    } catch (err) {
                        console.error(err)
                        console.error(imageLink)
                        await ikkeh.reply(from, 'Error!', id)
                    }
                } else {
                    await ikkeh.sendImage(from, dataUrlw, 'tutor.jpeg', `Maaf format salah\n\nSilahkan kirim gambar dengan caption ${prefix}wait atau reply dengan caption ${prefix}wait`, id)
                }
            break
//ssf

//new sauce
case 'source':
case 'sauce':
    const dataUrl1= './test/x.jpeg'
        if (isMedia && isImage || isQuotedImage) {
            if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
            limit.addLimit(sender.id, _limit, isPremium, isOwner)
            await ikkeh.reply(from, ind.wait(), id)
            const encryptMedia = isQuotedImage ? quotedMsg : message
            const mediaData = await decryptMedia(encryptMedia, uaOverride)
            try {
                const imageLink = await uploadImages(mediaData, `sauce.${sender.id}`)
                request('https://saucenao.com/search.php?db=999&output_type=2&testmode=1&numres=1&api_key=aba222eb501940e4c86031dcd93b2e3dce9e0e8b&url='+ imageLink, function (error, response, body) {
const data = JSON.parse(body);

var isix = data.results[0].header;
var isiy = data.results[0].data;

if (isix.index_id == 2 || isix.index_id == 38 || isix.index_id == 18 || isix.index_id == 16 )
{
var sumber = isiy.source.replace((/ /g), "%20");
var teks = `*Judul Hentai*: ${isiy.source} 
*Kemiripan*: ${isix.similarity}%
*Pembuat*: ${isiy.creator[0]}
*Link Sauce*: https://hitomi.la/search.html?${sumber}`
} else if ( isix.index_id == 21 )
{
ikkeh.reply(from, 'gunakan perintah !wait untuk mencari judul anime', id)
} else if ( isix.index_id == 37 )
{
var teks = `*Judul*: ${isiy.source} 
*Chapter*: ${isiy.part}
*Kemiripan*: ${isix.similarity}%
*Artist*: ${isiy.artist}
*Author*: ${isiy.author}
*Link Sauce*: ${isiy.ext_urls[0]}`
} else if ( isix.index_id == 41 )
{    
var date = new Date(isiy.created_at);
var formatOptions = { 
day:    '2-digit', 
month:  '2-digit', 
year:   'numeric',
hour:   '2-digit', 
minute: '2-digit',
hour12: false 
};
var dateString = date.toLocaleDateString('en-GB', formatOptions);
dateString = dateString.replace(',', '');

var teks = `*Judul*: Twitter Post 
*Kemiripan*: ${isix.similarity}%
*Pembuat*: ${isiy.twitter_user_handle}
*Tanggal Posting*: ${dateString}
*Link Gambar HD*: ${isiy.ext_urls[0]}`
} else {
var teks = `*Judul*: ${isiy.title}
*Kemiripan*: ${isix.similarity}%
*Pembuat*: ${isiy.member_name}
*Link Gambar HD*: ${isiy.ext_urls[0]}`
}
var video = isix.thumbnail;
ikkeh.sendFileFromUrl(from, video, 'anime.jpg', teks, id).catch(() => {
ikkeh.reply(from, teks, id)})
});
            } catch (err) {
                console.error(err)
                console.error(imageLink)
                await ikkeh.reply(from, 'Error!', id)
            }
        } else {
            await ikkeh.sendImage(from, dataUrl1, 'tutor.jpeg', `Maaf format salah\n\nSilahkan kirim gambar dengan caption ${prefix}sauce atau reply dengan caption ${prefix}sauce`, id)
        }
    break
//new sauce

            case 'waifu':
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                if (!args[0]) {
                    await ikkeh.reply(from, 'Masukan nama waifu kamu + series. Misalnya *!waifu keqing genshin*', id)
                    console.log("Sent!")
                    return null
                    }
                    if (!args[1]) {
                      await ikkeh.reply(from, 'Masukan nama lengkap atau judul anime waifu kamu. Misalnya *!waifu nakano miku*', id)
                      console.log("Sent!")
                      return null
                      }
                  const kyc = message.body.replace('!waifu', '')
                  await ikkeh.reply(from, ind.wait(), id)
                  try {
                const responsewaifu = await axios.get('https://hadi-api.herokuapp.com/api/pinterest?q=' + kyc + '&page=1');
                const {
                       hasil,
                   } = responsewaifu.data
                   var imgwaifu =  hasil[Math.floor(Math.random() * hasil.length)];
                   await ikkeh.sendFileFromUrl(from, `${imgwaifu}`, 'Reddit.jpg', `\n${supp}`,)

                   } catch(err) {
                       console.log(err)
                       await ikkeh.reply(from, 'Waifu kamu tidak ditemukan. Mungkin waifu kamu ampas', id) 
                   }
            break

                case 'character':
                case 'karakter':
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                if (!q) return await ikkeh.reply(from, 'Format salah! masukan kata pencarian misalnya *!character eula*', id)  
                await ikkeh.reply(from, ind.wait(), id)          
                    get_result = await fetchJson(`https://api.lolhuman.xyz/api/character?apikey=${config.lol}&query=${q}`)
                if (get_result.status == 200) {
                    get_result = get_result.result
                    ini_txt = `Id : ${get_result.id}\n`
                    ini_txt += `Name : ${get_result.name.full}\n`
                    ini_txt += `Native : ${get_result.name.native}\n`
                    ini_txt += `Favorites : ${get_result.favourites}\n`
                    ini_txt += `Media : \n`
                    ini_media = get_result.media.nodes
                    for (var x of ini_media) {
                        ini_txt += `- ${x.title.romaji} (${x.title.native})\n`
                    }
                    ini_txt += `\nDescription : \n${get_result.description.replace(/__/g, "_")}`
                    thumbnail = await getBuffer(get_result.image.large)
                    await ikkeh.sendFileFromUrl(from, `${get_result.image.large}`, 'Reddit.jpg', `${ini_txt}`,id)
                } else {
                    await ikkeh.reply(from, 'Karakter yang kamu cari tidak ditemukan. Mungkin dia karakter ampas', id) 
                }
            break

            case 'penyegar':
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                  const kw = ['Cosplaystyle+anime+girl','Cute+anime+cosplay','Cosplaystyle+anime+kawaii'];
                  var pilih =  kw[Math.floor(Math.random() * kw.length)];
                  await ikkeh.reply(from, ind.wait(), id)
                  try {
                const responsewaifu = await axios.get('https://hadi-api.herokuapp.com/api/pinterest?q=' + pilih + '&page=1');
                const {
                       hasil,
                   } = responsewaifu.data
                   var imgsegar=  hasil[Math.floor(Math.random() * hasil.length)];
                   await ikkeh.sendFileFromUrl(from, `${imgsegar}`, 'Reddit.jpg', `\n${supp}`,)

                   } catch(err) {
                       console.log(err)
                       await ikkeh.reply(from, 'Waifu kamu tidak ditemukan. Mungkin waifu kamu ampas', id) 
                   }
            break

            case 'pixiv':
                if (!q) return await ikkeh.reply(from, 'Format salah! masukan kode pixiv yang benar misalnya *!pixiv 63456028*', id)            
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    await ikkeh.reply(from, ind.wait(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                ini_link = `https://api.lolhuman.xyz/api/pixivdl/${q}?apikey==${config.lol}`
                try {
                await ikkeh.sendFileFromUrl(from, `${ini_link}`, 'Reddit.jpg', `\n${supp}`,id)
                } catch(err) {
                       await ikkeh.reply(from, 'Art tidak ditemukan. Coba cari art lain', id) 
                   }
            break

            //tampol
            case 'tampol':
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                arg = body.trim().split(' ')
                const person = author.replace('@c.us', '')
                await ikkeh.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif')
                ikkeh.sendTextWithMentions(from, '@' + person + ' *nampol* ' + arg[1])
            break
            //end tampol

            //kiss
            case 'kiss':
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                arg = body.trim().split(' ')
                const person1 = author.replace('@c.us', '')
                await ikkeh.sendGiphyAsSticker(from, 'https://media.giphy.com/media/mrCaNIVJcUhj942ZT3/giphy.gif')
                ikkeh.sendTextWithMentions(from, '@' + person1 + ' *mencium* ' + arg[1])
            break
            //end kiss

            //calon random
            case 'randomanime':
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const redditurl = ["AnimeGirls", "awwnime"];
                let linka = redditurl[Math.floor(Math.random() * redditurl.length)]
                try {
                const responsesegar = await axios.get('https://meme-api.herokuapp.com/gimme/'+ linka);
                const {
                       postLink,
                       title,
                       subreddit,
                       url,
                       nsfw,
                       spoiler
                   } = responsesegar.data
                   await ikkeh.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}\n${supp}`,)

                   } catch(err) {
                       console.log(err)
                       await ikkeh.reply(from, 'Kosong???', id) 
                   }
             
            break
// end calon random
            case 'nimesticker': // by CHIKAA CHANTEKKXXZZ
            case 'nimestiker': 
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                weeaboo.snime()
                    .then(async (body) => {
                        const wifegerak = body.split('\n')
                        const wifegerakx = wifegerak[Math.floor(Math.random() * wifegerak.length)]
                        await ikkeh.sendStickerfromUrl(from, wifegerakx)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await ikkeh.reply(from, 'Error!', id)
                    })
            break
            // Sticker
            case 'stickermemex':
            case 'stcmemex':
                if (!q.includes('|')) return await ikkeh.reply(from, ind.wrongFormat(), id)
                if (isMedia && isImage || isQuotedImage) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    const top = q.substring(0, q.indexOf('|') - 1)
                    const bottom = q.substring(q.lastIndexOf('|') + 2)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const getUrl = await uploadImages(mediaData, `meme.${sender.id}`)
                    const create = `https://api.memegen.link/images/custom/${top}/${bottom}.png?background=${getUrl}`
                    const meme = await bent('buffer')(create)
                    webp.buffer2webpbuffer(meme, 'png', '-q 100')
                        .then((res) => {
                            sharp(res)
                                .resize(512, 512)
                                .toFile(`./temp/stage_${sender.id}.webp`, async (err) => {
                                    if (err) return console.error(err)
                                    await exec(`webpmux -set exif ./temp/data.exif ./temp/stage_${sender.id}.webp -o ./temp/${sender.id}.webp`, { log: true })
                                    if (fs.existsSync(`./temp/${sender.id}.webp`)) {
                                        const data = fs.readFileSync(`./temp/${sender.id}.webp`)
                                        const base64 = `data:image/webp;base64,${data.toString('base64')}`
                                        await ikkeh.sendRawWebpAsSticker(from, base64)
                                        console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                                        fs.unlinkSync(`./temp/${sender.id}.webp`)
                                        fs.unlinkSync(`./temp/stage_${sender.id}.webp`)
                                    }
                                })
                        })
                } else {
                    await ikkeh.reply(from, ind.wrongFormat(), id)
                }
            break

            case 'sticker':
            case 'stiker':
                if (isMedia && isImage || isQuotedImage) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                        if (isMedia) {
                            const mediaData = await decryptMedia(message, uaOverride)
                            const imageBase64 = `data:image/jpeg;base64,${mediaData.toString('base64')}`
                            ikkeh.sendImageAsSticker(from, imageBase64)
                        } else if (isQuotedImage) {
                            const mediaData = await decryptMedia(quotedMsg)
                            const imageBase64 = `data:image/jpeg;base64,${mediaData.toString('base64')}`
                            ikkeh.sendImageAsSticker(from, imageBase64)
                        } else if (args.length == 2) {
                            const url = args[1]
                            if (url.match(isUrl)) {
                            client.sendStickerfromUrl(from, url, {method: 'get'}).then(r => { if (!r) client.sendText(from, 'Maaf, link yang kamu kirim tidak memuat gambar.') }).catch(err => console.log('Caught exception: ', err))
                            } else {
                                ikkeh.sendText(from, 'Maaf, link yang kamu kirim tidak valid.')
                            }
                        } else {
                            ikkeh.sendText(from, `Tidak ada gambar! Reply atau berikan caption ${prefix}stiker pada gambar`)
                        }
                } else {
                    await ikkeh.reply(from, `Tidak ada gambar! Reply atau berikan caption ${prefix}stiker pada gambar`, id)
                }
            break
            case 'stickergif':
            case 'stikergif':
                if (isMedia && type === 'video' || mimetype === 'image/gif') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    try {
                        const encryptMedia = isQuotedGif || isQuotedVideo ? quotedMsg : message
                        const mediaData = await decryptMedia(encryptMedia, uaOverride)
                        const videoBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await ikkeh.sendMp4AsSticker(from, videoBase64, { fps: 30, startTime: '00:00:00.0', endTime : '00:00:05.0', loop: 0 })
                            .then(async () => {
                                console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                            })
                    } catch (err) {
                        console.error(err)
                        await ikkeh.reply(from, ind.videoLimit(), id)
                    }
                } else if (isQuotedVideo || isQuotedGif) {
                    await ikkeh.reply(from, 'Tidak boleh reply. Upload ulang dengan caption *!stickergif*', id)
                } else {
                    await ikkeh.reply(from, `Tidak ada video! Reply atau berikan caption ${prefix}stiker pada video`, id)
                }
            break
            case 'stickertoimg':
            case 'stikertoimg':
            case 'toimg':
                if (isQuotedSticker) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    try {
                        const mediaData = await decryptMedia(quotedMsg, uaOverride)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await ikkeh.sendFile(from, imageBase64, 'sticker.jpg', '', id)
                    } catch (err) {
                        console.error(err)
                        await ikkeh.reply(from, 'Error!', id)
                    }
                } else {
                    await ikkeh.reply(from, 'Reply pada stiker', id)
                }
            break

            // NSFW
            case 'fetish':
                if (ar.length !== 1) return await ikkeh.sendText(from, ind.fetish(pushname))
                if (isGroupMsg) {
                    if (!isNsfw) return await ikkeh.reply(from, ind.notNsfw(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    try {
                        if (ar[0] === 'armpits') {
                            nsfw.armpits()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'armpits.jpg', '', id)
                                        .then(() => console.log('Success sending armpits pic!'))
                                })
                        } else if (ar[0] === 'feets') {
                            nsfw.feets()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'feets.jpg', '', id)
                                        .then(() => console.log('Success sending feets pic!'))
                                })
                        } else if (ar[0] === 'thighs') {
                            nsfw.thighs()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'thighs.jpg', '', id)
                                        .then(() => console.log('Success sending thighs pic!'))
                                })
                        } else if (ar[0] === 'ass') {
                            nsfw.ass()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'ass.jpg', '', id)
                                        .then(() => console.log('Success sending ass pic!'))
                                })
                        } else if (ar[0] === 'boobs') {
                            nsfw.boobs()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'boobs.jpg', '', id)
                                        .then(() => console.log('Success sending boobs pic!'))
                                })
                        } else if (ar[0] === 'sideboobs') {
                            nsfw.sideboobs()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'sideboobs.jpg', '', id)
                                        .then(() => console.log('Success sending sideboobs pic!'))
                                })
                        } else if (ar[0] === 'ahegao') {
                            nsfw.ahegao()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'ahegao.jpg', '', id)
                                        .then(() => console.log('Success sending ahegao pic!'))
                                })
                        } else if (ar[0] === 'futanari') {
                            ini_futanari = `https://api.lolhuman.xyz/api/random2/futanari?apikey=${config.lol}`
                            await ikkeh.sendFileFromUrl(from, `${ini_futanari}`, 'Reddit.jpg', `Kami tidak pernah meragukan user, meski fetishnya aneh-aneh.`,id)
                        } else if (ar[0] === 'anal') {
                            ini_anal = `https://api.lolhuman.xyz/api/random2/anal?apikey=${config.lol}`
                            await ikkeh.sendFileFromUrl(from, `${ini_anal}`, 'Reddit.jpg', ``,id)
                        } else if (ar[0] === 'trap') {
                            ini_trap = `https://api.lolhuman.xyz/api/random2/trap?apikey=${config.lol}`
                            await ikkeh.sendFileFromUrl(from, `${ini_trap}`, 'Reddit.jpg', `WHY YOU GEH?`,id)
                        } else if (ar[0] === 'nekomimi') {
                            ini_nekomimi = `https://api.lolhuman.xyz/api/random2/lewdkemo?apikey=${config.lol}`
                            await ikkeh.sendFileFromUrl(from, `${ini_nekomimi}`, 'Reddit.jpg', ``,id)
                        } else if (ar[0] === 'loli') {
                            ini_loli = `https://static.wikia.nocookie.net/3f86640f-f9f9-47a8-9146-0c1e1932ab6a`
                            await ikkeh.sendFileFromUrl(from, `${ini_loli}`, 'Reddit.jpg', `SURPRISE MADAFAKA!!`,id)
                        } else {
                            await ikkeh.reply(from, 'Tidak Ditemukan. Fetish lu ampas!', id)
                        }
                    } catch (err) {
                        console.error(err)
                        await ikkeh.reply(from, err, id)
                    }
                } else {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    try {
                        if (ar[0] === 'armpits') {
                            nsfw.armpits()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'armpits.jpg', '', id)
                                        .then(() => console.log('Success sending armpits pic!'))
                                })
                        } else if (ar[0] === 'feets') {
                            nsfw.feets()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'feets.jpg', '', id)
                                        .then(() => console.log('Success sending feets pic!'))
                                })
                        } else if (ar[0] === 'thighs') {
                            nsfw.thighs()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'thighs.jpg', '', id)
                                        .then(() => console.log('Success sending thighs pic!'))
                                })
                        } else if (ar[0] === 'ass') {
                            nsfw.ass()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'ass.jpg', '', id)
                                        .then(() => console.log('Success sending ass pic!'))
                                })
                        } else if (ar[0] === 'boobs') {
                            nsfw.boobs()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'boobs.jpg', '', id)
                                        .then(() => console.log('Success sending boobs pic!'))
                                })
                        } else if (ar[0] === 'sideboobs') {
                            nsfw.sideboobs()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'sideboobs.jpg', '', id)
                                        .then(() => console.log('Success sending sideboobs pic!'))
                                })
                        } else if (ar[0] === 'ahegao') {
                            nsfw.ahegao()
                                .then(async ({ url }) => {
                                    await ikkeh.sendFileFromUrl(from, url, 'ahegao.jpg', '', id)
                                        .then(() => console.log('Success sending ahegao pic!'))
                                })
                        } else if (ar[0] === 'futanari') {
                            ini_futanari = `https://api.lolhuman.xyz/api/random2/futanari?apikey=${config.lol}`
                            await ikkeh.sendFileFromUrl(from, `${ini_futanari}`, 'Reddit.jpg', `Kami tidak pernah meragukan user, meski fetishnya aneh-aneh.`,id)
                        } else if (ar[0] === 'anal') {
                            ini_anal = `https://api.lolhuman.xyz/api/random2/anal?apikey=${config.lol}`
                            await ikkeh.sendFileFromUrl(from, `${ini_anal}`, 'Reddit.jpg', ``,id)
                        } else if (ar[0] === 'trap') {
                            ini_trap = `https://api.lolhuman.xyz/api/random2/trap?apikey=${config.lol}`
                            await ikkeh.sendFileFromUrl(from, `${ini_trap}`, 'Reddit.jpg', `WHY YOU GEH?`,id)
                        } else if (ar[0] === 'nekomimi') {
                            ini_nekomimi = `https://api.lolhuman.xyz/api/random2/lewdkemo?apikey=${config.lol}`
                            await ikkeh.sendFileFromUrl(from, `${ini_nekomimi}`, 'Reddit.jpg', ``,id)
                        } else if (ar[0] === 'loli') {
                            ini_loli = `https://static.wikia.nocookie.net/3f86640f-f9f9-47a8-9146-0c1e1932ab6a`
                            await ikkeh.sendFileFromUrl(from, `${ini_loli}`, 'Reddit.jpg', `SURPRISE MADAFAKA!!`,id)
                        } else {
                            await ikkeh.reply(from, 'Tidak Ditemukan. Fetish lu ampas!', id)
                        }
                    } catch (err) {
                        console.error(err)
                        await ikkeh.reply(from, 'Error!', id)
                    }
                }
            break
            case 'nhentai':
            case 'nh':
                if (args.length !== 1) return await ikkeh.reply(from, 'Masukan kode yang benar, misalnya !nh 177013', id)
                if (isNaN(Number(args[0]))) return await ikkeh.reply(from, 'Masukan kode yang benar, misalnya !nh 177013', id)
                if (isGroupMsg) {
                    if (!isNsfw) return await ikkeh.reply(from, ind.notNsfw(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    console.log(`Searching nHentai for ${args[0]}...`)
                    const validate = await nhentai.exists(args[0])
                    if (validate === true) {
                        try {
                            const pic = await api.getBook(args[0])
                                .then((book) => {
                                     return api.getImageURL(book.cover)
                                })
                            const dojin = await nhentai.getDoujin(args[0])
                            const { title, details, link } = dojin
                            const { tags, artists, languages, categories } = details
                            let teks = `*Title*: ${title}\n\n*Tags*: ${tags.join(', ')}\n\n*Artists*: ${artists}\n\n*Languages*: ${languages.join(', ')}\n\n*Categories*: ${categories}\n\n*Link*: ${link}`
                            await ikkeh.sendFileFromUrl(from, pic, 'nhentai.jpg', teks, id)
                            console.log('Success sending nHentai info!')
                        } catch (err) {
                            console.error(err)
                            await ikkeh.reply(from, 'Error!', id)
                        }
                    } else {
                        await ikkeh.reply(from, ind.nhFalse(), id)
                    }
                } else {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    console.log(`Searching nHentai for ${args[0]}...`)
                    const validate = await nhentai.exists(args[0])
                    if (validate === true) {
                        try {
                            const pic = await api.getBook(args[0])
                                .then((book) => {
                                     return api.getImageURL(book.cover)
                                })
                            const dojin = await nhentai.getDoujin(args[0])
                            const { title, details, link } = dojin
                            const { tags, artists, languages, categories } = details
                            let teks = `*Title*: ${title}\n\n*Tags*: ${tags.join(', ')}\n\n*Artists*: ${artists}\n\n*Languages*: ${languages.join(', ')}\n\n*Categories*: ${categories}\n\n*Link*: ${link}`
                            await ikkeh.sendFileFromUrl(from, pic, 'nhentai.jpg', teks, id)
                            console.log('Success sending nHentai info!')
                        } catch (err) {
                            console.error(err)
                            await ikkeh.reply(from, 'Error!', id)
                        }
                    } else {
                        await ikkeh.reply(from, ind.nhFalse(), id)
                    }
                }
            break
            case 'nhsearch':
                if (args.length == 0) return await ikkeh.reply(from, 'Format salah! masukan kata pencarian misalnya *!nhsearch atago*', id)
                if (isGroupMsg) {
                    if (!isNsfw) return await ikkeh.reply(from, ind.notNsfw(chat), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    console.log(`Searching nHentai for ${q}...`)
                    nana.search(q)
                        .then(async (g) => {
                            let txt = `-----[ *NHENTAI* ]-----\n\n *Hasil Pencarian*: ${q} \n Gunakan perintah !nh (kode) untuk melihat detail`
                            for (let i = 0; i < g.results.length; i++) {
                                const { id, title, language } = g.results[i]
                                txt += `\n\n*Code*: ${id}\n*Title*: ${title}\n*Language*: ${language.charAt(0).toUpperCase() + language.slice(1)}\n*Link*: nhentai.net/g/${id}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                            }
                            await ikkeh.sendFileFromUrl(from, g.results[0].thumbnail.s, `${g.results[0].title}`, txt, id)
                                .then(() => console.log('Success sending nHentai results!'))
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await ikkeh.reply(from, 'Tidak ditemukan', id)
                        })
                } else {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    console.log(`Searching nHentai for ${q}...`)
                    nana.search(q)
                        .then(async (g) => {
                            let txt = `-----[ *NHENTAI* ]-----\n\n *Hasil Pencarian*: ${q} \n Gunakan perintah !nh (kode) untuk melihat detail`
                            for (let i = 0; i < 10; i++) {
                                const { id, title, language } = g.results[i]
                                txt += `\n\n*Code*: ${id}\n*Title*: ${title}\n*Language*: ${language.charAt(0).toUpperCase() + language.slice(1)}\n*Link*: nhentai.net/g/${id}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                            }
                            await ikkeh.sendFileFromUrl(from, g.results[0].thumbnail.s, `${g.results[0].title}`, txt, id)
                                .then(() => console.log('Success sending nHentai results!'))
                        })
                        .catch(async(err) => {
                            console.error(err)
                            await ikkeh.reply(from, 'Error!', id)
                        })
                }
            break
            case 'nekopoi':
                if (!q) return await ikkeh.reply(from, 'Format salah! masukan kata pencarian misalnya *!nekosearch onii chan*', id)
                if (isGroupMsg) {
                    if (!isNsfw) return await ikkeh.reply(from, ind.notNsfw(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    nekos = await fetchJson(`https://api.lolhuman.xyz/api/nekopoisearch?apikey=${config.lol}&query=${q}`)
                    if (nekos.status == 200) {
                    get_result = nekos.result
                    ini_txt = ""
                    for (var x of get_result) {
                        ini_txt += `Title : ${x.title}\n`
                        ini_txt += `Link : ${x.link}\n`
                        ini_txt += `Thumbnail : ${x.thumbnail}\n\n`
                    }
                    console.log(nekos.status)
                    await ikkeh.reply(from, ini_txt, id)
                } else {
                    await ikkeh.reply(from, 'Maaf, Hentai Tidak Ditemukan!!', id)
                }
                } else {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    nekos = await fetchJson(`https://api.lolhuman.xyz/api/nekopoisearch?apikey=${config.lol}&query=${q}`)
                    if (nekos.status == 200) {
                    get_result = nekos.result
                    ini_txt = ""
                    for (var x of get_result) {
                        ini_txt += `Title : ${x.title}\n`
                        ini_txt += `Link : ${x.link}\n`
                        ini_txt += `Thumbnail : ${x.thumbnail}\n\n`
                    }
                    console.log(nekos.status)
                    await ikkeh.reply(from, ini_txt, id)
                } else {
                    await ikkeh.reply(from, 'Maaf, Hentai Tidak Ditemukan!!', id)
                }
                }
            break
            case 'yuri':
                if (isGroupMsg) {
                    if (!isNsfw) return await ikkeh.reply(from, ind.notNsfw(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    await ikkeh.sendFileFromUrl(from, (await neko.nsfw.eroYuri()).url, 'yuri.jpg', '', id)
                } else {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.reply(from, ind.wait(), id)
                    await ikkeh.sendFileFromUrl(from, (await neko.nsfw.eroYuri()).url, 'yuri.jpg', '', id)
                }
            break

            //penyegar NSFW

            case 'penyegar18':
                try {
                    const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/gravure/');
                    const {
                        postLink,
                        title,
                        subreddit,
                        url,
                        nsfw,
                        spoiler
                           } = response1.data

                  if (isGroupMsg) {
                    if (!isNsfw) return await ikkeh.reply(from, ind.notNsfw(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`)
                 } else { 
                           if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                           await ikkeh.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `*${title}*\n${supp}`,)
                        }
                        } catch(err) {
                            console.log(err)
                            await client.reply(from, 'Kosong???', id) 
                        }
     
            break

            //end penyegar NSFW 
            //penyegar NSFW

            case 'randomhentai':
                try {
                    const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/hentai/');
                    const {
                        postLink,
                        title,
                        subreddit,
                        url,
                        nsfw,
                        spoiler
                           } = response1.data

                  if (isGroupMsg) {
                    if (!isNsfw) return await ikkeh.reply(from, ind.notNsfw(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`)
                 } else { 
                           if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                           await ikkeh.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `*${title}*\n${supp}`,)
                        }
                        } catch(err) {
                            console.log(err)
                            await client.reply(from, 'Kosong???', id) 
                        }
     
            break

            //START NH DL
                    case 'nhdl':
                        if (args.length >=1){
                        const validate = await nhentai.exists(args[0])
                        if (validate === true) {    
                            const code = args[0]
                            const url = 'https://nhder.herokuapp.com/download/nhentai/'+code+'/zip'
                            const short = []
                            const shortener = await urlShortener(url)
                            url['short'] = shortener
                            short.push(url)
                            const caption = `Link download Nhentai ${code}: ${shortener}\n${supp}`
                            if (isGroupMsg) {
                                if (!isNsfw) return await ikkeh.reply(from, ind.notNsfw(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                ikkeh.sendText(from, caption)
                          } else { 
                            if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                            ikkeh.sendText(from, caption)
                          }
                      } else {
                            ikkeh.sendText(from, 'Kode tidak ditemukan. coba !nhdl 177013')
                      }
                        } else {
                            ikkeh.sendText(from, 'Maaf tolong masukan nuklir yang benar. Misalnya !nhdl 177013')
                        }
                        break
//END NH DL

            //end penyegar NSFW 
//panjang

// Photo Oxy //
                case 'shadow':
                case 'cup':
                case 'cup1':
                case 'romance':
                case 'smoke':
                case 'burnpaper':
                case 'lovemessage':
                case 'undergrass':
                case 'love':
                case 'coffe':
                case 'woodheart':
                case 'woodenboard':
                case 'summer3d':
                case 'wolfmetal':
                case 'nature3d':
                case 'underwater':
                case 'golderrose':
                case 'summernature':
                case 'letterleaves':
                case 'glowingneon':
                case 'fallleaves':
                case 'flamming':
                case 'harrypotter':
                case 'carvedwood':
                if (!q) return await ikkeh.reply(from, 'Format salah! Masukan kata yang ingin dijadikan gambar. Misalnya !romance Eula', id)   

                linkgen = `https://api.lolhuman.xyz/api/photooxy1/${command}?apikey=${config.lol}&text=${q}`
                await ikkeh.sendFileFromUrl(from, `${linkgen}`, 'Reddit.jpg', `${supp}`,)
                    break

//wkwk
            // Moderation command
            case 'linkgroup':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await ikkeh.reply(from, ind.botNotAdmin(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const gcLink = await ikkeh.getGroupInviteLink(groupId)
                const linkGc = `Group: *${formattedTitle}*\n\nLink: ${gcLink}`
                ikkeh.reply(from, linkGc, id)
            break
            case 'ownergroup':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const ownerGc = chat.groupMetadata.owner
                await ikkeh.sendTextWithMentions(from, `Owner Group : @${ownerGc}`)
            break
            case 'mutegc':
                if (!isGroupMsg) return ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return ikkeh.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return ikkeh.reply(from, ind.botNotAdmin(), id)
                if (ar[0] === 'aktif') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.setGroupToAdminsOnly(groupId, true)
                    await ikkeh.sendText(from, ind.gcMute())
                } else if (ar[0] === 'nonaktif') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.setGroupToAdminsOnly(groupId, false)
                    await ikkeh.sendText(from, ind.gcUnmute())
                } else {
                    await ikkeh.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'add':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await ikkeh.reply(from, ind.botNotAdmin(), id)
                if (args.length !== 1) return await ikkeh.reply(from, ind.wrongFormat(), id)
                try {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await ikkeh.addParticipant(from, `${args[0]}@c.us`)
                    await ikkeh.sendText(from, ind.welcome())
                } catch (err) {
                    console.error(err)
                    await ikkeh.reply(from, 'Error!', id)
                }
            break
            case 'kick':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await ikkeh.reply(from, ind.botNotAdmin(), id)
                if (mentionedJidList.length === 0) return await ikkeh.reply(from, ind.wrongFormat(), id)
                if (mentionedJidList[0] === botNumber) return await ikkeh.reply(from, ind.wrongFormat(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await ikkeh.sendTextWithMentions(from, `Selamat Tinggal\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
                for (let i of mentionedJidList) {
                    if (groupAdmins.includes(i)) return await ikkeh.sendText(from, ind.wrongFormat())
                    await ikkeh.removeParticipant(groupId, i)
                }
            break
            case 'promote':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await ikkeh.reply(from, ind.botNotAdmin(), id)
                if (mentionedJidList.length !== 1) return await ikkeh.reply(from, ind.wrongFormat(), id)
                if (mentionedJidList[0] === botNumber) return await ikkeh.reply(from, ind.wrongFormat(), id)
                if (groupAdmins.includes(mentionedJidList[0])) return await ikkeh.reply(from, ind.adminAlready(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await ikkeh.promoteParticipant(groupId, mentionedJidList[0])
                await ikkeh.reply(from, `@${mentionedJidList[0].replace('@c.us', '')} sekarang admin`, id)
            break
            case 'demote':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await ikkeh.reply(from, ind.botNotAdmin(), id)
                if (mentionedJidList.length !== 1) return await ikkeh.reply(from, ind.wrongFormat(), id)
                if (mentionedJidList[0] === botNumber) return await ikkeh.reply(from, ind.wrongFormat(), id)
                if (!groupAdmins.includes(mentionedJidList[0])) return await ikkeh.reply(from, ind.notAdmin(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await ikkeh.demoteParticipant(groupId, mentionedJidList[0])
                await ikkeh.reply(from, `Sekarang @${mentionedJidList[0].replace('@c.us', '')} jadi rakyat jelata.`, id)
            break
            case 'leave':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                await ikkeh.sendText(from, 'Sayounara~ 👋')
                await ikkeh.leaveGroup(groupId)
            break
            case 'admins':
            case 'admin':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const groupAdm = await ikkeh.getGroupAdmins(groupId)
                const lastAdmin = daily.getLimit(sender.id, _daily)
                if (lastAdmin !== undefined && cd - (Date.now() - lastAdmin) > 0) {
                    const time = ms(cd - (Date.now() - lastAdmin))
                    await ikkeh.reply(from, ind.daily(time), id)
                } else if (isOwner) {
                    let txt = '-----[ *ADMIN GRUP* ]-----\n'
                    for (let i = 0; i < groupAdm.length; i++) {
                        txt += '➥'
                        txt += ` @${groupAdm[i].replace(/@c.us/g, '')}\n`
                    }
                    await ikkeh.sendTextWithMentions(from, txt)
                } else {
                    let txt = '-----[ *ADMIN GRUP* ]-----\n'
                    for (let i = 0; i < groupAdm.length; i++) {
                        txt += '➥'
                        txt += ` @${groupAdm[i].replace(/@c.us/g, '')}\n`
                    }
                    await ikkeh.sendTextWithMentions(from, txt)
                    daily.addLimit(sender.id, _daily)
                }
            break
            case 'antilink':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await ikkeh.reply(from, ind.botNotAdmin(), id)
                if (ar[0] === 'aktif') {
                    if (isDetectorOn) return await ikkeh.reply(from, ind.detectorOnAlready(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _antilink.push(groupId)
                    fs.writeFileSync('./database/group/antilink.json', JSON.stringify(_antilink))
                    await ikkeh.reply(from, ind.detectorOn(name, formattedTitle), id)
                } else if (ar[0] === 'nonaktif') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await ikkeh.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _antilink.splice(groupId, 1)
                    fs.writeFileSync('./database/group/antilink.json', JSON.stringify(_antilink))
                    await ikkeh.reply(from, ind.detectorOff(), id)
                } else {
                    await ikkeh.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'welcome':
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                    await ikkeh.reply(from, 'Maaf, fitur dalam perbaikan', id)
            break
            // Owner command
            case 'bc':
                const dataikm= './test/ikm.jpg'
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (!q) return await ikkeh.reply(from, ind.emptyMess(), id)
                const chats = await ikkeh.getAllChatIds()
                for (let bcs of chats) {
                    let cvk = await ikkeh.getChatById(bcs)
                    if (!cvk.isReadOnly) await ikkeh.sendText(bcs, `${q}\n\n- IkkehMan\n_Broadcasted message_`)
                }
                await ikkeh.reply(from, ind.doneOwner(), id)
            break
            case 'clearall':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                const allChats = await ikkeh.getAllChats()
                for (let delChats of allChats) {
                    await ikkeh.deleteChat(delChats.id)
                }
                await ikkeh.reply(from, ind.doneOwner(), id)
            break
            case 'leaveall':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (!q) return await ikkeh.reply(from, ind.emptyMess(), id)
                const allGroup = await ikkeh.getAllGroups()
                for (let gclist of allGroup) {
                    await ikkeh.sendText(gclist.contact.id, q)
                    await ikkeh.leaveGroup(gclist.contact.id)
                }
                await ikkeh.reply(from, ind.doneOwner())
            break
            case 'getses':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                const ses = await ikkeh.getSnapshot()
                await ikkeh.sendFile(from, ses, 'session.png', ind.doneOwner())
            break
            case 'ban':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (ar[0] === 'add') {
                    if (mentionedJidList.length !== 0) {
                        for (let benet of mentionedJidList) {
                            if (benet === botNumber) return await ikkeh.reply(from, ind.wrongFormat(), id)
                            _ban.push(benet)
                            fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        }
                        await ikkeh.reply(from, ind.doneOwner(), id)
                    } else {
                        _ban.push(args[1] + '@c.us')
                        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        await ikkeh.reply(from, ind.doneOwner(), id)
                    }
                } else if (ar[0] === 'del') {
                    if (mentionedJidList.length !== 0) {
                        if (mentionedJidList[0] === botNumber) return await ikkeh.reply(from, ind.wrongFormat(), id)
                        _ban.splice(mentionedJidList[0], 1)
                        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        await ikkeh.reply(from, ind.doneOwner(), id)
                    } else{
                        _ban.splice(args[1] + '@c.us', 1)
                        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        await ikkeh.reply(from, ind.doneOwner(), id)
                    }
                } else {
                    await ikkeh.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'eval':
            case 'ev':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (!q) return await ikkeh.reply(from, ind.wrongFormat(), id)
                try {
                    let evaled = await eval(q)
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    await ikkeh.sendText(from, evaled)
                } catch (err) {
                    console.error(err)
                    await ikkeh.reply(from, 'Error!', id)
                }
            break
            case 'shutdown':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                await ikkeh.sendText(from, 'Otsukaresama deshita~ 👋')
                    .then(async () => await ikkeh.kill())
                    .catch(() => new Error('Target closed.'))
            break
            case 'premium':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (ar[0] === 'add') {
                    if (mentionedJidList.length !== 0) {
                        for (let prem of mentionedJidList) {
                            if (prem === botNumber) return await ikkeh.reply(from, ind.wrongFormat(), id)
                            premium.addPremiumUser(prem, args[2], _premium)
                            await ikkeh.reply(from, `*「 PREMIUM ADDED 」*\n\n➸ *ID*: ${prem}\n➸ *Expired*: ${ms(toMs(args[2])).days} day(s) ${ms(toMs(args[2])).hours} hour(s) ${ms(toMs(args[2])).minutes} minute(s)`, id)
                        }
                    } else {
                        premium.addPremiumUser(args[1] + '@c.us', args[2], _premium)
                        await ikkeh.reply(from, `*「 PREMIUM ADDED 」*\n\n➸ *ID*: ${args[1]}@c.us\n➸ *Expired*: ${ms(toMs(args[2])).days} day(s) ${ms(toMs(args[2])).hours} hour(s) ${ms(toMs(args[2])).minutes} minute(s)`, id)
                    }
                } else if (ar[0] === 'del') {
                    if (mentionedJidList.length !== 0) {
                        if (mentionedJidList[0] === botNumber) return await ikkeh.reply(from, ind.wrongFormat(), id)
                        _premium.splice(premium.getPremiumPosition(mentionedJidList[0], _premium), 1)
                        fs.writeFileSync('./database/bot/premium.json', JSON.stringify(_premium))
                        await ikkeh.reply(from, ind.doneOwner(), id)
                    } else {
                        _premium.splice(premium.getPremiumPosition(args[1] + '@c.us', _premium), 1)
                        fs.writeFileSync('./database/bot/premium.json', JSON.stringify(_premium))
                        await ikkeh.reply(from, ind.doneOwner(), id)
                    }
                } else {
                    await ikkeh.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'setstatus':
            case 'setstats':
            case 'setstat':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (!q) return await ikkeh.reply(from, ind.emptyMess(), id)
                await ikkeh.setMyStatus(q)
                await ikkeh.reply(from, ind.doneOwner(), id)
            break
            case 'exif':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (!q.includes('|')) return await ikkeh.reply(from, ind.wrongFormat(), id)
                const namaPack = q.substring(0, q.indexOf('|') - 1)
                const authorPack = q.substring(q.lastIndexOf('|') + 2)
                exif.create(namaPack, authorPack)
                await ikkeh.reply(from, ind.doneOwner(), id)
            break
            case 'mute':
                if (!isRegistered) return await ikkeh.reply(from, ind.notRegistered(pushname), id)
                if (!isGroupMsg) return await ikkeh.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await ikkeh.reply(from, ind.adminOnly(), id)
                if (ar[0] === 'enable') {
                    if (isMute) return await ikkeh.reply(from, ind.muteChatOnAlready(), id)
                    _mute.push(groupId)
                    fs.writeFileSync('./database/bot/mute.json', JSON.stringify(_mute))
                    await ikkeh.reply(from, ind.muteChatOn(), id)
                } else if (ar[0] === 'disable') {
                    _mute.splice(groupId, 1)
                    fs.writeFileSync('./database/bot/mute.json', JSON.stringify(_mute))
                    await ikkeh.reply(from, ind.muteChatOff(), id)
                } else {
                    await ikkeh.reply(from, ind.wrongFormat(), id)
                }
            break
            case 'setname':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (!q || q.length > 25) return await ikkeh.reply(from, ind.wrongFormat(), id)
                await ikkeh.setMyName(q)
                await ikkeh.reply(from, `Done!\n\nUsername changed to: ${q}`, id)
            break
            case 'give':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                if (args.length !== 2) return await ikkeh.reply(from, ind.wrongFormat(), id)
                if (mentionedJidList.length !== 0) {
                    for (let give of mentionedJidList) {
                        level.addLevelingXp(give, Number(args[1]), _level)
                        await ikkeh.reply(from, `Sukses menambah XP kepada: ${give}\nJumlah ditambahkan: ${args[1]}`, id)
                    }
                } else {
                    level.addLevelingXp(args[0] + '@c.us', Number(args[1]), _level)
                    await ikkeh.reply(from, `Sukses menambah XP kepada: ${args[0]}\nJumlah ditambahkan: ${args[1]}`, id)
                }
            break
            case 'listgroup':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                    ikkeh.getAllGroups().then((res) => {
                    let gc = '*Group list*:\n'
                    for (let i = 0; i < res.length; i++) {
                        gc += `\n\n*No*: ${i+1}\n*Nama*: ${res[i].name}\n*Unread messages*: ${res[i].unreadCount} messages\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                    }
                    ikkeh.reply(from, gc, id)
                })
            break
            case 'reset':
                if (!isOwner) return await ikkeh.reply(from, ind.ownerOnly(), id)
                const reset = []
                _limit = reset
                console.log('Resetting user\'s limit...')
                fs.writeFileSync('./database/user/limit.json', JSON.stringify(_limit))
                await ikkeh.reply(from, ind.doneOwner(), id)
                console.log('Success!')
            break
            default:
                if (isCmd) {
                    await ikkeh.reply(from, ind.cmdNotFound(command), id)
                } else if (!isCmd && !isGroupMsg && !isImage && !isVideo){
                        const bacot = message.body
                        simi = await fetchJson(`https://api.lolhuman.xyz/api/simi?apikey=${config.lol}&text=${bacot}`)
                        ikkeh.sendText(from, simi.result)  
                }
            break
        }
    } catch (err) {
        console.error(color('[ERROR]', 'red'), err)
    }
}
/********** END OF MESSAGE HANDLER **********/
