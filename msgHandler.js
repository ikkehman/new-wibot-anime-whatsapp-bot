const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const sendSticker = require('./sendSticker')
const get = require('got')
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg') 
const color = require('./lib/color')
const { help, info, helpdewe, mimin} = require('./lib/help')
const msgFilter = require('./lib/msgFilter')
const akaneko = require('akaneko');
const { exec } = require('child_process')
const fetch = require('node-fetch');
const ruleArr = JSON.parse(fs.readFileSync('./lib/rule.json'))
const bent = require('bent')
const wel = JSON.parse(fs.readFileSync('./lib/welcome.json')) 
const nsfwgrp = JSON.parse(fs.readFileSync('./lib/nsfw.json')) 
const ban = JSON.parse(fs.readFileSync('./lib/banned.json'))
const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const { profile } = require('./lib/profile.js')
const sticker = require('./lib/sticker.js')
const SauceNAO = require('saucenao')
const mime = require('mime-types')
const stickerArr = ['XM1N7CiW1xxkL8Oi6sCD2+xECehai2DI4bE37I7PIhw=', 'toFAeTndmqlzGRdBUY4K2EAnLdwCqgGF7nmMiaAX2Y0=', 'UWK/E5Jf/OLg+zFgICX3bwXc0iXfPEZ+PDDf0C+3Qvw=', 'BfppV7tESHi/QmrxuJG4WdXKYsO3lNTiXf0aBfasJ4E=', 'mHbEuCjA+RVWftr2AFuLieAJcyHYZnibd7waZPqvDNQ=']

