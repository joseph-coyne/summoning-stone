const fs = require('fs');
module.exports = {
	name: 'reqEmoji',
	description: 'Requests for a custom emoji to be added to the server.',
	execute(msg, members, mod) {
		delete require.cache[require.resolve('../pending-emoji.json')];
		var emojiList = msg.channel.guild.emojis.cache;
		var command = msg.content.replace(/ +(?= )/g, '');
		command = command.split(' ');

		const checkEmojiName = (name) => {
			return emojiList.some((e) => e.name == name);
		};

		if (command[1].includes('-') || command[1].includes('.'))
			command[1] = command[1].replace(/[.-]/g, '_');
		var regex = RegExp(/^\w+$/);
		console.log(command);
		if (regex.test(command[1])) {
			if (!msg.attachments.size > 0) {
				newEmoji = {
					id: `${msg.id}E`,
					url: command[2],
					name: command[1].toLowerCase(),
				};
			} else {
				newEmoji = {
					id: `${msg.id}E`,
					url: msg.attachments.array()[0].url,
					name: command[1].toLowerCase(),
				};
			}
			if (checkEmojiName(newEmoji.name)) {
				// Check if emoji name has already been used.
				msg.channel.send(
					`An emoji with the name "${newEmoji.name}" already exists. Please choose a different name.`
				);
			} else {
				fs.readFile('./pending-emoji.json', (err, data) => {
					var json = JSON.parse(data);
					json.newEmoji.push(newEmoji);
					var pendingEmoji = { newEmoji: json.newEmoji };

					fs.writeFile(
						'pending-emoji.json',
						JSON.stringify(pendingEmoji, null, 2),
						(err) => {
							if (err) throw err;
						}
					);
				});
				msg.reply('Submitted for approval.');
				mod.send(
					`!Approval Needed: ${newEmoji.id} \n${msg.author.username} would like to add a custom emoji, ${newEmoji.name}, of this image ${newEmoji.url}`
				);
				console.log('Custom emoji requested: ');
				console.log(newEmoji);
			}
		} else {
			console.log(`${command[1]} not valid emoji name.`);
			msg.reply('Emoji names must only contain alphanumeric values)');
		}
	},
};
