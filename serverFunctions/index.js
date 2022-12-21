const db = require('./firebase').db;

async function main() {
	const collection = db.collection('users');
	const snapshot = await collection.get();
	snapshot.forEach(doc => {
		let data = doc.data().data
		let id = doc.id;
		for (let i = 0; i < data.length; i++) {
			if (!data[i].lastAttempted) {
				data[i].lastAttempted = null
			}
		}
		console.log(data);
		db.collection('users').doc(id).set({data});
	});
}

main();