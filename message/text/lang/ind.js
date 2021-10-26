/* eslint-disable quotes */
const fs = require('fs-extra')
const { prefix } = JSON.parse(fs.readFileSync('config.json'))

exports.wait = () => {
    return `Mohon tunggu sebentar kak 😊`
}

exports.ok = () => {
    return `Baiklah`
}

exports.wrongFormat = () => {
    return `Format salah! Silakan cek cara penggunaan di *${prefix}menu*.`
}

exports.emptyMess = () => {
    return `Harap masukkan pesan yang ingin disampaikan!`
}

exports.cmdNotFound = (cmd) => {
    return `Perintah *${prefix}${cmd}* tidak ditemukan!`
}

exports.blocked = (ownerNumber) => {
    return `DILARANG NELPON BOT. KAMU DI BANNED\n\n Donasi ke https://saweria.co/ikkehman untuk membuka blok}`
}

exports.ownerOnly = () => {
    return `Perintah ini hanya untuk master`
}

exports.doneOwner = () => {
    return `Sudah selesai,master~`
}

exports.groupOnly = () => {
    return `Perintah ini hanya bisa digunakan di dalam grup!`
}

exports.adminOnly = () => {
    return `Perintah ini hanya bisa digunakan oleh admin grup!`
}

exports.notNsfw = () => {
    return `NSFW mode belum di aktifkan di grup ini. Mintalah admin aktifkan dengan ketik *!nsfw aktif*`
}

exports.nsfwOn = () => {
    return `NSFW berhasil *diaktifkan*!`
}

exports.nsfwOff = () => {
    return `NSFW berhasil *dinonaktifkan*!`
}

exports.nsfwAlready = () => {
    return `Command NSFW sudah diaktifkan sebelumnya.`
}

exports.nhFalse = () => {
    return `Kode tidak valid!`
}

exports.listBlock = (blockNumber) => {
    return `------[ HALL OF SHAME ]------\n\nTotal diblokir: *${blockNumber.length}* user\n`
}

exports.notPremium = () => {
    return `Maaf! Perintah ini khusus untuk user premium saja.`
}

exports.notAdmin = () => {
    return `Kamu bukan Admin!`
}

exports.adminAlready = () => {
    return `User memang sudah admin!`
}

exports.botNotPremium = () => {
    return `Bot ini tidak mendukung command premium. Silakan hubungi pemilik bot ini.`
}

exports.botNotAdmin = () => {
    return `Jadikan bot sebagai admin terlebih dahulu!`
}


exports.received = (pushname) => {
    return `Halo ${pushname}!\nTerima kasih telah melapor, laporanmu akan kami segera terima.`
}

exports.videoLimit = () => {
    return `Ukuran video terlalu besar!`
}


