const fs = require('fs');
module.exports = {
	name: 'addSummon',
	description: 'Adds the approved member to the Summoning Stone',
	execute(args) {
    console.log('firing');
		delete require.cache[require.resolve('../db/pending-members.json')];
		const pending = require('../db/pending-members.json');
		const pendingMembers = pending.newMembers;
		const newMember = pendingMembers.find(({ id }) => id === args.toString());
		if (newMember) {
			delete newMember.id;

			fs.readFile('db/members.json', (err, data) => {
				if (err) throw err;
				var json = JSON.parse(data);
				json.members.push(newMember);
				var members = { members: json.members };
				fs.writeFile(
					'db/members.json',
					JSON.stringify(members, null, 2),
					(err) => {
						if (err) throw err;
						console.log(`${newMember.name} has been added to Summoning Stone!`);
					}
				);
			});
			var filtered = pendingMembers.filter(function (mem) {
				return mem.id !== newMember.id;
			});
			var newPending = { newMembers: filtered };
			fs.writeFile(
				'db/pending-members.json',
				JSON.stringify(newPending, null, 2),
				(err) => {
					if (err) throw err;
				}
			);
		}
	},
};
