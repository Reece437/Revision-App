// Stops cards from appearing with no title or description
export const removeUntitled = (data: object[]): object[] => {
	try {
		for (let i = 0; i < data.length; i++) {
			if (data[i].title == '') {
				data[i].title = "Untitled";
			}
			if (data[i].description == '') {
				data[i].description = "You didn't give me a description";
			}
		} return data;
	} catch(err) {
		return data;
	}
}

/*
* Checks if cards are mergable
* by checking if they have atleast one card with both
* a question and an answer
*/
export const isMergable = (data, index: number): boolean => {
	for (let i = 0; i < data[index].card.length; i++) {
		if (data[index].card[i].question != '' ||
		data[index].card[i].answer != '') return true;
	} return false;
}

// Stops title from appearing inside buttons
export const titleLengthFix = (data) => {
	/*for (let i = 0; i < data.length; i++) {
		for (let j = 12; j < data[i].title.length; j += 13) {
			if (data[i].title.length > j + 1) {
				data[i].title = data[i].title.slice(0, j) + '\n' + data[i].title.slice(j);
				j += 2
			}
		}
	}*/ return data;
}

// Stops card sets from having the same title 
export const duplicateCheck = (data: object[]): object[] => {
	let n: number = 1;
	data = removeUntitled(data);
	try {
		for (let i = 0; i < data.length; i++) {
			n = 1
			if (data[i].title == '') data[i].title = 'Untitled';
			for (let j = i + 1; j < data.length; j++) {
				if (data[i].title == data[j].title) {
					data[j].title += ` [${n}]`;
					n++
				}
			}
		}
	} catch(err) {
		return data;
	}
	return data;
}
	