const { msg } = require('./nonPrefix.js')
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, mentionedJidList, author, quotedMsgObj } = message
        let { body } = message
        const { name } = chat
        let { pushname, verifiedName } = sender
        const prefix = '!'
        var supp = '\nYuk dukung Wibot untuk beli server baru biar ga lag lagi. Donasi ke https://trakteer.id/ikkehman'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
    const isRule = ruleArr.includes(chat.id)
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')

    const botNumber = await client.getHostNumber()
    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
    const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
    if (isCmd && ban.includes(sender.id)) return client.reply(from, 'Kamu di banned karena nyepam!', id)
    if ((message.type == 'sticker') && (stickerArr.includes(message.filehash))) return await sticker.stickerHandler(message, client, isGroupAdmins, isBotGroupAdmins, groupAdmins, color, time)
    if (isGroupMsg && isRule && (type === 'chat' && message.body.includes('chat.whatsapp.com') && isBotGroupAdmins) && !isGroupAdmins) return await client.removeParticipant(chat.id, author)
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))
        if (!isCmd && !isGroupMsg) return msg(message, color, true, time)
        if (!isCmd && isGroupMsg) return msg(message, color, false, time)
        if (isCmd && !isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))

        const owners = ['628xxxxxx@c.us'] // eg [9190xxxxxxxx, 49xxxxxxxx] replace my number also 
        const isowner = owners.includes(sender.id) 

        msgFilter.addFilter(from)

        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
            switch (command) {
//stiker                
            case 'sticker':
            case 'stiker':
            //console.log(type)
                        if (isMedia && type == 'video') {
                            await client.reply(from, 'Tidak support Video', id)
                        } else if (isMedia && type == 'image') {
                            const mediaData = await decryptMedia(message)
                            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                            const baseImg = imageBase64.replace('video/mp4','image/gif')
                            await client.sendImageAsSticker(from, baseImg)
                        } else if (quotedMsg && quotedMsg.type == 'image') {
                            const mediaData = await decryptMedia(quotedMsg)
                            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendImageAsSticker(from, imageBase64)
                    } else if (quotedMsg && quotedMsg.type == 'video') {
                        await client.reply(from, 'Tidak support Video', id) 
                    } else {
                        client.reply(from, 'Reply atau berikan caption !stiker pada gambar', message.id)
                        }
        break
///end stiker       
//info grup             
        case 'groupinfo' :
        case 'grupinfo' :
            if (!isGroupMsg) return client.reply(from, '.', message.id) 
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var welgrp = wel.includes(chat.id)
            var ngrp = nsfwgrp.includes(chat.id)
            var grouppic = await client.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await client.sendFileFromUrl(from, pfp, 'group.png', `
*Nama Grup:* ${groupname}

*Total Anggota:* ${totalMem}

*NSFW:* ${ngrp}

*Deskripsi Grup* 

${desc}`)
        break
//end info grup

//grup menu banned
case 'ban':
    if(!isowner) return client.reply(from, 'Owner only', message.id)
    if (args.length == 0) return client.reply(from, `Untuk banned seseorang agar tidak bisa menggunakan commands\n\nCaranya ketik: \n${prefix}ban add 628xx --untuk mengaktifkan\n${prefix}ban del 628xx --untuk nonaktifkan\n\ncara cepat ban banyak digrup ketik:\n${prefix}ban @tag @tag @tag`, id)
    if (args[0] == 'add') {
        ban.push(args[1]+'@c.us')
        fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
        await client.reply(from, 'Success banned target!', id) 
    } else
    if (args[0] == 'del') {
        let xnxx = ban.indexOf(args[1]+'@c.us')
        ban.splice(xnxx,1)
        fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
        await client.reply(from, 'Success unbanned target!', id) 
    } else {
     for (let i = 0; i < mentionedJidList.length; i++) {
        ban.push(mentionedJidList[i])
        fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
        client.reply(from, 'Success ban target!', id)
        }
    }
    break      
// end grup menu banned   

//grup menu musnahkan             
        case 'musnahkan':
            if (!isowner) return client.reply(from, 'Owner only', message.id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Done', message.id)
            break
//end grup menu musnahkan   

//grup menu aktif            
        case 'aktif':
            const nsfwimg = './media/images/nsfwimg.jpg'
             arg = body.trim().split(' ')
             if (!isGroupAdmins) return client.reply(from, 'Menu ini hanya untuk Admin!', id)
                    if (arg[1].toLowerCase() == 'nsfw') {
                    if (nsfwgrp.includes(chat.id)) {
                client.sendImage(chat.groupMetadata.id, nsfwimg, 'nsfwimg.jpg', `NSFW mode ON di grup *${name}*. Sekarang kalian bisa akses menu NSFW`)
                    } else {
                        nsfwgrp.push(chat.id)
                        fs.writeFileSync('./lib/nsfw.json', JSON.stringify(nsfwgrp))
                        client.sendImage(chat.groupMetadata.id, nsfwimg, 'nsfwimg.jpg', `NSFW mode ON di grup *${name}*. Sekarang kalian bisa akses menu NSFW`)
                }
            }
             break
// end grup menu aktif 

//grup menu nonaktif   
        case 'nonaktif':
             arg = body.trim().split(' ')
             if (!isGroupAdmins) return client.reply(from, 'Menu ini hanya untuk Admin!', id)
             if (arg[1].toLowerCase() == 'nsfw') {
                let inx = ban.indexOf(from)
                nsfwgrp.splice(inx, 1)
                fs.writeFileSync('./lib/nsfw.json', JSON.stringify(nsfwgrp))
                client.reply(from, `NSFW mode OFF di grup *${name}*`, message.id)
             }      
             break
//end grup menu nonaktif                   

//calon randon hentai     
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

                const isnsfw = nsfwgrp.includes(from)
                if (isGroupMsg) {
                      if ((isGroupMsg) && (isnsfw)) {
                                await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`)
                      } else if ((isGroupMsg) && (!isnsfw)) {
                                await client.reply(from, `NSFW mode belum di aktifkan di grup *${name}*. Mintalah admin aktifkan dengan ketik *!aktif nsfw* `, id)
                      }
                } else { 
                      await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`)
                }
                } catch(err) {
                    console.log(err)
                    await client.reply(from, 'Kosong???', id) 
                }
                break
//end calon randon hentai   

//unban
        case 'unban':
            if(!isowner) return client.reply(from, 'Owner only', message.id)
            let inx = ban.indexOf(mentionedJidList[0])
            ban.splice(inx, 1)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
            client.reply(from, 'Unbanned User!', message.id)
            break
// end unban
//menu kick
        case 'kick':
            if(!isGroupMsg) return client.reply(from, 'Hanya untuk grup chat', message.id)
            if(!isGroupAdmins) return client.reply(from, 'Maaf, anda bukan admin', message.id)
            if(!isBotGroupAdmins) return client.reply(from, 'WiBot harus jadi admin untuk menu ini', message.id)
            if(mentionedJidList.length === 0) return client.reply(from, 'Format salah', message.id)
            await client.sendText(from, `Request Accepted! issued:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await client.reply(from, 'Tidak boleh kick admin!', message.id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
//end menu kick

//add member

case 'add':
    if(!isGroupMsg) return client.reply(from, 'Hanya untuk grup chat', message.id)
    if(!isGroupAdmins) return client.reply(from, 'Maaf, anda bukan admin', message.id)
    if(!isBotGroupAdmins) return client.reply(from, 'WiBot harus jadi admin untuk menu ini', message.id)
    if (args.length !== 1) return client.reply(from, `Untuk menggunakan ${prefix}add\nPenggunaan: ${prefix}add <nomor>\ncontoh: ${prefix}add 628xxx`, id)
        try {
            await client.addParticipant(from,`${args[0]}@c.us`)
        } catch {
            client.reply(from, 'Gagal menambahkan target', id)
        }
    break

//end

//hapus
        case 'delete':
            if (!quotedMsg) return client.reply(from, 'Reply !delete pada pesan yang ingin wibot hapus', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Hanya bisa menghapus pesan dari WiBot', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
// end hapus
//capek
        case 'leave':
            if(!isGroupMsg) return client.reply(from, 'Hanya untuk grup chat', message.id)
            if(!isGroupAdmins) return client.reply(from, 'Anda bukan admin', message.id)
            await client.sendText(from,'Sayonara 😞').then(() => client.leaveGroup(groupId))
            break

        case 'promote':
            if(!isGroupMsg) return client.reply(from, 'Hanya untuk grup chat', message.id)
            if(!isGroupAdmins) return client.reply(from, 'Anda bukan admin', message.id)
            if(!isBotGroupAdmins) return client.reply(from, 'WiBot harus jadi admin untuk menu ini', message.id)
            if (mentionedJidList.length === 0) return await client.reply(from, 'Format Salah!', message.id)
            if (mentionedJidList.length >= 2) return await client.reply(from, '1 perintah 1 user', message.id)
            if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Dia sudah jadi admin', message.id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `@${mentionedJidList[0].replace('@c.us', '')} sekarang admin`)
            break

        case 'demote':
            if(!isGroupMsg) return client.reply(from, 'Hanya untuk grup chat', message.id)
            if(!isGroupAdmins) return client.reply(from, 'Anda bukan admin', message.id)
            if(!isBotGroupAdmins) return client.reply(from, 'WiBot harus jadi admin untuk menu ini', message.id)
            if (mentionedJidList.length === 0) return await client.reply(from, 'Format Salah!', message.id)
            if (mentionedJidList.length >= 2) return await client.reply(from, '1 perintah 1 user', message.id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Dia memang bukan admin', message.id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Sekarang @${mentionedJidList[0].replace('@c.us', '')} jadi rakyat jelata.`)
            break

        case 'join':
            if (args.length == 0) return client.reply(from, 'Format salah', message.id)
            const link = body.slice(6)
            const minMem = 30
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, 'Link nya mana?', message.id)
            if (check.size < minMem) return client.reply(from, 'Grupnya sepi. Minimal anggota 30', message.id)
            await client.joinGroupViaLink(link).then( async () => {
                await client.reply(from, 'Bergabung', message.id)
            }).catch(error => {
                client.reply(from, 'Terjadi error', message.id)
            })
            break
