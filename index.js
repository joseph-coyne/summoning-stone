const fs = require ('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const allMembers = require('./members.json');
const members = allMembers.members;

// Channel IDs for quick switching
var labID = '656621576858370078';
var summonID = "756477110159147098";
var newMember = null;
var newEmoji = null;

const helpEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Summoning Stone Commands')
	.setThumbnail('https://static.wikia.nocookie.net/hearthstone_gamepedia/images/3/31/Summoning_Stone_full.png/revision/latest?cb=20151116205516')
	.addFields(
		{ name: '`!addsummon <emoji>`', value: 'Request to be added to the Summoning Stone with the provided emoji'},
		{ name: '`!addemoji <emoji name> <image url> `', value: 'Request a custom emoji to be added to the server. \n *You can also do this with an attachment by including `!addemoji <emoji name>` in the attachment comment.*'},
	);
	
//Clear up to 100 messages within messaged channel
const clearChannel = (c) => {
	console.log('Clearing messages...');
	c.messages.fetch({ limit: 100 }).then((m) => {
		m.forEach(msg => {
			msg.delete();
		});
	});
}

//Post Summoning Message
const summonMsg = (() => {
	var summon = client.channels.cache.get('756477110159147098');
	clearChannel(summon);
	//Update member list
	delete require.cache[require.resolve('./members.json')];
	const allMembers = require('./members.json');
	const members = allMembers.members;
	//Initial Reactions
	summon.send('React to Summon').then((message) => { 
		members.forEach(member => {
			message.react(member.emoji);
		});
	});
})

//Initiate bot
client.on('ready', () => {
	console.log('Summoning Stone online...');
	summonMsg();
});
//Listen for reactions
client.on('messageReactionAdd', (reaction, user) => {
	var mod = client.channels.cache.get('210518926763753484');
	var emoji = reaction.emoji;
	var channel = reaction.message.channel;

  
  if(user.bot) return;

	//Only checks for human reacts in these channels
	if (channel.id == summonID){
    client.commands.get('summon-member').execute(reaction, user, members);
		// members.forEach(member => {
    //   console.log(emoji);
		// 	//Only listens for emojis registered to a user
		// 	if(emoji.id == member.emoji && !userMention.includes(member.code)){
		// 		channel.send(member.code).then(() => {
		// 			reaction.users.remove(user.id);
		// 		}).catch(); 
		// 	} else { //Non-registered emojis are removed
		// 		reaction.users.remove(user.id)
		// 	}
		// });
	};
	//Mod channel acceptance/rejection 
	if (channel.id == mod){
		if (emoji.name === '👍') {
				channel.send('!Approved');
		} else if (emoji.name === '👎') {
			channel.send('!Rejected');
		}
		reaction.message.reactions.removeAll();
  }
  
});
//Listen for messages
client.on('message', (msg) => {
	var emojiList = msg.channel.guild.emojis.cache
	var summon = client.channels.cache.get('756477110159147098');
	var mod = client.channels.cache.get('210518926763753484');
	var lab = client.channels.cache.get('656621576858370078');
	var emoji = msg.content.substr("!addsummon".length).trim();
  var userID = msg.author.id;
  
  //Check for command prefix
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  console.log(command, args)

  //Delete a summon if the user sends a message
	summon.messages.cache.forEach(msg => {
		if(msg.mentions.has(userID)) {
			msg.delete();
		}
	})


	const checkEmojiName = (name) => {
		return emojiList.some(e => e.name == name);
	};
	const checkEmojiId = (emj) => {
		return emojiList.some(e => emj == e.id);
	}
	const addSummon = (msg) => {
		const summonExists = (msg) => {
			return members.some(function(member) {
				return member.code === `<@${msg.author.id}>`;
			}); 
    };
    const emojiExists = () => {
      return members.some(function(member) {
        return member.emoji === newMember.emoji;
      });
    };
		//If the user has not been added, register their username, user ID, and chosen emoji
		if(!summonExists(msg)){
			var originalEmoji = emoji
			emoji = emoji.toString()
			var rx = /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g
			if(rx.test(emoji)) {
				console.log('Emoji provided is a default emoji');
			} else if(!checkEmojiId(emoji.replace(/\D/g,''))) {
				console.log(!checkEmojiId(emoji.replace(/\D/g,'')));
					console.log('Emoji provided is from another server');
					msg.reply('That emoji appears to be from another server. Please use a default or Mana server emoji.');
			} else {
				console.log('Emoji provided is a custom Mana emoji');
				console.log(emoji);
				emoji = msg.content.replace(/\D/g,'');
				console.log(emoji);
			}
			newMember = {
				name: msg.author.username,
				code: `<@${msg.author.id}>`,
				emoji: emoji
			};

			//Checks if emoji is already assigned to a user
			if (!emojiExists()){
				//Send message for approval to mod channel
				mod.send(`!Approval Needed: ${newMember.name} would like to be added to Summoning Stone via ${originalEmoji}`);
			} else {
				msg.channel.send('That emoji has already been registered in Summoning Stone. Please choose another.')
			}
		} else {
			msg.channel.send('You have already been added!');
		}
	};
	const addEmoji = (msg) => {
    var command = msg.content.split(" ");
    var regex = RegExp(/^\w+$/)
    if(regex.test(/^\w+$/)){
      console.log(command);
      if(!msg.attachments.size > 0){
        newEmoji = {"url": command[2], "name": `${command[1].toLowerCase()}`};
      } else {
        newEmoji = {
          "url": msg.attachments.array()[0].url ,"name": command[1].toLowerCase()
        };
      }
      
      if (checkEmojiName(newEmoji.name)){ // Check if emoji name has already been used. 
        msg.channel.send(`An emoji with the name "${newEmoji.name}" already exists. Please choose a different name.`);
      } else {
        msg.reply('Submitted for approval.');
        mod.send(`!Approval Needed: ${msg.author.username} would like to add a custom emoji, ${newEmoji.name}, of this image ${newEmoji.url}`);
        console.log('Custom emoji requested: ')
        console.log(newEmoji);
      }	
    } else {
      msg.reply('Emoji names must only contain alphanumeric and underscore values.)');
    }
	}

	//Global Commands
	if(!msg.author.bot){
		switch (command) {
			case 'help':
				msg.channel.send(helpEmbed);
				break;
			case 'clear':
				clearChannel(msg.channel);
				break;
			case 'addsummon':
				addSummon(msg)
				break;
			case 'addemoji':
				addEmoji(msg);
				break;
			default:
				break;
    }
  } 
  //Mod Channel Commands
  if(msg.channel.id == mod){ 
		//Complete requests if approved
		switch (command) { 		        //If a command needs approval, create reactions for easy approval
      case "Approval":
        msg.react('👍').then(() => msg.react('👎'));
        break;
			case "Approved":
				if (newMember) { 					//Add user to Summoning Stone
					var data = fs.readFileSync('./members.json')
					var json = JSON.parse(data);
					json.members.push(newMember);
					var newMembers = {"members": json.members};
	
					fs.writeFile('members.json', JSON.stringify(newMembers, null, 2), (err) => {
						if (err) throw err;
						console.log(`${newMember.name} has been added to Summoning Stone!`);
						newMember = null;
						clearChannel(lab);
						summonMsg();
					});
					
				} else if (newEmoji) { 		//Add custom emoji
					console.log('Adding new Emoji');
					console.log(newEmoji); 
					msg.channel.guild.emojis.create(newEmoji.url, newEmoji.name)
						.then(emoji => console.log(`Created new emoji with name ${emoji.name}`))
						.catch(console.error);
				
				} else { 								  //Exit if nothing is queued up
					console.log('No pending requests found');
				}
				break;
			case "Rejected":
				console.log('Request rejected.');
				break;
		}
  }
  
});
//Listen for voice channel changes
client.on('voiceStateUpdate', (oldMember, newMember) => {
	var summon = client.channels.cache.get('756477110159147098');
	summon.messages.cache.forEach(msg => {
		if(msg.mentions.has(newMember.id)) {
			msg.delete();
		}
	});

})

client.login(token);