const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Sends a message that displays all available commands.',
	execute(msg) {
		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Summoning Stone Commands')
			.setThumbnail(
				'https://static.wikia.nocookie.net/hearthstone_gamepedia/images/3/31/Summoning_Stone_full.png/revision/latest?cb=20151116205516'
			)
			.addFields(
				{
					name: '`!addsummon <emoji>`',
					value:
						'Request to be added to the Summoning Stone with the provided emoji',
				},
				{
					name: '`!addemoji <emoji name> <image url> `',
					value:
						'Request a custom emoji to be added to the server. \n *You can also do this with an attachment by including `!addemoji <emoji name>` in the attachment comment.*',
				}
			);
		msg.channel.send(helpEmbed);
	},
};
