const { create } = require('@open-wa/wa-automate')
const msgHandler = require('./msgHandler')
const fs = require('fs-extra')
const serverOption = {
    headless: true,
    cacheEnabled: false,
    useChrome: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
    serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
    serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
    serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async (client) => {
        global.sclient = client
	sendingSticker = []
    	queueSticker = []
    	global.sendingAnimatedSticker = []
    	global.queueAnimatedSticker = []
    	global.amdownloaden = []
    	global.queuemp3 = []
    	global.queuemp4 = []
    	spamarr = []
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
        })
        // listening on message
        client.onMessage((message) => {
            msgHandler(client, message)
        })

       
        
        client.onAddedToGroup((chat) => {
            const dataUrl1 = './media/images/me-min.jpg'
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 2) { 
            	client.sendText(chat.id, `Grup cuma punya ${totalMem} member, WiBot cuma mau bergabung di grup minimal 20 orang`).then(() => client.leaveGroup(chat.id))
            	client.deleteChat(chat.id)
            } else {
                client.sendImage(chat.groupMetadata.id, dataUrl1, 'me-min.jpg', `Makasih udah invite WiBot di grup *${chat.contact.name}*. Ketik !menu untuk melihat menu`)
            }
        })

        // listening on Incoming Call
        client.onIncomingCall((call) => {
            client.sendText(call.peerJid, '...')
            client.contactBlock(call.peerJid)
            ban.push(call.peerJid)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
        })
    }

create('session', serverOption)
    .then(async (client) => startServer(client))
    .catch((error) => console.log(error))
