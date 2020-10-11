const fs = require('fs');
module.exports = {
	name: 'addEmoji',
	description: 'Adds the approved emoji to the server.',
	execute(msg, args) {
		delete require.cache[require.resolve('../pending-emoji.json')];
		const pending = require('../pending-emoji.json');
		const pendingEmoji = pending.newEmoji;
		const newEmoji = pendingEmoji.find(({ id }) => id === args.toString());
		if (newEmoji) {
			var filtered = pendingEmoji.filter(function (emj) {
				return emj.id !== newEmoji.id;
			});
			var newPending = { newEmoji: filtered };
			fs.writeFile(
				'pending-emoji.json',
				JSON.stringify(newPending, null, 2),
				(err) => {
					if (err) throw err;
				}
			);
			console.log('Adding new Emoji');
			console.log(newEmoji);
			msg.channel.guild.emojis
				.create(newEmoji.url, newEmoji.name)
				.then((emoji) =>
					console.log(`Created new emoji with name ${emoji.name}`)
				)
				.catch(console.error);
		}
	},
};