exports.profile = (username, status, premi, benet, adm,) => {
    return `-----[ *USER INFO* ]-----\n\n➸ *Username*: ${username}\n➸ *Status*: ${status}\n➸ *Premium*: ${premi}\n➸ *Banned*: ${benet}\n➸ *Admin*: ${adm}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
}

exports.detectorOn = (name, formattedTitle) => {
    return `*「 ANTI GROUP LINK 」*\n\nPerhatian untuk penghuni grup ${(name || formattedTitle)}\nGrup ini memiliki anti-group link detector, apabila ada salah satu member mengirim group link di sini maka dia akan ter-kick secara otomatis.\n\nSekian terima kasih.\n- Admin ${(name || formattedTitle)}`
}

exports.detectorOff = () => {
    return `Fitur anti-group link berhasil *dinonaktifkan*!`
}

exports.detectorOnAlready = () => {
    return `Fitur anti-group link telah diaktifkan sebelumnya.`
}

exports.antiNsfwOn = (name, formattedTitle) => {
    return `*「 ANTI NSFW LINK 」*\n\nPerhatian untuk penghuni grup ${(name || formattedTitle)}\nGrup ini memiliki anti-NSFW link detector, apabila ada salah satu member mengirim link NSFW/porn di sini maka dia akan ter-kick secara otomatis.\n\nSekian terima kasih.\n- Admin ${(name || formattedTitle)}`
}

exports.antiNsfwOff = () => {
    return `Fitur anti-NSFW link berhasil *dinonaktifkan*!`
}

exports.antiNsfwOnAlready = () => {
    return `Fitur anti-NSFW link telah diaktifkan sebelumnya.`
}

exports.linkDetected = () => {
    return `*「 ANTI GROUP LINK 」*\n\nKamu mengirim link group chat!\nMaaf tapi kami harus mengeluarkan mu...\nSelamat tinggal~`
}

exports.welcome = (event) => {
    return `Selamat datang @${event.who.replace('@c.us', '')}!\nAku WiBot\n\nSemoga betah terus di grup kami ya~`
}

exports.welcomeOn = () => {
    return `Fitur welcome berhasil *diaktifkan*!`
}

exports.welcomeOff = () => {
    return `Fitur welcome berhasil *dinonaktifkan*!`
}

exports.welcomeOnAlready = () => {
    return `Fitur welcome telah diaktifkan sebelumnya.`
}

exports.gcMute = () => {
    return `*「 MUTED 」*\n\nHanya admin yang dapat mengirim pesan ke grup ini.`
}

exports.gcUnmute = () => {
    return `*「 UNMUTED 」*\n\nSekarang semua anggota dapat mengirim chat di grup ini.`
}

exports.linkNsfw = () => {
    return `*「 ANTI NSFW LINK 」*\n\nKamu telah mengirim link NSFW!\nMaaf, tapi aku harus mengeluarkan mu...`
}


exports.fakeLink = () => {
    return `Ups, link ini terlihat mencurigakan. Demi keamanan grup, aku harus mengeluarkan mu...\n`
}

exports.muteChatOn = () => {
    return `Berhasil *mute* bot pada grup ini!`
}

exports.muteChatOff = () => {
    return `Berhasil *unmute* bot pada grup ini!`
}

exports.muteChatOnAlready = () => {
    return `Mute telah diaktifkan di grup ini sebelumnya!`
}

exports.limit = () => {
    return `
*── 「 LIMIT 」 ──*

Kamu telah mencapai Limit Penggunan! Silakan lakukan hal berikut:
❏ *_Tunggu hingga jam 00:00 WIB_*
❏ *_Donasi untuk dapatkan UNLIMITED_*
Donasi ke https://saweria.co/ikkehman
    `
}


exports.menu = (pushname) => {
    return ` Hai, kak ${pushname}, Kenalin aku Wibot robot buat para Wibu.    

*!adminmenu*  ~>  melihat admin menu

    -----[ *DAFTAR PERINTAH MEMBER* ]-----
*!menu / !help*  ~>  Menampilkan menu utama
*!sticker*  ~>  buat stiker
*!stickergif*  ~>  buat stiker gif/video
*!nimesticker*  ~>  random stiker anime
*!ttg*  ~>  text to gif stiker
*!toimg*  ~>  stiker to image
*!anibatch*  ~>  download anime batch
*!wait*  ~>  cari judul anime
*!sauce*  ~> cari sumber fanart,manga,doujin
*!randomanime*  ~>  gambar anime random
*!neko*  ~>  gambar kucing random
*!waifu*  ~> cari waifu misalnya !waifu nakano miku
*!penyegar*  ~>  penyegar timeline
*!limit*  ~> lihat batas pemakaian 
*!tampol (nama)*  ~>  nampol member 
*!kiss (nama)*  ~> cium member
*!delete*  ~> hapus pesan milik bot
*!report*  ~> report bug
    
    -----[ *DAFTAR PERINTAH NSFW* ]-----
*!nh (kode)*  ~> lihat info kode nuklir
*!randomhentai*  ~>  gambar Hentai random
*!penyegar18*  ~>  penyegar timeline yg lebih segar
*!nhdl (kode)*  ~> download nuklir
*!nhsearch*  ~> cari hentai
*!nekopoi*  ~> hentai terbaru nekopoi
*!nekosearch*  ~> mencari hentai nekopoi
*!yuri*  ~> asupan kebutuhan harian
    
Yuk dukung Wibot untuk beli server baru biar ga lag lagi. Donasi ke https://saweria.co/ikkehman
Made with hateful, crazy and desperate 🤪 by IkkehMan`
}

exports.dewe = (pushname) => {
    return `Hai, kak ${pushname}, Kenalin aku Wibot robot buat para Wibu.   

    -----[ *DAFTAR PERINTAH* ]-----
*!menu / !help*  ~>  Menampilkan menu utama
*!sticker*  ~>  buat stiker
*!stickergif*  ~>  buat stiker gif/video
*!nimesticker*  ~>  random stiker anime
*!ttg*  ~>  text to gif stiker
*!toimg*  ~>  stiker to image
*!anibatch*  ~>  download anime batch
*!wait*  ~>  cari judul anime
*!sauce*  ~> cari sumber fanart,manga,doujin
*!randomanime*  ~>  gambar anime random
*!neko*  ~>  gambar kucing random
*!waifu*  ~> cari waifu misalnya !waifu nakano miku
*!penyegar*  ~>  penyegar timeline
*!limit*  ~> lihat batas pemakaian 
*!tampol (nama)*  ~>  nampol member 
*!kiss (nama)*  ~> cium member
*!delete*  ~> hapus pesan milik bot
*!report*  ~> report bug
    
    -----[ *DAFTAR PERINTAH NSFW* ]-----
*!nh (kode)*  ~> lihat info kode nuklir
*!randomhentai*  ~>  gambar Hentai random
*!penyegar18*  ~>  penyegar timeline yg lebih segar
*!nhdl (kode)*  ~> download nuklir
*!nhsearch*  ~> cari hentai
*!nekopoi*  ~> hentai terbaru nekopoi
*!nekosearch*  ~> mencari hentai nekopoi
*!yuri*  ~> asupan kebutuhan harian
    
    Yuk dukung Wibot untuk beli server baru biar ga lag lagi. Donasi ke https://saweria.co/ikkehman
    Made with hateful, crazy and desperate 🤪 by IkkehMan
    `
}

exports.adminmenu = (pushname) => {
    return `Halo, admin ${pushname},  

-----[ *DAFTAR PERINTAH ADMIN* ]-----
*!welcome aktif*  ~>  mengaktifkan selamat datang
*!welcome nonaktif*  ~>  mengnonaktifkan selamat datang
*!promote (nomor)*  ~> menjadikan member admin
*!demote (nomor)*  ~> melepas status admin
*!add (nomor)*  ~>  add member
*!nsfw aktif*  ~>  mengaktifkan mode NSFW
*!nsfw nonaktif*  ~>  mengnonaktifkan mode NSFW
*!mutegc aktif*  ~>  GC hanya admin
*!mutegc nonaktif*  ~>  GC semua member
*!kick*  ~>  kick member

Yuk dukung Wibot untuk beli server baru biar ga lag lagi. Donasi ke https://saweria.co/ikkehman
Made with hateful, crazy and desperate 🤪 by IkkehMan
    `
}

exports.rules = () => {
    return `
-----[ RULES ]-----

Rules? I am the rules!!!
    `
}