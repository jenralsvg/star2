const {
  WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey,
   mentionedJid,
   processTime,
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const lolis = require('lolis.life')
const loli = new lolis()
const crypto = require('crypto')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const vcard = 'BEGIN:VCARD\n' // VCARD Penting, Jangan Di Ubah.
            + 'VERSION:3.0\n' // Version.
            + 'FN:JRL Enzet\n' // Ubah Namamu.
            + 'ORG:Owner BOT;\n' // Ubah Aja Kalo Mau.
            + 'TEL;type=CELL;type=VOICE;waid=6281253534285:+62 812-5353-4285\n' // Ubah Nomor.
            + 'END:VCARD' // Ubah Aja Kalo Tidak Eror
prefix = '#'
blocked = []
cr = 'JRL Enzet BOT'

//Load Menu
const { help } = require('./src/help')
const { donasi } = require('./src/donasi')
const { simple } = require('./database/menu/simple')
const { gabut } = require('./database/menu/gabut')
const { groupm } = require('./database/menu/group')
const { download } = require('./database/menu/download')
const { other } = require('./database/menu/other')
const { owb } = require('./database/menu/owb')
const { maker } = require('./database/menu/maker')
const { sound } = require('./database/menu/sound')
const { muslim } = require('./database/menu/islam')

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

async function starts() {
	const enzet = new WAConnection()
	enzet.logger.level = 'warn'
	console.log(banner.string)
	enzet.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan Code QR Nya Boss'))
	})

	fs.existsSync('./Ilham.json') && enzet.loadAuthInfo('./Ilham.json')
	enzet.on('connecting', () => {
		start('2', 'Connecting...')
	})
	enzet.on('open', () => {
		success('2', 'Connected')
	})
	await enzet.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./Ilham.json', JSON.stringify(enzet.base64EncodedAuthInfo(), null, '\t'))

	enzet.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await enzet.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await enzet.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Haii @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*`
				let buff = await getBuffer(ppimg)
				enzet.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
				work = fs.readFileSync('./assets/bergabung.opus');
            enzet.sendMessage(from, work, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await enzet.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `*Terimah Kasih Telah Join... @${num.split('@')[0]}👋*`
				let buff = await getBuffer(ppimg)
				enzet.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

	enzet.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	enzet.on('chat-update', async (mek) => {
		try {
                        if (!mek.hasNewMessage) return
                        mek = JSON.parse(JSON.stringify(mek)).messages[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const BarBar = 'YOUR_APIKEY'
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)
			        const tescuk = ["0@s.whatsapp.net"]

			mess = {
				wait: '*[ WAIT ] Sedang di proses...*',
				success: '[ 𝐁𝐞𝐫𝐡𝐚𝐬𝐢𝐥 ]',
				error: {
					stick: '*「 GAGAL 」 Coba Ulangi Beberapa Saat Lagi...*',
					Iv: '[ GAGAL ] Link Tidak Valid...'
				},
				only: {
					group: '[❗] Perintah ini hanya bisa di gunakan dalam group!',
					ownerG: '[❗] Perintah ini hanya bisa di gunakan oleh owner group!',
					ownerB: '[❗] Perintah ini hanya bisa di gunakan oleh owner bot!',
					admin: '[❗] Perintah ini hanya bisa di gunakan oleh admin group!',
					Badmin: '[❗] Perintah ini hanya bisa di gunakan ketika bot menjadi admin!'
				}
			}

			const botNumber = enzet.user.jid
			const ownerNumber = ["6281253534285@s.whatsapp.net"] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await enzet.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				enzet.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				enzet.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? enzet.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : enzet.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}
			
const createSerial = (size) => {
      return crypto.randomBytes(size).toString('hex').slice(0, size)

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'help':
	case 'menu':
	   enzet.sendMessage(from, help(prefix), text, tescuk, cr)
	break
					case 'donasi':
	case 'donate':
	   enzet.sendMessage(from, donasi(prefix), text, tescuk, cr)
	break
				case 'info':
					me = enzet.user
					uptime = process.uptime()
					teks = `*𝐍𝐚𝐦𝐚 𝐁𝐨𝐭* : ${me.name}\n*𝐍𝐨𝐦𝐨𝐫 𝐁𝐨𝐭* : @${me.jid.split('@')[0]}\n*𝐏𝐫𝐞𝐟𝐢𝐱* : ${prefix}\n*𝐓𝐨𝐭𝐚𝐥 𝐁𝐥𝐨𝐜𝐤 𝐂𝐨𝐧𝐭𝐚𝐜𝐭* : ${blocked.length}\n*𝐁𝐨𝐭 𝐀𝐤𝐭𝐢𝐟* : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					enzet.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
	case 'heppymenu':
	   enzet.sendMessage(from, gabut(prefix), text, tescuk, cr)
	break
	case 'islammenu':
	   enzet.sendMessage(from, muslim(prefix), text, tescuk, cr)
	break
	case 'makermenu':
	   enzet.sendMessage(from, maker(prefix), text, tescuk, cr)
	break
	case 'soundmenu':
	   enzet.sendMessage(from, sound(prefix), text, tescuk, cr)
	break
	case 'groupmenu':
	   enzet.sendMessage(from, groupm(prefix), text, tescuk, cr)
	break
	case 'developermenu':
	   enzet.sendMessage(from, owb(prefix), text, tescuk, cr)
	break
	case 'downloadmenu':
	   enzet.sendMessage(from, download(prefix), text, tescuk, cr)
	break
	case 'othermenu':
	   enzet.sendMessage(from, other(prefix), text, tescuk, cr)
	break
				case 'blocklist':
					teks = '𝐋𝐢𝐬𝐭 𝐁𝐞𝐛𝐚𝐧 𝐊𝐨𝐧𝐭𝐚𝐤 :\n'
					for (let block of blocked) {
						teks += `➢ @${block.split('@')[0]}\n`
					}
					teks += `𝐓𝐨𝐭𝐚𝐥 : ${blocked.length}`
					enzet.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await enzet.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('𝐊𝐢𝐫𝐢𝐦 𝐅𝐨𝐭𝐨...')
					}
					break
				case 'stiker':
				case 'sticker':
				case 'stickergif':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await enzet.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								enzet.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await enzet.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								enzet.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await enzet.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-Apikey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								enzet.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await enzet.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								enzet.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
					}
					break
				case 'tts':
					if (args.length < 1) return enzet.sendMessage(from, '𝐓𝐭𝐬 ? 𝐓𝐚𝐦𝐛𝐚𝐡𝐤𝐚𝐧 𝐊𝐚𝐭𝐚 𝐊𝐮𝐧𝐜𝐢 𝐂𝐨𝐧𝐭𝐨𝐡 ${prefix}𝐭𝐭𝐬 𝐢𝐝', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return enzet.sendMessage(from, '𝐒𝐞𝐥𝐚𝐢𝐧 𝐊𝐚𝐭𝐚 𝐊𝐮𝐧𝐜𝐢 𝐀𝐧𝐝𝐚 𝐇𝐚𝐫𝐮𝐬 𝐌𝐞𝐦𝐚𝐬𝐮𝐤𝐚𝐧 𝐓𝐞𝐱𝐭', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					dtt.length > 600
					? reply('𝐊𝐞𝐩𝐚𝐧𝐣𝐚𝐧𝐠𝐚𝐧 𝐒𝐚𝐲𝐚𝐧𝐠:)')
					: gtts.save(ranm, dtt, function() {
						enzet.sendMessage(from, fs.readFileSync(ranm), audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
						fs.unlinkSync(ranm)
					})
					break
case 'quran':     
	              anu = await fetchJson(`https://api.banghasan.com/quran/format/json/acak`, {method: 'get'})
                  quran = `${anu.acak.ar.teks}\n\n${anu.acak.id.teks}\nQ.S ${anu.surat.nama} ayat ${anu.acak.id.ayat}`
	              enzet.sendMessage(from, quran, text, {quoted: mek})
			      break
case 'kisahnabi':
                  dudo2 = body.slice(11)
                  if (args.length < 1) return reply('Kirim perintah ${prefix}Kisahnabi nama nabi\nContoh : ${prefix}KisahNabi Adam')
                  reply(mess.wait)
                  res = await fetchJson(`https://kisahnabi-api-zhirrr.vercel.app/api/searchnabi?q=${dudo2}`)
                  if (anu.error) return reply('Maaf, nama nabi yang anda masukkan salah')
                  teks = `Nama : *${res.data.nabi.nama}*\nLahir : *${res.data.nabi.lahir}*\nUmur : *${res.data.nabi.umur}*\nTempat : *${res.data.nabi.tempat}*\n\nKisah : ${res.data.nabi.kisah}`
                  reply(teks)
                  break
case 'batteltext':
                   gh = body.slice(12)
                   gl1 = gh.split("|")[0];
                   gl2 = gh.split("|")[1];
                   if (args.length < 1) return reply('BattelText ? Tambahkan Text ${prefix}BattelText JRL Enzet|BOT')
                   reply(mess.wait)
                   anu = await fetchJson(`https://ferdiz-api.herokuapp.com/api/battlefield?text=${gl1}&text2=${gl2}`, {method: 'get'})
                   buff = await getBuffer(anu.result)
                   enzet.sendMessage(from, buff, image, {quoted: mek})
                   break
case 'meme':
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					enzet.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
case 'memeindo':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					enzet.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`𝐏𝐫𝐞𝐟𝐢𝐤 𝐁𝐞𝐫𝐡𝐚𝐬𝐢𝐥 𝐃𝐢 𝐔𝐛𝐚𝐡 𝐉𝐚𝐝𝐢 : ${prefix}`)
					break
case 'owner':
case 'creator':
                  enzet.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek})
               enzet.sendMessage(from, '*Ni Owner BOT  Enzet Jika Ingin Bertanya Seputar Bot Silahkan*',MessageType.text, { quoted: mek} )
                break
 case 'lirik':
					if (args.length < 1) return reply('Nama lagunya apa kak?')          
					tels = body.slice(7)
					anu = await fetchJson(`https://ferdiz-api.herokuapp.com/api/lirik?judul=${tels}`, {method: 'get'})
					reply(anu.result)
					break
