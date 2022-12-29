import Fs from 'fs/promises';

export let config = {
	data_path: '../Data/data.json',
}

export async function read() {
	let str = await Fs.readFile(config.data_path, {encoding: 'utf8'});
	
	try {
		let obj = JSON.parse(str);
		return obj;
	} catch {
		console.error('failed to parse file')
		process.exit();
	}
}
