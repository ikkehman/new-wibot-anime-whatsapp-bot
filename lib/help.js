// edit it to change the bot's name
const botname = 'WiBot' 

function help(prefix, pushname) {
    return `Hai, kak ${pushname}, Kenalin aku ${botname} robot buat para Wibu.

!admin  =>  admin menu

*DAFTAR PERINTAH MEMBER*
!menu / !help  =>  Menampilkan menu utama

!sticker  =>  buat stiker

!anime (judul) misalnya !anime naruto  =>  lihat info anime

!wait  =>  cari judul anime

!sauce => cari sumber fanart,manga,doujin

!randomanime  =>  gambar anime random

!penyegar  =>  penyegar timeline

!tampol (nama)  =>  nampol member 

*DAFTAR PERINTAH NSFW*
!nh (kode) misalnya !nh 177013 => lihat info kode nuklir

!randomhentai  =>  gambar Hentai random

!penyegar18  =>  penyegar timeline yg lebih segar

!delete kemudian reply => hapus pesan milik bot

Made with hateful, crazy and desperate 🤪 by IkkehMan`
}

function helpdewe(prefix, pushname) {
    return `Hai, kak ${pushname}, Kenalin aku ${botname} robot buat para Wibu.

*DAFTAR PERINTAH*
!menu / !help  =>  Menampilkan menu utama

!sticker  =>  membuat stiker

!nh (kode) misalnya !nh 177013 => lihat info kode nuklir

!anime (judul) misalnya !anime naruto  =>  lihat info anime

!wait  => cari judul anime

!sauce => cari sumber fanart, manga, doujin

!randomanime  =>  gambar anime random

!randomhentai  =>  gambar Hentai random

!penyegar  =>  penyegar timeline

!penyegar18  =>  penyegar timeline yang lebih segar 

Made with hateful, crazy and desperate 🤪 by IkkehMan`
}

function mimin(prefix, pushname) {
    return `Hai, admin ${pushname}, Kenalin aku ${botname} robot buat para Wibu.

*DAFTAR PERINTAH ADMIN*
!groupinfo  =>  melihat info grup

!deskripsi (masukan deskripsi)=>  mengganti deskripsi grup

!promote (nomor) => menjadikan member admin

!add (nomor)  =>  add member

!ban  =>  mute member

!unban  =>  unmute member

!aktif nsfw  =>  mengaktifkan mode NSFW

!nonaktif nsfw  =>  mengnonaktifkan mode NSFW

!kick  =>  kick member

!groupinfo  =>  melihat info grup

Made with hateful, crazy and desperate 🤪 by IkkehMan`
}

module.exports = { info, help, helpdewe, mimin }
function info() {
    return `INFO!`
}