case 'loli':
				    reply(mess.wait)
					anu = await fetchJson(`https://ferdiz-api.herokuapp.com/api/loli`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					enzet.sendMessage(from, buffer, image, {quoted: mek, caption: 'Loli Ni Boss'})
					break				
/*case 'nsfwloli':
					if (!isNsfw) return reply('❌ *FALSE* ❌')
					loli.getNSFWLoli(async (err, res) => {
						if (err) return reply('❌ *ERROR* ❌')
						buffer = await getBuffer(res.url)
						enzet.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
					})
					break*/
case 'hilih':
					if (args.length < 1) return reply('Teksnya mana um?')
					anu = await fetchJson(`https://ferdiz-api.herokuapp.com/api/hilih?text=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
case 'quotes':
				enzet.updatePresence(from, Presence.composing) 
				data = await fetchJson(`https://ferdiz-api.herokuapp.com/api/randomquotes`)
				ez = `Author :* ${data.author}\nQuotes :* ${data.quotes}`
				reply(ez)
				break
case 'ytmp3':
					if (args.length < 1) return reply('Urlnya mana bang?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://ferdiz-api.herokuapp.com/api/yta?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					enzet.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					enzet.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
case 'ytmp4':
                    if (args.length < 1) return reply('Urlnya mana bang?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
                    ferdi = await fetchJson(`https://ferdiz-api.herokuapp.com/api/ytv?url=${args[0]}`, {method: 'get'})
                    if (anu.error) return reply(anu.error)
                    teks = `*Title* : ${anu.title}\n*Filesize* :${anu.filesize}`
                    thumb = await getBuffer(anu.thumb)
                    enzet.sendMessage(from, thumb, image, {quoted: mek, caption : teks})
                    buffer = await getBuffer(anu.result)
                    enzet.sendMessage(from, buffer, video, {mimetype: 'video/mp4', filename: `${anu.title}.mp4`, quoted: mek})
                    break
case 'ytstalk':
					if (args.length < 1) return reply('Yang mau di cari apaan? ')
					anu = await fetchJson(`https://mhankbarbar.tech/api/ytsearch?q=${body.slice(10)}&apiKey=${BarBar}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
case 'tiktod':
					if (args.length < 1) return reply('Urlnya mana Ngab?')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.tech/api/tiktok?url=${args[0]}&apiKey=${BarBar}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					enzet.sendMessage(from, buffer, video, {quoted: mek})
					break
case 'tiktokstalk':
					try {
						if (args.length < 1) return enzet.sendMessage(from, 'Usernamenya mana sayang:)?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						enzet.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 𝐓𝐢𝐝𝐚𝐤 𝐕𝐚𝐥𝐢𝐝')
					}
					break
case 'nulis':
case 'tulis':
					if (args.length < 1) return reply('Yang mau di tulis apaan? Aku kah?')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://ferdiz-api.herokuapp.com/api/nulis?kata=${teks}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					enzet.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
case 'ssweb':
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('Tipenya apa um?')
					if (!tipelist.includes(args[0])) return reply('Tipe desktop|tablet|mobile')
					if (args.length < 2) return reply('Urlnya mana um?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbar.tech/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${BarBar}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					enzet.sendMessage(from, buff, image, {quoted: mek})
					break
case 'ttp':
case 'tsticker':
					if (args.length < 1) return reply('Textnya mana om?')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(4).trim()
					anu = await fetchJson(`https://mhankbarbar.tech/api/text2image?text=${teks}&apiKey=${BarBar}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						enzet.sendMessage(from, fs.readFileSync(rano), sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*#* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
                                case 'tagall2':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `╠➢ @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					reply(teks)
					break
                                case 'tagall3':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `╠➢ https://wa.me/${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					enzet.sendMessage(from, teks, text, {detectLinks: false, quoted: mek})
					break
				case 'clearall':
					if (!isOwner) return reply('[❗] 𝐅𝐢𝐭𝐮𝐫𝐞 𝐈𝐧𝐢 𝐇𝐚𝐧𝐲𝐚 𝐁𝐢𝐬𝐚 𝐃𝐢 𝐆𝐮𝐧𝐚𝐤𝐚𝐧 𝐎𝐥𝐞𝐡 𝐎𝐰𝐧𝐞𝐫?')
					anu = await enzet.chats.all()
					enzet.setMaxListeners(25)
					for (let _ of anu) {
						enzet.deleteChat(_.jid)
					}
					reply('Sukses delete all chat :)')
					break
                                case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Berhasil Promote\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(from, mentioned, true)
						enzet.groupRemove(from, mentioned)
					} else {
						mentions(`Berhasil Promote @${mentioned[0].split('@')[0]} Sebagai Admin Group!`, mentioned, true)
						enzet.groupMakeAdmin(from, mentioned)
					}
					break
				case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Berhasil Demote\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						enzet.groupRemove(from, mentioned)
					} else {
						mentions(`Berhasil Demote @${mentioned[0].split('@')[0]} Menjadi Member Group!`, mentioned, true)
						enzet.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Format Anda [ Salah ] Silahkan Ketik ${prefix}add Nomor Target?')
					if (args[0].startsWith('08')) return reply('Gunakan kode negara untuk memasukin teman kegrup')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						enzet.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('[ Gagal ] menambahkan target, mungkin karena di private')
					}
					break
				case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = '𝐁𝐢𝐬𝐦𝐢𝐥𝐥𝐚𝐡, 𝐇𝐞𝐚𝐝𝐬𝐡𝐨𝐨𝐭 𝐊𝐚𝐮 :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						enzet.groupRemove(from, mentioned)
					} else {
						mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
						enzet.groupRemove(from, mentioned)
					}
					break
				case 'admin':
					if (!isGroup) return reply(mess.only.group)
					teks = `𝐋𝐢𝐬𝐭 𝐀𝐝𝐦𝐢𝐧 𝐃𝐢 𝐆𝐑𝐎𝐔𝐏 *${groupMetadata.subject}*\n𝐓𝐨𝐭𝐚𝐥 : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
                                case 'linkgrup':
                                        if (!isGroup) return reply(mess.only.group)
                                        if (!isGroupAdmins) return reply(mess.only.admin)
                                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                        linkgc = await enzet.groupInviteCode(from)
                                        reply('https://chat.whatsapp.com/'+linkgc)
                                        break
                                case 'leave':
                                        if (!isGroup) return reply(mess.only.group)
                                        if (isGroupAdmins || isOwner) {
                                            enzet.groupLeave(from)
                                        } else {
                                            reply(mess.only.admin)
                                        }
                                        break
				case 'toimg':
					if (!isQuotedSticker) return reply('[❗] 𝐑𝐞𝐩𝐥𝐲 𝐒𝐭𝐢𝐤𝐞𝐫𝐧𝐲𝐚 𝐔𝐧𝐭𝐮𝐤 𝐌𝐞𝐧𝐠𝐠𝐮𝐧𝐚𝐤𝐚𝐧 𝐅𝐢𝐭𝐮𝐫𝐞 𝐈𝐧𝐢')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await enzet.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('[❗] Gagal, pada saat mengkonversi sticker ke gambar')
						buffer = fs.readFileSync(ran)
						enzet.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					break
				case 'simi':
					if (args.length < 1) return reply('Textnya mana um?')
					teks = body.slice(5)
					anu = await simih(teks) //fetchJson(`https://mhankbarbars.herokuapp.com/api/samisami?text=${teks}`, {method: 'get'})
					//if (anu.error) return reply('Simi ga tau kak')
					reply(anu)
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝐒𝐢𝐦𝐢𝐡 ? 𝐓𝐚𝐦𝐛𝐚𝐡𝐤𝐚𝐧 𝐊𝐚𝐭𝐚 𝐊𝐮𝐧𝐜𝐢')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('𝐅𝐢𝐭𝐮𝐫𝐞 𝐒𝐢𝐦𝐢 𝐒𝐮𝐝𝐚𝐡 𝐀𝐤𝐭𝐢𝐟...')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukses mengaktifkan mode simi di group ini 🎭')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukes menonaktifkan mode simi di group ini 👻')
					} else {
						reply('*Kata Kunci 💤 [ 1 ] untuk mengaktifkan, [ 0 ] untuk menonaktifkan*')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('𝐖𝐞𝐥𝐜𝐨𝐦𝐞 ? 𝐓𝐚𝐦𝐛𝐚𝐡𝐤𝐚𝐧 𝐊𝐚𝐭𝐚 𝐊𝐮𝐧𝐜𝐢')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('𝐅𝐢𝐭𝐮𝐫𝐞 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐒𝐮𝐝𝐚𝐡 𝐀𝐤𝐭𝐢𝐟...')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Sukses mengaktifkan fitur welcome di group ini 🎭')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('*Sukses menonaktifkan fitur welcome di group ini* 👻')
					} else {
						reply('*Kata Kunci 💤 [ 1 ] untuk mengaktifkan, [ 0 ] untuk menonaktifkan*')
					}
                                      break
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Tag target yang ingin di clone')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await enzet.getProfilePicture(id)
						buffer = await getBuffer(pp)
						enzet.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('[ Gagal ] Coba Ulangi Beberapa Saat Lagi')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await enzet.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							enzet.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('Di Harapkan Untuk Foto Saja')
					}
					break
