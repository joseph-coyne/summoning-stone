const Discord = require('discord.js');
module.exports = {
	name: 'embedLink',
	description: 'Dynamically embeds a link',
	execute(msg, cracks) {
		const linkInfo = {};
		const msgContent = msg.content.split('~');
		linkInfo.img = msg.attachments.array()[0].url;
		linkInfo.url = msgContent[1];
		linkInfo.title = msgContent[2];
		linkInfo.description = msgContent[3];
		linkInfo.link = msgContent[4];
		linkInfo.size = msgContent[5];
		const linkEmbed = new Discord.MessageEmbed()
			.setColor('#FF0000')
			.setTitle(linkInfo.title)
			.setThumbnail(linkInfo.img)
			.setURL(linkInfo.url)
			.addFields({
				name: linkInfo.size,
				value: linkInfo.description,
				inline: true,
			})
			.addFields({ name: ' \u200b', value: `[Steam Page](${linkInfo.link})` });

		// .setImage(linkInfo.img)
		cracks.send(linkEmbed);
	},
};
