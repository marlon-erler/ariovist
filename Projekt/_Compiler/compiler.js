import Fs from 'fs/promises';
import Crypto from 'crypto';

export function UUID() {
	return Crypto.randomUUID().replace(/\-/g, '_');
}

export async function compile(data) {
	let styles = await getStyles();
	let scripts = await getScripts();

	let [pins, details, options] = parseData(data);

	let code = assemble(styles, scripts, pins, details, options);
	return code;
}

export async function getDependencies(dirname, convertToTag) {
	let filenames = await Fs.readdir(`../${dirname}`);
	let tags = filenames.map(convertToTag);
	return tags;
}

export async function getStyles() {
	return getDependencies('Css', x => `<link rel='stylesheet' href='../Css/${x}'>`);
}

export async function getScripts() {
	return getDependencies('Scripts', x => `<script src='../Scripts/${x}' defer></script>`)
}

export function parseData(data) {
	let response = [[], [], []];

	function add(index, item) {
		response[index].splice(response[index].length, 0, item);
	}

	for (let chapter of data) {
		let chapter_id = UUID();

		let option = `<option value='${chapter_id}'>${chapter.title}</option>`;
		add(2, option);

		for (let point of chapter.points) {
			let point_id = UUID();
			let [top, left] = point.coordinates;

			let pin = `<div class='pin' style='top: ${top}%; left: ${left}%' chapter='${chapter_id}' point='${point_id}' onclick="showDetails('${point_id}')"></div>`;
			add(0, pin);

			let details = `
				<div id='${point_id}'>
					${getDetailsString(point.contents)}
				</div>`;
			add(1, details);
		}
	}

	return response;
}

export function getDetailHeader(item) {
	switch (item.type) {
		case 'person': {
			return `
				<div class='person-header'>
					<img src='../Images/Avatars/${item.image}'>
					<div>
						<h2>${item.name}</h2>
						<p>${item.description}</p>
					</div>
				</div>
				<hr>`;
		}
		default: {
			return `
				<h2>${item.title}</h2>`;
		}
	}
}

export function getDetailsString(contents) {
	let response = '';
	for (let item of contents) {
		response += `
		<div>
			${getDetailHeader(item)}
			<p>${item.body}</p>
		</div>`
	}
	return response;
}

export function assemble(styles, scripts, pins, details, options) {
	return `
<html>
	<head>
		<title>Ariovist</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">

		${styles.join('\n')}
		${scripts.join('\n')}
	</head>

	<body>
		<div id="header">
			<div class="button-group">
				<button id="zoom-out-btn" onclick="zoom(zoom_level * 0.75)">
					<img class="icon" src="../Images/Icons/remove-circle-outline.svg">
				</button>
				<button id="zoom-in-btn" onclick="zoom(zoom_level * 1.25)">
					<img class="icon" src="../Images/Icons/add-circle-outline.svg">
				</button>
			</div>
		</div>
		<div id="map">
			<div id="map-container">
				<img src="../Images/Map/map-xs.jpg">
				<img src="../Images/Map/map-sm.jpg">
				<img src="../Images/Map/map-md.jpg">

				${pins.join('\n')}
			</div>
		</div>
		<div id="details">
			<button id="close-btn" onclick="hideDetails()">
				<img class="icon" src="../Images/Icons/close-outline.svg">
			</button>

			${details.join('\n')}
		</div>
		<div id="navigation">
			<button onclick="navBack()">
				<img class="icon" src="../Images/Icons/chevron-back-outline.svg">
			</button>
			<div class="select-container">
				<select id='select' onchange="nav()">
					${options.join('\n')}
				</select>
				<div class="arrow"></div>
			</div>
			<button onclick="navFwd()">
				<img class="icon" src="../Images/Icons/chevron-forward-outline.svg">
			</button>
		</div>
	</body>
</html>`
}