case 'iri':
const irimp3 = fs.readFileSync('./assets/iri.mp3');
enzet.sendMessage(from, irimp3, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break
case 'pale':
const pa = fs.readFileSync('assets/pale.mp3')
enzet.sendMessage(from, pa, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break
case 'sound':
const soun = fs.readFileSync('assets/sound.mp3')
enzet.sendMessage(from, soun, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break 
case 'sound1':
satu = fs.readFileSync('./assets/sound1.mp3');
enzet.sendMessage(from, satu, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break
case 'sound2':
dua = fs.readFileSync('./assets/sound2.mp3');
enzet.sendMessage(from, dua, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break
case 'sound3':
tiga = fs.readFileSync('./assets/sound3.mp3');
enzet.sendMessage(from, tiga, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break
case 'sound4':
empat = fs.readFileSync('./assets/sound4.mp3');
enzet.sendMessage(from, empat, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break
case 'sound5':
lima = fs.readFileSync('./assets/sound5.mp3');
enzet.sendMessage(from, lima, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break
case 'sound6':
enam = fs.readFileSync('./assets/sound6.mp3');
enzet.sendMessage(from, enam, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break
case 'sound7':
tujuh = fs.readFileSync('./assets/sound7.mp3');
enzet.sendMessage(from, tujuh, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
break		

				default:
					if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[WARN]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
