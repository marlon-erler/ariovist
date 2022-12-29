let details = document.querySelector('#details');

//DETAILS
function hideDetails() {
    details.style.display = 'none';
}

function showDetails(id) {
    details.style.display = 'flex';

    document.querySelectorAll('#details > div[id]').forEach(x => x.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
}

//CHAPTERS
let select = document.querySelector('select');
function nav() {
    document.querySelectorAll('div.pin').forEach(x => x.style.display = 'none');
    document.querySelectorAll(`div.pin[chapter="${select.value}"]`).forEach(x => x.style.display = 'flex');
}

function navBack() {
    if (select.selectedIndex <= 0) return;
    select.selectedIndex--;
    nav();
}

function navFwd() {
    if (select.selectedIndex >= select.options.length - 1) return;
    select.selectedIndex++;
    nav();
}

nav();