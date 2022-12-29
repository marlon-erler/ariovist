import * as Reader from './reader.js';
import * as Writer from './writer.js';
import * as Compiler from './compiler.js';

async function main() {
	//read data file
	let data = await Reader.read();
	//compile
	let html = await Compiler.compile(data);
	//write
	let result = await Writer.write(html);
	console.log(result);
}

main();
