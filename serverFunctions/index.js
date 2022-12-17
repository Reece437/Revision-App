const db = require('./firebase').db;

async function main() {
	const collection = db.collection('users');
	const snapshot = await collection.get();
	snapshot.forEach(doc => {
		let data = doc.data().data
		let id = doc.id;
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[i].card.length; j++) {
				if (!data[i].card[j].isCorrect) {
					data[i].card[j].isCorrect = null;
				}
			}
		}
		console.log(data);
		db.collection('users').doc(id).set({data});
	});
}

main();