//sauce calon wait
        case 'wait':
            const dataUrl = './media/tutor.jpeg'
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                    if (resolt.docs && resolt.docs.length <= 0) {
                        client.reply(from, 'Maaf, saya tidak tau ini anime apa, pastikan gambar yang akan di Search tidak Buram/Kepotong', id)
                    }
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id, season } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                        teks = 'Mungkin judulnya salah. Pastikan yang anda kirim scene anime. *BUKAN FAN ART* :\n\n'
                    }
                    teks += `*Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    teks += `*Judul Jepang* : ${title}\n*Ejaan Judul* : ${title_romaji}\n`
                    teks += `*Episode* : ${episode.toString()}\n`
                    if ( is_adult == true )
                    {
                        teks += `*Ini Anime Hentai*\n`
                    } else {
                        teks += `*Ini Bukan Hentai*\n`
                    }
                    teks += `*Tayang Perdana* : ${season}\n\n${supp}`
                    var video = `https://trace.moe/thumbnail.php?anilist_id=${anilist_id}&file=${encodeURIComponent(filename)}&t=${at}&token=${tokenthumb}`;
                    client.sendFileFromUrl(from, video, 'anime.jpg', teks, id).catch(() => {
                        client.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    client.reply(from, 'Ada yang Error!', id)
                })
            } else {
                client.sendImage(chatId, dataUrl, 'tutor.jpeg', `Maaf format salah\n\nSilahkan kirim gambar scene anime dengan caption ${prefix}wait atau reply dengan caption ${prefix}wait \n\n*INGAT SCENE ANIME, BUKAN FAN ART*`, id)
            }
            break
