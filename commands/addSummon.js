const fs = require('fs');
module.exports = {
	name: 'addSummon',
	description: 'Adds the approved member to the Summoning Stone',
	execute(args) {
		delete require.cache[require.resolve('../pending-members.json')];
		const pending = require('../pending-members.json');
		const pendingMembers = pending.newMembers;
		const newMember = pendingMembers.find(({ id }) => id === args.toString());
		if (newMember) {
			delete newMember.id;

			fs.readFile('./members.json', (err, data) => {
				if (err) throw err;
				var json = JSON.parse(data);
				json.members.push(newMember);
				var members = { members: json.members };
				fs.writeFile(
					'members.json',
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
				'pending-members.json',
				JSON.stringify(newPending, null, 2),
				(err) => {
					if (err) throw err;
				}
			);
		}
	},
};
