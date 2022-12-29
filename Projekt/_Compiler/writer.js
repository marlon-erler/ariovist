import Fs from 'fs/promises';

export let config = {
    dist_path: '../Dist/index.html',
}

export async function write(html) {
    await Fs.writeFile(config.dist_path, html);
    return 0;
}