// end sauce calon wait

//saucenao

        case 'sauce':
        const  request = require('request');
        const dataUrl1 = './media/x.jpeg'
             if (isMedia) {
                 if (type == 'image') {
                 const buffer = await decryptMedia(message, uaOverride)
                 const filename = `./media/images/sauce.jpg`
                 await fs.writeFile(filename, buffer)

var nucc = Math.random().toString(36).substr(2, 4);
request('https://saucenao.com/search.php?db=999&output_type=2&testmode=1&numres=1&api_key=aba222eb501940e4c86031dcd93b2e3dce9e0e8b&url=http://147.139.170.140:5000/poto/' + nucc, function (error, response, body) {
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
  client.reply(from, 'gunakan perintah !wait untuk mencari judul anime', id)
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
client.sendFileFromUrl(from, video, 'anime.jpg', teks, id).catch(() => {
client.reply(from, teks, id)})
});
                 } else { 
                 client.reply(from, 'Only Images are supported', id)
                 }
             } else if (quotedMsg && quotedMsg.type == 'image') {
                 const buffer = await decryptMedia(quotedMsg, uaOverride)
                 const filename = `./media/images/sauce.jpg`
                 await fs.writeFile(filename, buffer)
                 var nucc = Math.random().toString(36).substr(2, 4);
request('https://saucenao.com/search.php?db=999&output_type=2&testmode=1&numres=1&api_key=aba222eb501940e4c86031dcd93b2e3dce9e0e8b&url=http://147.139.170.140:5000/poto/' + nucc, function (error, response, body) {
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
  client.reply(from, 'gunakan perintah !wait untuk mencari judul anime', id)
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
var date = new Date (isiy.created_at);
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
client.sendFileFromUrl(from, video, 'anime.jpg', teks, id).catch(() => {
client.reply(from, teks, id)})
});
             } else { 
                 client.sendImage(chatId, dataUrl1, 'tutor.jpeg', `Maaf format salah\n\nSilahkan kirim gambar dengan caption ${prefix}sauce atau reply dengan caption ${prefix}sauce`, id)
             }
             break
//end sauce nao               

//menu info anime
        case 'anime':
            const keyword = message.body.replace('!anime', '')
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/anime?q=${keyword}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await client.sendFileFromUrl(from, errorurl2, 'error.png', 'Maaf anime tidak ditemukan', id)
              console.log("Sent!")
              return null
              }
            const { title, synopsis, episodes, url, rated, score, image_url } = parsed.results[0]
            const content = `*Anime Ditemukan!*
*Judul* ${title}

*Total Episode:* ${episodes}

*Rating:* ${rated}

*Score:* ${score}

*Synopsis:* ${synopsis}

*Info Lengkap*: ${url}`

            const image = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            client.sendImage(from, base64, title, content)
           } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', 'Maaf anime tidak ditemukan')
           }
          break
//end info anime

