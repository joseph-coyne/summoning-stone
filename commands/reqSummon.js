const fs = require('fs');
module.exports = {
	name: 'reqSummon',
	description: 'Requests to be added the Summoning Stone.',
	execute(msg, members, mod) {
		var newMember = null;
		var emojiList = mod.guild.emojis.cache;
		const summonExists = () => {
			return members.some(function (member) {
				return member.code === `<@${msg.author.id}>`;
			});
		};
		const emojiExists = () => {
			return members.some(function (member) {
				return member.emoji === newMember.emoji;
			});
		};
		const checkEmojiId = (emj) => {
			return emojiList.some((e) => emj == e.id);
		};
		//If the user has not been added, register their username, user ID, and chosen emoji
		if (!summonExists(msg)) {
			var emoji = msg.content.split(' ').slice(1).toString();
			var rx = /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g;
			if (rx.test(emoji)) {
				console.log('Emoji provided is a default emoji');
			} else if (!checkEmojiId(emoji.replace(/\D/g, ''))) {
				console.log(!checkEmojiId(emoji.replace(/\D/g, '')));
				console.log('Emoji provided is from another server');
				msg.reply(
					'That emoji appears to be from another server. Please use a default or Mana server emoji.'
				);
			} else {
				newEmoji = msg.content.replace(/\D/g, '');
				console.log('Emoji provided is a custom Mana emoji');
				console.log('Raw emoji ', emoji);
				console.log('emoji code ', newEmoji);
			}
			newMember = {
				id: `${msg.id}S`,
				name: msg.author.username,
				code: `<@${msg.author.id}>`,
				emoji: newEmoji,
			};

			//Checks if emoji is already assigned to a user
			if (!emojiExists()) {
				var data = fs.readFileSync('db/pending-members.json');
				var json = JSON.parse(data);
				json.newMembers.push(newMember);
				var newMembers = { newMembers: json.newMembers };

				fs.writeFile(
					'db/pending-members.json',
					JSON.stringify(newMembers, null, 2),
					(err) => {
						if (err) throw err;
						newMember = null;
					}
				);
				//Send message for approval to mod channel
				console.log(
					`${newMember.name} has requested to be added to Summoning Stone!`
				);
				mod.send(
					`!Approval Needed: ${newMember.id} \n${newMember.name} would like to be added to Summoning Stone via ${emoji}`
				);
			} else {
				msg.channel.send(
					'That emoji has already been registered in Summoning Stone. Please choose another.'
				);
			}
		} else {
			msg.channel.send('You have already been added!');
		}
	},
};
