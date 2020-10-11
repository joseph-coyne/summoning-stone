module.exports = {
	name: 'modReview',
	description: 'Send approval status once item has been reviewed.',
	execute(reaction) {
		var args = reaction.message.content.split(' ');
		var id = args[2];
		if (reaction.emoji.name === '👍') {
			reaction.message.channel.send(`!Approved ${id}`);
		} else if (reaction.emoji.name === '👎') {
			reaction.message.channel.send('!Rejected');
		}
		reaction.message.reactions.removeAll();
	},
};
