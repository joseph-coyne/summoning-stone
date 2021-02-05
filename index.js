const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const allMembers = require('./db/members.json');
const members = allMembers.members;

// Channel IDs for quick switching
const channels = require('./db/channels.json');

//Initiate bot
client.on('ready', () => {
	var summon = client.channels.cache.get(channels.summon);
	client.commands.get('clearChannel').execute(summon);
	client.commands.get('summonMessage').execute(summon);
});
//Listen for reactions
client.on('messageReactionAdd', (reaction, user) => {
	var channel = reaction.message.channel;

	if (user.bot) return;

	//Only checks for human reacts in these channels
	if (channel.id == channels.summon) {
		client.commands.get('summonMember').execute(reaction, user, members);
	}
	//Mod channel acceptance/rejection
	if (channel.id == channels.mod) {
		client.commands.get('modReview').execute(reaction);
	}
});
//Listen for messages
client.on('message', (msg) => {
	var summon = client.channels.cache.get(channels.summon);
	var mod = client.channels.cache.get(channels.mod);
	var cracks = client.channels.cache.get(channels.cracks);
	var userID = msg.author.id;

	//Delete a summon if the user sends a message
	summon.messages.cache.forEach((msg) => {
		if (msg.mentions.has(userID)) {
			msg.delete();
		}
	});

	//Check for command prefix
	if (!msg.content.startsWith(prefix)) return;
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift();
	//Global Commands

	if (!msg.author.bot) {
		switch (command) {
			case 'help':
				// msg.channel.send(helpEmbed);
				client.commands.get('help').execute(msg);
				break;
			case 'clear':
				client.commands.get('clearChannel').execute(msg.channel);
				break;
			case 'addsummon':
				client.commands.get('reqSummon').execute(msg, members, mod);
				break;
			case 'addemoji':
				client.commands.get('reqEmoji').execute(msg, members, mod);
				break;
			default:
				break;
		}
		// if(msg.content.startsWith(prefix + command)) client.commands.get(command).execute(msg, members, mod);
	}
	//Mod Channel Commands
	if (msg.channel.id == mod) {
		if (msg.author.bot) {
			pend = args.toString();

			switch (
				command //If a command needs approval, create reactions for easy approval
			) {
				case 'Approval':
					msg.react('👍').then(() => msg.react('👎'));
					break;
				case 'Approved':
					if (pend.endsWith('S')) {
						//Add user to Summoning Stone
						client.commands.get('addSummon').execute(args);
						client.commands.get('clearChannel').execute(summon);
						client.commands.get('summonMessage').execute(summon);
					} else if (pend.endsWith('E')) {
						//Add custom emojin(msg, args);
					}
					break;
				case 'Rejected':
					console.log('Request rejected.');
					break;
			}
		} else {
			switch (command) {
				case 'crack':
					console.log('crack');
					client.commands.get('embedLink').execute(msg, cracks);
					break;
			}
		}
	}
});
//Listen for voice channel changes
client.on('voiceStateUpdate', (oldMember, newMember) => {
	var summon = client.channels.cache.get(channels.summon);
	summon.messages.cache.forEach((msg) => {
		if (msg.mentions.has(newMember.id)) {
			msg.delete();
		}
	});
});

client.login(token);
