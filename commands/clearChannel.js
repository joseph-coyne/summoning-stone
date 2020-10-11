module.exports = {
	name: 'clearChannel',
	description: 'Deletes the last 100 messages',
	execute(msg) {
		console.log('Clearing messages...');
		msg.messages.channel.messages.fetch({ limit: 100 }).then((m) => {
			m.forEach((ms) => {
				ms.delete();
			});
		});
	},
};