//calon random
        case 'randomanime':
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
                   await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title} \n${supp}`,)
                   } catch(err) {
                       console.log(err)
                       await client.reply(from, 'Kosong???', id) 
                   }
             
            break
// end calon random

//waifu

        case 'waifu':
            const kyc = message.body.replace('!waifu', '')
            if (kyc == '') {
              client.sendFileFromUrl(from, errorurl2, 'error.png', 'Masukan nama waifu kamu + series. Misalnya *!waifu keqing genshin*', id)
              console.log("Sent!")
              return null
              }
            client.reply(from, 'Tunggu sebentar, sedang diproses', id)
            var urj = "http://api.fdci.se/rep.php?gambar=" + kyc;
             axios.get(urj)
  .then((result) => {
    var d = JSON.parse(JSON.stringify(result.data));
    var dewe =  d[Math.floor(Math.random() * d.length)];
                    if (!dewe) {
              client.sendFileFromUrl(from, errorurl2, 'error.png', 'Maaf waifu kamu tidak ditemukan coba *!waifu keqing genshin*', id)
              console.log("Sent!")
              return null
              }
client.sendFileFromUrl(from, dewe, 'anime.jpeg')   
    });
            break

//end penyegar

//penyegar

        case 'penyegar':
            client.reply(from, 'Tunggu sebentar, sedang diproses', id)
            const list = ["Cosplaystyle anime kawaii", "japanese girl", "Cosplaystyle anime women"];
            let kyb = list[Math.floor(Math.random() * list.length)]
            var urk = "http://api.fdci.se/rep.php?gambar=" + kyb;
             axios.get(urk)
  .then((result) => {
    var c = JSON.parse(JSON.stringify(result.data));
    var cewe =  c[Math.floor(Math.random() * c.length)];
client.sendFileFromUrl(from, cewe, 'anime.jpeg', `\n${supp}`)   
    });
            break

//end penyegar

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
   
                   const isnsfw = nsfwgrp.includes(from)
                   if (isGroupMsg) {
                         if ((isGroupMsg) && (isnsfw)) {
                                   await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`)
                         } else if ((isGroupMsg) && (!isnsfw)) {
                                   await client.reply(from, `NSFW mode belum di aktifkan di grup *${name}*. Mintalah admin aktifkan dengan ketik *!aktif nsfw* `, id)
                         }
                   } else { 
                         await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title} \n${supp}`,)
                   }
                   } catch(err) {
                       console.log(err)
                       await client.reply(from, 'Kosong???', id) 
                   }
             
            break

//end penyegar NSFW


//kode nuklir
case 'nh':
const  minta = require('request');
const { exec } = require("child_process");
const nuc = message.body.replace('!nh ', '');

if (isNaN(nuc)) {
    client.reply(from, 'Masukan kode yang benar, misalnya !nh 177013', id)
} else {

minta('http://147.139.170.140/' + nuc, function (error, response, body) {
const data = JSON.parse(body);

if (data.title == null) {
    client.reply(from, 'Kode Tidak Ditemukan. Coba kode lain seperti 177013', id)
} else {

    if (data.details.parodies == null) {
        var parodi = 'original' 
    } else { 
        var parodi = data.details.parodies.join().replace((/[0-9]/g), "")
    };
    if (data.details.artists == null) {
        var pembuat = 'tidak diketahui' 
    } else {
        var pembuat = data.details.artists.join().replace((/[0-9]/g), "")
    };

var teks = `*Judul*: ${data.title} 
*Parodi*: ${parodi}
*Genre*: ${data.details.tags.join().replace((/[0-9]/g), "").replace((/K/g), ", ")}
*Pembuat*: ${pembuat}
*Total Halaman*: ${data.details.pages} halaman
*Upload*: ${data.details.uploaded}
*Link*: ${data.link}`

var video = data.pages[0];

const isnsfw = nsfwgrp.includes(from)
if (isGroupMsg) {
    if ((isGroupMsg) && (isnsfw)) {
        client.sendFileFromUrl(from, video, 'nucc.jpg', teks, id).catch(() => {
            client.reply(from, teks, id)}) 
    } else if ((isGroupMsg) && (!isnsfw)) {
              client.reply(from, `NSFW mode belum di aktifkan di grup *${name}*. Mintalah admin aktifkan dengan ketik *!aktif nsfw* `, id)
    }
} else { 
    client.sendFileFromUrl(from, video, 'nucc.jpg', teks, id).catch(() => {
        client.reply(from, teks, id)}) 
}
};
});
}
break
//end kode nuklir

//tampol
        case 'tampol':
            arg = body.trim().split(' ')
            const person = author.replace('@c.us', '')
            await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif')
            client.sendTextWithMentions(from, '@' + person + ' *nampol* ' + arg[1])
            break
//end tampol


//tampol
case 'kiss':
    arg = body.trim().split(' ')
    const person1 = author.replace('@c.us', '')
    await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/mrCaNIVJcUhj942ZT3/giphy.gif')
    client.sendTextWithMentions(from, '@' + person1 + ' *mencium* ' + arg[1])
    break
//end tampol

        case 'help':
        case 'menu':
        if (!isGroupMsg) {
            client.reply(from, helpdewe(prefix, pushname), id)
        } else {
            client.reply(from, help(prefix, pushname), id)
        }

            break

        case 'admin':
            if(!isGroupMsg) return client.reply(from, 'Hanya untuk grup chat', message.id)
            if(!isGroupAdmins) return client.reply(from, 'Maaf, anda bukan admin', message.id)
            client.reply(from, mimin(prefix, pushname), id)
            break

        case 'info':
            client.reply(from, info, id)
            break

        case 'profile':
            if (quotedMsg) return profile(quotedMsgObj.sender.id, message, fs, groupAdmins, client)
        if (mentionedJidList.length >= 1) return profile(mentionedJidList[1], message, fs, groupAdmins, client)
        return profile(sender.id, message, fs, groupAdmins, client)
            break

        default:
            console.log(color('[PREFIX-CALL]', 'green'), color(time, 'yellow'), 'Command from', color(pushname))
        return
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
