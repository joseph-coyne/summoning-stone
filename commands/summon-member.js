module.exports = {

  name: 'summon-member',
  description: 'Mentions the corresponding user when their emoji is reacted to.',
  execute(reaction, user, members) {
    console.log(reaction);
    var emoji = reaction.emoji;
    var mentions = reaction.message.channel.messages.cache;
    var userMention = mentions.map(a => a.content); 
    members.forEach(member => {
      console.log(emoji);
			//Only listens for emojis registered to a user
			if(emoji.id == member.emoji && !userMention.includes(member.code)){
				reaction.message.channel.send(member.code).then(() => {
					reaction.users.remove(user.id);
				}).catch(); 
			} else { //Non-registered emojis are removed
				reaction.users.remove(user.id)
			}
		});
  }
};
