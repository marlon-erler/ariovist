//DATA
let map = document.querySelector('#map');
let map_body = document.querySelector('#map-container');
let map_size = [map.offsetWidth, map.offsetHeight];
let scroll_size = [map.scrollWidth, map.scrollHeight];

//INIT
map.scrollLeft = scroll_size[0] / 4;
map.scrollTop = scroll_size[1] / 4;

//DRAGGING
let dragging = false;
let start_coordinates = [0, 0];
let start_scroll = [];

function getCoordinates(e, point) {
    point[0] = e.clientX || e.touches[0].clientX;
    point[1] = e.clientY || e.touches[0].clientY;
}
function getScroll() {
	start_scroll[0] = map.scrollLeft;
	start_scroll[1] = map.scrollTop;
}

function dragStart(e) {
    dragging = true;
	getScroll();
    getCoordinates(e, start_coordinates);
}

function dragEnd() {
    dragging = false;
}

function dragMove(e) {
    if (dragging == false) return;

    let current_coordinates = [0, 0];
    getCoordinates(e, current_coordinates);

    let difference = current_coordinates.map((x, i) => x - start_coordinates[i]);
	let new_scroll = difference.map((x, i) => start_scroll[i] - x);

	map.scrollLeft = new_scroll[0];
	map.scrollTop = new_scroll[1];
}

map.addEventListener('mousedown', dragStart);
document.body.addEventListener('mouseup', dragEnd);
document.body.addEventListener('mousemove', dragMove);

//ZOOMING
let zoom_level = 1;

function zoom(inc) {
    if (inc <= 0.25) return;
    zoom_level = inc;

    map_body.style.transform = `scale(${zoom_level})`;
}

document.querySelector('#zoom-in-btn').addEventListener('click', () => zoom(zoom_level * 1.5));
document.querySelector('#zoom-out-btn').addEventListener('click', () => zoom(zoom_level * 0.5));

//PINS
function locatePin(e) {
    let coordinates = [0, 0];
    getCoordinates(e, coordinates);

    let rect = map_body.getBoundingClientRect();
    let offset = [rect.left, rect.top];
    let size = [rect.width, rect.height];
    
    let difference = coordinates.map((x, i) => x - offset[i]);
    let relative_difference = difference.map((x, i) => x / size[i] * 100);
    console.log(relative_difference);
}

map_body.addEventListener('click', locatePin);